import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product_variant.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
  ) {
  }
  async create(productId: number, createProductVariantDto: CreateProductVariantDto) {
    const variant = this.productVariantRepository.create({
      ...createProductVariantDto,
      product: { id: productId },
      // TypeORM sẽ tự hiểu và chèn vào bảng trung gian
      attributeValues: createProductVariantDto.attributeValueIds.map((id) => ({
        id,
      })),
    });

    return await this.productVariantRepository.save(variant);
  }
  findAll() {
    return `This action returns all productVariant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  update(id: number, updateProductVariantDto: UpdateProductVariantDto) {
    return `This action updates a #${id} productVariant`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariant`;
  }
}
