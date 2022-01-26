import { Request } from 'express';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayloadModel } from '../modules';

export const User = createParamDecorator<
  string,
  ExecutionContext,
  JwtPayloadModel
>((data: string, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<Request>();
  return req.user as JwtPayloadModel;
});
