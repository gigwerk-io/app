import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from, Observable} from 'rxjs/index';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {UpdateResponse} from '../interfaces/settings/preferences';
import {ProfileRouteResponse} from '../interfaces/user';
import {SessionResponse} from '../interfaces/auth/sessions';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }

  public updatePassword(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/password`, body, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public getSessions() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<SessionResponse>(`${API_ADDRESS}/sessions`, authHeader)
            .toPromise()
            .then((res: SessionResponse) => res);
        })
    );
  }

  public killAll() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<UpdateResponse>(`${API_ADDRESS}/destroy`, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public deactivateAccount() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/deactivate`, '', authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }

  public deleteAccount() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/delete`, {reason: ''}, authHeader)
            .toPromise()
            .then((res: UpdateResponse) => res);
        })
    );
  }
}
