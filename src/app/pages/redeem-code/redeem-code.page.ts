import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import {AlertController, ToastController} from '@ionic/angular';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'redeem-code',
  templateUrl: './redeem-code.page.html',
  styleUrls: ['./redeem-code.page.scss'],
})
export class RedeemCodePage implements OnInit {

  code;

  constructor(private financeService: FinanceService,
              private alertController: AlertController,
              private utils: UtilsService) { }

  ngOnInit() { }

  redeem() {
    if (this.code === undefined) {
      this.presentAlert('Please fill out the code field.');
    } else {
      const body = {code: this.code};
      this.financeService.redeemCredit(body)
        .then(res => this.utils.presentToast(res.message, 'success'))
        .catch(error => this.utils.presentToast(error.error.message, 'danger'));
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
