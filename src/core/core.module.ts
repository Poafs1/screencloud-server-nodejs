import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { ConfigsModule } from '../configs/configs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceEntity } from './entities/balance.entity';
import { MachineBalanceEntity } from './entities/machine-balance.entity';

@Module({
  imports: [ConfigsModule, TypeOrmModule.forFeature([BalanceEntity, MachineBalanceEntity])],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
