import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { Users } from 'src/schema/users';
import { Model, Types } from 'mongoose';
import { handleMongoErrors } from 'src/utils/error.handle';
import { encryptPassword } from 'src/auth/encrypt';

@Injectable()
export class SellerService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  getProducts() {
    return 'List of products for seller';
  }

  async createUsers(dto: CreateUserDto, id: string) {
    try {
      const encrypt = await encryptPassword(dto.pass);
      const hash = encrypt.iv + ':' + encrypt.key + ':' + encrypt.encryptedText;
      const user = new this.userModel({
        username: dto.username,
        email: dto.email,
        password: hash,
        role: dto.role,
        created_by: new Types.ObjectId(id),
      });
      await user.save();
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        create_by: user.created_by,
        message: `${user.role} created successfully`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleMongoErrors(error);
      } else {
        throw new BadRequestException(
          'Unknown error occurred while creating user',
        );
      }
    }
  }
}
