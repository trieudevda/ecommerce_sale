import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRefTypeEnum } from './enum/category.enum';

@Controller('category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Permissions('category.findAll')
  @Get('/find-all')
  findAll(@Query() query: FindCategoryQueryDto) {
    return this.categoryService.findAll(query);
  }
  @Permissions('category.find')
  @Get('/find')
  find(@Query() query: FindCategoryQueryDto) {
    return this.categoryService.find(query);
  }
  @Permissions('category.create')
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  @Permissions('category.update')
  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() createCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(slug, createCategoryDto);
  }
  @Permissions('category.remove')
  @HttpCode(HttpStatus.OK)
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
  @Permissions('category.create')
  @Permissions('category.update')
  @Get('enums/ref-types')
  getRefTypes() {
    // return Object.values(CategoryRefTypeEnum);
    return Object.entries(CategoryRefTypeEnum).map(([key, value]) => ({
    label: key,   // Ví dụ: "ACTIVE"
    value: value, // Ví dụ: "active"
  }));
  }
}
