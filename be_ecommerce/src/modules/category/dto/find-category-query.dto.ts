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

export class FindCategoryQueryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
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
