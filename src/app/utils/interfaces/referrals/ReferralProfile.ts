import {City} from '../locations/city';
import {Profile} from '../user';

export interface ReferralProfile {
  id: number;
  username: string;
  name: string;
  city: City;
  profile: Profile;
}

export interface ReferralProfileResponse {
  data: ReferralProfile;
}
