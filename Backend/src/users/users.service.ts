import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Orders, OrderStatus } from 'src/schema/order';
import { Products } from 'src/schema/product';
import { Users } from 'src/schema/users';
import { handleMongoErrors } from 'src/utils/error.handle';
import { CreateOrderDto, ProductDetails } from './dto';

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
        { $unwind: '$seller' },
        // { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } }, // document will be returned even if there are no seller data
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

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const session = await this.productModel.db.startSession();
    session.startTransaction();

    try {
      const productIds = createOrderDto.products.map((item) => item.productId);
      const products = await this.productModel
        .find({
          _id: { $in: productIds },
        })
        .session(session);

      // Even though below condition is not required, cause frontend will show only visiable product. It is a good practice to check if the products exist in the database.
      if (products.length !== createOrderDto.products.length) {
        throw new BadRequestException(
          'Some products in the order do not exist.',
        );
      }

      const bulkUpdateOps = createOrderDto.products.map((item) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(item.productId) },
          update: [
            {
              $set: {
                quantity: {
                  $cond: {
                    if: { $gte: ['$quantity', item.quantity] },
                    then: { $subtract: ['$quantity', item.quantity] },
                    else: '$quantity',
                  },
                },
              },
            },
          ],
          upsert: false,
        },
      }));

      const bulkWriteResult = await this.productModel.bulkWrite(bulkUpdateOps, {
        session,
      });

      if (bulkWriteResult.modifiedCount !== createOrderDto.products.length) {
        throw new BadRequestException('Not enough stock for some products.');
      }
      const newOrder = new this.orderModel({
        user: new Types.ObjectId(userId),
        products: createOrderDto.products,
        totalAmount: createOrderDto.totalAmount,
        shippingAddress: createOrderDto.shippingAddress,
        paymentMethod: createOrderDto.paymentMethod,
        status: OrderStatus.PENDING,
      });

      await newOrder.save({ session });
      await session.commitTransaction();
      await session.endSession();

      return newOrder;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      if (error instanceof Error) {
        handleMongoErrors(error);
      }
      throw new BadRequestException(
        'Error creating the order: ' + error.message,
      );
    }
  }
  async getOrderList(userId: string): Promise<ProductDetails[]> {
    try {
      const orders = await this.orderModel.aggregate([
        { $match: { user: new Types.ObjectId(userId) } },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' },
        {
          $project: {
            productId: '$products.productId',
            quantity: '$products.quantity',
            productTitle: '$productDetails.title',
            productPrice: '$productDetails.price',
            productImages: '$productDetails.images',
            totalPrice: {
              $multiply: ['$products.quantity', '$productDetails.price'],
            },
          },
        },
        {
          $group: {
            _id: '$productId',
            quantity: { $sum: '$quantity' },
            totalPrice: { $sum: '$totalPrice' },
            productTitle: { $first: '$productTitle' },
            productPrice: { $first: '$productPrice' },
            productImages: { $first: '$productImages' },
          },
        },
        {
          $project: {
            productId: '$_id',
            quantity: 1,
            totalPrice: 1,
            productTitle: 1,
            productPrice: 1,
            productImages: 1,
          },
        },
      ]);

      return orders as ProductDetails[];
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
