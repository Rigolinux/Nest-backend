import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto, LoginUserDto } from './dto/';
import { GetUser, GetRawHeaders, Auth } from './decorators/';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

import { ApiTags } from '@nestjs/swagger';

//import { request } from 'http';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  /* 
  for protected routes we need to use guards
  the guard is a function that will be executed before the controller
  and will return true or false depending on the condition that we want to validate
  finally the guard will return a 401 unauthorized error if the condition is not met
  */

  @Get('private')
  @UseGuards(AuthGuard())
  privateTest(
    //@Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') email: string,
    @GetRawHeaders() headers: string[],
  ) {
    //console.log(request);
    return {
      ok: true,
      message: 'This is a private route',
      user,
      email,
      headers,
    };
  }

  @Get('private2')
  //@SetMetadata('roles', ['admin', 'user'])
  @RoleProtected(ValidRoles.supeUser, ValidRoles.admin) // @UseGuards(UserRoleGuard) in the case can assig who can access to the route
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateTest2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a private route 2',
      user,
    };
  }
  /*
  Normaly for the previus example we need to use many decorator to protect the route if one of the decorator is not met the route will be
  accessable for everyone and then other option is use a global guard with all those decorator 
  */
  @Get('private3')
  @Auth(ValidRoles.user) // fill the decorator with the roles that we want to protect example @Auth(ValidRoles.admin)
  privateTest3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'This is a private route 3',
      user,
    };
  }
  // get token from header
  @Get('check-token')
  @Auth()
  checktoken(@GetUser() user: User) {
    return this.authService.checkToken(user);
    /*
    extract the token from the header
    const token = headers[1].split(' ')[1];
    const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log(data);
    */
  }
}
