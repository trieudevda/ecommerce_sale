import { Module } from '@nestjs/common';
import { ProductVariantService } from './product_variant.service';
import { ProductVariantController } from './product_variant.controller';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class ProductVariantModule {}
