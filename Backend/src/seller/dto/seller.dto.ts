import { Types } from 'mongoose';
import {
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

  // @IsArray()
  // @IsString({ each: true })
  // images: string[];

  // @IsString()
  // @IsNotEmpty()
  // previewVideo: string;

  @IsOptional()
  Owner?: Types.ObjectId;
}
