import { Injectable } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product_variant.entity';
import { CategoryAttributeValue } from '../category_attribute_values/entities/category_attribute_value.entity';
import { PriceHistoryService } from '../price_history/price_history.service';
import { ProductPriceHistory } from '../price_history/entities/price_history.entity';
import { CreatePriceHistoryDto } from '../price_history/dto/create-price_history.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    private readonly priceHistoryService: PriceHistoryService,
  ) {
  }
  async create(productId: number, createProductVariantDto: CreateProductVariantDto[]) {
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
      relations: ['attributeValues','prices'],
    });console.dir(dtos,{depth: null});
    const map = new Map(oldVariants.map(v => [v.id, v]));
    const result: ProductVariant[] = [];
    for (const dto of dtos) {
      if (dto.id && map.has(dto.id)) {
        const old = map.get(dto.id)!; 
        if (dto.sku !== undefined) old.sku = dto.sku;
        if (dto.stock !== undefined) old.stock = dto.stock;
        dto.variant = { id: dto.id } as ProductVariant;
        
        console.log('old.dto',dto);
        console.log('old.prices1',old.prices);
        if (dto.price !== undefined) old.prices = await this.priceHistoryService.create(dto.prices as CreatePriceHistoryDto);
        // if (dto.price !== undefined) old.prices = await this.priceHistoryService.update(old.id, dto.prices as ProductPriceHistory[]);
        console.log('old.prices',old.prices);
        old.attributeValues = (dto.attributeValueIds || []).map(id => ({ id } as CategoryAttributeValue));
        result.push(old);
        map.delete(dto.id);
      } else {
        result.push(
          this.productVariantRepository.create({
            sku: dto.sku,
            stock: dto.stock,
            product: { id: productId },
            attributeValues: (dto.attributeValueIds || []).map(id => ({ id })),
          }),
        );
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
