export interface MainCategory {
  id?: number;
  name?: string;
  icon?: string;
  icon_image?: string;
  active: boolean;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: MainCategory[];
}
