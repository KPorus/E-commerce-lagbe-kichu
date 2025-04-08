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
    // Call default JWT authentication first
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) return false;

    // Get the request object
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user's role is one of the allowed roles
    if (
      !user ||
      (user.role !== UserRole.INVENTORY &&
        user.role !== UserRole.MANAGER &&
        user.role !== UserRole.SELLER)
    ) {
      throw new ForbiddenException(
        'Only INVENTORY, MANAGER, or SELLER can access this route',
      );
    }

    return true;
  }
}
