import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: await bcrypt.hash(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      this.handlerrors(error);
    }
  }
  async checkToken(user: User) {
    return {
      ...user,
      token: this.getjWtToken({ id: user.id }),
    };
  }

  async login(LoginUserDto: LoginUserDto) {
    const { email, password } = LoginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true },
    });
    if (!user) throw new UnauthorizedException('El usuario no existe');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Contraseña incorrecta');

    return {
      ...user,
      token: this.getjWtToken({ id: user.id }),
    };
  }
  private getjWtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private handlerrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }

    console.log(error);

    throw new InternalServerErrorException('check your server logs');
  }
}
