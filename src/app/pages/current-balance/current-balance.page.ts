import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';

@Component({
  selector: 'current-balance',
  templateUrl: './current-balance.page.html',
  styleUrls: ['./current-balance.page.scss'],
})
export class CurrentBalancePage implements OnInit {

  balance: string;
  constructor(private financeService: FinanceService) { }

  ngOnInit() {
    this.getBalance();
  }

  getBalance() {
    this.financeService.getFreelancerBalance().subscribe(res => {
      this.balance = res.balance;
    });
  }
}
