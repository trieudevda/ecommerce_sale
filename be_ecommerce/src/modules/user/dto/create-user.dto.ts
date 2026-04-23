import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import dayjs from 'dayjs';
import { UserRoleEnum, UserStatusEnum } from '../enums/user.enum';
import { RoleRelationDto } from '../../roles/dto/role-relation';

// export enum UserRole {
//   CUSTOMER = 'customer',
//   ADMIN = 'admin',
// }

export class CreateUserDto {
  @IsOptional()
  @IsUUID('4')
  id?: string;

  @IsNotEmpty({ message: 'Email không được rỗng' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password không được rỗng' })
  @MinLength(6, { message: 'Password tối thiểu 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ tên không được rỗng' })
  @MinLength(2)
  fullName: string;

  @IsOptional()
  @Matches(/^[0-9]{10,11}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RoleRelationDto)
  role?: RoleRelationDto;

  @IsOptional()
  @Transform(({ value }: { value: string | Date | null }) => {
    if (!value) return null;

    const date = dayjs(value);
    return date.isValid() ? date.toDate() : null;
  })
  dateOfBirth?: Date;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsEnum(UserStatusEnum, { message: 'Status không hợp lệ' })
  status: UserStatusEnum;
}
