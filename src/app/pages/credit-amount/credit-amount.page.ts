import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';

@Component({
  selector: 'credit-amount',
  templateUrl: './credit-amount.page.html',
  styleUrls: ['./credit-amount.page.scss'],
})
export class CreditAmountPage implements OnInit {
  credit;
  constructor(private financeService: FinanceService) { }

  ngOnInit() {
    this.getCreditBalance();
  }

  getCreditBalance() {
    this.financeService.getCreditBalance().then(res => {
      this.credit = res.credit;
    });
  }
}
