import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the contact',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the contact',
  })
  @IsEmail()
  email: string;
}

export class UpdateContactDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the contact',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the contact',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
