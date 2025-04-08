import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/schema/users';

@Injectable()
export class CombinGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) return false;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user ||
      (user.role !== UserRole.ACCOUNTANT &&
        user.role !== UserRole.MANAGER &&
        user.role !== UserRole.SELLER)
    ) {
      throw new ForbiddenException(
        'Only ACCOUNTANT, MANAGER, or SELLER can access this route',
      );
    }

    return true;
  }
}
