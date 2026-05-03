import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from '../../product_variant/entities/product_variant.entity';
import { Category } from '../../category/entities/category.entity';
import { ProductStatusEnum } from '../enums/product.enum';
import { Image } from 'src/modules/images/entities/image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column({ unique: true })
  slug: string;
  @Column({ type: 'text', nullable: true })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Image, (image) => image.refId)
  @JoinColumn({ name: 'id', referencedColumnName: 'refId' })
  gallery: Image[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
  
  @Column({
    type: 'enum',
    enum: ProductStatusEnum,
    default: ProductStatusEnum.DRAFT,
  })
  status: ProductStatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}
