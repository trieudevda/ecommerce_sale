import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import {CategoryAttributeValue} from "../category_attribute_values/entities/category_attribute_value.entity";

@Injectable()
export class CategoryAttributeService {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly attributeRepo: Repository<CategoryAttribute>,
    @InjectRepository(CategoryAttributeValue)
    private readonly attributeValueRepo: Repository<CategoryAttributeValue>,
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
    createCategoryAttributeDto.slug = slug;
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
    };
  }
  @Transactional()
  async update(
    slug: string,
    updateCategoryAttributeDto: UpdateCategoryAttributeDto,
  ) {
    const attr = await this.attributeRepo.findOneBy({ slug: slug });
    if (!attr) {
      throw new NotFoundException('Thuộc tính không tồn tại');
    }
    if (updateCategoryAttributeDto.values) {
      const currentValuesIds = attr.values.map((v) => v.id);
      const updateValuesIds = updateCategoryAttributeDto.values
        .filter((v) => v.id) // Lấy những cái có ID (hàng cũ)
        .map((v) => v.id);

      // Tìm những ID có trong DB nhưng không có trong DTO gửi lên
      const idsToRemove = currentValuesIds.filter(
        (id) => !updateValuesIds.includes(id),
      );

      if (idsToRemove.length > 0) {
        await this.attributeValueRepo.delete(idsToRemove);
      }
    }
    const updatedAttr = this.attributeRepo.merge(
      attr,
      updateCategoryAttributeDto,
    );
    const result = await this.attributeRepo.save(updatedAttr);
    return {
      data: result,
    };
  }
  async findOne({name,slug}: FindCategoryAttributeDto) {
    const attr = await this.attributeRepo.findOne({
      where: [{ slug: slug }],
      relations: ['values'],
    });
    if (!attr) {
      throw new NotFoundException('Thuộc tính không tồn tại');
    }
    return {
      data: attr,
    };
  }
  //
  //
  async remove(slug: string) {
    const record = await this.attributeRepo.findOne({ where: { slug } });

    if (!record) {
      throw new NotFoundException(
        `Không tìm thấy thuộc tính với slug: ${slug}`,
      );
    }

    // Xóa vật lý (Xóa hẳn khỏi DB)
    return await this.attributeRepo.remove(record);
  }
}
