import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {from} from 'rxjs/index';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {ReferralStepsResponse} from '../interfaces/referrals/ReferralSteps';
import {ReferralProfileResponse} from '../interfaces/referrals/ReferralProfile';
import {UpdateResponse} from '../interfaces/settings/preferences';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }

  public getMyReferrals() {

  }

  public getStepsToReferWorkers() {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<ReferralStepsResponse>(`${API_ADDRESS}/remaining-steps`, authHeader)
            .toPromise()
            .then((res) => res);
        });
  }

  public getReferralProfile(username) {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<ReferralProfileResponse>(`${API_ADDRESS}/referral/${username}`, authHeader)
            .toPromise()
            .then((res) => res);
        });
  }

  public getCustomerReferralProfile(username) {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<ReferralProfileResponse>(`${API_ADDRESS}/customer-referral/${username}`, authHeader)
            .toPromise()
            .then((res) => res);
        });
  }

  public submitWorkerReferral(body, affiliateUsername) {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/referral/${affiliateUsername}`, body , authHeader)
            .toPromise()
            .then((res) => res);
        });
  }

  public submitCustomerReferral(body, affiliateUsername) {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<UpdateResponse>(`${API_ADDRESS}/customer-referral/${affiliateUsername}`, body , authHeader)
            .toPromise()
            .then((res) => res);
        });
  }
}
