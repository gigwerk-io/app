import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {UpdateResponse} from '../interfaces/settings/preferences';
import {SessionResponse} from '../interfaces/auth/sessions';
import {RESTService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public updatePassword(body): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('password', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getSessions(): Promise<SessionResponse> {
    return this.makeHttpRequest<SessionResponse>('sessions', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public killAll(): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('destroy', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public deactivateAccount(): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('deactivate', 'POST', '')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public deleteAccount(): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>('delete', 'POST', {reason: ''})
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
