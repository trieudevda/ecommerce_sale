import { Module } from '@nestjs/common';
import { CategoryAttributeValuesService } from './category_attribute_values.service';
import { CategoryAttributeValuesController } from './category_attribute_values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAttributeValue } from './entities/category_attribute_value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryAttributeValue])],
  controllers: [CategoryAttributeValuesController],
  providers: [CategoryAttributeValuesService],
})
export class CategoryAttributeValuesModule {}
