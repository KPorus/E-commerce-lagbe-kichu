import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountStatus, Users } from 'src/schema/users';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async getAllUsers(): Promise<Users[]> {
    const users = await this.userModel.aggregate([
      {
        $project: {
          password: 0,
        },
      },
    ]);

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users as Users[];
  }
  async banUser(id: string) {
    try {
      const users = await this.userModel.updateOne(
        { _id: id },
        { $set: { status: AccountStatus.BAN } },
      );

      if (users.modifiedCount === 0) {
        throw new NotFoundException('No users found');
      }

      return {
        message: 'User banned successfully',
        data: users,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error: ${error.message}`);
      }
      throw new BadRequestException(
        'Unknown error occurred while banning user',
      );
    }
  }
  async unbanUser(id: string) {
    try {
      const users = await this.userModel.updateOne(
        { _id: id },
        { $set: { status: AccountStatus.UNBAN } },
      );

      if (users.modifiedCount === 0) {
        throw new NotFoundException('No users found');
      }

      return {
        message: 'User unbanned successfully',
        data: users,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error: ${error.message}`);
      }
      throw new BadRequestException(
        'Unknown error occurred while unbanning user',
      );
    }
  }
}
