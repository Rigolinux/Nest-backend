/* eslint-disable prettier/prettier */
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';


// password strategy is used to validate jwt token and check 
// if the token is valid

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService : ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            // here we are telling passport where it can find the jwt token in the request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }
  
    //validate is a method that is called by passport

  async validate(payload: JwtPayload): Promise<User> {

    // here we can do some validation, like check if the user is still active
    // or if the user has the right permissions
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id });

    

    if (!user) throw new UnauthorizedException('The user does not exist');

    if (!user.isActive) throw new UnauthorizedException('The user is not active');

    // the values returned here will be available in the request object
    return user;
  }
}
