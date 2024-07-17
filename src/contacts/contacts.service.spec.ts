import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { InMemoryContactsRepository } from './repositories/in-memory.contacts.repository';
import {
  ConflictError,
  NotFoundError,
} from '../errors/CreateCustomError';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: 'ContactsRepository',
          useClass: InMemoryContactsRepository,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a contact', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    const createdContact = await service.createContact(userId, contact);
    expect(createdContact.name).toBe(contact.name);
    expect(createdContact.email).toBe(contact.email);
    expect(createdContact.userId).toBe(userId);
  });

  it('should update a contact', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    const createdContact = await service.createContact(userId, contact);
    const updatedContact = await service.updateContact(
      createdContact.id,
      { name: 'Jane Doe' },
      userId,
    );
    expect(updatedContact.name).toBe('Jane Doe');
  });

  it('should delete a contact', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    const createdContact = await service.createContact(userId, contact);
    await service.deleteContact(createdContact.id, userId);
    await expect(service.getContactById(createdContact.id)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should get a contact by id', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    const createdContact = await service.createContact(userId, contact);
    const foundContact = await service.getContactById(createdContact.id);
    expect(foundContact).toBeDefined();
  });

  it('should get a contact by email', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    await service.createContact(userId, contact);
    const foundContact = await service.getContactByEmail(userId, contact.email);
    expect(foundContact).toBeDefined();
  });

  it('should not update a contact that does not exist', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@doe.com',
    };
    const userId = '123';
    await expect(
      service.updateContact('invalid-id', contact, userId),
    ).rejects.toThrow(NotFoundError);
  });

  it('should not delete a contact that does not exist', async () => {
    const userId = '123';
    await expect(service.deleteContact('invalid-id', userId)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should not get a contact by id that does not exist', async () => {
    await expect(service.getContactById('invalid-id')).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should not get a contact by email that does not exist', async () => {
    const userId = '123';
    await expect(
      service.getContactByEmail(userId, 'nonexistent@doe.com'),
    ).rejects.toThrow(NotFoundError);
  });

  it('should not create a contact that already exists', async () => {
    const contact = {
      name: 'John Doe',
      email: 'john@email.com',
    };
    const userId = '123';
    await service.createContact(userId, contact);
    await expect(service.createContact(userId, contact)).rejects.toThrow(
      ConflictError,
    );
  });
});
