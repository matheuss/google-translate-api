/**
 * Run translation until TooManyRequests occurs.
 * Allows to estimate requests limit for your location/env.
 *
 * Usage:
 * npx ts-node-esm examples/hit-too-many-reqs.ts
 */

import timers from 'node:timers/promises';
import { translate } from '../src/index.js';

const delayMs = 10;

translateUntilErr('Ich muss Deutsch lernen!');

async function translateUntilErr(sourceText: string) {
  console.log(`Translating: ${sourceText}`);
  for (let i = 1; i < 1000; i++) {
    const { text } = await translate(sourceText);
    console.log(`# ${i}: ${text}`);
    await timers.setTimeout(delayMs);
  }
}
