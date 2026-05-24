import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: (req) => {
        return req?.cookies?.['refresh_token'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH!,
    });
  }

  async validate(payload: any) {
    return this.usersService.findByIdForAuth(payload.sub as string);
  }
}
