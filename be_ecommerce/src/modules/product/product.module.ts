import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ImagesModule } from '../images/images.module';
import { ProductVariant } from '../product_variant/entities/product_variant.entity';
import { Category } from '../category/entities/category.entity';
import { ProductVariantModule } from '../product_variant/product_variant.module';
import { PriceHistoryModule } from '../price_history/price_history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product,Category]), ImagesModule, ProductVariantModule, PriceHistoryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
