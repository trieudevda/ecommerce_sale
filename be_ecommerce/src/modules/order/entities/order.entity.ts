import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from '../../order_item/entities/order_item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: string;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
