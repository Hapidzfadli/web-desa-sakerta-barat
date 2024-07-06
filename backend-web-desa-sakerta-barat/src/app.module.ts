import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';
import { LetterCategoryModule } from './letter-category/letter-category.module';
import { LetterTypeModule } from './letter-type/letter-type.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    ResidentModule,
    LetterCategoryModule,
    LetterTypeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
