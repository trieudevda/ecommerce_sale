import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryAttributeValuesService } from './category_attribute_values.service';
import { CreateCategoryAttributeValueDto } from './dto/create-category_attribute_value.dto';
import { UpdateCategoryAttributeValueDto } from './dto/update-category_attribute_value.dto';

@Controller('category-attribute-values')
export class CategoryAttributeValuesController {
  constructor(private readonly categoryAttributeValuesService: CategoryAttributeValuesService) {}

  @Post()
  create(@Body() createCategoryAttributeValueDto: CreateCategoryAttributeValueDto) {
    return this.categoryAttributeValuesService.create(createCategoryAttributeValueDto);
  }

  @Get()
  findAll() {
    return this.categoryAttributeValuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryAttributeValuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryAttributeValueDto: UpdateCategoryAttributeValueDto) {
    return this.categoryAttributeValuesService.update(+id, updateCategoryAttributeValueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryAttributeValuesService.remove(+id);
  }
}
