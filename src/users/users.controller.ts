import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto) {
        return await this.service.create(dto);
    }

    @Get(':userId')
    async findOne(@Param('userId') userId: string) {
        return this.service.findOne(userId);
    }
}
