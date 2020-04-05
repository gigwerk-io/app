import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';


@Component({
  selector: 'privacy-preferences',
  templateUrl: './privacy-preferences.page.html',
  styleUrls: ['./privacy-preferences.page.scss'],
})
export class PrivacyPreferencesPage implements OnInit {
  scope;
  displayDescription;
  displayRating;
  displayReceipts;
  constructor(private preferences: PreferencesService, private toastController: ToastController) { }

  ngOnInit() {
    this.preferences.getSettings().then(res => {
      this.scope = res.settings.scope;
      this.displayDescription = res.settings.display_description;
      this.displayRating = res.settings.display_rating;
      this.displayReceipts = res.settings.display_receipts;
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
      case 'description':
        const description = {display_description: !this.displayDescription};
        this.preferences.updatePrivacyPreferences(description).then(res => {
          this.presentToast(res.message);
        });
        break;
      case 'rating':
        const rating = {display_rating: !this.displayRating};
        this.preferences.updatePrivacyPreferences(rating).then(res => {
          this.presentToast(res.message);
        });
        break;
      case 'receipts':
        const receipts = {display_receipts: !this.displayReceipts};
        this.preferences.updatePrivacyPreferences(receipts).then(res => {
          this.presentToast(res.message);
        });
        break;
    }
  }

  scopeChange(val) {
    if (this.scope !== val) {
      const scope = {scope: val};
      this.preferences.updatePrivacyPreferences(scope).then(res => {
        this.presentToast(res.message);
      });
    }
  }

}
