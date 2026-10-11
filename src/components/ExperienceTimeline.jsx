import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, ChevronDown, Code2, Workflow } from "lucide-react";
import { surfaceEvents, useMotionPreference } from "./InteractiveMotion";
const experiences = [
  {
    id: "mais",
    date: "June–September 2025 · Remote",
    title: "Volunteer Full-Stack Developer",
    organization: "MAIS Solutions LLC",
    icon: Code2,
    paragraphs: [
      "Developed authentication and application workflows with Python, Flask, HTML, CSS, JavaScript, and database-backed services.",
      "Migrated authentication and dynamic data to Firebase BaaS and validated registration, login, verification, and authenticated-access workflows.",
    ],
    technologies: ["Python", "Flask", "JavaScript", "Firebase"],
    engineering:
      "Connected authentication and application workflows to database-backed services, then migrated authentication and dynamic data to Firebase.",
    impact:
      "Validated registration, login, verification, and authenticated access.",
    workflow: [
      "Registration",
      "Authentication",
      "Verification",
      "Protected access",
    ],
  },
  {
    id: "foundry",
    date: "October 2, 2026 · Builder Event",
    title: "Navy PPBS Decision Intelligence",
    organization: "Accenture Federal Services",
    icon: Workflow,
    paragraphs: [
      "Led product direction and the final presentation for a four-person team building a Navy decision-support application. Selected as one of 40 participants from approximately 200 applicants.",
      "Built Foundry pipelines, Ontology objects, and a Workshop + AIP Logic workflow for financial visualizations and evidence-grounded decision briefs.",
    ],
    technologies: ["Foundry", "Ontology", "Workshop", "AIP Logic"],
    engineering:
      "Cleaned and transformed budget, obligation, contract, vendor, and program data into pipelines and Ontology objects. Built program filtering, KPI views, and financial visualizations.",
    impact:
      "Led product direction and the final presentation for the four-person team. Produced evidence-grounded Program Manager decision briefs with the Workshop + AIP Logic workflow.",
    workflow: ["Source data", "Pipelines", "Ontology", "Workshop + AIP"],
    href: "#project-foundry",
    related: "Palantir Foundry Hackathon",
  },
];
export default function ExperienceTimeline() {
  const root = useRef(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start 85%", "end 45%"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [open, setOpen] = useState(null);
  return (
    <div ref={root} className="experience-list experience-timeline">
      <div className="timeline-track" aria-hidden="true">
        <motion.i style={{ scaleY: reduced ? 1 : progress }} />
      </div>
      {experiences.map((item, i) => (
        <motion.article
          id={`experience-${item.id}`}
          key={item.id}
          className="experience-row premium-surface"
          {...surfaceEvents}
          layout={reduced ? false : "position"}
          initial={reduced ? false : { opacity: 0, x: i === 0 ? -15 : 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
        >
          <span className="timeline-dot" aria-hidden="true" />
          <div>
            <p className="experience-date">{item.date}</p>
            <h3>{item.title}</h3>
            <p className="organization">{item.organization}</p>
            <ul className="technology-tags">
              {item.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
          <div>
            {item.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <button
              type="button"
              className="experience-expand"
              aria-expanded={open === item.id}
              aria-controls={`experience-detail-${item.id}`}
              onClick={() => setOpen(open === item.id ? null : item.id)}
            >
              Explore engineering work
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {open === item.id && (
                <motion.div
                  id={`experience-detail-${item.id}`}
                  className="experience-details"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  <dl>
                    <dt>Engineering work</dt>
                    <dd>{item.engineering}</dd>
                    <dt>Impact</dt>
                    <dd>{item.impact}</dd>
                  </dl>
                  <div
                    className="experience-workflow"
                    aria-label="Conceptual workflow"
                  >
                    {item.workflow.map((step, j) => (
                      <span key={step}>
                        {j > 0 && <ArrowUpRight size={13} aria-hidden="true" />}
                        {step}
                      </span>
                    ))}
                  </div>
                  <p className="mini-disclaimer">
                    Conceptual workflow · Details from the resume
                  </p>
                  {item.href && (
                    <a className="text-link" href={item.href}>
                      {item.related}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
