import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryAttributeDto } from './create-category_attribute.dto';

export class UpdateCategoryAttributeDto extends PartialType(CreateCategoryAttributeDto) {}
