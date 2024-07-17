import { Contact } from '../../@types/Contact';
import { ContactsRepository } from './ContactsRepository';
import { CreateContactDto, UpdateContactDto } from '../dto/Contact.dto';

export class InMemoryContactsRepository implements ContactsRepository {
  constructor() {
    this.contacts = [];
  }
  private contacts: Contact[];
  async getContacts(userId: string): Promise<Contact[]> {
    return this.contacts.filter((contact) => contact.userId === userId);
  }
  async getContactById(id: string) {
    return this.contacts.find((contact) => contact.id === id);
  }
  async getContactByEmail(userId: string, email: string) {
    const contact = this.contacts.find((contact) => {
      if (contact.userId === userId && contact.email === email) {
        return contact;
      }
    });

    if (contact) {
      return [contact];
    } else {
      return null;
    }
  }
  async createContact(userId: string, contact: CreateContactDto) {
    const contactToCreate: Contact = {
      ...contact,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(Date.now()),
      lastUpdate: new Date(Date.now()),
      userId,
    };
    this.contacts.push(contactToCreate);
    return contactToCreate;
  }
  async updateContact(id: string, contact: UpdateContactDto) {
    const contactIndex = this.contacts.findIndex((c) => c.id === id);
    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }
    this.contacts[contactIndex] = {
      ...this.contacts[contactIndex],
      ...contact,
      lastUpdate: new Date(Date.now()),
    };
    return this.contacts[contactIndex];
  }
  async deleteContact(id: string) {
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
  }
}
