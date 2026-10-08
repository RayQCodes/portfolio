import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Shield,
  Sun,
  X,
} from "lucide-react";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

const resume = "/resume.pdf?v=20261008";
const links = [
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Certifications",
  "Contact",
];
const certifications = [
  ["Palantir Foundry Certified Professional", "2026"],
  ["AWS Solutions Architect – Associate", "July 2026"],
  ["AWS AI Practitioner", "August 2026"],
];
function ResumeLink({
  className = "secondary-btn",
  children = "Download Resume",
}) {
  return (
    <a className={className} href={resume} download="Raymond-Quan-Resume.pdf">
      {children}
      <FileText size={18} aria-hidden="true" />
    </a>
  );
}
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("raymond-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* Storage may be unavailable. */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("raymond-theme", theme);
    } catch {
      /* Theme still works without storage. */
    }
  }, [theme]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="page">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="navbar">
          <div className="container nav-inner">
            <a className="brand" href="#home" aria-label="Raymond Quan home">
              <span className="monogram">RQ</span>Raymond Quan
            </a>
            <nav
              id="main-navigation"
              className={`nav-links ${menuOpen ? "is-open" : ""}`}
              aria-label="Main navigation"
            >
              {links.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
            </nav>
            <div className="nav-actions">
              <button
                className="icon-button theme-toggle"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <Moon size={21} /> : <Sun size={21} />}
              </button>
              <button
                className="icon-button menu-toggle"
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
                aria-controls="main-navigation"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </header>
        <main id="main">
          <section
            id="home"
            className="hero container"
            aria-labelledby="hero-title"
          >
            <div className="hero-watermark" aria-hidden="true">
              <span>RAYMOND</span>
              <span>QUAN</span>
            </div>
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <p className="eyebrow">Raymond Quan</p>
              <h1 id="hero-title">
                Cloud &amp;
                <br />
                <span className="accent">Solutions</span>
                <br />
                Architect<span className="accent">.</span>
              </h1>
              <p className="hero-subtitle">
                Designing secure, scalable, and impactful cloud solutions with{" "}
                <strong>AWS</strong>, <strong>DevOps</strong>, and{" "}
                <strong>Software Engineering.</strong>
              </p>
              <div className="hero-buttons">
                <a href="#projects" className="primary-btn">
                  View My Work <ArrowUpRight size={19} aria-hidden="true" />
                </a>
                <ResumeLink />
              </div>
              <div className="socials" aria-label="Social and contact links">
                <a
                  href="https://github.com/RayQCodes"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <Github />
                </a>
                <a
                  href="https://www.linkedin.com/in/raymondwquan"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin />
                </a>
                <a
                  href="mailto:raymondweihaoquan@gmail.com"
                  aria-label="Email Raymond"
                >
                  <Mail />
                </a>
                <ResumeLink className="social-resume">
                  <span className="sr-only">Download resume</span>
                </ResumeLink>
              </div>
            </motion.div>
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
            >
              <div className="avatar-glow" aria-hidden="true" />
              <div className="orbit" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="floating-tile tile-cloud" aria-hidden="true">
                <Cloud />
              </div>
              <div className="floating-tile tile-code" aria-hidden="true">
                <Code2 />
              </div>
              <div className="floating-tile tile-data" aria-hidden="true">
                <Database />
              </div>
              <div className="floating-tile tile-shield" aria-hidden="true">
                <Shield />
              </div>
              <img
                className="hero-avatar"
                src="/raymond-avatar.png"
                width="1024"
                height="1024"
                alt="3D portrait of Raymond with black glasses, a black jacket, and an unbranded laptop"
                fetchPriority="high"
              />
              <p className="hero-note">
                <span aria-hidden="true">↖</span>Student
                <br />
                Builder
                <br />
                Problem Solver
              </p>
            </motion.div>
          </section>
          <Projects />
          <section id="about" className="section container about-section">
            <div>
              <p className="eyebrow">01 / About</p>
              <h2>
                Secure by design.
                <br />
                <span className="accent">Built for impact.</span>
              </h2>
            </div>
            <div className="about-copy">
              <p>
                I'm Raymond, a Cybersecurity Engineering student at George Mason
                University. I bring a security mindset to backend engineering,
                cloud architecture, and data-driven applications.
              </p>
              <p>
                From integrating behavioral bot detection on AWS to building
                decision-support workflows in Palantir Foundry, I enjoy turning
                complex problems into useful systems. Away from the keyboard,
                you'll find me playing pickleball or watching anime.
              </p>
              <div className="education">
                <h3>George Mason University</h3>
                <p>
                  B.S. in Cybersecurity Engineering · Expected December 2026
                </p>
                <h3>Georgia Institute of Technology</h3>
                <p>
                  Upcoming M.S. in Computer Science (Online) · January 2027–May
                  2028
                </p>
              </div>
            </div>
          </section>
          <Skills />
          <section id="experience" className="section container">
            <p className="eyebrow">03 / Experience</p>
            <h2>
              Building with <span className="accent">purpose.</span>
            </h2>
            <div className="experience-list">
              <article className="experience-row">
                <div>
                  <p className="experience-date">
                    June–September 2025 · Remote
                  </p>
                  <h3>Volunteer Full-Stack Developer</h3>
                  <p className="organization">MAIS Solutions LLC</p>
                </div>
                <div>
                  <p>
                    Developed authentication and application workflows with
                    Python, Flask, HTML, CSS, JavaScript, and database-backed
                    services.
                  </p>
                  <p>
                    Migrated authentication and dynamic data to Firebase BaaS
                    and validated registration, login, verification, and
                    authenticated-access workflows.
                  </p>
                </div>
              </article>
              <article className="experience-row">
                <div>
                  <p className="experience-date">
                    October 2, 2026 · Builder Event
                  </p>
                  <h3>Navy PPBS Decision Intelligence</h3>
                  <p className="organization">Accenture Federal Services</p>
                </div>
                <div>
                  <p>
                    Led product direction and the final presentation for a
                    four-person team building a Navy decision-support
                    application. Selected as one of 40 participants from
                    approximately 200 applicants.
                  </p>
                  <p>
                    Built Foundry pipelines, Ontology objects, and a Workshop +
                    AIP Logic workflow for financial visualizations and
                    evidence-grounded decision briefs.
                  </p>
                </div>
              </article>
            </div>
          </section>
          <section id="certifications" className="section container">
            <p className="eyebrow">04 / Certifications</p>
            <h2>
              A foundation to <span className="accent">build on.</span>
            </h2>
            <div className="certification-grid">
              {certifications.map(([title, date]) => (
                <article className="certification-card" key={title}>
                  <Shield size={27} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{date}</p>
                </article>
              ))}
            </div>
          </section>
          <section id="contact" className="section container">
            <div className="contact-card">
              <p className="eyebrow">05 / Let's connect</p>
              <h2>
                Have something
                <br />
                <span className="accent">in mind?</span>
              </h2>
              <p>
                Let's talk about cloud, software engineering, and secure
                systems.
              </p>
              <a
                className="contact-email"
                href="mailto:raymondweihaoquan@gmail.com"
              >
                raymondweihaoquan@gmail.com{" "}
                <ArrowUpRight size={22} aria-hidden="true" />
              </a>
              <div className="hero-buttons">
                <ResumeLink />
                <a
                  href="https://www.linkedin.com/in/raymondwquan"
                  className="secondary-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect on LinkedIn{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="container footer">
          <a className="brand" href="#home">
            <span className="monogram">RQ</span>Raymond Quan
          </a>
          <p>Cloud. Code. Security.</p>
          <a href="#home">
            Back to top <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}
