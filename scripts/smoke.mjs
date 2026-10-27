import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const base = (process.env.BASE_URL || 'http://127.0.0.1:4322').replace(/\/$/, '');
let server;
let browser;
let serverOutput = '';
const failures = [];

async function builtRoutes(directory = 'dist', prefix = '') {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) routes.push(...await builtRoutes(path.join(directory, entry.name), relative));
    else if (entry.name.endsWith('.html') && relative !== '404.html') {
      routes.push(`/${relative.replace(/index\.html$/, '')}`);
    }
  }
  return routes;
}

async function checkResponse(url) {
  const response = await fetch(url);
  assert.equal(response.status, 200, `${url} returned ${response.status}`);
}

async function noOverflow(page, route, viewport) {
  const sizes = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: document.documentElement.clientWidth,
  }));
  assert.ok(sizes.scroll <= sizes.width + 1, `${viewport} overflow at ${route}: ${sizes.scroll} > ${sizes.width}`);
}

async function screenshot(page, filename) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => {
      image.loading = 'eager';
      return image.decode().catch(() => {});
    }));
  });
  await page.screenshot({ path: filename, fullPage: true, animations: 'disabled' });
}

try {
  const routes = await builtRoutes();
  assert.ok(routes.includes('/') && routes.includes('/blog/') && routes.includes('/contact/'), 'Build required before smoke checks');
  if (!process.env.BASE_URL) {
    server = spawn('npm', ['run', 'preview', '--', '--port', '4322'], {
      cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'], detached: true,
    });
    server.stdout.on('data', data => { serverOutput += data; });
    server.stderr.on('data', data => { serverOutput += data; });
    server.on('error', error => { serverOutput += error.message; });
  }
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    if (server && server.exitCode !== null) break;
    await delay(250);
  }
  assert.ok(ready, `Preview did not become ready: ${serverOutput}`);

  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(`${base}/`) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  const internal = new Set(routes.map(route => new URL(route, base).href));
  for (const route of routes) {
    await checkResponse(`${base}${route}`);
    await page.goto(`${base}${route}`);
    await noOverflow(page, route, 'Desktop');
    const urls = await page.locator('a[href], img[src], script[src], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.href || element.src));
    for (const href of urls) {
      if (!href) continue;
      const url = new URL(href, base);
      if (url.origin === new URL(base).origin) { url.hash = ''; internal.add(url.href); }
    }
  }
  for (const url of internal) await checkResponse(url);
  console.log(`PASS: ${routes.length} built routes, ${internal.size} internal URLs and desktop widths`);

  await page.goto(base);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.goto(`${base}/services/`);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.goto(base);
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await screenshot(page, '/tmp/zperformance-dark.png');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  const darkContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const darkPage = await darkContext.newPage();
  await darkPage.goto(base);
  assert.equal(await darkPage.locator('html').getAttribute('data-theme'), 'dark', 'First visit should honour a dark system preference');
  await noOverflow(darkPage, '/', 'Mobile dark');
  await darkContext.close();
  console.log('PASS: light/dark toggle persists across navigation and reload');

  await page.goto(`${base}/blog/`);
  const cards = page.locator('[data-kind]');
  const allCount = await cards.count();
  assert.ok(allCount > 1, 'Blog content must be present');
  for (const kind of ['video', 'article', 'all']) {
    await page.locator(`button[data-filter="${kind}"]`).click();
    const visible = await cards.evaluateAll(elements => elements.filter(element => element.getClientRects().length > 0).map(element => element.dataset.kind));
    assert.ok(visible.length > 0, `${kind} filter has no visible content`);
    if (kind === 'all') assert.equal(visible.length, allCount);
    else assert.ok(visible.every(value => value === kind), `${kind} filter displayed a different content type`);
  }
  assert.equal(await page.locator('iframe').count(), 0, 'No video should load automatically');
  console.log('PASS: blog article/video filters and no automatic video iframe');

  // Exercise the configured player without publishing a guessed video ID or
  // sending a request to YouTube. Only this browser response uses a fixture.
  const videoUrl = `${base}/blog/practical-ai-leadership/`;
  let videoRequests = 0;
  await page.route('https://www.youtube-nocookie.com/embed/**', async route => {
    videoRequests++;
    await route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Video test fixture</title><p>Local fixture</p>' });
  });
  await page.route(videoUrl, async route => {
    const response = await route.fetch();
    const original = await response.text();
    const body = original.replace(/<div class="video-frame"[^>]*>[\s\S]*?<\/div>\s*<\/div>/,
      '<div class="video-frame" data-video-id="abcdefghijk" data-video-title="Smoke fixture video"><button class="button video-load" type="button">Load YouTube video</button></div>');
    assert.notEqual(body, original, 'Expected video placeholder for configured-player fixture');
    await route.fulfill({ response, body });
  });
  await page.goto(videoUrl);
  assert.equal(await page.locator('iframe').count(), 0, 'Configured player must wait for consent');
  assert.equal(videoRequests, 0);
  const embeddedResponse = page.waitForResponse(response => response.url().startsWith('https://www.youtube-nocookie.com/embed/'));
  await page.getByRole('button', { name: 'Load YouTube video' }).click();
  await embeddedResponse;
  assert.equal(videoRequests, 1, 'A single player request should follow the click');
  const frame = page.locator('.video-frame iframe');
  assert.equal(await frame.getAttribute('src'), 'https://www.youtube-nocookie.com/embed/abcdefghijk?autoplay=1');
  assert.equal(await frame.getAttribute('title'), 'Smoke fixture video');
  assert.notEqual(await frame.getAttribute('allowfullscreen'), null);
  await page.unroute(videoUrl);
  console.log('PASS: configured video loads privacy-domain iframe only after click (local fixture)');

  await page.goto(`${base}/contact/`);
  await page.getByLabel('Name', { exact: true }).fill('Website smoke test');
  await page.getByLabel('Work email', { exact: true }).fill('test@example.com');
  await page.getByLabel('Organisation', { exact: true }).fill('Test organisation');
  const interest = page.getByLabel('Interested in', { exact: true });
  const options = await interest.locator('option').evaluateAll(elements => elements.map(element => element.value).filter(Boolean));
  if (options.length) await interest.selectOption(options[0]);
  await page.getByLabel('Your message', { exact: true }).fill('Testing the local unconfigured enquiry form.');
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  assert.match(await page.getByRole('status').innerText(), /not configured/i);
  console.log('PASS: unconfigured contact form reports that delivery is not configured');

  await page.locator('.contact-form').evaluate(form => { form.dataset.contactEmail = 'enquiries@example.com'; });
  const enquiryMessage = 'A plan for AI & automation.\nBudget review: £500 + VAT?';
  await page.getByLabel('Your message', { exact: true }).fill(enquiryMessage);
  await interest.selectOption({ label: 'AI & Automation' });
  await page.getByRole('button', { name: 'Prepare enquiry' }).click();
  const mailLink = page.getByRole('link', { name: 'Open email app' });
  assert.ok(await mailLink.isVisible());
  const mailUrl = new URL(await mailLink.getAttribute('href'));
  assert.equal(mailUrl.protocol, 'mailto:');
  assert.equal(mailUrl.pathname, 'enquiries@example.com');
  assert.equal(mailUrl.searchParams.get('subject'), 'Website enquiry — AI & Automation');
  assert.ok(mailUrl.searchParams.get('body').includes(enquiryMessage), 'Enquiry body should preserve punctuation and line breaks');
  assert.equal(await page.locator('#prepared-message').inputValue(), mailUrl.searchParams.get('body'));
  assert.match(await page.getByRole('status').innerText(), /Nothing has been sent yet/i);
  console.log('PASS: configured contact prepares encoded mailto with complete enquiry; nothing sent');

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(`${base}${route}`);
    await noOverflow(page, route, 'Mobile');
  }
  await page.goto(base);
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  assert.ok(await page.getByRole('navigation', { name: 'Main navigation' }).isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  await screenshot(page, '/tmp/zperformance-mobile.png');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await screenshot(page, '/tmp/zperformance-desktop.png');
  assert.deepEqual(failures, [], 'Browser errors or missing internal assets');
  console.log('PASS: mobile layouts, accessible menu state, no browser errors');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  if (server?.pid) {
    try { process.kill(-server.pid, 'SIGTERM'); } catch { server.kill('SIGTERM'); }
  }
}
