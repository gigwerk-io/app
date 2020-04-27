import {ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {NotificationService} from '../../utils/services/notification.service';
import {Notification} from '../../utils/interfaces/notification/notification';
import {Router} from '@angular/router';
import {AuthService} from '../../utils/services/auth.service';
import {IonRouterOutlet, NavController, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Badge} from '@ionic-native/badge/ngx';
import {StorageKeys} from '../../providers/constants';
import {UtilsService} from '../../utils/services/utils.service';
import { Response } from '../../utils/interfaces/response';
import {Events} from '../../utils/services/events';

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
              public routerOutlet: IonRouterOutlet,
              private events: Events) { }

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
      .then((res: Response<Notification[]>) => {
        this.notifications = res.data;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken();
        }
    });
  }

  getAllNotifications() {
    this.notificationService.getAllNotifications()
      .then((res: Response<Notification[]>) => {
        this.notifications = res.data;
        this.changeRef.detectChanges();
      })
      .catch(error => {
        if (error.status === 401) {
          this.authService.isValidToken();
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
    this.router.navigate([notification.data.page, notification.data.params]);
    this.notifications.splice(index, 1);
    this.notificationService.markNotificationAsRead(notification.id).then(() => {
      this.events.publish('updateNotificationBadge');
    });
  }
}
