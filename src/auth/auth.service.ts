import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { BcryptService } from './bcrypt.service';
import { LoginDto } from './dto/login.dto';
// import { JwtService } from '@nestjs/jwt';
// import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    // @Inject(jwtConfig.KEY)
    private readonly bcryptService: BcryptService,
    // private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { firstName, lastName, email, password } = registerDto;
    try {
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = await this.bcryptService.hash(password);
      await this.userRepository.save(user);
      return await this.generateAccessToken();
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
    return await this.generateAccessToken();
  }

  async generateAccessToken(): Promise<{ accessToken: string }> {
    // const payload = {
    //   id: user.id,
    //   email: user.email,
    // };
    return {
      // accessToken: await this.jwtService.signAsync(payload),
      accessToken: 'auth success',
    };
  }
}
