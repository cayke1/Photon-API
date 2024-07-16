import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import 'dotenv/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { ImplementationUserRepository } from 'src/users/repositories/implementation.user.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UsersService,
    PrismaService,
    {
      provide: 'UsersRepository',
      useClass: ImplementationUserRepository,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
