import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client } = require('pg');

// import * as pg from 'pg';

const dbParams = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '1662',
  database: 'coffee'
};

const db = new Client(dbParams);

async function connectToDatabase() {
  await db.connect();
}

export default { db, connectToDatabase };
