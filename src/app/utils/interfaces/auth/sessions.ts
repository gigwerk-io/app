export interface Sessions {
  id: number;
  token: string;
  user_id: number;
  ip_address: string;
  user_agent: string;
  expiration_date: string;
  killed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionResponse {
  sessions: Sessions[];
}
