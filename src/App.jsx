import React from 'react'
import { motion } from 'framer-motion'
import Skills from './components/Skills'

const projects = [
  {
    tag: 'Backend + REST APIs',
    title: 'Coupon Management API',
    desc: 'Built REST APIs using Java and Spring Boot for coupon creation, updates, and redemption.',
  },
  {
    tag: 'Security + Team Project',
    title: 'Invisible CAPTCHA System',
    desc: 'Worked on a security-focused project exploring bot detection, backend validation, and deployment ideas.',
  },
  {
    tag: 'Testing + Automation',
    title: 'Unit Tester Application',
    desc: 'A lightweight application for sending requests, checking results, and supporting API testing.',
  },
]

export default function App() {
  return (
    <div className="page">
      <div className="animated-bg-grid"></div>

      <motion.div
        className="blob blob-1"
        animate={{ y: [0, -20, 0], x: [0, 12, 0], scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-2"
        animate={{ y: [0, 18, 0], x: [0, -14, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-3"
        animate={{ y: [0, -16, 0], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
      />
      <motion.div
        className="blob blob-4"
        animate={{ y: [0, 14, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 13, ease: 'easeInOut' }}
      />

      <header className="navbar">
        <div className="container nav-inner">
          <motion.div
            className="brand"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Raymond Quan
          </motion.div>

          <motion.nav
            className="nav-links"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </motion.nav>

          <motion.a
            href="/resume.pdf"
            className="resume-btn"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Resume
          </motion.a>
        </div>
      </header>

      <main>
        <section className="hero container">
          <div className="hero-text">
            <motion.div
              className="pill"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Backend Engineering + Cloud
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
            >
              <motion.span
                className="gradient floating-name shimmer-text"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              >
                Raymond Quan
              </motion.span>
              <br />
              <span className="hero-dark">Cybersecurity Engineering, B.S.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.16 }}
            >
              I'm a Cybersecurity Engineering student focused on backend software engineering,
              API development, cloud systems, and practical security.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.24 }}
            >
              <motion.a
                href="#projects"
                className="primary-btn"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                View Projects
              </motion.a>
              <motion.a
                href="#contact"
                className="secondary-btn"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Me
              </motion.a>
            </motion.div>

            <motion.div
              className="socials"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a href="https://github.com/RayQCodes" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/raymondwquan" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="mailto:rquan3@gmu.edu">Email</a>
            </motion.div>
          </div>

          <motion.div
            className="hero-card"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            whileHover={{ rotate: -0.8, y: -6 }}
          >
            <div className="orbit-ring orbit-ring-1"></div>
            <div className="orbit-ring orbit-ring-2"></div>

            <div className="card-top">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="image-wrap">
              <img src="/IMG_1581.JPG" alt="Raymond Quan" className="profile-img" />
            </div>

            <motion.div
              className="floating-chip"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              Backend + Cloud + Security
            </motion.div>

            <motion.div
              className="mini-badge mini-badge-1"
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            >
              API Design
            </motion.div>

            <motion.div
              className="mini-badge mini-badge-2"
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 5.5 }}
            >
              Secure Systems
            </motion.div>
          </motion.div>
        </section>

        <section id="projects" className="section container">
          <motion.p
            className="section-label"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Projects
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
          >
            Technical Projects
          </motion.h2>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
          >
            These are some projects I have been working on.
          </motion.p>

          <div className="card-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="glass-card project-card glow-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.01 }}
              >
                <div className="tag">{project.tag}</div>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <Skills />

        <section id="about" className="section container">
          <motion.div
            className="glass-card about-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="section-label">About Me</p>
              <h2>
                My cybersecurity background shapes how I approach software. I care about systems
                that are functional, polished, and harder to abuse. When I'm not building, I love
                to play pickleball 🎾 and watch anime 📺.
              </h2>
            </div>

            <div className="about-pills">
              <motion.div className="info-pill" whileHover={{ x: 6 }}>
                Aspiring Backend and Cloud Focused Engineer
              </motion.div>
              <motion.div className="info-pill" whileHover={{ x: 6 }}>
                Interested in Internships And Opportunities To Improve My Skills 😇
              </motion.div>
              <motion.div className="info-pill" whileHover={{ x: 6 }}>
                Always Passionate to Learn Something New 😃
              </motion.div>
              
            </div>
          </motion.div>
        </section>

        <section id="contact" className="section container">
          <motion.div
            className="glass-card contact-card glow-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label">Contact</p>
            <h2>Let's build something memorable.</h2>
            <p className="section-sub center">
              I'm currently looking for backend engineering and cloud internships and would love to connect.
            </p>

            <div className="hero-buttons center-buttons">
              <motion.a
                href="mailto:rquan3@gmu.edu"
                className="primary-btn"
                whileHover={{ y: -3, scale: 1.03 }}
              >
                rquan3@gmu.edu
              </motion.a>
              <motion.a
                href="https://github.com/RayQCodes"
                target="_blank"
                rel="noreferrer"
                className="secondary-btn"
                whileHover={{ y: -3, scale: 1.03 }}
              >
                GitHub
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/raymondwquan"
                target="_blank"
                rel="noreferrer"
                className="secondary-btn"
                whileHover={{ y: -3, scale: 1.03 }}
              >
                LinkedIn
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}