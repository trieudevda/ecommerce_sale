import { IsNumber, IsNotEmpty } from 'class-validator';

export class ImageRelationDto {
  @IsNotEmpty({ message: 'ID của Image không được để trống' })
  @IsNumber({}, { message: 'ID của Image phải là số' })
  id?: number;
}
