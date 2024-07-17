import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '@johndoe',
    description: 'The username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name: string | null;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 'john@doe.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '@johndoe',
    description: 'The username of the user',
  })
  @IsString()
  @IsOptional()
  username?: string;
}
