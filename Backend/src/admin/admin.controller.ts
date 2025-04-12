import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUsersQueryDto } from './dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getAllUsers(query);
  }
  @Post('/users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }
  @Post('/users/:id/unban')
  unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }
}
