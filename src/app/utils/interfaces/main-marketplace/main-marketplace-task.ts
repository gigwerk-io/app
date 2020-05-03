import {User} from '../user';
import {MainProposal} from './main-proposal';
import {Location} from '../locations/location';

export interface MainMarketplaceTask {
  id?: number;
  customer_id?: number;
  freelancer_accepted?: number;
  freelancer_count?: number;
  sub_category_id?: number;
  category_id?: number;
  category_icon_image?: string;
  category?: string;
  price?: number;
  description?: string;
  status?: string;
  intensity?: string;
  complete_before?: number;
  isoFormat?: number;
  postedFormat?: number;
  image_one?: any;
  image_two?: any;
  image_three?: any;
  action?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: number;
  distance_away?: number;
  proposals?: MainProposal[];
  customer?: User;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: number;
  date?: number;
  locations?: Location[];
}
