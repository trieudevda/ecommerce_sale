import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoryAttributeService } from './category_attribute.service';
import { CreateCategoryAttributeDto } from './dto/create-category_attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category_attribute.dto';
import { FindCategoryAttributeDto } from './dto/find-attribute.dto';

@Controller('category-attribute')
export class CategoryAttributeController {
  constructor(
    private readonly categoryAttributeService: CategoryAttributeService,
  ) {}

  @Post()
  create(@Body() createCategoryAttributeDto: CreateCategoryAttributeDto) {
    return this.categoryAttributeService.create(createCategoryAttributeDto);
  }

  @Get('find-all')
  findAll(@Query() query: FindCategoryAttributeDto) {
    return this.categoryAttributeService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoryAttributeService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryAttributeDto: UpdateCategoryAttributeDto) {
  //   return this.categoryAttributeService.update(+id, updateCategoryAttributeDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryAttributeService.remove(+id);
  // }
}
