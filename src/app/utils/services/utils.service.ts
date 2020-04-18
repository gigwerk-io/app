import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {PredefinedColors} from '@ionic/core';
import {ToastButton} from '@ionic/core/dist/types/components/toast/toast-interface';
import {ChatService} from './chat.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private chatService: ChatService
  ) { }

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

  startChat(username) {
    this.chatService.startChat(username)
      .then(res => {
        this.router.navigate(['/app/room', res.id]);
      })
      .catch(error => {
        this.presentToast(error.error.message, 'danger');
      });
  }
}
