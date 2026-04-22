import {
  IsOptional,
  IsUUID,
  IsEmail,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRoleEnum, UserStatusEnum } from '../enums/user.enum';

export class FindUserQueryDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => (value === '' ? undefined : value))
  email?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status?: UserStatusEnum;

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
