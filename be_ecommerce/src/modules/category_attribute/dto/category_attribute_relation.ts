import { IsNumber, IsNotEmpty } from 'class-validator';

export class CategoryAttributeRelationDto {
  @IsNotEmpty({ message: 'ID của thuộc tính không được để trống' })
  @IsNumber({}, { message: 'ID của thuộc tính phải là số' })
  id?: number;
}
