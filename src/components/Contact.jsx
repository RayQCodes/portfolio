import React from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <motion.div
          className="contact-panel glass-card"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Contact</p>
          <h2>Let’s build something memorable.</h2>
          <p className="section-subtext center-text">
            I’m currently looking for software engineering internships and would love to connect
            about backend, cloud, or security-focused roles.
          </p>

          <div className="contact-actions">
            <a href="mailto:rquan3@gmu.edu" className="primary-btn">rquan3@gmu.edu</a>
            <a href="https://github.com/RayQCodes" target="_blank" rel="noreferrer" className="secondary-btn">GitHub</a>
            <a href="https://linkedin.com/in/raymondwquan" target="_blank" rel="noreferrer" className="secondary-btn">LinkedIn</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}