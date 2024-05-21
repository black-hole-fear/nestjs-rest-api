import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Avatar, AvatarDocument, AvatarSchema } from '../schemas/avatar.schema';

import { Model } from 'mongoose';

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
  create: jest.fn(),
};

describe('AvatarsService', () => {
  let service: AvatarsService;
  let model: Model<AvatarDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest'),
        MongooseModule.forFeature([
          { name: Avatar.name, schema: AvatarSchema },
        ]),
      ],
      providers: [
        AvatarsService,
        {
          provide: getModelToken(Avatar.name),
          useValue: mockAvatarModel,
        },
      ],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
    model = module.get<Model<AvatarDocument>>(getModelToken(Avatar.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvatar', () => {
    it('should return the avatar data from the database if it exists', async () => {
      const userId = '1';
      const avatar = { userId, data: 'mockAvatarData' };

      jest.spyOn(model, 'findOne').mockResolvedValue(avatar as any);

      const result = await service.getAvatar(userId);

      expect(result).toBe(avatar.data);
      expect(model.findOne).toHaveBeenCalledWith({ userId });
    });
  });
});
