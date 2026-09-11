# Lantera Digital Website

The marketing website for Lantera Digital, a Malaysian data and AI consultancy. Three service lines: Data & AI Training, Data Platform Services, and AI Offerings.

Static site, built with [Eleventy (11ty)](https://www.11ty.dev/), plain HTML/CSS/JS, no client side framework. All page content lives in YAML data files, not in the templates, so copy can be edited without touching any code.

## Getting started

```
npm install
npm run dev
```

Then open `http://localhost:8080`. The dev server hot reloads on any change, including edits to the YAML content files.

```
npm run build
```

builds the static site into `_site/`.

## Editing content

Everything you see on the site (nav labels, headings, body copy, service details, founder bios, and so on) comes from the YAML files in `src/_data/`:

| File | Controls |
|---|---|
| `site.yaml` | Company name, nav (including the Our Services dropdown), footer, contact info, shared CTA copy |
| `home.yaml` | Homepage hero, differentiators, "how we work" steps |
| `services.yaml` | The 3 services, one entry each, drives both the services hub and each service's detail page |
| `about.yaml` | About page copy, mission, principles, and the founders list |
| `technology.yaml` | The Technology page's stack list |
| `caseStudies.yaml` | Case Studies page copy (placeholder, no case studies written yet) |

Edit a value, save, and the dev server updates the page immediately. Adding a 4th service, for example, only means adding an entry to `services.yaml`, no new template required.

## Project structure

```
src/
  _data/        YAML content (see table above)
  _includes/    Shared layout and partials (nav, footer, service card/icon)
  css/          Design tokens and all styling, plain CSS, no build step
  assets/       Logo, favicon, founder photos
  js/           Dark mode toggle script
  *.njk         Page templates
```

## Status

Static foundation only right now, no backend, no DNS registered yet. See `CLAUDE.md` for the fuller architecture notes and the roadmap (analytics backend, CI/CD).

This project is also being used as a hands on way to learn Claude Code's tooling (CLAUDE.md, agents, skills, and so on) alongside building the actual site.
