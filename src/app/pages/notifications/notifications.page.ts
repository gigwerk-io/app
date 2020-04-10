import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NotificationService} from '../../utils/services/notification.service';
import {Notification} from '../../utils/interfaces/notification/notification';
import {Router} from '@angular/router';
import {AuthService} from '../../utils/services/auth.service';
import {IonRouterOutlet, NavController, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Badge} from '@ionic-native/badge/ngx';
import {StorageKeys} from '../../providers/constants';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  providers: [IonRouterOutlet]
})
export class NotificationsPage implements OnInit {

  notifications: Notification[];
  clickType = 'unread';
  notificationClass = '';
  readable = true;
  segment = 'unread';

  constructor(private notificationService: NotificationService,
              private router: Router,
              private changeRef: ChangeDetectorRef,
              private authService: AuthService,
              private storage: Storage,
              private platform: Platform,
              private badge: Badge,
              private navCtrl: NavController,
              private routerOutlet: IonRouterOutlet,
              private utils: UtilsService) { }

  ngOnInit() {
    this.segmentChanged();
    this.clearBadge();
  }

  clearBadge() {
    if (this.platform.is('cordova')) {
      this.badge.hasPermission().then(() => {
        this.badge.clear();
      });
    }
  }

  getNewNotifications() {
    this.notificationService.getNewNotifications()
      .then(res => {
        this.notifications = res.notifications;
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

  getAllNotifications() {
    this.notificationService.getAllNotifications()
      .then(res => {
        this.notifications = res.notifications;
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
    this.clickType = this.segment;
    switch (this.segment) {
      case 'unread':
        this.notificationClass = '';
        this.getNewNotifications();
        break;
      case 'all':
        this.notificationClass = 'read';
        this.readable = false;
        this.getAllNotifications();
        break;
      default:
        this.getNewNotifications();
    }
  }

  view(index, notification: Notification) {
    this.router.navigate([notification.action.page, notification.action.params]);
    this.notifications.splice(index, 1);
    this.notificationService.markNotificationAsRead(notification.id);
  }
}
