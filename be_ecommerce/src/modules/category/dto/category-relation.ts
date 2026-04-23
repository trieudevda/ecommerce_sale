import { IsNumber, IsNotEmpty } from 'class-validator';

export class CategoryRelationDto {
  @IsNotEmpty({ message: 'ID của Category không được để trống' })
  @IsNumber({}, { message: 'ID của Category phải là số' })
  id: number;
}
