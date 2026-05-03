import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateProductVariantDto } from './create-product_variant.dto';
// import { PartialType } from '@nestjs/mapped-types';
export class ProductVariantRelationDto extends CreateProductVariantDto {}
// export class ProductVariantRelationDto {
//   @IsNotEmpty({ message: 'ID của Product Variant không được để trống' })
//   @IsNumber({}, { message: 'ID của Product Variant phải là số' })
//   id: number;
// }
