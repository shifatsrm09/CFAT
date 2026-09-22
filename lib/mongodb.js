const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing MONGO_URI environment variable');
}

// Vercel reuses the module scope across "warm" invocations of the same
// lambda, so caching the connection promise on `global` avoids opening a
// fresh MongoDB connection on every single request.
let clientPromise = global._cfatMongoClientPromise;

if (!clientPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 5,
  });
  clientPromise = client.connect();
  global._cfatMongoClientPromise = clientPromise;
}

let indexReady;

async function getLinksCollection() {
  const client = await clientPromise;
  const collection = client.db('url-shortener').collection('links');

  // Only ever attempted once per warm lambda instance, not per request.
  if (!indexReady) {
    indexReady = collection.createIndex({ code: 1 }, { unique: true });
  }
  await indexReady;

  return collection;
}

module.exports = { getLinksCollection };
