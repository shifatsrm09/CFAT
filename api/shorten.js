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

  const longUrl = String(body?.url || '').trim();

  if (!longUrl || !isValidUrl(longUrl)) {
    res.status(400).json({ error: 'Please provide a valid http(s) URL.' });
    return;
  }

  try {
    const collection = await getLinksCollection();

    // Reuse an existing short link for the same destination instead of
    // minting duplicates every time someone shortens the same URL.
    const existing = await collection.findOne({ longUrl });
    if (existing) {
      res.status(200).json({ code: existing.code, shortUrl: `https://cfat.site/${existing.code}` });
      return;
    }

    let code;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = randomCode(3);
      if (RESERVED.has(candidate.toLowerCase())) continue;
      // eslint-disable-next-line no-await-in-loop
      const taken = await collection.findOne({ code: candidate }, { projection: { _id: 1 } });
      if (!taken) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      // Practically won't happen (62^3 = ~238k combinations), but fail
      // cleanly instead of hanging if the space is ever nearly exhausted.
      res.status(503).json({ error: 'Could not generate a free code right now. Please try again.' });
      return;
    }

    await collection.insertOne({
      code,
      longUrl,
      createdAt: new Date(),
      clicks: 0,
    });

    res.status(201).json({ code, shortUrl: `https://cfat.site/${code}` });
  } catch (error) {
    console.error('shorten error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
