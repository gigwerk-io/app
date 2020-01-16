
export interface UserOptions {
  email?: string;
  username: string;
  password: string;
}

export interface UserRegistrationOptions {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  birthday?: number;
  password: string;
  confirm_password: string;
  freelancer?: boolean;
  ssn?: number;
  city_id: number;
  street_address: string;
  city: string;
  state: string;
  zip: number;
}

export interface AuthorizationToken {
  headers: {
    Authorization: string;
  };
}
