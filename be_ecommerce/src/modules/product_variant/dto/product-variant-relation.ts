import { IsNumber, IsNotEmpty } from 'class-validator';

export class ProductVariantRelationDto {
  @IsNotEmpty({ message: 'ID của Product Variant không được để trống' })
  @IsNumber({}, { message: 'ID của Product Variant phải là số' })
  id: number;
}
