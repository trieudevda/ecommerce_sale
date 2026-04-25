import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
