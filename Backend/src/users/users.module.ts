import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users, UserSchema } from 'src/schema/users';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from 'src/schema/product';
import { Orders, OrderSchema } from 'src/schema/order';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Products.name, schema: ProductSchema },
      { name: Orders.name, schema: OrderSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
