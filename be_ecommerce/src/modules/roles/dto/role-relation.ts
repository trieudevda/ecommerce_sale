import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RoleRelationDto {
  @IsOptional()
  @IsNotEmpty({ message: 'ID của Role không được để trống' })
  @IsNumber({}, { message: 'ID của Role phải là số' })
  id: number;
}
