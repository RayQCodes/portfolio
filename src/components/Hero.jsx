import React from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Software Engineering + Security
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <motion.span
              className="gradient-name"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
            >
              Raymond Quan
            </motion.span>
            <span> builds polished backend systems</span>
            <span className="muted-line">with a modern aesthetic.</span>
          </motion.h1>

          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            I’m a Cybersecurity Engineering student at George Mason University focused on
            backend software engineering, APIs, cloud systems, and practical security.
            I like making projects that feel useful, clean, and memorable.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <a href="#projects" className="primary-btn">View Projects</a>
            <a href="#contact" className="secondary-btn">Contact Me</a>
          </motion.div>

          <motion.div
            className="social-row"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="https://github.com/RayQCodes" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/raymondwquan" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:rquan3@gmu.edu">Email</a>
            
          </motion.div>
        </div>

        <motion.div
          className="hero-card glass-card"
          initial={{ opacity: 0, scale: 0.96, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15 }}
        >
          <div className="card-topbar">
            <span />
            <span />
            <span />
          </div>

          <div className="profile-wrap">
            <img src="/IMG_1581.JPG" alt="Raymond Quan" className="profile-img" />
          </div>

          <div className="floating-chip">backend + cloud + security</div>
        </motion.div>
      </div>
    </section>
  )
}