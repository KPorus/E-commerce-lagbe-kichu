import { AdminGuard } from 'src/auth/guard/admin.guard';
import { AdminService } from './admin.service';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUsersQueryDto } from './dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.getAllUsers(query);
  }
  @Patch('/users/:id/')
  toggleUser(@Param('id') id: string) {
    return this.adminService.statusToggle(id);
  }
}
