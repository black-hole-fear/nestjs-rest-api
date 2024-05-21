import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Lucas',
        job: 'Backend Developer',
      };
      const mockUser = { _id: '1', ...createUserDto } as User;
      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toBe(mockUser);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct paramethers', async () => {
      const userId = '1';
      const mockUser = { id: '1', name: 'Lucas', job: 'Backend Developer' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(result).toBe(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
