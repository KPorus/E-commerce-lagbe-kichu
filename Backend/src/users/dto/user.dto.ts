import { IsArray, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  products: { productId: string; quantity: number; price: number }[];

  @IsNumber()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  paymentMethod: string;
}

export interface ProductDetails {
  productId: string;
  quantity: number;
  totalPrice: number;
  productTitle: string;
  productPrice: number;
  productImages: string[];
}
