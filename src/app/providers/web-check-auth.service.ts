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
        if (state.url !== '/') {
          if (token.data.validToken) {
            if (state.url !== '/main/marketplace') {
              this.navCtrl.navigateRoot('/main/marketplace');
            }
          } else {
            if (!(state.url === '/login'
              || state.url === '/signup'
              || state.url === '/forgot-password')) {
              this.storage.get(StorageKeys.PLATFORM_TUTORIAL)
                .then(res => {
                  if (res) {
                    this.navCtrl.navigateRoot('/login');
                  } else {
                    if (state.url !== '/login') {
                      this.navCtrl.navigateRoot('/login');
                    }
                  }
                });
            }
          }
        } else {
          this.navCtrl.navigateRoot('/login');
        }
        return true;
      })
      .catch(error => {
        if (!(state.url === '/login')) {
          this.navCtrl.navigateRoot('/login');
        }
        return false;
      });
  }
}
