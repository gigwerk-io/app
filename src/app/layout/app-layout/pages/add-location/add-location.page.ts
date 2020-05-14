import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../../../utils/services/preferences.service';
import {Location} from '@angular/common';
import {ToastController} from '@ionic/angular';
import {UtilsService} from '../../../../utils/services/utils.service';

@Component({
  selector: 'add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {
  street: string;
  city: string;
  state: string;
  zip: number;

  constructor(private preferences: PreferencesService, private location: Location, private utils: UtilsService) { }

  ngOnInit() {  }

  submitForm() {
    const body = {
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
    this.preferences.addLocation(body).then(res => this.utils.presentToast('<strong>Success!</strong> Location saved.', 'success'))
      .catch(error => this.utils.presentToast(error.message, 'danger'));
  }
}
