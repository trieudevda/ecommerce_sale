import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryAttributeService } from './category_attribute.service';
import { CreateCategoryAttributeDto } from './dto/create-category_attribute.dto';
import { UpdateCategoryAttributeDto } from './dto/update-category_attribute.dto';
import { FindCategoryAttributeDto } from './dto/find-attribute.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('category-attribute')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryAttributeController {
  constructor(
    private readonly categoryAttributeService: CategoryAttributeService,
  ) {}

  @Permissions('category-attribute.create')
  @Post()
  create(@Body() createCategoryAttributeDto: CreateCategoryAttributeDto) {
    return this.categoryAttributeService.create(createCategoryAttributeDto);
  }
  @Permissions('category-attribute.findAll')
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
