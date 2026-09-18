import React from 'react';

const SocialLinks = () => (
  <div className="social-links" aria-label="Social links">
    {[
      ['LinkedIn', 'linkedin-in', 'https://linkedin.com'],
      ['GitHub', 'github', 'https://github.com/shifatsrm09'],
      ['Facebook', 'facebook-f', 'https://facebook.com'],
      ['Instagram', 'instagram', 'https://instagram.com'],
      ['Twitter', 'twitter', 'https://twitter.com'],
    ].map(([label, icon, href]) => (
      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
        <i className={`fab fa-${icon}`} aria-hidden="true" />
      </a>
    ))}
  </div>
);

export default SocialLinks;
