import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FriendRequestsResponse,
  MyFriendsResponse,
  RecommendedFriendsResponse,
  Searchable, GenericResponse, SearchResponse,
} from '../interfaces/searchable';
import {Storage} from '@ionic/storage';
import {RESTService} from './rest.service';
import { Response } from '../interfaces/response';


@Injectable({
  providedIn: 'root'
})
export class FriendsService extends RESTService {

  constructor(public http: HttpClient, public storage: Storage) {
    super(http, storage);
  }

  /**
   * Show current friends of a user.
   */
  public getMyFriends(): Promise<Response<Searchable[]>>  {
    return this.makeHttpRequest<Response<Searchable[]>>('friends', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Searchable[]>) => res));
  }


  public searchUsers(query): Promise<Searchable[]> {
    return this.makeHttpRequest<SearchResponse>('search', 'GET', {search: query})
      .then(httpRes => httpRes.toPromise().then(res => res.users));
  }

  /**
   * Show recommended friends for a user.
   *
   */
  public getRecommendedFriends(): Promise<Response<Searchable[]>> {
    return this.makeHttpRequest<Response<Searchable[]>>('friend/recommend', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Searchable[]>) => res));
  }


  /**
   * Show a users friend requests.
   *
   */
  public getFriendRequests(): Promise<Response<Searchable[]>> {
    return this.makeHttpRequest<Response<Searchable[]>>('friend/requests', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Searchable[]>) => res));
  }

  public sendFriendRequest(id): Promise<string> {
    return this.makeHttpRequest<GenericResponse>(`friend/send/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public acceptFriendRequest(id): Promise<string> {
    return this.makeHttpRequest<GenericResponse>(`friend/accept/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public rejectFriendRequest(id): Promise<string> {
    return this.makeHttpRequest<GenericResponse>(`friend/deny/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }

  public unfriend(id): Promise<string> {
    return this.makeHttpRequest<GenericResponse>(`friend/delete/${id}`, 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res.message));
  }
}
