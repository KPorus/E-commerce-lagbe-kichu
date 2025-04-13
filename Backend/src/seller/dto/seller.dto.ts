import { Types } from 'mongoose';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductCategory } from 'src/schema/product';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  pass: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  quantity: number;

  @IsBoolean()
  @IsOptional()
  bestArrival?: boolean;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsBoolean()
  @IsOptional()
  newProduct?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsBoolean()
  @IsOptional()
  specialDiscount?: boolean;

  @IsNumber()
  @IsOptional()
  discountDurationInDays?: number;

  @IsOptional()
  Owner?: Types.ObjectId;
}
