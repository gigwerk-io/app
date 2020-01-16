import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {AuthorizationToken} from '../interfaces/user-options';
import {from} from 'rxjs/index';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {Badge, NotificationsResponse} from '../interfaces/notification/notification';
import {UpdateResponse} from '../interfaces/settings/preferences';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private httpClient: HttpClient,
              private storage: Storage
  ) { }

  public getBadgeCount() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<Badge>(`${API_ADDRESS}/badges`, authHeader)
            .toPromise()
            .then((res: Badge) => res);
        })
    );
  }

  public getNewNotifications() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<NotificationsResponse>(`${API_ADDRESS}/notifications/new`, authHeader)
            .toPromise()
            .then((res: NotificationsResponse) => res);
        })
    );
  }

  public getAllNotifications() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<NotificationsResponse>(`${API_ADDRESS}/notifications/all`, authHeader)
            .toPromise()
            .then((res: NotificationsResponse) => res);
        })
    );
  }

  public markNotificationAsRead(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get(`${API_ADDRESS}/notification/${id}`, authHeader)
            .toPromise()
            .then((res) => res);
        })
    );
  }

  public saveFCMToken(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/fcm_token`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public saveAPNToken(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/apn_token`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }
}
