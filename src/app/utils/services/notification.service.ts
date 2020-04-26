import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpClient} from '@angular/common/http';
import {Badge, Notification} from '../interfaces/notification/notification';
import {RESTService} from './rest.service';
import {Response} from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public getBadgeCount(): Promise<Response<Badge>> {
    return this.makeHttpRequest<Response<Badge>>('badges', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getNewNotifications(): Promise<Response<Notification[]>> {
    return this.makeHttpRequest<Response<Notification[]>>('notifications/new', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Notification[]>) => res));
  }

  public getAllNotifications(): Promise<Response<Notification[]>> {
    return this.makeHttpRequest<Response<Notification[]>>('notifications/all', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Notification[]>) => res));
  }

  public markNotificationAsRead(id): Promise<void> {
    return this.makeHttpRequest<void>(`notification/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then());
  }

  public saveFCMToken(body): Promise<Response<void>> {
    return this.makeHttpRequest<Response<void>>('fcm_token', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public saveAPNToken(body): Promise<Response<void>> {
    return this.makeHttpRequest<Response<void>>('apn_token', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
