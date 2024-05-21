import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { Avatar } from '../schemas/avatar.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('AvatarsController', () => {
  let controller: AvatarsController;
  let service: AvatarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarsController],
      providers: [
        AvatarsService,
        {
          provide: getModelToken(Avatar.name),
          useValue: {
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AvatarsController>(AvatarsController);
    service = module.get<AvatarsService>(AvatarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should call service.getAvatar with correct userId', async () => {
      const userId = '1';
      const mockAvatarData = 'mockAvatarData';
      jest.spyOn(service, 'getAvatar').mockResolvedValue(mockAvatarData);

      const result = await controller.getAvatar(userId);

      expect(result).toBe(mockAvatarData);
      expect(service.getAvatar).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteAvatar', () => {
    it('should call service.deleteAvatar with correct userId', async () => {
      const userId = '1';
      const mockResponse = { message: 'Avatar deleted successfully' };
      jest.spyOn(service, 'deleteAvatar').mockResolvedValue(mockResponse);

      const result = await controller.deleteAvatar(userId);

      expect(result).toBe(mockResponse);
      expect(service.deleteAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
