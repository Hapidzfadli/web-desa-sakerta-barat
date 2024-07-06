import { Module } from '@nestjs/common';
import { LetterTypeService } from './letter-type.service';
import { LetterTypeController } from './letter-type.controller';

@Module({
  providers: [LetterTypeService],
  controllers: [LetterTypeController]
})
export class LetterTypeModule {}
