import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {UpdateResponse} from '../interfaces/settings/preferences';
import {SessionResponse} from '../interfaces/auth/sessions';
import {RESTService} from './rest.service';
import { Response } from '../interfaces/response';

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

  public getSessions(): Promise<Response<SessionResponse>> {
    return this.makeHttpRequest<Response<SessionResponse>>('sessions', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<SessionResponse>) => res));
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
