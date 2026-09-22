import React, { useEffect, useState } from 'react';

const HISTORY_KEY = 'cfat-shortener-history';
const HISTORY_LIMIT = 10;

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveHistory = (items) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    /* Storage is optional. */
  }
};

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShortenPage = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const next = [entry, ...prev.filter((item) => item.code !== entry.code)].slice(0, HISTORY_LIMIT);
      saveHistory(next);
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const copyToClipboard = async (text, code) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 1800);
    } catch {
      /* Clipboard access denied; the link is still visible to copy manually. */
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data);
      addToHistory({ ...data, longUrl: trimmed, createdAt: new Date().toISOString() });
      setUrl('');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section shorten-page" aria-labelledby="shorten-title">
      <div className="shorten-content">
        <span className="contact-eyebrow">Link tool</span>
        <h1 id="shorten-title">URL Shortener</h1>
        <p className="contact-intro">Paste a long link, get back something like <strong>cfat.site/abc</strong>.</p>

        <form className="shorten-form" onSubmit={handleSubmit}>
          <input
            type="url"
            inputMode="url"
            required
            placeholder="https://example.com/a/very/long/link"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="shorten-input"
            aria-label="URL to shorten"
          />
          <button type="submit" className="shorten-submit" disabled={loading}>
            {loading ? 'Shortening…' : 'Shorten'}
          </button>
        </form>

        {error && <p className="shorten-error" role="alert">{error}</p>}

        {result && (
          <div className="shorten-result">
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="shorten-result-link">
              {result.shortUrl.replace('https://', '')}
            </a>
            <button type="button" className="shorten-copy" onClick={() => copyToClipboard(result.shortUrl, result.code)} aria-label="Copy short link">
              {copiedCode === result.code ? <CheckIcon /> : <CopyIcon />}
              {copiedCode === result.code ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="shorten-history">
            <div className="shorten-history-head">
              <span>Your recent links</span>
              <button type="button" className="shorten-clear" onClick={clearHistory}>Clear</button>
            </div>
            <div className="shorten-history-list">
              {history.map((item) => (
                <div key={item.code} className="shorten-history-item">
                  <div className="shorten-history-text">
                    <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="shorten-history-short">
                      {item.shortUrl.replace('https://', '')}
                    </a>
                    <span className="shorten-history-long">{item.longUrl}</span>
                  </div>
                  <button type="button" className="shorten-copy shorten-copy--ghost" onClick={() => copyToClipboard(item.shortUrl, item.code)} aria-label="Copy short link">
                    {copiedCode === item.code ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              ))}
            </div>
            <p className="shorten-history-note">Saved only in this browser — nobody else can see your list.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShortenPage;
