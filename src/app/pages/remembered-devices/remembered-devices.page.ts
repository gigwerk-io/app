import { Component, OnInit } from '@angular/core';
import {SecurityService} from '../../utils/services/security.service';
import {Sessions} from '../../utils/interfaces/auth/sessions';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'remembered-devices',
  templateUrl: './remembered-devices.page.html',
  styleUrls: ['./remembered-devices.page.scss'],
})
export class RememberedDevicesPage implements OnInit {

  sessions: Sessions[];

  constructor(private securityService: SecurityService,
              private toastController: ToastController) { }

  ngOnInit() {
    this.getSessions();
  }

  getSessions() {
    this.securityService.getSessions().then(res => {
      this.sessions = res.sessions;
      // console.log(this.sessions);
    });
  }

  killAll() {
    this.securityService.killAll().then(res => {
      this.presentToast(res.message);
      this.getSessions();
    });
  }

  async presentToast(message) {
    await this.toastController.create({
      message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      buttons: [
        {
          text: 'Done',
          role: 'cancel'
        }
      ]
    }).then(toast => {
      toast.present();
    });
  }
}
