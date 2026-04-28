import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateCategoryAttributeValueDto
} from '../../category_attribute_values/dto/create-category_attribute_value.dto';

export class CreateCategoryAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryAttributeValueDto)
  @IsOptional()
  values?: CreateCategoryAttributeValueDto[];
}
