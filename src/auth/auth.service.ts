import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/User.dto';
import { User } from 'src/@types/User';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const result = user;
        return result;
      }
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }

    return null;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const userEncryptedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: userEncryptedPassword,
    });

    return newUser;
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, error };
    }
  }
}
