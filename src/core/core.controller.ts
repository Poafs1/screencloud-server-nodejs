import { Body, Controller, Post } from '@nestjs/common';
import { CoreService } from './core.service';
import { AuthDto, AuthInputDto } from './dto/auth.dto';
import { WithdrawDto, WithdrawInputDto } from './dto/withdraw.dto';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('/auth')
  async auth(@Body() authInputDto: AuthInputDto): Promise<AuthDto> {
    return this.coreService.auth(authInputDto);
  }

  @Post('/withdraw')
  async withdraw(@Body() withdrawInputDto: WithdrawInputDto): Promise<WithdrawDto> {
    return this.coreService.withdraw(withdrawInputDto);
  }
}
