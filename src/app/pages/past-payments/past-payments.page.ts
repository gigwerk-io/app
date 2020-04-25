import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import {Payments} from '../../utils/interfaces/finance/payments';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {UtilsService} from '../../utils/services/utils.service';

@Component({
  selector: 'past-payments',
  templateUrl: './past-payments.page.html',
  styleUrls: ['./past-payments.page.scss'],
})
export class PastPaymentsPage implements OnInit {
  payments: Payments[];
  isNone = false;
  constructor(
    private financeService: FinanceService,
    private router: Router,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    this.financeService.getPayments().then(res => {
      this.payments = res.data;
      if (res.data.length === 0) {
        this.isNone = true;
      }
    }).catch(error => {
      this.utils.presentToast(error.message, 'danger').then(() => {
        this.router.navigateByUrl('app/set-up-payments');
      });
    });
  }

  goToJob(id) {
    this.router.navigate(['app/marketplace-detail', id]);
  }
}
