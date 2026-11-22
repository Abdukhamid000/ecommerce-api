import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../database/database.module.js';
import { DB } from '../database/db.js';
import { ProductsService } from '../products/products.service.js';
import { CreateCartItemDto } from './dto/create-cart-item.dto.js';

@Injectable()
export class CartItemsService {
  constructor(
    @Inject(KYSELY_DB) private readonly db: Kysely<DB>,
    private productService: ProductsService,
  ) {}

  async create(userId: number, dto: CreateCartItemDto) {
    await this.productService.findOneById(dto.product_id);

    return await this.db
      .insertInto('cart_items')
      .values({ ...dto, user_id: userId })
      .onConflict((oc) =>
        oc.columns(['user_id', 'product_id']).doUpdateSet((eb) => ({
          quantity: eb('cart_items.quantity', '+', dto.quantity),
        })),
      )
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findAllByUser(userId: number) {
    return this.db
      .selectFrom('cart_items as ci')
      .innerJoin('products as p', 'p.id', 'ci.product_id')
      .where('ci.user_id', '=', userId)
      .select([
        'ci.id',
        'ci.product_id',
        'p.name',
        'p.description',
        'p.image_urls',
        'p.price',
        'ci.quantity',
      ])
      .execute();
  }

  async deleteById(id: number, userId: number) {
    const res = await this.db
      .deleteFrom('cart_items')
      .where('cart_items.id', '=', id)
      .where('cart_items.user_id', '=', userId)
      .returningAll()
      .executeTakeFirst();

    if (!res) {
      throw new NotFoundException('cart item not found');
    }
  }
}
