import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmailForAuth(email);
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permission: user.role.permissions
    };
    const tokens = await this.getTokens(payload);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      // access_token: await this.jwtService.signAsync(payload),
      ...tokens,
      user: payload,
    };
  }
  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN_ACCESS as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH,
        expiresIn: process.env.JWT_EXPIRES_IN_REFRESH as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH,
      });
      const userId = payload.sub;
      const user = await this.userService.findByIdForAuth(userId);
      if (!user || user.refreshToken === null)
        throw new ForbiddenException('Access Denied');
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
      const payload1 = {
        sub: user.id,
        email: user.email,
        role: user.role,
        permission: user.role.permissions,
      };
      const tokens = await this.getTokens(payload1);
      // await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        ...tokens,
        user: payload1,
      };
    } catch (e) {
      throw new ForbiddenException('Refresh token invalid or expired');
    }
  }
}
