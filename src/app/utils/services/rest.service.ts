import {Injectable} from '@angular/core';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {AuthorizationToken} from '../interfaces/user-options';

/**
 * Note: this is a wrapper parent class that is used to simplify making calls to the backend using an authorization token
 * and retrieving the response
 *
 * @author Haron Arama
 */
@Injectable({
  providedIn: 'root'
})
export class RESTService {

  constructor(public http: HttpClient, public storage: Storage) {  }

  /**
   *
   * Note: this is an Observable that returns an Observable upon subscription
   *
   * @param route the route that is targeted
   * @param httpMethod the http method to be used, 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'
   * @param httpParams the http params or body
   * @param callback a function to do some intermittent logic while fetching data
   */
  public makeHttpRequest<T>(
    route: string,
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    httpParams?: any,
    callback?: () => any
  ): Promise<Observable<T> | undefined> {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const header: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };

        // a callback function for executing functionality in parallel with a backend call
        // tslint:disable-next-line:no-unused-expression
        callback;

        route = `${API_ADDRESS}/${route}`;
        switch (httpMethod) {
          case 'GET':
            if (httpParams) {
              header.params = httpParams;
            }
            return this.http.get<T>(route, header);
          case 'POST':
            return this.http.post<T>(route, httpParams, header);
          case 'PUT':
            return this.http.put<T>(route, httpParams, header);
          case 'DELETE':
            return this.http.delete<T>(route, header);
          case 'PATCH':
            return this.http.patch<T>(route, httpParams, header);
          default:
            return undefined;
        }
      });
  }
}
