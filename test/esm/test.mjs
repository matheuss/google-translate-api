import assert from 'assert';
import { translate } from 'google-translate-api-test-esm';

const { text } = await translate('Привет, мир! Как дела?');
assert.equal(text, 'Hello World! How are you?');

console.log('MJS: ok!');
