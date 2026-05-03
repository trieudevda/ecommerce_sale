import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { ProductPriceHistory } from '../../price_history/entities/price_history.entity';
import { CategoryAttributeValue } from '../../category_attribute_values/entities/category_attribute_value.entity';

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

  @ManyToMany(() => CategoryAttributeValue)
  @JoinTable({
    name: 'product_variant_values', // Tên bảng trung gian
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'attribute_value_id',
      referencedColumnName: 'id',
    },
  })
  attributeValues: CategoryAttributeValue[];
}
