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

export interface MainMarketplaceRouteResponse {
  success: boolean;
  message: boolean;
  data: MainMarketplaceTask[];
}

export interface MainMarketplaceRequestRouteResponse {
  success: boolean;
  message: string;
  data: MainMarketplaceTask;
}

export interface FreelancerAcceptMainMarketplaceTaskRouteResponse {
  message: string;
}

export interface FreelancerWithdrawMainMarketplaceTaskRouteResponse {
  message: string;
}

export interface CustomerCancelTaskResponse {
  message: string;
}

export interface CustomerApproveFreelancerResponse {
  message: string;
}

export interface CustomerDenyFreelancerResponse {
  message: string;
}

export interface FreelancerArrivedResponse {
  message: string;
}

export interface FreelancerCompleteTaskResponse {
  message: string;
}

export interface CustomerCompleteTaskResponse {
  message: string;
}

export interface ReportTaskResponse {
  message: string;
}
