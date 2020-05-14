import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Storage} from '@ionic/storage';
import {StorageKeys} from './constants';
import {AuthService} from '../utils/services/auth.service';
import {UtilsService} from '../utils/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class CheckAuth implements CanActivate {
  constructor(
    private storage: Storage,
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.auth.isValidToken()
      .then(token => {
        console.log(token);
        if (token.data.validToken) {
          switch (state.url) {
            case '/app':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/app/welcome':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/app/login':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/app/signup':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
            case '/app/forgot-password':
              this.router.navigateByUrl('/app/tabs/marketplace');
              break;
          }
        } else {
          if (!(state.url === '/app/login'
            || state.url === '/app/signup'
            || state.url === '/app/welcome'
            || state.url === '/app/forgot-password')) {
            this.router.navigateByUrl('/app/welcome');
          }
        }
        return true;
      })
      .catch(error => {
        if (!(state.url === '/app/welcome')) {
          this.router.navigateByUrl('/app/welcome');
        }
        return false;
      });
  }
}
