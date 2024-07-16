import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './public.decorator';
import { CreateUserDto } from 'src/users/dto/User.dto';
import { User } from 'src/@types/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    const response = await this.authService.login(email, password);
    if (!response) return res.status(404).json({ status: 'User not found' });
    return res.status(200).json(response);
  }

  @Public()
  @Get('check-token/:token')
  async checkToken(@Param('token') token: string) {
    const result = await this.authService.verifyToken(token);

    if (result.valid) {
      return { valid: true, decoded: result.decoded };
    } else {
      return { valid: false, error: result.error.message };
    }
  }
}
