import { Test, TestingModule } from '@nestjs/testing';
import { AvatarsService } from './avatars.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from '../schemas/avatar.schema';

describe('AvatarsService', () => {
  let service: AvatarsService;

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
          useValue: {
            findOne: jest.fn(),
            findOneAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AvatarsService>(AvatarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
