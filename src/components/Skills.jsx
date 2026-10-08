import { Cloud, Code2, Database, Workflow } from "lucide-react";
const skills = [
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "AWS EC2, RDS, S3, VPC, IAM, Lambda, CloudWatch · Docker · GitHub Actions · CI/CD · Nginx · Linux",
  },
  {
    icon: Code2,
    title: "Software Engineering",
    description:
      "Java · Python · C/C++ · JavaScript · SQL · Spring Boot · Flask · REST APIs · HTML/CSS · Unit Testing",
  },
  {
    icon: Database,
    title: "Data & Persistence",
    description:
      "MySQL · PostgreSQL · SQLite · Firebase · Spring Data JPA · Hibernate · Git/GitHub",
  },
  {
    icon: Workflow,
    title: "AI & Data Platforms",
    description:
      "Palantir Foundry · AIP · AIP Assist · Pipeline Builder/FDE · Ontology · Workshop · Logic",
  },
];
export default function Skills() {
  return (
    <section id="skills" className="section container">
      <p className="eyebrow">02 / Toolkit</p>
      <h2>
        Across the <span className="accent">stack.</span>
      </h2>
      <div className="skills-grid">
        {skills.map(({ icon: Icon, title, description }) => (
          <article className="skill-card" key={title}>
            <Icon size={27} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
