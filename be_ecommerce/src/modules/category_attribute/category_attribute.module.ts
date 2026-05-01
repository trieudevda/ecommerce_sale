import { Module } from '@nestjs/common';
import { CategoryAttributeService } from './category_attribute.service';
import { CategoryAttributeController } from './category_attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAttribute } from './entities/category_attribute.entity';
import { CategoryAttributeValue } from '../category_attribute_values/entities/category_attribute_value.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryAttribute, CategoryAttributeValue]),
  ],
  controllers: [CategoryAttributeController],
  providers: [CategoryAttributeService],
  exports: [CategoryAttributeService],
})
export class CategoryAttributeModule {}
