import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MainMarketplaceRouteResponse, MainMarketplaceTask} from '../../utils/interfaces/main-marketplace/main-marketplace-task';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {IonContent, IonRouterOutlet, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {RequestPage} from '../request/request.page';
import {Role, StorageKeys} from '../../providers/constants';
import {Storage} from '@ionic/storage';
import {PusherServiceProvider} from '../../providers/pusher.service';
import {AuthService} from '../../utils/services/auth.service';
import {Router} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {CustomerTutorialPage} from '../customer-tutorial/customer-tutorial.page';
import {Events} from '../../utils/services/events';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
  providers: [IonRouterOutlet]
})
export class MarketplacePage implements OnInit, OnDestroy {

  @ViewChild('ionContent', {static: false}) ionContent: IonContent;
  marketplaceTasks: MainMarketplaceTask[];
  segment: string;
  userRole: string;
  Role = Role;
  private callback = (res: MainMarketplaceRouteResponse) => {
    this.marketplaceTasks = res.data;
  }

  constructor(
    private marketplaceService: MarketplaceService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private changeRef: ChangeDetectorRef,
    private storage: Storage,
    private pusher: PusherServiceProvider,
    private authService: AuthService,
    private navCtrl: NavController,
    private events: Events,
    private router: Router,
    private utils: UtilsService,
    private geolocation: Geolocation,
    public routerOutlet: IonRouterOutlet
  ) {
  }

  ngOnInit() {
    this.events.subscribe('scroll-top-marketplace', () => this.ionContent.scrollToTop(500));
    this.storage.get(StorageKeys.PROFILE)
      .then(prof => {
        this.userRole = prof.user.role;
        switch (this.userRole) {
          case Role.VERIFIED_FREELANCER:
            this.segment = 'jobs';
            break;
          case Role.CUSTOMER:
            this.segment = 'me';
            break;
          default:
            this.segment = 'all';
            break;
        }
        this.segmentChanged();
      });
    this.pusher.listenToMarketplaceFeed().then(marketplaceChannel => {
      console.log(marketplaceChannel);
      marketplaceChannel.bind('new-request', data => {
        console.log(data);
        if (this.segment === 'all') {
          // Push new job to feed
          this.marketplaceTasks.push(data.marketplace);
          // Remove duplicate jobs from the feed.
          const seen = new Set();
          this.marketplaceTasks = this.marketplaceTasks.filter(marketplace => {
            const duplicate = seen.has(marketplace.id);
            seen.add(marketplace.id);
            return !duplicate;
          });
        }
      });
    });
    this.changeRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('scroll-top-marketplace');
  }


  getAllMarketplaceRequests(coords?: any, callback?: (...args) => any) {
    this.marketplaceService.getMainMarketplaceRequests('all', coords, callback);
  }

  getMyMarketplaceRequests(callback?: (...args) => any) {
    this.marketplaceService.getMainMarketplaceRequests('me', {}, callback);
  }

  getMyJobs(callback?: (...args) => any) {
    this.marketplaceService.getMainMarketplaceRequests('proposals', {}, callback);
  }

  segmentChanged() {
    switch (this.segment) {
      case 'all':
        this.segment = 'all';
        this.geolocation.getCurrentPosition().then(res => {
          const coords = {lat: res.coords.latitude, long: res.coords.longitude};
          // Get job details with location
          this.getAllMarketplaceRequests(coords, this.callback);
        }).catch(err => {
          // Get job details without location
          this.getAllMarketplaceRequests(this.callback);
        });
        break;
      case 'me':
        this.segment = 'me';
        this.getMyMarketplaceRequests(this.callback);
        break;
      case 'jobs':
        this.segment = 'jobs';
        this.getMyJobs(this.callback);
        break;
    }
  }

  async openCustomerTutorial() {
    const modal = await this.modalCtrl.create({
      component: CustomerTutorialPage,
      componentProps: {isModal: true}
    });

    const loadingRequestPage = await this.loadingCtrl.create({
      message: 'Please wait...',
      translucent: true
    });

    await loadingRequestPage.present();

    await modal.present()
      .then(() => {

        return loadingRequestPage.dismiss();
      });
  }

  async doRefresh(event?) {
    setTimeout(() => {
      switch (this.segment) {
        case 'all':
          this.geolocation.getCurrentPosition().then(res => {
            const coords = {lat: res.coords.latitude, long: res.coords.longitude};
            // GEt job details with location
            this.getAllMarketplaceRequests(coords, this.callback);
          }).catch(err => {
            // Get job details without location
            this.getAllMarketplaceRequests(this.callback);
          });
          break;
        case 'me':
          this.getMyMarketplaceRequests(this.callback);
          break;
        case 'jobs':
          this.getMyJobs(this.callback);
          break;
      }

      if (event) {
        if (event.target) {
          event.target.complete();
        }
      }
    }, 1000);
  }
}
