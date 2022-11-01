const fs = require('fs');
const assert = require('assert');
const { translate } = require('google-translate-api-test-esm');

(async function() {
  const { text } = await translate('Привет, мир! Как дела?');
  assert.equal(text, 'Hello World! How are you?');
  console.log('CJS: ok!');
})();

