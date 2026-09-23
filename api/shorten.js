const { getLinksCollection } = require('../lib/mongodb');
const { randomCode } = require('../lib/shortcode');

// 3-character codes that should never be handed out, since they'd collide
// with real paths or reserved namespaces on the site.
const RESERVED = new Set(['api']);

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// People often paste a bare domain like "facebook.com/whatever" — assume
// https:// instead of forcing them to type the scheme themselves.
function normalizeUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      body = {};
    }
  }

  const longUrl = normalizeUrl(body?.url);
  const preferredCode = String(body?.code || '').trim();

  if (!longUrl || !isValidUrl(longUrl)) {
    res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
    return;
  }

  const isUsableCandidate = (candidate) => (
    /^[a-np-z1-9]{3}$/.test(candidate) && !RESERVED.has(candidate)
  );

  try {
    const collection = await getLinksCollection();

    // Fast path: the client already guessed a code (so it could show the
    // link instantly). Try to claim that exact code with a single atomic
    // insert — the unique index on `code` guarantees correctness even if
    // two people guess the same three characters at once.
    if (isUsableCandidate(preferredCode)) {
      try {
        await collection.insertOne({
          code: preferredCode,
          longUrl,
          createdAt: new Date(),
          clicks: 0,
        });
        res.status(201).json({ code: preferredCode, shortUrl: `https://cfat.site/${preferredCode}` });
        return;
      } catch (err) {
        // 11000 = duplicate key, meaning the guessed code was already taken.
        // Fall through to the normal random-generation path below.
        if (err?.code !== 11000) throw err;
      }
    }

    let code;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = randomCode(3);
      if (!isUsableCandidate(candidate) || candidate === preferredCode) continue;
      try {
        // eslint-disable-next-line no-await-in-loop
        await collection.insertOne({ code: candidate, longUrl, createdAt: new Date(), clicks: 0 });
        code = candidate;
        break;
      } catch (err) {
        if (err?.code !== 11000) throw err;
        // taken — loop and try another candidate
      }
    }

    if (!code) {
      // Practically won't happen (62^3 = ~238k combinations), but fail
      // cleanly instead of hanging if the space is ever nearly exhausted.
      res.status(503).json({ error: 'Could not generate a free code right now. Please try again.' });
      return;
    }

    res.status(201).json({ code, shortUrl: `https://cfat.site/${code}` });
  } catch (error) {
    console.error('shorten error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
