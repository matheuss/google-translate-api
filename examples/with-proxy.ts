/**
 * Run translate via HTTP proxy from https://free-proxy-list.net.
 * Use anonymous proxies with 'yes' in Google column.
 *
 * Usage:
 * npx ts-node-esm examples/with-proxy <PROXY>
 *
 * Example:
 * npx ts-node-esm examples/with-proxy 8.210.83.33:80
 */
import { RequestInit } from 'node-fetch';
import createHttpProxyAgent from 'http-proxy-agent';
import { translate } from '../src/index.js';

const proxy = process.argv[2];
const timeout = 5000;

translateWithProxy('Ich muss Deutsch lernen!');

async function translateWithProxy(sourceText: string) {
  console.log(`Using proxy: ${proxy}`);
  console.log(`Translating: ${sourceText}`);
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeout);
  const fetchOptions = {
    agent: createHttpProxyAgent(`http://${proxy}`),
    signal: ac.signal,
  } as Partial<RequestInit>;
  try {
    const { text } = await translate(sourceText, { fetchOptions });
    console.log(`Result: ${text}`);
  } finally {
    clearTimeout(timer);
  }
}
