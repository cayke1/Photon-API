import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './public.decorator';
import { CreateUserDto } from 'src/users/dto/User.dto';
import { User } from 'src/@types/User';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiOperation({ summary: 'Check token validity' })
  @ApiParam({
    name: 'token',
    type: 'string',
    description: 'JWT token to be checked',
  })
  @ApiResponse({ status: 200, description: 'Token valid' })
  @ApiResponse({ status: 401, description: 'Token invalid' })
  async checkToken(@Param('token') token: string) {
    const result = await this.authService.verifyToken(token);

    if (result.valid) {
      return { valid: true, decoded: result.decoded };
    } else {
      return { valid: false, error: result.error.message };
    }
  }
}
