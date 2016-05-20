/**
 * Created by Matheus Fernandes on 5/11/16.
 */

var querystring = require('querystring');
var got = require('got');
var tk = require('./tk');

function translate(text, opts) {
    opts = opts || {};
    return tk(text).then(function (tk) {
        var url = 'https://translate.google.com/translate_a/single';
        var data = {
            client: 't',
            sl: opts.from || 'auto',
            tl: opts.to,
            hl: opts.from || 'en',
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            tk: opts.tk || tk,
            q: text
        };

        return url + '?' + querystring.stringify(data);
    }).then(function (url) {
        return got(url).then(function (res) {
            var result = {
                text: '',
                from: {
                    language: {
                        didYouMean: false,
                        iso: ''
                    },
                    text: {
                        autoCorrected: false,
                        value: '',
                        didYouMean: false
                    }
                },
                raw: ''
            };

            if (opts.raw) {
                result.raw = res.body;
            }

            var body = eval(res.body);
            body[0].forEach(function (obj) {
                if (obj[0] !== undefined) {
                    result.text += obj[0];
                }
            });

            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }

            if (body[7] !== undefined && body[7][0] !== undefined) {
                var str = body[7][0];

                str = str.replace(/<b><i>/g, '[');
                str = str.replace(/<\/i><\/b>/g, ']');

                result.from.text.value = str;

                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }

            return result;
        }).catch(function (err) {
            var e;
            if (err.statusCode !== undefined && err.statusCode !== 200) {
                e = new Error();
                e.code = 'BAD_REQUEST';
                throw e;
            } else {
                e = new Error();
                e.code = 'BAD_NETWORK';
                throw e;
            }
        });
    });
}

module.exports = translate;
