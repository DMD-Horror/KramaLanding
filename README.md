<div align="center">
  <img src="assets/icon.png" width="120" height="120" alt="KramaIsland App Icon" />
  <h1>KramaLanding</h1>
  <p><strong>Official landing page and download site for <a href="https://github.com/Seavik2142/KramaIsland">KramaIsland</a> — a native, 120 fps Dynamic Island for macOS.</strong></p>

  <p>
    <a href="https://dmd-horror.github.io/KramaLanding/"><img src="https://img.shields.io/badge/website-live-0A84FF?style=flat-square" alt="Live Website" /></a>
    <a href="https://github.com/Seavik2142/KramaIsland/releases"><img src="https://img.shields.io/badge/app-v1.4.0-30D158?style=flat-square" alt="KramaIsland v1.4.0" /></a>
    <img src="https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-111827?style=flat-square" alt="Pure HTML CSS JS" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-A855F7?style=flat-square" alt="MIT License" /></a>
  </p>

  <p>
    <a href="https://github.com/Seavik2142/KramaIsland/raw/main/dist/KramaIsland.dmg"><strong>Download KramaIsland.dmg (v1.4.0 · 3.3 MB)</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Seavik2142/KramaIsland">App Source Repo</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Seavik2142/KramaIsland/releases">Releases</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/Seavik2142/KramaIsland/issues">Report an Issue</a>
  </p>
</div>

---

## Overview

**KramaLanding** is a zero-dependency, static showcase and download website built for **[KramaIsland](https://github.com/Seavik2142/KramaIsland)** — a native Swift, SwiftUI, AppKit, and CoreAudio Dynamic Island utility for macOS 13+ on Apple Silicon.

### Highlights

- **Interactive MacBook Pro & External Display Stage** — Switch between 7 live states (*Full Shade*, *Hover Glance*, *Compact Ears*, interactive *CoreAudio Volume HUD*, *AirPods*, *Banner Alert*, and *`⌥ Space` Launcher*), 3 macOS wallpapers, and *MacBook Notch* vs. *External Display* mount modes.
- **Interactive `⌘K` Mini-Launcher** — Lets visitors test live math (`24 * 60`) and unit conversions (`5 km to mi`, `100 f to c`), jump to sections, copy verification commands, or trigger the `.dmg` download right from the keyboard.
- **Custom `Rows × Columns` Snap Grid Configurator** — Interactive `1–4 × 1–4` workspace layout preview with `0 pt`, `6 pt`, and `12 pt` gaps.
- **Trust & Verification Sections** — Stock macOS vs. KramaIsland comparison table, transparent 6-permission Privacy matrix, Gatekeeper launch tabs (*macOS 15+ Sequoia*, *macOS 13–14*, *Terminal*), and verified SHA-256 DMG checksum.
- **Zero Build Step & Accessible** — Pure HTML5, CSS3, and vanilla ES6 with keyboard navigation, visible focus states, and full `prefers-reduced-motion` support.

---

## Project Structure

```text
KramaLanding/
├── index.html          # Main KramaIsland landing page
├── styles.css          # Obsidian OLED design tokens, animations & responsive styles
├── app.js              # Interactive stage, ⌘K launcher, snap grid, lightbox & scroll-spy
├── .nojekyll           # Serves static files directly on GitHub Pages
├── .gitattributes      # Consistent LF line endings & binary PNG handling
├── .gitignore          # Local OS and editor ignores
├── LICENSE             # MIT License
└── assets/             # Native macOS screenshots & app icons
    ├── icon.png
    ├── favicon.png
    ├── shade.png
    ├── hover.png
    ├── compact.png
    ├── activity.png
    ├── banner.png
    └── launcher.png
```

---

## Run Locally

No Node build step or bundler is required. Serve the directory with any static HTTP server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open [http://127.0.0.1:4173/](http://127.0.0.1:4173/) in your browser.

---

## Deploy on GitHub Pages

1. Open repository **Settings ▸ Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.

---

## Author & License

Created and maintained by **Mao Seavik** ([@Seavik2142](https://github.com/Seavik2142)).  
Released under the **MIT License** — see [LICENSE](LICENSE) for full details.
