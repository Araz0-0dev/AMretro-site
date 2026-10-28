const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const base = process.env.SITE_BASE || 'http://127.0.0.1:4173/';
const api = '**/api.github.com/repos/Araz0-0dev/AMretro/releases/latest';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM||undefined, args:['--no-sandbox']});
  const errors = [];
  try {
    const context = await browser.newContext({viewport:{width:1440,height:900}});
    const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
    await page.route(api, r => r.abort());
    await page.goto(base, {waitUntil:'load'});
    assert.equal(await page.title(), 'AMretro | بازی‌های خوب، تمام نمی‌شوند');
    await page.getByRole('heading',{name:'بازی‌های خوب، تمام نمی‌شن.'}).waitFor();
    assert.ok(await page.evaluate(() => document.querySelector('.visual-frame img').naturalWidth > 0));
    assert.ok(await page.getByText('پیش‌نمایش · آزمایشی',{exact:true}).isVisible());
    assert.ok((await page.locator('#preview-windows').getAttribute('href')).endsWith('/AMretro-Setup-0.3.1-candidate-x64.exe'));
    assert.ok((await page.locator('#preview-linux').getAttribute('href')).endsWith('/AMretro_0.3.1_candidate_amd64.deb'));
    assert.ok((await page.locator('#preview-android').getAttribute('href')).endsWith('/AMretro-Android-0.2.1-beta-arm64.apk'));
    assert.ok((await page.locator('#download-windows').getAttribute('href')).endsWith('/AMretro-Setup-0.3.0-x64.exe'));
    assert.ok((await page.locator('#download-linux').getAttribute('href')).endsWith('/AMretro_0.3.0_amd64.deb'));
    assert.ok((await page.locator('#download-android').getAttribute('href')).endsWith('/AMretro-Android-0.2.0-beta-arm64.apk'));
    const username = require('../site-config.json').telegram_username.replace(/^@/, '');
    if (username) {
      assert.equal(await page.locator('#telegram-link').isVisible(),true);
      assert.equal(await page.locator('#telegram-link').getAttribute('href'),`https://t.me/${username}`);
    } else {
      assert.equal(await page.locator('#telegram-link').isVisible(),false);
      assert.equal(await page.locator('#telegram-pending').isVisible(),true);
    }
    assert.ok(await page.getByText('ساخته‌شده توسط AM',{exact:false}).count());
    assert.ok(await page.getByText('نسخهٔ منتشرشدهٔ فعلی آزمایشی است.',{exact:false}).count());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    if (process.env.SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'desktop.png'),fullPage:true});
    await page.setViewportSize({width:375,height:812});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile horizontal overflow');
    await page.locator('#menu-toggle').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'true');
    await page.locator('#navigation a[href="#download"]').click();assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'),'false');
    if (process.env.SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'mobile.png'),fullPage:true});
    await page.setViewportSize({width:320,height:720});assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, '320px horizontal overflow');
    await context.close();
    const live = await browser.newContext();const p2 = await live.newPage();p2.on('pageerror',e=>errors.push(e.message));
    await p2.route(api, r => r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({assets:[
      {name:'AMretro-Setup-0.4.0-x64.exe',browser_download_url:'https://github.com/Araz0-0dev/AMretro/releases/download/v0.4.0/AMretro-Setup-0.4.0-x64.exe'},
      {name:'AMretro_0.4.0_amd64.deb',browser_download_url:'https://github.com/Araz0-0dev/AMretro/releases/download/v0.4.0/AMretro_0.4.0_amd64.deb'},
      {name:'AMretro-Android-0.3.0-beta-arm64.apk',browser_download_url:'https://github.com/Araz0-0dev/AMretro/releases/download/v0.4.0/AMretro-Android-0.3.0-beta-arm64.apk'},
      {name:'AMretro-Installers-SHA256.txt',browser_download_url:'https://github.com/Araz0-0dev/AMretro/releases/download/v0.4.0/AMretro-Installers-SHA256.txt'}]})}));
    await p2.goto(base);await p2.getByText('لینک‌ها با تازه‌ترین انتشار GitHub بررسی شدند.').waitFor();
    assert.ok((await p2.locator('#download-windows').getAttribute('href')).includes('/v0.4.0/'));
    assert.ok((await p2.locator('#version-android').innerText()).includes('آزمایشی'));
    assert.ok((await p2.locator('#download-checksums').getAttribute('href')).includes('/v0.4.0/'));
    assert.deepEqual(errors,[]);
    console.log('SITE_OK desktop, 375/320px, menu, offline fallback, latest-release and preview links, beta label, credit, real-or-unset Telegram support');
    await live.close();
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
