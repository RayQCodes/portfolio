import React from 'react'
import { motion } from 'framer-motion'

const skills = [
  {
    title: 'Languages',
    desc: 'Java, Python, JavaScript, SQL',
  },
  {
    title: 'DB',
    desc: 'MySQL, SQLite, Firestore',
  },
  {
    title: 'Cloud',
    desc: 'AWS EC2, Firebase, deployment workflows, GitHub Pages',
  },
  {
    title: 'Security',
    desc: 'AWS WAF, IAM, Security Groups, CloudWatch',
  },
   {
    title: 'Other Tools and Frameworks',
    desc: 'Docker,Git/Github, Maven, Hibernate, Spring/Spring Boot',
   }
  
]

export default function Skills() {
  return (
    <section id="skills" className="section container">
      <motion.p
        className="section-label"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Skills
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Java Spring Backend Focus
      </motion.h2>

      <motion.p
        className="section-sub"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
      </motion.p>

      <div className="card-grid small-grid">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.title}
            className="glass-card skill-card glow-card"
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: index * 0.07 }}
            whileHover={{ y: -8 }}
          >
            <h3>{skill.title}</h3>
            <p>{skill.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}