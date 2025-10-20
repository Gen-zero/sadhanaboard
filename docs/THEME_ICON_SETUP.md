# Theme Icon Setup and Troubleshooting

This document explains how theme icons are managed in the repository, how to sync them into theme asset folders, and how to troubleshoot common problems.

Why we copy icons
- We keep a canonical `icons/` folder in the repo root that contains master source files for icons, animations, and media used by themes.
- The `src/themes/<themeId>/assets` folders are the runtime asset locations. Copying keeps the theme folders lightweight and allows theme authors to augment assets locally.

Scripts involved
- `scripts/generate-theme-manifest.js` — builds a manifest describing themes and their configured assets.
- `scripts/copy-theme-icons.cjs` — copies the curated files from `icons/` into `src/themes/<themeId>/assets`.
- npm scripts:
  - `npm run dev:setup` — runs `themes:generate`, `themes:copy-icons`, and `assets:move`.
  - `npm run themes:copy-icons` — runs the copy script. Supports flags:
    - `--dry-run` or `--dryrun` — show what would be copied, no filesystem changes.
    - `--force` — overwrite destination files regardless of timestamps.

How to run locally
1. Ensure dependencies are installed:

```powershell
npm install
```

2. Sync icons into themes (recommended once after cloning or when new icons are added):

```powershell
npm run dev:setup
```

3. During normal development, start the dev server:

```powershell
npm run dev
```

CLI options and examples
- Dry run (see changes without applying):

```powershell
npm run themes:copy-icons -- --dry-run
```

- Force overwrite:

```powershell
npm run themes:copy-icons -- --force
```

Understanding the mapping
- The copy script includes a mapping object that maps `themeId` to an array of filenames expected in the repository `icons/` folder.
- If a mapping entry is empty, the script still creates the `assets` folder so authors can add assets later.

Troubleshooting
- "Icons missing in UI":
  - Confirm the icons exist in the `icons/` root directory with exact filenames.
  - Run `npm run themes:copy-icons -- --dry-run` to see if the script would pick them up.
  - If the script reports "Missing:", add the missing file to `icons/` or update the mapping in `scripts/copy-theme-icons.cjs`.

- "Files look stale or not updated":
  - Run with `--force` to overwrite.
  - Confirm that your local `src/themes/<themeId>/assets` is not ignored by git or locked by another process.

- "Build fails due to missing assets":
  - Ensure `npm run build` runs `themes:copy-icons` as part of the pipeline (the project's `package.json` includes this in `build` and `postinstall`).
  - If CI fails, ensure the CI step runs `npm ci` then `npm run build` (CI may need to run `npm run dev:setup` if the environment is expanded differently).

Advanced notes
- The copy script is intentionally idempotent and conservative by default. It will not overwrite newer destination files unless `--force` is given. This prevents accidental loss of local theme edits.
- The README includes quick commands for common workflows. Please read it if you're new to the project.

If you still have trouble after following this guide, open an issue with the output of the copy script (run in dry-run mode to capture the diagnostics). Include platform and Node version details.

## Common Build Warnings

You may see two informational messages during `npm run dev` or `npm run build` that are expected and safe to ignore in most development scenarios:

- `Note: Theme '<themeName>' contains non-serializable fields (React components/imports), using fallback parser`
  - Cause: Theme definitions often include runtime-only fields such as React icon components (e.g. `Sparkles`, `Skull`) or variables that reference imported paths. These cannot be serialized to JSON for a backend manifest.
  - Action: None required. The manifest generator filters out runtime-only fields (like `icon`) and includes only serializable metadata (`id`, `name`, `description`, `deity`, `category`, `isLandingPage`, `landingPagePath`, `gradient`). The frontend remains the source of truth for icon components.

- `Source file not found (may have been moved previously): icons/Mahakali yantra.png` (followed by `Created placeholder at public/icons/mahakali-yantra.png`)
  - Cause: The repository's canonical `icons/` file may have been moved previously or processed by another script. To avoid runtime errors when a missing file would otherwise break the app, the `move-assets.js` script creates a tiny placeholder image so the build can proceed.
  - Action: None required for normal development. If you expect to see the real high-resolution `Mahakali yantra.png`, add it to the `icons/` folder; otherwise the placeholder is safe for local dev and CI.

### Understanding the difference between warnings and errors

- Warnings like the two above are informational: they indicate that the build system applied a fallback behavior to ensure the development server and builds run reliably.
- Errors that should stop the build are still surfaced (uncaught exceptions, real missing required files, or failed TypeScript compilation). If `npm run build` fails with a non-zero exit code and you see other errors, address those directly.

If you'd like strict behavior (fail-fast) during CI, run the setup scripts separately in CI and check their exit codes. The local `npm run dev` command is intentionally tolerant to provide a smooth developer experience.