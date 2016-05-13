/**
 * Created by Matheus Fernandes on 5/11/16.
 */

var request = require("request"),
    querystring = require("querystring"),
    tk = require('./tk');

module.exports = function translate(from, to, text, cb) {
    tk(text, function (err, tk) {
        if (err) return cb(err);

        var url = 'https://translate.google.com/translate_a/single';
        var data = {
            client: 't',
            sl: from,
            tl: to,
            hl: from,
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            tk: tk,
            q: text
        };

        url += '?' + querystring.stringify(data);

        request.get({
            url: url
        }, function (err, res, body) {
            if (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                return cb(e);
            }

            if (res.statusCode != 200) {
                var e = new Error();
                e.code = 'BAD_REQUEST';
                return cb(e);
            }

            var result = '';
            eval(body)[0].forEach(function (obj) {
                if (obj[0] != undefined) {
                    result += obj[0];
                }
            });

            cb(null, result);
        });
    });
};