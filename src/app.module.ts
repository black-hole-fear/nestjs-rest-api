import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AvatarsModule } from './avatars/avatars.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    UsersModule, 
    AvatarsModule,
    RabbitMQModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
