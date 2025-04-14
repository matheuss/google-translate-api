/**
 * Creates symlink ./node_modules/google-translate-api-test-esm -> .
 * This allows to import/require it from node_modules instead of direct file.
 */
import fs from 'fs';

const symlink = './node_modules/google-translate-api-test-esm';
if (!fs.existsSync(symlink)) {
  fs.symlinkSync('..', symlink);
}
