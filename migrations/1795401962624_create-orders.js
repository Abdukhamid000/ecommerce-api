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
  pgm.createType('order_status', [
    'pending',
    'paid',
    'shipped',
    'delivered',
    'cancelled',
  ]);

  pgm.createTable('orders', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'RESTRICT',
    },

    shipment_city: {
      type: 'varchar(255)',
      notNull: true,
    },

    shipment_street: {
      type: 'varchar(255)',
      notNull: true,
    },

    shipment_postal_code: {
      type: 'varchar(20)',
      notNull: true,
    },

    phone: {
      type: 'varchar(255)',
      notNull: true,
    },

    status: {
      type: 'order_status',
      default: 'pending',
      notNull: true,
    },

    total_amount: {
      type: 'DECIMAL(10, 2)',
      notNull: true,
    },

    created_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },

    updated_at: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('orders');
  pgm.dropType('order_status');
};
