import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerGuard } from 'src/auth/guard/seller.guard';
import { ManagerGuard } from 'src/auth/guard/manager.guard';
import { CreateUserDto } from './dto';

@Controller('seller')
@UseGuards(SellerGuard)
export class SellerController {
  constructor(private sellerService: SellerService) {}
  @UseGuards(ManagerGuard)
  @Get('/products')
  getProducts() {
    return this.sellerService;
  }

  @Post('/create/:id')
  createUsers(@Param('id') id: string, @Body() dto: CreateUserDto) {
    return this.sellerService.createUsers(dto, id);
  }
}
