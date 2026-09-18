import React from 'react';
import SocialLinks from './SocialLinks';

const Hero = () => (
  <section className="hero-section" aria-labelledby="intro-title">
    <div className="hero-content">
      <img src={`${process.env.PUBLIC_URL}/pixilated.png`} alt="Pixel art portrait of Shifat Rahman" width="5226" height="5226" className="profile-image" />
      <h1 id="intro-title" className="name-title">Hey there <span className="greeting-emoji">👋</span> ~ I’m CFAT</h1>
      <div className="intro-copy">
        <p className="intro-lead">Currently Studying at Brac University.</p>
        <div className="intro-description">
          <p>I build <strong>full-stack applications, developer tools, and systems</strong></p>
        </div>
        <p>currently Triangulating</p>
      </div>
      <SocialLinks />
    </div>
  </section>
);

export default Hero;
