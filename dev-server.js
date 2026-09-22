/**
 * Local dev server for the /api serverless functions.
 *
 * Run this in a second terminal (`npm run dev:api`) alongside `npm start`.
 * CRA's dev server (started by `npm start`) proxies any request it doesn't
 * recognize — like `/api/shorten` — to this server, via the "proxy" field
 * in package.json. This mirrors how the same functions run on Vercel,
 * without needing the Vercel CLI.
 *
 * Note: CRA's dev server serves your React app for *every* other path
 * (including bare 3-character codes like /abc), so the cfat.site/abc
 * redirect itself can't be tested through localhost:3000 in dev — only
 * after deploying, where vercel.json's rewrite takes over. To test a
 * redirect locally, hit this server directly: http://localhost:4000/abc
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// --- tiny .env loader (no extra dependency needed) ---------------------
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  });
}
loadEnv();

const shortenHandler = require('./api/shorten');
const redirectHandler = require('./api/redirect');

const PORT = process.env.API_PORT || 4000;

function withHelpers(req, res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };
  res.send = (data) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'text/plain');
    }
    res.end(data);
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => resolve(raw));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  req.query = Object.fromEntries(url.searchParams.entries());
  withHelpers(req, res);

  try {
    if (req.method === 'POST' && url.pathname === '/api/shorten') {
      const raw = await readBody(req);
      try {
        req.body = raw ? JSON.parse(raw) : {};
      } catch {
        req.body = {};
      }
      await shortenHandler(req, res);
      return;
    }

    // Direct query-string form, e.g. /api/redirect?code=abc
    if (req.method === 'GET' && url.pathname === '/api/redirect') {
      await redirectHandler(req, res);
      return;
    }

    // Bare 3-char code, e.g. /abc — same shape vercel.json rewrites to.
    const codeMatch = url.pathname.match(/^\/([A-Za-z0-9]{3})$/);
    if (req.method === 'GET' && codeMatch) {
      req.query.code = codeMatch[1];
      await redirectHandler(req, res);
      return;
    }

    res.status(404).send('Not found.');
  } catch (error) {
    console.error('dev server error:', error);
    res.status(500).send('Internal error.');
  }
});

server.listen(PORT, () => {
  console.log(`API dev server running at http://localhost:${PORT}`);
  console.log('CRA (npm start) will proxy /api/* requests here automatically.');
});
