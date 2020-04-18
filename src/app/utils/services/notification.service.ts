import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Badge, NotificationsResponse} from '../interfaces/notification/notification';
import {UpdateResponse} from '../interfaces/settings/preferences';
import {RESTService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public getBadgeCount(): Promise<Badge> {
    return this.makeHttpRequest<Badge>('badges', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getNewNotifications(): Promise<NotificationsResponse> {
    return this.makeHttpRequest<NotificationsResponse>('notifications/new', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getAllNotifications(): Promise<NotificationsResponse> {
    return this.makeHttpRequest<NotificationsResponse>('notifications/all', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public markNotificationAsRead(id): Promise<void> {
    return this.makeHttpRequest<void>(`notification/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then());
  }

  public saveFCMToken(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('fcm_token', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public saveAPNToken(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('apn_token', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
