import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from './entities/user.entity';
import {Transactional} from 'typeorm-transactional';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FindUserQueryDto} from './dto/find-user-query.dto';
import {DEFAULT_LIMIT, MAX_LIMIT} from '../../config/constant-find';
import {UserRoleEnum, UserStatusEnum} from './enums/user.enum';
import * as bcrypt from 'bcrypt';
import {Role} from '../roles/entities/role.entity';
import {Permission} from '../permissions/entities/permission.entity';
import {CustomLoggerService} from '../../common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly perRepo: Repository<Permission>,
    private readonly logger: CustomLoggerService,
  ) {}

  async findAll({
    email,
    role,
    status,
    page = 1,
    limit,
    sort = 'DESC',
  }: FindUserQueryDto) {
    const configLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const sortOrder: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.userRepo.createQueryBuilder('user');
    // filter
    if (email) {
      qb.andWhere('user.email LIKE :email', {
        email: `%${email}%`,
      });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }
    if (status) {
      qb.andWhere('user.status = :status', { status });
    }
    // pagination
    qb.skip((page - 1) * configLimit).take(limit);
    // sort
    qb.orderBy('user.createdAt', sortOrder);
    qb.skip((page - 1) * configLimit).take(limit);
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

  async findOne({ id, email }: FindUserQueryDto) {
    const user = await this.userRepo.findOne({
      where: [{ id: id }, { email: email }],
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    return user;
  }
  async findByEmailForAuth(email: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { email },
      // select: ['id', 'email', 'password', 'role', 'role.permissions'],
      select: {
        id: true,
        email: true,
        password: true,
        role: {
          id: true,
          slug: true,
          name: true,
          permissions: {
            id: true,
            name: true,
          },
        },
      },
      relations: ['role', 'role.permissions', 'permissions'],
    });
  }
  async findByIdForAuth(id: string): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
        role: {
          id: true,
          name: true,
          slug: true,
          permissions: true,
        },
      },
      relations: ['role', 'role.permissions', 'permissions'],
    });
  }
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    let hashedToken = null;
    if (refreshToken) {
      hashedToken = await bcrypt.hash(refreshToken, 10);
    }
    await this.userRepo.update(userId, {
      refreshToken: hashedToken as any,
    });
  }
  @Transactional()
  async create(createUserDto: CreateUserDto) {
    let role = null;
    const checkUser = await this.userRepo.findOneBy({
      email: createUserDto.email,
    });
    if (checkUser) {
      throw new NotFoundException('Người dùng đã tồn tại');
    }
    role = await this.roleRepo.findOne({
      where: [{ id: createUserDto.role?.id }, { slug: UserRoleEnum.USER }],
    });
    if (!role) {
      // throw new NotFoundException('Role không tồn tại');
      role = await this.roleRepo.findOne({
        where: { slug: UserRoleEnum.USER },
      });
    }
    const user = this.userRepo.create({
      ...createUserDto,
      role: {
        id: role?.id,
      },
      // role: role,
    });
    const savedUser = await this.userRepo.save(user);
    if (!savedUser) {
      throw new Error('Create failed');
    }
    return {
      status: 'success',
    };
  }
  @Transactional()
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    const updatedUser = this.userRepo.merge(user, updateUserDto);
    const result = await this.userRepo.save(updatedUser);
    return result;
  }
  @Transactional()
  async remove(id: string) {
    const user = await this.userRepo.findOneBy({ id: id });
    const status = { status: UserStatusEnum.DELETED };
    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }
    const deletedUser = this.userRepo.merge(user, status);
    const result = await this.userRepo.save(deletedUser);
    return result;
  }
  async checkUserPermission(
    userId: string,
    permissionCode: string,
  ): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });
    if (!user || !user.role) return false;
    return user.role.permissions.some((p) => p.code === permissionCode);
  }
  async getUserPermissions(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }
  async updateUserPermissions(id: string, permissionIds: number[]) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!user) {
      return new NotFoundException('User không tồn tại');
    }
    const permissions = await this.perRepo.findByIds(permissionIds);

    user.permissions = permissions;

    return this.userRepo.save(user);
  }
}
