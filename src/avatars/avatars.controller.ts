import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AvatarsService } from './avatars.service';

@Controller('api/user')
export class AvatarsController {
    constructor(private readonly service: AvatarsService) {}

    @Get(':userId/avatar')
    async getAvatar(@Param('userId') userId: string) {
        return this.service.getAvatar(userId);
    }

    @Delete(':userId/avatar')
    async deleteAvatar(@Param('userId') userId: string) {
        return this.service.deleteAvatar(userId);
    }
}
