import React from 'react';
import SocialLinks from '../components/SocialLinks';

const emails = [
  { label: 'Personal', address: 'shifatsrm09@gmail.com' },
  { label: 'Site', address: 'me@cfat.site' },
];

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="M3.3 6.2l8.7 6.6 8.7-6.6" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="contact-email-arrow-icon">
    <path d="M5 12h13" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const ContactPage = () => (
  <section className="page-section contact-page" aria-labelledby="contact-title">
    <div className="contact-content">
      <span className="contact-eyebrow">Get in touch</span>
      <h1 id="contact-title">Contact Me</h1>
      <p className="contact-intro">
        Have a project, a question, or just want to say hi? Pick whichever inbox you like — I check both.
      </p>

      <div className="contact-email-list">
        {emails.map(({ label, address }) => (
          <a key={address} href={`mailto:${address}`} className="contact-email-card">
            <span className="contact-email-icon">
              <MailIcon />
            </span>
            <span className="contact-email-text">
              <span className="contact-email-label">{label}</span>
              <span className="contact-email-address">{address}</span>
            </span>
            <ArrowIcon />
          </a>
        ))}
      </div>

      <div className="contact-divider" role="separator">
        <span>or find me on</span>
      </div>

      <SocialLinks />

      <p className="contact-social-note">My screen time says I'm probably already there.</p>
    </div>
  </section>
);

export default ContactPage;
