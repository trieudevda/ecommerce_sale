import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
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
  })
  values: CategoryAttributeValue[];

  @CreateDateColumn()
  createdAt: Date;
}