import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUpLeft,
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
import ArchitectureExplorer from "./components/ArchitectureExplorer";
import {
  HeroSignature,
  ScrollProgress,
  useHeroMotion,
  surfaceEvents,
  Reveal,
} from "./components/InteractiveMotion";
import ExperienceTimeline from "./components/ExperienceTimeline";

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
  const [activeSection, setActiveSection] = useState("home");
  const trackActive = useCallback((id) => setActiveSection(id), []);
  const hero = useHeroMotion();
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
        <ScrollProgress onActive={trackActive} />
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
                  aria-current={
                    activeSection === link.toLowerCase()
                      ? "location"
                      : undefined
                  }
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
            ref={hero.ref}
            {...hero.events}
            id="home"
            className="hero container"
            aria-labelledby="hero-title"
          >
            <HeroSignature
              heroRef={hero.ref}
              x={hero.x}
              reduced={hero.reduced}
            />
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <p className="eyebrow">
                Raymond Quan{" "}
                <span className="career-direction">· Career direction</span>
              </p>
              <h1 id="hero-title">
                <motion.span
                  className="headline-line"
                  initial={hero.reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Cloud &amp;
                </motion.span>
                <br />
                <motion.span
                  className="accent headline-line"
                  initial={hero.reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hero.reduced ? 0 : 0.12 }}
                >
                  Solutions
                </motion.span>
                <br />
                <motion.span
                  className="headline-line"
                  initial={hero.reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: hero.reduced ? 0 : 0.24 }}
                >
                  Architect<span className="accent">.</span>
                </motion.span>
              </h1>
              <p className="hero-subtitle">
                Building secure, scalable cloud applications with{" "}
                <strong>AWS</strong> and <strong>Spring Boot</strong>, grounded
                in Java fundamentals and a drive to keep learning.
              </p>
              <div className="hero-buttons">
                <a
                  href="#projects"
                  className="primary-btn magnetic-cta"
                  {...surfaceEvents}
                >
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
              className={`hero-visual ${hero.visible && !hero.reduced ? "hero-alive" : ""}`}
              style={hero.reduced ? {} : { x: hero.x, y: hero.y }}
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
                src="/raymond-avatar.png?v=20261011"
                width="1536"
                height="1024"
                alt="3D portrait of Raymond with black glasses, a black jacket, and an unbranded laptop"
                fetchPriority="high"
              />
              <p className="hero-note">
                <span aria-hidden="true">
                  <ArrowUpLeft size={28} />
                </span>
                Student
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
                cloud architecture, and data-driven applications. I’m eager to
                deepen my AWS and Spring Boot skills, learn from experienced
                engineers, and apply feedback to real projects.
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
          <ArchitectureExplorer />
          <section id="experience" className="section container">
            <p className="eyebrow">03 / Experience</p>
            <h2>
              Building with <span className="accent">purpose.</span>
            </h2>
            <ExperienceTimeline />
          </section>
          <section id="certifications" className="section container">
            <p className="eyebrow">04 / Certifications</p>
            <Reveal kind="focus">
              <h2>
                A foundation to <span className="accent">build on.</span>
              </h2>
            </Reveal>
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
            <div className="contact-card premium-surface" {...surfaceEvents}>
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
