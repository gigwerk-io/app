import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {
  Plugins,
  Capacitor, PushNotificationToken, PushNotification, PushNotificationActionPerformed
} from '@capacitor/core';
import {NotificationService} from './notification.service';
import {UtilsService} from './utils.service';
import {Router} from '@angular/router';
import {PusherNotification} from '../interfaces/notification/PusherNotification';

const {PushNotifications, Device} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  pushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

  constructor(private notificationService: NotificationService, private router: Router) {
  }

  registerPushNotifications() {
    if (this.pushNotificationsAvailable) {
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermission().then(result => {
        if (result.granted) {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      PushNotifications.addListener('registration',
        (token: PushNotificationToken) => {
          Device.getInfo().then(info => {

            if (info.operatingSystem === 'ios') {
              this.notificationService.saveAPNToken({device_token: token.value});
            } else if (info.operatingSystem === 'android') {
              this.notificationService.saveFCMToken({device_token: token.value});
            }
          });
        }
      );

      PushNotifications.addListener('registrationError',
        (error: any) => {
          // Should log error.
          console.log('Error on registration: ' + JSON.stringify(error));
        }
      );

      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          // Already uses pusher broadcasting.
        }
      );

      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: PushNotificationActionPerformed) => {
          // redirect to notification action
          this.router.navigate([notification.notification.data.page, notification.notification.data.params]);
        }
      );
    }
  }
}
