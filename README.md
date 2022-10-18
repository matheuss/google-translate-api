# google-translate-api
[![Actions Status](https://github.com/vitalets/google-translate-api/workflows/autotests/badge.svg)](https://github.com/vitalets/google-translate-api/actions)
[![NPM version](https://img.shields.io/npm/v/@vitalets/google-translate-api.svg)](https://www.npmjs.com/package/@vitalets/google-translate-api)

A **free** and **unlimited** API for Google Translate for Node.js.

**In version 9+ library was fully rewritten. For legacy documentation please see [legacy branch](https://github.com/vitalets/google-translate-api/tree/legacy).**

## Contents

<!-- toc -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  * [Usage with proxy](#usage-with-proxy)
  * [Usage in react-native](#usage-in-react-native)
  * [Usage in browser](#usage-in-browser)
- [API](#api)
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
```ts
import { translate } from '@vitalets/google-translate-api';

const { text } = await translate('Привет, мир! Как дела?', { to: 'en' });
// text => 'Hello World! How are you?'
```

### Usage with proxy
Google Translate has request limits. If too many requests are made, you can get a 429 error.
You can use **proxy** to bypass them:

```ts
import { translate } from '@vitalets/google-translate-api';
import createHttpProxyAgent from 'http-proxy-agent';

const agent = createHttpProxyAgent('http://103.152.112.162:80');
const { text } = await translate('Привет, мир!', {
  to: 'en',
  fetchOptions: { agent }
});
```

### Usage in react-native
tbd

### Usage in browser
This library **does not work in browser** because `translate.google.com` does not provide [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers allowing access from other domains.

## API
tbd

## Related projects
* [matheuss/google-translate-api](https://github.com/matheuss/google-translate-api) - original repo
* [Translateer](https://github.com/Songkeys/Translateer) - uses Puppeteer to access Google Translate API
* [hua1995116/google-translate-open-api](https://github.com/hua1995116/google-translate-open-api)
* [google-translate-api-x](https://github.com/AidanWelch/google-translate-api)

## License
MIT © [Matheus Fernandes](http://matheus.top), forked and maintained by [Vitaliy Potapov](https://github.com/vitalets).
