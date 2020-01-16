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
  activeSessionSubscription;
  constructor(private securityService: SecurityService,
              private toastController: ToastController) { }

  ngOnInit() {
    this.getSessions();
  }

  getSessions() {
    this.activeSessionSubscription = this.securityService.getSessions().subscribe(res => {
      this.sessions = res.sessions;
      // console.log(this.sessions);
    });
  }

  killAll() {
    this.activeSessionSubscription.unsubscribe();
    this.securityService.killAll().subscribe(res => {
      this.presentToast(res.message);
      this.getSessions();
    });
  }

  async presentToast(message) {
    await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2500,
      color: 'dark',
      showCloseButton: true
    }).then(toast => {
      toast.present();
    });
  }
}
