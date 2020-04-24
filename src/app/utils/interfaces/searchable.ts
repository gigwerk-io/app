import {Profile} from './user';

export class Searchable {
  id: number;
  name: string;
  username: string;
  profile: Profile;
}

export interface RecommendedFriendsResponse {
  recommendations: Searchable[];
}

export interface MyFriendsResponse {
  friends: Searchable[];
}

export interface FriendRequestsResponse {
  requests: Searchable[];
}

export interface GenericResponse {
  success?: boolean;
  message: string;
  data?: any;
}

export interface SearchResponse {
  users: Searchable[];
}

