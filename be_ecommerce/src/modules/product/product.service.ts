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
import { Category } from '../category/entities/category.entity';
import { CategoryRelationDto } from '../category/dto/category-relation';
import { ProductVariantService } from '../product_variant/product_variant.service';
import { ImageRefTypeEnum } from '../images/enum/images.enum';
import { CreateProductVariantDto } from '../product_variant/dto/create-product_variant.dto';
import { ProductStatusEnum } from './enums/product.enum';
import { PriceHistoryService } from '../price_history/price_history.service';
import dayjs from 'dayjs';
import { stat } from 'fs';
import { UpdateProductVariantDto } from '../product_variant/dto/update-product_variant.dto';
import { ProductPriceHistory } from '../price_history/entities/price_history.entity';
import { ProductVariant } from '../product_variant/entities/product_variant.entity';
import { CreatePriceHistoryDto } from '../price_history/dto/create-price_history.dto';
import { UpdatePriceHistoryDto } from '../price_history/dto/update-price_history.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly imageService: ImageService,
    private readonly productVariantService: ProductVariantService,
    private readonly priceHistoryService: PriceHistoryService,
  ) { }
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
    data.category = await this.categoryRepo.findOne({ where: { id: data.category?.id } }) as CategoryRelationDto;
    data.status = ProductStatusEnum.PUBLIC;
    
    const product = this.productRepo.create(data);
    const savedProduct = await this.productRepo.save(product);
    await this.imageService.createMany(files, savedProduct.id, ImageRefTypeEnum.PRODUCT);
    const variants: any = data.variants?.map((v) =>
    ({
      sku: v.sku,
      stock: v.stock,
      price: {
        price: v.price,
        startDate: dayjs()
      },
      attributeValueIds: v.attributeValueIds?.map((id) => id),
    })
    );
    const createdVariants = await this.productVariantService.create(
      savedProduct.id,
      variants,
    );
    for (let i = 0; i < createdVariants.length; i++) {
      const variant = createdVariants[i];
      const input = data.variants?.[i];

      if (!input) continue;

      await this.priceHistoryService.create({
        variant: { id: variant.id },
        price: input.price as any,
        startDate: new Date(),
      });
    }
    return {
      status: 'success',
    };
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

    // qb.leftJoinAndSelect('categories.parent', 'parent');
    qb.leftJoinAndSelect('products.category', 'category');
    // qb.leftJoinAndSelect('products.variants', 'variants');
    // qb.addSelect(['attributes.id', 'attributes.name']);
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

  async findOne({ slug }: FindProductQueryDto) {
    const prod = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .addSelect(['category.id', 'category.name', 'category.slug'])
      .leftJoin('product.variants', 'variants')
      .addSelect(['variants.id', 'variants.sku', 'variants.stock'])
      .leftJoinAndMapOne(
    'variants.prices',
    ProductPriceHistory,
    'price',
    `
      price.id = (
        SELECT p2.id
        FROM product_price_history p2
        WHERE p2.variant_id = variants.id
          AND p2.startDate <= NOW()
          AND (p2.endDate IS NULL OR p2.endDate > NOW())
        ORDER BY p2.startDate DESC
        LIMIT 1
      )
    `,
  )
      // .leftJoin('variants.prices', 'price',
      //   `
      //   price.startDate <= NOW()
      //   AND (price.endDate IS NULL OR price.endDate > NOW())
      // `,)
      // .addSelect(['price.id', 'price.price'])
      // .orderBy('price.startDate', 'DESC')
      // .limit(1)
      .leftJoin('variants.attributeValues', 'attributeValues')
      .addSelect(['attributeValues.id', 'attributeValues.value'])
      .where('product.slug = :slug', { slug })
      .getOne();
    if (!prod) {
      throw new NotFoundException('Product không tồn tại');
    }
    if (prod) {
      const images = await this.imageService.findByRef(prod.id, ImageRefTypeEnum.PRODUCT);
      prod.gallery = images;
    }
    const result = {
      ...prod,
      variants: prod.variants.map(v => ({
        ...v,
        price: v.prices?.[0]?.price ?? null,
      })),
    };
    return result;
  }
  @Transactional()
  async update(files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] }, slug: string, updateProductDto: UpdateProductDto) {
    const { existingAvatarIds, existingGalleryIds, refType, ...data } = updateProductDto;
    console.log('updateProductDto----------------------------------------------');
    console.dir(updateProductDto, { depth: null });
    const getProduct = await this.productRepo.findOne({ where: { slug: slug }, relations: ['category', 'variants'] });
    if (!getProduct) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    // data.slug = await createUniqueSlug(data.name!, async (s) => {
    //   const exist = await this.productRepo.findOne({ where: { slug: s } });
    //   return !!exist;
    // });
    if (getProduct.category?.id !== data.category?.id) {
      data.category = await this.categoryRepo.findOne({ where: { id: data.category?.id } }) as CategoryRelationDto;
    }
    if (updateProductDto.status && Object.values(ProductStatusEnum).includes(
      updateProductDto.status as ProductStatusEnum,
    )) {
      data.status = updateProductDto.status;
    }
    const product = this.productRepo.merge(getProduct, data);
    const savedProduct = await this.productRepo.save(product);
    await this.imageService.updateImages(files, savedProduct.id, ImageRefTypeEnum.PRODUCT);
    const variants = data.variants?.map((v) => {
      const oldVariant = getProduct.variants.find((item) => item.id === v.id);
      const newPrice: ProductPriceHistory = {
        id: v.priceId as any,
        variant: { id: v.id } as ProductVariant,
        price: v.price as any,
        startDate: dayjs().toDate(),
      } as ProductPriceHistory;
      console.log('oldVariant------------------------------------------------');
    console.dir(oldVariant, { depth: null }); 
      console.log('newPrice------------------------------------------------');
    console.dir(newPrice, { depth: null }); 
      return {
        id: v.id,
        sku: v.sku,
        stock: v.stock,
        prices: (oldVariant?.prices?.length
          ? [...oldVariant.prices, newPrice]
          : [newPrice]) as ProductPriceHistory[],
        attributeValueIds: v.attributeValueIds?.map((id) => id),
      }
    }) as UpdateProductVariantDto[];
    console.log('------------------------------------------------');
    console.dir(variants, { depth: null }); 
    const variant = await this.productVariantService.update(savedProduct.id, variants);
    return {
      status: 'success',
    };
  }
  remove(slug: string) {
    return `This action removes a #${slug} product`;
  }
}
