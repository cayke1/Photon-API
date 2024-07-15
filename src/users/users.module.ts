import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ImplementationUserRepository } from './repositories/implementation.user.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: 'UsersRepository',
      useClass: ImplementationUserRepository,
    },
  ],
})
export class UsersModule {}
