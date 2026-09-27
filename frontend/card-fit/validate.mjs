import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2] || 'card-fit/samples.json';
const candidates = JSON.parse(await readFile(resolve(root, input), 'utf8'));
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'normal-mobile', width: 430, height: 932 },
  { name: 'small-mobile', width: 375, height: 667 },
  { name: 'tablet-portrait', width: 820, height: 1180 },
  { name: 'mobile-landscape', width: 844, height: 390 },
];
const rank = { PASS: 0, REVIEW: 1, FAIL: 2 };
const server = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1', '--port', '5187', '--strictPort'], { cwd: root, stdio: 'ignore', env: { ...process.env, VITE_PUBLIC_URL: 'http://127.0.0.1:5187' } });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { const response = await fetch('http://127.0.0.1:5187/card-fit.html'); if (response.ok) { ready = true; break; } } catch { /* starting */ }
    await new Promise(r => setTimeout(r, 250));
  }
  if (!ready) throw new Error('Vite preview did not start. Run npm ci in frontend first.');
  browser = await chromium.launch({ headless: true });
  const results = [];
  for (const candidate of candidates) {
    if (typeof candidate.riddle !== 'string' || typeof candidate.description !== 'string') throw new Error(`Missing text: ${candidate.id}`);
    const variants = [];
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, locale: 'en-GB' });
      for (const [side, field, selector] of [['front', 'riddle', '.event-name'], ['back', 'description', '.card-details']]) {
        const params = new URLSearchParams({ name: candidate.name || 'Historical Event', riddle: candidate.riddle, description: candidate.description, side });
        await page.goto(`http://127.0.0.1:5187/card-fit.html?${params}`);
        await page.locator(selector).waitFor();
        await page.addStyleTag({ content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }' });
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); });
        const measurement = await page.locator(selector).evaluate((element, side) => {
          // Range rectangles expose actual glyph wrapping, including text hidden by overflow.
          const text = element.firstChild;
          const content = text?.textContent || '';
          const style = getComputedStyle(element);
          const region = side === 'front' ? element.closest('.card-front') : element;
          const bounds = region.getBoundingClientRect();
          const regionStyle = getComputedStyle(region);
          const insetX = parseFloat(regionStyle.borderLeftWidth) + parseFloat(regionStyle.paddingLeft);
          const insetY = parseFloat(regionStyle.borderTopWidth) + parseFloat(regionStyle.paddingTop);
          const area = {
            left: bounds.left + insetX, right: bounds.right - parseFloat(regionStyle.borderRightWidth) - parseFloat(regionStyle.paddingRight),
            top: bounds.top + insetY, bottom: bounds.bottom - parseFloat(regionStyle.borderBottomWidth) - parseFloat(regionStyle.paddingBottom),
          };
          const words = [...content.matchAll(/\S+/gu)];
          let brokenWord = false;
          const fragments = words.flatMap(match => {
            const range = document.createRange();
            range.setStart(text, match.index); range.setEnd(text, match.index + match[0].length);
            const rects = [...range.getClientRects()];
            if (rects.length <= 1) return rects.map(rect => ({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, text: match[0] }));
            brokenWord = true;
            // Build readable line fragments when CSS breaks a word mid-word.
            const pieces = [];
            let offset = match.index;
            for (const character of match[0]) {
              range.setStart(text, offset); range.setEnd(text, offset + character.length);
              const rect = range.getBoundingClientRect();
              const piece = pieces.find(piece => Math.abs(piece.top - rect.top) < 2);
              if (piece) { piece.right = Math.max(piece.right, rect.right); piece.bottom = Math.max(piece.bottom, rect.bottom); piece.text += character; }
              else pieces.push({ left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, text: character });
              offset += character.length;
            }
            return pieces;
          });
          const lines = [];
          for (const fragment of fragments) {
            const line = lines.find(line => Math.abs(line.top - fragment.top) < 2);
            if (line) { line.right = Math.max(line.right, fragment.right); line.left = Math.min(line.left, fragment.left); line.words.push(fragment.text); }
            else lines.push({ top: fragment.top, left: fragment.left, right: fragment.right, words: [fragment.text] });
          }
          lines.sort((a, b) => a.top - b.top);
          const tolerance = 1.5;
          const horizontal = fragments.some(rect => rect.left < area.left - tolerance || rect.right > area.right + tolerance);
          const vertical = fragments.some(rect => rect.top < area.top - tolerance || rect.bottom > area.bottom + tolerance);
          const margin = fragments.length ? Math.min(...fragments.flatMap(rect => [rect.left - area.left, area.right - rect.right, rect.top - area.top, area.bottom - rect.bottom])) : Infinity;
          const last = lines.at(-1);
          const previous = lines.at(-2);
          const orphan = Boolean(last && previous && (last.words.length === 1 || (last.right - last.left) < (previous.right - previous.left) * 0.25));
          const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
          const nearEdge = margin < Math.max(3, lineHeight * 0.35);
          // The back is clipped by card-content too; check each rendered fragment against its clipping ancestors.
          const clipped = fragments.some(rect => {
            if (side === 'front') {
              const face = element.closest('.card-front').getBoundingClientRect();
              if (rect.left < face.left - tolerance || rect.right > face.right + tolerance || rect.top < face.top - tolerance || rect.bottom > face.bottom + tolerance) return true;
            }
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              const css = getComputedStyle(parent);
              if (!['hidden', 'clip'].includes(css.overflow) && !['hidden', 'clip'].includes(css.overflowX) && !['hidden', 'clip'].includes(css.overflowY)) continue;
              const box = parent.getBoundingClientRect();
              if (rect.left < box.left - tolerance || rect.right > box.right + tolerance || rect.top < box.top - tolerance || rect.bottom > box.bottom + tolerance) return true;
            }
            return false;
          });
          const reasons = [];
          if (!content.trim()) reasons.push('empty text');
          if (horizontal) reasons.push('horizontal overflow');
          if (vertical) reasons.push('vertical overflow');
          if (clipped) reasons.push('ancestor clipping');
          if (orphan) reasons.push('isolated/short final line');
          if (brokenWord) reasons.push('word broken across lines');
          if (nearEdge) reasons.push('near available-area edge');
          return { status: !content.trim() || horizontal || vertical || clipped ? 'FAIL' : orphan || nearEdge || brokenWord ? 'REVIEW' : 'PASS', reasons, lines: lines.map(line => line.words.join(' ')), marginPx: Number.isFinite(margin) ? +margin.toFixed(1) : null, area: { width: +(area.right - area.left).toFixed(1), height: +(area.bottom - area.top).toFixed(1) }, font: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, side };
        }, side);
        variants.push({ viewport: viewport.name, field, ...measurement });
      }
      await page.close();
    }
    results.push({ id: candidate.id, status: variants.reduce((worst, v) => rank[v.status] > rank[worst] ? v.status : worst, 'PASS'), variants });
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser?.close();
  server.kill();
}
