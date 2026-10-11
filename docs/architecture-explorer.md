# AWS architecture explorer

The React/SVG section follows Skills and uses the existing Framer Motion dependency. It is an illustrative reference architecture inspired by experience, not the hosting architecture of the GitHub Pages portfolio or a claim that all these components were deployed together.

## Infrastructure represented

- A browser connects over HTTPS to Nginx on a Linux EC2 instance in a public VPC subnet with an internet-gateway route.
- Nginx serves the frontend and proxies same-origin `/api` requests to a local Java/Spring Boot **or** Python/Flask backend on that same instance.
- The backend connects on TCP 3306 to a private RDS MySQL database **or** Aurora MySQL-compatible alternative. Public database access is disabled. A real database subnet group spans at least two Availability Zones; the illustration shows one private subnet for clarity.
- The application security group permits HTTPS. Database ingress references the application security group, with matching application egress; stateful return traffic is allowed automatically.
- IAM controls AWS resource permissions through an instance role. Its dotted shield is a permissions layer, never a network traffic hop or a replacement for SQL authentication.

## Interaction and animation

Overview shows all components. Request Flow highlights a six-stage request and response journey; query results and responses traverse their connections in reverse. Security View emphasizes network boundaries, security groups, private database connectivity, and the separate IAM layer.

Click or focus a component and press Enter/Space to inspect it. The diagram supports bounded zoom, mouse background dragging, arrow-key panning, `+`/`-` zoom, and `0`/Escape reset. Touch users have pan buttons, and component selection brings the detail panel into view on mobile. A return button restores focus to the diagram.

Scroll reveal stages the VPC, EC2, application modules, database, permissions, connections, and traffic. Only one request packet animates at a time. Traffic and ambient animation stop offscreen or when paused, and automatic animation is disabled for reduced-motion preferences. No canvas, WebGL, external AWS icon assets, or additional runtime dependencies are required.

## Local verification

```sh
npm ci
npx playwright install chromium
npm run test:architecture
```

With an existing Chromium installation, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:architecture` instead. The test runner builds the production site and starts a temporary local Vite preview. Tests cover keyboard exploration, actual forward/reverse packet movement, camera bounds and reset, pause/offscreen behavior, reduced motion, mobile detail focus, responsive layouts, dark mode, and byte-for-byte resume downloads.

The existing GitHub Pages workflow, custom domain, resume, hero, and deployment settings are unchanged. Pull requests build only; this feature branch does not publish the site.
