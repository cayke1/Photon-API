import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { User } from 'src/@types/User';
import { CreateUserDto, UpdateUserDto } from './dto/User.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const userExists = await this.usersRepository.getUserByEmail(user.email);
    if (userExists) {
      throw new Error('Email already registered');
    }
    return this.usersRepository.createUser(user);
  }

  async getUsers() {
    return this.usersRepository.getUsers();
  }

  async updateUser(userId: string, user: UpdateUserDto) {
    const userExists = await this.usersRepository.getUserById(userId);
    if (!userExists) {
      throw new Error('User not found');
    }
    const emailExists = await this.usersRepository.getUserByEmail(user.email);
    if (emailExists) {
      throw new Error('Email already registered');
    }
    return this.usersRepository.updateUser(userId, user);
  }

  async deleteUser(id: string) {
    const userExists = await this.usersRepository.getUserById(id);
    if (!userExists) {
      throw new Error('User not found');
    }
    return this.usersRepository.deleteUser(id);
  }

  async getUserById(id: string) {
    return this.usersRepository.getUserById(id);
  }
}
