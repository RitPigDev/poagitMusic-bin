# poagitMusic 2.6.0 — macOS app

This wraps your `poagitMusic.html` in Electron so it runs as a native app
window on macOS Monterey, with no browser chrome.

## What changed vs. the browser version

Good news — poagitMusic already did almost everything the "OS native" way:

- **File picking** (`Add to Library`) uses a real `<input type="file">`.
  Inside Electron this opens the actual macOS Open panel — same as any
  native Mac app — no code changes needed.
- **Drag & drop** uses the standard HTML5 drag/drop API, which Electron
  also passes straight through to the OS.
- **Library storage** (IndexedDB + localStorage) works unmodified in
  Electron's renderer, so your saved tracks/playlists carry over.

What I added to make it feel like a real Mac app:

- `main.js` — creates the app window, sets `titleBarStyle: 'hiddenInset'`
  so you get native traffic-light buttons that sit nicely on top of the
  glass UI, and builds a real macOS menu bar (File ▸ Add to Library…,
  Edit, View, Window, plus the standard app menu with About/Hide/Quit).
- `preload.js` — runs with `contextIsolation` + `sandbox` on; it
  intentionally exposes nothing extra to the page, since the app doesn't
  need any Node/OS APIs beyond what Chromium already gives it.
- Any link the page tries to open in a new window/tab is redirected to
  your default browser via `shell.openExternal`, instead of opening inside
  the app.
- Bumped the version string to **2.6.0** everywhere it appears (title bar,
  sidebar "About" line, status bar, window title).

## Run it

You'll need [Node.js](https://nodejs.org) installed (18+ recommended).

```bash
cd poagitMusic-electron
npm install
npm start
```

That launches the app in a window immediately — no build step needed for
day-to-day use.

## Build a native app for macOS and/or Windows

```bash
npm install

# Build both, if your platform supports it:
npm run dist

# Or one at a time:
npm run dist:mac     # → dist/*.dmg, *.zip  (Intel + Apple Silicon)
npm run dist:win     # → dist/*.exe (NSIS installer), *.zip (x64)
```

**Important — cross-platform building caveats:**

- **Building the Mac app must be done on a Mac.** `electron-builder` can't
  produce a signed/notarized `.app`/`.dmg` from Windows or Linux — Apple's
  codesigning tools only exist on macOS. Run `npm run dist:mac` on your
  Monterey machine.
- **Building the Windows app can be done from macOS.** `electron-builder`
  bundles the NSIS installer tooling itself, so `npm run dist:win` works
  fine on your Mac — no separate Windows machine needed. (It can't build
  in the other direction: a Windows machine can't produce the Mac build.)
- If you genuinely need both a Mac build *and* the most correctly-signed
  Windows build in one CI pipeline, most people use GitHub Actions with a
  `macos-latest` runner for the Mac job and a `windows-latest` (or the
  same mac runner via Wine, which `electron-builder` also supports) for
  the Windows job. For just building locally on your Mac, you don't need
  any of that — both commands above work directly.

**Output locations:**
- macOS: `dist/poagitMusic-2.6.0.dmg`, `dist/poagitMusic-2.6.0-mac.zip` (and `-arm64` variants)
- Windows: `dist/poagitMusic Setup 2.6.0.exe`, `dist/poagitMusic-2.6.0-win.zip`

**Signing notes:**
- Mac: without an Apple Developer ID certificate, the app is unsigned.
  Gatekeeper will block it on first launch — right-click the app ▸ Open ▸
  Open once to allow it. (`hardenedRuntime` is on in the config so it's
  ready to sign/notarize later if you get a certificate.)
- Windows: without a code-signing certificate, Windows SmartScreen will
  show an "unknown publisher" warning on first run — click "More info" ▸
  "Run anyway." This is normal for unsigned installers and doesn't affect
  functionality.

If you just want to try a build without producing an installer, use
`npm run dist:dir` — it drops an unpacked app directly in `dist/` for
whichever platform you're running it on, no installer/signing step at all.

## Files

```
poagitMusic-electron/
├── index.html     ← your app (version bumped to 2.6.0)
├── main.js         ← Electron main process / window / menu
├── preload.js      ← intentionally minimal preload
├── package.json    ← electron + electron-builder config
└── README.md
```
