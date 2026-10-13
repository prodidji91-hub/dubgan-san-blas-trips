import { scryptSync, randomBytes } from 'node:crypto';
import readline from 'node:readline';

function generateHash(password) {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const keylen = 64;

  const derivedKey = scryptSync(password, salt, keylen, { N, r, p });
  const saltHex = salt.toString('hex');
  const hashHex = derivedKey.toString('hex');

  return `scrypt$${N}$${r}$${p}$${saltHex}$${hashHex}`;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Private password prompt with muted output
let mutableOutput = false;
rl._writeToOutput = function writeToOutput(stringToWrite) {
  if (mutableOutput) {
    process.stdout.write(stringToWrite);
  } else {
    // Hide password characters
    if (stringToWrite.includes('\n') || stringToWrite.includes('\r')) {
      process.stdout.write('\n');
    }
  }
};

mutableOutput = true;
process.stdout.write('🔑 Enter admin password: ');
mutableOutput = false;

rl.question('', (password) => {
  rl.close();

  if (!password || !password.trim()) {
    process.stderr.write('\n❌ Password cannot be empty.\n');
    process.exit(1);
  }

  const hashString = generateHash(password.trim());
  process.stdout.write('\n✅ Generated ADMIN_PASSWORD_HASH value for Netlify:\n\n');
  process.stdout.write(`ADMIN_PASSWORD_HASH=${hashString}\n\n`);
  process.stdout.write('Copy and paste the above line into Netlify Dashboard > Site Settings > Environment Variables.\n');
});
