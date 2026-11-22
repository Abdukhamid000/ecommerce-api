import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductsService } from './products.service.js';

@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }
}
