import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { CartItemsController } from './cart-items.controller.js';
import { CartItemsService } from './cart-items.service.js';

@Module({
  imports: [ProductsModule],
  controllers: [CartItemsController],
  providers: [CartItemsService],
})
export class CartItemsModule {}
