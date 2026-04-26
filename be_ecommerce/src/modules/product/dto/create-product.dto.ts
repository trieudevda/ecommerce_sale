import { ProductStatusEnum } from '../enums/product.enum';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryRelationDto } from '../../category/dto/category-relation';
import { ProductVariantRelationDto } from '../../product_variant/dto/product-variant-relation';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryRelationDto)
  category?: CategoryRelationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryRelationDto)
  variants?: ProductVariantRelationDto;

  @IsOptional()
  @IsEnum(ProductStatusEnum, { message: 'Status không hợp lệ' })
  status?: ProductStatusEnum;
}
