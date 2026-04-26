import { Controller, Post, Body, Param } from '@nestjs/common';
import { ProductVariantService } from './product_variant.service';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  create(
    @Param() id: number,
    @Body() createProductVariantDto: CreateProductVariantDto,
  ) {
    return this.productVariantService.create(id, createProductVariantDto);
  }

  // @Get()
  // findAll() {
  //   return this.productVariantService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productVariantService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto) {
  //   return this.productVariantService.update(+id, updateProductVariantDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productVariantService.remove(+id);
  // }
}
