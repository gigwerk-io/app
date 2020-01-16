import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'redeem-code',
  templateUrl: './redeem-code.page.html',
  styleUrls: ['./redeem-code.page.scss'],
})
export class RedeemCodePage implements OnInit {
  code;
  constructor(private financeService: FinanceService,
              private toastController: ToastController,
              private alertController: AlertController) { }

  ngOnInit() {

  }

  redeem() {
    if (this.code === undefined) {
      this.presentAlert('Please fill out the code field.');
    } else {
      const body = {code: this.code};
      this.financeService.redeemCredit(body).subscribe(res => {
        this.presentToast(res.message);
      }, error => {
        this.presentAlert(error.error.message);
      });
    }
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

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
