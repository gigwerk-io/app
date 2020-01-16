import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import {PaymentInformationResponse} from '../../utils/interfaces/finance/payments';
import {Events} from '@ionic/angular';

@Component({
  selector: 'manage-cards',
  templateUrl: './manage-cards.page.html',
  styleUrls: ['./manage-cards.page.scss'],
})
export class ManageCardsPage {

  card: PaymentInformationResponse;

  constructor(private financeService: FinanceService) {}

  ionViewWillEnter() {
    this.financeService.getPaymentInformation()
      .then((res: PaymentInformationResponse) => {
        this.card = res;
        // console.log(this.card);
      });
  }
}
