import { Contact } from '../../@types/Contact';
import { CreateContactDto, UpdateContactDto } from '../dto/Contact.dto';

export interface ContactsRepository {
  getContacts(userId: string): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact>;
  getContactByEmail(userId: string, email: string): Promise<Contact[]>;
  createContact(userId: string, contact: CreateContactDto): Promise<Contact>;
  updateContact(id: string, contact: UpdateContactDto): Promise<Contact>;
  deleteContact(id: string): Promise<void>;
}
