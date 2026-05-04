import { ProductStatusEnum } from '../enums/product.enum';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryRelationDto } from '../../category/dto/category-relation';
import { ProductVariantRelationDto } from '../../product_variant/dto/product-variant-relation';
import { ImageRelationDto } from '../../images/dto/image-relation';

export class CreateProductDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImageRelationDto)
  avatar?: ImageRelationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImageRelationDto)
  gallery?: ImageRelationDto[];

  @IsOptional()
  @IsString()
  refType?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryRelationDto)
  category?: CategoryRelationDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantRelationDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  variants?: ProductVariantRelationDto[];

  @IsOptional()
  @IsEnum(ProductStatusEnum, { message: 'Status không hợp lệ' })
  status?: ProductStatusEnum;
}
