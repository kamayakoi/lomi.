import { Module } from '@nestjs/common';
import { CliListenController } from './cli-listen.controller';
import { CliListenerService } from './cli-listener.service';
import { CliStreamService } from './cli-stream.service';

@Module({
  controllers: [CliListenController],
  providers: [CliListenerService, CliStreamService],
  exports: [CliListenerService, CliStreamService],
})
export class CliModule {}
