import assert from 'assert';
import { translate } from '../src/index.js';

type Assert = typeof assert.strict;
type TranslateFn = typeof translate;

declare global {
  const assert: Assert;
  const translate: TranslateFn;
}

Object.assign(global, {
  assert: assert.strict,
  translate,
});
