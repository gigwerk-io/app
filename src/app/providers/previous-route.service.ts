import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = (this.currentUrl !== event.url) ? this.currentUrl : '/app/tabs/marketplace';
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getCurrentUrl() {
    return this.currentUrl;
  }
}
