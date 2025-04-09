import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  FURNITURE = 'FURNITURE',
  BEAUTY = 'BEAUTY',
}

@NestSchema({ timestamps: true })
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

  @Prop({ type: Number, default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: Number, default: 0, min: 0, max: 20 })
  discount: number;

  @Prop({ type: [String], default: [] })
  reviews: string[];

  // Flags
  @Prop({ default: false })
  bestArrival: boolean;

  @Prop({ default: false })
  newProduct: boolean;

  @Prop({ default: false })
  specialDiscount: boolean;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ type: Date, default: null })
  discountEndTime: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
ProductSchema.index({ _id: 1 }, { background: true });
ProductSchema.index({ category: 1 }, { background: true });
ProductSchema.index({ bestArrival: 1 }, { background: true });
ProductSchema.index({ newProduct: 1 }, { background: true });
ProductSchema.index({ featured: 1 }, { background: true });
ProductSchema.index({ specialDiscount: 1 }, { background: true });
