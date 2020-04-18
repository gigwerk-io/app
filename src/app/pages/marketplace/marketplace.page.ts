import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MainMarketplaceTask} from '../../utils/interfaces/main-marketplace/main-marketplace-task';
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

  constructor(private marketplaceService: MarketplaceService,
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
              public routerOutlet: IonRouterOutlet) {  }

  ngOnInit() {
    this.events.subscribe('scroll-top-marketplace', () => this.ionContent.scrollToTop(500));
    this.segmentChanged();
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
      });
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('scroll-top-marketplace');
  }


  getAllMarketplaceRequests(coords?: any) {
    this.marketplaceService.getMainMarketplaceRequests('all', coords)
      .then(tasks => {
        this.marketplaceTasks = tasks;
        const channel = this.pusher.marketplace();
        channel.bind('new-request', data => {
          // Push new job to feed
          this.marketplaceTasks.push(data.marketplace);
          // Remove duplicate jobs from the feed.
          const seen = new Set();
          this.marketplaceTasks = this.marketplaceTasks.filter(marketplace => {
            const duplicate = seen.has(marketplace.id);
            seen.add(marketplace.id);
            return !duplicate;
          });
        });
        this.changeRef.detectChanges();
      }).catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          }).catch(e => this.utils.presentToast(e.message, 'danger'));
        }
      });
  }

  getMyMarketplaceRequests() {
    this.marketplaceService.getMainMarketplaceRequests('me')
      .then(tasks => {
        this.marketplaceTasks = tasks;
        this.changeRef.detectChanges();
      }).catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          }).catch(e => this.utils.presentToast(e.message, 'danger'));
        }
      });
  }

  getMyJobs() {
    this.marketplaceService.getMainMarketplaceRequests('proposals')
      .then(tasks => {
        this.marketplaceTasks = tasks;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.utils.presentToast('You have been logged out.', 'success');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          }).catch(e => this.utils.presentToast(e.message, 'danger'));
        }
      });
  }

  segmentChanged() {
    switch (this.segment) {
      case 'all':
        this.segment = 'all';
        this.geolocation.getCurrentPosition().then(res => {
          const coords = {lat: res.coords.latitude, long: res.coords.longitude};
          // Get job details with location
          this.getAllMarketplaceRequests(coords);
        }).catch(err => {
          // Get job details without location
          this.getAllMarketplaceRequests();
        });
        break;
      case 'me':
        this.segment = 'me';
        this.getMyMarketplaceRequests();
        break;
      case 'jobs':
        this.segment = 'jobs';
        this.getMyJobs();
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

  async openRequestPage() {
    this.storage.get(StorageKeys.CUSTOMER_TUTORIAL).then(res => {
      setTimeout(async () => {
        if (!res) {
          const customerTutorialModal = await this.modalCtrl.create({
            component: CustomerTutorialPage,
            componentProps: {isModal: true}
          });

          const loadingCustomerTutorialPage = await this.loadingCtrl.create({
            message: 'Please wait...',
            translucent: true
          });

          await loadingCustomerTutorialPage.present();

          customerTutorialModal.onDidDismiss().then(async () => {
            const loadingMarketplacePage = await this.loadingCtrl.create({
              message: 'Please wait...',
              translucent: true
            });

            await loadingMarketplacePage.present();
            loadingMarketplacePage.dismiss();
          });

          await customerTutorialModal.present()
            .then(() => loadingCustomerTutorialPage.dismiss());

          await customerTutorialModal.onDidDismiss()
            .then(async () => {
              const taskRequestModal = await this.modalCtrl.create({
                component: RequestPage,
                componentProps: {isModal: true},
                swipeToClose: false,
                presentingElement: this.routerOutlet.nativeEl
              });

              const loadingRequestPage = await this.loadingCtrl.create({
                message: 'Please wait...',
                translucent: true
              });

              await loadingRequestPage.present();

              taskRequestModal.onDidDismiss().then(async () => {
                const loadingMarketplacePage = await this.loadingCtrl.create({
                  message: 'Please wait...',
                  translucent: true
                });

                await loadingMarketplacePage.present();

                // this.marketplaceService.getMainMarketplaceRequests('all')
                //   .then(tasks => this.marketplaceTasks = tasks);
                // this.marketplaceService.getMainMarketplaceRequests('me')
                //   .then(tasks => this.marketplaceTasks = tasks);
                loadingMarketplacePage.dismiss();
              });

              await taskRequestModal.present()
                .then(() => loadingRequestPage.dismiss());
            });
        } else {
          const taskRequestModal = await this.modalCtrl.create({
            component: RequestPage,
            componentProps: {isModal: true},
            swipeToClose: false,
            presentingElement: this.routerOutlet.nativeEl
          });

          const loadingRequestPage = await this.loadingCtrl.create({
            message: 'Please wait...',
            translucent: true
          });

          await loadingRequestPage.present();

          taskRequestModal.onDidDismiss().then(async () => {
            const loadingMarketplacePage = await this.loadingCtrl.create({
              message: 'Please wait...',
              translucent: true
            });

            await loadingMarketplacePage.present();

            // this.marketplaceService.getMainMarketplaceRequests('all')
            //   .then(tasks => this.marketplaceTasks = tasks);
            // this.marketplaceService.getMainMarketplaceRequests('me')
            //   .then(tasks => this.marketplaceTasks = tasks);
            loadingMarketplacePage.dismiss();
          });

          await taskRequestModal.present()
            .then(() => loadingRequestPage.dismiss());
        }
      }, 0);
    });
  }

  async doRefresh(event?) {
    setTimeout(() => {
      switch (this.segment) {
        case 'all':
          this.geolocation.getCurrentPosition().then(res => {
            const coords = {lat: res.coords.latitude, long: res.coords.longitude};
            // GEt job details with location
            this.getAllMarketplaceRequests(coords);
          }).catch(err => {
            // Get job details without location
            this.getAllMarketplaceRequests();
          });
          break;
        case 'me':
          this.getMyMarketplaceRequests();
          break;
        case 'jobs':
          this.getMyJobs();
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
