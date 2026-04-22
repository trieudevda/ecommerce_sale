import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { Request } from 'express';
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
    response.cookie('access_token', data.accessToken, {
      httpOnly: true, // Ngăn truy cập cookie (chống XSS)
      secure: false, // true nếu dùng HTTPS
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRES_IN_ACCESS),
      path: '/',
    });
    response.cookie('refresh_token', data.refreshToken, {
      httpOnly: true, // Ngăn truy cập cookie (chống XSS)
      secure: false, // true nếu dùng HTTPS
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRES_IN_REFRESH),
      path: '/',
    });
    return {
      user: data.user,
      message: 'Đăng nhập thành công',
    };
  }

  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ){
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('Đăng nhập thất bại');
    const tokens = await this.authService.refreshTokens(refreshToken);
    // Ghi đè Access Token
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: Number(process.env.JWT_EXPIRES_IN_ACCESS),
    });

    return tokens.user;
  }
}
