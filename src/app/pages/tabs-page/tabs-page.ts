import {Component, OnInit} from '@angular/core';
import {RequestPage} from '../request/request.page';
import {IonRouterOutlet, LoadingController, ModalController, NavController, ToastController} from '@ionic/angular';
import {NotificationService} from '../../utils/services/notification.service';
import {PusherServiceProvider} from '../../providers/pusher.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {Router} from '@angular/router';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {CustomerTutorialPage} from '../customer-tutorial/customer-tutorial.page';

@Component({
  templateUrl: './tabs-page.html',
  styleUrls: ['./tabs-page.scss']
})
export class TabsPage implements OnInit {

  tabSlot: string;
  notificationCount = 0;
  friendCount = 0;
  profileImage: string;
  profileId: number;

  constructor(private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private notificationService: NotificationService,
              private pusher: PusherServiceProvider,
              private navCtrl: NavController,
              private toastController: ToastController,
              private storage: Storage,
              private router: Router,
              public routerOutlet: IonRouterOutlet,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    if (window.innerWidth >= 1025) {
      this.tabSlot = 'top';
    } else {
      this.tabSlot = 'bottom';
    }
    this.getBadges();
  }

  ngOnInit(): void {
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        if (profile) {
          this.profileId = profile.user_id;
          this.profileImage = profile.image;
          this.angulartics2GoogleAnalytics.setUsername(profile.user.username);
          this.angulartics2GoogleAnalytics.startTracking();
        }
      });
  }

  getBadges() {
    setTimeout(() => {
      this.notificationService.getBadgeCount().then(res => {
        this.notificationCount = res.notifications;
        this.friendCount = res.friends;
        // Listen To Pusher User Channel
        this.storage.get(StorageKeys.PROFILE).then(profile => {
          const channel = this.pusher.user(profile.user.id);
          // Bind Notification Channel
          channel.bind('notification', data => {
            this.presentToast(data.message);
            this.notificationCount = data.badges.notifications;
            this.friendCount = data.badges.friends;
          });
          // Bind Badge Channel
          channel.bind('badges', data => {
            this.notificationCount = data.badges.notifications;
            this.friendCount = data.badges.friends;
          });
        });
      });
    }, 1000);
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

  async presentToast(message) {
    await this.toastController.create({
      message,
      position: 'top',
      duration: 4000,
      color: 'dark',
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.router.navigateByUrl('/app/tabs/notifications');
          }
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }

  navigateToProfile() {
    this.navCtrl.navigateForward(`/app/profile/${this.profileId}`);
  }
}
