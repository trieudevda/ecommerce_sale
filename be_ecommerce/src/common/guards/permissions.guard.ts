import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../../modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
    //   PERMISSIONS_KEY,
    //   [context.getHandler(), context.getClass()],
    // );
    // if (!requiredPermissions) {
    //   return true;
    // }
    // const { user } = context.switchToHttp().getRequest();
    // if (!user) {
    //   throw new ForbiddenException('Người dùng chưa được xác thực');
    // }
    // const hasPermission = requiredPermissions.every((permission) => user.role?.permissions?.some((p)=> p.code === permission)
    // );
    // if (!hasPermission) {
    //   throw new ForbiddenException(
    //     'Bạn không có quyền thực hiện hành động này',
    //   );
    // }
    // return true;
    const requiredPerms = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPerms) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const rolePerms = user.role?.permissions?.map((p) => p.code) || [];
    const userPerms = user.permissions?.map((p) => p.code) || [];

    const finalPerms = new Set([...rolePerms, ...userPerms]);

    return requiredPerms.some((p) => finalPerms.has(p));
  }
}
