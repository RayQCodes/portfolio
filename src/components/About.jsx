import React from 'react'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <motion.div
          className="about-panel glass-card"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="about-left">
            <p className="section-label">About Me</p>
            <h2>I want recruiters to remember both the engineering and the feel.</h2>
            <p className="section-subtext">
              My cybersecurity background shapes how I approach software. I care about backend systems
              that are functional, polished, and harder to abuse. I want the site to feel modern
              without looking messy or overdone.
            </p>
          </div>

          <div className="about-right">
            <div className="info-pill">Backend-focused builder</div>
            <div className="info-pill">Interested in internships and production-style projects</div>
            <div className="info-pill">Learning by shipping polished work</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}