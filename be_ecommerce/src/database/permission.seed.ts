import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    {
      code: 'permissions.findAll',
      name: 'Tìm tất cả quyền',
      module: 'permissions',
    },

    { code: 'roles.findAll', name: 'Tìm tất cả quyền', module: 'roles' },
    { code: 'roles.findAllRole', name: 'Tìm tất cả quyền', module: 'roles' },
    { code: 'roles.findOne', name: 'Tìm quyền', module: 'roles' },
    { code: 'roles.create', name: 'Tạo quyền', module: 'roles' },
    { code: 'roles.update', name: 'Cập nhật quyền', module: 'roles' },
    {
      code: 'roles.updateRolePer',
      name: 'Cập nhật chi tiết quyền',
      module: 'roles',
    },
    { code: 'roles.remove', name: 'Xoá quyền', module: 'roles' },

    { code: 'user.findAll', name: 'Tìm tất cả người dùng', module: 'user' },
    { code: 'user.findOne', name: 'Chi tiết người dùng', module: 'user' },
    { code: 'user.create', name: 'Tạo người dùng', module: 'user' },
    { code: 'user.update', name: 'Cập nhật người dùng', module: 'user' },
    { code: 'user.remove', name: 'Xoá người dùng', module: 'user' },
    {
      code: 'user.getUserPermissions',
      name: 'Lấy quyền người dùng',
      module: 'user',
    },
    {
      code: 'user.updateUserPermissions',
      name: 'Cập nhật quyền người dùng',
      module: 'user',
    },
  ];

  for (const perm of permissions) {
    const exist = await permissionRepo.findOne({
      where: { code: perm.code },
    });
      // console.log('exist'+perm.code);
    if (!exist) {
      await permissionRepo.save(perm);
    }
  }
return permissions
  // console.log('✅ Seed permissions done');
};
