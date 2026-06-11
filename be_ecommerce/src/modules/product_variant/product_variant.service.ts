import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product_variant.entity';
import { CategoryAttributeValue } from '../category_attribute_values/entities/category_attribute_value.entity';
import { PriceHistoryService } from '../price_history/price_history.service';
import { ProductPriceHistory } from '../price_history/entities/price_history.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    private readonly priceHistoryService: PriceHistoryService,
  ) {}
  async create(
    productId: number,
    createProductVariantDto: CreateProductVariantDto[],
  ) {
    if (createProductVariantDto == undefined) return [];
    const entities = createProductVariantDto.map((variant) =>
      this.productVariantRepository.create({
        ...variant,
        product: { id: productId },
        attributeValues: variant.attributeValueIds.map((id) => ({
          id,
        })),
      }),
    );
    return await this.productVariantRepository.save(entities);
  }
  findAll() {
    return `This action returns all productVariant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariant`;
  }

  async update(productId: number, dtos: UpdateProductVariantDto[]) {
    const oldVariants = await this.productVariantRepository.find({
      where: { product: { id: productId } },
      relations: ['attributeValues', 'prices'],
    });
    const map = new Map(oldVariants.map((v) => [v.id, v]));
    const result: ProductVariant[] = [];
    for (const dto of dtos) {
      if (dto.id && map.has(dto.id)) {
        const old = map.get(dto.id)!;
        if (dto.sku !== undefined) old.sku = dto.sku;
        if (dto.stock !== undefined) old.stock = dto.stock;
        if (dto.prices !== undefined && dto.prices.length > 0) {
          old.prices = await this.priceHistoryService.update(
            old.id,
            old.prices,
            dto.prices as ProductPriceHistory[],
          );
        }
        old.attributeValues = (dto.attributeValueIds || []).map(
          (id) => ({ id }) as CategoryAttributeValue,
        );
        result.push(old);
        map.delete(dto.id);
      } else {
        console.log('dtocreate', dto);
        let variant = await this.productVariantRepository.create({
          sku: dto.sku,
          stock: dto.stock,
          product: { id: productId },
          attributeValues: (dto.attributeValueIds || []).map((id) => ({ id })),
        });
        await this.productVariantRepository.save(variant);
        const created = await this.priceHistoryService.create({
          price: dto.prices?.[0].price as any,
          variant: { id: variant.id },
          startDate: new Date(),
        });
        variant.prices = [created];
        result.push(variant);
      }
    }
    const deleteIds = [...map.keys()];
    if (deleteIds.length) {
      await this.productVariantRepository.delete(deleteIds);
    }
    return await this.productVariantRepository.save(result);
  }
  remove(id: number) {
    return `This action removes a #${id} productVariant`;
  }
}
