module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('PGHOST', '127.0.0.1'),
      port: env.int('PGPORT', 5432),
      database: env('PGDATABASE', 'strapi'),
      user: env('PGUSER', 'strapi'),
      password: env('PGPASSWORD', 'strapi'),
      ssl: env.bool(true),
      acquireConnectionTimeout: 5000,
    },
    pool: {
      min: 0,
      max: 25,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 120000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
  },
});
