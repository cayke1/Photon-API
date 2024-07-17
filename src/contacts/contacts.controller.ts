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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto/Contact.dto';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, description: 'The contact has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Return all contacts.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: Request) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.getContacts(userId);
  }

  @Get('email')
  @ApiOperation({ summary: 'Get contact by email' })
  @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Return contact by email.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByEmail(@Req() req: Request, @Body() body: { email: string }) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.getContactByEmail(userId, body.email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the contact' })
  @ApiResponse({ status: 200, description: 'Return contact by ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.contactsService.getContactById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the contact' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'The contact has been successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Delete contact' })
  @ApiParam({ name: 'id', type: 'string', description: 'The ID of the contact' })
  @ApiResponse({ status: 200, description: 'The contact has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.authService.getIdByToken(
      req.headers.authorization,
    );
    return this.contactsService.deleteContact(id, userId);
  }
}
