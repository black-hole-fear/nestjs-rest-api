import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from '../schemas/avatar.schema';
import { Model } from 'mongoose';
import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';

describe('AvatarsService', () => {
  let service: AvatarsService;
  let avatarModel: Model<Avatar>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest'),
        MongooseModule.forFeature([
          { name: Avatar.name, schema: AvatarSchema },
        ]),
      ],
      providers: [AvatarsService],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
    avatarModel = module.get<Model<Avatar>>(getModelToken(Avatar.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return the avatar data from the database if it exist', async () => {
      const userId = '1';
      const avatarData = 'base64-encoded-avatar-data';
      const avatar = { userId, data: avatarData };
      jest.spyOn(avatarModel, 'findOne').mockResolvedValue(avatar as any);

      const result = await service.getAvatar(userId);
      expect(result).toBe(avatarData);
      expect(avatarModel.findOne).toHaveBeenCalledWith({ userId });
    });
  });

  it('should fetch avatar from external API and save it if not in database', async () => {
    const userId = '1';
    const avatarUrl = 'https://example.com/avatar.png';
    const avatarData = 'base64+encoded+avata';
    const responseData = { data: { avatar: avatarUrl } };
    const imageResponse = { data: Buffer.from(avatarData, 'base64') };

    jest.spyOn(avatarModel, 'findOne').mockResolvedValue(null);
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: responseData });
    jest.spyOn(axios, 'get').mockResolvedValueOnce(imageResponse);

    jest.spyOn(avatarModel.prototype, 'save').mockResolvedValue(null);

    const result = await service.getAvatar(userId);
    expect(result).toContain(avatarData);
    expect(avatarModel.findOne).toHaveBeenCalledWith({ userId });
    expect(axios.get).toHaveBeenCalledWith(
      `https://reqres.in/api/users/${userId}`,
    );
    expect(axios.get).toHaveBeenCalledWith(avatarUrl, {
      responseType: 'arraybuffer',
    });
    expect(avatarModel.prototype.save).toHaveBeenCalled();
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar data from the database and file system if it exists', async () => {
      const userId = '1';
      const avatar = { userId, hash: 'md5-hash' };
      const filePath = join(__dirname, '../../uploads', `${avatar.hash}.png`);

      jest
        .spyOn(avatarModel, 'findOneAndDelete')
        .mockResolvedValue(avatar as any);
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation();

      const result = await service.deleteAvatar(userId);
      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(avatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fs.existsSync).toHaveBeenCalledWith(filePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
    });

    it('should delete the avatar data from the database even if file does not exist', async () => {
      const userId = '1';
      const avatar = { userId, hash: 'md5-hash' };
      const filePath = join(__dirname, '../../uploads', `${avatar.hash}.png`);

      jest
        .spyOn(avatarModel, 'findOneAndDelete')
        .mockResolvedValue(avatar as unknown);
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);

      const result = await service.deleteAvatar(userId);
      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(avatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fs.existsSync).toHaveBeenCalledWith(filePath);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should handle the case when avatar is not found in the database', async () => {
      const userId = '1';
      jest.spyOn(avatarModel, 'findOneAndDelete').mockResolvedValue(null);

      const result = await service.deleteAvatar(userId);
      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(avatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fs.existsSync).not.toHaveBeenCalledWith();
      expect(fs.unlinkSync).not.toHaveBeenCalledWith();
    });
  });
});
