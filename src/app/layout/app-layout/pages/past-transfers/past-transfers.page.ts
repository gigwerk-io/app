import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FinanceService} from '../../../../utils/services/finance.service';
import {Transfers} from '../../../../utils/interfaces/finance/transfers';
import {UtilsService} from '../../../../utils/services/utils.service';

@Component({
  selector: 'past-transfers',
  templateUrl: './past-transfers.page.html',
  styleUrls: ['./past-transfers.page.scss'],
})
export class PastTransfersPage implements OnInit {
  transfers: Transfers[];
  isNone = false;
  constructor(
    private financeService: FinanceService,
    private router: Router,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getTransfers();
  }

  getTransfers() {
    this.financeService.getTransfers().then(res => {
      this.transfers = res.payouts;
      if (res.payouts.length === 0) {
        this.isNone = true;
      }
    }).catch(error => {
      this.utils.presentToast(error.error.message, 'danger').then(() => {
        this.router.navigateByUrl('app/connect-bank-account');
      });
    });
  }

  goToJob(id) {
    this.router.navigate(['app/marketplace-detail', id]);
  }
}
