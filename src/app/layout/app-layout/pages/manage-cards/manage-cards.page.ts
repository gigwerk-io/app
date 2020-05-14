import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinanceService} from '../../../../utils/services/finance.service';
import {PaymentInformationResponse} from '../../../../utils/interfaces/finance/payments';
import { Response } from '../../../../utils/interfaces/response';

@Component({
  selector: 'manage-cards',
  templateUrl: './manage-cards.page.html',
  styleUrls: ['./manage-cards.page.scss'],
})
export class ManageCardsPage implements OnInit {

  card: PaymentInformationResponse;

  constructor(private financeService: FinanceService) {}

  ngOnInit() {
    this.financeService.getPaymentInformation()
      .then((res: Response<PaymentInformationResponse>) => {
        this.card = res.data;
      });
  }
}
