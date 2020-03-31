import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MainMarketplaceTask} from '../../utils/interfaces/main-marketplace/main-marketplace-task';
import {MarketplaceService} from '../../utils/services/marketplace.service';
import {IonRouterOutlet, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {RequestPage} from '../request/request.page';
import {Role, StorageKeys} from '../../providers/constants';
import {Storage} from '@ionic/storage';
import {PusherServiceProvider} from '../../providers/pusher.service';
import {AuthService} from '../../utils/services/auth.service';
import {Router} from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {CustomerTutorialPage} from '../customer-tutorial/customer-tutorial.page';

@Component({
  selector: 'marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
  providers: [IonRouterOutlet]
})
export class MarketplacePage implements OnInit, OnDestroy {

  marketplaceTasks: MainMarketplaceTask[];
  segment = 'all';
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
              private router: Router,
              private toastController: ToastController,
              private geolocation: Geolocation,
              private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.segmentChanged();
    this.storage.get(StorageKeys.PROFILE)
      .then(prof => this.userRole = prof.user.role);
  }

  ngOnDestroy(): void {}


  getAllMarketplaceRequests(coords?: any) {
    this.marketplaceService.getMainMarketplaceRequests('all', coords)
      .then(tasks => {
        this.marketplaceTasks = tasks;
        const channel = this.pusher.marketplace();
        channel.bind('new-request', data => {
          this.marketplaceTasks.push(data.marketplace);
        });
        this.changeRef.detectChanges();
      }).catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken().then(res => {
            if (!res.response) {
              this.presentToast('You have been logged out.');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          });
        }
      });
  }

  async presentToast(message) {
    await this.toastController.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
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
              this.presentToast('You have been logged out.');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          });
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
              this.presentToast('You have been logged out.');
              this.storage.remove(StorageKeys.PROFILE);
              this.storage.remove(StorageKeys.ACCESS_TOKEN);
              this.navCtrl.navigateRoot('/welcome');
            }
          });
        }
      });
  }

  segmentChanged() {
    switch (this.segment) {
      case 'all':
        this.segment = 'all';
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
          this.openCustomerTutorial();
        } else {
          const requestPageModal = await this.modalCtrl.create({
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

          await requestPageModal.present()
            .then(() => {

              return loadingRequestPage.dismiss();
            });
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
