import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_ADDRESS} from '../../providers/constants';
import {CitiesResponse, City} from '../interfaces/locations/city';
import {CategoryResponse} from '../interfaces/main-marketplace/main-category';
import { Response } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class FavrDataService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the available FAVR categories.
   */
  public getCategories(): Promise<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${API_ADDRESS}/categories`).toPromise()
      .then(res => res);
  }

  /**
   * Get the cities FAVR is available in.
   */
  public getCities(): Promise<Response<City[]>> {
    return this.httpClient.get<Response<City[]>>(`${API_ADDRESS}/cities`).toPromise();
  }
  // public getCities(): Promise<CitiesResponse> {
  //   return this.httpClient.get<CitiesResponse>(`${API_ADDRESS}/cities`).toPromise();
  // }
}
