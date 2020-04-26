import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';

import {UserOptions} from '../../utils/interfaces/user-options';
import {AuthService} from '../../utils/services/auth.service';
import {NavController, Platform} from '@ionic/angular';
import {NotificationService} from '../../utils/services/notification.service';
import {Router} from '@angular/router';
import {Badge} from '@ionic-native/badge/ngx';
import {SwPush} from '@angular/service-worker';
import {UtilsService} from '../../utils/services/utils.service';
import {PushNotificationService} from '../../utils/services/push-notification.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.page.scss'],
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
    private notificationService: NotificationService,
    private platform: Platform,
    private utils: UtilsService,
    private router: Router,
    private badge: Badge,
    private swPush: SwPush,
    private pushNotificationService: PushNotificationService
  ) {
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.authService.login(this.login)
        .then(res => {
          if (res.success) {
            this.pushNotificationService.registerPushNotifications();
            this.navCtrl.navigateRoot('/app/tabs/marketplace');
          }
        });
    }
  }
}
