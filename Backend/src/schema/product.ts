import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  CLOTHING = 'Clothing',
  FURNITURE = 'Furniture',
  BEAUTY = 'Beauty',
  SPORTS = 'Sports',
  UNKNOWN = 'Unknown',
}
@NestSchema()
export class Products {
  _id: string;

  @Prop({ required: true, unique: true, index: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    index: true,
    enum: ProductCategory,
    default: ProductCategory.UNKNOWN,
  })
  category: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ required: true })
  previewVideo: string;

  @Prop({ type: Types.ObjectId, ref: 'Users', default: null, index: true })
  Owner: Types.ObjectId | null;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
ProductSchema.index({ _id: 1 }, { background: true });
