import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { CustomLoggerService } from '../../common/logger/logger.service';
import { Transactional } from 'typeorm-transactional';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';
import { createUniqueSlug } from 'src/common/helpers/slug.helper';
import { DEFAULT_LIMIT, MAX_LIMIT } from 'src/config/constant-find';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryAttribute } from '../category_attribute/entities/category_attribute.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly cateRepo: Repository<Category>,
    @InjectRepository(CategoryAttribute)
    private readonly cateAttrRepo: Repository<CategoryAttribute>,
    private readonly logger: CustomLoggerService,
  ) { }
  async findAll({
    name,
    slug,
    isTree = false,
    isActive = false,
    page = 1,
    limit,
    sort = 'DESC',
  }: FindCategoryQueryDto) {
    const configLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const sortOrder: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.cateRepo.createQueryBuilder('categories');
    qb.where('categories.isActive = :isActive', { isActive })
    qb.leftJoinAndSelect('categories.parent', 'parent');
    qb.leftJoin('categories.attributes', 'attributes');
    qb.addSelect(['attributes.id', 'attributes.name']);
    // filter
    if (slug) {
      qb.andWhere('categories.slug = :slug', { slug });
    }
    if (name) {
      qb.andWhere('categories.name = :name', { name });
    }
    // sort
    qb.orderBy('categories.createdAt', sortOrder);
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
  async find({ id, name, slug, isActive = false }: FindCategoryQueryDto) {
    const cate = await this.cateRepo.findOne({
      where: [{ slug: slug }, { isActive: isActive }],
      relations: ['attributes', 'parent']
    });
    if (!cate) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return cate;
  }
  @Transactional()
  async create(createCategoryDto: CreateCategoryDto) {
    const { attributeIds, parentId, ...rest } = createCategoryDto;
    const slug = await createUniqueSlug(createCategoryDto.name, async (s) => {
      const exist = await this.cateRepo.findOne({ where: { slug: s } });
      return !!exist;
    });
    let parent = parentId
      ? await this.cateRepo.findOneBy({ id: parentId })
      : undefined;
    if (!parent) {
      throw new BadRequestException(`Không tìm thấy danh mục cha có ID ${parentId}`);
    }
    let attributes = attributeIds && attributeIds.length > 0
      ? await this.cateAttrRepo.find({ where: { id: In(attributeIds as number[]) } })
      : undefined;
    parent = parent || undefined;
    const data: DeepPartial<Category> = { ...rest, slug, parent, attributes };
    const cate = this.cateRepo.create(data);
    const savedCate = await this.cateRepo.save(cate);
    if (!savedCate) {
      throw new Error('Create failed');
    }
    return true;
  }
  @Transactional()
  async update(slug: string, updateCateDto: UpdateCategoryDto) {
    const category = await this.cateRepo.findOneBy({ slug: slug });
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    const { parentId, attributeIds, ...updateData } = updateCateDto;
    const updatedate = await this.cateRepo.merge(category, updateData);
    if (attributeIds && attributeIds.length > 0) {
      const cateAttr = await this.cateAttrRepo.find({ where: { id: In(attributeIds as number[]) } });
      updatedate.attributes = cateAttr;
    }
    if (parentId) {
      const cateParent = await this.cateAttrRepo.findOne({ where: { id: parentId } });
      updatedate.parent = cateParent as any;
    }
    const result = await this.cateRepo.save(updatedate);
    return result;
  }
  @Transactional()
  async remove(slug: string) {
    const cate = await this.cateRepo.findOneBy({ slug: slug });
    const isActive = { isActive: false };
    if (!cate) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    const deletedCate = this.cateRepo.merge(cate, isActive);
    const result = await this.cateRepo.save(deletedCate);
    return result;
  }
}