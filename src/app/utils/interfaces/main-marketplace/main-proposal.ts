import {User} from '../user';

export interface MainProposal {
  user?: User;
  marketplace_id?: number;
  user_id?: number;
  approved?: boolean | number;
  rating?: number;
  review?: string;
  arrived_at?: number;
  complete_at?: number;
  created_at?: string;
  updated_at?: string;
}
