import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {from} from 'rxjs';
import {UpdateResponse, Settings, MyLocationsResponse, CurrentCityResponse} from '../interfaces/settings/preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }

  public updateNotificationPreferences(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/notifications`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public getSettings() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<Settings>(`${API_ADDRESS}/settings`, authHeader)
            .toPromise()
            .then((res: Settings) => res);
        })
    );
  }

  public updatePrivacyPreferences(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/privacy`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public addLocation(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/locations`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public getMyLocations() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<MyLocationsResponse>(`${API_ADDRESS}/locations`, authHeader)
            .toPromise()
            .then((res: MyLocationsResponse) => res);
        })
    );
  }

  public makeDefaultLocation(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.put<UpdateResponse>(`${API_ADDRESS}/location/${id}`, null , authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public deleteLocation(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.delete<UpdateResponse>(`${API_ADDRESS}/location/${id}`, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public updateProfile(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/profile`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public selectCity(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/select-city`, {city_id: id}, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public currentCity() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<CurrentCityResponse>(`${API_ADDRESS}/current-city`, authHeader)
            .toPromise()
            .then((res: CurrentCityResponse) => res);
        })
    );
  }
}
