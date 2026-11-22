import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Kysely, NoResultError } from 'kysely';
import { KYSELY_DB } from '../database/database.module.js';
import { DB } from '../database/db.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  async findAll(search?: string) {
    return this.db
      .selectFrom('products')
      .selectAll()
      .$if(Boolean(search), (qb) =>
        qb.where('products.name', 'ilike', `%${search}%`),
      )
      .orderBy('created_at', 'desc')
      .execute();
  }

  async findOneById(id: number) {
    try {
      return await this.db
        .selectFrom('products')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow();
    } catch (e) {
      if (e instanceof NoResultError) {
        throw new NotFoundException('product not found');
      }
      throw e;
    }
  }

  create(dto: CreateProductDto) {
    return this.db
      .insertInto('products')
      .values(dto)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
