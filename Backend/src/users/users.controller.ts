import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateOrderDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/search-product')
  searchProduct(
    @Body()
    filters: {
      category?: string;
      name?: string;
      newProduct?: boolean;
      bestArrival?: boolean;
      featured?: boolean;
      specialDiscount?: boolean;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    const products = this.userService.getProduct(filters);
    return products;
  }

  @Get('/get-product/:id')
  getProductById(@Param('id') id: string) {
    return this.userService.getProductById(id);
  }

  @Post('/checkout')
  @UseGuards(JwtGuard)
  async checkout(@GetUser() user, @Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.userService.createOrder(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        user._id,
        createOrderDto,
      );
      return { message: 'Order created successfully', order };
    } catch (error) {
      throw new BadRequestException('Error during checkout: ' + error.message);
    }
  }
  @Get('/view-order')
  @UseGuards(JwtGuard)
  async getOrders(
    @GetUser() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const order = await this.userService.getOrderList(
        user._id,
        Number(page),
        Number(limit),
      );
      return order;
    } catch (error) {
      throw new BadRequestException('Error during checkout: ' + error.message);
    }
  }

  @Post('/post-review/:id')
  @UseGuards(JwtGuard)
  postReviewById(
    @Param('id') id: string,
    @GetUser() user,
    @Body()
    dto: {
      comment: string;
      rating: number;
    },
  ) {
    const data = { ...dto, name: user.username };
    return this.userService.addReview(id, data);
  }

  @Get('/get-review/:id')
  getReviewById(@Param('id') id: string) {
    return this.userService.getReview(id);
  }
}
