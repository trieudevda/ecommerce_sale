import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ImageRefTypeEnum } from '../enum/images.enum';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column()
  refId: number; // id của product / user

  @Column({
    type: 'enum',
    enum: ImageRefTypeEnum,
    default: ImageRefTypeEnum.NONE,
  })
  refType: ImageRefTypeEnum;

  @CreateDateColumn()
  createdAt: Date;
}
