import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'balance' })
export class BalanceEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  pin: string;

  @Column()
  balance: number;
}
