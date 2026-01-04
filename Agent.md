# Plan

## Goal
Build a simple English-learning website (GitHub Pages) that shows Japanese sentences and reveals English translations on click. Start with *The Big Bang Theory* only, but structure content and UI to support adding other dramas later.
Content is managed via per-episode YAML files, and deployment happens on pushes to `main`.

## Scope
- Static site only (no sign-in, no backend).
- UI: Drama selector (initially only *The Big Bang Theory*), Season/Episode selector, list of issues (prompts) showing Japanese first, click to reveal English.
- Content: YAML per episode, one episode per file, organized by drama for future expansion under `public/data/episodes/`.
- Hosting: GitHub Pages from `gh-pages` branch.
- Automation: GitHub Actions workflow to build/deploy on `main`.

## Deliverables
1. Static site scaffold (HTML/CSS/JS).
2. YAML content format and loader (drama-aware).
3. Drama + Season/Episode selector and issue list UI.
4. Deployment pipeline (`main` -> `gh-pages`).
5. Example episode YAML files for *The Big Bang Theory*.

## Milestones
1. **Project scaffold**
   - Choose structure for site assets (e.g., `public/`, `data/`).
   - Establish basic HTML shell and styling baseline.

2. **Content model**
   - Define YAML schema: include drama metadata, show season/episode/title, and list of items (`jp`, `en`).
   - Provide sample YAML files for a few *The Big Bang Theory* episodes.

3. **UI + behavior**
   - Implement Drama + Season/Episode selectors from data index.
   - Render issues list, with Japanese visible and English hidden.
   - Toggle English on click.

4. **Build pipeline (if needed)**
   - If YAML needs to be precompiled to JSON, add a build step.
   - Otherwise load YAML directly in-browser (via JS + YAML parser).

5. **Deployment**
   - Add GitHub Actions workflow to publish to `gh-pages` on push to `main`.

## Decisions / Open Questions
- **Static build vs. runtime YAML parsing**: decide whether to bundle data at build time or parse YAML client-side.
- **Index file**: auto-generate or maintain a `episodes.json` for fast listing (drama-aware).
- **Source of truth**: YAML files stored in repo under `public/data/episodes/<drama>/`.

## References
- Similar project: `/Users/akira.noda/dev/personal/time-track`
