import { Component, OnInit } from '@angular/core';
import {FinanceService} from '../../utils/services/finance.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'connect-bank-account',
  templateUrl: './connect-bank-account.page.html',
  styleUrls: ['./connect-bank-account.page.scss'],
})
export class ConnectBankAccountPage implements OnInit {

  constructor(private financeService: FinanceService, private iab: InAppBrowser, private platform: Platform) { }

  ngOnInit() {
    this.financeService.saveBankAccount().subscribe(res => {
      // const browser = this.iab.create(res.url);
      if (this.platform.is('desktop')) {
        window.open(res.url);
      } else {
        this.iab.create(res.url);
      }
    });
  }

}
