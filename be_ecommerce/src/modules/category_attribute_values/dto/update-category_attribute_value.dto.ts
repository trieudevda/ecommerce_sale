import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryAttributeValueDto } from './create-category_attribute_value.dto';

export class UpdateCategoryAttributeValueDto extends PartialType(CreateCategoryAttributeValueDto) {}
