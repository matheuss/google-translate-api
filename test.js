import test from 'ava';

import languages from './languages';
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

test.todo('try to translate some text without an internet connection');

test('translate some text and get the raw output alongside', async t => {
    try {
        const res = await translate('vertaler', {raw: true});
        t.truthy(res.raw);
    } catch (err) {
        t.fail(err.code);
    }
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
    try {
        const res = await translate('iets', {from: 'dutch', to: 'english'});
        t.is(res.from.language.iso, 'nl');
        t.is(res.text, 'something');
    } catch (err) {
        t.fail(err.code);
    }
});

test('translate long text over 2083 chars using any languages', async t => {
    try {
        const text = `
NASA is preparing to launch its best space telescope yet, and it will gaze at the stars through a golden mirror. It's not a single piece, but an array of 18 segments made of beryllium -- a rare metal that is both strong and light -- and coated with a microscopically thin layer of pure gold for maximum reflectivity. It spans a whopping 21 feet (6.5 meters) across.
"A mirror this large has never before been launched into space," wrote Lee Feinberg, the Optical Telescope Element Manager for the James Webb Space Telescope at NASA, in an email interview.
Expected to launch in 2020, the telescope is an $8.8 billion project that will offer astronomers unprecedented views of the cosmos.
"Webb will solve mysteries of our solar system, look beyond to distant worlds around other stars, and probe the mysterious structures and origins of our universe and our place in it," said Feinberg.

Keeping it cool
The Webb is designed to be a more capable successor to the Hubble Space Telescope, launched in 1990.
Unlike Hubble, which orbits the Earth at about 340 miles of altitude, Webb will be sent almost a million miles into space, at a specific location called "L2." It's one of five so-called Lagrange points, specific areas of stability where the gravity from the Earth and the Sun balances out in such a way that putting an object there keeps it in a fixed position relative to the two celestial bodies. The telescope will therefore hitch a ride through space without the need for engines or propulsion, while enjoying an unobstructed view.
It's also very cold out there, which is oddly what NASA wants. James Webb will be able to see deeper into space by looking at the universe not through visible light -- like Hubble and our eyes do -- but through infrared radiation, which we normally think of as heat. That means that the mirror itself needs to be super cold, to avoid emitting any heat that could interfere with its own observations.
"Because warm objects give off infrared light, or heat, if Webb's mirror was the same temperature as Hubble's, the faint infrared light from distant galaxies would be lost in the infrared glow of the mirror," said Feinberg.
To protect itself from the warmth of the Sun, the mirror will sit on a 70-ft sunshield -- as long as a tennis court -- made of a special heat-resistant material. It looks like a giant kite and it will keep the mirror at a gelid -370°F, or -223°C, nearly three times colder than the coldest temperature ever recorded on Earth.

Unfolding in space
Each of the mirror's 18 segments weighs 46 pounds (20 kilos) and spans 4.3 feet (1.3 meters), forming an array that will dwarf Hubble's 7.9-ft primary mirror.
A larger mirror means better performance. "A telescope's sensitivity, or how much detail it can see, is directly related to the size of the mirror area that collects light from the objects being observed. A larger area collects more light, just like a larger bucket collects more water in a rain shower than a small one," said Feinberg.
But to make it fit into the rocket that will send it into space, the mirror needs to be folded, which explains why it's made of hexagons. "The hexagonal shape allows for a roughly circular, segmented mirror with high filling factor, which means the segments fit together without gaps. If the segments were circular, there would be gaps between them."
Once in space, getting these mirrors to focus correctly on faraway galaxies will be a challenge, says Feinberg. It will take two months just to unfurl the telescope, cool it down and position all the segments correctly. "Aligning the primary mirror segments as though they are a single large mirror means each one needs to be aligned to 1/10,000th the thickness of a human hair. What's even more amazing is that the engineers and scientists working on the Webb telescope literally had to invent how to do this."
`.trim();
        const res = await translate(text, {from: 'english', to: 'dutch'});
        t.truthy(res);
    } catch (err) {
        t.fail(err.code);
    }
});
