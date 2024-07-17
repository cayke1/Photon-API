import { Inject, Injectable } from '@nestjs/common';
import { ContactsRepository } from './repositories/ContactsRepository';
import { CreateContactDto, UpdateContactDto } from './dto/Contact.dto';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/CreateCustomError';

@Injectable()
export class ContactsService {
  constructor(
    @Inject('ContactsRepository')
    private contactsRepository: ContactsRepository,
  ) {}

  async getContacts(userId: string) {
    const contacts = await this.contactsRepository.getContacts(userId);
    if (!contacts || contacts.length === 0 || contacts instanceof Error) {
      throw new NotFoundError('Contacts not found');
    }
    return contacts;
  }

  async getContactById(id: string) {
    const contact = await this.contactsRepository.getContactById(id);
    if (!contact) {
      throw new NotFoundError('Contact not found');
    }
    return contact;
  }

  async getContactByEmail(userId: string, email: string) {
    const contact = await this.contactsRepository.getContactByEmail(
      userId,
      email,
    );
    if (!contact || contact.length === 0) {
      throw new NotFoundError('Contact not found');
    }
    return contact;
  }

  async createContact(userId: string, contact: CreateContactDto) {
    const contactExists = await this.contactsRepository.getContactByEmail(
      userId,
      contact.email,
    );
    if (contactExists && contactExists.length > 0) {
      throw new ConflictError('Contact already exists');
    }
    return this.contactsRepository.createContact(userId, contact);
  }

  async updateContact(id: string, contact: UpdateContactDto, userId: string) {
    const thisContactExists = await this.contactsRepository.getContactById(id);
    if (!thisContactExists) {
      throw new NotFoundError('Contact not found');
    }
    if (thisContactExists.userId !== userId) {
      throw new UnauthorizedError('You are not allowed to update this contact');
    }
    return this.contactsRepository.updateContact(id, contact);
  }

  async deleteContact(id: string, userId: string) {
    const thisContactExists = await this.contactsRepository.getContactById(id);
    if (!thisContactExists) {
      throw new NotFoundError('Contact not found');
    }
    if (thisContactExists.userId !== userId) {
      throw new UnauthorizedError('You are not allowed to delete this contact');
    }
    return this.contactsRepository.deleteContact(id);
  }
}
