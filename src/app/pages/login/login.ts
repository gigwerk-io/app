import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {UserOptions} from '../../utils/interfaces/user-options';
import {AuthService} from '../../utils/services/auth.service';
import {NavController, Platform, ToastController} from '@ionic/angular';
import {NotificationService} from '../../utils/services/notification.service';
import {Router} from '@angular/router';
import {Badge} from '@ionic-native/badge/ngx';
import {
  Plugins,
  Capacitor
} from '@capacitor/core';
import {SwPush} from '@angular/service-worker';
import {environment} from '../../../environments/environment';

const {PushNotifications, Device} = Plugins;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = {
    username: undefined,
    password: undefined
  };
  submitted = false;
  pushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private notificationService: NotificationService,
    private platform: Platform,
    private toastController: ToastController,
    private router: Router,
    private badge: Badge,
    private swPush: SwPush
  ) {
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.login(this.login)
        .then(() => {
          this.navCtrl.navigateRoot('/app/tabs/marketplace').then(res => {
            // to check if we have permission
            try {
              this.initPushNotification();
            } catch (e) {
              console.warn(e);
            }
          });
        }, error => {
          this.presentToast(error.error.message);
        });
    }
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

  initPushNotification() {
    if (this.pushNotificationsAvailable) {
      PushNotifications.requestPermission().then(res => {
        if (res.granted) {
          PushNotifications.addListener('registration', token => {
            console.log('Token:' + token);
            console.log(this.platform);
            Device.getInfo().then(info => {
              if (info.operatingSystem === 'ios') {
                this.notificationService.saveAPNToken({device_token: token.value});
              } else {
                this.notificationService.saveFCMToken({device_token: token.value});
              }
            });
          });

          PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log(notification);
          });
        }
      });
    } else {
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicKey
      }).then(token => {
        console.log(token);
        this.notificationService.saveFCMToken({device_token: token});
      }).catch(err => console.error('Could not register notifications', err));

    }
  }
}
