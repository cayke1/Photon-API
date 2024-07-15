import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from '../dto/User.dto';

export interface UsersRepository {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<User>;
}
