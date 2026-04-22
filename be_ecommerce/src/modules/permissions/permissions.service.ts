import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindRoleQueryDto } from '../roles/dto/find-role-query.dto';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../config/constant-find';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private repo: Repository<Permission>,
  ) {}
  async findAll() {
    const data = await this.repo.find();
    return {
      data,
    };
  }
  async createMany(data: Partial<Permission>[]) {
    return this.repo.upsert(data, ['code']);
  }

}
