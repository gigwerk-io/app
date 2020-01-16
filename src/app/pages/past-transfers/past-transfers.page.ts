import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FinanceService} from '../../utils/services/finance.service';
import {Transfers} from '../../utils/interfaces/finance/transfers';

@Component({
  selector: 'past-transfers',
  templateUrl: './past-transfers.page.html',
  styleUrls: ['./past-transfers.page.scss'],
})
export class PastTransfersPage implements OnInit {
  transfers: Transfers[];
  isNone = false;
  constructor(private financeService: FinanceService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.getTransfers();
  }

  getTransfers() {
    this.financeService.getTransfers().subscribe(res => {
      this.transfers = res.payouts;
      if (res.payouts.length === 0) {
        this.isNone = true;
      }
    }, error => {
      this.presentToast(error.error.message).then(() => {
        this.router.navigateByUrl('app/connect-bank-account');
      });
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

  goToJob(id) {
    this.router.navigate(['app/marketplace-detail', id]);
  }
}
