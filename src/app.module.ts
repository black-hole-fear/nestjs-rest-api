import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AvatarsModule } from './avatars/avatars.module';

@Module({
  imports: [UsersModule, AvatarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
