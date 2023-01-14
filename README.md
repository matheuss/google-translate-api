# google-translate-api
[![Actions Status](https://github.com/vitalets/google-translate-api/workflows/autotests/badge.svg)](https://github.com/vitalets/google-translate-api/actions)
[![NPM version](https://img.shields.io/npm/v/@vitalets/google-translate-api.svg)](https://www.npmjs.com/package/@vitalets/google-translate-api)
[![license](https://img.shields.io/npm/l/@vitalets/google-translate-api.svg)](https://www.npmjs.com/package/@vitalets/google-translate-api)

A **free** and **unlimited** API for Google Translate for Node.js.

**In version 9+ library was fully rewritten. For legacy documentation please see [legacy branch](https://github.com/vitalets/google-translate-api/tree/legacy).**


## Contents

<!-- toc -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  * [Node.js](#nodejs)
  * [React-native](#react-native)
  * [Web pages](#web-pages)
  * [Browser extensions](#browser-extensions)
- [Limits](#limits)
- [API](#api)
    + [Parameters](#parameters)
    + [Response](#response)
- [Related projects](#related-projects)
- [License](#license)

<!-- tocstop -->

## Features

* auto language detection
* all [Google Translate languages](https://cloud.google.com/translate/docs/languages) supported
* react-native supported
* transliteration

## Installation
```
npm install @vitalets/google-translate-api
```

## Usage
### Node.js
```ts
import { translate } from '@vitalets/google-translate-api';

const { text } = await translate('Привет, мир! Как дела?', { to: 'en' });

console.log(text) // => 'Hello World! How are you?'
```

### React-native
Since react-native has [full support of fetch API](https://reactnative.dev/docs/network) translation works the same way as in Node.js.

### Web pages
This library **does not work inside web pages** because `translate.google.com` does not provide [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers allowing access from other domains.

### Browser extensions
Although library does not work in regular web pages it can be used in browser extensions.
Extensions background and popup pages are [not limited](https://developer.chrome.com/docs/extensions/mv3/xhr/) with same origin policy. To use translation API you should do the following:

1. Add host permissions to `manifest.json`:
   ```diff
   + "host_permissions": [
   +    "https://translate.google.com/"
   +  ]
   ```

2. Import `translate` as usual in background or popup script:
   ```js
   // background.js
   import { translate } from '@vitalets/google-translate-api';

   const { text } = await translate('Привет мир');

   console.log(text);
   ```

3. Bundle code (for example with `webpack`):
   ```js
   // webpack.config.js
   module.exports = {
     mode: 'development',
     entry: './background.js',
     output: {
       filename: 'bundle.js',
     },
   };
   ```

## Limits
Google Translate has request limits. If too many requests are made, you can get a **TooManyRequestsError** (code 429). You can use **proxy** to bypass it:

```ts
import { translate } from '@vitalets/google-translate-api';
import createHttpProxyAgent from 'http-proxy-agent';

const agent = createHttpProxyAgent('http://103.152.112.162:80');
const { text } = await translate('Привет, мир!', {
  to: 'en',
  fetchOptions: { agent },
});
```
See [examples/with-proxy.ts] for more details.

> Available proxy list you can find [here](https://free-proxy-list.net/) (with `yes` in Google column).

Common pattern for selecting proxy is following:
```ts
  try {
    const { text } = await translate('Привет, мир!', {
      to: 'en',
      fetchOptions: { agent },
    });
  } catch (e) {
    if (e.name === 'TooManyRequestsError') {
      // retry with another proxy agent
    }
  }
```

## API

```ts
translate(text: string, options?: Options): Promise<Response>
```

#### Parameters
* `text` *(string)* - The text to be translated
* `options` *(object)*
  - `from` *(string)* - The language of `text`. Must be `auto` or one of the [supported languages](https://cloud.google.com/translate/docs/languages). Default: `auto`
  - `to` *(string)* - The language in which the text should be translated. Must be one of the [supported languages](https://cloud.google.com/translate/docs/languages). Default: `auto`
  - `host` *(string)* - Google translate host to be used in API calls. Default: `translate.google.com`
  - `fetchOptions` *(object)* - Additional [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters) passed into request.

#### Response
* `text` *(string)* – The translated text.
* `raw` *(object)* - Raw responspe from the API. Contains sentences, detected original language and transliteration. [Example response](https://github.com/vitalets/google-translate-api/blob/master/response-sample.json).

## Related projects
* [matheuss/google-translate-api](https://github.com/matheuss/google-translate-api) - original repo
* [Translateer](https://github.com/Songkeys/Translateer) - uses Puppeteer to access Google Translate API
* [hua1995116/google-translate-open-api](https://github.com/hua1995116/google-translate-open-api)
* [google-translate-api-x](https://github.com/AidanWelch/google-translate-api)

## License
MIT © [Matheus Fernandes](http://matheus.top), forked and maintained by [Vitaliy Potapov](https://github.com/vitalets).

<a href="https://www.buymeacoffee.com/vitpotapov" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
