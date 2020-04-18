import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {ReferralStepsResponse} from '../interfaces/referrals/ReferralSteps';
import {ReferralProfileResponse} from '../interfaces/referrals/ReferralProfile';
import {UpdateResponse} from '../interfaces/settings/preferences';
import {RESTService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class ReferralService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public getStepsToReferWorkers(): Promise<ReferralStepsResponse> {
    return this.makeHttpRequest<ReferralStepsResponse>(`remaining-steps`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getReferralProfile(username): Promise<ReferralProfileResponse> {
    return this.makeHttpRequest<ReferralProfileResponse>(`referral/${username}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getCustomerReferralProfile(username): Promise<ReferralProfileResponse> {
    return this.makeHttpRequest<ReferralProfileResponse>(`customer-referral/${username}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public submitWorkerReferral(body, affiliateUsername): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>(`referral/${affiliateUsername}`, 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public submitCustomerReferral(body, affiliateUsername): Promise<UpdateResponse> {
    return this.makeHttpRequest<UpdateResponse>(`customer-referral/${affiliateUsername}`, 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
