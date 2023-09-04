import { Injectable } from '@nestjs/common';
import { AuthDto, AuthInputDto } from './dto/auth.dto';

@Injectable()
export class CoreService {
  async auth(authInputDto: AuthInputDto): Promise<AuthDto> {
    console.log(authInputDto);

    return {
      currentBalance: 1000,
    };
  }
}
