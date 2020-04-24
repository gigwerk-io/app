import {User} from '../user';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    token: string;
    profile: {
      created_at?: number;
      description?: string;
      image?: string;
      updated_at?: number;
      user?: User;
      user_id?: number
    };
  };
}

export interface SignOutResponse {
  success: boolean;
  message: string;
}

export interface ValidateTokenResponse {
  success: boolean;
  message: string;
  data: {
    validToken: boolean;
  };
}
