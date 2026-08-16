import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(testDir, '..');

const apiSource = fs.readFileSync(path.join(root, 'lib', 'api.ts'), 'utf8');
const loginSource = fs.readFileSync(
  path.join(root, 'app', 'login', 'page.tsx'),
  'utf8',
);

test('login preserves the backend unverified-email response details', () => {
  assert.match(apiSource, /loginError\.code = err\.code/);
  assert.match(apiSource, /loginError\.email = err\.email/);
  assert.match(apiSource, /loginError\.status = res\.status/);
});

test('unverified login redirects to verification and preserves invite callback', () => {
  assert.match(loginSource, /err\?\.code === 'EMAIL_NOT_VERIFIED'/);
  assert.match(
    loginSource,
    /new URLSearchParams\(\{ email: err\.email \|\| email \}\)/,
  );
  assert.match(loginSource, /verifyQs\.set\('callback', safeCallback\)/);
  assert.match(loginSource, /router\.push\(`\/verify-email\?\$\{verifyQs\.toString\(\)\}`\)/);
});

test('login keeps the invite callback when the user needs to create an account', () => {
  assert.match(loginSource, /const signupHref = safeCallback/);
  assert.equal((loginSource.match(/href=\{signupHref\}/g) || []).length, 2);
});
