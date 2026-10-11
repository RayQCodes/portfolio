import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Cloud,
  Code2,
  Database,
  Globe,
  LockKeyhole,
  Minus,
  Move,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Server,
  ShieldCheck,
} from "lucide-react";
import "./ArchitectureExplorer.css";
import { useMotionPreference } from "./InteractiveMotion";

const SERVICES = {
  ec2: {
    name: "EC2 Instance",
    eyebrow: "Compute / application host",
    icon: Server,
    description:
      "Compute instance hosting the frontend and backend application.",
    details:
      "One Linux EC2 instance hosts Nginx and the application process. Nginx serves the frontend and reverse-proxies /api requests to a backend bound to the instance's loopback interface.",
    tags: ["AWS EC2", "Linux", "Nginx"],
    fact: "Only HTTPS reaches the instance from the internet. Backend process ports stay internal.",
  },
  frontend: {
    name: "Frontend",
    eyebrow: "Inside the EC2 instance",
    icon: Globe,
    description: "The web application served from EC2.",
    details:
      "Nginx serves HTML, CSS, and JavaScript over HTTPS. The JavaScript runs in the visitor's browser; API calls return through the same origin and are proxied to the backend on EC2.",
    tags: ["Nginx", "HTML / CSS / JavaScript", "HTTPS"],
    fact: "The diagram's frontend-to-backend path represents the Nginx API proxy, not a separate compute service.",
  },
  backend: {
    name: "Backend / API",
    eyebrow: "Inside the EC2 instance",
    icon: Code2,
    description: "The application/API running on the same EC2 instance.",
    details:
      "A Java / Spring Boot or Python / Flask process handles application logic and validation. Nginx proxies requests locally, and the backend queries the managed database through its private endpoint.",
    tags: ["Java", "Spring Boot or Flask", "SQL"],
    fact: "These are implementation alternatives. Database access uses database credentials or separately configured IAM database authentication.",
  },
  vpc: {
    name: "AWS VPC",
    eyebrow: "Network / isolation",
    icon: Cloud,
    description:
      "Isolated AWS network with subnet routing and security boundaries.",
    details:
      "The application sits in a public subnet with an internet-gateway route. The database sits in a private subnet without a direct internet route. VPC-local routing connects the backend to the private database endpoint.",
    tags: ["VPC", "Public + private subnets", "Routing"],
    fact: "A VPC is a network boundary, not an extra application hop. Production database subnet groups span multiple Availability Zones.",
  },
  database: {
    name: "Amazon Aurora / RDS",
    eyebrow: "Managed SQL / private subnet",
    icon: Database,
    description:
      "Managed relational SQL database with private application connectivity.",
    details:
      "An RDS MySQL database, or an Aurora MySQL-compatible alternative, provides managed relational storage. The backend connects privately on TCP 3306. Publicly accessible is disabled; browsers never connect directly to SQL.",
    tags: ["MySQL", "RDS / Aurora alternative", "Private endpoint"],
    fact: "One private subnet is drawn for clarity. An actual DB subnet group covers at least two Availability Zones.",
  },
  iam: {
    name: "IAM",
    eyebrow: "Permissions / least privilege",
    icon: ShieldCheck,
    description: "Least-privilege permissions controlling AWS resource access.",
    details:
      "An instance role grants only the AWS API permissions the application needs, such as scoped access to CloudWatch or S3. IAM is an identity and permissions layer; it does not route packets or replace security groups.",
    tags: ["IAM instance role", "Least privilege", "AWS resource access"],
    fact: "The dashed shield represents permissions, not a network traffic hop or SQL firewall.",
  },
  security: {
    name: "Security Groups",
    eyebrow: "Network / stateful rules",
    icon: LockKeyhole,
    description:
      "Stateful network rules restricting inbound and outbound traffic.",
    details:
      "The application group permits inbound HTTPS on TCP 443. The database group permits TCP 3306 only from the application security group, with matching application egress. Response traffic is allowed automatically by connection state.",
    tags: ["HTTPS 443", "MySQL 3306", "App SG → DB SG"],
    fact: "No public database ingress and no public backend process port. IAM permissions and network rules solve different problems.",
  },
  browser: {
    name: "User / Browser",
    eyebrow: "Outside the AWS VPC",
    icon: Globe,
    description: "The visitor connects to the application using HTTPS.",
    details:
      "A browser retrieves the frontend from Nginx on EC2, then sends same-origin API requests. Application responses return over HTTPS; the browser never has a network connection to the private database.",
    tags: ["Browser", "HTTPS", "Same-origin API"],
    fact: "This is a reference architecture inspired by experience, not the hosting architecture of this static GitHub Pages portfolio.",
  },
};
const MODES = [
  {
    id: "overview",
    label: "Overview",
    icon: Cloud,
    description:
      "One application host. A private data tier. Clear security boundaries.",
  },
  {
    id: "flow",
    label: "Request Flow",
    icon: ArrowUpRight,
    description:
      "Follow one request into the application and its response back to the browser.",
  },
  {
    id: "security",
    label: "Security View",
    icon: ShieldCheck,
    description:
      "Separate network reachability from identity permissions. Keep the database private.",
  },
];
const FLOW = [
  {
    route: "https",
    direction: "forward",
    label: "HTTPS request",
    detail: "Browser → Nginx frontend · TCP 443",
    services: ["browser", "frontend", "ec2"],
  },
  {
    route: "local",
    direction: "forward",
    label: "API request",
    detail: "Nginx → backend · local /api proxy",
    services: ["frontend", "backend", "ec2"],
  },
  {
    route: "sql",
    direction: "forward",
    label: "SQL query",
    detail: "Backend → private database · TCP 3306",
    services: ["backend", "database"],
  },
  {
    route: "sql",
    direction: "reverse",
    label: "Query result",
    detail: "Database → backend · stateful return",
    services: ["database", "backend"],
  },
  {
    route: "local",
    direction: "reverse",
    label: "API response",
    detail: "Backend → Nginx · local response",
    services: ["backend", "frontend", "ec2"],
  },
  {
    route: "https",
    direction: "reverse",
    label: "HTTPS response",
    detail: "Nginx → browser · same TLS connection",
    services: ["frontend", "browser", "ec2"],
  },
];
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

const beginPacket = (element) => element?.beginElement?.();

function useCompactDiagram() {
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}

function geometry(compact) {
  return compact
    ? {
        width: 520,
        height: 900,
        vpc: { x: 25, y: 174, w: 470, h: 590 },
        publicSubnet: { x: 46, y: 236, w: 428, h: 276 },
        privateSubnet: { x: 78, y: 535, w: 364, h: 197 },
        browser: { x: 140, y: 35, w: 240, h: 103 },
        ec2: { x: 65, y: 298, w: 390, h: 161 },
        frontend: { x: 83, y: 363, w: 160, h: 76 },
        backend: { x: 277, y: 363, w: 160, h: 76 },
        database: { x: 260, y: 600 },
        appSG: { x: 92, y: 475, w: 336 },
        dbSG: { x: 104, y: 691, w: 312 },
        iam: { x: 120, y: 802, w: 280, h: 65 },
        routes: {
          https:
            "M260 138 V146 Q260 157 241 157 H53 Q35 157 35 178 V381 Q35 401 83 401",
          local: "M243 401 H277",
          sql: "M357 439 V516 Q357 535 319 535 H292 Q260 535 260 555 V584",
        },
        labels: { https: [270, 160], local: [250, 351], sql: [361, 512] },
      }
    : {
        width: 1040,
        height: 650,
        vpc: { x: 225, y: 82, w: 780, h: 432 },
        publicSubnet: { x: 250, y: 165, w: 426, h: 312 },
        privateSubnet: { x: 717, y: 165, w: 263, h: 312 },
        browser: { x: 35, y: 228, w: 145, h: 123 },
        ec2: { x: 273, y: 232, w: 379, h: 183 },
        frontend: { x: 294, y: 314, w: 153, h: 76 },
        backend: { x: 478, y: 314, w: 153, h: 76 },
        database: { x: 849, y: 301 },
        appSG: { x: 278, y: 432, w: 366 },
        dbSG: { x: 732, y: 429, w: 233 },
        iam: { x: 515, y: 553, w: 280, h: 65 },
        routes: {
          https: "M180 289 H211 Q237 289 255 323 Q273 352 294 352",
          local: "M447 352 H478",
          sql: "M631 352 H694 Q716 352 733 342 H784",
        },
        labels: { https: [78, 383], local: [452, 303], sql: [663, 328] },
      };
}

export default function ArchitectureExplorer() {
  const compact = useCompactDiagram();
  const g = geometry(compact);
  const uid = useId().replace(/:/g, "");
  const stageRef = useRef(null);
  const detailRef = useRef(null);
  const dragRef = useRef(null);
  const isVisible = useInView(stageRef, { amount: 0.12 });
  const revealed = useInView(stageRef, { amount: 0.12, once: true });
  const reduced = useMotionPreference();
  const [mode, setMode] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [trafficReady, setTrafficReady] = useState(false);
  const running =
    trafficReady && isVisible && !paused && !reduced && mode !== "security";
  const flow = FLOW[phase];
  const activeMode = MODES.find((item) => item.id === mode);
  const service = selected ? SERVICES[selected] : null;
  const Icon = service?.icon || Cloud;
  const id = (name) => `${uid}-${name}`;

  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(
      () => setTrafficReady(true),
      reduced ? 0 : 2300,
    );
    return () => window.clearTimeout(timer);
  }, [revealed, reduced]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setPhase((value) => (value + 1) % FLOW.length),
      1800,
    );
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    setCamera({ x: 0, y: 0, zoom: 1 });
    setTooltip(null);
  }, [compact]);

  useEffect(() => {
    if (!compact || !selected) return;
    const timer = window.setTimeout(
      () => {
        detailRef.current?.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "nearest",
        });
        detailRef.current?.querySelector("h3")?.focus({ preventScroll: true });
      },
      reduced ? 60 : 650,
    );
    return () => window.clearTimeout(timer);
  }, [compact, selected, reduced]);

  function resetView() {
    setCamera({ x: 0, y: 0, zoom: 1 });
    setSelected(null);
    setTooltip(null);
  }
  function chooseMode(next) {
    setMode(next);
    setSelected(null);
    setTooltip(null);
    setPhase(0);
    setCamera({
      x: 0,
      y: next === "security" ? -8 : 0,
      zoom: next === "overview" ? 1 : 1.025,
    });
  }
  function selectService(key) {
    setSelected(key);
    setTooltip(null);
    const p = key === "security" ? g.vpc : g[key];
    const cx = p.x + (p.w || 0) / 2;
    const cy = p.y + (p.h || 0) / 2;
    const boundary = ["vpc", "security", "iam"].includes(key);
    setCamera({
      x: boundary ? 0 : clamp((g.width / 2 - cx) * 0.18, -60, 60),
      y: boundary ? 0 : clamp((g.height / 2 - cy) * 0.15, -45, 45),
      zoom: boundary ? 1.015 : compact ? 1.055 : 1.1,
    });
  }
  function zoomBy(amount) {
    setCamera((value) => ({
      ...value,
      zoom: clamp(Number((value.zoom + amount).toFixed(2)), 1, 1.45),
    }));
    setTooltip(null);
  }
  function panBy(x, y) {
    setCamera((value) => ({
      ...value,
      x: clamp(value.x + x, -85, 85),
      y: clamp(value.y + y, -65, 65),
    }));
    setTooltip(null);
  }
  function canvasKey(event) {
    if (event.target !== event.currentTarget) return;
    const pans = {
      ArrowLeft: [-20, 0],
      ArrowRight: [20, 0],
      ArrowUp: [0, -20],
      ArrowDown: [0, 20],
    };
    if (pans[event.key]) {
      event.preventDefault();
      panBy(...pans[event.key]);
    }
    if (["+", "=", "-", "0", "Escape"].includes(event.key)) {
      event.preventDefault();
      if (["0", "Escape"].includes(event.key)) resetView();
      else zoomBy(event.key === "-" ? -0.1 : 0.1);
    }
  }
  function showTooltip(key, event) {
    const box = event.currentTarget.getBoundingClientRect();
    const stage = stageRef.current.getBoundingClientRect();
    setTooltip({
      key,
      x: clamp(
        box.x + box.width / 2 - stage.x,
        120,
        Math.max(120, stage.width - 120),
      ),
      y: clamp(box.top - stage.top - 10, 64, stage.height - 110),
    });
  }
  function nodeProps(key) {
    return {
      role: "button",
      tabIndex: 0,
      "aria-label": `Explore ${SERVICES[key].name}`,
      "aria-pressed": selected === key,
      "aria-controls": id("component-details"),
      "aria-describedby": tooltip?.key === key ? id("tooltip") : undefined,
      className: `aws-node ${selected === key ? "is-selected" : ""} ${mode === "flow" && flow.services.includes(key) ? "is-flow-active" : ""}`,
      onClick: () => selectService(key),
      onKeyDown: (event) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          event.stopPropagation();
          selectService(key);
        }
      },
      onMouseEnter: (event) => showTooltip(key, event),
      onFocus: (event) => showTooltip(key, event),
      onMouseLeave: () => setTooltip(null),
      onBlur: () => setTooltip(null),
      onPointerMove: (event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--aws-tilt",
          `${clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5) * 3}deg`,
        );
      },
    };
  }
  function materialize(delay) {
    return {
      initial: reduced ? false : { opacity: 0, y: 16 },
      animate: {
        opacity: revealed || reduced ? 1 : 0,
        y: revealed || reduced ? 0 : 16,
      },
      transition: { duration: reduced ? 0 : 0.65, delay: reduced ? 0 : delay },
    };
  }
  function highlighted(route) {
    return mode === "flow"
      ? flow.route === route
      : selected &&
          (route === "https"
            ? ["browser", "vpc", "ec2", "frontend", "security"].includes(
                selected,
              )
            : route === "local"
              ? ["ec2", "frontend", "backend"].includes(selected)
              : ["backend", "database", "ec2", "security", "vpc"].includes(
                  selected,
                ));
  }

  return (
    <section
      id="architecture"
      className="section container aws-explorer"
      aria-labelledby={id("heading")}
    >
      <div className="aws-section-heading">
        <div>
          <p className="eyebrow">Inside the infrastructure</p>
          <h2 id={id("heading")}>
            Built to connect.
            <br />
            <span className="accent">Designed to protect.</span>
          </h2>
        </div>
        <p>
          An interactive AWS reference architecture inspired by my experience.
          Explore the compute, follow a request, and inspect the boundaries.
        </p>
      </div>
      <div
        className={`aws-console aws-mode-${mode} ${running ? "aws-running" : ""}`}
      >
        <div className="aws-console-header">
          <div className="aws-console-title">
            <span className="aws-status-dot" />
            <span>AWS architecture explorer</span>
            <span className="aws-concept">Illustrative</span>
          </div>
          <div
            className="aws-modes"
            role="group"
            aria-label="Architecture modes"
          >
            {MODES.map(({ id: key, label, icon: ModeIcon }) => (
              <button
                key={key}
                type="button"
                aria-pressed={mode === key}
                onClick={() => chooseMode(key)}
              >
                <ModeIcon size={15} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="aws-workspace">
          <div className="aws-diagram-column">
            <div
              ref={stageRef}
              className={`aws-stage ${dragging ? "is-dragging" : ""}`}
            >
              <div className="aws-ambient" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                className="aws-canvas"
                viewBox={`0 0 ${g.width} ${g.height}`}
                role="group"
                tabIndex={0}
                aria-label="Interactive AWS infrastructure. Arrow keys pan; plus and minus zoom; zero resets. Select a component for details."
                onKeyDown={canvasKey}
                onPointerDown={(event) => {
                  if (
                    event.pointerType !== "mouse" ||
                    event.button !== 0 ||
                    event.target.closest('[role="button"]')
                  )
                    return;
                  dragRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                    camera,
                    moved: false,
                  };
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragging(true);
                  setTooltip(null);
                }}
                onPointerMove={(event) => {
                  if (!dragRef.current) return;
                  const scale =
                    g.width / event.currentTarget.getBoundingClientRect().width;
                  const dx = (event.clientX - dragRef.current.x) * scale;
                  const dy = (event.clientY - dragRef.current.y) * scale;
                  dragRef.current.moved = Math.abs(dx) + Math.abs(dy) > 3;
                  setCamera({
                    ...dragRef.current.camera,
                    x: clamp(dragRef.current.camera.x + dx, -85, 85),
                    y: clamp(dragRef.current.camera.y + dy, -65, 65),
                  });
                }}
                onPointerUp={(event) => {
                  dragRef.current = null;
                  setDragging(false);
                  if (event.currentTarget.hasPointerCapture(event.pointerId))
                    event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  dragRef.current = null;
                  setDragging(false);
                }}
              >
                <defs>
                  <linearGradient id={id("glass")} x1="0" y1="0" x2=".9" y2="1">
                    <stop className="aws-glass-start" />
                    <stop offset="1" className="aws-glass-end" />
                  </linearGradient>
                  <linearGradient id={id("violet")} x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#b99bff" />
                    <stop offset="1" stopColor="#6d36e7" />
                  </linearGradient>
                  <linearGradient id={id("cylinder")}>
                    <stop className="aws-cylinder-left" />
                    <stop offset=".48" className="aws-cylinder-middle" />
                    <stop offset="1" className="aws-cylinder-right" />
                  </linearGradient>
                  <filter
                    id={id("shadow")}
                    x="-30%"
                    y="-40%"
                    width="170%"
                    height="190%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="10"
                      stdDeviation="9"
                      floodColor="#57278d"
                      floodOpacity=".12"
                    />
                  </filter>
                  <filter
                    id={id("glow")}
                    x="-200%"
                    y="-200%"
                    width="500%"
                    height="500%"
                  >
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                  <marker
                    id={id("arrow")}
                    markerWidth="7"
                    markerHeight="7"
                    refX="6"
                    refY="3.5"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M0 0 L7 3.5 L0 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </marker>
                </defs>
                <motion.g
                  className="aws-camera"
                  animate={{ x: camera.x, y: camera.y, scale: camera.zoom }}
                  style={{
                    transformOrigin: `${g.width / 2}px ${g.height / 2}px`,
                  }}
                  transition={{
                    duration: reduced || dragging ? 0 : 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.g {...materialize(0.05)}>
                    <path
                      className="aws-permission-shield"
                      d={
                        compact
                          ? "M260 162 L506 207 V525 Q506 713 260 787 Q14 713 14 525 V207 Z"
                          : "M616 48 L1025 114 V330 Q1025 458 616 539 Q205 458 205 330 V114 Z"
                      }
                    />
                  </motion.g>
                  <motion.g {...materialize(0.05)}>
                    <rect
                      className="aws-vpc-fill"
                      x={g.vpc.x}
                      y={g.vpc.y}
                      width={g.vpc.w}
                      height={g.vpc.h}
                      rx="28"
                    />
                    <motion.rect
                      className={`aws-vpc-boundary ${selected === "vpc" ? "is-selected" : ""}`}
                      x={g.vpc.x}
                      y={g.vpc.y}
                      width={g.vpc.w}
                      height={g.vpc.h}
                      rx="28"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: revealed || reduced ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 1.1 }}
                    />
                    <g {...nodeProps("vpc")}>
                      <rect
                        x={g.vpc.x + 20}
                        y={g.vpc.y + 15}
                        width="200"
                        height="42"
                        rx="11"
                        className="aws-boundary-button"
                      />
                      <Cloud
                        x={g.vpc.x + 31}
                        y={g.vpc.y + 26}
                        size={20}
                        aria-hidden="true"
                      />
                      <text
                        x={g.vpc.x + 64}
                        y={g.vpc.y + 40}
                        className="aws-svg-title"
                      >
                        AWS VPC
                      </text>
                    </g>
                    <text
                      x={g.vpc.x + g.vpc.w - 24}
                      y={g.vpc.y + 39}
                      textAnchor="end"
                      className="aws-svg-meta"
                    >
                      NETWORK BOUNDARY
                    </text>
                  </motion.g>
                  <motion.g {...materialize(0.3)}>
                    <rect
                      {...{
                        x: g.publicSubnet.x,
                        y: g.publicSubnet.y,
                        width: g.publicSubnet.w,
                        height: g.publicSubnet.h,
                      }}
                      rx="18"
                      className="aws-subnet aws-public-subnet"
                    />
                    <text
                      x={g.publicSubnet.x + 17}
                      y={g.publicSubnet.y + 30}
                      className="aws-svg-meta"
                    >
                      PUBLIC SUBNET
                    </text>
                    <text
                      x={g.publicSubnet.x + 17}
                      y={g.publicSubnet.y + 48}
                      className="aws-svg-small"
                    >
                      Internet-gateway route · HTTPS ingress
                    </text>
                  </motion.g>
                  <motion.g {...materialize(0.9)}>
                    <rect
                      {...{
                        x: g.privateSubnet.x,
                        y: g.privateSubnet.y,
                        width: g.privateSubnet.w,
                        height: g.privateSubnet.h,
                      }}
                      rx="18"
                      className="aws-subnet aws-private-subnet"
                    />
                    <LockKeyhole
                      x={g.privateSubnet.x + 16}
                      y={g.privateSubnet.y + 13}
                      size={15}
                      aria-hidden="true"
                    />
                    <text
                      x={g.privateSubnet.x + 38}
                      y={g.privateSubnet.y + 26}
                      className="aws-svg-meta"
                    >
                      PRIVATE SUBNET
                    </text>
                    <text
                      x={g.privateSubnet.x + 17}
                      y={g.privateSubnet.y + 47}
                      className="aws-svg-small"
                    >
                      Publicly accessible: No
                    </text>
                  </motion.g>
                  <motion.g {...materialize(0.3)}>
                    <g {...nodeProps("ec2")}>
                      <rect
                        className="aws-card aws-ec2-base"
                        x={g.ec2.x + 5}
                        y={g.ec2.y + 8}
                        width={g.ec2.w}
                        height={g.ec2.h}
                        rx="20"
                      />
                      <rect
                        className="aws-card aws-ec2-card"
                        x={g.ec2.x}
                        y={g.ec2.y}
                        width={g.ec2.w}
                        height={g.ec2.h}
                        rx="20"
                        fill={`url(#${id("glass")})`}
                        filter={`url(#${id("shadow")})`}
                      />
                      <Server
                        x={g.ec2.x + 20}
                        y={g.ec2.y + 20}
                        size={25}
                        aria-hidden="true"
                      />
                      <text
                        className="aws-svg-title"
                        x={g.ec2.x + 57}
                        y={g.ec2.y + 34}
                      >
                        EC2 Instance
                      </text>
                      <text
                        className="aws-svg-small"
                        x={g.ec2.x + 57}
                        y={g.ec2.y + 53}
                      >
                        Linux · one application host
                      </text>
                      <circle
                        cx={g.ec2.x + g.ec2.w - 25}
                        cy={g.ec2.y + 30}
                        r="4"
                        className="aws-online"
                      />
                    </g>
                  </motion.g>
                  {["frontend", "backend"].map((key, i) => {
                    const p = g[key];
                    const ModuleIcon = key === "frontend" ? Globe : Code2;
                    return (
                      <motion.g key={key} {...materialize(0.65 + i * 0.12)}>
                        <g {...nodeProps(key)}>
                          <rect
                            x={p.x}
                            y={p.y}
                            width={p.w}
                            height={p.h}
                            rx="12"
                            className="aws-card aws-module-card"
                            fill={`url(#${id("glass")})`}
                          />
                          <ModuleIcon
                            x={p.x + 12}
                            y={p.y + 12}
                            size={19}
                            aria-hidden="true"
                          />
                          <text
                            x={p.x + 12}
                            y={p.y + 46}
                            className="aws-svg-module-title"
                          >
                            {key === "frontend" ? "Frontend" : "Backend / API"}
                          </text>
                          <text
                            x={p.x + 12}
                            y={p.y + 63}
                            className="aws-svg-small"
                          >
                            {key === "frontend"
                              ? "Nginx · web assets"
                              : "Spring Boot or Flask"}
                          </text>
                        </g>
                      </motion.g>
                    );
                  })}
                  <motion.g {...materialize(0.95)}>
                    <g {...nodeProps("database")}>
                      <ellipse
                        cx={g.database.x}
                        cy={g.database.y + 60}
                        rx="78"
                        ry="25"
                        className="aws-database-shadow"
                      />
                      <path
                        d={`M${g.database.x - 65} ${g.database.y} V${g.database.y + 65} C${g.database.x - 65} ${g.database.y + 96} ${g.database.x + 65} ${g.database.y + 96} ${g.database.x + 65} ${g.database.y + 65} V${g.database.y} Z`}
                        fill={`url(#${id("cylinder")})`}
                        className="aws-cylinder"
                        filter={`url(#${id("shadow")})`}
                      />
                      <ellipse
                        cx={g.database.x}
                        cy={g.database.y}
                        rx="65"
                        ry="19"
                        className="aws-cylinder-top"
                      />
                      <path
                        d={`M${g.database.x - 65} ${g.database.y + 34} C${g.database.x - 65} ${g.database.y + 62} ${g.database.x + 65} ${g.database.y + 62} ${g.database.x + 65} ${g.database.y + 34}`}
                        className="aws-cylinder-ring"
                      />
                      <Database
                        x={g.database.x - 13}
                        y={g.database.y - 14}
                        size={26}
                        aria-hidden="true"
                      />
                      <text
                        textAnchor="middle"
                        x={g.database.x}
                        y={g.database.y + 39}
                        className="aws-svg-database-title"
                      >
                        Aurora / RDS
                      </text>
                      <text
                        textAnchor="middle"
                        x={g.database.x}
                        y={g.database.y + 59}
                        className="aws-svg-database-small"
                      >
                        MySQL-compatible SQL
                      </text>
                    </g>
                  </motion.g>
                  <motion.g {...materialize(1.15)}>
                    {[
                      [g.appSG, "APP SG · inbound HTTPS 443"],
                      [g.dbSG, "DB SG · 3306 from APP SG"],
                    ].map(([p, label]) => (
                      <g key={label} {...nodeProps("security")}>
                        <rect
                          x={p.x}
                          y={p.y}
                          width={p.w}
                          height="31"
                          rx="9"
                          className="aws-sg-badge"
                        />
                        <LockKeyhole
                          x={p.x + 10}
                          y={p.y + 8}
                          size={14}
                          aria-hidden="true"
                        />
                        <text
                          x={p.x + 31}
                          y={p.y + 20}
                          className="aws-svg-rule"
                        >
                          {label}
                        </text>
                      </g>
                    ))}
                    <g {...nodeProps("iam")}>
                      <rect
                        x={g.iam.x}
                        y={g.iam.y}
                        width={g.iam.w}
                        height={g.iam.h}
                        rx="16"
                        className="aws-card aws-iam-card"
                        fill={`url(#${id("glass")})`}
                      />
                      <ShieldCheck
                        x={g.iam.x + 16}
                        y={g.iam.y + 18}
                        size={29}
                        aria-hidden="true"
                      />
                      <text
                        x={g.iam.x + 57}
                        y={g.iam.y + 28}
                        className="aws-svg-title"
                      >
                        IAM permissions layer
                      </text>
                      <text
                        x={g.iam.x + 57}
                        y={g.iam.y + 47}
                        className="aws-svg-small"
                      >
                        Instance role · least privilege
                      </text>
                    </g>
                    <path
                      className="aws-permission-link"
                      d={compact ? "M260 802 V787" : "M655 553 V523"}
                    />
                    <text
                      x={compact ? 260 : 400}
                      y={compact ? 885 : 595}
                      textAnchor="middle"
                      className="aws-svg-small"
                    >
                      Permissions, not a traffic hop
                    </text>
                  </motion.g>
                  <motion.g {...materialize(0.15)}>
                    <g {...nodeProps("browser")}>
                      <rect
                        x={g.browser.x}
                        y={g.browser.y}
                        width={g.browser.w}
                        height={g.browser.h}
                        rx="18"
                        className="aws-card aws-browser-card"
                        fill={`url(#${id("glass")})`}
                        filter={`url(#${id("shadow")})`}
                      />
                      <Globe
                        x={g.browser.x + 18}
                        y={g.browser.y + 17}
                        size={28}
                        aria-hidden="true"
                      />
                      <text
                        x={g.browser.x + 18}
                        y={g.browser.y + 65}
                        className="aws-svg-title"
                      >
                        User / Browser
                      </text>
                      <text
                        x={g.browser.x + 18}
                        y={g.browser.y + 85}
                        className="aws-svg-small"
                      >
                        HTTPS client
                      </text>
                    </g>
                  </motion.g>
                  {Object.entries(g.routes).map(([route, path]) => (
                    <motion.g
                      key={route}
                      {...materialize(1.4)}
                      className={`aws-route ${highlighted(route) ? "is-highlighted" : ""}`}
                    >
                      <motion.path
                        data-route={route}
                        d={path}
                        className="aws-connection"
                        initial={reduced ? false : { pathLength: 0 }}
                        animate={{ pathLength: revealed || reduced ? 1 : 0 }}
                        transition={{
                          duration: reduced ? 0 : 0.75,
                          delay: reduced ? 0 : 1.5,
                        }}
                        markerEnd={`url(#${id("arrow")})`}
                        markerStart={`url(#${id("arrow")})`}
                      />
                      <text
                        x={g.labels[route][0]}
                        y={g.labels[route][1]}
                        className="aws-svg-connection-label"
                      >
                        {route === "https"
                          ? "HTTPS · 443"
                          : route === "local"
                            ? "/api"
                            : "private SQL · 3306"}
                      </text>
                    </motion.g>
                  ))}
                  {running && revealed && (
                    <g
                      aria-hidden="true"
                      className="aws-packet"
                      key={`${mode}-${phase}`}
                      data-packet-route={flow.route}
                      data-packet-direction={flow.direction}
                    >
                      <circle
                        r="9"
                        fill="#a578ff"
                        filter={`url(#${id("glow")})`}
                      />
                      <circle
                        r="3.5"
                        fill="#d8c5ff"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <animateMotion
                        ref={beginPacket}
                        begin="indefinite"
                        dur="1.8s"
                        path={g.routes[flow.route]}
                        keyPoints={flow.direction === "reverse" ? "1;0" : "0;1"}
                        keyTimes="0;1"
                        calcMode="linear"
                        fill="freeze"
                      />
                    </g>
                  )}
                </motion.g>
              </svg>
              {tooltip && (
                <div
                  id={id("tooltip")}
                  role="tooltip"
                  className="aws-tooltip"
                  style={{ left: tooltip.x, top: tooltip.y }}
                >
                  <strong>{SERVICES[tooltip.key].name}</strong>
                  <span>{SERVICES[tooltip.key].description}</span>
                </div>
              )}
              <div
                className="aws-view-controls"
                role="group"
                aria-label="Diagram view controls"
              >
                <button
                  type="button"
                  onClick={() => zoomBy(0.1)}
                  disabled={camera.zoom >= 1.45}
                  aria-label="Zoom in"
                >
                  <Plus size={16} />
                </button>
                <output aria-label="Zoom level">
                  {Math.round(camera.zoom * 100)}%
                </output>
                <button
                  type="button"
                  onClick={() => zoomBy(-0.1)}
                  disabled={camera.zoom <= 1}
                  aria-label="Zoom out"
                >
                  <Minus size={16} />
                </button>
                <span className="aws-control-divider" />
                <button
                  type="button"
                  onClick={() => panBy(-20, 0)}
                  aria-label="Pan left"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => panBy(20, 0)}
                  aria-label="Pan right"
                >
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => panBy(0, -20)}
                  aria-label="Pan up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => panBy(0, 20)}
                  aria-label="Pan down"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  aria-label="Reset view"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
            <div className="aws-diagram-footer">
              <span>
                <Move size={13} aria-hidden="true" />
                Select a node · drag to pan
              </span>
              <span>
                <i className="aws-legend-traffic" />
                Network traffic
                <i className="aws-legend-permission" />
                IAM permissions
              </span>
            </div>
          </div>
          <aside
            ref={detailRef}
            id={id("component-details")}
            className="aws-detail-panel"
            aria-label="Architecture component details"
          >
            <div className="aws-panel-kicker">
              <span>Architecture notes</span>
              <span>01 / AWS</span>
            </div>
            <div aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected || mode}
                  className="aws-detail-content"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="aws-detail-icon">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <p className="aws-detail-eyebrow">
                    {service?.eyebrow || "Reference architecture"}
                  </p>
                  <h3 tabIndex={-1}>
                    {service?.name ||
                      (mode === "security"
                        ? "Defense in layers."
                        : mode === "flow"
                          ? "Follow the request."
                          : "A complete picture.")}
                  </h3>
                  <p className="aws-detail-description">
                    {service?.description || activeMode.description}
                  </p>
                  <p className="aws-detail-body">
                    {service?.details ||
                      "Select a floating component to inspect its role. Frontend and backend share one EC2 instance; only the backend talks to the private managed SQL database. IAM controls AWS permissions alongside, rather than inside, the traffic path."}
                  </p>
                  {service && (
                    <ul className="aws-tech-tags">
                      {service.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  )}
                  <div className="aws-security-fact">
                    <ShieldCheck size={17} aria-hidden="true" />
                    <p>
                      {service?.fact ||
                        "An illustrative reference inspired by my experience, not a claim that every component was deployed together."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {compact && selected && (
              <button
                className="aws-return-diagram"
                type="button"
                onClick={() => {
                  stageRef.current?.scrollIntoView({
                    behavior: reduced ? "auto" : "smooth",
                    block: "start",
                  });
                  stageRef.current
                    ?.querySelector("svg")
                    ?.focus({ preventScroll: true });
                }}
              >
                <ArrowUp size={14} aria-hidden="true" />
                Back to diagram
              </button>
            )}
            <div
              className="aws-component-shortcuts"
              role="group"
              aria-label="Explore architecture components"
            >
              {["ec2", "vpc", "database", "iam", "security"].map((key) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={selected === key}
                  onClick={() => selectService(key)}
                >
                  {SERVICES[key].name}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
          </aside>
        </div>
        <div className="aws-flow-console">
          <div className="aws-flow-caption">
            <span className="aws-flow-index">
              {String(phase + 1).padStart(2, "0")} / 06
            </span>
            <div>
              <strong>
                {mode === "security" ? "Private by design" : flow.label}
              </strong>
              <p>
                {mode === "security"
                  ? "Database ingress: application SG only. IAM is a separate permissions layer."
                  : flow.detail}
              </p>
            </div>
            <button
              type="button"
              className="aws-pause"
              disabled={!!reduced || mode === "security"}
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume animation" : "Pause animation"}
            >
              {paused || reduced || mode === "security" ? (
                <Play size={15} />
              ) : (
                <Pause size={15} />
              )}
              <span>
                {reduced
                  ? "Reduced motion"
                  : mode === "security"
                    ? "Security focus"
                    : paused
                      ? "Resume"
                      : "Pause"}
              </span>
            </button>
          </div>
          {mode === "flow" && (
            <ol
              className="aws-flow-steps"
              aria-label="Request and response stages"
            >
              {FLOW.map((step, index) => (
                <li key={step.label}>
                  <button
                    type="button"
                    aria-label={`Inspect stage ${index + 1}: ${step.label}`}
                    aria-pressed={phase === index}
                    onClick={() => {
                      setPhase(index);
                      setPaused(true);
                    }}
                  >
                    {index < 3 ? (
                      <ArrowRight size={13} aria-hidden="true" />
                    ) : (
                      <ArrowLeft size={13} aria-hidden="true" />
                    )}
                    <span>{step.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <p className="aws-reference-note">
        <Check size={15} aria-hidden="true" />
        <span>
          Concept, not a deployment claim. RDS MySQL and Aurora are
          alternatives. A real database subnet group spans multiple Availability
          Zones; one private subnet is shown here for clarity.
        </span>
      </p>
    </section>
  );
}
