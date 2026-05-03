import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductVariantDto {
  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') return JSON.parse(value).map(Number);
    if (Array.isArray(value)) return value.map(Number);
    return value;
  })
  attributeValueIds: number[]; // Gửi lên: [1, 5] (Tương ứng ID Đỏ và 128GB)
} 