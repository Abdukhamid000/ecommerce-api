import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../database/database.module.js';
import { DB } from '../database/db.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(@Inject(KYSELY_DB) private readonly db: Kysely<DB>) {}

  private async hashPassword(plainPassword: string) {
    return await bcrypt.hash(plainPassword, 10);
  }

  async findByEmail(email: string) {
    try {
      return await this.db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirstOrThrow();
    } catch (e) {
      throw new NotFoundException('user not found');
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      const { password, ...rest } = dto;
      const hashedPw = await this.hashPassword(password);

      return await this.db
        .insertInto('users')
        .values({ password: hashedPw, ...rest })
        .returningAll()
        .executeTakeFirstOrThrow();
    } catch (err) {
      throw new ConflictException('A user with this email already exists');
    }
  }
}
