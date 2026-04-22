import {Injectable, OnApplicationBootstrap} from '@nestjs/common';
import {PermissionsService} from '../modules/permissions/permissions.service';
import {RolesService} from '../modules/roles/roles.service';
import {UserService} from "../modules/user/user.service";
import {UserStatusEnum} from "../modules/user/enums/user.enum";
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
      if (existingPers?.data.length === 0) {
      console.log('✅ chuan bi Seed dữ liệu thành công!');
      const per = await seedPermissions(this.dataSource);
      console.log('✅ Seed dữ liệu thành công!');
      //   console.log('🌱 Đang khởi tạo dữ liệu RBAC...');
      //   const allPermissions = [
      //     // Module User
      //     { code: 'USER_VIEW', name: 'Xem người dùng', module: 'User' },
      //     { code: 'USER_CREATE', name: 'Tạo người dùng', module: 'User' },
      //     { code: 'USER_UPDATE', name: 'Sửa người dùng', module: 'User' },
      //     { code: 'USER_DELETE', name: 'Xóa người dùng', module: 'User' },
      //
      //     // Module Product
      //     { code: 'PRODUCT_VIEW', name: 'Xem sản phẩm', module: 'Product' },
      //     { code: 'PRODUCT_CREATE', name: 'Thêm sản phẩm', module: 'Product' },
      //     { code: 'PRODUCT_UPDATE', name: 'Sửa sản phẩm', module: 'Product' },
      //     { code: 'PRODUCT_DELETE', name: 'Xóa sản phẩm', module: 'Product' },
      //
      //     // Module Category
      //     { code: 'CATEGORY_VIEW', name: 'Xem danh mục', module: 'Category' },
      //     {
      //       code: 'CATEGORY_CREATE',
      //       name: 'Thêm danh mục',
      //       module: 'Category',
      //     },
      //     { code: 'CATEGORY_UPDATE', name: 'Sửa danh mục', module: 'Category' },
      //     { code: 'CATEGORY_DELETE', name: 'Xóa danh mục', module: 'Category' },
      //
      //     // Module Order
      //     { code: 'ORDER_VIEW', name: 'Xem đơn hàng', module: 'Order' },
      //     { code: 'ORDER_UPDATE', name: 'Cập nhật đơn hàng', module: 'Order' },
      //     { code: 'ORDER_DELETE', name: 'Xóa đơn hàng', module: 'Order' },
      //   ];
      //   // Tạo Permissions
      //   await this.permissionService.createMany(allPermissions);
      const allCodes = per.map((p) => p.code);
      //   // Tạo Role
      // const per  = this.permissionService.findAll();
      await this.roleService.createRoleWithCodes(
        'Quản trị viên',
        'superAdmin',
        allCodes,
      );
      await this.userService.create({
        email: 'adminsuper@gmail.com',
        password: '123456',
        fullName: 'admin',
        address: 't',
        role: { id: 1 },
        status: UserStatusEnum.ACTIVE,
      });
      //
      //   console.log('✅ Seed dữ liệu thành công!');
      }
    } catch (error) {
      console.error('❌ Seed lỗi:', error.message);
    }
  }
}
