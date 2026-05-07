import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CategoryRelationDto {
  @IsNotEmpty({ message: 'ID của Category không được để trống' })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber({}, { message: 'ID của Category phải là số' })
  id: number;
}
