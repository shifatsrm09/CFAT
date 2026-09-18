import React from 'react';

const projects = [
  {
    name: 'JoinDrive',
    language: 'TypeScript',
    color: '#3178c6',
    stars: 2,
    description: 'A platform where all your Google Drive storage lives, explored just like a file explorer — on the cloud.',
    url: 'https://joindrive.cfat.site',
  },
  {
    name: 'CourseCompass',
    language: 'JavaScript',
    color: '#f1e05a',
    stars: 2,
    description: 'Smart course planning made simple. Stay on track and graduate on time.',
    url: 'https://compass.cfat.site',
  },
  {
    name: 'QRAuthentication',
    language: 'JavaScript',
    color: '#f1e05a',
    stars: 1,
    description: 'Seamless, passwordless login with your phone — no app required. Scan it, log in.',
    url: 'https://shifatsrm09.github.io/QRAuthentication/#/login',
  },
  {
    name: 'CLI-chat',
    language: 'JavaScript',
    color: '#f1e05a',
    stars: 7,
    description: 'Interact with and share files straight from your terminal.',
    url: 'https://github.com/shifatsrm09/CLI-chat',
  },
  {
    name: 'YSync',
    language: 'JavaScript',
    color: '#f1e05a',
    stars: 2,
    description: 'Watch YouTube videos together, perfectly in sync.',
    url: 'https://github.com/shifatsrm09/YSync',
  },
  {
    name: 'CFAT',
    language: 'JavaScript',
    color: '#f1e05a',
    stars: 2,
    description: "A portfolio site that serves its purpose. You're on it right now.",
    url: 'https://github.com/shifatsrm09/CFAT',
  },
];

const AboutPage = () => (
  <section className="page-section about-page" aria-labelledby="about-title">
    <div className="about-content">
      <span className="about-eyebrow">Who I am</span>
      <h1 id="about-title">About Me</h1>

      <div className="about-bio">
        <p>
          I'm <strong>Shifat Rahman</strong>, a CSE student at BRAC University who likes building things mostly to see how they work under the hood.
        </p>
        <p>
          Most of what I do lives somewhere between web development, databases, and systems — full-stack apps, course-planning tools, and the occasional detour into Linux, networking, and automation. A simple idea usually turns into a much bigger rabbit hole than I planned for.
        </p>
        <p>
          I care less about just making something run and more about understanding why it works — writing code that's clean and practical, and getting a little better at it with every project.
        </p>
      </div>

      <div className="about-focus">
        <span className="about-focus-dot" aria-hidden="true" />
        <p>Right now I'm focused on becoming a better software engineer: building more, learning from what breaks, and shipping things people can actually use.</p>
      </div>

      <h2 className="about-projects-heading">What I'm building</h2>
      <div className="about-project-grid">
        {projects.map((project) => (
          <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="about-project-card">
            <div className="about-project-top">
              <span className="about-project-name">{project.name}</span>
              <span className="about-project-lang">
                <span className="lang-dot" style={{ background: project.color }} aria-hidden="true" />
                {project.language}
              </span>
            </div>
            <p className="about-project-desc">{project.description}</p>
            <span className="about-project-stars">★ {project.stars}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default AboutPage;
