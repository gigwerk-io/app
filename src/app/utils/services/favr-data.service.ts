import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ADDRESS} from '../../providers/constants';
import {CitiesResponse} from '../interfaces/locations/city';
import {CategoryResponse} from '../interfaces/main-marketplace/main-category';

@Injectable({
  providedIn: 'root'
})
export class FavrDataService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the available FAVR categories.
   *
   * @returns {Observable<Object> | Observable<any>}
   */
  public getCategories() {
    return this.httpClient.get<CategoryResponse>(`${API_ADDRESS}/categories`);
  }

  /**
   *Get the cities FAVR is available in.
   *
   * @returns {Observable<CitiesResponse>}
   */
  public getCities() {
    return this.httpClient.get<CitiesResponse>(`${API_ADDRESS}/cities`);
  }
}
