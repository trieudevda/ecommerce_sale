import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../../modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPerms) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const rolePerms =
      user.role?.permissions?.map((p: Permission) => p.code) || [];
    const userPerms = user.permissions?.map((p: Permission) => p.code) || [];

    const finalPerms = new Set([...rolePerms, ...userPerms]);

    return requiredPerms.some((p) => finalPerms.has(p));
  }
}
