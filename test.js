var test = require('ava');
var Configstore = require('configstore');
var languages = require('./languages.js');
var translate = require('./index.js');

const config = new Configstore('google-translate-api');

test.beforeEach(() => {
    config.clear();
});

test('translate without any options', async t => {
    const res = await translate('vertaler');

    t.is(res.text, 'translator');
    t.false(res.from.language.didYouMean);
    t.is(res.from.language.iso, 'nl');
    t.false(res.from.text.autoCorrected);
    t.is(res.from.text.value, '');
    t.false(res.from.text.didYouMean);
});

test('translate from auto to dutch', async t => {
    const res = await translate('translator', {from: 'auto', to: 'nl'});

    t.is(res.text, 'vertaler');
    t.false(res.from.language.didYouMean);
    t.is(res.from.language.iso, 'en');
    t.false(res.from.text.autoCorrected);
    t.is(res.from.text.value, '[translate]');
    t.true(res.from.text.didYouMean);
});

test('translate several sentences with spaces (#73)', async t => {
    const res = await translate(
        'translator, translator. translator! translator? translator,translator.translator!translator?',
        {from: 'auto', to: 'nl'}
    );

    t.is(res.text, 'vertaler, vertaler. vertaler! vertaler? Vertaler, vertaler.translator! Vertaler?');
});

test('test pronunciation', async t => {
    const res = await translate('translator', {from: 'auto', to: 'zh-CN'});

    // here can be 2 variants: 'Yì zhě', 'Fānyì'
    t.regex(res.pronunciation, /^(Yì zhě)|(Fānyì)$/);
});

test('translate some english text setting the source language as portuguese', async t => {
    const res = await translate('happy', {from: 'pt', to: 'nl'});

    t.true(res.from.language.didYouMean);
    t.is(res.from.language.iso, 'en');
});

test('translate some misspelled english text to dutch', async t => {
    const res = await translate('I spea Dutch', {from: 'en', to: 'nl'});

    if (res.from.text.autoCorrected || res.from.text.didYouMean) {
        t.is(res.from.text.value, 'I [speak] Dutch');
    } else {
        t.fail();
    }
});

test('translate some text and get the raw output alongside', async t => {
    const res = await translate('vertaler', {raw: true});

    t.truthy(res.raw);
});

test('test a supported language – by code', t => {
    t.true(languages.isSupported('en'));
});

test('test an unsupported language – by code', t => {
    t.false(languages.isSupported('js'));
});

test('test a supported language – by name', t => {
    t.true(languages.isSupported('english'));
});

test('test an unsupported language – by name', t => {
    t.false(languages.isSupported('javascript'));
});

test('get a language code by its name', t => {
    t.is(languages.getCode('english'), 'en');
});

test('get an unsupported language code by its name', t => {
    t.false(languages.getCode('javascript'));
});

test('get a supported language code by code', t => {
    t.is(languages.getCode('en'), 'en');
});

test('call getCode with \'undefined\'', t => {
    t.is(languages.getCode(undefined), false);
});

test('call getCode with \'null\'', t => {
    t.is(languages.getCode(null), false);
});

test('call getCode with an empty string', t => {
    t.is(languages.getCode(''), false);
});

test('call getCode with no arguments', t => {
    t.is(languages.getCode(), false);
});

test('try to translate from an unsupported language', async t => {
    try {
        await translate('something', {from: 'js', to: 'en'});
        t.fail();
    } catch (err) {
        t.is(err.code, 400);
        t.is(err.message, 'The language \'js\' is not supported');
    }
});

test('try to translate to an unsupported language', async t => {
    try {
        await translate('something', {from: 'en', to: 'js'});
        t.fail();
    } catch (err) {
        t.is(err.code, 400);
        t.is(err.message, 'The language \'js\' is not supported');
    }
});

test('translate from dutch to english using language names instead of codes', async t => {
    const res = await translate('iets', {from: 'dutch', to: 'english'});

    t.is(res.from.language.iso, 'nl');
    t.is(res.text, 'something');
});

test('translate via custom tld', async t => {
    const res = await translate('vertaler', {tld: 'cn'});

    t.is(res.text, 'translator');
    t.false(res.from.language.didYouMean);
    t.is(res.from.language.iso, 'nl');
    t.false(res.from.text.autoCorrected);
    t.is(res.from.text.value, '');
    t.false(res.from.text.didYouMean);
});

test('translate via an external language from outside of the API', async t => {
    translate.languages['sr-Latn'] = 'Serbian Latin';
    const res = await translate('translator', {to: 'sr-Latn'});

    t.is(res.text, 'преводилац');
    t.is(res.from.language.iso, 'en');
});

test('pass got options', async t => {
    let a = 0;
    const gotopts = {
        hooks: {
            afterResponse: [
                response => {
                    a++;
                    return response;
                }
            ]
        }
    };
    const res = await translate('vertaler', {}, gotopts);

    t.is(res.text, 'translator');
    t.is(a, 2);
});

test('test get zh code', t => {
    t.false(languages.getCode('zh'));
});

test('test get zh-CN code', t => {
    t.is(languages.getCode('zh-CN'), 'zh-CN');
});

test('test get zh-cn code', t => {
    t.false(languages.getCode('zh-cn'));
});

test('test get zh-TW code', t => {
    t.is(languages.getCode('zh-TW'), 'zh-TW');
});

test('test get zh-tw code', t => {
    t.false(languages.getCode('zh-tw'));
});

test('test zh unsupported', t => {
    t.false(languages.isSupported('zh'));
});

test('test zh-CN supported', t => {
    t.true(languages.isSupported('zh-CN'));
});

test('test zh-cn unsupported', t => {
    t.false(languages.isSupported('zh-cn'));
});

test('test zh-TW supported', t => {
    t.true(languages.isSupported('zh-TW'));
});

test('test zh-tw unsupported', t => {
    t.false(languages.isSupported('zh-tw'));
});

test('test zh-CN supported – by name', t => {
    t.true(languages.isSupported('chinese (simplified)'));
});
