import { Component, OnInit } from '@angular/core';
import {City} from '../../utils/interfaces/locations/city';
import {PreferencesService} from '../../utils/services/preferences.service';
import {FavrDataService} from '../../utils/services/favr-data.service';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'select-city',
  templateUrl: './select-city.page.html',
  styleUrls: ['./select-city.page.scss'],
})
export class SelectCityPage implements OnInit {

  cities: City[];
  current;
  constructor(private preferencesService: PreferencesService,
              private utils: UtilsService,
              private favrService: FavrDataService) { }

  ngOnInit() {
    this.getCurrentCity();
    this.favrService.getCities().then(res => {
      this.cities = res.cities;
    });
  }

  selectCity(city: City) {
    this.preferencesService.selectCity(city.id).then(res => {
      this.current = city.id;
      this.utils.presentToast(res.message, 'success');
    });
  }

  getCurrentCity() {
    this.preferencesService.currentCity().then(res => {
      this.current = res.id;
    });
  }
}
