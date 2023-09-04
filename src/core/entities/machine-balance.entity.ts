import { BaseAuditableEntity } from '../../sql/entities/baseAuditable.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'machine_balance' })
export class MachineBalanceEntity extends BaseAuditableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  note: number;

  @Column()
  amount: number;
}
