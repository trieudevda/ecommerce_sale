import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { CategoryAttribute } from '../../category_attribute/entities/category_attribute.entity';


@Entity('category-attribute_values')
export class CategoryAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // Ví dụ: "Đỏ", "Xanh", "128GB"

  @ManyToOne(() => CategoryAttribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  attribute: CategoryAttribute;

  @CreateDateColumn()
  createdAt: Date;
}