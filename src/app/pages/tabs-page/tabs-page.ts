import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IonRouterOutlet, LoadingController, ModalController, NavController} from '@ionic/angular';
import {NotificationService} from '../../utils/services/notification.service';
import {PusherServiceProvider} from '../../providers/pusher.service';
import {Storage} from '@ionic/storage';
import {StorageKeys} from '../../providers/constants';
import {Router} from '@angular/router';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {CustomerTutorialPage} from '../customer-tutorial/customer-tutorial.page';
import {Events} from '../../utils/services/events';
import {UtilsService} from '../../utils/services/utils.service';
import {RequestPage} from '../request/request.page';
import {PusherNotification} from '../../utils/interfaces/notification/PusherNotification';

@Component({
  templateUrl: './tabs-page.html',
  styleUrls: ['./tabs-page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  @Input() not: string;
  tabSlot: string;
  notificationCount = 0;
  friendCount = 0;
  profileImage: string;
  profileId: number;
  requestButtonIcon = 'assets/brand/favr_logo_white.png';

  constructor(private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private notificationService: NotificationService,
              private pusher: PusherServiceProvider,
              private navCtrl: NavController,
              private utils: UtilsService,
              private events: Events,
              private storage: Storage,
              private router: Router,
              public routerOutlet: IonRouterOutlet,
              private changeDetectorRef: ChangeDetectorRef,
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    if (window.innerWidth >= 1025) {
      this.tabSlot = 'top';
    } else {
      this.tabSlot = 'bottom';
    }
    this.events.subscribe('prefersDark', (prefDark: boolean) => {
      if (prefDark) {
        this.requestButtonIcon = 'assets/brand/favr_logo_blk.png';
      } else {
        this.requestButtonIcon = 'assets/brand/favr_logo_white.png';
      }
    });
  }

  ngOnInit(): void {
    this.storage.get(StorageKeys.THEME_PREFERENCE)
      .then(prefDark => {
        if (prefDark) {
          this.requestButtonIcon = 'assets/brand/favr_logo_blk.png';
        }
      });
    this.storage.get(StorageKeys.PROFILE)
      .then(profile => {
        if (profile !== null) {
          this.getBadges();
          this.profileId = profile.user_id;
          this.pusher.listenToUserNotifications(this.profileId).then(notificationChannel => {
            notificationChannel.bind_global((eventName, data: PusherNotification) => {
              if (data.message != null && data.title != null) {
                this.utils.presentToast(data.message, 'dark', 'top', 3000, [{
                  text: 'View',
                  handler: () => {
                    // mark as read if clicked
                    this.router.navigate([data.page, data.params]).then(res => {
                      if (res) {
                        this.notificationService.markNotificationAsRead(data.id).then(() => {
                          this.getBadges();
                        });
                      }
                    });
                  }
                }]).then(() => {
                  this.getBadges();
                });
              }
            });
          });
          this.profileImage = profile.image;
          this.angulartics2GoogleAnalytics.setUsername(profile.user.username);
          this.angulartics2GoogleAnalytics.startTracking();
        }
      });
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('prefersDark');
  }

  getBadges() {
    this.notificationService.getBadgeCount().then(res => {
      this.notificationCount = res.data.notifications;
      this.friendCount = res.data.friends;
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

          await taskRequestModal.present();
        }
      }, 0);
    });
  }

  navigateToProfile() {
    this.navCtrl.navigateForward(`/app/profile/${this.profileId}`);
  }

  scrollToTop() {
    this.events.publish('scroll-top-marketplace', true);
  }
}
