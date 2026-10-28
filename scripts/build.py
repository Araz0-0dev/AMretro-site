#!/usr/bin/env python3
"""Build a self-contained GitHub Pages page; no network is needed to view it."""
import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
config = json.loads((ROOT / 'site-config.json').read_text(encoding='utf-8'))
username = str(config.get('telegram_username', '')).strip().removeprefix('@')
if username and not re.fullmatch(r'[A-Za-z][A-Za-z0-9_]{4,31}', username):
    raise SystemExit('Invalid Telegram username; use letters, digits and underscores, 5–32 characters.')
source = (ROOT / 'src/index.template.html').read_text(encoding='utf-8')
assets = {
    '__FONT_BASE64__': base64.b64encode((ROOT / 'assets/Vazirmatn-VF.woff2').read_bytes()).decode(),
    '__HERO_BASE64__': base64.b64encode((ROOT / 'assets/hero.webp').read_bytes()).decode(),
    '__TELEGRAM_CONFIG__': json.dumps(username, ensure_ascii=True),
}
for marker, value in assets.items():
    if source.count(marker) != 1:
        raise SystemExit(f'Expected exactly one occurrence of {marker}')
    source = source.replace(marker, value)
(ROOT / 'index.html').write_text(source, encoding='utf-8')
print('Built index.html:', len(source.encode()), 'bytes')
