import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Storage } from '@ionic/storage';
import {StorageKeys} from './constants';
import {AuthService} from '../utils/services/auth.service';
import {UtilsService} from '../utils/services/utils.service';
@Injectable({
  providedIn: 'root'
})
export class CheckAuth implements CanActivate {
  constructor(private storage: Storage,
              private router: Router,
              private auth: AuthService,
              private utils: UtilsService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.auth.isValidToken()
      .then(token => {
        if (token.response) {
          switch (state.url) {
            case '/app':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/welcome':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/login':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/signup':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/forgot-password':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
          }
        } else {
          if (!(state.url === '/login'
            || state.url === '/signup'
            || state.url === '/welcome'
            || state.url === '/forgot-password')) {
            this.router.navigateByUrl('/welcome');
          }
        }
        return true;
      })
      .catch(error => {
        if (!(state.url === '/welcome')) {
          this.router.navigateByUrl('/welcome');
        }
        return false;
      });
  }
}
