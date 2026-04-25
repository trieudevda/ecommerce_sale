import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { FindUserQueryDto } from '../user/dto/find-user-query.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Permissions('product.findAll')
  @Get('/find-all')
  findAll(@Query() query: FindProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Permissions('product.find')
  @Get('/find')
  findOne(@Query() query: FindProductQueryDto) {
    return this.productService.findOne(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
