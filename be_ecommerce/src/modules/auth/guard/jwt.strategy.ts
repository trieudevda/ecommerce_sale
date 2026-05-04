// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: (req: any) => {
        return req?.cookies?.['access_token'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByIdForAuth(payload.sub as string);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return user;
    // return { userId: payload.sub, email: payload.email, role: payload.role, };
  }
}
