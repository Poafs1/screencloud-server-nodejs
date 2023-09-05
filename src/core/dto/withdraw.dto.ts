import { IsNotEmpty, IsInt, IsBoolean } from 'class-validator';
import { AuthInputDto } from './auth.dto';

export class WithdrawInputDto extends AuthInputDto {
  @IsNotEmpty()
  @IsInt()
  amount: number;
}

export class WithdrawDto {
  notes: {
    '5': number;
    '10': number;
    '20': number;
  };

  @IsNotEmpty()
  @IsBoolean()
  isOverdraft: boolean;

  @IsNotEmpty()
  @IsInt()
  currentBalance: number;
}
