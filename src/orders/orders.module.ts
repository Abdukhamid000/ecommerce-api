import { Module } from '@nestjs/common';
import { CartItemsModule } from '../cart-items/cart-items.module.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [CartItemsModule],
})
export class OrdersModule {}
