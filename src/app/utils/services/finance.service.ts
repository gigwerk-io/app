import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {BalanceResponse, OAuthResponse, PayoutsResponse} from '../interfaces/finance/transfers';
import {CardSavedResponse, PaymentInformationResponse, PaymentsResponse, Payments} from '../interfaces/finance/payments';
import {RedeemedCreditResponse, UserCreditResponse} from '../interfaces/finance/credit';
import {RESTService} from './rest.service';
import { Response } from '../interfaces/response';

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

  getPaymentInformation(): Promise<Response<PaymentInformationResponse>> {
    return this.makeHttpRequest<Response<PaymentInformationResponse>>('payment-information', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<PaymentInformationResponse>) => res));
  }


  getPayments(): Promise<Response<Payments[]>> {
    return this.makeHttpRequest<Response<Payments[]>>('payments', 'GET')
      .then(httpRes => httpRes.toPromise().then((res: Response<Payments[]>) => res));
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
