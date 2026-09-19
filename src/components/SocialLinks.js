import React from 'react';

const SocialLinks = () => (
  <div className="social-links" aria-label="Social links">
    {[
      ['LinkedIn', 'linkedin-in', 'https://www.linkedin.com/in/shifat-rahman-a203a9293/'],
      ['GitHub', 'github', 'https://github.com/shifatsrm09'],
      ['Facebook', 'facebook-f', 'https://www.facebook.com/shifatrahmaan'],
      ['Instagram', 'instagram', 'https://www.instagram.com/_cfat_/'],
      ['Twitter', 'twitter', 'https://twitter.com'],
    ].map(([label, icon, href]) => (
      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
        <i className={`fab fa-${icon}`} aria-hidden="true" />
      </a>
    ))}
  </div>
);

export default SocialLinks;
