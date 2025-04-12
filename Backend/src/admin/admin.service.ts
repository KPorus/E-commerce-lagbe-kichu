import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountStatus, Users } from 'src/schema/users';
import { handleMongoErrors } from 'src/utils/error.handle';
import { GetUsersQueryDto } from './dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async getAllUsers(
    query: GetUsersQueryDto,
  ): Promise<{ data: Users[]; total: number }> {
    console.log(query);
    const { role, status, text, page = 1, limit = 10 } = query;
    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (text) {
      filter.$or = [
        { name: { $regex: text, $options: 'i' } },
        { email: { $regex: text, $options: 'i' } },
      ];
    }

    const users = await this.userModel.aggregate([
      { $match: filter },
      { $project: { password: 0 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const total = await this.userModel.countDocuments(filter);

    return { data: users as Users[], total };
  }

  async statusToggle(id: string) {
    try {
      const users = await this.userModel.updateOne({ _id: id }, [
        {
          $set: {
            status: {
              $cond: [
                { $eq: ['$status', 'BAN'] },
                AccountStatus.UNBAN,
                AccountStatus.BAN,
              ],
            },
          },
        },
      ]);

      if (users.modifiedCount === 0) {
        throw new NotFoundException('No users found');
      }

      return {
        message: 'User status updated.',
        data: users,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      }
      throw new BadRequestException(
        'Unknown error occurred while banning user',
      );
    }
  }
}
