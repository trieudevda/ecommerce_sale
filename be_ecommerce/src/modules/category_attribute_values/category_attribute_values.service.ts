import { Injectable } from '@nestjs/common';
import { CreateCategoryAttributeValueDto } from './dto/create-category_attribute_value.dto';
import { UpdateCategoryAttributeValueDto } from './dto/update-category_attribute_value.dto';

@Injectable()
export class CategoryAttributeValuesService {
  create(createCategoryAttributeValueDto: CreateCategoryAttributeValueDto) {
    return 'This action adds a new categoryAttributeValue';
  }

  findAll() {
    return `This action returns all categoryAttributeValues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryAttributeValue`;
  }

  update(id: number, updateCategoryAttributeValueDto: UpdateCategoryAttributeValueDto) {
    return `This action updates a #${id} categoryAttributeValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryAttributeValue`;
  }
}
