import { PrismaService } from 'src/prisma.service';
import { CreateContactDto } from '../dto/Contact.dto';
import { ContactsRepository } from './ContactsRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImplementationContactsRepository implements ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getContacts(userId: string) {
    return this.prisma.contact.findMany({
      where: { userId },
    });
  }

  async getContactById(id: string) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async getContactByEmail(userId: string, email: string) {
    const contact = await this.prisma.contact.findMany({
      where: { email, userId },
    });
    return contact;
  }

  async createContact(userId: string, contact: CreateContactDto) {
    return this.prisma.contact.create({
      data: {
        name: contact.name,
        email: contact.email,
        userId,
      },
    });
  }

  async updateContact(id: string, contact: CreateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: contact,
    });
  }

  async deleteContact(id: string) {
    this.prisma.contact.delete({ where: { id } });
  }
}
