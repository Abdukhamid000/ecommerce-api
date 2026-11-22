import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import type { JwtPayload } from '../auth/auth.service.js';
import { CurrentUser } from '../common/current-user.decorator.js';
import { CartItemsService } from './cart-items.service.js';
import { CreateCartItemDto } from './dto/create-cart-item.dto.js';

@Controller('cart-items')
export class CartItemsController {
  constructor(private cartItemsService: CartItemsService) {}

  @Post()
  createCartItem(
    @Body() dto: CreateCartItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cartItemsService.create(user.sub, dto);
  }

  @Get()
  findAllByUser(@CurrentUser() user: JwtPayload) {
    return this.cartItemsService.findAllByUser(user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteById(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.cartItemsService.deleteById(id, user.sub);
  }
}
