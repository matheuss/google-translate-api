import test from 'ava';
import Configstore from 'configstore';
import languages from './languages';
import translate from './index';

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
    t.is(res.from.text.value, '');
    t.false(res.from.text.didYouMean);
});

test('translate some english text setting the source language as portuguese', async t => {
    const res = await translate('translator', {from: 'pt', to: 'nl'});

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

test.todo('try to translate some text without an internet connection');

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
