# macOS 11 Build Notes

This fork contains temporary changes used to build and diagnose CC Switch on macOS 11.

## Current purpose

- Build an unsigned Intel macOS app with `LSMinimumSystemVersion=11.0`.
- Keep the renderer compatible with macOS 11/Safari 15.2 WebKit.

## Changes made

- `src-tauri/tauri.conf.json`
  - Changed `bundle.macOS.minimumSystemVersion` from `12.0` to `11.0`.
- `.github/workflows/build-macos11-unsigned.yml`
  - Added a manual GitHub Actions build for unsigned Intel macOS app bundles.
  - Uses `npm install -g pnpm@10.12.3` because `pnpm/action-setup@v6` fails on Intel macOS runner due to the `@pnpm/exe` darwin-x64 issue.
- `vite.config.ts`
  - Added `build.target: ["safari14", "es2020"]` and `cssTarget: "safari14"` for older macOS WebKit compatibility.
- `src/debug-boot.js` and its `src/index.html` loader
  - Added temporarily to capture renderer boot errors.
  - Removed after confirming the app renders normally.

## Remove before a formal/non-diagnostic package

- Rebuild the app and verify there is no diagnostic overlay.
- Decide whether to keep the GitHub Actions workflow:
  - Keep it if continuing to publish a personal unsigned macOS 11 build.
  - Remove it if preparing a clean upstream-style branch.
- Decide whether to keep `vite.config.ts` Safari 14 target:
  - Keep it if macOS 11 support is desired.
  - Remove it only if dropping macOS 11 compatibility.

## Local environment changes already reverted

The following debug-related preferences were attempted during investigation and then reverted:

- `defaults delete com.apple.Safari IncludeDevelopMenu`
- `defaults delete ~/Library/Containers/com.apple.Safari/Data/Library/Preferences/com.apple.Safari.plist IncludeDevelopMenu`
- `defaults delete ~/Library/Preferences/com.apple.Safari.plist IncludeDevelopMenu`
- `defaults delete com.ccswitch.desktop WebKitDeveloperExtras`
- `defaults delete -g WebKitDeveloperExtras`

One Safari plist delete may report `Domain ... not found`; that means there was no value to remove at that path.
