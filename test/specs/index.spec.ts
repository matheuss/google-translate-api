import createHttpProxyAgent from 'http-proxy-agent';

it('translate', async () => {
  const { text, raw } = await translate('Привет, мир! Как дела?', { to: 'en' });
  assert.equal(text, 'Hello World! How are you?');
  assert.equal(raw.src, 'ru');
  assert.equal(raw.sentences.length, 3);
  assert.deepEqual(raw.sentences.slice(-1), [
    { src_translit: 'Privet, mir! Kak dela?' }
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
    const agent = createHttpProxyAgent(proxyUrl);
    const { text } = await translate('Ia hala ana mai o ka waa o Pele', {
      fetchOptions: { agent }
    });
    assert.equal(text, 'When Pele\'s boat passed by');
  }
});
