import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { ProductPriceHistory } from '../../price_history/entities/price_history.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductPriceHistory, (p) => p.variant)
  prices: ProductPriceHistory[];
}
