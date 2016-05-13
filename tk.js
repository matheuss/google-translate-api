/**
 * Created by Matheus Fernandes on 5/7/16.
 *
 * Last update: 2016/05/11
 * https://translate.google.com/translate/releases/twsfe_w_20160502_RC00/r/js/desktop_module_main.js
 *
 * The propose of this code is to generate the 'tk' parameter that is used by translate.google.com servers to validate
 * that the requests are actually coming from the official apps – and not from a tool like this API.
 *
 * Everything between 'BEGIN' and 'END' comments was copied and pasted from the url above.
 *
 */
var request = require('request'),
    Configstore = require('configstore');

// BEGIN

function sM(a) {
    var b;
    if (null !== rM)
        b = rM;
    else {
        b = pM(String.fromCharCode(84));
        var c = pM(String.fromCharCode(75));
        b = [b(), b()];
        b[1] = c();
        b = (rM = window[b.join(c())] || k) || k
    }
    var d = pM(String.fromCharCode(116))
        , c = pM(String.fromCharCode(107))
        , d = [d(), d()];
    d[1] = c();
    c = cb + d.join(k) +
        Ff;
    d = b.split(jd);
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = m >> 18 | 240,
            e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
            e[f++] = m >> 6 & 63 | 128),
            e[f++] = m & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = qM(a, $b);
    a = qM(a, Zb);
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + jd + (a ^ b))
}

var rM = null;
var pM = function (a) {
    return function () {
        return a
    }
};
var cb = '&';
var k = '';
var Ff = '=';
var jd = '.';
var t = 'a';
var Yb = '+';
var Zb = "+-3^+b+-f";
var $b = "+-a^+6";

var qM = function (a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2)
            , d = d >= t ? d.charCodeAt(0) - 87 : Number(d)
            , d = b.charAt(c + 1) == Yb ? a >>> d : a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
    }
    return a
};

// END

var config = new Configstore('google-translate-api');

var window = {
    TKK: config.get('TKK') || '0'
};

function updateTKK(cb) {
    var now = Math.floor(Date.now() / 3600000);

    if (Number(window.TKK.split('.')[0]) == now) {
        cb(null);
    } else {
        request.get('https://translate.google.com', function (err, res, body) {
            if (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                return cb(e);
            } else {
                var code = body.match(/TKK=(.*?)\(\)\)'\);/g);

                if (code) {
                    eval(code[0]);
                    if (typeof TKK != 'undefined') {
                        window.TKK = TKK;
                        config.set('TKK', TKK);
                    }
                }

                /**
                 * Note: If the regex or the eval fail, there is no need to worry. The server will accept
                 * relatively old seeds.
                 */

                cb(null);
            }
        });
    }
}

module.exports = function get(text, cb) {
    updateTKK(function (err) {
        if (err) return cb(err);

        var tk = sM(text);
        tk = tk.replace('&tk=', '');
        cb(null, tk);
    });
};