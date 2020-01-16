import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NotificationService} from '../../utils/services/notification.service';
import {Notification} from '../../utils/interfaces/notification/notification';
import {Router} from '@angular/router';
import {AuthService} from '../../utils/services/auth.service';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Badge} from '@ionic-native/badge/ngx';
import {StorageKeys} from '../../providers/constants';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: Notification[];
  clickType = 'unread';
  notificationClass = '';
  readable = true;
  constructor(private notificationService: NotificationService,
              private router: Router,
              private changeRef: ChangeDetectorRef,
              private authService: AuthService,
              private storage: Storage,
              public toastController: ToastController,
              private platform: Platform,
              private badge: Badge,
              private navCtrl: NavController) { }

  ngOnInit() {
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
    this.notificationService.getNewNotifications().subscribe(res => {
      this.notifications = res.notifications;
      this.changeRef.detectChanges();
    }, error => {
      if (error.status === 401) {
        this.authService.isValidToken().subscribe(res => {
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

  getAllNotifications() {
    this.notificationService.getAllNotifications().subscribe(res => {
      this.notifications = res.notifications;
      this.changeRef.detectChanges();
    }, error => {
      if (error.status === 401) {
        this.authService.isValidToken().subscribe(res => {
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

  segmentChanged(event) {
    this.clickType = event.target.value;
    switch (event.target.value) {
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
    setTimeout(() => {
      this.notifications.splice(index, 1);
      this.notificationService.markNotificationAsRead(notification.id).subscribe();
    }, 1000);
  }

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }
}
