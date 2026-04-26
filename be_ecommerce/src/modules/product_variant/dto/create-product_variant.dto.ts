import { IsArray, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  sku: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsArray()
  @IsInt({ each: true })
  attributeValueIds: number[]; // Gửi lên: [1, 5] (Tương ứng ID Đỏ và 128GB)
}