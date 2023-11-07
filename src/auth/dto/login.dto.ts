import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  readonly password: string;
}
