import {MainMarketplaceTask} from '../main-marketplace/main-marketplace-task';
import {User} from '../user';

export interface CardSavedResponse {
  message: string;
}

export interface PaymentInformationResponse {
  user: {
    user_id: number;
    customer_id: number;
    express_id: number;
    card_id: number;
    type: string;
    last4: number;
    exp_month: number;
    exp_year: number;
    created_at: number;
    updated_at: number;
    user: User;
  };
}

export interface PaymentsResponse {
  payments: Payments[];
}

export interface Payments {
  marketplace_id: number;
  customer_id: number;
  amount: number;
  refunded: boolean;
  created_at: string;
  updated_at: string;
  marketplace: MainMarketplaceTask;
  customer: User;
}
