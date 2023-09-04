import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoreService } from './core.service';
import { AuthDto, AuthInputDto } from './dto/auth.dto';
import { WithdrawInputDto } from './dto/withdraw.dto';

@Controller('core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('/auth')
  async auth(@Body() authInputDto: AuthInputDto): Promise<AuthDto> {
    return this.coreService.auth(authInputDto);
  }

  // This is for testing purpose only.
  @Get('/reset/data')
  async resetData(): Promise<boolean> {
    return this.coreService.resetData();
  }

  @Post('/withdraw')
  async withdraw(@Body() withdrawInputDto: WithdrawInputDto): Promise<void> {
    return this.coreService.withdraw(withdrawInputDto);
  }
}
