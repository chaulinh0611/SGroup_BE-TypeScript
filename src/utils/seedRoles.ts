import { AppDataSource } from '../config/data-source';
import { Role } from '../entities/Role.entity';
import { Permission } from '../entities/Permission.entity';

export const seedRoles = async () => {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();

  const permissionRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);

  const perms = [
    'workspace:create',
    'workspace:read',
    'workspace:update',
    'workspace:delete',
    'board:create',
    'board:read',
    'board:update',
    'board:delete',
  ];

  // Tạo hoặc lấy Permission
  const permissionEntities: Permission[] = [];
  for (const p of perms) {
    let perm = await permissionRepo.findOne({ where: { name: p } });
    if (!perm) {
      perm = permissionRepo.create({ name: p });
      await permissionRepo.save(perm);
    }
    permissionEntities.push(perm);
  }

  // Tạo ADMIN Role
  let adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' }, relations: ['permissions'] });
  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'ADMIN', permissions: permissionEntities });
    await roleRepo.save(adminRole); // <- Lúc này TypeORM sẽ tự điền vào bảng roles_permissions_permissions
  }

  // Tạo USER Role chỉ với quyền đọc
  let userRole = await roleRepo.findOne({ where: { name: 'USER' }, relations: ['permissions'] });
  if (!userRole) {
    const readPerms = permissionEntities.filter((p) => p.name.includes(':read'));
    userRole = roleRepo.create({ name: 'USER', permissions: readPerms });
    await roleRepo.save(userRole); // <- Lúc này cũng sẽ điền vào bảng trung gian
  }

  console.log('✅ Seed roles and permissions done!');
};
