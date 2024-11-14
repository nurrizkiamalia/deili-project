export interface Category {
    id: number;
    name: string;
  }
  
  export interface Product {
    id: number;
    category_id: number;
    food_name: string;
    image_url: string;
    price: number;
  }
  
  export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
  }
  