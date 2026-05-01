import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { CategoryAttribute } from '../../category_attribute/entities/category_attribute.entity';

// @Tree('materialized-path')
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category, {
    cascade: false,
  })
  products: Product[];

  // @TreeParent()
  // parent: Category;

  // @TreeChildren()
  // children: Category[];

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  metaKeywords: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => CategoryAttribute)
  @JoinTable()
  attributes: CategoryAttribute[];
}
