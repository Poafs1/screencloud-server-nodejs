import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigsModule } from './configs/configs.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { SqlModule } from './sql/sql.module';

@Module({
  imports: [ConfigsModule, HealthCheckModule, SqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
