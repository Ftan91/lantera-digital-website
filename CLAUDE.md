# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing website for Lantera Digital, a Malaysia-based Data & AI consultancy (three service lines: Data & AI Training, Data Platform Services, AI Offerings). Static site, no backend yet (see Roadmap).

Repo: https://github.com/Ftan91/lantera-digital-website (public). Live at https://lanteradigital.com via GitHub Pages, HTTPS enforced. `lanteradigital.com.my` is meant to redirect to it at the registrar level (not a GitHub concern) — check `gh api repos/Ftan91/lantera-digital-website/pages` and a DNS lookup on `lanteradigital.com.my` if unsure whether that forwarding has actually been set up, it wasn't done as of the last check in this project's history.

## Commands

```
npm install       # install dependencies
npm run dev        # start Eleventy dev server with live reload at http://localhost:8080
npm run build       # build the static site into _site/
```

There is no separate lint/test command yet. `.github/workflows/deploy.yml` builds and deploys on push to `main` (see Deployment below), but there's no lint/test/security CI yet — that's still on the Roadmap.

## Architecture

Built with **Eleventy (11ty)**, using **Nunjucks** templates and **plain, hand-written CSS** — no client-side framework, no CSS build step (no Tailwind/Sass). This is a deliberate choice to keep the project easy to understand end to end; see "Project philosophy" below.

**Content lives in YAML, not in templates.** All copy is in `src/_data/*.yaml`:
- `site.yaml` — company name, nav (including the "Services" dropdown structure) and the `nav_cta` button, footer, contact details (including the WhatsApp number/message), the shared CTA band copy, plus shared wording used by templates: `labels` (small link/field labels), `services_page` (the `/services/` hub copy and the section headings repeated on every service page) and `use_case_page` (headings shared by every use case write up)
- `services.yaml` — a list of the 3 services (slug, name, summary, icon, tone, hero copy, offerings, approach steps, outcomes)
- `home.yaml` — homepage-only copy (hero, differentiators, "how we work" steps)
- `about.yaml` — about page copy, including the `founders` list (name, title, linkedin, photo, bio)
- `technology.yaml` — the technology page's stack list
- `caseStudies.yaml` — case studies page hero copy (no case studies written yet, so the page is just the hero plus the CTA band)
- `useCases.yaml` — the AI use case write ups (proof of concept builds), rendered by `use-case.njk`

Templates only ever reference this data (e.g. `{{ site.name }}`, `{% for service in services %}`) — **never hardcode copy into a `.njk` file.** To change what's on the site, edit the relevant YAML file; you should rarely need to touch a template just to change wording. Eleventy exposes a camelCase data filename as the same camelCase variable, so `caseStudies.yaml` is `caseStudies` in templates.

**Pages:**
- `src/index.njk` — homepage (hero, differentiators, "how we work", CTA — no services grid; services are discovered via the nav dropdown or `/services/`)
- `src/services-index.njk` — `/services/`, a hub page listing all 3 services (reuses `service-card.njk`), the target of the homepage's "Explore Our Services" button
- `src/about.njk`, `src/contact.njk`, `src/technology.njk`, `src/case-studies.njk` — static permalinked pages
- `src/services.njk` — **one template, three pages.** Uses Eleventy pagination over `services.yaml` (`pagination: data: services, size: 1, alias: service`) to generate `/services/training/`, `/services/data-platform/`, `/services/ai-offerings/`. To add a 4th service, add an entry to `services.yaml` — no new template needed.
- `src/_includes/layouts/base.njk` — shared HTML shell (head, nav, footer, the dark mode anti-flash script)
- `src/use-case.njk` — paginates `useCases.yaml` into `/services/ai-offerings/use-cases/<slug>/`; `services.njk` lists them as cards on the AI Offerings page only (the `service.slug == "ai-offerings"` check), in the last section before the CTA band
- `src/_includes/partials/` — `nav.njk`, `footer.njk`, `service-card.njk`, `service-icon.njk`, `logo-mark.njk`, `whatsapp-button.njk` (fixed bottom left on every page, links to `wa.me` using `site.contact`), and `cta-band.njk` (the closing "Let's Talk" band, included at the bottom of most pages)

**Nav dropdown:** `site.yaml`'s `nav` list mixes plain items (`label` + `url`) and dropdown items (`label` + `dropdown: [...]`). `nav.njk` renders a dropdown as a native `<details>`/`<summary>` element — no JS needed for the menu itself. `footer.njk` flattens dropdown children into the footer's link list since a footer has no dropdown affordance.

**Visual style:** modelled on [harvey.ai](https://www.harvey.ai) at the user's request: a warm monochrome palette (ivory `#fafaf9` paper, near black `#0f0e0d` ink, warm greys), large regular weight serif headings (Newsreader, loaded from Google Fonts in `base.njk`, falling back to Georgia) over a system sans body, Title Case headings, small corner radii, hairline dividers, no bright UI accent colour, and no decorative blobs. Visual richness comes from **textured panels** instead (`.textured` plus a `tone-slate`/`tone-velvet`/`tone-bronze`/`tone-ink` class in `styles.css`), a painted, grainy dark surface with ivory text laid over it, like harvey.ai's section cards. The texture is two small hand written SVG noise files, `src/assets/textures/grain.svg` (tiled film grain) and `brush.svg` (soft brush streaks), layered over a flat tone colour and a light to dark sweep; there are no photos or copied artwork. Used on the `.hero` at the top of every page (the homepage adds `.hero-large`), the `/services/` feature cards (`service-card.njk`, one tone per service via `tone:` in `services.yaml`) and the closing CTA band. To tune the look, edit the `feTurbulence`/`feColorMatrix` values in those two SVGs. The amber glow in the logo is the only colour on the page. Buttons are "ink on paper": solid ink in light mode, solid ivory in dark mode. The closing CTA band and the footer are always a dark ink surface (the `--color-inverse-*` tokens), like the black sections that close every harvey.ai page.

**Dark mode:** light (ivory) is the default theme, dark is the opt in override, no `prefers-color-scheme` auto-detection. Light tokens live on bare `:root` in `src/css/styles.css`; dark overrides live under `:root[data-theme="dark"]`. Theme choice is stored in `localStorage` under the key `lantera-theme` and applied via a `data-theme="dark"` attribute on `<html>` (no attribute = light). Two scripts: a tiny inline snippet in `base.njk`'s `<head>` that must stay inline (it runs before the stylesheet paints, otherwise returning dark-mode visitors see a flash of light mode), and `src/js/theme-toggle.js` (passthrough copied to `/js/`) which flips the attribute and stores the choice. The toggle's sun/moon icons are both in `nav.njk` and swapped purely by CSS on `data-theme`, so the right icon shows on first paint.

**CSS conventions:** one `section` per page block, alternating plain and `class="soft"` backgrounds; `.section-heading` for an h2 plus optional intro; `.grid` of `.card`s for lists of items; `.steps` for numbered processes (numbers come from a CSS counter); `.plain-list` for outcome bullets; `.container.narrow` for single column text. Reach for these before adding a new class or an inline `style=""`.

**Cache busting:** Cloudflare (in front of GitHub Pages) caches CSS/JS/images for hours, so `base.njk` appends `?v={{ build.version }}` (from `src/_data/build.js`, a new value every build) to the stylesheet, script and favicon URLs. Without it a deploy can pair new HTML with an old cached stylesheet and break the layout. Keep the `?v=` on any new CSS/JS file linked from the layout.

**YAML data files are not parsed by Eleventy by default.** `.eleventy.js` registers the YAML data extension explicitly via `addDataExtension("yaml", ...)` using `js-yaml`. If YAML data files stop being picked up, check that registration first.

**Assets / logo:** the logo is the user's own artwork (amber flame, "Lantera" in a bold serif, "Digital" in an italic serif). **Always use the artwork as supplied; never retype it in a similar font or redraw it.** The source is the user's `lantera-logo-horizontal-bg.png` (3600x840, on a dark gradient background; not in the repo). From it, the background was removed and two transparent 1072x160 PNGs were exported: `src/assets/logo-dark.png` (original colours, for dark mode and the always dark footer) and `src/assets/logo-light.png` (identical except the text is recoloured to near black and dark sage so it reads on the ivory header in light mode; the flame is untouched). `src/_includes/partials/logo-mark.njk` includes both and CSS shows exactly one (`.logo-on-light`/`.logo-on-dark`). The header size is set by `.logo-mark img { height }`, stepped down in the small screen media queries so the top row never wraps. `src/assets/favicon.png` is the flame cropped from the same artwork. If the user supplies a new logo, regenerate both PNGs and the favicon from their file the same way. `src/assets/founders/finn.jpeg` and `irfan.jpeg` are the founders' real photos; `.founder-photo` in CSS crops any image to the same circular treatment regardless of the source photo's shape. `src/assets/tech/*.svg` (databricks, anthropic, powerbi, microsoft) are each company's real, official colored logo mark, sourced from Wikimedia Commons (public logo files used across Wikipedia for identification purposes; the marks remain trademarks of Databricks/Anthropic/Microsoft respectively) — used only as an informational "technology we work with" display, not implying any formal partnership or certification. `databricks.svg` is a wider icon+wordmark lockup, not square like the other three, so `.tech-logo img` is height-fixed with `width: auto` rather than forcing a square, and the `.tech-logo` chip itself has a fixed white background regardless of site theme so every logo's real colors stay accurate and legible against it. `src/css/styles.css` defines the design tokens (colors, spacing, type) as CSS custom properties at the top of the file — start there when adjusting the visual style.

## Project philosophy

The user has explicitly asked to keep this project **as light and easy to understand as possible** — avoid complexity, prefer built-ins and the smallest well-known tool over a framework, even where a more "capable" option exists. When adding anything new, default to the option with fewer moving parts.

**Before making a visual design or content-structure decision** (a new page layout, a hero treatment, section rhythm, how to show a list of things), check how these 5 reference consultancy sites handle the equivalent thing, rather than designing from generic first principles: [aimpointdigital.com](https://www.aimpointdigital.com), [colibridigital.io](https://www.colibridigital.io), [vivanti.com](https://www.vivanti.com), [dufrain.co.uk](https://www.dufrain.co.uk), [datapao.com](https://datapao.com). The user gave these as the explicit design reference for this site and has asked for them to always be consulted, not just once at the start. Since then the user has also made [harvey.ai](https://www.harvey.ai) the benchmark for the overall visual style and the professionalism of the wording (see "Visual style" above), so keep new work consistent with that look and use the 5 sites for layout and content-structure ideas within it.

This project is also being used to deliberately learn Claude Code's tooling (CLAUDE.md, subagents, skills, MCP, hooks, etc.), but only where a mechanism earns its place — not for its own sake. Current state: **CLAUDE.md is the only Claude Code mechanism in use.** No MCP servers, custom subagents, skills, or hooks are configured, because nothing in this static-site foundation needs them. This section will be updated honestly as later phases (see Roadmap) add something real — e.g. the CI/CD phase is expected to add the official Claude Code GitHub Action for automated PR review, which will be documented here once it exists.

## Content guidelines

No fabricated client names, logos, or testimonials — leave those sections out entirely rather than filling them with placeholder claims that could be mistaken for real ones.

**Tone:** professional, concise, and confident, benchmarked against harvey.ai's copy: short declarative sentences, Title Case for headings, card titles and button labels, British spelling (organisations, modernise), no slang or Manglish, no jokes, and no emoji. Stay specific and candid rather than salesy (the "we will tell you when AI is the wrong tool" positioning is still core to the brand). Avoid the AI-writing tells: no em dashes or en dashes, no "it's not X, it's Y" contrast framing, no hyphens used as punctuation (rephrase instead, e.g. "start to finish" not "end-to-end"). Hyphens are still fine inside real identifiers (URL slugs, file names). Never invent stats, client logos, or testimonials to imitate harvey.ai's social proof sections.

## Deployment

**Live at https://lanteradigital.com.** `.github/workflows/deploy.yml` builds the site with `npm run build` and deploys `_site/` to GitHub Pages via the official `actions/upload-pages-artifact` + `actions/deploy-pages` actions, on every push to `main` (also runnable manually via `workflow_dispatch`). `src/CNAME` (passthrough copied to `_site/CNAME`) holds the custom domain, `lanteradigital.com`. GitHub Pages is enabled with source `workflow`; custom domain and HTTPS enforcement are also set via the Pages API/settings, not in this repo's files.

**Two-domain setup:** `lanteradigital.com` is canonical and is what GitHub Pages actually serves. DNS for it: four `A` records at the apex pointing at GitHub's Pages IPs (185.199.108.153, .109.153, .110.153, .111.153), plus a `www` `CNAME` to `ftan91.github.io`. `lanteradigital.com.my` is not a GitHub concern at all, it's a registrar-level redirect (domain forwarding) straight to `https://lanteradigital.com`, configured at that domain's registrar, not here.

**Repo/Pages status can be checked directly** without opening a browser: `gh api repos/Ftan91/lantera-digital-website/pages --jq '{cname, https_enforced, cert_state: .https_certificate.state}'` shows whether the custom domain and HTTPS are live; `node -e 'require("dns").promises.resolve4("lanteradigital.com").then(console.log)'` checks DNS resolution independent of GitHub. If `https_enforced` is `false` but DNS is already correct, it's normal, GitHub still needs to verify DNS and issue the Let's Encrypt certificate (minutes to about a day for a freshly pointed domain); once `https_certificate.state` is `"approved"`, flip it on with `gh api repos/Ftan91/lantera-digital-website/pages -X PUT -F https_enforced=true` (note `-F` not `-f`, the field is a boolean). A "server cannot be found" error on one specific device after that point is DNS propagation lag on that device's resolver (carrier/WiFi), not a site problem, ask them to try a different network or wait.

## Roadmap (not built yet)

- **Analytics backend:** Express + `better-sqlite3` (single-file DB), a JS tracking snippet for page views/time-on-page/clicks, `/api/track` endpoint, minimal `/dashboard` page. IP geolocation deferred until there's a real deployment.
- **CI/CD (GitHub Actions):** lint (ESLint + a small YAML-parses-cleanly check script), unit tests (Node's built-in `node:test`), an integration smoke test against the built site + API, `npm audit` + Dependabot, and the official Claude Code GitHub Action for automated PR review. (The deploy workflow above covers the build/deploy step only, not lint/test/security yet.)
