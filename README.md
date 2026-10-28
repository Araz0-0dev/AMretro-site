# AMretro website

A self-contained Persian introduction and download page for AMretro, built for GitHub Pages. The download buttons point to official release assets from the public [AMretro repository](https://github.com/Araz0-0dev/AMretro/releases). New candidate/beta builds are clearly labelled separately from the previous release. The page checks the latest release when possible and retains verified direct fallback links when GitHub's API is unavailable.

## Update the page

Edit `src/index.template.html`, the files in `assets/`, or `site-config.json`, then run:

```sh
python3 scripts/build.py
```

Commit the generated `index.html` along with the source. Set `telegram_username` to the creator's actual username (without `@`) when provided; an empty value shows a clear placeholder and never invents a Telegram address.

The hero artwork is AI-generated illustrative imagery and is not a screenshot. The Vazirmatn font is distributed under [SIL Open Font License](assets/OFL-Vazirmatn.txt). No games, ROMs or BIOS files are provided by this website.

## Test

Run `npm ci` and install a Playwright Chromium browser (`npx playwright install chromium`). Serve the directory with `python3 -m http.server 4173`, then run `npm test`. Set `CHROMIUM` to a system Chromium executable if preferred. Tests check responsive overflow, the mobile menu, configured/empty support, release API fallback and live-link updates.
