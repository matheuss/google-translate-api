import fs from 'fs';
import { HttpProxyAgent } from 'http-proxy-agent';
import { extractTooManyRequestsInfo } from '../../src/helpers.js';

it('translate to en', async () => {
  const { text, raw } = await translate('Привет, мир! Как дела?', { to: 'en' });
  assert.equal(text, 'Hello World! How are you?');
  assert.equal(raw.src, 'ru');
  assert.equal(raw.sentences.length, 3);
  assert.deepEqual(raw.sentences.slice(-1), [
    { src_translit: 'Privet, mir! Kak dela?' }
  ]);
});

it('translate from en', async () => {
  const { text, raw } = await translate('Hello! How are you?', { to: 'zh' });
  assert.equal(text, '你好！你好吗？');
  assert.equal(raw.src, 'en');
  assert.equal(raw.sentences.length, 3);
  assert.deepEqual(raw.sentences.slice(-1), [
    { translit: 'Nǐ hǎo! Nǐ hǎo ma?' }
  ]);
});

it('translate between non-en', async () => {
  const { text, raw } = await translate('你好！你好吗？', { to: 'ru' });
  assert.equal(text, 'Привет! Ты в порядке?');
  assert.equal(raw.src, 'zh-CN');
  assert.equal(raw.sentences.length, 3);
  assert.deepEqual(raw.sentences.slice(-1), [
    { src_translit: 'Nǐ hǎo! Nǐ hǎo ma?', translit: 'Privet! Ty v poryadke?' }
  ]);
});

it('invalid host', async () => {
  const promise = translate('Привет, мир! Как дела?', { host: 'foo' });
  await assert.rejects(promise, /FetchError/);
});

// To run this test take proxy from https://free-proxy-list.net
// and run tests as PROXY=http://103.152.112.162:80 npm t
it('proxy', async () => {
  const proxyUrl = process.env.PROXY;
  if (proxyUrl) {
    const agent = new HttpProxyAgent(proxyUrl);
    const { text } = await translate('Ia hala ana mai o ka waa o Pele', {
      fetchOptions: { agent }
    });
    assert.equal(text, 'When Pele\'s boat passed by');
  }
});

it('extractTooManyRequestsInfo', () => {
  const html = fs.readFileSync('test/429.html', 'utf8');
  const res = extractTooManyRequestsInfo(html);
  assert.deepStrictEqual(res, {
    ip: '37.252.91.13',
    time: '2023-01-14T09:09:38Z',
    url: 'https://translate.google.com/translate_a/single?client=at&dt=t&dt=rm&dj=1',
  });
});
