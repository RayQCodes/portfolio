import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  GitBranch,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import FeaturedTechnologies from "./FeaturedTechnologies";
import {
  Reveal,
  surfaceEvents,
  useMotionPreference,
} from "./InteractiveMotion";

const skills = [
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    category: "Cloud",
    technologies: [
      "AWS",
      "EC2",
      "VPC",
      "IAM",
      "RDS",
      "S3",
      "CloudWatch",
      "Nginx",
    ],
  },
  {
    icon: Code2,
    title: "Software Engineering",
    category: "Backend",
    technologies: [
      "Java",
      "Spring Boot",
      "Python",
      "Flask",
      "REST APIs",
      "C/C++",
      "JavaScript",
      "HTML/CSS",
      "Unit Testing",
    ],
  },
  {
    icon: Database,
    title: "Data & Persistence",
    category: "Databases",
    technologies: [
      "MySQL",
      "SQL",
      "PostgreSQL",
      "SQLite",
      "Firebase",
      "Spring Data JPA",
      "Hibernate",
    ],
  },
  {
    icon: Workflow,
    title: "AI & Data Platforms",
    category: "Data platforms",
    technologies: [
      "Palantir Foundry",
      "AIP",
      "AIP Assist",
      "Pipeline Builder/FDE",
      "Ontology",
      "Workshop",
      "Logic",
    ],
  },
  {
    icon: GitBranch,
    title: "DevOps & Automation",
    category: "DevOps",
    technologies: ["Docker", "GitHub Actions", "CI/CD", "Linux", "Git/GitHub"],
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity & Monitoring",
    category: "Security",
    technologies: ["Wazuh", "Networking", "Security Groups", "Log Analysis"],
  },
];
const groups = [
  {
    names: [
      "AWS",
      "EC2",
      "VPC",
      "IAM",
      "RDS",
      "S3",
      "CloudWatch",
      "Security Groups",
      "Networking",
      "Nginx",
    ],
    related: [
      "EC2",
      "VPC",
      "IAM",
      "RDS",
      "S3",
      "CloudWatch",
      "Security Groups",
    ],
    note: "Compute, subnet routing, permissions, managed persistence, and observability work together. The explorer separates network access from IAM permissions.",
    href: "#architecture",
    project: "Explore AWS architecture",
  },
  {
    names: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Spring Data JPA",
      "Hibernate",
      "MySQL",
      "SQL",
      "Unit Testing",
    ],
    related: [
      "Java",
      "Spring Boot",
      "REST APIs",
      "Spring Data JPA",
      "Hibernate",
      "MySQL",
    ],
    note: "Java application logic sits behind REST controllers and services; Spring Data JPA and Hibernate connect repositories to relational data.",
    href: "#project-quiz",
    project: "Full-Stack Testing Automation System",
  },
  {
    names: ["Python", "Flask", "C/C++"],
    related: ["Python", "Flask", "AWS", "REST APIs"],
    note: "The Invisible CAPTCHA project connects behavioral signals to a Flask backend and structured JSON APIs on AWS.",
    href: "#project-captcha",
    project: "Invisible CAPTCHA",
  },
  {
    names: ["Wazuh", "Log Analysis", "Linux"],
    related: ["Wazuh", "Log Analysis", "Linux", "EC2", "Networking"],
    note: "Monitoring connects collected system logs to security analysis. Linux and cloud networking support the Wazuh lab environment.",
    href: "#project-wazuh",
    project: "Wazuh SIEM Lab",
  },
  {
    names: [
      "Palantir Foundry",
      "AIP",
      "AIP Assist",
      "Pipeline Builder/FDE",
      "Ontology",
      "Workshop",
      "Logic",
    ],
    related: ["Palantir Foundry", "Ontology", "Workshop", "AIP"],
    note: "Foundry pipelines and Ontology objects support a Workshop application and evidence-grounded AIP decision briefs.",
    href: "#project-foundry",
    project: "Palantir Foundry Hackathon",
  },
  {
    names: ["Firebase", "JavaScript", "HTML/CSS"],
    related: ["Flask", "JavaScript", "HTML/CSS", "Firebase"],
    note: "Authentication and application workflows connect the user interface to backend services and Firebase-backed data.",
    href: "#experience-mais",
    project: "MAIS Solutions experience",
  },
];
export default function Skills() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState("Spring Boot");
  const [hover, setHover] = useState(null);
  const reduced = useMotionPreference();
  const active = hover || selected;
  const connection = groups.find((group) => group.names.includes(active));
  const related = connection?.related || [active];
  return (
    <section id="skills" className="section container">
      <p className="eyebrow">02 / Toolkit</p>
      <Reveal kind="focus">
        <h2>
          Across the <span className="accent">stack.</span>
        </h2>
      </Reveal>
      <FeaturedTechnologies />
      <div className="skills-ecosystem-heading">
        <h3>The connected toolkit.</h3>
        <p>Select a skill to trace its connections to my work.</p>
      </div>
      <div
        className="skills-filters"
        role="group"
        aria-label="Filter skills by category"
      >
        {["All", ...skills.map((item) => item.category)].map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            onClick={() => {
              setCategory(item);
              setHover(null);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <motion.div className="skills-grid" layout={reduced ? false : "position"}>
        <AnimatePresence initial={false}>
          {skills
            .filter((item) => category === "All" || item.category === category)
            .map(({ icon: Icon, title, technologies }) => (
              <motion.article
                key={title}
                className="skill-card premium-surface"
                {...surfaceEvents}
                layout={reduced ? false : "position"}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <Icon size={27} aria-hidden="true" />
                <h3>{title}</h3>
                <div
                  className="skill-badges"
                  role="group"
                  aria-label={`${title} skills`}
                >
                  {technologies.map((tech) => (
                    <button
                      type="button"
                      key={tech}
                      aria-pressed={selected === tech}
                      className={related.includes(tech) ? "related-skill" : ""}
                      onClick={() => {
                        setSelected(tech);
                        setHover(null);
                      }}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse") setHover(tech);
                      }}
                      onPointerLeave={() => setHover(null)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </motion.article>
            ))}
        </AnimatePresence>
      </motion.div>
      <div className="skill-connections" aria-live="polite">
        <div>
          <p className="eyebrow">Connected to / {active}</p>
          <p>
            {connection?.note ||
              `${active} is part of my broader toolkit. Explore the related engineering work and technical experiences below.`}
          </p>
        </div>
        <div className="connection-chain">
          {related.map((tech, i) => (
            <span key={tech}>
              {i > 0 && <i aria-hidden="true" />}
              <strong>{tech}</strong>
            </span>
          ))}
          <a className="text-link" href={connection?.href || "#experience"}>
            {connection?.project || "Explore experience"}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
