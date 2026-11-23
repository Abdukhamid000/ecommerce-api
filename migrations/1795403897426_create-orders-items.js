/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('order-items', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },

    order_id: {
      type: 'integer',
      references: '"orders"',
      notNull: true,
      onDelete: 'RESTRICT',
    },

    product_id: {
      type: 'integer',
      references: '"products"',
      notNull: true,
      onDelete: 'NO ACTION',
    },

    product_name: {
      type: 'varchar(255)',
      notNull: true,
    },

    quantity: {
      type: 'integer',
      notNull: true,
      check: 'quantity > 0',
    },

    unit_price: {
      type: 'DECIMAL(10, 2)',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('order-items');
};
