import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {UpdateResponse, Settings, MyLocationsResponse, CurrentCityResponse, LocationAddress} from '../interfaces/settings/preferences';
import {RESTService} from './rest.service';
import { Response } from '../interfaces/response';
import { City } from '../interfaces/locations/city';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public updateNotificationPreferences(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('notifications', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }


  public getSettings(): Promise<Response<Settings>> {
    return this.makeHttpRequest<Response<Settings>>('settings', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Settings>) => res));
  }

  public updatePrivacyPreferences(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('privacy', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public addLocation(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('locations', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getMyLocations(): Promise<Response<LocationAddress[]>> {
    return this.makeHttpRequest<Response<LocationAddress[]>>('locations', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<LocationAddress[]>) => res));
  }

  public makeDefaultLocation(id): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>(`location/${id}`, 'PUT', null)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public deleteLocation(id): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>(`location/${id}`, 'DELETE')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public updateProfile(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('profile', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public selectCity(id): Promise<Response<UpdateResponse>> {
    return this.makeHttpRequest<Response<UpdateResponse>>('select-city', 'POST', {city_id: id})
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public currentCity(): Promise<Response<City>> {
    return this.makeHttpRequest<Response<City>>('current-city', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
