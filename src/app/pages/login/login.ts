import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserOptions } from '../../utils/interfaces/user-options';
import {AuthService} from '../../utils/services/auth.service';
import {NavController, Platform, ToastController} from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import {NotificationService} from '../../utils/services/notification.service';
import {Router} from '@angular/router';
import {Badge} from '@ionic-native/badge/ngx';

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

  constructor(
    private authService: AuthService,
    public navCtrl: NavController,
    private push: Push,
    private notficationService: NotificationService,
    private platform: Platform,
    private toastController: ToastController,
    private router: Router,
    private badge: Badge
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.login(this.login)
        .subscribe(() => {
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
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    const options: PushOptions = {
      android: {
        sound: true
      },
      ios: {
        alert: true,
        badge: true,
        sound: true
      }
    };
    if (!(this.platform.is('pwa') && this.platform.is('ios'))) {
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('registration').subscribe((data: any) => {
        // console.log('Token: ' + data.registrationId);
        if (this.platform.is('ios')) {
          this.notficationService.saveAPNToken({'device_token': data.registrationId}).subscribe(res => {
            // console.log(res);
          });
        } else if (this.platform.is('android')) {
          this.notficationService.saveFCMToken({'device_token': data.registrationId}).subscribe(res => {
            // console.log(res);
          });
        }
      }, error1 => {
        // console.log(error1);
      });

      pushObject.on('notification').subscribe((data: any) => {
        // console.log(data);
        this.badge.increase(1);
        if (!data.additionalData.foreground) {
          if (data.custom !== undefined) {
            this.router.navigate(data.custom.action.page, data.custom.action.params);
          }
        }
      });

      pushObject.on('error').subscribe(error => console.warn(error));
    }
  }
}
