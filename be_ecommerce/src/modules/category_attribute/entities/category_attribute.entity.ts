import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryAttributeValue } from '../../category_attribute_values/entities/category_attribute_value.entity';

@Entity('category-attributes')
export class CategoryAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ví dụ: "Màu sắc", "Dung lượng"

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => CategoryAttributeValue, (value) => value.attribute, {
    cascade: true,
    eager: true,
  })
  values: CategoryAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}