import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';
import { CategoryRefTypeEnum } from '../enum/category.enum';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsEnum(CategoryRefTypeEnum, { message: 'type không hợp lệ' })
  type?: CategoryRefTypeEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  attributeIds?: number[];
}
