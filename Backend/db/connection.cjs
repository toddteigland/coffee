const { Client } = require('pg');

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

module.exports = { db, connectToDatabase };
