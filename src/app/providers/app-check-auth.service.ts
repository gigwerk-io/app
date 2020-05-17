import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Storage} from '@ionic/storage';
import {StorageKeys} from './constants';
import {AuthService} from '../utils/services/auth.service';
import {UtilsService} from '../utils/services/utils.service';
import {NavController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AppCheckAuth implements CanActivate {
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private authService: AuthService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.authService.isValidToken()
      .then(token => {
        console.log(token);
        console.log(state.url);
        if (state.url !== '/app') {
          if (token.data.validToken) {
            if (state.url !== '/app/tabs/marketplace') {
              this.navCtrl.navigateRoot('/app/tabs/marketplace');
            }
          } else {
            if (!(state.url === '/app/login'
              || state.url === '/app/signup'
              || state.url === '/app/welcome'
              || state.url === '/app/forgot-password')) {
              this.storage.get(StorageKeys.PLATFORM_TUTORIAL)
                .then(res => {
                  if (res) {
                    this.navCtrl.navigateRoot('/app/welcome');
                  } else {
                    if (state.url !== '/app/tutorial') {
                      this.navCtrl.navigateRoot('/app/tutorial');
                    }
                  }
                });
            }
          }
        } else {
          this.navCtrl.navigateRoot('/app/tutorial');
        }
        return true;
      })
      .catch(error => {
        if (!(state.url === '/app/welcome')) {
          this.navCtrl.navigateRoot('/app/welcome');
        }
        return false;
      });
  }
}
