import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'notification-preferences',
  templateUrl: './notification-preferences.page.html',
  styleUrls: ['./notification-preferences.page.scss'],
})
export class NotificationPreferencesPage implements OnInit {

  sms_notifications;
  email_notifications;
  push_notifications;
  constructor(private preferences: PreferencesService, private toastController: ToastController) { }

  ngOnInit() {
    this.preferences.getSettings().subscribe(res => {
      this.sms_notifications = res.settings.sms_notifications;
      this.email_notifications = res.settings.email_notifications;
      this.push_notifications = res.settings.push_notifications;
    });
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

  updateSettings(type) {
    switch (type) {
      case 'email':
        const email = {email_notifications: !this.email_notifications};
        this.preferences.updateNotificationPreferences(email).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
      case 'sms':
        const sms = {sms_notifications: !this.sms_notifications};
        this.preferences.updateNotificationPreferences(sms).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
      case 'push':
        const push = {push_notifications: !this.push_notifications};
        this.preferences.updateNotificationPreferences(push).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
    }
  }
}
