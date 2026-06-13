// Rend les gabarits HTML marketing en PNG (9:16) prêts pour Instagram.
// Usage : node scripts/render-marketing.mjs
// Pré-requis : npx playwright install chromium
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const outDir = path.resolve('marketing/exports');
fs.mkdirSync(outDir, { recursive: true });

// file = gabarit ; sel = sélecteur de chaque carte exportable ; prefix = nom de sortie
const jobs = [
  { file: 'marketing/claude-code-academy-story.html', sel: '.story', prefix: 'story' },
  { file: 'marketing/claude-code-academy-reel.html', sel: '.cover', prefix: 'reel-cover' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1200, height: 1920 } });

for (const job of jobs) {
  await page.goto('file://' + path.resolve(job.file), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const cards = await page.$$(job.sel);
  for (let i = 0; i < cards.length; i++) {
    const out = path.join(outDir, `${job.prefix}-${String(i + 1).padStart(2, '0')}.png`);
    await cards[i].screenshot({ path: out });
    console.log('✓', out);
  }
}

await browser.close();
