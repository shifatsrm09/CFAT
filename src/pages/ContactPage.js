import React from 'react';
import SocialLinks from '../components/SocialLinks';

const ContactPage = () => (
  <section className="page-section contact-page" aria-labelledby="contact-title">
    <div className="contact-content">
      <h1 id="contact-title">Contact Me</h1>
      <div className="contact-emails">
        <a href="mailto:shifatsrm09@gmail.com">shifatsrm09@gmail.com</a>
        <a href="mailto:me@cfat.site">me@cfat.site</a>
      </div>
      <p className="contact-social-note">You can always reach me through my socials. My screen time says I’m probably already there.</p>
      <SocialLinks />
    </div>
  </section>
);

export default ContactPage;
