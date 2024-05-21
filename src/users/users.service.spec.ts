import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { CreateUserDto } from './dto/create-user.dto';
import axios from 'axios';

jest.mock('axios');

const mockUserModel = {
  new: jest.fn().mockResolvedValue({}),
  constructor: jest.fn().mockResolvedValue({}),
  find: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneAndDelete: jest.fn(),
};

const mockRabbitMQService = {
  sendToQueue: jest.fn(), // Mocking sendToQueue method
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest'),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: RabbitMQService, useValue: mockRabbitMQService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and send a RabbitMQ message', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Lucas',
        job: 'Backend Developer',
      };
      const savedUser = { _id: '1', ...createUserDto } as User & Document;

      jest.spyOn(service, 'create').mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should retrieve a user from external API', async () => {
      const userId = '1';
      const externalUser = {
        data: {
          id: '1',
          name: 'Lucas',
          job: 'Backend Developer',
        },
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: externalUser });

      const result = await service.findOne(userId);

      expect(result).toEqual(externalUser.data);
      expect(axios.get).toHaveBeenCalledWith(
        `https://reqres.in/api/users/${userId}`,
      );
    });
  });
});
