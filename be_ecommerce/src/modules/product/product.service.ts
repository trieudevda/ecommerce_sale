import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindUserQueryDto } from '../user/dto/find-user-query.dto';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../config/constant-find';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll({
    name,
    status,
    page = 1,
    limit,
    sort = 'DESC',
  }: FindProductQueryDto) {
    const configLimit = Math.min(Number(limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const sortOrder: 'ASC' | 'DESC' =
      sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const qb = this.productRepo.createQueryBuilder('products');
    if (name) {
      qb.andWhere('products.name = :name', { name });
    }
    if (status) {
      qb.andWhere('products.status = :status', { status });
    }
    // pagination
    qb.skip((page - 1) * configLimit).take(limit);
    // sort
    qb.orderBy('products.createdAt', sortOrder);
    qb.skip((page - 1) * configLimit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: {
        total,
        page,
        limit: configLimit,
        totalPages: Math.ceil(total / configLimit),
      },
    };
  }

  async findOne({ id, name }: FindProductQueryDto) {
    const prod = await this.productRepo.findOne({
      where: [{ id: id }, { name: name }],
    });
    if (!prod) {
      throw new NotFoundException('Product không tồn tại');
    }
    return prod;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
