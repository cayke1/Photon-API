import { User } from '../../@types/User';
import { CreateUserDto, UpdateUserDto } from '../dto/User.dto';
import { UsersRepository } from './user.repository';

export class InMemoryUserRepository implements UsersRepository {
  constructor() {
    this.users = [];
  }
  private users: User[];

  createUser(user: CreateUserDto): Promise<User> {
    return new Promise((resolve, reject) => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(Date.now()),
        lastUpdate: new Date(Date.now()),
        ...user,
      };

      this.users.push(newUser);
      resolve(newUser);
    });
  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  updateUser(userId: string, user: UpdateUserDto): Promise<User> {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex((u) => u.id === userId);
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...user,
        lastUpdate: new Date(Date.now()),
      };
      resolve(this.users[userIndex]);
    });
  }

  deleteUser(id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex((u) => u.id === id);
      const user = this.users[userIndex];
      this.users.splice(userIndex, 1);
      resolve(user);
    });
  }

  getUserById(id: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((u) => u.id === id));
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((u) => u.email === email));
  }

  findByUsername(username: string): Promise<User> {
    return Promise.resolve(this.users.find((u) => u.username === username));
  }
}
