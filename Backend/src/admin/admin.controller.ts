import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getAllUsers() {
    return this.adminService.getAllUsers();
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
