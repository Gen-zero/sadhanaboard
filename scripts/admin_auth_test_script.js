#!/usr/bin/env node
/**
 * Simple admin auth smoke tester. Run from repo root:
 *   node ./scripts/admin_auth_test_script.js
 * It will attempt login -> me -> logout and print results.
 */
const fetch = global.fetch || ((...args) => import('node-fetch').then(m => m.default(...args)));

const API = process.env.API_BASE || 'http://localhost:3000/api/admin';
const USER = process.env.ADMIN_USER || 'admin';
const PASS = process.env.ADMIN_PASS || 'password';

async function post(path, body){
  const res = await fetch(API + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' });
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; } catch { return { status: res.status, body: text }; }
}

async function get(path){
  const res = await fetch(API + path, { credentials: 'include' });
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; } catch { return { status: res.status, body: text }; }
}

(async ()=>{
  console.log('Using API:', API);
  console.log('Logging in as', USER);
  try {
    const login = await post('/login', { username: USER, password: PASS });
    console.log('Login:', login.status, login.body);

    const me = await get('/me');
    console.log('/me:', me.status, me.body);

    const out = await post('/logout', {});
    console.log('Logout:', out.status, out.body);
  } catch (e) {
    console.error('Error during tests', e);
    process.exit(2);
  }
})();
