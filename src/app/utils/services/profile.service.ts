import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {from, Observable} from 'rxjs';
import {ProfileRouteResponse} from '../interfaces/user';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {MainProposal} from '../interfaces/main-marketplace/main-proposal';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }

  public getProfile(id: number): Observable<ProfileRouteResponse> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<ProfileRouteResponse>(`${API_ADDRESS}/profile/${id}`, authHeader)
            .toPromise()
            .then((res: ProfileRouteResponse) => res);
        })
    );
  }

  public getProfileImage(id: number): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        return this.httpClient.get<ProfileRouteResponse>(`${API_ADDRESS}/profile/${id}`, authHeader)
          .toPromise()
          .then((res: ProfileRouteResponse) => res.user.image);
      });
  }

  public getFreelancerProposals(): Observable<MainProposal[]> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<{requests: MainProposal[]}>(`${API_ADDRESS}/marketplace/main/proposals`, authHeader)
            .toPromise()
            .then((res: {requests: MainProposal[]}) => res.requests);
        })
    );
  }

  public reportUser(id: number, description: string): Promise<string> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        return this.httpClient.post<{message: string}>(`${API_ADDRESS}/report/user/${id}`, {description: description}, authHeader)
          .toPromise()
          .then((res: {message: string}) => res.message);
      });
  }
}
