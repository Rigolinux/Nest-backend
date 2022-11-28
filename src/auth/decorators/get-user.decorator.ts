/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

/*
create a decorator that will return the user object
this decorator will be used in the controller to get the user object
an makes more sense to use a decorator than a guard
*/

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {


  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new InternalServerErrorException('No user found');
  }
  if(!data){
    return user;
  }
  else{
    return user[data];
  }
  
});
