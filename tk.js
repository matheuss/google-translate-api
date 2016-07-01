/**
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
var got = require('got'),
    Configstore = require('configstore');

// BEGIN

function sM(a) {
    var b;
    if (null !== yr)
        b = yr;
    else {
        b = wr(String.fromCharCode(84));
        var c = wr(String.fromCharCode(75));
        b = [b(), b()];
        b[1] = c();
        b = (yr = window[b.join(c())] || "") || ""
    }
    var d = wr(String.fromCharCode(116))
        , c = wr(String.fromCharCode(107))
        , d = [d(), d()];
    d[1] = c();
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = xr(a, "+-a^+6");
    a = xr(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + "." + (a ^ b))
}

var yr = null;
var wr = function(a) {
    return function() {
        return a
    }
}
    , xr = function(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2)
            , d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
            , d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
};
var t = 'a';
var Yb = '+';

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

function updateTKK() {
    return new Promise(function (resolve, reject) {
        var now = Math.floor(Date.now() / 3600000);

        if (Number(window.TKK.split('.')[0]) == now) {
            resolve();
        } else {
            got('https://translate.google.com').then(function (res) {
                var code = res.body.match(/TKK=(.*?)\(\)\)'\);/g);

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

                resolve();
            }).catch(function (ignored) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                reject(e);
            });
        }
    });
}

module.exports = function get(text) {
    return updateTKK().then(function () {
        var tk = sM(text);
        tk = tk.replace('&tk=', '');
        return tk;
    }).catch(function (err) {
        throw err;
    });
};
