// @ts-ignore
import {MainMarketplaceTask} from './main-marketplace/main-marketplace-task';
import {MainProposal} from './main-marketplace/main-proposal';
// @ts-ignore
import {FriendMarketplaceTask} from './friend-marketplace/friend-marketplace-task';
import {FriendProposals} from './friend-marketplace/friend-proposals';
import {Role} from '../../providers/constants';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  birthday: string;
  city_id: number;
  created_at: string;
  deleted_at: string;
  credit_amount: number;
  email: string;
  email_verified_at: string;
  has_chatkit: string;
  intercom_id: null;
  is_admin: false;
  is_organization_admin: false;
  main_marketplace: MainMarketplaceTask[];
  main_proposals: MainProposal[];
  organization_id: number;
  organization: any;
  phone: string;
  // @ts-ignore
  role: Role.VERIFIED_FREELANCER | Role.PENDING_FREELANCER | Role.CUSTOMER;
  twilio_phone: string;
  updated_at: string;
  username: string;
  profile?: Profile;
}

export interface PastJob {
  price: number;
  approved: number;
  arrived_at: number;
  complete_at: number;
  created_at: string;
  marketplace: MainMarketplaceTask;
  marketplace_id: number;
  rating: number;
  review: string;
  updated_at: string;
  user_id: number;
}

export interface Profile {
  user_id: number;
  created_at: string;
  customer_rating: number;
  description: string;
  friend_status: any;
  image: string;
  past_jobs: PastJob[];
  rating: number;
  updated_at: string;
  user?: User;
}
