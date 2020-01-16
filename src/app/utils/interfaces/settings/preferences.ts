export interface UpdateResponse {
  message: string;
}

export interface Settings {
  settings: {
    user_id: number;
    scope: string;
    display_rating: boolean;
    display_description: boolean;
    display_receipts: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface LocationAddress {
  id: number;
  user_id: number;
  street_address: string;
  city: string;
  state: string;
  zip: number;
  lat: number;
  long: number;
  default: boolean;
}

export interface MyLocationsResponse {
  locations: LocationAddress[];
}

export interface CurrentCityResponse {
  id: number;
}
