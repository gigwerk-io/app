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
  display_description;
  display_rating;
  display_receipts;
  constructor(private preferences: PreferencesService, private toastController: ToastController) { }

  ngOnInit() {
    this.preferences.getSettings().subscribe(res => {
      this.scope = res.settings.scope;
      this.display_description = res.settings.display_description;
      this.display_rating = res.settings.display_rating;
      this.display_receipts = res.settings.display_receipts;
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
      case 'description':
        const description = {display_description: !this.display_description};
        this.preferences.updatePrivacyPreferences(description).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
      case 'rating':
        const rating = {display_rating: !this.display_rating};
        this.preferences.updatePrivacyPreferences(rating).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
      case 'receipts':
        const receipts = {display_receipts: !this.display_receipts};
        this.preferences.updatePrivacyPreferences(receipts).subscribe(res => {
          this.presentToast(res.message);
        });
        break;
    }
  }

  scopeChange(val) {
    if (this.scope !== val) {
      const scope = {scope: val};
      this.preferences.updatePrivacyPreferences(scope).subscribe(res => {
        this.presentToast(res.message);
      });
    }
  }

}
