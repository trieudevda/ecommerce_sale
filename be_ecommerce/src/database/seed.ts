import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PermissionsService } from '../modules/permissions/permissions.service';
import { RolesService } from '../modules/roles/roles.service';
import { UserService } from '../modules/user/user.service';
import { UserStatusEnum } from '../modules/user/enums/user.enum';
import { seedPermissions } from './permission.seed';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  constructor(
    private readonly permissionService: PermissionsService,
    private readonly roleService: RolesService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    try {
      const existingPers = await this.permissionService.findAll();
      const per = await seedPermissions(this.dataSource);
      if (existingPers?.data.length === 0) {
        const allCodes = per.map((p) => p.code);
        await this.roleService.createRoleWithCodes(
          'Quản trị viên cấp cao',
          'superAdmin',
          allCodes,
        );
        await this.roleService.createRoleWithCodes(
          'Quản trị viên',
          'admin',
          [],
        );
        await this.roleService.createRoleWithCodes('Người dùng', 'user', []);
        await this.roleService.createRoleWithCodes(
          'Khách vãng lai',
          'guest',
          [],
        );
        await this.userService.create({
          email: 'adminsuper@gmail.com',
          password: '123456',
          fullName: 'admin',
          address: 't',
          role: { id: 1 },
          status: UserStatusEnum.ACTIVE,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Seed lỗi:', error.message);
      } else {
        console.error('❌ Seed lỗi không xác định:', error);
      }
      // console.error('❌ Seed lỗi:', error.message);
    }
  }
}
