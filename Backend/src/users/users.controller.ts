import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateOrderDto } from './dto';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
@UseGuards(JwtGuard)
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
  @Get('view-order')
  async getOrders(@GetUser() user) {
    try {
      console.log(user);
      const order = await this.userService.getOrderList(user._id);
      return order;
    } catch (error) {
      throw new BadRequestException('Error during checkout: ' + error.message);
    }
  }
}
