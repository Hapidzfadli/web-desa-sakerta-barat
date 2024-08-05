import { Module } from '@nestjs/common';
import { LetterRequestService } from './letter-request.service';
import { LetterRequestController } from './letter-request.controller';
import { UserService } from '../user/user.service';

@Module({
  providers: [LetterRequestService, UserService],
  controllers: [LetterRequestController],
})
export class LetterRequestModule {}
