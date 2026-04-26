import { Injectable } from '@nestjs/common';
import { CreateCategoryAttributeDto } from './dto/create-category_attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category_attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryAttribute } from './entities/category_attribute.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { FindCategoryAttributeDto } from './dto/find-attribute.dto';

@Injectable()
export class CategoryAttributeService {
  constructor(
    @InjectRepository(CategoryAttribute)
    private readonly attributeRepo: Repository<CategoryAttribute>,
  ) {}
  async create(createCategoryAttributeDto: CreateCategoryAttributeDto) {
    const newAttr = this.attributeRepo.create(createCategoryAttributeDto);
    return await this.attributeRepo.save(newAttr);
  }

  async findAll(query: FindCategoryAttributeDto) {
    const { name, page, limit } = query;
    return await this.attributeRepo.find({
      where: { name: name ? Like(`%${name}%`) : undefined },
      relations: ['values'], // Để lấy kèm danh sách giá trị (Đỏ, Xanh, ...)
      skip: Number((Number(page) - 1) * Number(limit)) || 0,
      take: limit,
    });
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
