import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dto/User.dto';
import { UsersRepository } from './user.repository';

@Injectable()
export class ImplementationUserRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const new_user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          username: createUserDto.username,
          name: createUserDto.name,
        },
      });

      return new_user;
    } catch (error) {
      return error;
    }
  }
  async getUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      return error;
    }
  }
  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { email, name } = updateUserDto;
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email,
          name,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async findByUsername(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
      return error;
    }
  }
}
