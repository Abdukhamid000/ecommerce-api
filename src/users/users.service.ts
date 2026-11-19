import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../database/database.module.js';
import { DB } from '../database/db.js';

@Injectable()
export class UsersService {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  crateUser() {}
}
