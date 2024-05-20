import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') 
        private userModel: Model<UserDocument>,
        private rabbitMQService: RabbitMQService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        const savedUser = await createdUser.save();

        // Dummy email sending (simulated)
        console.log('Sending email to user...');

        // Send RabbitMQ event
        await this.rabbitMQService.send('user_created', savedUser);

        return savedUser;
    }

    async findOne(userId: string) {
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        return response.data.data;
    }
}
