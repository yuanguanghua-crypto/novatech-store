const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.gncatdyagmelyiawrqai',
  password: 'huashi0768$',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

(async () => {
  console.log('Testing Transaction Pooler (port 6543)...');
  try {
    await client.connect();
    const res = await client.query('SELECT current_database(), current_user, version()');
    console.log('DB:', res.rows[0].current_database);
    console.log('User:', res.rows[0].current_user);
    console.log('Version:', res.rows[0].version.slice(0, 50));
    await client.end();
    console.log('\n✅ Transaction Pooler connected!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
})();
