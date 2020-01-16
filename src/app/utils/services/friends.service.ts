import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  FriendRequestsResponse,
  MyFriendsResponse,
  RecommendedFriendsResponse,
  Searchable, GenericResponse, SearchResponse,
} from '../interfaces/searchable';
import {from, Observable} from 'rxjs/index';
import {Storage} from '@ionic/storage';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(private http: HttpClient, private storage: Storage) { }

  /**
   * Show current friends of a user.
   *
   * @returns {Observable<Searchable[]>}
   */
  public getMyFriends(): Observable<Searchable[]> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<MyFriendsResponse>(API_ADDRESS + '/friends', authHeader)
            .toPromise()
            .then((res: MyFriendsResponse) => res.friends);
        })
    );
  }

  public searchUsers(query): Observable<Searchable[]> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const options = {
            headers: {
              Authorization: (token)
            },
            params: {
              search: query
            }
          };
          return this.http.get<SearchResponse>(API_ADDRESS + '/search', options)
            .toPromise()
            .then((res: SearchResponse) => res.users);
        })
    );
  }

  /**
   * Show recommended friends for a user.
   *
   * @returns {Observable<Searchable[]>}
   */
  public getRecommendedFriends(): Observable<Searchable[]> {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<RecommendedFriendsResponse>(API_ADDRESS + '/friend/recommend', authHeader)
            .toPromise()
            .then((res: RecommendedFriendsResponse) => res.recommendations);
        })
    );
  }

  /**
   * Show a users friend requests.
   *
   * @returns {Observable<ObservedValueOf<Promise<Searchable[]>>>}
   */
  public getFriendRequests() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<FriendRequestsResponse>(API_ADDRESS + '/friend/requests', authHeader)
            .toPromise()
            .then((res: FriendRequestsResponse) => res.requests);
        })
    );
  }

  public sendFriendRequest(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<GenericResponse>(API_ADDRESS + `/friend/send/${id}`, authHeader)
            .toPromise()
            .then((res: GenericResponse) => res.message);
        })
    );
  }

  public acceptFriendRequest(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<GenericResponse>(API_ADDRESS + `/friend/accept/${id}`, authHeader)
            .toPromise()
            .then((res: GenericResponse) => res.message);
        })
    );
  }

  public rejectFriendRequest(id) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<GenericResponse>(API_ADDRESS + `/friend/deny/${id}`, authHeader)
            .toPromise()
            .then((res: GenericResponse) => res.message);
        })
    );
  }

  public unfriend(id) {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.http.get<GenericResponse>(API_ADDRESS + `/friend/delete/${id}`, authHeader)
            .toPromise()
            .then((res: GenericResponse) => res.message);
        });
  }
}
