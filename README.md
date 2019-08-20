# google-translate-api
[![Build Status](https://travis-ci.org/vitalets/google-translate-api.svg?branch=master)](https://travis-ci.org/vitalets/google-translate-api)
[![NPM version](https://img.shields.io/npm/v/@vitalets/google-translate-api.svg)](https://www.npmjs.com/package/@vitalets/google-translate-api)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Coverage Status](https://coveralls.io/repos/github/vitalets/google-translate-api/badge.svg?branch=master)](https://coveralls.io/github/vitalets/google-translate-api?branch=master)

A **free** and **unlimited** API for Google Translate :dollar::no_entry_sign: for Node.js.

## Features 

- Auto language detection
- Spelling correction
- Language correction 
- Fast and reliable – it uses the same servers that [translate.google.com](https://translate.google.com) uses

## Why this fork?
This fork of original [matheuss/google-translate-api](https://github.com/matheuss/google-translate-api) contains several improvements:

- New option `client="t|gtx"`. Setting `client="gtx"` seems to work even with outdated token, see [this discussion](https://github.com/matheuss/google-translate-api/issues/79#issuecomment-425679193) for details
- Fixed extraction of TKK ceed from current `https://translate.google.com` sources (via [@vitalets/google-translate-token](https://github.com/vitalets/google-translate-token))
- Removed unsecure `unsafe-eval` dependency (See [#2](https://github.com/vitalets/google-translate-api/pull/2))
- Added [daily CI tests](https://travis-ci.org/vitalets/google-translate-api/builds) to get notified if Google API changes
- Added support for custom `tld` (especially to support `translate.google.cn`, see [#7](https://github.com/vitalets/google-translate-api/pull/7))
- Added support for outputting pronunciation (see [#17](https://github.com/vitalets/google-translate-api/pull/17))
- Added support for custom [got](https://github.com/sindresorhus/got) options. It allows to use proxy and bypass request limits (see [#25](https://github.com/vitalets/google-translate-api/pull/25))
- Added support for language extensions from outside of the API (See [#18](https://github.com/vitalets/google-translate-api/pull/18))

## Install 

```
npm install @vitalets/google-translate-api
```

## Usage

From automatic language detection to English:

```js
const translate = require('@vitalets/google-translate-api');

translate('Ik spreek Engels', {to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});
```

From English to Dutch with a typo:

```js
translate('I spea Dutch!', {from: 'en', to: 'nl'}).then(res => {
    console.log(res.text);
    //=> Ik spreek Nederlands!
    console.log(res.from.text.autoCorrected);
    //=> true
    console.log(res.from.text.value);
    //=> I [speak] Dutch!
    console.log(res.from.text.didYouMean);
    //=> false
}).catch(err => {
    console.error(err);
});
```

Sometimes, the API will not use the auto corrected text in the translation:

```js
translate('I spea Dutch!', {from: 'en', to: 'nl'}).then(res => {
    console.log(res);
    console.log(res.text);
    //=> Ik spea Nederlands!
    console.log(res.from.text.autoCorrected);
    //=> false
    console.log(res.from.text.value);
    //=> I [speak] Dutch!
    console.log(res.from.text.didYouMean);
    //=> true
}).catch(err => {
    console.error(err);
});
```

You can also add languages in the code and use them in the translation:

``` js
translate = require('google-translate-api');
translate.languages['sr-Latn'] = 'Serbian Latin';

translate('translator', {to: 'sr-Latn'}).then(res => ...);
```

## Too many requests
Google Translate has request limits. If too many requests are made, you can either end up with a 429 or a 503 error.
You can use proxy to bypass them:
```js
const tunnel = require('tunnel');
translate('Ik spreek Engels', {to: 'en'}, {
    agent: tunnel.httpsOverHttp({
    proxy: { 
      host: 'whateverhost',
      proxyAuth: 'user:pass',
      port: '8080',
      headers: {
        'User-Agent': 'Node'
      }
    }
  }
)}).then(res => {
    // do something
}).catch(err => {
    console.error(err);
});
```

## Does it work from web page context?
No. `https://translate.google.com` does not provide [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) http headers allowing access from other domains.

## API

### translate(text, [options], [gotOptions])

#### text

Type: `string`

The text to be translated

#### options

Type: `object`

##### from
Type: `string` Default: `auto`

The `text` language. Must be `auto` or one of the codes/names (not case sensitive) contained in [languages.js](https://github.com/vitalets/google-translate-api/blob/master/languages.js)

##### to
Type: `string` Default: `en`

The language in which the text should be translated. Must be one of the codes/names (case sensitive!) contained in [languages.js](https://github.com/vitalets/google-translate-api/blob/master/languages.js).

##### raw
Type: `boolean` Default: `false`

If `true`, the returned object will have a `raw` property with the raw response (`string`) from Google Translate.

##### client
Type: `string` Default: `"t"`

Query parameter `client` used in API calls. Can be `t|gtx`.

##### tld
Type: `string` Default: `"com"`

TLD for Google translate host to be used in API calls: `https://translate.google.{tld}`.

#### gotOptions
Type: `object`

The got options: https://github.com/sindresorhus/got#options

### Returns an `object`:
- `text` *(string)* – The translated text.
- `from` *(object)*
  - `language` *(object)*
    - `didYouMean` *(boolean)* - `true` if the API suggest a correction in the source language
    - `iso` *(string)* - The [code of the language](https://github.com/vitalets/google-translate-api/blob/master/languages.js) that the API has recognized in the `text`
  - `text` *(object)*
    - `autoCorrected` *(boolean)* – `true` if the API has auto corrected the `text`
    - `value` *(string)* – The auto corrected `text` or the `text` with suggested corrections
    - `didYouMean` *(boolean)* – `true` if the API has suggested corrections to the `text`
- `raw` *(string)* - If `options.raw` is true, the raw response from Google Translate servers. Otherwise, `''`.

Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to `true`. In this case, it will have the corrections delimited with brackets (`[ ]`):

```js
translate('I spea Dutch').then(res => {
    console.log(res.from.text.value);
    //=> I [speak] Dutch
}).catch(err => {
    console.error(err);
});
```
Otherwise, it will be an empty `string` (`''`).

## Related

- [`vertaler`](https://github.com/matheuss/vertaler) – CLI for this module

## License

MIT © [Matheus Fernandes](http://matheus.top), forked and maintained by [Vitaliy Potapov](https://github.com/vitalets).
