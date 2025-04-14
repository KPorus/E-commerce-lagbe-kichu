export interface Product {
  productId: string;
  quantity: number;
  price: number;
  sellerID: string;
  _id: string;
  productTitle: string;
}

export interface IOrder {
  _id: string;
  user: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface IOrderResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  orders: IOrder[];
}
