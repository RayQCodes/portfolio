import React from 'react'
import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Coupon Management API',
    tag: 'Backend + REST APIs',
    description:
      'Built REST APIs using Java and Spring Boot for coupon creation, updates, and redemption with persistence and endpoint testing.',
  },
  {
    title: 'Invisible CAPTCHA System',
    tag: 'Security + Team Project',
    description:
      'Worked on a security-focused team project with a 6 person team exploring bot detection, backend validation, and cloud-based deployment and we also worked using the software engineering life cycle as well as Agile.',
  },
  {
    title: 'Unit Tester Application',
    tag: 'Testing + Automation',
    description:
      'A lightweight application for sending requests, checking results, and supporting API testing workflows.',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-head">
          <p className="section-label">Technical Projects</p>
          <h2>Work that feels technical and visually sharp.</h2>
          <p className="section-subtext">
            Projects that reflect backend development, API design, security thinking, and clean presentation.
          </p>
        </div>

        <div className="cards-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="project-card glass-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <div className="project-tag">{project.tag}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}