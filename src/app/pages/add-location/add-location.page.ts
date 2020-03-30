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

  constructor(private preferences: PreferencesService, private location: Location, private toastController: ToastController) { }

  ngOnInit() {  }

  submitForm() {
    const body = {
      street: this.street,
      city: this.city,
      state: this.state,
      zip: this.zip,
    };
    this.preferences.addLocation(body).then(res => this.presentToast(res.message))
      .catch(error => this.presentToast(error.statusText));
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
}
