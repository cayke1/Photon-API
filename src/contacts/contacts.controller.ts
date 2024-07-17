import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/Contact.dto';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createContactDto: CreateContactDto,
  ) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.createContact(userId, createContactDto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.getContacts(userId);
  }

  @Get('email')
  async findByEmail(@Req() req: Request, @Body() body: { email: string }) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.getContactByEmail(userId, body.email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactsService.getContactById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() createContactDto: CreateContactDto,
    @Req() req: Request,
  ) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.updateContact(id, createContactDto, userId);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.deleteContact(id, userId);
  }
}
