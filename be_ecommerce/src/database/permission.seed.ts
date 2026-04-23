import { DataSource } from 'typeorm';
import { Permission } from '../modules/permissions/entities/permission.entity';
import data from './permission.json';

export const seedPermissions = async (dataSource: DataSource) => {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = data;

  for (const perm of permissions) {
    const exist = await permissionRepo.findOne({
      where: { code: perm.code },
    });
    if (!exist) {
      await permissionRepo.save(perm);
    }
  }
  return permissions;
};
