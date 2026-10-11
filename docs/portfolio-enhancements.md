# Portfolio interaction enhancements

This feature starts from publishing branch commit `a2862a6`, including the approved portrait and the merged AWS explorer. It enhances the existing layout, cream/purple palette, headline composition, projects, education, certifications, contact links, and section order.

## Changed components

- `App.jsx`: hero subtitle prioritizing AWS and Spring Boot, supported by Java fundamentals and continued learning; staggered headline; active navigation; integration of the enhanced timeline.
- `InteractiveMotion.jsx`: masked individual name-letter entrances, blur-to-sharp spring reveals, a brief shimmer, subtle letter hover, bounded pointer parallax, scroll depth/progress, section reveals, and a reactive reduced-motion preference subscription with cleanup.
- `FeaturedTechnologies.jsx`: recognizable locally served AWS/Java/Spring logos and three featured cards, led by AWS and Spring Boot with Java presented as backend fundamentals. AWS badges explain six toolkit services and link to the existing explorer. Four Java fundamentals (classes/interfaces, encapsulation, collections, and exceptions) highlight a complete validation example; local validation shows valid-answer and exception branches. Method invocation is not a featured topic. Spring Boot demonstrates the request and response lifecycle across client, controller, service, repository, and MySQL, with inspectable layers, reset, and example JSON responses.
- `Skills.jsx`: retains the existing categories and technologies (excluding the specifically prohibited service in the featured cloud content), adds source-backed DevOps/security groupings, selectable skill connections, and category filters. Terraform is omitted at Raymond's request.
- `ExperienceTimeline.jsx`: preserves both existing experience entries and their original text, with scroll-linked progression, technology badges, reversible expansion, and conceptual workflow illustrations.
- `Projects.jsx`: preserves all four cards and the quiz GitHub link, adds cursor lighting/tilt, animated expansion, conceptual architecture/workflow, contributions, engineering focus, and results. Project 02 is renamed to **Full-Stack Testing Automation System** because Raymond confirmed it is the same project as the Quiz Application.
- `ArchitectureExplorer.jsx/.css`: small changes to packet contrast, selected-node/connection glow, tooltip shadow, panel easing, control/panel relationships, and reactive reduced motion. Its geometry, components, modes, traffic direction, subnet/security semantics, camera limits, tooltips, controls, reveal sequence, and mobile interactions remain in place.
- `enhancements.css`, `index.css`, and `main.jsx`: theme-aware surfaces and interactions, responsive controls, reduced-motion overrides, direct-child watermark selectors, and CSS loading order. The existing handwritten note uses an SVG arrow and moves clear of the laptop on mobile.

## Content sources

The unchanged `public/resume.pdf` supports the employment/education/certification text, project metrics, and the cloud-hosted Java deployment using EC2, Nginx, and MySQL on RDS. The user's confirmation maps the testing-system name to the existing Quiz Application. No new performance metrics, employers, titles, dates, live demos, or product screenshots are invented.

The real [quiz backend](https://github.com/RayQCodes/quizapp/tree/backend) defines `GET /api/lesson/{topic}`, `GET /api/questions/{topic}`, and `POST /api/answer`. Its controller, service, and DTOs informed the educational simulations. The displayed JSON is sample data with repository-backed field names; no live API is contacted. POST inspection explains lookup by question ID and server-side answer validation. The Java example is complete Java 17 source; its browser interaction simulates the same validation branches rather than executing a JVM.

Aurora remains an illustrative MySQL-compatible alternative in the original diagram. IAM remains a permissions layer, the database remains private, and security groups remain network access controls. The featured AWS services are EC2, VPC, IAM, RDS, S3, and CloudWatch.

The technology SVGs come from [Devicon](https://github.com/devicons/devicon), with its license included at `public/technology-logos/LICENSE-devicon.txt`. No runtime dependencies were added.

## Validation

Run:

```sh
npm ci
npx playwright install chromium
npm run test:architecture
```

The existing script now discovers both the original architecture tests and `enhancements.spec.js`. With system Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. The runner builds the production bundle and starts a temporary local preview.

All 14 browser tests pass: original architecture node explanations, packet direction, camera controls, pause/offscreen behavior, reduced motion, mobile modes, dark mode, resume download; plus portrait checksum, internal links, actual project URL, Spring lifecycle/GET/POST responses and no network API request, offscreen simulation pause, Java valid/invalid examples, AWS service exploration, skill filters/connections, reversible keyboard expansion, 320/390/768/1024px layouts, mobile menu, and saved theme preference. Browser runtime errors are checked after every test. Final expansion/mobile CSS refinements and AWS/mobile visual refinements also pass their relevant focused tests.

GitHub profile and backend links and the existing custom-domain HTTPS endpoint returned HTTP 200. LinkedIn returned HTTP 999 to automated requests, so its unchanged profile URL was checked but end-to-end access could not be verified automatically. `mailto:` targets retain the existing address. Desktop/mobile and light/dark screenshots were captured and decoded successfully.

The final bundle uses the existing Motion library without WebGL or heavyweight rendering. Pointer effects update local CSS variables without React pointer-render loops; hero ambient animations stop outside the viewport. The user-triggered API simulation and existing architecture traffic pause offscreen, and all added observers/listeners/timeouts clean up. Reduced-motion settings, including changes while the page is open, disable automatic animation and make simulation responses immediate. No measured 60 FPS or Lighthouse score is claimed.

The portrait, resume, CNAME, Pages workflow, HTTPS/DNS settings, and Vite build configuration are unchanged. This feature branch and review PR do not publish the production site.
