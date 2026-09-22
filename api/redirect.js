const { getLinksCollection } = require('../lib/mongodb');

module.exports = async (req, res) => {
  const code = String(req.query?.code || '');

  if (!/^[A-Za-z0-9]{3}$/.test(code)) {
    res.status(404).send('Not found.');
    return;
  }

  try {
    const collection = await getLinksCollection();

    // Atomic fetch-and-increment in a single round trip: fast, and never
    // undercounts clicks under concurrent hits on the same code.
    const result = await collection.findOneAndUpdate(
      { code },
      { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } },
      { returnDocument: 'after' },
    );

    // Different driver versions return either the document directly or
    // wrapped as `{ value }` — handle both without caring which is running.
    const link = result && Object.prototype.hasOwnProperty.call(result, 'value') ? result.value : result;

    if (!link || !link.longUrl) {
      res.status(404).send('This short link does not exist.');
      return;
    }

    res.writeHead(302, { Location: link.longUrl });
    res.end();
  } catch (error) {
    console.error('redirect error:', error);
    res.status(500).send('Something went wrong.');
  }
};
