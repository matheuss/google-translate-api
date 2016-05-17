# google-translate-api [![Build Status](https://travis-ci.org/matheuss/google-translate-api.svg?branch=master)](https://travis-ci.org/matheuss/google-translate-api) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo) [![Coverage Status](https://coveralls.io/repos/github/matheuss/google-translate-api/badge.svg?branch=master)](https://coveralls.io/github/matheuss/google-translate-api?branch=master) [![codecov](https://codecov.io/gh/matheuss/google-translate-api/branch/master/graph/badge.svg)](https://codecov.io/gh/matheuss/google-translate-api)

A **free** and **unlimited** API for Google Translate :dollar::no_entry_sign:

## Features 

- Auto language detection
- Spelling correction
- Language correction 
- Fast and reliable – it uses the same servers that [translate.google.com](https://translate.google.com) uses

## Install 

```
npm install --save google-translate-api
```

## Usage

``` js
const translate = require('google-translate-api');

translate('Ik spreek Engels', {from: 'auto', to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English

    console.log(res.from.language.iso);
    //=> nl
});
```

## API

- TODO: docs

## Related
- [`vertaler`](https://github.com/matheuss/vertaler) – CLI for this module


## License

MIT © [Matheus Fernandes](http://matheus.top)
