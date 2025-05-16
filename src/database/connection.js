require('dotenv').config();
const { Pool } = require('pg');

const useSSL = process.env.USE_SSL === 'true';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: useSSL ? { rejectUnauthorized: false } : false
});

module.exports = pool;
