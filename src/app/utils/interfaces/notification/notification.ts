export interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  action: {
    page: string;
    params: any;
  };
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  notifications: number;
  friends: number;
}

export interface NotificationsResponse {
  notifications: Notification[];
}
