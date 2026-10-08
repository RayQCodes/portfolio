import { motion } from "framer-motion";
import { ArrowUpRight, Check, Database, Shield } from "lucide-react";

const projects = [
  {
    id: "captcha",
    title: "Invisible CAPTCHA",
    subtitle: "Award-winning cybersecurity capstone",
    description:
      "Behavioral analysis and bot detection with Python, Flask, and AWS. Achieved 93% detection accuracy with sub-50 ms latency; 1st Place in the GMU Senior Capstone Competition.",
    technologies: ["Python", "Flask", "AWS", "Security"],
    details:
      "Led backend API integration and AWS architecture across a six-engineer team, connecting behavioral signals to the detection workflow with structured JSON APIs and EC2/VPC security controls.",
  },
  {
    id: "quiz",
    title: "Interactive Quiz Application",
    subtitle: "Spring Boot · MySQL · REST APIs",
    description:
      "SQL-backed lessons and quiz questions organized by topic, with server-side answer validation. Built in Java 17 with Spring Boot, MySQL, Spring Data JPA, Hibernate, and Lombok.",
    technologies: ["Java 17", "Spring Boot", "MySQL", "REST APIs"],
    details:
      "Controller–service–repository architecture with DTO mapping and constructor-based dependency injection. The backend retrieves lessons and questions by topic and validates submitted answers on the server.",
    href: "https://github.com/RayQCodes/quizapp/tree/backend",
  },
  {
    id: "foundry",
    title: "Palantir Foundry Hackathon",
    subtitle: "Navy PPBS · AFS Builder Event",
    description:
      "Navy PPBS data analysis and decision support built with Palantir Foundry, Ontology, Workshop, and AIP. Led product direction, application development, and the final team presentation.",
    technologies: ["Foundry", "Ontology", "Workshop", "AIP"],
    details:
      "Used AIP Assist/FDE to transform budget, obligation, contract, vendor, and program data into pipelines and Ontology objects. Built filtering, financial visualizations, KPI views, and evidence-grounded Program Manager decision briefs.",
  },
  {
    id: "wazuh",
    title: "Wazuh SIEM Lab",
    subtitle: "Security monitoring · AWS",
    description:
      "Security monitoring environment using Wazuh, Linux, AWS EC2, VPC networking, and log analysis to explore system activity and security events.",
    technologies: ["Wazuh", "Linux", "AWS EC2", "VPC"],
    details:
      "A hands-on lab focused on collecting and analyzing logs, investigating security events, and understanding cloud networking for a monitoring environment.",
  },
];
function Bars() {
  return (
    <div className="mini-bars">
      {[30, 48, 37, 72, 55, 87, 41, 65, 92, 58, 76, 44].map((height, i) => (
        <i key={i} style={{ height: `${height}%` }} />
      ))}
    </div>
  );
}
// Concept illustrations, not fabricated product screenshots.
function ProjectPreview({ type }) {
  if (type === "quiz")
    return (
      <div className="project-preview quiz-preview" aria-hidden="true">
        <aside>
          <Database size={14} />
          <b>Topics</b>
          <span className="selected-topic">Cloud</span>
          <span>Networking</span>
          <span>Security</span>
          <span>Java</span>
        </aside>
        <div className="quiz-panel">
          <b>Cloud knowledge quiz</b>
          <small>Topic-based learning</small>
          <p>Which AWS service manages permissions?</p>
          <div>Amazon S3</div>
          <div className="selected-answer">
            <Check size={10} /> AWS IAM
          </div>
          <div>Amazon EC2</div>
        </div>
      </div>
    );
  return (
    <div
      className={`project-preview dashboard-preview ${type}`}
      aria-hidden="true"
    >
      <div className="dashboard-title">
        {type === "captcha"
          ? "Invisible CAPTCHA"
          : type === "foundry"
            ? "Navy PPBS Analysis"
            : "wazuh. / Security events"}
        <span>● ● ●</span>
      </div>
      <div className="dashboard-panels">
        {type === "captcha" ? (
          <>
            <div className="preview-metric">
              <small>Bot detection accuracy</small>
              <strong>93%</strong>
              <span>&lt; 50 ms latency</span>
            </div>
            <div>
              <small>Behavioral signals</small>
              <svg viewBox="0 0 140 70">
                <path
                  d="M0 62 L20 52 L35 56 L50 39 L65 44 L82 23 L100 15 L120 34 L140 27"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <Bars />
            </div>
          </>
        ) : type === "foundry" ? (
          <>
            <div>
              <small>Budget &amp; obligations</small>
              <Bars />
              <span className="preview-lines" />
            </div>
            <div>
              <small>Program overview</small>
              <div className="donut" />
              <span className="preview-lines" />
            </div>
          </>
        ) : (
          <>
            <div className="log-panel">
              <small>Event stream</small>
              <span>Authentication</span>
              <span>System activity</span>
              <span>Network events</span>
              <span>Agent logs</span>
            </div>
            <div>
              <Shield size={22} />
              <small>Monitoring &amp; analysis</small>
              <Bars />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default function Projects() {
  return (
    <section
      id="projects"
      className="container featured-projects"
      aria-labelledby="projects-title"
    >
      <div className="project-section-heading">
        <h2 className="eyebrow" id="projects-title">
          Selected work
        </h2>
        <span>Cloud, software &amp; security</span>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <motion.article
            className="project-card"
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <div className="project-heading">
              <span className="project-number">0{index + 1}</span>
              <div>
                <h3>
                  {project.href ? (
                    <a href={project.href} target="_blank" rel="noreferrer">
                      {project.title}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p>{project.subtitle}</p>
              </div>
            </div>
            <ProjectPreview type={project.id} />
            <p className="preview-caption">Concept illustration</p>
            <p className="project-description">{project.description}</p>
            <ul
              className="technology-tags"
              aria-label={`${project.title} technologies`}
            >
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <details>
              <summary>
                Explore project <ArrowUpRight size={14} aria-hidden="true" />
              </summary>
              <p>{project.details}</p>
              {project.id === "quiz" && (
                <>
                  <ul className="api-endpoints">
                    <li>
                      <code>GET /api/lesson/{"{topic}"}</code>
                    </li>
                    <li>
                      <code>GET /api/questions/{"{topic}"}</code>
                    </li>
                    <li>
                      <code>POST /api/answer</code>
                    </li>
                  </ul>
                  <a
                    className="text-link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View backend on GitHub{" "}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </>
              )}
            </details>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
