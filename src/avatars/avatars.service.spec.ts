import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AvatarsService } from './avatars.service';
import { Avatar } from '../schemas/avatar.schema';
import axios from 'axios';
import * as fs from 'fs';

jest.mock('axios');
jest.mock('fs');
jest.mock('crypto', () => ({
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue({
      digest: jest.fn().mockReturnValue('mockHash'),
    }),
  }),
}));

const mockAvatarModel = {
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
  save: jest.fn(),
  create: jest.fn().mockImplementation(function (this: any) {
    return this;
  }),
};

describe('AvatarsService', () => {
  let service: AvatarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarsService,
        { provide: getModelToken(Avatar.name), useValue: mockAvatarModel },
      ],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return the avatar data from the database if it exists', async () => {
      const userId = '1';
      const avatar = { userId, data: 'mockAvatarData' };

      mockAvatarModel.findOne.mockResolvedValue(avatar as any);

      const result = await service.getAvatar(userId);

      expect(result).toBe(avatar.data);
      expect(mockAvatarModel.findOne).toHaveBeenCalledWith({ userId });
    });

    it('should fetch and save the avatar data if it does not exist in the database', async () => {
      const userId = '1';
      const mockResponse = {
        data: {
          data: {
            avatar: 'http://example.com/avatar.png',
          },
        },
      };
      const mockImageResponse = { data: Buffer.from('imageData') };

      (axios.get as jest.Mock)
        .mockResolvedValueOnce(mockResponse)
        .mockResolvedValueOnce(mockImageResponse);

      const result = await service.getAvatar(userId);

      expect(result).toBe(Buffer.from('imageData').toString('base64'));
      expect(axios.get).toHaveBeenCalledWith('https://reqres.in/api/users/1');
      expect(axios.get).toHaveBeenCalledWith('http://example.com/avatar.png', {
        responseType: 'arraybuffer',
      });
      expect(mockAvatarModel.create).toHaveBeenCalled();
      expect(mockAvatarModel.save).toHaveBeenCalled();
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the avatar and remove the file if it exists', async () => {
      const userId = '1';
      const avatar = { userId, hash: 'mockHash' };

      mockAvatarModel.findOneAndDelete.mockResolvedValue(avatar as any);
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      const result = await service.deleteAvatar(userId);

      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(mockAvatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('mockHash.png'),
      );
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    it('should delete the avatar but not attempt to remove the file if it does not exist', async () => {
      const userId = '1';
      const avatar = { userId, hash: 'mockHash' };

      mockAvatarModel.findOneAndDelete.mockResolvedValue(avatar as any);
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await service.deleteAvatar(userId);

      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(mockAvatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining('mockHash.png'),
      );
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should return a message if the avatar does not exist', async () => {
      const userId = '1';

      mockAvatarModel.findOneAndDelete.mockResolvedValue(null);

      const result = await service.deleteAvatar(userId);

      expect(result).toEqual({ message: 'Avatar deleted successfully' });
      expect(mockAvatarModel.findOneAndDelete).toHaveBeenCalledWith({ userId });
    });
  });
});
