const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env
const envPath = path.join(__dirname, '../../../.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Supabase URL or Key missing in .env!');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log('Querying database users table...');
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error.message);
  } else {
    console.log(`Found ${data.length} user records:`);
    data.forEach((u) => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, FirebaseUID: ${u.firebase_uid}, Status: ${u.status}`);
    });
  }
}

run();
