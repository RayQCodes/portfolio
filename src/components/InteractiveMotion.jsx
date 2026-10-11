import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotionPreference(callback) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
// Motion's installed hook captures the initial setting. React to changes too.
export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

// Pointer effects update local CSS variables, not React state or a global cursor loop.
export function surfacePointer(event) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const node = event.currentTarget;
  const box = node.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width;
  const y = (event.clientY - box.top) / box.height;
  node.style.setProperty("--pointer-x", `${x * 100}%`);
  node.style.setProperty("--pointer-y", `${y * 100}%`);
  node.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
  node.style.setProperty("--tilt-y", `${(x - 0.5) * 3}deg`);
}
export function resetSurface(event) {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}
export const surfaceEvents = {
  onPointerMove: surfacePointer,
  onPointerLeave: resetSurface,
};

export function useHeroMotion() {
  const ref = useRef(null);
  const reduced = useMotionPreference();
  const visible = useInView(ref, { amount: 0.1 });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 75, damping: 24 });
  const y = useSpring(py, { stiffness: 75, damping: 24 });
  function onPointerMove(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set(((event.clientX - rect.left) / rect.width - 0.5) * 10);
    py.set(((event.clientY - rect.top) / rect.height - 0.5) * 7);
    surfacePointer(event);
  }
  return {
    ref,
    reduced,
    visible,
    x,
    y,
    events: {
      onPointerMove,
      onPointerLeave: () => {
        px.set(0);
        py.set(0);
      },
    },
  };
}

export function HeroSignature({ heroRef, x, reduced }) {
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const depth = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  return (
    <motion.div
      className="hero-watermark signature-name"
      aria-hidden="true"
      style={reduced ? {} : { x, y: depth, opacity }}
    >
      {["RAYMOND", "QUAN"].map((word, wi) => (
        <span className="signature-line" key={word}>
          {[...word].map((letter, i) => (
            <span className="signature-mask" key={i}>
              <motion.span
                className="signature-letter"
                initial={
                  reduced
                    ? false
                    : { y: "105%", opacity: 0, filter: "blur(7px)" }
                }
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                whileHover={
                  reduced ? undefined : { y: -5, rotate: i % 2 ? 1 : -1 }
                }
                transition={{
                  type: "spring",
                  stiffness: 95,
                  damping: 21,
                  delay: reduced ? 0 : 0.07 * (i + wi * 7),
                }}
                style={{ "--letter-delay": `${1.3 + i * 0.06}s` }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}

export function ScrollProgress({ onActive }) {
  const { scrollYProgress } = useScroll();
  const reduced = useMotionPreference();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 35 });
  useEffect(() => {
    const sections = [...document.querySelectorAll("main section[id]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) onActive(visible[0].target.id);
      },
      { rootMargin: "-8% 0px -45% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onActive]);
  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
    />
  );
}

export function Reveal({ children, className = "", kind = "rise" }) {
  const reduced = useMotionPreference();
  return (
    <motion.div
      className={className}
      initial={
        reduced
          ? false
          : {
              opacity: 0,
              y: kind === "rise" ? 22 : 0,
              x: kind === "slide" ? -15 : 0,
              filter: kind === "focus" ? "blur(4px)" : "blur(0px)",
            }
      }
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.55 }}
    >
      {children}
    </motion.div>
  );
}
