import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';

import { Model } from 'mongoose';
import { Avatar } from 'src/schemas/avatar.schema';

@Injectable()
export class AvatarsService {
    constructor(
        @InjectModel(Avatar.name) 
        private avatarModel: Model<Avatar>
    ) {}

    async getAvatar(userId: string) {
        const avatar = await this.avatarModel.findOne({ userId });
        if (avatar) 
            return avatar.data;
        
        const response = await axios.get(`https://reqres.in/api/users/${userId}`);
        const avatarUrl = response.data.data.avatar;
        const imageResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        const data = Buffer.from(imageResponse.data, 'binary').toString('base64');
        const hash = crypto.createHash('md5').update(data).digest('hex');

        const newAvatar = new this.avatarModel({ userId, hash, data });
        await newAvatar.save();

        return data;
    }

    async deleteAvatar(userId: string) {
        const avatar = await this.avatarModel.findOneAndDelete({ userId });
        if (avatar) {
            const filePath = join(__dirname, '../../uploads', `${avatar.hash}.png`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
}
