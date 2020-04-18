import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {ProfileRouteResponse} from '../interfaces/user';
import {MainProposal} from '../interfaces/main-marketplace/main-proposal';
import {RESTService} from './rest.service';
import {GenericResponse} from '../interfaces/searchable';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends RESTService {

  constructor(public httpClient: HttpClient, public storage: Storage) {
    super(httpClient, storage);
  }

  public getProfile(id: number): Promise<ProfileRouteResponse> {
    return this.makeHttpRequest<ProfileRouteResponse>(`profile/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  public getProfileImage(id: number): Promise<string> {
    return this.getProfile(id).then(prof => prof.user.image);
  }

  public getFreelancerProposals(): Promise<MainProposal[]> {
    return this.makeHttpRequest<{requests: MainProposal[]}>('marketplace/main/proposals', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.requests));
  }

  public reportUser(id: number, description: string): Promise<string> {
    return this.makeHttpRequest<GenericResponse>(`report/user/${id}`, 'POST', {description})
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }
}
