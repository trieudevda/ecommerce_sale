import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePriceHistoryDto } from 'src/modules/price_history/dto/create-price_history.dto';
import { ProductPriceHistory } from 'src/modules/price_history/entities/price_history.entity';

export class CreateProductVariantDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  priceId?: string;
  // @IsOptional()
  // @Transform(({ value }) => {
  //   const parsed = typeof value === 'string' ? JSON.parse(value) : value;

  //   if (!Array.isArray(parsed)) return [];

  //   return parsed.map((v) => plainToInstance(ProductPriceHistory, v));
  // })
  // prices: ProductPriceHistory[];

  @IsOptional()
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;

    if (!Array.isArray(parsed)) return [];

    return parsed.map((v) => plainToInstance(CreatePriceHistoryDto, v));
  })
  prices: CreatePriceHistoryDto[];
  @IsOptional()
  @Transform(({ value }) => Number(value))
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
  attributeValueIds: number[];
}