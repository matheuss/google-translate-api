/**
 * Created by matheus on 5/14/16.
 */

import test from 'ava';
import translate from './index';

test('translate without any options', async t => {
    try {
        const res = await translate('vertaler');

        t.is(res.text, 'translator');
        t.false(res.from.language.didYouMean);
        t.is(res.from.language.iso, 'nl');
        t.false(res.from.text.autoCorrected);
        t.is(res.from.text.value, '');
        t.false(res.from.text.didYouMean);
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate from auto to dutch', async t => {
    try {
        const res = await translate('translator', {from: 'auto', to: 'nl'});

        t.is(res.text, 'vertaler');
        t.false(res.from.language.didYouMean);
        t.is(res.from.language.iso, 'en');
        t.false(res.from.text.autoCorrected);
        t.is(res.from.text.value, '');
        t.false(res.from.text.didYouMean);
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some english text setting the source language as portuguese', async t => {
    try {
        const res = await translate('translator', {from: 'pt', to: 'nl'});

        t.true(res.from.language.didYouMean);
        t.is(res.from.language.iso, 'en');
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some misspelled english text to dutch', async t => {
    try {
        const res = await translate('I spea Dutch', {from: 'en', to: 'nl'});

        if (res.from.text.autoCorrected || res.from.text.didYouMean) {
            t.is(res.from.text.value, 'I [speak] Dutch');
        } else {
            t.fail();
        }
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some text with an invalid tk', async t => {
    try {
        await translate('vertaler', {tk: 0});
    } catch (err) {
        t.is(err.code, 'BAD_REQUEST');
    }
});

test.todo('try to translate some text without an internet connection');

test('translate some text and get the raw output alongside', async t => {
    try {
        const res = await translate('vertaler', {raw: true});
        t.truthy(res.raw);
    } catch (err) {
        t.fail(err.code);
    }
});
