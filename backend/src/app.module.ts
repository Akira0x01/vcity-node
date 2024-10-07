import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchianModule } from './blockchian/module';

@Module({
  imports: [BlockchianModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
