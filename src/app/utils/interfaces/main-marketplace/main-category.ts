export interface MainCategory {
  id?: number;
  name?: string;
  icon?: string;
  icon_image?: string;
  active: boolean;
}

export interface CategoryResponse {
  categories: MainCategory[];
}
