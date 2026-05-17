import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePriceHistoryDto } from './dto/create-price_history.dto';
import { UpdatePriceHistoryDto } from './dto/update-price_history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Transaction } from 'typeorm';
import { ProductPriceHistory } from './entities/price_history.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectRepository(ProductPriceHistory)
    private readonly priceHistoryRepo: Repository<ProductPriceHistory>,
  ) { }
  @Transactional()
  async create(createPriceHistoryDto: CreatePriceHistoryDto) {
    // const entity = this.priceHistoryRepo.create({
    //   ...createPriceHistoryDto,
    //   price: createPriceHistoryDto.price,
    //   variant: { id: createPriceHistoryDto.variant.id },
    // });
    const priceHistory = this.priceHistoryRepo.create(createPriceHistoryDto);
    return await this.priceHistoryRepo.save(priceHistory);
  }

  findAll() {
    return `This action returns all priceHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} priceHistory`;
  }

  async update(variantId: number, productPriceHistories: ProductPriceHistory[], updatePriceHistoryDto: UpdatePriceHistoryDto[]): Promise<ProductPriceHistory[]> {
    if (updatePriceHistoryDto.length === 0) return [];
    const map = new Map(
      productPriceHistories.map(p => [p.id, p]),
    );
    const updatedEntities: ProductPriceHistory[] = [];
    for (const dto of updatePriceHistoryDto) {
      if (dto.id === undefined) {
        updatedEntities.push(dto as any);
        continue;
      };
      const old = map.get(dto.id);
      if (!old) continue;
      if (dto.price !== undefined) {
        old.price = dto.price;
      }
      if (dto.startDate !== undefined) {
        old.startDate = dto.startDate;
      }
      if (dto.endDate !== undefined) {
        old.endDate = dto.endDate;
      }
      updatedEntities.push(old);
    }
    await this.priceHistoryRepo.save(updatedEntities);
    return this.priceHistoryRepo.find({ where: { variant: { id: variantId } }, relations: ['variant'] });
  }

  remove(id: number) {
    return `This action removes a #${id} priceHistory`;
  }
}
