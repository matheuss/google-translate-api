/**
 * Created by matheus on 5/14/16.
 */

import test from 'ava';
import translate from './index';

test('translate from \'\' (auto) to \'\' (english)', async t => {
    try {
        const res = await translate('Ik spreek Engels');

        t.falsy(res.text.corrected);
        t.falsy(res.text.correction);
        t.is(res.text.value, 'I speak English');
        t.falsy(res.from.corrected);
        t.is(res.from.iso, 'nl');
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate from auto to dutch', async t => {
    try {
        const res = await translate('I speak Dutch', {from: 'auto', to: 'nl'});

        t.falsy(res.text.corrected);
        t.falsy(res.text.correction);
        t.is(res.text.value, 'ik spreek Nederlands');
        t.falsy(res.from.corrected);
        t.is(res.from.iso, 'en');
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some english text setting the source language as portuguese', async t => {
    try {
        const res = await translate('I speak Dutch', {from: 'pt', to: 'nl'});

        t.falsy(res.text.corrected);
        t.falsy(res.text.correction);
        t.is(res.text.value, 'Ik spreek Nederlands');
        t.truthy(res.from.corrected);
        t.is(res.from.iso, 'en');
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some misspelled english text to dutch', async t => {
    try {
        const res = await translate('I spea Dutch', {from: 'en', to: 'nl'});

        t.truthy(res.text.corrected);
        t.is(res.text.correction, 'I [speak] Dutch');
        t.is(res.text.value, 'ik spreek Nederlands');
        t.falsy(res.from.corrected);
        t.is(res.from.iso, 'en');
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

test('translate some text and get only the raw output', async t => {
    try {
        const res = await translate('vertaler', {raw: true});
        t.truthy(res);
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate some text and get the raw output alongside', async t => {
    try {
        const res = await translate('vertaler', {includeRaw: true});
        t.truthy(res.raw);
    } catch (err) {
        t.fail(err.code);
    }
});
