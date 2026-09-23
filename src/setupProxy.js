const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA automatically loads this file when starting the dev server.
// This forwards /api/* requests to the local API dev server (started with
// `npm run dev:api`), without CRA's own package.json "proxy" field, which
// has a known bug that throws "options.allowedHosts[0] should be a
// non-empty string" on some networks/Node versions.
module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    }),
  );
};
