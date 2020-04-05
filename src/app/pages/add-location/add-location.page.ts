import { Component, OnInit } from '@angular/core';
import {PreferencesService} from '../../utils/services/preferences.service';
import {Location} from '@angular/common';
import {ToastController} from '@ionic/angular';

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

  constructor(private preferences: PreferencesService, private location: Location, private toastCtrl: ToastController) { }

  ngOnInit() {  }

  submitForm() {
    const body = {
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
    this.preferences.addLocation(body).then(res => this.presentToast(res.message))
      .catch(error => this.errorMessage(error.message));
  }

  async errorMessage(message) {
    await this.toastCtrl.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'danger',
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

  async presentToast(message) {
    await this.toastCtrl.create({
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
}
