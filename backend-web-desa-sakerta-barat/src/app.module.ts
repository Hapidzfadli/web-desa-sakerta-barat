import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';
import { LetterCategoryModule } from './letter-category/letter-category.module';
import { LetterTypeModule } from './letter-type/letter-type.module';
import { LetterRequestModule } from './letter-request/letter-request.module';
import { PrintedLetterModule } from './printed-letter/printed-letter.module';
import { NotificationModule } from './notification/notification.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    ResidentModule,
    LetterCategoryModule,
    LetterTypeModule,
    LetterRequestModule,
    PrintedLetterModule,
    NotificationModule,
    DashboardModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time to live: 60 seconds
        limit: 40, // limit to 10 requests per ttl
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
