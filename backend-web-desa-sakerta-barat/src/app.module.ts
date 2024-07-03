import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ResidentModule } from './resident/resident.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, ResidentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
