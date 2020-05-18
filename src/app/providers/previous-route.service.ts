import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter, pairwise} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  public setPreviousUrl(url: string) {
    this.previousUrl = url;
  }

  public setCurrentUrl(url: string) {
    this.currentUrl = url;
  }

  public getPreviousUrl() {
    console.log(this.previousUrl);
    console.log(this.currentUrl);
    return this.previousUrl;
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }
}
