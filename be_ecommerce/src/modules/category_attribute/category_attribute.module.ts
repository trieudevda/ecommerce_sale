import { Module } from '@nestjs/common';
import { CategoryAttributeService } from './category_attribute.service';
import { CategoryAttributeController } from './category_attribute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryAttribute } from './entities/category_attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryAttribute])],
  controllers: [CategoryAttributeController],
  providers: [CategoryAttributeService],
})
export class CategoryAttributeModule {}
