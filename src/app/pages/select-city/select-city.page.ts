import { Component, OnInit } from '@angular/core';
import {City} from '../../utils/interfaces/locations/city';
import {PreferencesService} from '../../utils/services/preferences.service';
import {ToastController} from '@ionic/angular';
import {FavrDataService} from '../../utils/services/favr-data.service';

@Component({
  selector: 'select-city',
  templateUrl: './select-city.page.html',
  styleUrls: ['./select-city.page.scss'],
})
export class SelectCityPage implements OnInit {

  cities: City[];
  current;
  constructor(private preferencesService: PreferencesService,
              private toastController: ToastController,
              private favrService: FavrDataService) { }

  ngOnInit() {
    this.getCurrentCity();
    this.favrService.getCities().subscribe(res => {
      this.cities = res.cities;
    });
  }

  selectCity(city: City) {
    this.preferencesService.selectCity(city.id).subscribe(res => {
      this.current = city.id;
      this.presentToast(res.message);
    });
  }

  getCurrentCity() {
    this.preferencesService.currentCity().subscribe(res => {
      this.current = res.id;
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
}
