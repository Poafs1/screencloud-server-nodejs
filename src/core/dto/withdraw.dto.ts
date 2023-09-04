import { IsNumberString, IsNotEmpty } from 'class-validator';

export class WithdrawInputDto {
  @IsNotEmpty()
  @IsNumberString()
  amount: number;
}
