import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'balance' })
export class BalanceEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  pin: string;

  @Column()
  balance: number;
}
