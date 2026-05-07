import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { FindProductQueryDto } from './dto/find-product-query.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Permissions('product.create')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const refType = req.body.refType || 'other';

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            const uploadPath = join(
              process.cwd(),
              'uploads',
              refType,
              String(year),
              month,
              day,
            );

            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  create(
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(files, createProductDto);
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
