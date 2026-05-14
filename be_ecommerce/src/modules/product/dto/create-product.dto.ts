import { ProductStatusEnum } from '../enums/product.enum';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const parsed = JSON.parse(value);
      return plainToInstance(CategoryRelationDto, parsed);
    }
    return plainToInstance(CategoryRelationDto, value);
  })
  category?: CategoryRelationDto;

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;

    if (!Array.isArray(parsed)) return [];

    return parsed.map((v) => plainToInstance(ProductVariantRelationDto, v));
  })
  variants?: ProductVariantRelationDto[];

  @IsOptional()
  @IsEnum(ProductStatusEnum, { message: 'Status không hợp lệ' })
  status?: ProductStatusEnum;
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
      return undefined;
    }
    const parsed = typeof value === 'string' ? Number(value) : value;
    return parsed;
  })
  @IsOptional()
  @IsNumber()
  existingAvatarIds?: number;
  @IsOptional()
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    // if (!Array.isArray(parsed)) return [];
    return parsed;
  })
  @IsInt({ each: true, message: 'ID của gallery phải là số' })
  existingGalleryIds?: number[];

}
