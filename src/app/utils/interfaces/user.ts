// @ts-ignore
import {MainMarketplaceTask} from './main-marketplace/main-marketplace-task';
import {MainProposal} from './main-marketplace/main-proposal';
// @ts-ignore
import {FriendMarketplaceTask} from './friend-marketplace/friend-marketplace-task';
import {FriendProposals} from './friend-marketplace/friend-proposals';

export interface User {
  id?: number;
  username?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: number;
  twilio_phone?: number;
  birthday?: number;
  city_id?: number;
  is_admin?: boolean;
  credit_amount?: number;
  intercom_id?: number;
  email_verified_at?: number;
  created_at?: number;
  updated_at?: number;
  deleted_at?: number;
  main_marketplace?: MainMarketplaceTask[];
  friend_marketplace?: FriendMarketplaceTask[];
  friend_proposals?: FriendProposals[];
  main_proposals?: MainProposal[];
  profile?: Profile;
}

export interface PastJob {
  price: number;
  approved: number;
  arrived_at: number;
  complete_at: number;
  created_at: number;
  marketplace: MainMarketplaceTask;
  marketplace_id: number;
  rating: number;
  review: string;
  updated_at: number;
  user_id: number;
}

export interface ProfileRouteResponse {
  user: {
    user_id?: number;
    image?: string;
    description?: string;
    created_at?: number;
    updated_at?: number;
    rating?: number;
    customer_rating?: number;
    friend_status?: string;
    past_jobs?: PastJob[];
    user: {
      id?: number;
      username?: string;
      role?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: number;
      twilio_phone?: number;
      birthday?: number;
      city_id?: number;
      is_admin?: boolean;
      organization_id?: number;
      is_organization_admin?: boolean
      credit_amount?: number;
      intercom_id?: number;
      email_verified_at?: number;
      created_at?: number;
      updated_at?: number;
      deleted_at?: number;
      main_marketplace?: MainMarketplaceTask[];
      friend_marketplace?: FriendMarketplaceTask[];
      friend_proposals?: FriendProposals[];
      main_proposals?: MainProposal[];
    };
  };
}

export interface Profile {
  user_id?: number;
  image?: string;
  description?: string;
  created_at?: number;
  updated_at?: number;
  rating?: number;
  customer_rating?: number;
  friend_status?: string;
  user?: {
    role?: string; // TODO: define types for this value
  };
}
