import {User} from '../user';

export interface AuthResponse {
  id?: number;
  profile?: {
    created_at?: number;
    description?: string;
    image?: string;
    updated_at?: number;
    user?: User;
    user_id?: number
  };
  token?: string;
  response?: boolean;
}

export interface SignOutResponse {
  message?: string;
}

export interface ValidateTokenResponse {
  response: boolean;
}
