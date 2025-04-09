import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';

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
}
