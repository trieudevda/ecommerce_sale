import { IsOptional, IsString, IsInt, IsIn, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FindRoleQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

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
