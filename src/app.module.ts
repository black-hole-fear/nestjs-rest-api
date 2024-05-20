import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AvatarsModule } from './avatars/avatars.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { Avatar, AvatarSchema } from './schemas/avatar.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule, 
    AvatarsModule,
    RabbitMQModule,

    MongooseModule.forFeature(
      [{ name: Avatar.name, schema: AvatarSchema }]
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
