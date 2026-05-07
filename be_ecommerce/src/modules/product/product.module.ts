import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ImagesModule } from '../images/images.module';
import { ProductVariant } from '../product_variant/entities/product_variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product,ProductVariant]), ImagesModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
