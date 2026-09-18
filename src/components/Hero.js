import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="hero-section" aria-labelledby="intro-title">
    <div className="hero-content">
      <img src={`${process.env.PUBLIC_URL}/pixilated.png`} alt="Pixel art portrait of Shifat Rahman" width="5226" height="5226" className="profile-image" />
      <h1 id="intro-title" className="name-title">Hey there <span className="greeting-emoji">👋</span> ~ I’m CFAT</h1>
      <div className="intro-copy">
        <p className="intro-lead">I’m <strong>Dewan Sifat Rahman</strong>, a CSE student at <strong>BRAC University.</strong></p>
        <div className="intro-description">
          <p>I build <strong>full-stack applications, developer tools, and systems</strong> that solve practical problems.</p>
          <p>Most of my work revolves around web development, databases, automation, and experimenting with new technologies.</p>
        </div>
        <p>Currently building breaking.</p>
      </div>
      <div className="social-links" aria-label="Social links">
        {[
          ['LinkedIn', 'linkedin-in', 'https://linkedin.com'],
          ['Facebook', 'facebook-f', 'https://facebook.com'],
          ['Instagram', 'instagram', 'https://instagram.com'],
          ['Twitter', 'twitter', 'https://twitter.com'],
        ].map(([label, icon, href]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
            <i className={`fab fa-${icon}`} aria-hidden="true" />
          </a>
        ))}
      </div>
      <nav className="hero-actions" aria-label="Explore my website">
        <Link className="btn-custom" to="/portfolio">Explore My Work</Link>
        <Link className="btn-custom" to="/about">A Little About Me</Link>
        <span className="action-newline" />
        <Link className="btn-custom" to="/contact">Get in Touch</Link>
      </nav>
    </div>
  </section>
);

export default Hero;
