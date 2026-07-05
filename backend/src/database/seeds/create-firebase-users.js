const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Parse backend/.env manually to avoid dotenv dependency issues
const envPath = path.join(__dirname, '../../../.env');
if (!fs.existsSync(envPath)) {
  console.error('Config Error: .env file not found at ' + envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] ? match[2].trim() : '';
    // Strip wrapping quotes
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
});

const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
let privateKey = env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // Convert literal \n to actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!projectId || !clientEmail || !privateKey) {
  console.error('Firebase Admin configurations are missing in .env!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const demoUsers = [
  {
    uid: 'fb-uid-district-admin',
    email: 'district.admin@curesync.gov.in',
    password: 'Password@123',
    displayName: 'Dr. Rajendra Prasad',
  },
  {
    uid: 'fb-uid-admin-rampur',
    email: 'admin.rampur@curesync.gov.in',
    password: 'Password@123',
    displayName: 'Dr. Ramesh Sharma',
  },
  {
    uid: 'fb-uid-staff-healthcare-rampur',
    email: 'staff.healthcare.rampur@curesync.gov.in',
    password: 'Password@123',
    displayName: 'Dr. S. Verma',
  },
  {
    uid: 'fb-uid-staff-ops-rampur',
    email: 'staff.ops.rampur@curesync.gov.in',
    password: 'Password@123',
    displayName: 'Amit Kumar',
  },
];

async function run() {
  console.log('Seeding Firebase Authentication accounts...');
  for (const user of demoUsers) {
    try {
      try {
        await admin.auth().getUser(user.uid);
        console.log(`- Account already exists: ${user.email}`);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          await admin.auth().createUser({
            uid: user.uid,
            email: user.email,
            password: user.password,
            displayName: user.displayName,
          });
          console.log(`+ Successfully created: ${user.email} (UID: ${user.uid})`);
        } else {
          throw err;
        }
      }
    } catch (e) {
      console.error(`x Failed for ${user.email}:`, e.message);
    }
  }
  console.log('Firebase accounts seed task finished.');
}

run();
