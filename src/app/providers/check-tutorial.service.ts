import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {StorageKeys} from './constants';
import {AuthService} from '../utils/services/auth.service';
import {NavController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {
  constructor(private storage: Storage, private navCtrl: NavController, private authService: AuthService) {}

  canLoad() {
    return this.storage.get(StorageKeys.PLATFORM_TUTORIAL).then(res => {
      if (res) {
        this.authService.isLoggedIn().then(isLoggedIn => {
          console.log(isLoggedIn);
          if (isLoggedIn) {
            this.navCtrl.navigateRoot('/app/tabs/marketplace');
          } else {
            this.navCtrl.navigateRoot('/app/welcome');
          }
        });
        return false;
      } else {
        return true;
      }
    });
  }
}
