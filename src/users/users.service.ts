import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { User } from 'src/@types/User';
import { CreateUserDto, UpdateUserDto } from './dto/User.dto';
import { ConflictError, NotFoundError } from '../errors/CreateCustomError';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new ConflictError('Email already registered');
    }
    const usernameExists = await this.usersRepository.findByUsername(
      user.username,
    );
    if (usernameExists) {
      throw new ConflictError('Username already registered');
    }
    return this.usersRepository.createUser(user);
  }

  async getUsers() {
    return this.usersRepository.getUsers();
  }

  async updateUser(userId: string, user: UpdateUserDto) {
    const userExists = await this.usersRepository.getUserById(userId);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }
    const emailExists = await this.usersRepository.getUserByEmail(user.email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    const usernameExists = await this.usersRepository.findByUsername(
      user.username,
    );
    if (usernameExists) {
      throw new ConflictError('Username already registered');
    }
    return this.usersRepository.updateUser(userId, user);
  }

  async deleteUser(id: string) {
    const userExists = await this.usersRepository.getUserById(id);
    if (!userExists) {
      throw new NotFoundError('User not found');
    }
    return this.usersRepository.deleteUser(id);
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
