const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log('✅ Connection to Supabase successful!');
    return client.query('SELECT NOW()');
  })
  .then((res) => {
    console.log('Server time:', res.rows[0].now);
  })
  .catch((err) => {
    console.error('❌ Connection failed:');
    console.error(err.message);
  })
  .finally(() => {
    client.end();
  });
