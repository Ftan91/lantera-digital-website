# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing website for Lantera Digital, a Malaysia-based Data & AI consultancy (three service lines: Data & AI Training, Data Platform Services, AI Offerings). Static site only for now — no backend yet, no DNS registered, developed and verified on localhost.

Repo: https://github.com/Ftan91/lantera-digital-website (public). Live at https://lanteradigital.com via GitHub Pages; lanteradigital.com.my redirects to it at the registrar level (not a GitHub concern).

## Commands

```
npm install       # install dependencies
npm run dev        # start Eleventy dev server with live reload at http://localhost:8080
npm run build       # build the static site into _site/
```

There is no separate lint/test command yet — this is a plain static site with no backend or CI pipeline in place (see Roadmap below).

## Architecture

Built with **Eleventy (11ty)**, using **Nunjucks** templates and **plain, hand-written CSS** — no client-side framework, no CSS build step (no Tailwind/Sass). This is a deliberate choice to keep the project easy to understand end to end; see "Project philosophy" below.

**Content lives in YAML, not in templates.** All copy is in `src/_data/*.yaml`:
- `site.yaml` — company name, nav (including the "Our Services" dropdown structure), footer, contact details, the shared CTA band copy
- `services.yaml` — a list of the 3 services (id, slug, name, summary, hero copy, offerings, approach steps, outcomes)
- `home.yaml` — homepage-only copy (hero, differentiators, "how we work" steps)
- `about.yaml` — about page copy, including the `founders` list (name, title, linkedin, photo, bio)
- `technology.yaml` — the technology page's stack list
- `caseStudies.yaml` — case studies page copy (currently a placeholder, no case studies written yet)

Templates only ever reference this data (e.g. `{{ site.name }}`, `{% for service in services %}`) — **never hardcode copy into a `.njk` file.** To change what's on the site, edit the relevant YAML file; you should rarely need to touch a template just to change wording. Eleventy exposes a camelCase data filename as the same camelCase variable, so `caseStudies.yaml` is `caseStudies` in templates.

**Pages:**
- `src/index.njk` — homepage (hero, differentiators, "how we work", CTA — no services grid; services are discovered via the nav dropdown or `/services/`)
- `src/services-index.njk` — `/services/`, a hub page listing all 3 services (reuses `service-card.njk`), the target of the homepage's "See our services" button
- `src/about.njk`, `src/contact.njk`, `src/technology.njk`, `src/case-studies.njk` — static permalinked pages
- `src/services.njk` — **one template, three pages.** Uses Eleventy pagination over `services.yaml` (`pagination: data: services, size: 1, alias: service`) to generate `/services/training/`, `/services/data-platform/`, `/services/ai-offerings/`. To add a 4th service, add an entry to `services.yaml` — no new template needed.
- `src/_includes/layouts/base.njk` — shared HTML shell (head, nav, footer, the dark mode anti-flash script)
- `src/_includes/partials/` — `nav.njk`, `footer.njk`, `service-card.njk`

**Nav dropdown:** `site.yaml`'s `nav` list mixes plain items (`label` + `url`) and dropdown items (`label` + `dropdown: [...]`). `nav.njk` renders a dropdown as a native `<details>`/`<summary>` element — no JS needed for the menu itself. `footer.njk` flattens dropdown children into the footer's link list since a footer has no dropdown affordance.

**Dark mode:** dark is the default theme, light is the opt in override, no `prefers-color-scheme` auto-detection — every visitor sees dark mode until they click the toggle. Dark tokens live on bare `:root` in `src/css/styles.css`; light overrides live under `:root[data-theme="light"]`. Theme choice is stored in `localStorage` under the key `lantera-theme` and applied via a `data-theme="light"` attribute on `<html>` (no attribute = dark). Two scripts: a tiny inline snippet in `base.njk`'s `<head>` that must stay inline (it runs before the stylesheet paints, otherwise returning light-mode visitors see a flash of dark mode), and `src/js/theme-toggle.js` (passthrough copied to `/js/`) which wires up the toggle button's click handler. Two tokens are deliberately theme-invariant: `--color-ink` (text-on-amber only, e.g. button labels) and the CTA band's background (hardcoded `#123047`, not a token) — both sit on brand-amber or brand-navy surfaces that don't change between themes.

**YAML data files are not parsed by Eleventy by default.** `.eleventy.js` registers the YAML data extension explicitly via `addDataExtension("yaml", ...)` using `js-yaml`. If YAML data files stop being picked up, check that registration first.

**Assets:** `src/assets/logo.svg` (full lockup) and `favicon.svg` (icon-only mark) are hand-built SVGs — a faceted lantern glyph with a warm gradient "glow", paired with a navy/amber wordmark. `src/assets/founders/finn.jpeg` and `irfan.jpeg` are the founders' real photos; `.founder-photo` in CSS crops any image to the same circular treatment regardless of the source photo's shape. `src/css/styles.css` defines the design tokens (colors, spacing, type) as CSS custom properties at the top of the file — start there when adjusting the visual style.

## Project philosophy

The user has explicitly asked to keep this project **as light and easy to understand as possible** — avoid complexity, prefer built-ins and the smallest well-known tool over a framework, even where a more "capable" option exists. When adding anything new, default to the option with fewer moving parts.

**Before making a visual design or content-structure decision** (a new page layout, a hero treatment, section rhythm, how to show a list of things), check how these 5 reference consultancy sites handle the equivalent thing, rather than designing from generic first principles: [aimpointdigital.com](https://www.aimpointdigital.com), [colibridigital.io](https://www.colibridigital.io), [vivanti.com](https://www.vivanti.com), [dufrain.co.uk](https://www.dufrain.co.uk), [datapao.com](https://datapao.com). The user gave these as the explicit design reference for this site and has asked for them to always be consulted, not just once at the start.

This project is also being used to deliberately learn Claude Code's tooling (CLAUDE.md, subagents, skills, MCP, hooks, etc.), but only where a mechanism earns its place — not for its own sake. Current state: **CLAUDE.md is the only Claude Code mechanism in use.** No MCP servers, custom subagents, skills, or hooks are configured, because nothing in this static-site foundation needs them. This section will be updated honestly as later phases (see Roadmap) add something real — e.g. the CI/CD phase is expected to add the official Claude Code GitHub Action for automated PR review, which will be documented here once it exists.

## Content guidelines

No fabricated client names, logos, or testimonials — leave those sections out entirely rather than filling them with placeholder claims that could be mistaken for real ones.

**Tone:** informal, warm, and lightly Malaysian (Manglish touches like "lah" are fine in small doses), not corporate boilerplate. Avoid the AI-writing tells: no em dashes or en dashes, no "it's not X, it's Y" contrast framing, no hyphens used as punctuation (rephrase instead, e.g. "start to finish" not "end-to-end"). Hyphens are still fine inside real identifiers (URL slugs, file names). Write like a person who actually works here, not like a brochure.

## Deployment

`.github/workflows/deploy.yml` builds the site with `npm run build` and deploys `_site/` to GitHub Pages via the official `actions/upload-pages-artifact` + `actions/deploy-pages` actions, on every push to `main` (also runnable manually via `workflow_dispatch`). `src/CNAME` (passthrough copied to `_site/CNAME`) holds the custom domain, `lanteradigital.com`. GitHub Pages is enabled with source `workflow` in the repo's Pages settings, and the custom domain plus HTTPS enforcement are set there too.

**Two-domain setup:** `lanteradigital.com` is canonical and is what GitHub Pages actually serves (A records pointing at GitHub's Pages IPs). `lanteradigital.com.my` is not a GitHub concern at all, it's set up as a registrar-level redirect (domain forwarding) straight to `https://lanteradigital.com`, so both domains land visitors on the same canonical site.

## Roadmap (not built yet)

- **Analytics backend:** Express + `better-sqlite3` (single-file DB), a JS tracking snippet for page views/time-on-page/clicks, `/api/track` endpoint, minimal `/dashboard` page. IP geolocation deferred until there's a real deployment.
- **CI/CD (GitHub Actions):** lint (ESLint + a small YAML-parses-cleanly check script), unit tests (Node's built-in `node:test`), an integration smoke test against the built site + API, `npm audit` + Dependabot, and the official Claude Code GitHub Action for automated PR review. (The deploy workflow above covers the build/deploy step only, not lint/test/security yet.)
