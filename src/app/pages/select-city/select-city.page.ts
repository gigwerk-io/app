import { Component, OnInit } from '@angular/core';
import {City} from '../../utils/interfaces/locations/city';
import {PreferencesService} from '../../utils/services/preferences.service';
import {FavrDataService} from '../../utils/services/favr-data.service';
import {UtilsService} from '../../utils/services/utils.service';
import { Response } from '../../utils/interfaces/response';
import { LocationAddress, UpdateResponse } from '../../utils/interfaces/settings/preferences';

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
    this.favrService.getCities().then((res: Response<City[]>) => {
      this.cities = res.data;
    });
  }

  selectCity(city: City) {
    this.preferencesService.selectCity(city.id).then((res: Response<UpdateResponse>) => {
      this.current = city.id;
      this.utils.presentToast(res.message, 'success');
    });
  }

  getCurrentCity() {
    this.preferencesService.currentCity().then((res: Response<City>) => {
      this.current = res.data.id;
    });
  }
}
