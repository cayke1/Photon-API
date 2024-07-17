import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaService } from '../prisma.service';
import { ImplementationContactsRepository } from './repositories/implementation.contacts.repository';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { ImplementationUserRepository } from '../users/repositories/implementation.user.repository';

@Module({
  controllers: [ContactsController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: 'UsersRepository',
      useClass: ImplementationUserRepository,
    },
    PrismaService,
    ContactsService,
    {
      provide: 'ContactsRepository',
      useClass: ImplementationContactsRepository,
    },
  ],
})
export class ContactsModule {}
