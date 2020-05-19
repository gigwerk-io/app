import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter, pairwise} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private currentUrl: string;
  private history: string[] = [];

  public setCurrentUrl(url: string) {
    if (!this.history.includes(url)) {
      this.history.push(url);
    }
    /**
     * if a base route is found going back is impossible
     * therefore remove any routes below the base routes
     */
    this.history.find((route, i) => {
      if (route.includes('/app/tabs')) {
        for (let j = 0; j < i; j++) {
          this.history.shift();
        }
      }
    });
    this.currentUrl = url;
    console.log(this.history);
  }

  public getPreviousUrl(): string {
    this.currentUrl = this.history.pop();
    console.log(this.history);
    return this.currentUrl;
  }

  public getCurrentUrl(): string {
    return this.currentUrl;
  }
}
