import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../config/constant-find';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Transactional } from 'typeorm-transactional';
import { ImageService } from '../images/images.service';
import { createUniqueSlug } from '../../common/helpers/slug.helper';
import { ProductVariant } from '../product_variant/entities/product_variant.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
    private readonly imageService: ImageService,
  ) {}
  @Transactional()
  async create(
    files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    createProductDto: CreateProductDto,
  ) {
    const { refType, ...data } = createProductDto;
    data.slug = await createUniqueSlug(data.name!, async (s) => {
      const exist = await this.productRepo.findOne({ where: { slug: s } });
      return !!exist;
    });
    console.log(data);
    // const idVariant = data.variants?.map((v) =>
    //   v.attributeValueIds?.map((id) => ({ id })),
    // );
    // console.log(idVariant);
    // const attrVariant = this.productVariantRepo.findAndCount({
    //   where: In(idVariant),
    // });
    data.variants = data.variants?.map((v) => ({
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      attributeValueIds: v.attributeValueIds?.map((id) => ({ id })),
    }));
    console.log(data.variants);
    const product = this.productRepo.create(data);
    const savedProduct = await this.productRepo.save(product);
    // savedProduct.gallery = await this.imageService.createMany(files,savedProduct.id,refType as ImageRefTypeEnum);

    // console.log(data)
    return data;
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
