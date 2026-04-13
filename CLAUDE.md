# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LineMaster 2.4GHz ToolBox is a **static website** (no build system, no bundler, no framework) that serves as the official portal for the LineMaster 2.4GHz RC control-line product line. It is hosted via GitHub Pages at `www.linemaster24ghz.com` (see `CNAME`).

All pages are plain HTML/CSS/JS — no npm, no package.json, no compilation step.

## Running Locally

```bash
py -3 -m http.server 8001
```

Then open `http://localhost:8001`. A local server is required because the firmware updaters and companion tool use browser APIs (Web Serial, ESP Web Tools) that need a secure context.

## Architecture

### CSS System
- **`css/variables.css`** — Single source of truth for all design tokens: brand colors, surfaces, text, borders, radii, shadows, transitions. Uses `--lm-` prefix.
- **`css/global.css`** — Shared component styles: nav, footer, buttons, cards, grids, sections (about, testimonials, team, store, contact), back-to-top, responsive breakpoints.
- Page-specific styles go in `<style>` tags within each HTML file (hero variants, product-specific layouts).

### Page Structure
- **`index.html`** — Home page: hero, product cards grid (linking to product pages), incoming projects, about, testimonials, team, store, contact.
- **`products/`** — Individual product pages:
  - `typhoon.html` — 5-channel handle for Carrier & Scale
  - `zephyr.html` — Single-channel sport handle
  - `lm-x5.html` — 5-channel receiver (includes firmware updater link)
  - `lm-t1.html` — Timer for electric models (includes firmware updater link)
- **`projects/`** — Incoming projects:
  - `pathfinder.html` — 3D flight data visualization (Godot WASM)
  - `companion.html` — Web Serial companion tool (beta)

### Navigation
Global nav with dropdowns: Home | Products (Typhoon, Zephyr, LM-X5, LM-T1) | Projects (Pathfinder, Companion) | Store | Contact. Mobile-responsive hamburger menu.

### Firmware Updaters (standalone tools)
- **`lm-x5-receiver-updater/`** — Browser-based firmware flasher for LM-X5 (ESP32-C3). Uses ESP Web Tools.
- **`lm-t1-timer-updater/`** — Same pattern for LM-T1 timer (ESP32-C3).

Each updater has a `manifest_*.json` that points to the binary in `firmwares/`. When updating firmware versions: update the `.bin` file in `firmwares/`, update the manifest JSON (`version` field and `path`), and update version strings in both the main portal tool card and the product page.

### Companion (`lm-companion/`)
Web Serial-based tool. Standalone `index.html` with its own styles.

### Products (`Products/`)
Product-specific web apps. `Pathfinder/` contains a Godot 4 web export (WASM).

### Static Assets
- `firmwares/` — `.bin` firmware files for ESP32-C3 devices
- `assets/ico/` — Favicons and PWA manifest
- `assets/img/` — Hero, team and general images
- `assets/img/products/` — Product images (one per product page)
- `assets/video/` — Promotional videos

## Key Technical Details

- All hardware targets are **ESP32-C3** chips
- Firmware updaters depend on **ESP Web Tools** from unpkg CDN
- Companion tool uses **Web Serial API** (`navigator.serial`) — Chrome/Edge only
- Pathfinder is a **Godot 4 web export** with WASM + GDExtension
- No JavaScript frameworks — everything is vanilla JS
- Contact form uses `mailto:` links
- Etsy product links: Typhoon (`/listing/4313133678`), Zephyr (`/listing/4313134384`), LM-X5 (`/listing/4313136756`), LM-T1 (`/listing/4426762876`)

## Path Conventions

Product pages are in `products/` and reference shared assets via `../`. Same for `projects/`. The firmware updaters and companion are at the root level.
