import { IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class AuthInputDto {
  @IsNotEmpty()
  @IsNumberString()
  pin: string;
}

export class AuthDto {
  @IsNotEmpty()
  @IsInt()
  currentBalance: number;
}
