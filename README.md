# Z Performance Systems

A responsive consultancy website for **zperformance.co.uk**, built with Astro and TypeScript. Astro generates static HTML, CSS and small client-side scripts, so the site can run on Cloudflare Pages without an adapter, server, database or API keys.

## Develop

Use Node.js **24**, matching `.nvmrc`. Astro 7 requires at least Node 22.23.4; Node 24 is the recommended version for this project. Check with `node --version`; `.nvmrc` does not switch Node automatically in Windows PowerShell.

```sh
npm ci
npm run dev
```

These npm commands work in Windows PowerShell, Command Prompt, macOS and Linux. Once the server starts, open the address printed in the terminal.

Run these commands from the repository root. `npm run check` checks Astro and TypeScript; `npm run build` creates the production site in `dist/`; `npm run preview` serves that output locally.

For the managed development server, `npm run dev:status` checks its state, `npm run dev:logs` shows its logs and `npm run dev:stop` stops it. The npm commands use `cross-env` to disable Astro telemetry on every supported platform, including cloud environments with a read-only home directory.

The site includes services, an approach page, about and contact pages, individual case studies, and an Insights index with article/video filters. The theme toggle supports light and dark modes, follows the system preference on first visit and remembers the visitor’s choice.

## Content and contact details

- `src/data/site.ts`: site identity, canonical URL, public contact email and optional YouTube channel. `contactEmail` and `youtubeChannel` start empty because these details have not been supplied. Set them before launch.
- `src/data/content.ts`: service descriptions, case studies and blog posts. Case studies are explicitly illustrative scenarios, not claims about client engagements. Articles are editorial drafts for review.
- A video post accepts an optional `youtubeId`. Supply an approved YouTube video ID to enable its player. The sample video has no attached recording. Players should load only after the visitor chooses to watch.
- The contact form prepares an enquiry using the configured email address; it is not a backend submission service. With no contact email configured, it explains that delivery is not configured. Confirm the public address and test your mail application before launch. Add a separate form service or Cloudflare Worker if server-side delivery is required.
- Review the privacy page, business details and all draft copy before publication. Automated AI article generation is not connected; add reviewed articles to the content data.

Images are stored locally in `public/images/`. The architecture and landscape visuals were generated for this project. See [ASSETS.md](ASSETS.md) for provenance; font licence files are included in `public/fonts/`.

## Browser checks

The browser smoke harness currently runs in Linux/cloud environments. The development, build and preview npm scripts also support Windows.

After building, install the test browser once and run the smoke checks:

```sh
npx playwright install chromium
npm run build
npm test
```

The smoke script launches the production preview on port 4322 and stops it afterwards. To test an already running local server, set `BASE_URL` instead. It checks built routes, internal links and assets, mobile/desktop layout, persistent themes, the mobile menu and blog filters. Browser-only fixtures exercise a configured video player and contact email, without sending messages or making a real YouTube request. It also checks the default unconfigured contact state and saves screenshots under `/tmp/`.

If Chromium is already installed, use `CHROMIUM_PATH=/usr/bin/chromium npm test` instead of downloading a browser. The script also captures a dark-theme screenshot and checks that a first-time mobile visitor’s system theme is respected.

## Cloudflare Pages

1. Connect this GitHub repository to a Cloudflare Pages project and select the branch you want to publish.
2. Set the build command to `npm run build` and the output directory to `dist`. Use the repository root as the build root. Set `NODE_VERSION` to `24`.
3. Deploy, then add `zperformance.co.uk` under the project’s custom domains and follow Cloudflare’s DNS instructions. Add `www.zperformance.co.uk` if needed and configure your preferred redirect.
4. Check the deployed domain, HTTPS, canonical URLs, contact details, mobile navigation and both themes.

No Cloudflare deployment, account changes or DNS changes have been performed by creating this project. No runtime secrets are required for the current static site.
