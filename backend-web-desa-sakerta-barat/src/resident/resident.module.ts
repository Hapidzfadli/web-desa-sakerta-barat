import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';

@Module({
  providers: [ResidentService],
  controllers: [ResidentController]
})
export class ResidentModule {}
