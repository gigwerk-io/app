import { Injectable } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {PredefinedColors} from '@ionic/core';
import {ToastButton} from '@ionic/core/dist/types/components/toast/toast-interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toastCtrl: ToastController) { }

  async presentToast(
    message: string,
    color: PredefinedColors | string = 'dark',
    position: 'top' | 'bottom' | 'middle' = 'top',
    duration: number = 2500,
    buttons: (ToastButton | string)[] = [{text: 'Done', role: 'cancel'}]
  ) {
    await this.toastCtrl.create({
      message,
      position,
      duration,
      color,
      buttons
    }).then(toast => {
      toast.present();
    });
  }
}
