import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryQueryDto } from './dto/find-category-query.dto';

@Controller('category')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Permissions('category.findAll')
  @Get('find-all')
  findAll(@Query() query: FindCategoryQueryDto) {
    return this.categoryService.findAll(query);
  }
  @Permissions('category.create')
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
