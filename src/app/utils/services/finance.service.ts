import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {API_ADDRESS, StorageKeys} from '../../providers/constants';
import {AuthorizationToken} from '../interfaces/user-options';
import {from} from 'rxjs/index';
import {BalanceResponse, OAuthResponse, PayoutsResponse} from '../interfaces/finance/transfers';
import {CardSavedResponse, PaymentInformationResponse, PaymentsResponse} from '../interfaces/finance/payments';
import {RedeemedCreditResponse, UserCreditResponse} from '../interfaces/finance/credit';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  constructor(private httpClient: HttpClient,
              private storage: Storage) { }


  getFreelancerBalance() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<BalanceResponse>(`${API_ADDRESS}/balance`, authHeader)
            .toPromise()
            .then((res: BalanceResponse) => res);
        })
    );
  }

  getTransfers() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<PayoutsResponse>(`${API_ADDRESS}/transfers`, authHeader)
            .toPromise()
            .then((res: PayoutsResponse) => res);
        })
    );
  }

  saveCreditCard(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<CardSavedResponse>(`${API_ADDRESS}/customer/save`, body, authHeader)
            .toPromise()
            .then((res: CardSavedResponse) => res);
        })
    );
  }

  getPaymentInformation() {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
      .then(token => {
        const authHeader: AuthorizationToken = {
          headers: {
            Authorization: (token) ? token : ''
          }
        };
        return this.httpClient.get<PaymentInformationResponse>(`${API_ADDRESS}/payment-information`, authHeader)
          .toPromise()
          .then((res: PaymentInformationResponse) => res);
      });
  }

  getPayments() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<PaymentsResponse>(`${API_ADDRESS}/payments`, authHeader)
            .toPromise()
            .then((res: PaymentsResponse) => res);
        })
    );
  }

  saveBankAccount() {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<OAuthResponse>(`${API_ADDRESS}/stripe/oauth`, authHeader)
            .toPromise()
            .then((res: OAuthResponse) => res);
        })
    );
  }

  getCreditBalance() {
    return this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.get<UserCreditResponse>(`${API_ADDRESS}/credit`, authHeader)
            .toPromise()
            .then((res: UserCreditResponse) => res);
        });
  }

  redeemCredit(body) {
    return from(
      this.storage.get(StorageKeys.ACCESS_TOKEN)
        .then(token => {
          const authHeader: AuthorizationToken = {
            headers: {
              Authorization: (token) ? token : ''
            }
          };
          return this.httpClient.post<RedeemedCreditResponse>(`${API_ADDRESS}/redeem`, body, authHeader)
            .toPromise()
            .then((res: RedeemedCreditResponse) => res);
        })
    );
  }
}
