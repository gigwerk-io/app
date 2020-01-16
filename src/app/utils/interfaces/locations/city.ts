export interface City {
  id?: number;
  city: string;
  state: string;
  zip: string;
  lat: number;
  long: number;
  description: string;
  image: string;
}

export interface CitiesResponse {
  cities: City[];
}
