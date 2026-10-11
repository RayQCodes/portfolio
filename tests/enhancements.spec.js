import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const failures = new WeakMap();
const skills = (page) => page.locator("#skills");
const featured = (page) => page.locator("#featured-tech-panel");
const explore = (page, name) =>
  page.getByRole("button", { name: `Explore ${name}`, exact: true });
async function enterSkills(page) {
  await skills(page).scrollIntoViewIfNeeded();
}
test.beforeEach(async ({ page }) => {
  failures.set(page, []);
  page.on("pageerror", (e) => failures.get(page).push(e.message));
  await page.goto("/");
});
test.afterEach(async ({ page }) => expect(failures.get(page)).toEqual([]));

test("approved portrait, navigation targets, resume and project URL are preserved", async ({
  page,
}) => {
  expect(
    createHash("sha256")
      .update(await readFile("public/raymond-avatar.png"))
      .digest("hex"),
  ).toBe("faf4502e23b9ed76d7d4e960082661d5b80257af73dd35fc92d74cef7df53b52");
  await expect(page.locator(".hero-subtitle")).toContainText(
    "AWS and Spring Boot",
  );
  await expect(page.locator(".career-direction")).toContainText(
    "Career direction",
  );
  const broken = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .filter(
          (a) => !document.getElementById(decodeURIComponent(a.hash.slice(1))),
        )
        .map((a) => a.hash),
    );
  expect(broken).toEqual([]);
  await expect(page.locator(".signature-letter")).toHaveCount(11);
  await expect(page.locator(".hero-avatar")).toHaveJSProperty(
    "naturalWidth",
    1536,
  );
  await expect(page.locator("#project-quiz h3 a")).toHaveAttribute(
    "href",
    "https://github.com/RayQCodes/quizapp/tree/backend",
  );
  expect(
    await (await page.request.get("/resume.pdf?v=20261008")).body(),
  ).toEqual(await readFile("public/resume.pdf"));
  expect(await (await page.request.get("/CNAME")).text()).toContain(
    "raymondwquan.com",
  );
});

test("Spring simulation traverses each application layer and returns valid GET and POST JSON without a backend request", async ({
  page,
}) => {
  const liveRequests = [];
  page.on("request", (req) => {
    if (new URL(req.url()).pathname.startsWith("/api/"))
      liveRequests.push(req.url());
  });
  await enterSkills(page);
  await page
    .getByRole("button", { name: "Send API Request", exact: true })
    .click();
  for (const label of [
    "Controller matches the route",
    "Service coordinates application logic",
    "Repository requests the records",
    "MySQL retrieves topic-based questions",
    "Repository maps the persisted records",
    "Service maps the question DTOs",
    "Controller returns HTTP 200",
    "Client receives JSON",
  ]) {
    await expect(page.locator(".simulation-status")).toContainText(label, {
      timeout: 2500,
    });
  }
  await expect(page.locator(".simulation-status")).toContainText("200 OK", {
    timeout: 2500,
  });
  const response = JSON.parse(
    await page
      .getByLabel("Simulated JSON response", { exact: true })
      .innerText(),
  );
  expect(response[0].options).toContain("AWS IAM");
  expect(response[0]).toHaveProperty("questionText");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByLabel("Request", { exact: true }).selectOption("answer");
  await page
    .getByRole("group", { name: "Spring Boot application layers", exact: true })
    .getByRole("button", { name: /Controller/ })
    .click();
  await expect(page.locator(".layer-notes")).toContainText(
    '@PostMapping("/api/answer")',
  );
  expect(
    JSON.parse(
      await page
        .getByLabel("Simulated request body", { exact: true })
        .innerText(),
    ),
  ).toEqual({ id: 1, selectedAnswer: "AWS IAM" });
  await page
    .getByRole("button", { name: "Send API Request", exact: true })
    .click();
  await expect(page.locator(".simulation-status")).toContainText("200 OK");
  const answer = JSON.parse(
    await page
      .getByLabel("Simulated JSON response", { exact: true })
      .innerText(),
  );
  expect(answer).toMatchObject({ correct: true, correctAnswer: "AWS IAM" });
  expect(liveRequests).toEqual([]);
  await page
    .getByRole("button", { name: "Reset API simulation", exact: true })
    .click();
  await expect(page.locator(".simulation-status")).toContainText(
    "Ready to send",
  );
});

test("Spring lifecycle pauses offscreen and can restart cleanly", async ({
  page,
}) => {
  await enterSkills(page);
  await page
    .getByRole("button", { name: "Send API Request", exact: true })
    .click();
  await page.locator("#home").scrollIntoViewIfNeeded();
  await expect(page.locator(".spring-experience")).not.toHaveClass(
    /simulation-running/,
  );
  const status = await page.locator(".simulation-status").innerText();
  await page.waitForTimeout(1400);
  expect(await page.locator(".simulation-status").innerText()).toBe(status);
  await page
    .getByRole("button", { name: "Reset API simulation", exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Send API Request", exact: true })
    .click();
  await expect(page.locator(".simulation-status")).toContainText("200 OK");
});

test("Java fundamentals highlight real code and validation handles valid and unknown options", async ({
  page,
}) => {
  await enterSkills(page);
  await expect(page.locator(".featured-tech h3")).toHaveText([
    "AWS",
    "Spring Boot",
    "Java",
  ]);
  await explore(page, "Java").click();
  await expect(
    page
      .getByRole("group", { name: "Java concepts", exact: true })
      .getByRole("button"),
  ).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Method invocation", exact: true }),
  ).toHaveCount(0);
  await expect(
    featured(page).getByLabel("Complete Java validation example", {
      exact: true,
    }),
  ).toContainText("public class QuizValidator");
  await page
    .getByRole("button", { name: "Encapsulation", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(featured(page).locator(".technology-note")).toContainText(
    "Private final fields",
  );
  await expect(featured(page).locator(".line-highlight")).toContainText([
    "private final List<String> options;",
    "private final String correct;",
  ]);
  await page
    .getByRole("button", { name: "Run valid answer", exact: true })
    .click();
  await expect(page.locator(".java-output")).toHaveText("Console → true");
  await page
    .getByRole("button", { name: "Try unknown option", exact: true })
    .click();
  await expect(page.locator(".java-output")).toHaveText(
    "Console → Unknown option",
  );
  await expect(featured(page).locator(".technology-note")).toContainText(
    "IllegalArgumentException",
  );
});

test("AWS services lead to the existing explorer and skill filters retain selectable connections", async ({
  page,
}) => {
  await enterSkills(page);
  await explore(page, "AWS").click();
  const services = page.getByRole("group", {
    name: "Featured AWS services",
    exact: true,
  });
  for (const name of ["EC2", "VPC", "IAM", "RDS", "S3", "CloudWatch"]) {
    const button = services.getByRole("button", {
      name: new RegExp(`^${name} `),
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
  }
  await expect(skills(page)).not.toContainText("Lambda");
  await page
    .getByRole("link", { name: "Explore Architecture", exact: true })
    .click();
  await expect(page).toHaveURL(/#architecture$/);
  await expect(page.locator(".aws-canvas")).toHaveCount(1);
  await page
    .getByRole("group", { name: "Filter skills by category", exact: true })
    .getByRole("button", { name: "Backend", exact: true })
    .click();
  await expect(page.locator(".skill-card")).toHaveCount(1);
  await page
    .getByRole("group", { name: "Software Engineering skills", exact: true })
    .getByRole("button", { name: "Java", exact: true })
    .focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".skill-connections")).toContainText(
    "Full-Stack Testing Automation System",
  );
  await page
    .getByRole("group", { name: "Filter skills by category", exact: true })
    .getByRole("button", { name: "All", exact: true })
    .click();
  await expect(page.locator(".skill-card")).toHaveCount(6);
});

test("project and experience expansion is keyboard accessible and reversible", async ({
  page,
}) => {
  const quiz = page.locator("#project-quiz");
  await quiz
    .getByRole("button", { name: "Explore project", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(quiz).toContainText("POST /api/answer");
  await expect(quiz).toContainText("My contributions");
  await expect(quiz).toContainText("MySQL / RDS");
  await quiz
    .getByRole("button", { name: "Explore project", exact: true })
    .click();
  await expect(quiz.locator(".project-expanded")).toHaveCount(0);
  await expect(page.locator(".project-card")).toHaveCount(4);
  const mais = page.locator("#experience-mais");
  await mais
    .getByRole("button", { name: "Explore engineering work", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(mais).toContainText("Engineering work");
  await expect(mais).toContainText("validated registration", {
    ignoreCase: true,
  });
  await mais
    .getByRole("button", { name: "Explore engineering work", exact: true })
    .click();
  await expect(mais.locator(".experience-details")).toHaveCount(0);
  const foundry = page.locator("#experience-foundry");
  await foundry
    .getByRole("button", { name: "Explore engineering work", exact: true })
    .click();
  await expect(foundry).toContainText("Program Manager decision briefs");
});

test("mobile widths, theme persistence, navigation and reduced-motion interactions remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".signature-letter").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await enterSkills(page);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await page
      .getByRole("button", { name: "Send API Request", exact: true })
      .click();
    await expect(page.locator(".simulation-status")).toContainText("200 OK");
    await explore(page, "Java").click();
    await page
      .getByRole("button", { name: "Run valid answer", exact: true })
      .click();
    await expect(page.locator(".java-output")).toContainText("true");
    await explore(page, "Spring Boot").click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Skills", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#skills$/);
});
