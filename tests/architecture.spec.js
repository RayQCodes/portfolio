import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const errors = new WeakMap();
const mode = (page, name) =>
  page
    .getByRole("group", { name: "Architecture modes", exact: true })
    .getByRole("button", { name, exact: true });
const panel = (page) =>
  page.getByRole("complementary", { name: "Architecture component details" });
const canvas = (page) => page.locator(".aws-canvas");
const packet = (page) => page.locator(".aws-packet");
async function enterArchitecture(page) {
  await page.locator(".aws-stage").scrollIntoViewIfNeeded();
  await expect(packet(page)).toHaveCount(1, { timeout: 7_000 });
}
async function packetX(page) {
  return packet(page).evaluate((node) => node.getCTM().e);
}

test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (error) => errors.get(page).push(error.message));
  await page.goto("/");
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});

test("each service is keyboard explorable and explains the actual network/security role", async ({
  page,
}) => {
  await enterArchitecture(page);
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  const services = [
    [
      "EC2 Instance",
      "EC2 Instance",
      "Compute instance hosting the frontend and backend application.",
    ],
    ["Frontend", "Frontend", "The web application served from EC2."],
    [
      "Backend / API",
      "Backend / API",
      "The application/API running on the same EC2 instance.",
    ],
    [
      "AWS VPC",
      "AWS VPC",
      "Isolated AWS network with subnet routing and security boundaries.",
    ],
    [
      "Amazon Aurora / RDS",
      "Amazon Aurora / RDS",
      "Managed relational SQL database with private application connectivity.",
    ],
    [
      "IAM",
      "IAM",
      "Least-privilege permissions controlling AWS resource access.",
    ],
    [
      "Security Groups",
      "Security Groups",
      "Stateful network rules restricting inbound and outbound traffic.",
    ],
  ];
  for (const [name, title, description] of services) {
    const node = page
      .getByRole("button", { name: `Explore ${name}`, exact: true })
      .first();
    await node.focus();
    await expect(page.getByRole("tooltip")).toContainText(description);
    await node.press("Enter");
    await expect(
      panel(page).getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(panel(page)).toContainText(description);
    await expect(node).toHaveAttribute("aria-pressed", "true");
  }
  await page
    .getByRole("group", {
      name: "Explore architecture components",
      exact: true,
    })
    .getByRole("button", { name: "IAM", exact: true })
    .click();
  await expect(panel(page)).toContainText(
    "does not route packets or replace security groups",
  );
});

test("SQL query packets move toward the database and results move back along the same connection", async ({
  page,
}) => {
  await enterArchitecture(page);
  await mode(page, "Request Flow").click();
  // Stage selection pauses the simulation, allowing deterministic inspection.
  for (const [label, sign] of [
    ["Inspect stage 3: SQL query", 1],
    ["Inspect stage 4: Query result", -1],
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page
      .getByRole("button", { name: "Resume animation", exact: true })
      .click();
    await expect(packet(page)).toHaveCount(1);
    await expect(packet(page)).toHaveAttribute("data-packet-route", "sql");
    const start = await packetX(page);
    await page.waitForTimeout(350);
    const end = await packetX(page);
    expect((end - start) * sign).toBeGreaterThan(5);
    await page
      .getByRole("button", { name: "Pause animation", exact: true })
      .click();
  }
  await page
    .getByRole("button", {
      name: "Inspect stage 6: HTTPS response",
      exact: true,
    })
    .click();
  await expect(page.locator(".aws-flow-caption")).toContainText(
    "Nginx → browser",
  );
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click();
  await expect(packet(page)).toHaveAttribute(
    "data-packet-direction",
    "reverse",
  );
  await expect(packet(page)).toHaveAttribute("data-packet-route", "https");
  await mode(page, "Security View").click();
  await expect(packet(page)).toHaveCount(0);
  await expect(page.locator(".aws-private-subnet")).toBeVisible();
  await expect(canvas(page)).toContainText("Publicly accessible: No");
  await expect(canvas(page)).toContainText("3306 from APP SG");
  await expect(page.locator(".aws-flow-caption")).toContainText(
    "IAM is a separate permissions layer",
  );
});

test("view controls are bounded, keyboard pan works, and reset restores the full diagram", async ({
  page,
}) => {
  await enterArchitecture(page);
  const output = page.getByRole("status", { name: "Zoom level", exact: true });
  for (let i = 0; i < 5; i++)
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(output).toHaveText("145%");
  await expect(
    page.getByRole("button", { name: "Zoom in", exact: true }),
  ).toBeDisabled();
  await expect
    .poll(() =>
      page
        .locator(".aws-camera")
        .evaluate((node) => node.getCTM().a / node.ownerSVGElement.getCTM().a),
    )
    .toBeCloseTo(1.45, 2);
  await canvas(page).focus();
  const before = await page
    .locator(".aws-camera")
    .evaluate((node) => node.getCTM().e);
  await canvas(page).press("ArrowRight");
  await expect
    .poll(() => page.locator(".aws-camera").evaluate((node) => node.getCTM().e))
    .toBeGreaterThan(before + 10);
  await canvas(page).press("0");
  await expect(output).toHaveText("100%");
  await expect(
    page.getByRole("button", { name: "Zoom out", exact: true }),
  ).toBeDisabled();
  const stage = await canvas(page).boundingBox();
  await page.mouse.move(stage.x + 10, stage.y + 10);
  await page.mouse.down();
  await page.mouse.move(stage.x + 70, stage.y + 25, { steps: 6 });
  await page.mouse.up();
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect(output).toHaveText("100%");
  await expect(
    panel(page).getByRole("heading", {
      name: "A complete picture.",
      exact: true,
    }),
  ).toBeVisible();
});

test("traffic stops when paused or offscreen", async ({ page }) => {
  await expect(packet(page)).toHaveCount(0);
  await enterArchitecture(page);
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  const phase = await page.locator(".aws-flow-index").textContent();
  await expect(packet(page)).toHaveCount(0);
  await page.waitForTimeout(2100);
  await expect(page.locator(".aws-flow-index")).toHaveText(phase);
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click();
  await expect(packet(page)).toHaveCount(1);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(packet(page)).toHaveCount(0);
});

test("reduced motion renders every node without automatic packet animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.locator(".aws-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".aws-canvas animateMotion")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Explore EC2 Instance", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore EC2 Instance", exact: true })
    .press("Space");
  await expect(
    panel(page).getByRole("heading", { name: "EC2 Instance", exact: true }),
  ).toBeVisible();
  await mode(page, "Request Flow").click();
  await page
    .getByRole("button", { name: "Inspect stage 4: Query result", exact: true })
    .click();
  await expect(page.locator(".aws-flow-caption")).toContainText(
    "Database → backend",
  );
  await page.waitForTimeout(1900);
  await expect(page.locator(".aws-canvas animateMotion")).toHaveCount(0);
  await expect(page.locator(".aws-flow-caption")).toContainText(
    "Database → backend",
  );
});

test("mobile diagrams, touch controls and dark mode remain usable without overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.locator(".aws-stage").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    await expect(canvas(page)).toHaveAttribute(
      "viewBox",
      width <= 760 ? "0 0 520 900" : "0 0 1040 650",
    );
    await page
      .getByRole("group", {
        name: "Explore architecture components",
        exact: true,
      })
      .getByRole("button", { name: "Amazon Aurora / RDS", exact: true })
      .click();
    await expect(panel(page)).toContainText("Publicly accessible is disabled");
    await page.getByRole("button", { name: "Reset view", exact: true }).click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".aws-stage").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Explore Frontend", exact: true })
    .click();
  await expect(
    panel(page).getByRole("heading", { name: "Frontend", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("button", { name: "Back to diagram", exact: true })
    .click();
  await expect(canvas(page)).toBeFocused();
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".aws-explorer")).toHaveCSS(
    "--aws-panel",
    "#1c1726",
  );
});

test("the existing hero and resume download are preserved", async ({
  page,
}) => {
  await expect(page.locator("h1")).toHaveText(
    /Cloud &\s*Solutions\s*Architect/,
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download Resume", exact: true })
    .first()
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Raymond-Quan-Resume.pdf");
  expect(await readFile(await download.path())).toEqual(
    await readFile("public/resume.pdf"),
  );
});
