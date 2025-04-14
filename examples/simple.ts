/**
 * Simple translation example.
 *
 * Usage:
 * npx tsx examples/simple.ts
 */

import { translate } from '../src/index.js';

translateSimple('How was work today?');

async function translateSimple(sourceText: string) {
  console.log(`Translating: ${sourceText}`);
  const { text, raw } = await translate(sourceText, { to: 'ru' });
  console.log(`Result: ${text}`);
  console.log(`Raw response:`);
  console.dir(raw, { depth: null });
}
