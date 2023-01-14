/**
 * Translation example with changed User agent.
 *
 * Usage:
 * npx ts-node-esm examples/with-changed-ua
 */
import { RequestInit } from 'node-fetch';
import { translate } from '../src/index.js';

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';

translateWithChangedUA('Ich muss Deutsch lernen!');

async function translateWithChangedUA(sourceText: string) {
  console.log(`Translating: ${sourceText}`);
  console.log(`Using user-agent: ${userAgent}`);
  const fetchOptions = {
    headers: {
      'User-Agent': userAgent,
    },
  } as Partial<RequestInit>;
  const { text } = await translate(sourceText, { fetchOptions });
  console.log(`Result: ${text}`);
}
