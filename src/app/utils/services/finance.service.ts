import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {BalanceResponse, OAuthResponse, PayoutsResponse} from '../interfaces/finance/transfers';
import {CardSavedResponse, PaymentInformationResponse, PaymentsResponse} from '../interfaces/finance/payments';
import {RedeemedCreditResponse, UserCreditResponse} from '../interfaces/finance/credit';
import {RESTService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService extends RESTService {

  constructor(public httpClient: HttpClient,
              public storage: Storage) {
    super(httpClient, storage);
  }

  getFreelancerBalance() {
    return this.makeHttpRequest<BalanceResponse>('balance', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  getTransfers() {
    return this.makeHttpRequest<PayoutsResponse>('transfers', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  saveCreditCard(body) {
    return this.makeHttpRequest<CardSavedResponse>('customer/save', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  getPaymentInformation() {
    return this.makeHttpRequest<PaymentInformationResponse>('payment-information', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  getPayments() {
    return this.makeHttpRequest<PaymentsResponse>('payments', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  saveBankAccount() {
    return this.makeHttpRequest<OAuthResponse>('stripe/oauth', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  getCreditBalance() {
    return this.makeHttpRequest<UserCreditResponse>('credit', 'GET')
      .then(httpRes => httpRes.toPromise().then(res => res));
  }

  redeemCredit(body) {
    return this.makeHttpRequest<RedeemedCreditResponse>('redeem', 'POST', body)
      .then(httpRes => httpRes.toPromise().then(res => res));
  }
}
