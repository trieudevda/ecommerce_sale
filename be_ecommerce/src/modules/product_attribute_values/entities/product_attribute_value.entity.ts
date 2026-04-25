import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductAttribute } from '../../product_attributes/entities/product_attribute.entity';

@Entity('product_attribute_values')
export class ProductAttributeValues {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => ProductAttribute)
  attribute: ProductAttribute;
}
