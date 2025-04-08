import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  USER = 'USER',
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  INVENTORY = 'INVENTORY',
}
export enum AccountStatus {
  BAN = 'BAN',
  UNBAN = 'UNBAN',
}

@NestSchema()
export class Users {
  _id: string;
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ enum: AccountStatus, default: AccountStatus.UNBAN })
  status: AccountStatus;

  @Prop({ type: Types.ObjectId, ref: 'Users', default: null, index: true })
  created_by: Types.ObjectId | null;

  @Prop({ required: true, default: Date.now() })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(Users);
