import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './social-media/profile/profile.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ProfileModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}