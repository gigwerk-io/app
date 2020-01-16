import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import {Payments} from '../../utils/interfaces/finance/payments';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'past-payments',
  templateUrl: './past-payments.page.html',
  styleUrls: ['./past-payments.page.scss'],
})
export class PastPaymentsPage implements OnInit {
  payments: Payments[];
  isNone = false;
  constructor(private financeService: FinanceService, private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    this.financeService.getPayments().subscribe(res => {
      this.payments = res.payments;
      if (res.payments.length === 0) {
        this.isNone = true;
      }
    }, error => {
      this.presentToast(error.error.message).then(() => {
        this.router.navigateByUrl('app/set-up-payments');
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
