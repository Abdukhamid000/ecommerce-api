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
  pgm.createType('payment_status', ['pending', 'success', 'failed']);

  pgm.createTable(
    'payments',
    {
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

      payment_status: {
        type: 'payment_status',
        default: 'pending',
      },

      amount: {
        type: 'DECIMAL(10, 2)',
        notNull: true,
      },

      provider: {
        type: 'varchar(255)',
        notNull: true,
      },

      provider_id: {
        type: 'varchar(255)',
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
    },
    {
      constraints: {
        unique: [['provider', 'provider_id']],
      },
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('payments');
};
