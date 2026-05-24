import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min, } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductStatusEnum } from '../enums/product.enum';

export class FindProductQueryDto {
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
  @IsEnum(ProductStatusEnum, { message: 'Status không hợp lệ' })
  status?: ProductStatusEnum = ProductStatusEnum.PUBLIC;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  sort?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
