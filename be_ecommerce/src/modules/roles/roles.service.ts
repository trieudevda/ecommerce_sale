import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository, In } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../config/constant-find';
import { FindRoleQueryDto } from './dto/find-role-query.dto';
import { Transactional } from 'typeorm-transactional';
import { CreateRoleDto } from './dto/create-role.dto';
import {UserStatusEnum} from "../user/enums/user.enum";
import {FindUserQueryDto} from "../user/dto/find-user-query.dto";
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {UpdateRoleDto} from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private perRepo: Repository<Permission>,
  ) {}

  async createRoleWithCodes(name: string, slug: string, codes: string[]) {
    const permissions = await this.perRepo.findBy({
      code: In(codes),
    });
    const role = this.roleRepo.create({
      name,
      slug,
      permissions,
    });
    return this.roleRepo.save(role);
  }
  async findAll({
    name,
    slug,
    page = 1,
    limit,
    sort = 'DESC',
  }: FindRoleQueryDto) {
    const configLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const sortOrder: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.roleRepo.createQueryBuilder('roles');
    if (name) {
      qb.andWhere('roles.name LIKE :name', {
        name: `%${name}%`,
      });
    }
    if (slug) {
      qb.andWhere('roles.slug = :slug', { slug });
    }
    qb.orderBy('roles.id', sortOrder);
    qb.skip((page - 1) * configLimit).take(configLimit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: {
        total,
        page,
        limit: configLimit,
        totalPages: Math.ceil(total / configLimit),
      },
    };
  }
  async findAllRole() {
    const role = await this.roleRepo.find({ relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return role;
  }
  async findOne({ id }: FindRoleQueryDto) {
    const role = await this.roleRepo.findOne({
      where: [{ id: id }],
    });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return role;
  }
  async findOneSlug(slug: string) {
    const role = await this.roleRepo.findOne({
      where: [{ slug: slug }],
    });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    return role;
  }
  @Transactional()
  async create(createRoleDto: CreateRoleDto) {
    const check = await this.roleRepo.findOneBy([
      { name: createRoleDto.name },
      { slug: createRoleDto.slug },
    ]);
    if (check != null) {
      const isNameDuplicate = check.name === createRoleDto.name;
      const message = isNameDuplicate
        ? `Role với tên '${createRoleDto.name}' đã tồn tại`
        : `Slug '${createRoleDto.slug}' đã bị trùng`;
      throw new ConflictException(message);
    }
    const role = this.roleRepo.create(createRoleDto);
    const savedRole = await this.roleRepo.save(role);
    if (!savedRole) {
      throw new BadRequestException('Create role failed');
    }
    return savedRole;
  }
  @Transactional()
  async updateRolePer(id: number, data: any) {
    const role = await this.roleRepo.findOne({
      where: { id: id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    if (data.removed && data.removed.length > 0) {
      role.permissions = role.permissions.filter(
        (p) => !data.removed.includes(p.id),
      );
    }
    if (data.added && data.added.length > 0) {
      const existingIds = role.permissions.map((p) => p.id);
      const uniqueNewPers = data.added
        .filter((id: number) => !existingIds.includes(id))
        .map((id: number) => ({ id }) as Permission);

      role.permissions = [...role.permissions, ...uniqueNewPers];
    }
    return await this.roleRepo.save(role);
  }
  @Transactional()
  async update(id: number, updateUserDto: UpdateRoleDto) {
    const role = await this.roleRepo.findOneBy({ id: id });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    const updatedUser = this.roleRepo.merge(role, updateUserDto);
    const result = await this.roleRepo.save(updatedUser);
    return result;
  }
  @Transactional()
  async remove(id: number) {
    const role = await this.roleRepo.findOneBy({ id: id });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    const result = await this.roleRepo.delete(id);
    return result;
  }
}
