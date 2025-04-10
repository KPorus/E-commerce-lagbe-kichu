export interface Product {
  _id: string;
  title: string;
  description: string;
  category: "ELECTRONICS" | "CLOTHING" | "FURNITURE" | "BEAUTY";
  price: number;
  quantity: number;
  images: string[];
  previewVideo: string;
  Owner: string;
  created_at: Date;
  rating: number;
  discount: number;
  reviews: string[];
  bestArrival: boolean;
  newProduct: boolean;
  specialDiscount: boolean;
  featured: boolean;
  discountEndTime: Date | null;
}

export interface cartProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  Owner: string;
  rating?: number;
  description?: string;
  discount?: number;
}
export interface IProductCard {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  images: string[];
  Owner: string;
  rating?: number;
  description: string;
  discount?: number;
}



