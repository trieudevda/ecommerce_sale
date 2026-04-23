import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoleEnum } from '../user/enums/user.enum';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(UserRoleEnum.SUPERADMIN)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permissions('permissions.findAll')
  @Get('/find-all')
  findAll() {
    return this.permissionsService.findAll();
  }
}
