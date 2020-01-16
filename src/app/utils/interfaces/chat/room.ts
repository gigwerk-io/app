export interface Room {
  id: Number;
  pusher_id: string;
  users: any;
  created_at: string;
  updated_at: string;
  members: any;
  last_message: any;
  messages: any;
  [propName: string]: any;
  unread: number;
}

export interface CreateChatResponse {
  id: string;
}
