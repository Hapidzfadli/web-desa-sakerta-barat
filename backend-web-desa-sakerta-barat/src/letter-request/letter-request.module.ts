import { Module } from '@nestjs/common';
import { LetterRequestService } from './letter-request.service';
import { LetterRequestController } from './letter-request.controller';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  providers: [
    LetterRequestService,
    UserService,
    NotificationService,
    NotificationGateway,
  ],
  controllers: [LetterRequestController],
})
export class LetterRequestModule {}
