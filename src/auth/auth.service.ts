import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { BcryptService } from './bcrypt.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<string> {
    const { firstName, lastName, email, password } = registerDto;
    try {
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = await this.bcryptService.hash(password);
      await this.userRepository.save(user);
      return 'register succesfully';
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          'Email address already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw Error;
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    console.log(loginDto);
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const isPasswordMatch = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { sub: user.id, username: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  getMe(user: any): { userId: number; email: string } {
    console.log(user);
    return { userId: user.sub, email: user.username };
  }
}
