import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';
import {AuthService} from '../utils/services/auth.service';
import {StorageKeys} from './constants';

@Injectable({
  providedIn: 'root'
})
export class WebCheckAuth implements CanActivate {

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private authService: AuthService) {  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.authService.isValidToken()
      .then(token => {
        console.log(token);
        console.log(state.url);
        if (state.url !== '/web') {
          if (token.data.validToken) {
            if (state.url !== '/web/main/marketplace') {
              this.navCtrl.navigateRoot('/web/main/marketplace');
            }
          } else {
            if (!(state.url === '/web/login'
              || state.url === '/web/signup'
              || state.url === '/web/forgot-password')) {
              this.storage.get(StorageKeys.PLATFORM_TUTORIAL)
                .then(res => {
                  if (res) {
                    this.navCtrl.navigateRoot('/web/login');
                  } else {
                    if (state.url !== '/web/login') {
                      this.navCtrl.navigateRoot('/web/login');
                    }
                  }
                });
            }
          }
        } else {
          this.navCtrl.navigateRoot('/web/login');
        }
        return true;
      })
      .catch(error => {
        if (!(state.url === '/web/login')) {
          this.navCtrl.navigateRoot('/web/login');
        }
        return false;
      });
  }
}
