import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const themeJokes = [
  'Eww, the big light! 😭',
  'You again? Choose darkness. 🤨',
  'Your retinas said nope. 😎',
  'Light mode? In this economy? 💸',
  'Sir, this is a dark site. 🌚',
  'Flashbang successfully dodged. 🥷',
  'The sun has been blocked. 🚫',
  'Nice try, tiny sunshine. ☀️',
  'My pixels prefer pajamas. 💤',
  'Back to the dark side. 🌑',
];

const CustomNavbar = () => {
  const [theme, setTheme] = useState('dark');
  const [message, setMessage] = useState('');
  const hasTried = useRef(false);
  const busy = useRef(false);
  const flashTimer = useRef();
  const messageTimer = useRef();
  const cooldownTimer = useRef();
  const jokeIndex = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('cfat-theme', 'dark'); } catch { /* Storage is optional. */ }
  }, [theme]);

  useEffect(() => () => {
    clearTimeout(flashTimer.current);
    clearTimeout(messageTimer.current);
    clearTimeout(cooldownTimer.current);
    document.documentElement.dataset.theme = 'dark';
  }, []);

  const showMessage = () => {
    clearTimeout(messageTimer.current);
    setMessage(themeJokes[jokeIndex.current]);
    jokeIndex.current = (jokeIndex.current + 1) % themeJokes.length;
    messageTimer.current = setTimeout(() => setMessage(''), 5000);
  };

  const teaseAgain = () => {
    if (hasTried.current && theme !== 'light') {
      showMessage();
    }
  };

  const tryLightMode = () => {
    if (busy.current) return;
    hasTried.current = true;
    busy.current = true;
    const punchline = () => {
      setTheme('dark');
      showMessage();
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      punchline();
    } else {
      setTheme('light');
      flashTimer.current = setTimeout(punchline, 450);
    }
    // Repeated clicks should never turn the page into a strobe.
    cooldownTimer.current = setTimeout(() => { busy.current = false; }, 2500);
  };
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <div className="brand-group">
          <Link to="/" className="site-brand" aria-label="CFAT home">
            <img src={`${process.env.PUBLIC_URL}/t2.png`} width="32" height="32" alt="" />
            <span>CFAT</span>
          </Link>
          <div className="theme-control">
          <button className="theme-toggle" onClick={tryLightMode} onPointerEnter={teaseAgain} onFocus={teaseAgain} aria-label="Try light mode" aria-describedby={message ? 'theme-joke' : undefined}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              {theme === 'dark' ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.8 14A9 9 0 0 1 10 3.2 9 9 0 1 0 20.8 14Z" />}
            </svg>
          </button>
          <div id="theme-joke" className={`theme-joke${message ? ' is-visible' : ''}`} role="status" aria-live="polite" aria-atomic="true">
            {message && <><span>{message}</span><button type="button" onClick={() => setMessage('')} aria-label="Dismiss message"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg></button></>}
          </div>
          </div>
        </div>
        <div className="nav-links">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/portfolio">Portfolio</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>
      </nav>
    </header>
  );
};
export default CustomNavbar;
