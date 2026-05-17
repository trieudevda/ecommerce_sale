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

  @ManyToOne(() => ProductVariant, (variant) => variant.prices,{
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column('decimal', { precision: 20, scale: 2 })
  price: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;
}
