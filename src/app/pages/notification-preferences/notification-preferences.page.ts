import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';

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

  constructor(private preferences: PreferencesService, private toastController: ToastController) { }

  ngOnInit() {
    this.preferences.getSettings().then(res => {
      this.notificationPreferences.sms = res.settings.sms_notifications;
      this.notificationPreferences.email = res.settings.email_notifications;
      this.notificationPreferences.push = res.settings.push_notifications;
    });
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

  updateSettings(type) {
    switch (type) {
      case 'email':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.email).then(res => {
          this.presentToast(res.message);
        });
        break;
      case 'sms':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.sms).then(res => {
          this.presentToast(res.message);
        });
        break;
      case 'push':
        this.preferences.updateNotificationPreferences(this.notificationPreferences.push).then(res => {
          this.presentToast(res.message);
        });
        break;
    }
  }
}
