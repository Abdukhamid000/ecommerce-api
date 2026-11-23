import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../common/decorators.js';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(255)
  shipment_city: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(255)
  shipment_street: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @MaxLength(10)
  shipment_postal_code: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(8, 20)
  @Matches(/^[+\d][\d\s\-()]{7,19}$/, {
    message:
      'phone must contain digits, and may include +, -, spaces, or parentheses',
  })
  phone: string;
}
