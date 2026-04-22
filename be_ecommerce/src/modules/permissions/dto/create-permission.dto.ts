import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Code không được rỗng' })
  @IsString()
  code: string;

  @IsNotEmpty({ message: 'Name không được rỗng' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  module?: string;
}
