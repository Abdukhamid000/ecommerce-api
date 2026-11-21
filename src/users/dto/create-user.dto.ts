import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../common/decorators.js';

export class CreateUserDto {
  @Trim()
  @IsNotEmpty()
  @IsString()
  @Length(4, 100)
  name: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLocaleLowerCase() : value,
  )
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string;
}
