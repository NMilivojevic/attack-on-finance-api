// sign-up.dto.ts

import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'First name is required.' })
  readonly firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  readonly lastName: string;

  @IsEmail({}, { message: 'Email is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  readonly email: string;

  @MinLength(6, {
    message: 'Password is too short.',
  })
  @IsNotEmpty({ message: 'Password is required.' })
  readonly password: string;
}
