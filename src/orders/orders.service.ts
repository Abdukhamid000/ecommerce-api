import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Kysely } from 'kysely';
import { CartItemsService } from '../cart-items/cart-items.service.js';
import { KYSELY_DB } from '../database/database.module.js';
import { DB } from '../database/db.js';
import { CreateOrderDto } from './dto/create-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private cartItemsService: CartItemsService,
  ) {}

  async checkout(userId: number, dto: CreateOrderDto) {
    const userAllCartItems = await this.cartItemsService.findAllByUser(userId);

    if (!userAllCartItems.length)
      throw new NotFoundException('no cart items found');

    let totalAmountInt = 0;
    userAllCartItems.forEach((item) => {
      const intNum = Math.round(Number(item.price) * 100);
      totalAmountInt += intNum * item.quantity;
    });

    const totalAmount = (totalAmountInt / 100).toFixed();

    const newOrder = await this.db.transaction().execute(async (trx) => {
      for (const item of userAllCartItems) {
        const res = await trx
          .updateTable('products')
          .set((eb) => ({
            stock_count: eb('stock_count', '-', item.quantity),
          }))
          .where('products.id', '=', item.product_id)
          .where('products.stock_count', '>=', item.quantity)
          .executeTakeFirst();

        if (Number(res.numUpdatedRows) === 0)
          throw new ConflictException(`Out of stock: ${item.name}`);
      }

      const order = await trx
        .insertInto('orders')
        .returningAll()
        .values({ user_id: userId, ...dto, total_amount: totalAmount })
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('order-items')
        .values(
          userAllCartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            unit_price: item.price,
            quantity: item.quantity,
            product_name: item.name,
          })),
        )
        .execute();

      await trx
        .deleteFrom('cart_items')
        .where('user_id', '=', userId)
        .execute();

      return order;
    });

    return newOrder;
  }
}
