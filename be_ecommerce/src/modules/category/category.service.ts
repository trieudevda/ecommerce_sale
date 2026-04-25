import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLoggerService } from '../../common/logger/logger.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Transactional } from 'typeorm-transactional';
import { UserRoleEnum } from '../user/enums/user.enum';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly cateRepo: Repository<Category>,
    private readonly logger: CustomLoggerService,
  ) {}
  findAll() {
    const cate = this.cateRepo.find({ where: [{ isActive: true }] });
    return cate;
  }
  @Transactional()
  async create(createCategoryDto: CreateCategoryDto) {
    const check = await this.cateRepo.exists({
      where: [
        { name: createCategoryDto.name },
        { slug: createCategoryDto.slug },
      ],
    });
    if (!check) {
      throw new NotFoundException('Category không tồn tại');
    }
    const cate = this.cateRepo.create(createCategoryDto);
    const savedCate = await this.cateRepo.save(cate);
    if (!savedCate) {
      throw new Error('Create failed');
    }
    return savedCate;
  }
}
