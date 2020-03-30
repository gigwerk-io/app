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
   */
  public getCategories(): Promise<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${API_ADDRESS}/categories`).toPromise();
  }

  /**
   * Get the cities FAVR is available in.
   */
  public getCities(): Promise<CitiesResponse> {
    return this.httpClient.get<CitiesResponse>(`${API_ADDRESS}/cities`).toPromise();
  }
}
