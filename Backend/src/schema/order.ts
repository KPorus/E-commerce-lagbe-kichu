import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  COMPLETED = 'Completed',
}

@NestSchema({ timestamps: true })
export class Orders extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true, index: true })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  products: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: String, required: true })
  paymentMethod: string;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    index: true,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Orders);
OrderSchema.index({ user: 1, status: 1 }, { background: true });
