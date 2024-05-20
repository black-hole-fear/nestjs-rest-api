import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { Model } from 'mongoose';

const mockUserModel = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockRabbitMQService = {
  send: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and send rabbit event', async () => {
    const createUserDto = { name: 'Test User', job: 'Developer' };
    const expectedUser = { _id: '1', ...createUserDto };
    // jest.spyOn(model, 'create').mockImplementationOnce(() => expectedUser);

    const result = await service.create(createUserDto);
    expect(result).toEqual(expectedUser);
    expect(mockRabbitMQService.send).toHaveBeenCalledWith('user_created', expectedUser);
  });
});
