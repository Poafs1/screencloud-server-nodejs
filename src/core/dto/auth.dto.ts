import { IsNumberString, IsString, IsNotEmpty } from 'class-validator';

export class AuthInputDto {
  @IsNotEmpty()
  @IsString()
  pin: string;
}

export class AuthDto {
  @IsNotEmpty()
  @IsNumberString()
  currentBalance: number;
}
