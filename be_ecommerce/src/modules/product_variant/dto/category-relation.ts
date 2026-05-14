import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductVariantRelationDto {
  @IsNotEmpty({ message: 'ID của Product Variant không được để trống' })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber({}, { message: 'ID của Product Variant phải là số' })
  id: number;
}
