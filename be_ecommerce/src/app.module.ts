import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/guard/jwt.strategy';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { DatabaseSeedService } from './database/seed';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { seedPermissions } from './database/permission.seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getOrThrow('typeorm'),
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UserModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AuthService,
    DatabaseSeedService,
  ],
})
export class AppModule {}
