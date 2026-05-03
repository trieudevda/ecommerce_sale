import {
  IsOptional,
  IsUUID,
  IsEmail,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryRefTypeEnum } from '../enum/category.enum';

export class FindCategoryQueryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsEnum(CategoryRefTypeEnum, { message: 'type không hợp lệ' })
  type?: CategoryRefTypeEnum;

  @IsOptional()
  @IsString()
  slug?: string;
  
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 1 || value === '1') return true;
    if (value === 'false' || value === 0 || value === '0') return false;
    return value;
  })
  @IsBoolean()
  isTree?: boolean;

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
