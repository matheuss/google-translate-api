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

### translate(text, options)

Returns an object with:

- `text` *(string)* – The translated text.
- `from` *(object)*
  - `language` *(object)*
    - `didYouMean` *(boolean)* - Will be true if the API suggest a correction in the source language
    - `iso` *(string)* - The [code of the language](https://github.com/matheuss/google-translate-api/blob/master/languages.js) that the API has recognized in the `text`
  - `text` *(object)*
    - `autoCorrected` *(boolean)* – Will be true if the API has auto corrected the `text`
    - `value` *(string)* – The auto corrected `text` or the `text` with suggested corrections
    - `didYouMean` *(booelan)* – Will be true if the API has suggested corrections to the `text`

Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to `true`. In this case, it will have the corrections delimited with brackets (`[ ]`): 
``` js
translate('I spea Dutch').then(res => {
    console.log(res.from.text.value);
    //=> I [speak] Dutch
});
```
Otherwise, it will be an empty `string` (`''`).

#### text

Type: `string`

The text to be translated

#### options

Type: `object`

##### from

Type: `string` Default: `'auto'`

The `text` language. Must be `'auto'`, `''` (same effect of `'auto'`)  or one of the codes contained in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js).

##### to

Type: `string` 

The language in which the text should be translated. Must be one of the codes contained in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js).

## Related
- [`vertaler`](https://github.com/matheuss/vertaler) – CLI for this module


## License

MIT © [Matheus Fernandes](http://matheus.top)
