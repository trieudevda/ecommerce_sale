import { IsNumber, IsNotEmpty } from 'class-validator';

export class RoleRelationDto {
  @IsNotEmpty({ message: 'ID của Role không được để trống' })
  @IsNumber({}, { message: 'ID của Role phải là số' })
  id: number;


}
