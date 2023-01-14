/**
 * Simple translation example.
 *
 * Usage:
 * npx ts-node-esm examples/simple
 */

import { translate } from '../src/index.js';

translateSimple('Ich muss Deutsch lernen!');

async function translateSimple(sourceText: string) {
  console.log(`Translating: ${sourceText}`);
  const { text } = await translate(sourceText);
  console.log(`Result: ${text}`);
}
