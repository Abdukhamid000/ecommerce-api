import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator((_, ctx) => {
  const user = ctx.switchToHttp().getRequest().user;
  if (!user) throw new UnauthorizedException();
  return {
    ...user,
    sub: Number(user.sub),
  };
});
