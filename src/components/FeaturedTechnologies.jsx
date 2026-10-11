import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  Layers,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
} from "lucide-react";
import { surfaceEvents, useMotionPreference } from "./InteractiveMotion";

const featured = [
  {
    id: "aws",
    name: "AWS",
    logo: "aws",
    caption: "Infrastructure with intent",
    summary: "Compute, networking, permissions, and a private data tier.",
    icon: Cloud,
  },
  {
    id: "java",
    name: "Java",
    logo: "java",
    caption: "Logic with structure",
    summary:
      "Interfaces, encapsulation, collections, and dependable application logic.",
    icon: Code2,
  },
  {
    id: "spring",
    name: "Spring Boot",
    logo: "spring",
    caption: "From request to response",
    summary: "Controllers, services, repositories, and SQL-backed REST APIs.",
    icon: Layers,
  },
];
const awsServices = [
  [
    "EC2",
    "Compute",
    "Linux application host; Nginx serves the frontend and proxies to the backend.",
    Server,
  ],
  [
    "VPC",
    "Networking",
    "Subnet routing and security boundaries isolate the application and data tiers.",
    Cloud,
  ],
  [
    "IAM",
    "Permissions",
    "Scoped AWS resource permissions. Identity policies are separate from packet routing.",
    ShieldCheck,
  ],
  [
    "RDS",
    "Managed SQL",
    "MySQL relational persistence, with application access restricted by security groups.",
    Database,
  ],
  [
    "S3",
    "Object storage",
    "Object storage uses bucket policies and scoped access controls to protect stored objects.",
    Cloud,
  ],
  [
    "CloudWatch",
    "Observability",
    "AWS metrics and log collection make resource behavior observable and support troubleshooting.",
    Layers,
  ],
];
// Complete, runnable Java 17 example. The demo below reproduces these branches locally.
export const JAVA_EXAMPLE = `import java.util.List;

public class QuizValidator {
    interface AnswerPolicy {
        boolean check(String answer);
    }
    static final class ExactAnswer implements AnswerPolicy {
        private final List<String> options;
        private final String correct;
        ExactAnswer(List<String> options, String correct) {
            this.options = List.copyOf(options);
            this.correct = correct;
        }
        public boolean check(String answer) {
            if (!options.contains(answer)) {
                throw new IllegalArgumentException("Unknown option");
            }
            return correct.equals(answer);
        }
    }
    public static void main(String[] args) {
        AnswerPolicy policy = new ExactAnswer(
            List.of("Amazon S3", "AWS IAM"), "AWS IAM");
        try {
            System.out.println(policy.check("AWS IAM"));
        } catch (IllegalArgumentException error) {
            System.out.println(error.getMessage());
        }
    }
}`;
const javaTopics = [
  {
    name: "Classes & interfaces",
    lines: [3, 4, 5, 6, 7],
    note: "AnswerPolicy defines a contract; ExactAnswer implements it. Calling through the interface keeps backend logic decoupled from a particular implementation.",
  },
  {
    name: "Encapsulation",
    lines: [8, 9, 10, 11, 12, 13],
    note: "Private final fields hold the options and correct answer. Constructor initialization keeps the validation object's state explicit.",
  },
  {
    name: "Collections",
    lines: [1, 8, 11, 15, 23],
    note: "List.copyOf creates an unmodifiable list. The collection checks whether an answer belongs to the available choices.",
  },
  {
    name: "Exceptions",
    lines: [15, 16, 24, 26, 27],
    note: "An unknown option raises IllegalArgumentException. The caller catches it and exposes a useful explanation instead of silently accepting invalid input.",
  },
  {
    name: "Method invocation",
    lines: [14, 18, 22, 23, 25],
    note: "policy.check invokes the implementation through its interface. A known option returns whether it matches the correct answer.",
  },
];
const layers = [
  {
    name: "Client",
    annotation: "HTTP / JSON",
    note: "The browser sends a same-origin request. This demonstration runs locally in your browser; it never contacts a backend.",
    code: "GET /api/questions/cloud",
  },
  {
    name: "Controller",
    annotation: "@RestController",
    note: "AppController maps the real topic-based route and delegates work through its injected QuizService.",
    code: '@GetMapping("/api/questions/{topic}")',
  },
  {
    name: "Service",
    annotation: "@Service",
    note: "QuizService coordinates repository access and maps database entities into question DTOs. Answer validation is handled on the server.",
    code: "appService.getQuestionByTopic(topic)",
  },
  {
    name: "Repository",
    annotation: "JpaRepository",
    note: "Spring Data JPA repositories retrieve topic-based records. Hibernate maps relational data to Java entities.",
    code: "Spring Data JPA / Hibernate",
  },
  {
    name: "Database",
    annotation: "MySQL",
    note: "SQL persistence stores lessons and quiz questions. The resume's cloud-hosted Java project uses MySQL on RDS with restricted application connectivity.",
    code: "Private relational persistence",
  },
];
const journeys = [
  { step: 0, direction: "request", label: "Client creates an HTTP request" },
  { step: 1, direction: "request", label: "Controller matches the route" },
  {
    step: 2,
    direction: "request",
    label: "Service coordinates application logic",
  },
  { step: 3, direction: "request", label: "Repository requests the records" },
  {
    step: 4,
    direction: "request",
    label: "MySQL retrieves topic-based questions",
  },
  {
    step: 3,
    direction: "response",
    label: "Repository maps the persisted records",
  },
  { step: 2, direction: "response", label: "Service maps the question DTOs" },
  { step: 1, direction: "response", label: "Controller returns HTTP 200" },
  { step: 0, direction: "response", label: "Client receives JSON" },
];
const responses = {
  questions: [
    {
      id: 1,
      questionText: "Which AWS service manages resource permissions?",
      options: ["Amazon S3", "AWS IAM", "Amazon EC2"],
    },
  ],
  answer: {
    correct: true,
    correctAnswer: "AWS IAM",
    explanation: "IAM controls AWS resource permissions.",
  },
};

function AwsExperience() {
  const [chosen, setChosen] = useState(0);
  const item = awsServices[chosen];
  const reduced = useMotionPreference();
  return (
    <div className="aws-feature-experience">
      <div
        className="service-constellation"
        role="group"
        aria-label="Featured AWS services"
      >
        <div className="constellation-hub" aria-hidden="true">
          <Cloud size={35} />
          <span>AWS toolkit</span>
        </div>
        <svg
          viewBox="0 0 600 250"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="constellation-lines"
        >
          {[87, 300, 513, 87, 300, 513].map((x, i) => (
            <motion.path
              key={i}
              d={`M300 125 Q${x} 125 ${x} ${i < 3 ? 35 : 215}`}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: reduced ? 0 : 0.8,
                delay: reduced ? 0 : i * 0.06,
              }}
              className={chosen === i ? "active" : ""}
            />
          ))}
        </svg>
        {awsServices.map(([name, caption, , Icon], i) => (
          <button
            key={name}
            className={`service-satellite service-${i}`}
            aria-pressed={chosen === i}
            onClick={() => setChosen(i)}
          >
            <Icon size={20} aria-hidden="true" />
            <strong>{name}</strong>
            <span>{caption}</span>
          </button>
        ))}
      </div>
      <div className="technology-note" aria-live="polite">
        <p className="eyebrow">AWS / {item[0]}</p>
        <h3>{item[1]}.</h3>
        <p>{item[2]}</p>
        <a href="#architecture" className="primary-btn">
          Explore Architecture <ArrowDown size={16} aria-hidden="true" />
        </a>
        <p className="mini-disclaimer">
          The existing explorer is an illustrative reference; IAM is a
          permissions layer, not a network hop.
        </p>
      </div>
    </div>
  );
}
function JavaExperience() {
  const [topic, setTopic] = useState(0);
  const [result, setResult] = useState(null);
  const codeRef = useRef(null);
  const reduced = useMotionPreference();
  function choose(index) {
    setTopic(index);
    const line = codeRef.current?.querySelector(
      `[data-line="${javaTopics[index].lines[0]}"]`,
    );
    // Scroll the editor itself rather than moving the page or keyboard focus.
    if (line)
      codeRef.current.scrollTo({
        top: line.offsetTop - codeRef.current.offsetTop - 35,
        behavior: reduced ? "auto" : "smooth",
      });
  }
  function invoke(answer) {
    const options = Object.freeze(["Amazon S3", "AWS IAM"]);
    try {
      if (!options.includes(answer)) throw new Error("Unknown option");
      choose(4);
      setResult(String(answer === "AWS IAM"));
    } catch (error) {
      choose(3);
      setResult(error.message);
    }
  }
  return (
    <div className="java-experience">
      <div className="code-editor">
        <div className="editor-chrome">
          <span className="editor-lights" aria-hidden="true">
            ● ● ●
          </span>
          <span>QuizValidator.java</span>
          <span>Java 17</span>
        </div>
        <pre
          ref={codeRef}
          tabIndex={0}
          aria-label="Complete Java validation example"
        >
          <code>
            {JAVA_EXAMPLE.split("\n").map((line, i) => (
              <span
                key={i}
                data-line={i + 1}
                className={`code-line ${javaTopics[topic].lines.includes(i + 1) ? "line-highlight" : ""}`}
              >
                <span className="line-number" aria-hidden="true">
                  {i + 1}
                </span>
                {line || " "}
              </span>
            ))}
          </code>
        </pre>
      </div>
      <div className="technology-note">
        <p className="eyebrow">Java / backend logic</p>
        <div
          className="concept-options"
          role="group"
          aria-label="Java concepts"
        >
          {javaTopics.map((item, i) => (
            <button
              key={item.name}
              aria-pressed={topic === i}
              onClick={() => choose(i)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <p aria-live="polite">{javaTopics[topic].note}</p>
        <div className="demo-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => invoke("AWS IAM")}
          >
            <Play size={14} aria-hidden="true" />
            Run valid answer
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => invoke("Unknown service")}
          >
            Try unknown option
          </button>
        </div>
        <motion.output
          className="java-output"
          aria-live="polite"
          key={result}
          initial={reduced ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          {result === null
            ? "Select a concept or invoke check()."
            : `Console → ${result}`}
        </motion.output>
        <p className="mini-disclaimer">
          Educational simulation of this Java validation example.
        </p>
        <a className="text-link" href="#project-quiz">
          Related backend project <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
function SpringExperience() {
  const root = useRef(null);
  const visible = useInView(root, { amount: 0.01 });
  const reduced = useMotionPreference();
  const [request, setRequest] = useState("questions");
  const [phase, setPhase] = useState(-1);
  const [running, setRunning] = useState(false);
  const [inspected, setInspected] = useState(1);
  const [complete, setComplete] = useState(false);
  const original = journeys[Math.max(0, phase)];
  const postLabels = {
    4: "MySQL retrieves the submitted question by ID",
    5: "Repository returns the stored answer",
    6: "Service validates the submitted answer",
  };
  const current = {
    ...original,
    label:
      request === "answer"
        ? postLabels[phase] || original.label
        : original.label,
  };
  useEffect(() => {
    if (!running || !visible || reduced) return;
    const timer = window.setTimeout(() => {
      if (phase >= journeys.length - 1) {
        setRunning(false);
        setComplete(true);
      } else setPhase((value) => value + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [running, visible, reduced, phase]);
  useEffect(() => {
    if (reduced && running) {
      setPhase(journeys.length - 1);
      setRunning(false);
      setComplete(true);
    }
  }, [reduced, running]);
  function send() {
    setComplete(false);
    setPhase(reduced ? journeys.length - 1 : 0);
    setRunning(!reduced);
    if (reduced) setComplete(true);
  }
  function reset() {
    setRunning(false);
    setPhase(-1);
    setComplete(false);
  }
  return (
    <div
      ref={root}
      className={`spring-experience ${running && visible && !reduced ? "simulation-running" : ""}`}
    >
      <div className="simulation-heading">
        <div>
          <p className="eyebrow">Spring Boot / request lifecycle</p>
          <h3>One request. Clear responsibilities.</h3>
        </div>
        <span className="simulation-label">
          Educational simulation · No live API
        </span>
      </div>
      <div className="request-controls">
        <label htmlFor="demo-route">Request</label>
        <select
          id="demo-route"
          value={request}
          onChange={(e) => {
            setRequest(e.target.value);
            reset();
          }}
          disabled={running}
        >
          <option value="questions">GET /api/questions/cloud</option>
          <option value="answer">POST /api/answer</option>
        </select>
        <button
          type="button"
          className="primary-btn"
          onClick={send}
          disabled={running}
        >
          <Play size={15} aria-hidden="true" />
          {running ? "Request in progress…" : "Send API Request"}
        </button>
        <button
          type="button"
          className="icon-button demo-reset"
          aria-label="Reset API simulation"
          onClick={reset}
        >
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </div>
      {request === "answer" && (
        <pre className="request-body" aria-label="Simulated request body">
          <code>{'{ "id": 1, "selectedAnswer": "AWS IAM" }'}</code>
        </pre>
      )}
      <div
        className={`spring-pipeline ${phase >= 0 ? `pipeline-${current.direction}` : ""}`}
        role="group"
        aria-label="Spring Boot application layers"
      >
        {layers.map((layer, i) => (
          <div className="pipeline-segment" key={layer.name}>
            <button
              type="button"
              className={`pipeline-node ${phase >= 0 && current.step === i ? "packet-active" : ""}`}
              aria-pressed={inspected === i}
              onClick={() => setInspected(i)}
            >
              <span className="layer-index">0{i + 1}</span>
              <strong>{layer.name}</strong>
              <code>{layer.annotation}</code>
            </button>
            {i < layers.length - 1 && (
              <span
                className={`pipeline-connection ${phase >= 0 && (current.direction === "request" ? current.step === i + 1 : current.step === i) ? "connection-active" : ""}`}
                aria-hidden="true"
              >
                <ArrowRight size={20} />
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="simulation-status" role="status">
        {phase < 0
          ? "Ready to send a simulated request."
          : complete
            ? "200 OK · Response received"
            : `${current.direction === "request" ? "Request →" : "← Response"} ${current.label}`}
      </div>
      <div className="simulation-bottom">
        <div className="layer-notes" aria-live="polite">
          <strong>{layers[inspected].name}</strong>
          <p>
            {request === "answer" && inspected === 2
              ? "QuizService loads the question by ID, compares the submitted answer with the stored answer, and returns an answer response DTO."
              : layers[inspected].note}
          </p>
          <code>
            {request === "answer"
              ? [
                  "POST /api/answer",
                  '@PostMapping("/api/answer")',
                  "appService.checkAnswer(id, selectedAnswer)",
                  "quizquestionrepo.findById(questionId)",
                  "Look up the question by primary key",
                ][inspected]
              : layers[inspected].code}
          </code>
          <a
            href="https://github.com/RayQCodes/quizapp/tree/backend"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Inspect the actual backend{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="response-console">
          <div>
            <span>Response / application/json</span>
            <span className={`http-status ${complete ? "is-success" : ""}`}>
              {complete ? "200 OK" : "Awaiting response"}
            </span>
          </div>
          <pre aria-label="Simulated JSON response">
            <code>
              {complete
                ? JSON.stringify(responses[request], null, 2)
                : "// Send a request to receive example data."}
            </code>
          </pre>
          <p>
            Example records; the routes and DTO field names follow the
            repository.
          </p>
        </div>
      </div>
    </div>
  );
}
export default function FeaturedTechnologies() {
  const [active, setActive] = useState("spring");
  const reduced = useMotionPreference();
  return (
    <div className="featured-technologies">
      <div
        className="featured-tech-grid"
        role="group"
        aria-label="Featured technologies"
      >
        {featured.map((item, i) => (
          <motion.article
            className={`featured-tech premium-surface ${active === item.id ? "tech-active" : ""}`}
            key={item.id}
            {...surfaceEvents}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduced ? 0 : i * 0.08 }}
          >
            <div className="tech-heading">
              <img
                src={`/technology-logos/${item.logo}.svg`}
                width={46}
                height={46}
                alt={`${item.name} logo`}
                loading="lazy"
              />
              <span>0{i + 1} / Core technology</span>
            </div>
            <h3>{item.name}</h3>
            <p className="tech-caption">{item.caption}</p>
            <div
              className={`tech-illustration tech-art-${item.id}`}
              aria-hidden="true"
            >
              <item.icon size={40} />
              {item.id === "aws" ? (
                <>
                  <Server size={24} />
                  <Database size={24} />
                  <ShieldCheck size={24} />
                </>
              ) : item.id === "java" ? (
                <>
                  <code>implements</code>
                  <code>List&lt;String&gt;</code>
                  <code>check()</code>
                </>
              ) : (
                <>
                  <span>Controller</span>
                  <ArrowRight size={16} />
                  <span>Service</span>
                  <ArrowRight size={16} />
                  <span>Data</span>
                </>
              )}
            </div>
            <p>{item.summary}</p>
            <button
              type="button"
              className="tech-explore"
              aria-expanded={active === item.id}
              aria-controls="featured-tech-panel"
              onClick={() => setActive(item.id)}
            >
              Explore {item.name}
              <ArrowUpRight size={17} aria-hidden="true" />
            </button>
          </motion.article>
        ))}
      </div>
      <div id="featured-tech-panel" className="featured-tech-panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          >
            {active === "aws" ? (
              <AwsExperience />
            ) : active === "java" ? (
              <JavaExperience />
            ) : (
              <SpringExperience />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
