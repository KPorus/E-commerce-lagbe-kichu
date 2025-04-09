import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from 'src/schema/users';
import { Products, ProductSchema } from 'src/schema/product';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Orders, OrderSchema } from 'src/schema/order';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Products.name, schema: ProductSchema },
      { name: Orders.name, schema: OrderSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [SellerService],
  controllers: [SellerController],
})
export class SellerModule {}
