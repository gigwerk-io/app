import {MainMarketplaceTask} from '../main-marketplace/main-marketplace-task';
import {User} from '../user';

export interface BalanceResponse {
  balance: string;
}

export interface PayoutsResponse {
  payouts: Transfers[];
}

export interface Transfers {
  marketplace_id: number;
  freelancer_id: number;
  amount: number;
  reversed: boolean;
  created_at: string;
  updated_at: string;
  marketplace: MainMarketplaceTask;
  freelancer: User;
}

export interface OAuthResponse {
  url: string;
}
