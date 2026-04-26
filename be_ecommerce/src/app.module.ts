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
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/guard/jwt.strategy';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { DatabaseSeedService } from './database/seed';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { CustomLoggerService } from './common/logger/logger.service';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ProductVariantModule } from './modules/product_variant/product_variant.module';
import { PriceHistoryModule } from './modules/price_history/price_history.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order_item/order_item.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ImagesModule } from './modules/images/images.module';
import { CategoryAttributeModule } from './modules/category_attribute/category_attribute.module';
import { CategoryAttributeValuesModule } from './modules/category_attribute_values/category_attribute_values.module';

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
    CategoryModule,
    ProductModule,
    ProductVariantModule,
    PriceHistoryModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    ImagesModule,
    CategoryAttributeModule,
    CategoryAttributeValuesModule,
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
    CustomLoggerService,
  ],
})
export class AppModule {}
