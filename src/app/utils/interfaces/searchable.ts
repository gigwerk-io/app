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
  message: string;
}

export interface SearchResponse {
  users: Searchable[];
}

