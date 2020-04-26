export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: any;
  read_at: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  notifications: number;
  friends: number;
}
