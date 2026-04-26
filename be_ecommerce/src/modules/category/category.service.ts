import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CustomLoggerService } from '../../common/logger/logger.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Transactional } from 'typeorm-transactional';
import { UserRoleEnum } from '../user/enums/user.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';
import slugify from 'slugify';
import { createUniqueSlug } from 'src/common/helpers/slug.helper';
import { DEFAULT_LIMIT, MAX_LIMIT } from 'src/config/constant-find';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly cateRepo: Repository<Category>,
    private readonly logger: CustomLoggerService,
  ) {}
  async findAll({
    name,
    slug,
    isTree = false,
    page = 1,
    limit,
    sort = 'DESC',
  }: FindCategoryQueryDto) {
    if (isTree) {
      // const treeRepo = this.cateRepo.manager.getTreeRepository(Category);
      // const category = await this.cateRepo.findOne({ where: { id } });
      // const children = await treeRepo.findDescendants(category); // children của 1 node
      // const parents = await treeRepo.findAncestors(category); //parent chain
      const treeRepo = this.cateRepo.manager.getTreeRepository(Category);
      const data = await treeRepo.findTrees();
      return { data };
    }
    const configLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const sortOrder: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.cateRepo.createQueryBuilder('categories');
    qb.leftJoinAndSelect('categories.parent', 'parent');
    // filter
    if (slug) {
      qb.andWhere('categories.slug = :slug', { slug });
    }
    if (name) {
      qb.andWhere('categories.name = :name', { name });
    }
    // pagination
    qb.skip((page - 1) * configLimit).take(limit);
    // sort
    qb.orderBy('categories.createdAt', sortOrder);
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
  @Transactional()
  async create(createCategoryDto: CreateCategoryDto) {
    const { parentId, ...rest } = createCategoryDto;
    const slug = await createUniqueSlug(createCategoryDto.name, async (s) => {
      const exist = await this.cateRepo.findOne({ where: { slug: s } });
      return !!exist;
    });
    let parent = parentId
      ? await this.cateRepo.findOneBy({ id: parentId })
      : undefined;
    parent = parent || undefined;
    const data: DeepPartial<Category> = { ...rest, slug, parent };
    const cate = this.cateRepo.create(data);
    const savedCate = await this.cateRepo.save(cate);
    if (!savedCate) {
      throw new Error('Create failed');
    }
    return true;
  }
}
