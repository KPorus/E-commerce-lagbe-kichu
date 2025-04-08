import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Orders } from 'src/schema/order';
import { Products } from 'src/schema/product';
import { Users } from 'src/schema/users';
import { handleMongoErrors } from 'src/utils/error.handle';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(Products.name) private productModel: Model<Products>,
    @InjectModel(Orders.name) private orderModel: Model<Orders>,
  ) {}

  async getProductById(id: string): Promise<Products> {
    try {
      const objectId = new Types.ObjectId(id);

      const product = await this.productModel.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: 'users',
            localField: 'Owner',
            foreignField: '_id',
            as: 'seller',
          },
        },
        { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            category: 1,
            price: 1,
            images: 1,
            previewVideo: 1,
            created_at: 1,
            seller: {
              _id: '$seller._id',
              username: '$seller.username',
              email: '$seller.email',
            },
          },
        },
      ]);

      if (!product || product.length === 0) {
        throw new BadRequestException('Product not found');
      }

      return product[0] as Products;
    } catch (error) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      }
      throw new BadRequestException(
        'Error fetching product: ' + (error as Error).message,
      );
    }
  }

  async getProduct(filters: {
    category?: string;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Products[]> {
    try {
      const matchStage: any = {};

      if (filters.category) {
        matchStage.category = filters.category;
      }

      if (filters.name) {
        matchStage.title = { $regex: filters.name, $options: 'i' };
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        matchStage.price = {};
        if (filters.minPrice !== undefined) {
          matchStage.price.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          matchStage.price.$lte = filters.maxPrice;
        }
      }

      const products = await this.productModel.aggregate([
        { $match: matchStage },
        { $sort: { created_at: -1 } },
      ]);

      return products as Products[];
    } catch (error) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      }
      throw new BadRequestException(
        'Error fetching products: ' + (error as Error).message,
      );
    }
  }
}
