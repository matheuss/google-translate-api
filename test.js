/**
 * Created by matheus on 5/14/16.
 */

import test from 'ava';
import translate from './index';

test('translate from \'\' (auto) to \'\' (english)', async t => {
    const res = await translate('Ik spreek Engels', {});
    t.falsy(res.text.corrected);
    t.falsy(res.text.correction);
    t.is(res.text.value, 'I speak English');
    t.falsy(res.from.corrected);
    t.is(res.from.iso, 'nl');
});

test('translate from auto to dutch', async t => {
    const res = await translate('I speak Dutch', {from: 'auto', to: 'nl'});

    t.falsy(res.text.corrected);
    t.falsy(res.text.correction);
    t.is(res.text.value, 'ik spreek Nederlands');
    t.falsy(res.from.corrected);
    t.is(res.from.iso, 'en');
});
