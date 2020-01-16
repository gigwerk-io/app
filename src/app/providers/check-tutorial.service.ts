import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import {StorageKeys} from './constants';
@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {
  constructor(private storage: Storage, private router: Router) {}

  canLoad() {
    return this.storage.get(StorageKeys.PLATFORM_TUTORIAL).then(res => {
      if (res) {
        this.router.navigate(['/welcome']);
        return false;
      } else {
        return true;
      }
    });
  }
}
