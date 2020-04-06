import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../utils/services/utils.service';

interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  push: boolean;
}

@Component({
  selector: 'notification-preferences',
  templateUrl: './notification-preferences.page.html',
  styleUrls: ['./notification-preferences.page.scss'],
})
export class NotificationPreferencesPage implements OnInit {

  notificationPreferences: NotificationPreferences = {
    sms: undefined,
    email: undefined,
    push: undefined
  };

  constructor(private preferences: PreferencesService, private utils: UtilsService) { }

  ngOnInit() {
    this.preferences.getSettings().then(res => {
      this.notificationPreferences.sms = res.settings.sms_notifications;
      this.notificationPreferences.email = res.settings.email_notifications;
      this.notificationPreferences.push = res.settings.push_notifications;
    });
  }

  updateSettings(type) {
    switch (type) {
      case 'email':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.email)
          .then(res => this.utils.presentToast('<b>Success!</b> Your email preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
      case 'sms':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.sms)
          .then(res => this.utils.presentToast('<b>Success!</b> Your sms preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
      case 'push':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.push)
          .then(res => this.utils.presentToast('<b>Success!</b> Your push preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
    }
  }
}
