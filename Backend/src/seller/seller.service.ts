import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto';
import { Users } from 'src/schema/users';
import { Model, Types } from 'mongoose';
import { handleMongoErrors } from 'src/utils/error.handle';
import { encryptPassword } from 'src/auth/encrypt';
import { Products } from 'src/schema/product';
import { Orders } from 'src/schema/order';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(Products.name) private productModel: Model<Products>,
    @InjectModel(Orders.name) private orderModel: Model<Orders>,
  ) {}

  async getProductByTitle(title: string) {
    try {
      const product = await this.productModel.findOne({ title });
      return product;
    } catch (error) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while fetching product',
        );
      }
    }
  }

  async addProduct(dto: any) {
    try {
      const product = new this.productModel(dto);
      await product.save();
      return product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while adding product',
        );
      }
    }
  }
  async getProducts(id: string) {
    try {
      const products = await this.productModel.find({ Owner: id });
      if (products.length === 0) {
        throw new NotFoundException('No products found for this seller');
      }
      return products;
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while fetching products',
        );
      }
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.productModel.deleteOne({ _id: id });
      if (product.deletedCount === 0) {
        throw new NotFoundException('Product not found');
      }
      return { message: 'Product deleted successfully', data: product };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while deleting product',
        );
      }
    }
  }

  async updateProduct(id: string, updateProductDto: any) {
    try {
      const product = await this.productModel.updateOne(
        { _id: id },
        { $set: updateProductDto },
      );

      if (product.matchedCount === 0) {
        throw new NotFoundException('Product not found');
      }
      return {
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while updating product',
        );
      }
    }
    return;
  }
  async createUsers(dto: CreateUserDto, id: string) {
    try {
      const encrypt = await encryptPassword(dto.pass);
      const hash = encrypt.iv + ':' + encrypt.key + ':' + encrypt.encryptedText;
      const user = new this.userModel({
        username: dto.username,
        email: dto.email,
        password: hash,
        role: dto.role,
        created_by: new Types.ObjectId(id),
      });
      await user.save();
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        create_by: user.created_by,
        message: `${user.role} created successfully`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while creating user',
        );
      }
    }
  }

  async getOrders(id: string) {
    try {
      const orders = await this.orderModel.find({
        'products.sellerID': id,
      });
      if (orders.length === 0) {
        throw new NotFoundException('No orders found for this seller');
      }
      return orders;
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while fetching orders',
        );
      }
    }
  }

  async updateOrdersStatus(userId: string, orderID: string, status: string) {
    console.log(status, userId);
    try {
      const order = await this.orderModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(orderID),
          'products.sellerID': new Types.ObjectId(userId),
        },
        { $set: { status } },
        { new: true },
      );

      if (!order) {
        throw new NotFoundException('No orders found for this seller');
      }

      return order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while updating order status',
        );
      }
    }
  }
}
