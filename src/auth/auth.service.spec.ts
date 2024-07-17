import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InMemoryUserRepository } from '../users/repositories/in-memory.user.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: 'UsersRepository',
          useClass: InMemoryUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register user', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@mail.com',
      password: 'password123',
      username: '@testuser',
    };

    const result = await service.signup(createUserDto);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('password');
    expect(result.email).toBe(createUserDto.email);
    expect(result.password).not.toBe(createUserDto.password);
  });

  it('should log user in', async () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'password123',
      username: '@testuser',
    };

    await service.signup(createUserDto);

    const result = await service.login(
      createUserDto.email,
      createUserDto.password,
    );
    expect(result).toHaveProperty('access_token');
  });
});
