const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
let dbUrl = '';
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    let v = trimmed.slice('DATABASE_URL='.length).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    dbUrl = v;
  }
}

const ADMIN_EMAIL = 'anuragkumar.pandit2000@gmail.com';

async function run() {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  console.log('==================================================');
  console.log('STARTING DATABASE CLEANUP VIA POSTGRES CLIENT');
  console.log('Preserving Admin Account:', ADMIN_EMAIL);
  console.log('==================================================\n');

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully!\n');

    // 1. Check Initial Counts
    const userCountRes = await client.query('SELECT count(*) FROM "User";');
    const feedbackCountRes = await client.query('SELECT count(*) FROM "Feedback";');
    console.log(`Initial DB State:`);
    console.log(`- Total Users: ${userCountRes.rows[0].count}`);
    console.log(`- Total Feedbacks: ${feedbackCountRes.rows[0].count}\n`);

    // Verify Admin Exists
    const adminRes = await client.query('SELECT id, email, name, role FROM "User" WHERE email = $1;', [ADMIN_EMAIL]);
    if (adminRes.rows.length === 0) {
      console.warn(`WARNING: Admin ${ADMIN_EMAIL} was not found!`);
    } else {
      const a = adminRes.rows[0];
      console.log(`Found Admin Account: ${a.name} (${a.email}, Role: ${a.role})`);
    }

    // 2. Delete Fake Feedbacks (keep only Anurag Pandit or founding review)
    console.log('\nDeleting fake feedbacks...');
    const delFeedbacksRes = await client.query('DELETE FROM "Feedback" WHERE "authorName" != $1 OR "isSample" = true;', ['Anurag Pandit']);
    console.log(`Deleted ${delFeedbacksRes.rowCount} fake feedback records.`);

    // 3. Delete Non-Admin Fake Users (Cascades will delete profile, streaks, habits, etc.)
    console.log('\nDeleting fake users (all except admin)...');
    const delUsersRes = await client.query('DELETE FROM "User" WHERE email != $1;', [ADMIN_EMAIL]);
    console.log(`Deleted ${delUsersRes.rowCount} fake user records.`);

    // 4. Final Counts Verification
    const finalUserCount = await client.query('SELECT count(*) FROM "User";');
    const finalFeedbackCount = await client.query('SELECT count(*) FROM "Feedback";');
    console.log('\n==================================================');
    console.log('CLEANUP COMPLETE: FRESH STATE READY FOR REAL USERS');
    console.log(`- Remaining Users: ${finalUserCount.rows[0].count} (Admin preserved: ${ADMIN_EMAIL})`);
    console.log(`- Remaining Feedbacks: ${finalFeedbackCount.rows[0].count}`);
    console.log('==================================================\n');

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('PostgreSQL cleanup error:', err.message);
    if (err.code === 'ECONNRESET') {
      console.error('\nNOTE: The database server connection was reset (ECONNRESET).');
      console.error('This typically happens when Proton VPN is active. Please disconnect/pause Proton VPN and rerun this command.');
    }
    process.exit(1);
  }
}

run();
