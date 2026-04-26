import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from '../../product_variant/entities/product_variant.entity';

@Entity('product_price_history')
export class ProductPriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.prices)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;
}
