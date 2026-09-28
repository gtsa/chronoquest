import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = execFileSync(process.execPath, ['card-fit/validate.mjs', 'card-fit/samples.json'], { cwd: root, encoding: 'utf8', maxBuffer: 10_000_000 });
const results = Object.fromEntries(JSON.parse(output).map(result => [result.id, result]));
const variant = (id, viewport, field) => results[id].variants.find(v => v.viewport === viewport && v.field === field);
assert.equal(results.short.variants.some(v => v.status === 'FAIL'), false, 'short sample must never overflow');
assert.equal(variant('short', 'desktop', 'description').status, 'PASS');
assert.equal(variant('long-word', 'desktop', 'description').status, 'FAIL');
assert.equal(variant('long-word', 'desktop', 'riddle').status, 'REVIEW', 'broken word needs editorial review');
assert.equal(variant('long', 'small-mobile', 'riddle').status, 'FAIL');
assert.equal(results.extreme.variants.every(v => v.status === 'FAIL'), true, 'extreme text must overflow every variant');
console.log('Card fit sample assertions passed (five candidates, five viewports, both fields).');
