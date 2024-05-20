import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from 'src/schemas/avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }])
  ],
  providers: [AvatarsService],
  controllers: [AvatarsController]
})
export class AvatarsModule {}
