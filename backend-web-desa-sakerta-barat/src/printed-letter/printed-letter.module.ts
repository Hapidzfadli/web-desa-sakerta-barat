import { Module } from '@nestjs/common';
import { PrintedLetterService } from './printed-letter.service';
import { PrintedLetterController } from './printed-letter.controller';

@Module({
  providers: [PrintedLetterService],
  controllers: [PrintedLetterController],
})
export class PrintedLetterModule {}
