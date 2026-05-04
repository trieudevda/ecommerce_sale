import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryAttribute } from '../category_attribute/entities/category_attribute.entity';
import { CustomLoggerService } from '../../common/logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAttribute])],
  controllers: [CategoryController],
  providers: [CategoryService, CustomLoggerService],
  exports: [CategoryService],
})
export class CategoryModule {}
