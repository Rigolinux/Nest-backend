import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { check } from 'prettier';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //get metadata from the controller
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //get metadata from the controller
    const validRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    //if there is no metadata, we don't need to validate the role
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new UnauthorizedException('User not found');

    //check if the user has the role authorized
    for (const role of user.role) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid rol ${validRoles}`,
    );
  }
}
