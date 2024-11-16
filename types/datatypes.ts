export interface Category {
    id: number;
    name: string;
  }

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface Product {
  id: number;
  category_id: string;
  food_name: string;
  price: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}
