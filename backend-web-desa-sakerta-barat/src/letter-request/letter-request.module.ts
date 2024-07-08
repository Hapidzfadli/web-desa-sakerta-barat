import { Module } from '@nestjs/common';
import { LetterRequestService } from './letter-request.service';
import { LetterRequestController } from './letter-request.controller';

@Module({
  providers: [LetterRequestService],
  controllers: [LetterRequestController],
})
export class LetterRequestModule {}
