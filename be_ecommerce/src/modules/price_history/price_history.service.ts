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
    const priceHistory = this.priceHistoryRepo.create(createPriceHistoryDto);
    return await this.priceHistoryRepo.save(priceHistory);
  }

  findAll() {
    return `This action returns all priceHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} priceHistory`;
  }

  async update(variantId: number, updatePriceHistoryDto: UpdatePriceHistoryDto[]): Promise<ProductPriceHistory[]> {
    if (updatePriceHistoryDto.length === 0) return [];
    for (const item of updatePriceHistoryDto) {
      await this.priceHistoryRepo.update(
        { id: item.id, variant: { id: variantId } },
        item,
      );
    }
    // const updatedPriceHistory = this.priceHistoryRepo.create(updatePriceHistoryDto);
    // const result = await this.priceHistoryRepo.save(updatedPriceHistory);
    return this.priceHistoryRepo.find({ where: { variant: { id: variantId } }, relations: ['variant'] });
  }

  remove(id: number) {
    return `This action removes a #${id} priceHistory`;
  }
}
