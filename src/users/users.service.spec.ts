import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { InMemoryUserRepository } from './repositories/in-memory.user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UsersRepository',
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<InMemoryUserRepository>('UsersRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user when email is not registered', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      username: '@testuser',
    };
    const result = await service.createUser(createUserDto);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('password');
    expect(result.email).toBe(createUserDto.email);
    expect(result.password).toBe(createUserDto.password);
    expect(result).toBeDefined();
  });

  it('should not create a new user when email is already registered', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      username: '@testuser',
    };
    await service.createUser(createUserDto);
    try {
      await service.createUser(createUserDto);
    } catch (error) {
      expect(error.message).toBe('Email already registered');
    }
  });

  it('should not update a user when user is not found', async () => {
    const updateUserDto = {
      email: 'test@email.com',
      password: 'password123',
    };
    try {
      await service.updateUser('123', updateUserDto);
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should not update a user when email is already registered', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'password123',
      username: '@testuser',
    };
    const user = await service.createUser(createUserDto);
    const updateUserDto = {
      email: createUserDto.email,
      password: 'password1234',
    };

    try {
      await service.updateUser(user.id, updateUserDto);
    } catch (error) {
      expect(error.message).toBe('Email already registered');
    }
  });

  it('should not update a user when username is already registered', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'password123',
      username: '@testuser',
    };
    const user = await service.createUser(createUserDto);
    const updateUserDto = {
      email: 'test2@email.com',
      username: createUserDto.username,
    };

    try {
      await service.updateUser(user.id, updateUserDto);
    } catch (error) {
      expect(error.message).toBe('Username already registered');
    }
  });

  it('should delete a user', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'password123',
      username: '@testuser',
    };
    const user = await service.createUser(createUserDto);
    await service.deleteUser(user.id);
    const users = await service.getUsers();
    expect(users).toHaveLength(0);
  });

  it('should not delete a user when user is not found', async () => {
    try {
      await service.deleteUser('123');
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });
});
