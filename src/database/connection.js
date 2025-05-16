require('dotenv').config();
const { Pool } = require('pg');

const useSSL = process.env.USE_SSL === 'true';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: process.env.USE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
module.exports = pool;
