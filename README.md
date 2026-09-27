# Lantera Digital Website

Live at [lanteradigital.com](https://lanteradigital.com).

The marketing website for Lantera Digital, a Malaysian data and AI consultancy. Built with [Eleventy](https://www.11ty.dev/) and plain HTML/CSS, no client side framework. All copy lives in YAML files, so wording can be changed without touching templates.

## Getting started

```
npm install
npm run dev     # http://localhost:8080, live reloads on any change
npm run build   # static site into _site/
```

## Editing content

Edit the YAML files in `src/_data/`:

| File | Controls |
|---|---|
| `site.yaml` | Nav, footer, contact details, the closing call to action, shared headings and labels |
| `home.yaml` | Homepage |
| `services.yaml` | The 3 services; each entry becomes a page under `/services/` |
| `useCases.yaml` | AI use case write ups under `/services/ai-offerings/use-cases/` |
| `about.yaml` | About page, including founder bios |
| `technology.yaml` | Technology page |
| `caseStudies.yaml` | Case Studies page |

Adding a service or a use case is just a new entry in the relevant file.

## Structure

```
src/
  _data/        YAML content (above)
  _includes/    Page layout and partials (nav, footer, cards, CTA band)
  css/          All styling; design tokens at the top of styles.css
  assets/       Logo, favicon, founder photos, tech logos, background textures
  js/           Theme toggle
  *.njk         Page templates
```

## Deployment

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

See `CLAUDE.md` for architecture details, design and tone rules, domain setup, and the roadmap.
