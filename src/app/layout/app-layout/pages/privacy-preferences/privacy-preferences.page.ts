import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../../../utils/services/utils.service';
import { Response } from '../../../../utils/interfaces/response';
import { Settings } from '../../../../utils/interfaces/settings/preferences';


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

  constructor(private preferences: PreferencesService, private utils: UtilsService) { }

  ngOnInit() {
    this.preferences.getSettings().then((res: Response<Settings>) => {
      this.scope = res.data.scope;
      this.displayDescription = res.data.display_description;
      this.displayRating = res.data.display_rating;
      this.displayReceipts = res.data.display_receipts;
    });
  }

  updateSettings(type) {
    switch (type) {
      case 'description':
        const description = {display_description: !this.displayDescription};
        this.preferences.updatePrivacyPreferences(description)
          .then(res => this.utils.presentToast('<b>Success!</b> Your description preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
      case 'rating':
        const rating = {display_rating: !this.displayRating};
        this.preferences.updatePrivacyPreferences(rating)
          .then(res => this.utils.presentToast('<b>Success!</b> Your rating preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
      case 'receipts':
        const receipts = {display_receipts: !this.displayReceipts};
        this.preferences.updatePrivacyPreferences(receipts)
          .then(res => this.utils.presentToast('<b>Success!</b> Your display receipts preference was updated.', 'success'))
          .catch(error => this.utils.presentToast(error.message, 'danger'));
        break;
    }
  }

  scopeChange(val) {
    if (this.scope !== val) {
      const scope = {scope: val};
      this.preferences.updatePrivacyPreferences(scope)
        .then(res => this.utils.presentToast('<b>Success!</b> Your scope preference was updated.', 'success'))
        .catch(error => this.utils.presentToast(error.message, 'danger'));
    }
  }

}
