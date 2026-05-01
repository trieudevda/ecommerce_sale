import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryAttributeValueDto } from './dto/create-category_attribute_value.dto';
import { UpdateCategoryAttributeValueDto } from './dto/update-category_attribute_value.dto';
import { CategoryAttributeValue } from './entities/category_attribute_value.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryAttributeValuesService {
  constructor(
    @InjectRepository(CategoryAttributeValue)
    private attrValue: Repository<CategoryAttributeValue>,
  ) {}
}
