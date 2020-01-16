import {User} from '../user';
import {FriendProposals} from './friend-proposals';

export interface FriendMarketplaceTask {
  id: number;
  customer_id: number;
  freelancer_accepted: number;
  freelancer_count: number;
  category_id: number;
  sub_category_id: number;
  amount: number;
  description: string;
  status: string;
  intensity: string;
  complete_before: number;
  image_one: string;
  image_two: string;
  image_three: string;
  created_at: number;
  updated_at: number;
  deleted_at: number;
  proposals: FriendProposals[];
  customer: User;
}
