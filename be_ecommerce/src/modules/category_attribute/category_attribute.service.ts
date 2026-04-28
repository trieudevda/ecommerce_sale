import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryAttributeDto } from './dto/create-category_attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category_attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryAttribute } from './entities/category_attribute.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { FindCategoryAttributeDto } from './dto/find-attribute.dto';
import { Transactional } from 'typeorm-transactional';
import { exists } from 'node:fs';
import slugify from 'slugify';
import { createUniqueSlug } from '../../common/helpers/slug.helper';

@Injectable()
export class CategoryAttributeService {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly attributeRepo: Repository<CategoryAttribute>,
  ) {}
  @Transactional()
  async create(createCategoryAttributeDto: CreateCategoryAttributeDto) {
    const exists = await this.attributeRepo.exists({
      where: {
        name: createCategoryAttributeDto.name,
      },
    });
    if (exists) {
      throw new BadRequestException('Thuộc tính đã tồn tại');
    }
    const slug = await createUniqueSlug(
      createCategoryAttributeDto.name,
      async (s) => {
        const exist = await this.attributeRepo.findOne({ where: { slug: s } });
        return !!exist;
      },
    );
    const newAttr = this.attributeRepo.create(createCategoryAttributeDto);
    const data = await this.attributeRepo.save(newAttr);
    return { data: data };
  }

  async findAll(query: FindCategoryAttributeDto) {
    const { name, page, limit } = query;
    const data = await this.attributeRepo.find({
      where: { name: name ? Like(`%${name}%`) : undefined },
      relations: ['values'], // Để lấy kèm danh sách giá trị (Đỏ, Xanh, ...)
      skip: Number((Number(page) - 1) * Number(limit)) || 0,
      take: limit,
    });
    return {
      data: data,
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} categoryAttribute`;
  // }
  //
  // update(id: number, updateCategoryAttributeDto: UpdateCategoryAttributeDto) {
  //   return `This action updates a #${id} categoryAttribute`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} categoryAttribute`;
  // }
}
