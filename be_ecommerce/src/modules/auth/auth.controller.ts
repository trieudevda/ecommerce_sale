import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    const isDev = process.env.ENVIRONMENT_APP === 'development';
    response.cookie('access_token', data.accessToken, {
      httpOnly: true,
      secure: isDev ? false : false,
      sameSite: isDev ? 'lax' : 'none',
      ...(signInDto.remember
        ? {
            maxAge: Number(process.env.JWT_EXPIRES_IN_REFRESH || 604800000),
          }
        : {}),
      // maxAge: Number(process.env.JWT_EXPIRES_IN_ACCESS || 900000),
      path: '/',
    });
    response.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: isDev ? false : false,
      sameSite: isDev ? 'lax' : 'none',
      ...(signInDto.remember
        ? {
            maxAge: Number(process.env.JWT_EXPIRES_IN_REFRESH || 604800000),
          }
        : {}),
      path: '/',
    });
    // maxAge: Number(process.env.JWT_EXPIRES_IN_REFRESH || 604800000),
    return {
      user: data.user,
      message: 'Đăng nhập thành công',
    };
  }
  @Public()
  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('Đăng nhập thất bại');
    const tokens = await this.authService.refreshTokens(refreshToken);
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRES_IN_ACCESS),
    });

    return tokens.user;
  }
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      status: 'success',
    };
  }
}
