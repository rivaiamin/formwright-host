var e =
    (typeof globalThis == `object` && globalThis) ||
    (typeof window == `object` && window) ||
    (typeof self == `object` && self) ||
    (typeof global == `object` && global) ||
    (function () {
        return this;
    })();
function t() {}
function n(e) {
    return e == null || (typeof e != `object` && typeof e != `function`);
}
function r(e) {
    return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function i(e) {
    if (n(e)) {
        return e;
    }

    if (
        Array.isArray(e) ||
        r(e) ||
        e instanceof ArrayBuffer ||
        (typeof SharedArrayBuffer < `u` && e instanceof SharedArrayBuffer)
    ) {
        return e.slice(0);
    }

    let t = Object.getPrototypeOf(e);

    if (t == null) {
        return Object.assign(Object.create(t), e);
    }

    let i = t.constructor;

    if (e instanceof Date || e instanceof Map || e instanceof Set) {
        return new i(e);
    }

    if (e instanceof RegExp) {
        let t = new i(e);

        return ((t.lastIndex = e.lastIndex), t);
    }

    if (e instanceof DataView) {
        return new i(e.buffer.slice(0));
    }

    if (e instanceof Error) {
        let t;

        return (
            (t =
                e instanceof AggregateError
                    ? new i(e.errors, e.message, { cause: e.cause })
                    : new i(e.message, { cause: e.cause })),
            (t.stack = e.stack),
            Object.assign(t, e),
            t
        );
    }

    return typeof File < `u` && e instanceof File
        ? new i([e], e.name, { type: e.type, lastModified: e.lastModified })
        : typeof e == `object`
          ? Object.assign(Object.create(t), e)
          : e;
}
function a(t) {
    return e.Buffer !== void 0 && e.Buffer.isBuffer(t);
}
function o(e) {
    return Object.getOwnPropertySymbols(e).filter((t) =>
        Object.prototype.propertyIsEnumerable.call(e, t),
    );
}
function s(e) {
    return e == null
        ? e === void 0
            ? `[object Undefined]`
            : `[object Null]`
        : Object.prototype.toString.call(e);
}
var c = `[object RegExp]`,
    l = `[object String]`,
    u = `[object Number]`,
    d = `[object Boolean]`,
    f = `[object Arguments]`,
    p = `[object Symbol]`,
    m = `[object Date]`,
    h = `[object Map]`,
    g = `[object Set]`,
    _ = `[object Array]`,
    v = `[object Function]`,
    y = `[object ArrayBuffer]`,
    b = `[object Object]`,
    ee = `[object Error]`,
    x = `[object DataView]`,
    te = `[object Uint8Array]`,
    ne = `[object Uint8ClampedArray]`,
    re = `[object Uint16Array]`,
    ie = `[object Uint32Array]`,
    ae = `[object BigUint64Array]`,
    oe = `[object Int8Array]`,
    se = `[object Int16Array]`,
    ce = `[object Int32Array]`,
    le = `[object BigInt64Array]`,
    ue = `[object Float32Array]`,
    de = `[object Float64Array]`;
function fe(e, t) {
    return pe(e, void 0, e, new Map(), t);
}
function pe(e, t, i, o = new Map(), s = void 0) {
    let c = s?.(e, t, i, o);

    if (c !== void 0) {
        return c;
    }

    if (n(e)) {
        return e;
    }

    if (o.has(e)) {
        return o.get(e);
    }

    if (Array.isArray(e)) {
        let t = Array(e.length);
        o.set(e, t);

        for (let n = 0; n < e.length; n++) {
            t[n] = pe(e[n], n, i, o, s);
        }

        return (
            Object.hasOwn(e, `index`) && (t.index = e.index),
            Object.hasOwn(e, `input`) && (t.input = e.input),
            t
        );
    }

    if (e instanceof Date) {
        return new Date(e.getTime());
    }

    if (e instanceof RegExp) {
        let t = new RegExp(e.source, e.flags);

        return ((t.lastIndex = e.lastIndex), t);
    }

    if (e instanceof Map) {
        let t = new Map();
        o.set(e, t);

        for (let [n, r] of e) {
            t.set(n, pe(r, n, i, o, s));
        }

        return t;
    }

    if (e instanceof Set) {
        let t = new Set();
        o.set(e, t);

        for (let n of e) {
            t.add(pe(n, void 0, i, o, s));
        }

        return t;
    }

    if (a(e)) {
        return e.subarray();
    }

    if (r(e)) {
        let t = new (Object.getPrototypeOf(e).constructor)(e.length);
        o.set(e, t);

        for (let n = 0; n < e.length; n++) {
            t[n] = pe(e[n], n, i, o, s);
        }

        return t;
    }

    if (
        e instanceof ArrayBuffer ||
        (typeof SharedArrayBuffer < `u` && e instanceof SharedArrayBuffer)
    ) {
        return e.slice(0);
    }

    if (e instanceof DataView) {
        let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (typeof File < `u` && e instanceof File) {
        let t = new File([e], e.name, { type: e.type });

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (typeof Blob < `u` && e instanceof Blob) {
        let t = new Blob([e], { type: e.type });

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (e instanceof Error) {
        let t = structuredClone(e);

        return (
            o.set(e, t),
            (t.message = e.message),
            (t.name = e.name),
            (t.stack = e.stack),
            (t.cause = e.cause),
            (t.constructor = e.constructor),
            S(t, e, i, o, s),
            t
        );
    }

    if (e instanceof Boolean) {
        let t = new Boolean(e.valueOf());

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (e instanceof Number) {
        let t = new Number(e.valueOf());

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (e instanceof String) {
        let t = new String(e.valueOf());

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    if (typeof e == `object` && me(e)) {
        let t = Object.create(Object.getPrototypeOf(e));

        return (o.set(e, t), S(t, e, i, o, s), t);
    }

    return e;
}
function S(e, t, n = e, r, i) {
    let a = [...Object.keys(t), ...o(t)];

    for (let o = 0; o < a.length; o++) {
        let s = a[o],
            c = Object.getOwnPropertyDescriptor(e, s);
        (c == null || c.writable) && (e[s] = pe(t[s], s, n, r, i));
    }
}
function me(e) {
    switch (s(e)) {
        case f:
        case _:
        case y:
        case x:
        case d:
        case m:
        case ue:
        case de:
        case oe:
        case se:
        case ce:
        case h:
        case u:
        case b:
        case c:
        case g:
        case l:
        case p:
        case te:
        case ne:
        case re:
        case ie:
            return !0;
        default:
            return !1;
    }
}
function he(e) {
    return pe(e, void 0, e, new Map(), void 0);
}
function ge(e) {
    if (!e || typeof e != `object`) {
        return !1;
    }

    let t = Object.getPrototypeOf(e);

    return t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null
        ? Object.prototype.toString.call(e) === `[object Object]`
        : !1;
}
function _e(e) {
    return e === `__proto__`;
}
function ve(e) {
    if (typeof e != `object` || !e) {
        return !1;
    }

    if (Object.getPrototypeOf(e) === null) {
        return !0;
    }

    if (Object.prototype.toString.call(e) !== `[object Object]`) {
        let t = e[Symbol.toStringTag];

        return t == null ||
            !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable
            ? !1
            : e.toString() === `[object ${t}]`;
    }

    let t = e;

    for (; Object.getPrototypeOf(t) !== null;) {
        t = Object.getPrototypeOf(t);
    }

    return Object.getPrototypeOf(e) === t;
}
function ye(e, t) {
    return e === t || (Number.isNaN(e) && Number.isNaN(t));
}
function be(e, t, n) {
    return xe(e, t, void 0, void 0, void 0, void 0, n);
}
function xe(e, t, n, r, i, a, o) {
    let s = o(e, t, n, r, i, a);

    if (s !== void 0) {
        return s;
    }

    if (typeof e == typeof t) {
        switch (typeof e) {
            case `bigint`:
            case `string`:
            case `boolean`:
            case `symbol`:
            case `undefined`:
                return e === t;
            case `number`:
                return e === t || Object.is(e, t);
            case `function`:
                return e === t;
            case `object`:
                return Se(e, t, a, o);
        }
    }

    return Se(e, t, a, o);
}
function Se(e, t, n, r) {
    if (Object.is(e, t)) {
        return !0;
    }

    let i = s(e),
        f = s(t);

    if (
        (i === `[object Arguments]` && (i = b),
        f === `[object Arguments]` && (f = b),
        i !== f)
    ) {
        return !1;
    }

    switch (i) {
        case l:
            return e.toString() === t.toString();
        case u:
            return ye(e.valueOf(), t.valueOf());
        case d:
        case m:
        case p:
            return Object.is(e.valueOf(), t.valueOf());
        case c:
            return e.source === t.source && e.flags === t.flags;
        case v:
            return e === t;
    }

    n ??= new Map();
    let fe = n.get(e),
        pe = n.get(t);

    if (fe != null && pe != null) {
        return fe === t;
    }

    (n.set(e, t), n.set(t, e));

    try {
        switch (i) {
            case h:
                if (e.size !== t.size) {
                    return !1;
                }

                for (let [i, a] of e.entries()) {
                    if (!t.has(i) || !xe(a, t.get(i), i, e, t, n, r)) {
                        return !1;
                    }
                }

                return !0;
            case g: {
                if (e.size !== t.size) {
                    return !1;
                }

                let i = Array.from(e.values()),
                    a = Array.from(t.values());

                for (let o = 0; o < i.length; o++) {
                    let s = i[o],
                        c = a.findIndex((i) => xe(s, i, void 0, e, t, n, r));

                    if (c === -1) {
                        return !1;
                    }

                    a.splice(c, 1);
                }

                return !0;
            }
            case _:
            case te:
            case ne:
            case re:
            case ie:
            case ae:
            case oe:
            case se:
            case ce:
            case le:
            case ue:
            case de:
                if (a(e) !== a(t) || e.length !== t.length) {
                    return !1;
                }

                for (let i = 0; i < e.length; i++) {
                    if (!xe(e[i], t[i], i, e, t, n, r)) {
                        return !1;
                    }
                }

                return !0;
            case y:
                return e.byteLength === t.byteLength
                    ? Se(new Uint8Array(e), new Uint8Array(t), n, r)
                    : !1;
            case x:
                return e.byteLength !== t.byteLength ||
                    e.byteOffset !== t.byteOffset
                    ? !1
                    : Se(new Uint8Array(e), new Uint8Array(t), n, r);
            case ee:
                return e.name === t.name && e.message === t.message;
            case b: {
                if (!(
                    Se(e.constructor, t.constructor, n, r) ||
                    (ge(e) && ge(t))
                )) {
                    return !1;
                }

                let i = [...Object.keys(e), ...o(e)],
                    a = [...Object.keys(t), ...o(t)];

                if (i.length !== a.length) {
                    return !1;
                }

                for (let a = 0; a < i.length; a++) {
                    let o = i[a],
                        s = e[o];

                    if (!Object.hasOwn(t, o)) {
                        return !1;
                    }

                    let c = t[o];

                    if (!xe(s, c, o, e, t, n, r)) {
                        return !1;
                    }
                }

                return !0;
            }
            default:
                return !1;
        }
    } finally {
        (n.delete(e), n.delete(t));
    }
}
function Ce(e, n) {
    return be(e, n, t);
}
function we(e) {
    return Number.isSafeInteger(e) && e >= 0;
}
function Te(e) {
    return e != null && typeof e != `function` && we(e.length);
}
function Ee(e) {
    if (e == null) {
        return ``;
    }

    if (typeof e == `string`) {
        return e;
    }

    if (Array.isArray(e)) {
        return e.map(Ee).join(`,`);
    }

    let t = String(e);

    return t === `0` && Object.is(Number(e), -0) ? `-0` : t;
}
function De(e) {
    return typeof e == `string` || typeof e == `symbol`
        ? e
        : Object.is(e?.valueOf?.(), -0)
          ? `-0`
          : String(e);
}
function Oe(e) {
    if (Array.isArray(e)) {
        return e.map(De);
    }

    if (typeof e == `symbol`) {
        return [e];
    }

    e = Ee(e);
    let t = [],
        n = e.length;

    if (n === 0) {
        return t;
    }

    let r = 0,
        i = ``,
        a = ``,
        o = !1;

    for (e.charCodeAt(0) === 46 && t.push(``); r < n;) {
        let s = e[r];

        if (a) {
            s === `\\` && r + 1 < n
                ? (r++, (i += e[r]))
                : s === a
                  ? (a = ``)
                  : (i += s);
        } else if (o) {
            s === `"` || s === `'`
                ? (a = s)
                : s === `]`
                  ? ((o = !1), t.push(i), (i = ``))
                  : (i += s);
        } else if (s === `[`) {
            ((o = !0), (i &&= (t.push(i), ``)));
        } else if (s === `.`) {
            i &&= (t.push(i), ``);
            let n = e[r + 1];
            (n === void 0 || n === `.`) && t.push(``);
        } else {
            i += s;
        }

        r++;
    }

    return (i && t.push(i), t);
}
function ke(e) {
    switch (typeof e) {
        case `number`:
        case `symbol`:
            return !1;
        case `string`:
            return e.includes(`.`) || e.includes(`[`) || e.includes(`]`);
    }
}
function C(e, t, n) {
    if (e == null) {
        return n;
    }

    switch (typeof t) {
        case `string`: {
            if (_e(t)) {
                return n;
            }

            let r = e[t];

            return r === void 0
                ? ke(t) && !Object.hasOwn(e, t)
                    ? C(e, Oe(t), n)
                    : n
                : r;
        }
        case `number`:
        case `symbol`: {
            typeof t == `number` && (t = De(t));
            let r = e[t];

            return r === void 0 ? n : r;
        }
        default: {
            if (Array.isArray(t)) {
                return Ae(e, t, n);
            }

            if (((t = Object.is(t?.valueOf(), -0) ? `-0` : String(t)), _e(t))) {
                return n;
            }

            let r = e[t];

            return r === void 0 ? n : r;
        }
    }
}
function Ae(e, t, n) {
    if (t.length === 0) {
        return n;
    }

    let r = e;

    for (let e = 0; e < t.length; e++) {
        if (r == null || _e(t[e])) {
            return n;
        }

        r = r[t[e]];
    }

    return r === void 0 ? n : r;
}
function je(e) {
    return e !== null && (typeof e == `object` || typeof e == `function`);
}
function Me(e, t) {
    return fe(e, (n, r, i, a) => {
        let o = t?.(n, r, i, a);

        if (o !== void 0) {
            return o;
        }

        if (typeof e == `object`) {
            if (
                s(e) === `[object Object]` &&
                typeof e.constructor != `function`
            ) {
                let t = {};

                return (a.set(e, t), S(t, e, i, a), t);
            }

            switch (Object.prototype.toString.call(e)) {
                case u:
                case l:
                case d: {
                    let t = new e.constructor(e?.valueOf());

                    return (S(t, e), t);
                }
                case f: {
                    let t = {};

                    return (
                        S(t, e),
                        (t.length = e.length),
                        (t[Symbol.iterator] = e[Symbol.iterator]),
                        t
                    );
                }
                default:
                    return;
            }
        }
    });
}
function Ne(e) {
    return Me(e);
}
function Pe(e) {
    return typeof e == `object` && !!e && s(e) === `[object Arguments]`;
}
var Fe = /^(?:0|[1-9]\d*)$/;
function Ie(e, t = 2 ** 53 - 1) {
    switch (typeof e) {
        case `number`:
            return Number.isInteger(e) && e >= 0 && e < t;
        case `symbol`:
            return !1;
        case `string`:
            return Fe.test(e);
    }
}
function Le(e, t) {
    let n;

    if (
        ((n = Array.isArray(t)
            ? t
            : typeof t == `string` && ke(t) && e?.[t] == null
              ? Oe(t)
              : [t]),
        n.length === 0)
    ) {
        return !1;
    }

    let r = e;

    for (let e = 0; e < n.length; e++) {
        let t = n[e];

        if (
            (r == null || !Object.hasOwn(r, t)) &&
            !((Array.isArray(r) || Pe(r)) && Ie(t) && t < r.length)
        ) {
            return !1;
        }

        r = r[t];
    }

    return !0;
}
function Re(e) {
    return typeof e == `object` && !!e;
}
function ze(e) {
    return Re(e) && Te(e);
}
function Be(e) {
    return typeof e == `symbol` || e instanceof Symbol;
}
var Ve = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    He = /^\w*$/;
function Ue(e, t) {
    return Array.isArray(e)
        ? !1
        : typeof e == `number` || typeof e == `boolean` || e == null || Be(e)
          ? !0
          : (typeof e == `string` && (He.test(e) || !Ve.test(e))) ||
            (t != null && Object.hasOwn(t, e));
}
var We = (e, t, n) => {
    let r = e[t];
    (!(Object.hasOwn(e, t) && ye(r, n)) || (n === void 0 && !(t in e))) &&
        (e[t] = n);
};
function Ge(e, t, n, r) {
    if (e == null && !je(e)) {
        return e;
    }

    let i;
    i = Ue(t, e) ? [t] : Array.isArray(t) ? t : Oe(t);
    let a = n(C(e, i)),
        o = e;

    for (let t = 0; t < i.length && o != null; t++) {
        let n = De(i[t]);

        if (_e(n)) {
            continue;
        }

        let s;

        if (t === i.length - 1) {
            s = a;
        } else {
            let a = o[n],
                c = r?.(a, n, e);
            s = c === void 0 ? (je(a) ? a : Ie(i[t + 1]) ? [] : {}) : c;
        }

        (We(o, n, s), (o = o[n]));
    }

    return e;
}
function Ke(e, t, n) {
    return Ge(
        e,
        t,
        () => n,
        () => void 0,
    );
}
function qe(e) {
    return r(e);
}
function Je(e, ...t) {
    let n = t.slice(0, -1),
        r = t[t.length - 1],
        i = e;

    for (let e = 0; e < n.length; e++) {
        let t = n[e];
        i = Ye(i, t, r, new Map());
    }

    return i;
}
function Ye(e, t, r, s) {
    if ((n(e) && (e = Object(e)), typeof t != `object` || !t)) {
        return e;
    }

    if (s.has(t)) {
        return i(s.get(t));
    }

    if ((s.set(t, e), Array.isArray(t))) {
        t = t.slice();

        for (let e = 0; e < t.length; e++) {
            t[e] = t[e] ?? void 0;
        }
    }

    let c = [...Object.keys(t), ...o(t)];

    for (let n = 0; n < c.length; n++) {
        let i = c[n];

        if (_e(i)) {
            continue;
        }

        let o = t[i],
            l = e[i];

        if (
            (Pe(o) && (o = { ...o }),
            Pe(l) && (l = { ...l }),
            a(o) && (o = Ne(o)),
            Array.isArray(o))
        ) {
            if (Array.isArray(l)) {
                let e = [],
                    t = Reflect.ownKeys(l);

                for (let n = 0; n < t.length; n++) {
                    let r = t[n];
                    e[r] = l[r];
                }

                l = e;
            } else if (ze(l)) {
                let e = [];

                for (let t = 0; t < l.length; t++) {
                    e[t] = l[t];
                }

                l = e;
            } else {
                l = [];
            }
        }

        let u = r(l, o, i, e, t, s);
        u === void 0
            ? Array.isArray(o) ||
              (Re(l) && Re(o) && (ve(l) || ve(o) || qe(l) || qe(o)))
                ? (e[i] = Ye(l, o, r, s))
                : l == null && ve(o)
                  ? (e[i] = Ye({}, o, r, s))
                  : l == null && qe(o)
                    ? (e[i] = Ne(o))
                    : (l === void 0 || o !== void 0) && (e[i] = o)
            : (e[i] = u);
    }

    return e;
}
function Xe(e, ...n) {
    return Je(e, ...n, t);
}
var Ze = (e) =>
        (typeof File < `u` && e instanceof File) ||
        e instanceof Blob ||
        (typeof FileList < `u` && e instanceof FileList && e.length > 0),
    Qe = (e) =>
        e instanceof FormData
            ? !0
            : Ze(e) ||
              (typeof e == `object` &&
                  !!e &&
                  Object.values(e).some((e) => Qe(e))),
    $e = class extends Error {
        response;
        constructor(e) {
            (super(`HTTP error ${e.status}`),
                (this.name = `HttpResponseError`),
                (this.response = e));
        }
    },
    et = class extends Error {
        constructor(e = `Request was cancelled`) {
            (super(e), (this.name = `HttpCancelledError`));
        }
    },
    tt = class extends Error {
        constructor(e = `Network error`) {
            (super(e), (this.name = `HttpNetworkError`));
        }
    };
function nt(e) {
    let t = new URLSearchParams();

    return (
        Object.entries(e).forEach(([e, n]) => {
            n != null &&
                (Array.isArray(n)
                    ? n.forEach((n) => t.append(`${e}[]`, String(n)))
                    : typeof n == `object`
                      ? t.append(e, JSON.stringify(n))
                      : t.append(e, String(n)));
        }),
        t.toString()
    );
}
function rt(e, t, n) {
    if (
        (t &&
            !e.startsWith(`http://`) &&
            !e.startsWith(`https://`) &&
            (e = t.replace(/\/$/, ``) + `/` + e.replace(/^\//, ``)),
        n && Object.keys(n).length > 0)
    ) {
        let t = nt(n);
        t && (e += (e.includes(`?`) ? `&` : `?`) + t);
    }

    return e;
}
function it() {
    return typeof window > `u`
        ? null
        : (window.axios?.defaults?.headers?.common?.[`X-Requested-With`] ??
              null);
}
function at(e, t = new FormData(), n = null) {
    for (let r in e) {
        Object.prototype.hasOwnProperty.call(e, r) &&
            ot(t, n ? `${n}[${r}]` : r, e[r]);
    }

    return t;
}
function ot(e, t, n) {
    if (Array.isArray(n)) {
        return n.forEach((n, r) => ot(e, `${t}[${r}]`, n));
    }

    if (n instanceof Date) {
        return e.append(t, n.toISOString());
    }

    if (typeof File < `u` && n instanceof File) {
        return e.append(t, n, n.name);
    }

    if (n instanceof Blob) {
        return e.append(t, n);
    }

    if (typeof n == `boolean`) {
        return e.append(t, n ? `1` : `0`);
    }

    if (typeof n == `string`) {
        return e.append(t, n);
    }

    if (typeof n == `number`) {
        return e.append(t, `${n}`);
    }

    if (n == null) {
        return e.append(t, ``);
    }

    at(n, e, t);
}
function st(e, t) {
    if (e != null) {
        return e instanceof FormData
            ? e
            : typeof e == `object` && Qe(e)
              ? at(e)
              : typeof e == `object` ||
                  t[`Content-Type`]?.includes(`application/json`)
                ? JSON.stringify(e)
                : String(e);
    }
}
function ct(e) {
    let t = {};

    return (
        e.forEach((e, n) => {
            t[n.toLowerCase()] = e;
        }),
        t
    );
}
function lt(e = {}) {
    let t = e.xsrfCookieName ?? `XSRF-TOKEN`,
        n = e.xsrfHeaderName ?? `X-XSRF-TOKEN`;
    function r() {
        if (typeof document > `u`) {
            return null;
        }

        let e = document.cookie.match(RegExp(`(^|;\\s*)` + t + `=([^;]*)`));

        return e ? decodeURIComponent(e[2]) : null;
    }

    return {
        setXsrfCookieName(e) {
            t = e;
        },
        setXsrfHeaderName(e) {
            n = e;
        },
        async request(e) {
            let t = rt(e.url, e.baseURL, e.params),
                i = e.method.toUpperCase(),
                a = {},
                o = it();
            (o && (a[`X-Requested-With`] = o),
                e.data !== void 0 &&
                    ![`GET`, `DELETE`].includes(i) &&
                    !(e.data instanceof FormData) &&
                    !Qe(e.data) &&
                    (a[`Content-Type`] = `application/json`),
                e.headers &&
                    Object.entries(e.headers).forEach(([e, t]) => {
                        t !== void 0 && (a[e] = String(t));
                    }));
            let s = r();
            s && ![`GET`, `HEAD`, `OPTIONS`].includes(i) && (a[n] = s);
            let c = e.signal,
                l,
                u = e.timeout ?? 3e4;

            if (u > 0 && !c) {
                let e = new AbortController();
                ((c = e.signal), (l = setTimeout(() => e.abort(), u)));
            }

            let d = [`GET`, `DELETE`].includes(i) ? void 0 : st(e.data, a);
            d instanceof FormData && delete a[`Content-Type`];

            try {
                let n = await fetch(t, {
                    method: i,
                    headers: a,
                    body: d,
                    signal: c,
                    credentials: e.credentials ?? `same-origin`,
                });
                l && clearTimeout(l);
                let r;
                r = n.headers.get(`content-type`)?.includes(`application/json`)
                    ? await n.json()
                    : await n.text();
                let o = { status: n.status, data: r, headers: ct(n.headers) };

                if (!n.ok) {
                    throw new $e(o);
                }

                return o;
            } catch (e) {
                throw (
                    l && clearTimeout(l),
                    e instanceof $e
                        ? e
                        : e instanceof DOMException && e.name === `AbortError`
                          ? new et()
                          : e instanceof TypeError
                            ? new tt(e.message)
                            : e
                );
            }
        },
    };
}
var ut = lt(),
    dt = ut,
    ft = void 0,
    pt = void 0,
    mt = `same-origin`,
    ht = (e) => `${e.method}:${e.baseURL ?? ft ?? ``}${e.url}`,
    gt = (e) =>
        e.status === 204 && e.headers[`precognition-success`] === `true`,
    _t = {},
    vt = {
        get: (e, t = {}, n = {}) => bt(yt(`get`, e, t, n)),
        post: (e, t = {}, n = {}) => bt(yt(`post`, e, t, n)),
        patch: (e, t = {}, n = {}) => bt(yt(`patch`, e, t, n)),
        put: (e, t = {}, n = {}) => bt(yt(`put`, e, t, n)),
        delete: (e, t = {}, n = {}) => bt(yt(`delete`, e, t, n)),
        useHttpClient(e) {
            return ((dt = e), vt);
        },
        withBaseURL(e) {
            return ((ft = e), vt);
        },
        withTimeout(e) {
            return ((pt = e), vt);
        },
        withCredentials(e) {
            return (
                (mt = typeof e == `string` ? e : e ? `include` : `omit`),
                vt
            );
        },
        fingerprintRequestsUsing(e) {
            return ((ht = e === null ? () => null : e), vt);
        },
        determineSuccessUsing(e) {
            return ((gt = e), vt);
        },
        withXsrfCookieName(e) {
            return (ut.setXsrfCookieName(e), vt);
        },
        withXsrfHeaderName(e) {
            return (ut.setXsrfHeaderName(e), vt);
        },
    },
    yt = (e, t, n, r) => ({
        url: t,
        method: e,
        ...r,
        ...([`get`, `delete`].includes(e)
            ? { params: Xe({}, n, r?.params) }
            : { data: Xe({}, n, r?.data) }),
    }),
    bt = (e = {}) => {
        let t = [xt, Ct, wt].reduce((e, t) => t(e), e);

        return (t.onBefore ?? (() => !0))() === !1
            ? Promise.resolve(null)
            : ((t.onStart ?? (() => null))(),
              dt
                  .request({
                      method: t.method,
                      url: t.url,
                      baseURL: t.baseURL ?? ft,
                      data: t.data,
                      params: t.params,
                      headers: t.headers,
                      signal: t.signal,
                      timeout: t.timeout,
                      credentials: mt,
                  })
                  .then(
                      async (e) => {
                          t.precognitive && Tt(e);
                          let n = e.status,
                              r = e;

                          return (
                              t.precognitive &&
                                  t.onPrecognitionSuccess &&
                                  gt(e) &&
                                  (r = await Promise.resolve(
                                      t.onPrecognitionSuccess(e) ?? r,
                                  )),
                              t.onSuccess &&
                                  St(n) &&
                                  (r = await Promise.resolve(
                                      t.onSuccess(r) ?? r,
                                  )),
                              (Dt(t, n) ?? ((e) => e))(r) ?? r
                          );
                      },
                      (e) => {
                          if (Et(e)) {
                              return Promise.reject(e);
                          }

                          let n = e;

                          return (
                              t.precognitive && Tt(n.response),
                              (
                                  Dt(t, n.response.status) ??
                                  ((e, t) => Promise.reject(t))
                              )(n.response, n)
                          );
                      },
                  )
                  .finally(t.onFinish ?? (() => null)));
    },
    xt = (e) => {
        let t = e.only ?? e.validate;

        return {
            ...e,
            timeout: e.timeout ?? pt,
            precognitive: e.precognitive !== !1,
            fingerprint: e.fingerprint === void 0 ? ht(e, dt) : e.fingerprint,
            headers: {
                ...e.headers,
                Accept: `application/json`,
                'Content-Type': Ot(e),
                ...(e.precognitive === !1 ? {} : { Precognition: !0 }),
                ...(t
                    ? { 'Precognition-Validate-Only': Array.from(t).join() }
                    : {}),
            },
        };
    },
    St = (e) => e >= 200 && e < 300,
    Ct = (e) =>
        typeof e.fingerprint == `string`
            ? (_t[e.fingerprint]?.abort(), delete _t[e.fingerprint], e)
            : e,
    wt = (e) =>
        typeof e.fingerprint != `string` || e.signal || !e.precognitive
            ? e
            : ((_t[e.fingerprint] = new AbortController()),
              { ...e, signal: _t[e.fingerprint].signal }),
    Tt = (e) => {
        if (e.headers?.precognition !== `true`) {
            throw Error(
                `Did not receive a Precognition response. Ensure you have the Precognition middleware in place for the route.`,
            );
        }
    },
    Et = (e) => !(e instanceof $e) || typeof e.response?.status != `number`,
    Dt = (e, t) =>
        ({
            401: e.onUnauthorized,
            403: e.onForbidden,
            404: e.onNotFound,
            409: e.onConflict,
            422: e.onValidationError,
            423: e.onLocked,
        })[t],
    Ot = (e) =>
        e.headers?.[`Content-Type`] ??
        e.headers?.[`Content-type`] ??
        e.headers?.[`content-type`] ??
        (Qe(e.data) ? `multipart/form-data` : `application/json`),
    kt = `modulepreload`,
    At = function (e) {
        return `/build/` + e;
    },
    jt = {},
    Mt = function (e, t, n) {
        let r = Promise.resolve();

        if (t && t.length > 0) {
            let e = document.getElementsByTagName(`link`),
                i = document.querySelector(`meta[property=csp-nonce]`),
                a = i?.nonce || i?.getAttribute(`nonce`);
            function o(e) {
                return Promise.all(
                    e.map((e) =>
                        Promise.resolve(e).then(
                            (e) => ({ status: `fulfilled`, value: e }),
                            (e) => ({ status: `rejected`, reason: e }),
                        ),
                    ),
                );
            }
            function s(e) {
                return import.meta.resolve
                    ? import.meta.resolve(e)
                    : new URL(
                          e,
                          new URL(
                              `../../../src/node/plugins/importAnalysisBuild.ts`,
                              import.meta.url,
                          ),
                      ).href;
            }
            r = o(
                t.map((t) => {
                    if (((t = At(t, n)), (t = s(t)), t in jt)) {
                        return;
                    }

                    jt[t] = !0;
                    let r = t.endsWith(`.css`);

                    for (let n = e.length - 1; n >= 0; n--) {
                        let i = e[n];

                        if (i.href === t && (!r || i.rel === `stylesheet`)) {
                            return;
                        }
                    }

                    let i = document.createElement(`link`);

                    if (
                        ((i.rel = r ? `stylesheet` : kt),
                        r || (i.as = `script`),
                        (i.crossOrigin = ``),
                        (i.href = t),
                        a && i.setAttribute(`nonce`, a),
                        document.head.appendChild(i),
                        r)
                    ) {
                        return new Promise((e, n) => {
                            (i.addEventListener(`load`, e),
                                i.addEventListener(`error`, () =>
                                    n(Error(`Unable to preload CSS for ${t}`)),
                                ));
                        });
                    }
                }),
            );
        }

        function i(e) {
            let t = new Event(`vite:preloadError`, { cancelable: !0 });

            if (
                ((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented)
            ) {
                throw e;
            }
        }

        return r.then((t) => {
            for (let e of t || []) {
                e.status === `rejected` && i(e.reason);
            }

            return e().catch(i);
        });
    },
    Nt = new (class {
        config = {};
        defaults;
        constructor(e) {
            this.defaults = e;
        }
        extend(e) {
            return (e && (this.defaults = { ...this.defaults, ...e }), this);
        }
        replace(e) {
            this.config = e;
        }
        get(e) {
            return Le(this.config, e) ? C(this.config, e) : C(this.defaults, e);
        }
        set(e, t) {
            typeof e == `string`
                ? Ke(this.config, e, t)
                : Object.entries(e).forEach(([e, t]) => {
                      Ke(this.config, e, t);
                  });
        }
    })({
        form: {
            recentlySuccessfulDuration: 2e3,
            forceIndicesArrayFormatInFormData: !0,
            withAllErrors: !1,
        },
        prefetch: { cacheFor: 3e4, hoverDelay: 75 },
    });
function Pt(e, t) {
    let n;

    return function (...r) {
        (clearTimeout(n), (n = setTimeout(() => e.apply(this, r), t)));
    };
}
function w(e, t) {
    return document.dispatchEvent(new CustomEvent(`inertia:${e}`, t));
}
var Ft = (e) => w(`before`, { cancelable: !0, detail: { visit: e } }),
    It = (e, { page: t, visitId: n } = {}) =>
        w(`error`, { detail: { errors: e, page: t, visitId: n } }),
    Lt = (e) => w(`networkError`, { cancelable: !0, detail: { error: e } }),
    Rt = (e) => w(`finish`, { detail: { visit: e } }),
    zt = (e) => w(`httpException`, { cancelable: !0, detail: { response: e } }),
    Bt = (e) => w(`beforeUpdate`, { detail: { page: e } }),
    Vt = (e, { cached: t = !1, visitId: n } = {}) =>
        w(`navigate`, { detail: { page: e, cached: t, visitId: n } }),
    Ht = (e, { replace: t, visitId: n }) =>
        w(`clientVisit`, { detail: { page: e, replace: t, visitId: n } }),
    Ut = (e) => w(`progress`, { detail: { progress: e } }),
    Wt = (e) => w(`start`, { detail: { visit: e } }),
    Gt = (e, { visitId: t } = {}) =>
        w(`success`, { detail: { page: e, visitId: t } }),
    Kt = (e, t) =>
        w(`prefetched`, {
            detail: { fetchedAt: Date.now(), response: e, visit: t },
        }),
    qt = (e) => w(`prefetching`, { detail: { visit: e } }),
    Jt = (e) => w(`flash`, { detail: { flash: e } }),
    Yt = (e, t) =>
        w(`location`, { cancelable: !0, detail: { url: e, versionChange: t } }),
    T = class {
        static locationVisitKey = `inertiaLocationVisit`;
        static set(e, t) {
            typeof window < `u` &&
                window.sessionStorage.setItem(e, JSON.stringify(t));
        }
        static get(e) {
            if (typeof window < `u`) {
                return JSON.parse(window.sessionStorage.getItem(e) || `null`);
            }
        }
        static merge(e, t) {
            let n = this.get(e);
            n === null ? this.set(e, t) : this.set(e, { ...n, ...t });
        }
        static remove(e) {
            typeof window < `u` && window.sessionStorage.removeItem(e);
        }
        static removeNested(e, t) {
            let n = this.get(e);
            n !== null && (delete n[t], this.set(e, n));
        }
        static exists(e) {
            try {
                return this.get(e) !== null;
            } catch {
                return !1;
            }
        }
        static clear() {
            typeof window < `u` && window.sessionStorage.clear();
        }
    },
    Xt = async (e) => {
        if (typeof window > `u`) {
            throw Error(`Unable to encrypt history`);
        }

        let t = tn(),
            n = await an(await on());

        if (!n) {
            throw Error(`Unable to encrypt history`);
        }

        return await $t(t, n, e);
    },
    Zt = { key: `historyKey`, iv: `historyIv` },
    Qt = async (e) => {
        let t = tn(),
            n = await on();

        if (!n) {
            throw Error(`Unable to decrypt history`);
        }

        return await en(t, n, e);
    },
    $t = async (e, t, n) => {
        if (typeof window > `u`) {
            throw Error(`Unable to encrypt history`);
        }

        if (window.crypto.subtle === void 0) {
            return (
                console.warn(
                    `Encryption is not supported in this environment. SSL is required.`,
                ),
                Promise.resolve(n)
            );
        }

        let r = new TextEncoder(),
            i = JSON.stringify(n),
            a = new Uint8Array(i.length * 3),
            o = r.encodeInto(i, a);

        return window.crypto.subtle.encrypt(
            { name: `AES-GCM`, iv: e },
            t,
            a.subarray(0, o.written),
        );
    },
    en = async (e, t, n) => {
        if (window.crypto.subtle === void 0) {
            return (
                console.warn(
                    `Decryption is not supported in this environment. SSL is required.`,
                ),
                Promise.resolve(n)
            );
        }

        let r = await window.crypto.subtle.decrypt(
            { name: `AES-GCM`, iv: e },
            t,
            n,
        );

        return JSON.parse(new TextDecoder().decode(r));
    },
    tn = () => {
        let e = T.get(Zt.iv);

        if (e) {
            return new Uint8Array(e);
        }

        let t = window.crypto.getRandomValues(new Uint8Array(12));

        return (T.set(Zt.iv, Array.from(t)), t);
    },
    nn = async () =>
        window.crypto.subtle === void 0
            ? (console.warn(
                  `Encryption is not supported in this environment. SSL is required.`,
              ),
              Promise.resolve(null))
            : window.crypto.subtle.generateKey(
                  { name: `AES-GCM`, length: 256 },
                  !0,
                  [`encrypt`, `decrypt`],
              ),
    rn = async (e) => {
        if (window.crypto.subtle === void 0) {
            return (
                console.warn(
                    `Encryption is not supported in this environment. SSL is required.`,
                ),
                Promise.resolve()
            );
        }

        let t = await window.crypto.subtle.exportKey(`raw`, e);
        T.set(Zt.key, Array.from(new Uint8Array(t)));
    },
    an = async (e) => {
        if (e) {
            return e;
        }

        let t = await nn();

        return t ? (await rn(t), t) : null;
    },
    on = async () => {
        let e = T.get(Zt.key);

        return e
            ? await window.crypto.subtle.importKey(
                  `raw`,
                  new Uint8Array(e),
                  { name: `AES-GCM`, length: 256 },
                  !0,
                  [`encrypt`, `decrypt`],
              )
            : null;
    },
    sn = (e) => {
        let t = {};

        for (let n of Object.keys(e)) {
            e[n] !== void 0 && (t[n] = e[n]);
        }

        return t;
    },
    cn = (e, t, n) => {
        if (e === t) {
            return !0;
        }

        for (let r in e) {
            if (!n.includes(r) && e[r] !== t[r] && !ln(e[r], t[r])) {
                return !1;
            }
        }

        for (let r in t) {
            if (!n.includes(r) && !(r in e)) {
                return !1;
            }
        }

        return !0;
    },
    ln = (e, t) => {
        switch (typeof e) {
            case `object`:
                return cn(e, t, []);
            case `function`:
                return e.toString() === t.toString();
            default:
                return e === t;
        }
    },
    un = {
        ms: 1,
        s: 1e3,
        m: 1e3 * 60,
        h: 1e3 * 60 * 60,
        d: 1e3 * 60 * 60 * 24,
    },
    dn = (e) => {
        if (typeof e == `number`) {
            return e;
        }

        for (let [t, n] of Object.entries(un)) {
            if (e.endsWith(t)) {
                return parseFloat(e) * n;
            }
        }

        return parseInt(e);
    },
    fn = new (class {
        cached = [];
        inFlightRequests = [];
        removalTimers = [];
        currentUseId = null;
        add(e, t, { cacheFor: n, cacheTags: r }) {
            if (this.findInFlight(e)) {
                return Promise.resolve();
            }

            let i = this.findCached(e);

            if (!e.fresh && i && i.staleTimestamp > Date.now()) {
                return Promise.resolve();
            }

            let [a, o] = this.extractStaleValues(n),
                s = new Promise((n, r) => {
                    t({
                        ...e,
                        onCancel: () => {
                            (this.remove(e), e.onCancel(), r());
                        },
                        onError: (t) => {
                            (this.remove(e), e.onError(t), r());
                        },
                        onPrefetching(t) {
                            e.onPrefetching(t);
                        },
                        onPrefetched(t, n) {
                            e.onPrefetched(t, n);
                        },
                        onPrefetchResponse(e) {
                            n(e);
                        },
                        onPrefetchError(t) {
                            (fn.removeFromInFlight(e), r(t));
                        },
                    });
                }).then((t) => {
                    this.remove(e);
                    let n = t.getPageResponse();
                    (D.mergeOncePropsIntoResponse(n),
                        this.cached.push({
                            params: { ...e },
                            staleTimestamp: Date.now() + a,
                            expiresAt: Date.now() + o,
                            response: s,
                            singleUse: o === 0,
                            timestamp: Date.now(),
                            inFlight: !1,
                            tags: Array.isArray(r) ? r : [r],
                        }));
                    let i = this.getShortestOncePropTtl(n);

                    return (
                        this.scheduleForRemoval(e, i ? Math.min(o, i) : o),
                        this.removeFromInFlight(e),
                        t.handlePrefetch(),
                        t
                    );
                });

            return (
                this.inFlightRequests.push({
                    params: { ...e },
                    response: s,
                    staleTimestamp: null,
                    inFlight: !0,
                }),
                s
            );
        }
        removeAll() {
            ((this.cached = []),
                this.removalTimers.forEach((e) => {
                    clearTimeout(e.timer);
                }),
                (this.removalTimers = []));
        }
        removeByTags(e) {
            this.cached = this.cached.filter(
                (t) => !t.tags.some((t) => e.includes(t)),
            );
        }
        remove(e) {
            ((this.cached = this.cached.filter(
                (t) => !this.paramsAreEqual(t.params, e),
            )),
                this.clearTimer(e));
        }
        removeFromInFlight(e) {
            this.inFlightRequests = this.inFlightRequests.filter(
                (t) => !this.paramsAreEqual(t.params, e),
            );
        }
        extractStaleValues(e) {
            let [t, n] = this.cacheForToStaleAndExpires(e);

            return [dn(t), dn(n)];
        }
        cacheForToStaleAndExpires(e) {
            if (!Array.isArray(e)) {
                return [e, e];
            }

            switch (e.length) {
                case 0:
                    return [0, 0];
                case 1:
                    return [e[0], e[0]];
                default:
                    return [e[0], e[1]];
            }
        }
        clearTimer(e) {
            let t = this.removalTimers.find((t) =>
                this.paramsAreEqual(t.params, e),
            );
            t &&
                (clearTimeout(t.timer),
                (this.removalTimers = this.removalTimers.filter(
                    (e) => e !== t,
                )));
        }
        scheduleForRemoval(e, t) {
            if (!(typeof window > `u`) && (this.clearTimer(e), t > 0)) {
                let n = window.setTimeout(() => this.remove(e), t);
                this.removalTimers.push({ params: e, timer: n });
            }
        }
        get(e) {
            return this.findCached(e) || this.findInFlight(e);
        }
        use(e, t) {
            let n = `${t.url.pathname}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            this.currentUseId = n;
            let r = { ...t, cached: !0 };

            return e.response.then((e) => {
                if (this.currentUseId === n) {
                    return (
                        e.mergeParams({ ...r, onPrefetched: () => {} }),
                        this.removeSingleUseItems(t),
                        e.handle()
                    );
                }
            });
        }
        removeSingleUseItems(e) {
            this.cached = this.cached.filter((t) =>
                this.paramsAreEqual(t.params, e) ? !t.singleUse : !0,
            );
        }
        findCached(e) {
            return (
                this.cached.find((t) => this.paramsAreEqual(t.params, e)) ||
                null
            );
        }
        findInFlight(e) {
            return (
                this.inFlightRequests.find((t) =>
                    this.paramsAreEqual(t.params, e),
                ) || null
            );
        }
        withoutPurposePrefetchHeader(e) {
            let t = he(e);

            return (
                t.headers.Purpose === `prefetch` && delete t.headers.Purpose,
                t
            );
        }
        paramsAreEqual(e, t) {
            return cn(
                this.withoutPurposePrefetchHeader(e),
                this.withoutPurposePrefetchHeader(t),
                [
                    `id`,
                    `showProgress`,
                    `replace`,
                    `prefetch`,
                    `preserveScroll`,
                    `preserveState`,
                    `onBefore`,
                    `onBeforeUpdate`,
                    `onStart`,
                    `onProgress`,
                    `onFinish`,
                    `onCancel`,
                    `onSuccess`,
                    `onError`,
                    `onFlash`,
                    `onPrefetched`,
                    `onCancelToken`,
                    `onPrefetching`,
                    `async`,
                    `viewTransition`,
                    `optimistic`,
                    `component`,
                    `pageProps`,
                    `cached`,
                ],
            );
        }
        updateCachedOncePropsFromCurrentPage() {
            this.cached.forEach((e) => {
                e.response.then((t) => {
                    let n = t.getPageResponse();
                    D.mergeOncePropsIntoResponse(n, { force: !0 });

                    for (let [e, t] of Object.entries(n.deferredProps ?? {})) {
                        let r = t.filter((e) => C(n.props, e) === void 0);
                        r.length > 0
                            ? (n.deferredProps[e] = r)
                            : delete n.deferredProps[e];
                    }

                    let r = this.getShortestOncePropTtl(n);

                    if (r === null) {
                        return;
                    }

                    let i = e.expiresAt - Date.now(),
                        a = Math.min(i, r);
                    a > 0
                        ? this.scheduleForRemoval(e.params, a)
                        : this.remove(e.params);
                });
            });
        }
        getShortestOncePropTtl(e) {
            let t = Object.values(e.onceProps ?? {})
                .map((e) => e.expiresAt)
                .filter((e) => !!e);

            return t.length === 0 ? null : Math.min(...t) - Date.now();
        }
    })(),
    pn = (e, t = 1) => {
        window.requestAnimationFrame(() => {
            t > 1 ? pn(e, t - 1) : e();
        });
    },
    mn = (e) => {
        if (typeof window > `u`) {
            return null;
        }

        let t = document.querySelector(
            `script[data-page="${e}"][type="application/json"]`,
        );

        return t?.textContent ? JSON.parse(t.textContent) : null;
    },
    hn = typeof window > `u`,
    gn = !hn && /Firefox/i.test(window.navigator.userAgent),
    E = class {
        static save() {
            O.saveScrollPositions(this.getScrollRegions());
        }
        static getScrollRegions() {
            return Array.from(this.regions()).map((e) => ({
                top: e.scrollTop,
                left: e.scrollLeft,
            }));
        }
        static regions() {
            return document.querySelectorAll(`[scroll-region]`);
        }
        static scrollToTop() {
            if (
                gn &&
                getComputedStyle(document.documentElement).scrollBehavior ===
                    `smooth`
            ) {
                return pn(() => window.scrollTo(0, 0), 2);
            }

            window.scrollTo(0, 0);
        }
        static reset() {
            ((!hn && window.location.hash) || this.scrollToTop(),
                this.regions().forEach((e) => {
                    typeof e.scrollTo == `function`
                        ? e.scrollTo(0, 0)
                        : ((e.scrollTop = 0), (e.scrollLeft = 0));
                }),
                this.save(),
                this.scrollToAnchor());
        }
        static scrollToAnchor() {
            let e = hn ? null : window.location.hash;
            e &&
                setTimeout(() => {
                    let t = document.getElementById(e.slice(1));
                    t ? t.scrollIntoView() : this.scrollToTop();
                });
        }
        static restore(e) {
            hn ||
                window.requestAnimationFrame(() => {
                    (this.restoreDocument(), this.restoreScrollRegions(e));
                });
        }
        static restoreScrollRegions(e) {
            hn ||
                this.regions().forEach((t, n) => {
                    let r = e[n];
                    r &&
                        (typeof t.scrollTo == `function`
                            ? t.scrollTo(r.left, r.top)
                            : ((t.scrollTop = r.top), (t.scrollLeft = r.left)));
                });
        }
        static restoreDocument() {
            let e = O.getDocumentScrollPosition();
            window.scrollTo(e.left, e.top);
        }
        static onScroll(e) {
            let t = e.target;
            typeof t.hasAttribute == `function` &&
                t.hasAttribute(`scroll-region`) &&
                this.save();
        }
        static onWindowScroll() {
            O.saveDocumentScrollPosition({
                top: window.scrollY,
                left: window.scrollX,
            });
        }
    },
    _n = (e) =>
        (typeof File < `u` && e instanceof File) ||
        e instanceof Blob ||
        (typeof FileList < `u` && e instanceof FileList && e.length > 0);
function vn(e) {
    return (
        _n(e) ||
        (e instanceof FormData && Array.from(e.values()).some((e) => vn(e))) ||
        (typeof e == `object` && !!e && Object.values(e).some((e) => vn(e)))
    );
}
var yn = (e) => e instanceof FormData;
function bn(e, t = new FormData(), n = null, r = `brackets`) {
    e ||= {};

    for (let i in e) {
        Object.prototype.hasOwnProperty.call(e, i) &&
            Sn(t, xn(n, i, `indices`), e[i], r);
    }

    return t;
}
function xn(e, t, n) {
    return e ? (n === `brackets` ? `${e}[]` : `${e}[${t}]`) : t;
}
function Sn(e, t, n, r) {
    if (Array.isArray(n)) {
        return Array.from(n.keys()).forEach((i) =>
            Sn(e, xn(t, i.toString(), r), n[i], r),
        );
    }

    if (n instanceof Date) {
        return e.append(t, n.toISOString());
    }

    if (n instanceof File) {
        return e.append(t, n, n.name);
    }

    if (n instanceof Blob) {
        return e.append(t, n);
    }

    if (typeof n == `boolean`) {
        return e.append(t, n ? `1` : `0`);
    }

    if (typeof n == `string`) {
        return e.append(t, n);
    }

    if (typeof n == `number`) {
        return e.append(t, `${n}`);
    }

    if (n == null) {
        return e.append(t, ``);
    }

    bn(n, e, t, r);
}
function Cn(e) {
    return /\[\d+\]/.test(decodeURIComponent(e.search));
}
function wn(e) {
    if (!e || e === `?`) {
        return {};
    }

    let t = {};

    return (
        e
            .replace(/^\?/, ``)
            .split(`&`)
            .filter(Boolean)
            .forEach((e) => {
                let [n, r] = En(e);
                On(t, Dn(n), Dn(r));
            }),
        t
    );
}
function Tn(e, t) {
    let n = [];

    return (An(e, ``, n, t), n.length ? `?` + n.join(`&`) : ``);
}
function En(e) {
    let t = e.indexOf(`=`);

    return t === -1 ? [e, ``] : [e.substring(0, t), e.substring(t + 1)];
}
function Dn(e) {
    return decodeURIComponent(e.replace(/\+/g, ` `));
}
function On(e, t, n) {
    let r = kn(t);

    if (r.some((e) => e === `__proto__`)) {
        return;
    }

    let i = e;

    for (; r.length > 1;) {
        let e = r.shift(),
            t = r[0] === ``;
        ((typeof i[e] != `object` || i[e] === null) && (i[e] = t ? [] : {}),
            (i = i[e]));
    }

    let a = r.shift();
    a === `` && Array.isArray(i) ? i.push(n) : (i[a] = n);
}
function kn(e) {
    let t = [],
        n = e.split(`[`)[0];
    n && t.push(n);
    let r,
        i = /\[([^\]]*)\]/g;

    for (; (r = i.exec(e)) !== null;) {
        t.push(r[1]);
    }

    return t;
}
function An(e, t, n, r) {
    if (e !== void 0) {
        if (e === null) {
            n.push(`${t}=`);

            return;
        }

        if (Array.isArray(e)) {
            e.forEach((e, i) => {
                An(e, r === `indices` ? `${t}[${i}]` : `${t}[]`, n, r);
            });

            return;
        }

        if (typeof e == `object`) {
            Object.keys(e).forEach((i) => {
                An(e[i], t ? `${t}[${i}]` : i, n, r);
            });

            return;
        }

        n.push(`${t}=${encodeURIComponent(String(e))}`);
    }
}
function jn(e) {
    return new URL(
        e.toString(),
        typeof window > `u` ? void 0 : window.location.toString(),
    );
}
var Mn = (e, t, n, r, i) => {
    let a = typeof e == `string` ? jn(e) : e;

    if (
        ((vn(t) || r) &&
            !yn(t) &&
            (Nt.get(`form.forceIndicesArrayFormatInFormData`) &&
                (i = `indices`),
            (t = bn(t, new FormData(), null, i))),
        yn(t))
    ) {
        return [a, t];
    }

    let [o, s] = Nn(n, a, t, i);

    return [jn(o), s];
};
function Nn(e, t, n, r = `brackets`) {
    let i = e === `get` && !yn(n) && Object.keys(n).length > 0,
        a = zn(t.toString()),
        o = a || t.toString().startsWith(`/`) || t.toString() === ``,
        s =
            !o &&
            !t.toString().startsWith(`#`) &&
            !t.toString().startsWith(`?`),
        c = /^[.]{1,2}([/]|$)/.test(t.toString()),
        l = t.toString().includes(`?`) || i,
        u = t.toString().includes(`#`),
        d = new URL(
            t.toString(),
            typeof window > `u`
                ? `http://localhost`
                : window.location.toString(),
        );

    if (i) {
        let e = Cn(d) ? `indices` : r;
        d.search = Tn({ ...wn(d.search), ...n }, e);
    }

    return [
        [
            a ? `${d.protocol}//${d.host}` : ``,
            o ? d.pathname : ``,
            s ? d.pathname.substring(+!c) : ``,
            l ? d.search : ``,
            u ? d.hash : ``,
        ].join(``),
        i ? {} : n,
    ];
}
function Pn(e) {
    return ((e = new URL(e.href)), (e.hash = ``), e);
}
var Fn = (e, t) => {
        e.hash && !t.hash && Pn(e).href === t.href && (t.hash = e.hash);
    },
    In = (e, t) => Pn(e).href === Pn(t).href,
    Ln = (e, t) => e.origin === t.origin && e.pathname === t.pathname;
function Rn(e) {
    return (
        typeof e == `object` &&
        !!e &&
        e !== void 0 &&
        `url` in e &&
        `method` in e
    );
}
function zn(e) {
    return /^([a-z][a-z0-9+.-]*:)?\/\/[^/]/i.test(e);
}
var D = new (class {
        page;
        swapComponent;
        resolveComponent;
        onFlashCallback;
        componentId = {};
        listeners = [];
        isFirstPageLoad = !0;
        cleared = !1;
        pendingDeferredProps = null;
        historyQuotaExceeded = !1;
        optimisticBaseline = {};
        pendingOptimistics = [];
        optimisticCounter = 0;
        init({
            initialPage: e,
            swapComponent: t,
            resolveComponent: n,
            onFlash: r,
        }) {
            return (
                (this.page = {
                    ...e,
                    flash: e.flash ?? {},
                    rescuedProps: e.rescuedProps ?? [],
                }),
                (this.swapComponent = t),
                (this.resolveComponent = n),
                (this.onFlashCallback = r),
                Gn.on(`historyQuotaExceeded`, () => {
                    this.historyQuotaExceeded = !0;
                }),
                this
            );
        }
        set(
            e,
            {
                replace: t = !1,
                preserveScroll: n = !1,
                preserveState: r = !1,
                viewTransition: i = !1,
                cached: a = !1,
                visitId: o,
            } = {},
        ) {
            (Object.keys(e.deferredProps || {}).length &&
                ((this.pendingDeferredProps = {
                    deferredProps: e.deferredProps,
                    component: e.component,
                    url: e.url,
                }),
                e.initialDeferredProps === void 0 &&
                    (e.initialDeferredProps = e.deferredProps)),
                (this.componentId = {}));
            let s = this.componentId;

            return (
                e.clearHistory && O.clear(),
                this.resolve(e.component, e).then((c) => {
                    if (s !== this.componentId) {
                        return;
                    }

                    e.rememberedState ??= {};
                    let l = typeof window > `u`,
                        u = l ? new URL(e.url) : window.location,
                        d = !l && n ? E.getScrollRegions() : [];
                    t ||= In(jn(e.url), u);
                    let f = { ...e, flash: {} };

                    return new Promise((e) =>
                        t ? O.replaceState(f, e) : O.pushState(f, e),
                    ).then(() => {
                        let s = !this.isTheSame(e);

                        if (
                            (!s &&
                                Object.keys(e.props.errors || {}).length > 0 &&
                                (i = !1),
                            (this.page = e),
                            (this.cleared = !1),
                            this.hasOnceProps() &&
                                fn.updateCachedOncePropsFromCurrentPage(),
                            s && this.fireEventsFor(`newComponent`),
                            this.isFirstPageLoad &&
                                this.fireEventsFor(`firstLoad`),
                            (this.isFirstPageLoad = !1),
                            this.historyQuotaExceeded)
                        ) {
                            this.historyQuotaExceeded = !1;

                            return;
                        }

                        return this.swap({
                            component: c,
                            page: e,
                            preserveState: r,
                            viewTransition: i,
                        }).then(() => {
                            (n
                                ? window.requestAnimationFrame(() =>
                                      E.restoreScrollRegions(d),
                                  )
                                : E.reset(),
                                this.pendingDeferredProps &&
                                    this.pendingDeferredProps.component ===
                                        e.component &&
                                    this.pendingDeferredProps.url === e.url &&
                                    Gn.fireInternalEvent(
                                        `loadDeferredProps`,
                                        this.pendingDeferredProps.deferredProps,
                                    ),
                                (this.pendingDeferredProps = null),
                                t || Vt(e, { cached: a, visitId: o }));
                        });
                    });
                })
            );
        }
        setQuietly(e, { preserveState: t = !1 } = {}) {
            return this.resolve(e.component, e).then(
                (n) => (
                    (this.page = e),
                    (this.cleared = !1),
                    O.setCurrent(e),
                    this.swap({
                        component: n,
                        page: e,
                        preserveState: t,
                        viewTransition: !1,
                    })
                ),
            );
        }
        clear() {
            this.cleared = !0;
        }
        isCleared() {
            return this.cleared;
        }
        get() {
            return this.page;
        }
        getWithoutFlashData() {
            return { ...this.page, flash: {} };
        }
        hasOnceProps() {
            return Object.keys(this.page.onceProps ?? {}).length > 0;
        }
        merge(e) {
            this.page = { ...this.page, ...e };
        }
        setPropsQuietly(e) {
            return (
                (this.page = { ...this.page, props: e }),
                this.resolve(this.page.component, this.page).then((e) =>
                    this.swap({
                        component: e,
                        page: this.page,
                        preserveState: !0,
                        viewTransition: !1,
                    }),
                )
            );
        }
        setFlash(e) {
            ((this.page = { ...this.page, flash: e }),
                this.onFlashCallback?.(e));
        }
        setUrlHash(e) {
            this.page.url.includes(e) || (this.page.url += e);
        }
        remember(e) {
            this.page.rememberedState = e;
        }
        swap({ component: e, page: t, preserveState: n, viewTransition: r }) {
            let i = () =>
                this.swapComponent({ component: e, page: t, preserveState: n });

            if (
                !r ||
                !document?.startViewTransition ||
                document.visibilityState === `hidden`
            ) {
                return i();
            }

            let a = typeof r == `boolean` ? () => null : r;

            return new Promise((e) => {
                let t = document.startViewTransition(() => i().then(e));
                (t.ready.catch(() => {}), a(t));
            });
        }
        resolve(e, t) {
            return Promise.resolve(this.resolveComponent(e, t));
        }
        nextOptimisticId() {
            return ++this.optimisticCounter;
        }
        setBaseline(e, t) {
            e in this.optimisticBaseline || (this.optimisticBaseline[e] = t);
        }
        updateBaseline(e, t) {
            e in this.optimisticBaseline && (this.optimisticBaseline[e] = t);
        }
        hasBaseline(e) {
            return e in this.optimisticBaseline;
        }
        registerOptimistic(e, t) {
            this.pendingOptimistics.push({ id: e, callback: t });
        }
        unregisterOptimistic(e) {
            this.pendingOptimistics = this.pendingOptimistics.filter(
                (t) => t.id !== e,
            );
        }
        replayOptimistics() {
            let e = Object.keys(this.optimisticBaseline);

            if (e.length === 0) {
                return {};
            }

            let t = he(this.page.props);

            for (let n of e) {
                t[n] = he(this.optimisticBaseline[n]);
            }

            for (let { callback: e } of this.pendingOptimistics) {
                let n = e(he(t));
                n && Object.assign(t, n);
            }

            let n = {};

            for (let r of e) {
                n[r] = t[r];
            }

            return n;
        }
        pendingOptimisticCount() {
            return this.pendingOptimistics.length;
        }
        clearOptimisticState() {
            ((this.optimisticBaseline = {}), (this.pendingOptimistics = []));
        }
        isTheSame(e) {
            return this.page.component === e.component;
        }
        on(e, t) {
            return (
                this.listeners.push({ event: e, callback: t }),
                () => {
                    this.listeners = this.listeners.filter(
                        (n) => n.event !== e && n.callback !== t,
                    );
                }
            );
        }
        fireEventsFor(e) {
            this.listeners
                .filter((t) => t.event === e)
                .forEach((e) => e.callback());
        }
        mergeOncePropsIntoResponse(e, { force: t = !1 } = {}) {
            Object.entries(e.onceProps ?? {}).forEach(([n, r]) => {
                let i = this.page.onceProps?.[n];
                i !== void 0 &&
                    (t || C(e.props, r.prop) === void 0) &&
                    (Ke(e.props, r.prop, C(this.page.props, i.prop)),
                    (e.onceProps[n].expiresAt = i.expiresAt));
            });
        }
    })(),
    Bn = class {
        items = [];
        processingPromise = null;
        add(e) {
            return (this.items.push(e), this.process());
        }
        process() {
            return (
                (this.processingPromise ??= this.processNext().finally(() => {
                    this.processingPromise = null;
                })),
                this.processingPromise
            );
        }
        processNext() {
            let e = this.items.shift();

            return e
                ? Promise.resolve(e()).then(() => this.processNext())
                : Promise.resolve();
        }
    },
    Vn = typeof window > `u`,
    Hn = new Bn(),
    Un = !Vn && /CriOS/.test(window.navigator.userAgent),
    Wn = class {
        rememberedState = `rememberedState`;
        scrollRegions = `scrollRegions`;
        preserveUrl = !1;
        current = {};
        initialState = null;
        remember(e, t) {
            this.replaceState({
                ...D.getWithoutFlashData(),
                rememberedState: {
                    ...(D.get()?.rememberedState ?? {}),
                    [t]: e,
                },
            });
        }
        restore(e) {
            if (!Vn) {
                return this.current[this.rememberedState]?.[e] === void 0
                    ? this.initialState?.[this.rememberedState]?.[e]
                    : this.current[this.rememberedState]?.[e];
            }
        }
        pushState(e, t = null) {
            if (!Vn) {
                if (this.preserveUrl) {
                    t && t();

                    return;
                }

                ((this.current = e),
                    Hn.add(() =>
                        this.getPageData(e).then((n) => {
                            let r = () =>
                                this.doPushState({ page: n }, e.url).then(() =>
                                    t?.(),
                                );

                            return Un
                                ? new Promise((e) => {
                                      setTimeout(() => r().then(e));
                                  })
                                : r();
                        }),
                    ));
            }
        }
        clonePageProps(e) {
            try {
                return (structuredClone(e.props), e);
            } catch {
                return { ...e, props: he(e.props) };
            }
        }
        getPageData(e) {
            let t = this.clonePageProps(e);

            return new Promise((n) =>
                e.encryptHistory ? Xt(t).then(n) : n(t),
            );
        }
        processQueue() {
            return Hn.process();
        }
        decrypt(e = null) {
            if (Vn) {
                return Promise.resolve(e ?? D.get());
            }

            let t = e ?? window.history.state?.page;

            return this.decryptPageData(t).then((e) => {
                if (!e) {
                    throw Error(`Unable to decrypt history`);
                }

                return (
                    this.initialState === null
                        ? (this.initialState = e ?? void 0)
                        : (this.current = e ?? {}),
                    e
                );
            });
        }
        decryptPageData(e) {
            return e instanceof ArrayBuffer ? Qt(e) : Promise.resolve(e);
        }
        saveScrollPositions(e) {
            Hn.add(() =>
                Promise.resolve().then(() => {
                    if (
                        window.history.state?.page &&
                        !Ce(this.getScrollRegions(), e)
                    ) {
                        return this.doReplaceState({
                            page: window.history.state.page,
                            scrollRegions: e,
                        });
                    }
                }),
            );
        }
        saveDocumentScrollPosition(e) {
            Hn.add(() =>
                Promise.resolve().then(() => {
                    if (
                        window.history.state?.page &&
                        !Ce(this.getDocumentScrollPosition(), e)
                    ) {
                        return this.doReplaceState({
                            page: window.history.state.page,
                            documentScrollPosition: e,
                        });
                    }
                }),
            );
        }
        getScrollRegions() {
            return window.history.state?.scrollRegions || [];
        }
        getDocumentScrollPosition() {
            return (
                window.history.state?.documentScrollPosition || {
                    top: 0,
                    left: 0,
                }
            );
        }
        replaceState(e, t = null) {
            if (Ce(this.current, e)) {
                t && t();

                return;
            }

            let { flash: n, ...r } = e;

            if ((D.merge(r), !Vn)) {
                if (this.preserveUrl) {
                    t && t();

                    return;
                }

                ((this.current = e),
                    Hn.add(() =>
                        this.getPageData(e).then((n) => {
                            let r = () =>
                                this.doReplaceState({ page: n }, e.url).then(
                                    () => t?.(),
                                );

                            return Un
                                ? new Promise((e) => {
                                      setTimeout(() => r().then(e));
                                  })
                                : r();
                        }),
                    ));
            }
        }
        isHistoryThrottleError(e) {
            return (
                e instanceof Error &&
                e.name === `SecurityError` &&
                (e.message.includes(`history.pushState`) ||
                    e.message.includes(`history.replaceState`))
            );
        }
        isQuotaExceededError(e) {
            return e instanceof Error && e.name === `QuotaExceededError`;
        }
        withThrottleProtection(e) {
            return Promise.resolve().then(() => {
                try {
                    return e();
                } catch (e) {
                    if (!this.isHistoryThrottleError(e)) {
                        throw e;
                    }

                    console.error(e.message);
                }
            });
        }
        doReplaceState(e, t) {
            return this.withThrottleProtection(() => {
                window.history.replaceState(
                    {
                        ...e,
                        scrollRegions:
                            e.scrollRegions ??
                            window.history.state?.scrollRegions,
                        documentScrollPosition:
                            e.documentScrollPosition ??
                            window.history.state?.documentScrollPosition,
                    },
                    ``,
                    t,
                );
            });
        }
        doPushState(e, t) {
            return this.withThrottleProtection(() => {
                try {
                    window.history.pushState(e, ``, t);
                } catch (e) {
                    if (!this.isQuotaExceededError(e)) {
                        throw e;
                    }

                    Gn.fireInternalEvent(`historyQuotaExceeded`, t);
                }
            });
        }
        getState(e, t) {
            return this.current?.[e] ?? t;
        }
        deleteState(e) {
            this.current[e] !== void 0 &&
                (delete this.current[e], this.replaceState(this.current));
        }
        clearInitialState(e) {
            this.initialState &&
                this.initialState[e] !== void 0 &&
                delete this.initialState[e];
        }
        browserHasHistoryEntry() {
            return !Vn && !!window.history.state?.page;
        }
        clear() {
            (T.remove(Zt.key), T.remove(Zt.iv));
        }
        setCurrent(e) {
            this.current = e;
        }
        isValidState(e) {
            return !!e.page;
        }
        getAllState() {
            return this.current;
        }
    };
typeof window < `u` &&
    window.history.scrollRestoration &&
    (window.history.scrollRestoration = `manual`);
var O = new Wn(),
    Gn = new (class {
        internalListeners = [];
        init() {
            (typeof window < `u` &&
                (window.addEventListener(
                    `popstate`,
                    this.handlePopstateEvent.bind(this),
                ),
                window.addEventListener(
                    `pageshow`,
                    this.handlePageshowEvent.bind(this),
                ),
                window.addEventListener(
                    `scroll`,
                    Pt(E.onWindowScroll.bind(E), 100),
                    !0,
                )),
                typeof document < `u` &&
                    document.addEventListener(
                        `scroll`,
                        Pt(E.onScroll.bind(E), 100),
                        !0,
                    ));
        }
        onGlobalEvent(e, t) {
            return this.registerListener(`inertia:${e}`, (e) => {
                let n = t(e);
                e.cancelable &&
                    !e.defaultPrevented &&
                    n === !1 &&
                    e.preventDefault();
            });
        }
        on(e, t) {
            return (
                this.internalListeners.push({ event: e, listener: t }),
                () => {
                    this.internalListeners = this.internalListeners.filter(
                        (e) => e.listener !== t,
                    );
                }
            );
        }
        onMissingHistoryItem() {
            (D.clear(), this.fireInternalEvent(`missingHistoryItem`));
        }
        fireInternalEvent(e, ...t) {
            this.internalListeners
                .filter((t) => t.event === e)
                .forEach((e) => e.listener(...t));
        }
        registerListener(e, t) {
            return (
                document.addEventListener(e, t),
                () => document.removeEventListener(e, t)
            );
        }
        handlePageshowEvent(e) {
            e.persisted && O.decrypt().catch(() => this.onMissingHistoryItem());
        }
        handlePopstateEvent(e) {
            let t = e.state || null;

            if (t === null) {
                let e = jn(D.get().url);
                ((e.hash = window.location.hash),
                    O.replaceState({ ...D.getWithoutFlashData(), url: e.href }),
                    E.reset());

                return;
            }

            if (!O.isValidState(t)) {
                return this.onMissingHistoryItem();
            }

            O.decrypt(t.page)
                .then((e) => {
                    if (D.get().version !== e.version) {
                        this.onMissingHistoryItem();

                        return;
                    }

                    (ai.cancelAll({ prefetch: !1 }),
                        D.setQuietly(e, { preserveState: !1 }).then(() => {
                            (E.restore(O.getScrollRegions()), Vt(D.get()));
                            let t = {},
                                n = D.get().props;

                            for (let [r, i] of Object.entries(
                                e.initialDeferredProps ?? e.deferredProps ?? {},
                            )) {
                                let e = i.filter((e) => C(n, e) === void 0);
                                e.length > 0 && (t[r] = e);
                            }

                            Object.keys(t).length > 0 &&
                                this.fireInternalEvent(`loadDeferredProps`, t);
                        }));
                })
                .catch(() => {
                    this.onMissingHistoryItem();
                });
        }
    })(),
    Kn = new (class {
        type;
        constructor() {
            this.type = this.resolveType();
        }
        resolveType() {
            return typeof window > `u`
                ? `navigate`
                : (window.performance?.getEntriesByType(`navigation`)[0]
                      ?.type ?? `navigate`);
        }
        get() {
            return this.type;
        }
        isBackForward() {
            return this.type === `back_forward`;
        }
        isReload() {
            return this.type === `reload`;
        }
    })();
function qn() {
    let e = typeof window < `u` ? window.crypto : void 0;

    if (e?.randomUUID) {
        return e.randomUUID();
    }

    let t = () =>
        e?.getRandomValues
            ? e.getRandomValues(new Uint8Array(1))[0]
            : Math.floor(Math.random() * 256);

    return `10000000-1000-4000-8000-100000000000`.replace(/[018]/g, (e) =>
        (e ^ (t() & (15 >> (e / 4)))).toString(16),
    );
}
var Jn = class {
        static handle() {
            (this.clearRememberedStateOnReload(),
                [
                    this.handleBackForward,
                    this.handleLocation,
                    this.handleDefault,
                ].find((e) => e.bind(this)()));
        }
        static clearRememberedStateOnReload() {
            Kn.isReload() &&
                (O.deleteState(O.rememberedState),
                O.clearInitialState(O.rememberedState));
        }
        static handleBackForward() {
            if (!Kn.isBackForward() || !O.browserHasHistoryEntry()) {
                return !1;
            }

            let e = O.getScrollRegions();

            return (
                O.decrypt()
                    .then((t) => {
                        let n = qn();
                        D.set(t, {
                            preserveScroll: !0,
                            preserveState: !0,
                            visitId: n,
                        }).then(() => {
                            (E.restore(e), Vt(D.get(), { visitId: n }));
                        });
                    })
                    .catch(() => {
                        Gn.onMissingHistoryItem();
                    }),
                !0
            );
        }
        static handleLocation() {
            if (!T.exists(T.locationVisitKey)) {
                return !1;
            }

            let e = T.get(T.locationVisitKey) || {};

            return (
                T.remove(T.locationVisitKey),
                typeof window < `u` && D.setUrlHash(window.location.hash),
                O.decrypt(D.get())
                    .then(() => {
                        let t = qn(),
                            n = O.getState(O.rememberedState, {}),
                            r = O.getScrollRegions();
                        (D.remember(n),
                            D.set(D.get(), {
                                preserveScroll: e.preserveScroll,
                                preserveState: !0,
                                visitId: t,
                            }).then(() => {
                                (e.preserveScroll && E.restore(r),
                                    this.fireInitialEvents(t));
                            }));
                    })
                    .catch(() => {
                        Gn.onMissingHistoryItem();
                    }),
                !0
            );
        }
        static handleDefault() {
            typeof window < `u` && D.setUrlHash(window.location.hash);
            let e = qn();
            D.set(D.get(), {
                preserveScroll: !0,
                preserveState: !0,
                visitId: e,
            }).then(() => {
                (Kn.isReload()
                    ? E.restore(O.getScrollRegions())
                    : E.scrollToAnchor(),
                    this.fireInitialEvents(e));
            });
        }
        static fireInitialEvents(e) {
            let t = D.get();
            (Vt(t, { visitId: e }),
                Object.keys(t.flash).length > 0 &&
                    queueMicrotask(() => Jt(t.flash)));
        }
    },
    Yn = class {
        intervalId = null;
        timeoutId = null;
        throttle = !1;
        keepAlive = !1;
        cb;
        interval;
        cbCount = 0;
        mode;
        inFlight = !1;
        currentCancel = null;
        stopped = !0;
        instanceId = 0;
        constructor(e, t, n) {
            ((this.keepAlive = n.keepAlive ?? !1),
                (this.mode = n.mode ?? `overlap`),
                (this.cb = t),
                (this.interval = e),
                (n.autoStart ?? !0) && this.start());
        }
        stop() {
            ((this.stopped = !0),
                this.instanceId++,
                (this.inFlight = !1),
                (this.currentCancel = null),
                (this.intervalId &&= (clearInterval(this.intervalId), null)),
                (this.timeoutId &&= (clearTimeout(this.timeoutId), null)));
        }
        start() {
            if (!(typeof window > `u`)) {
                if ((this.stop(), (this.stopped = !1), this.mode === `rest`)) {
                    this.scheduleNext();

                    return;
                }

                this.intervalId = window.setInterval(
                    () => this.tick(),
                    this.interval,
                );
            }
        }
        isInBackground(e) {
            ((this.throttle = this.keepAlive ? !1 : e),
                this.throttle && (this.cbCount = 0));
        }
        scheduleNext() {
            this.stopped ||
                (this.timeoutId = window.setTimeout(() => {
                    ((this.timeoutId = null), this.tick());
                }, this.interval));
        }
        tick() {
            (!this.throttle || this.cbCount % 10 == 0
                ? this.fire()
                : this.mode === `rest` && this.scheduleNext(),
                this.throttle && this.cbCount++);
        }
        fire() {
            this.inFlight && this.mode === `cancel` && this.currentCancel?.();
            let e = this.instanceId;
            this.cb({
                onStart: (t) => {
                    e === this.instanceId &&
                        ((this.inFlight = !0), (this.currentCancel = t));
                },
                onFinish: () => {
                    e === this.instanceId &&
                        ((this.inFlight = !1),
                        (this.currentCancel = null),
                        this.mode === `rest` && this.scheduleNext());
                },
            });
        }
    },
    Xn = new (class {
        polls = [];
        constructor() {
            this.setupVisibilityListener();
        }
        get count() {
            return this.polls.length;
        }
        add(e, t, n) {
            let r = new Yn(e, t, n);

            return (
                this.polls.push(r),
                {
                    stop: () => r.stop(),
                    start: () => r.start(),
                    destroy: () => {
                        (r.stop(),
                            (this.polls = this.polls.filter((e) => e !== r)));
                    },
                }
            );
        }
        clear() {
            (this.polls.forEach((e) => e.stop()), (this.polls = []));
        }
        setupVisibilityListener() {
            typeof document > `u` ||
                document.addEventListener(
                    `visibilitychange`,
                    () => {
                        this.polls.forEach((e) =>
                            e.isInBackground(document.hidden),
                        );
                    },
                    !1,
                );
        }
    })(),
    k = new (class {
        requestHandlers = [];
        responseHandlers = [];
        errorHandlers = [];
        onRequest(e) {
            return (
                this.requestHandlers.push(e),
                () => {
                    this.requestHandlers = this.requestHandlers.filter(
                        (t) => t !== e,
                    );
                }
            );
        }
        onResponse(e) {
            return (
                this.responseHandlers.push(e),
                () => {
                    this.responseHandlers = this.responseHandlers.filter(
                        (t) => t !== e,
                    );
                }
            );
        }
        onError(e) {
            return (
                this.errorHandlers.push(e),
                () => {
                    this.errorHandlers = this.errorHandlers.filter(
                        (t) => t !== e,
                    );
                }
            );
        }
        async processRequest(e) {
            let t = e;

            for (let e of this.requestHandlers) {
                t = await e(t);
            }

            return t;
        }
        async processResponse(e) {
            let t = e;

            for (let e of this.responseHandlers) {
                t = await e(t);
            }

            return t;
        }
        async processError(e) {
            for (let t of this.errorHandlers) {
                await t(e);
            }
        }
    })(),
    Zn = class extends Error {
        code;
        url;
        constructor(e, t, n) {
            (super(n ? `${e} (${n})` : e),
                (this.name = `HttpError`),
                (this.code = t),
                (this.url = n));
        }
    },
    Qn = class extends Zn {
        response;
        constructor(e, t, n) {
            (super(e, `ERR_HTTP_RESPONSE`, n),
                (this.name = `HttpResponseError`),
                (this.response = t));
        }
    },
    $n = class extends Zn {
        constructor(e = `Request was cancelled`, t) {
            (super(e, `ERR_CANCELLED`, t), (this.name = `HttpCancelledError`));
        }
    },
    er = class extends Zn {
        cause;
        constructor(e, t, n) {
            (super(e, `ERR_NETWORK`, t),
                (this.name = `HttpNetworkError`),
                (this.cause = n));
        }
    };
function tr(e) {
    let t = document.cookie.match(RegExp(`(^|;\\s*)(` + e + `)=([^;]*)`));

    return t ? decodeURIComponent(t[3]) : null;
}
function nr(e) {
    let t = {};

    return (
        e
            .getAllResponseHeaders()
            .split(
                `\r
`,
            )
            .forEach((e) => {
                let n = e.indexOf(`:`);
                n > 0 &&
                    (t[e.slice(0, n).toLowerCase().trim()] = e
                        .slice(n + 1)
                        .trim());
            }),
        t
    );
}
function rr(e, t) {
    if (!t.headers) {
        return;
    }

    let n = t.data instanceof FormData;
    Object.entries(t.headers).forEach(([t, r]) => {
        (t.toLowerCase() !== `content-type` || !n) &&
            e.setRequestHeader(t, String(r));
    });
}
function ir(e, t) {
    if (!t || Object.keys(t).length === 0) {
        return e;
    }

    let [n] = Nn(`get`, e, t);

    return n;
}
var ar = class {
        xsrfCookieName;
        xsrfHeaderName;
        constructor(e = {}) {
            ((this.xsrfCookieName = e.xsrfCookieName ?? `XSRF-TOKEN`),
                (this.xsrfHeaderName = e.xsrfHeaderName ?? `X-XSRF-TOKEN`));
        }
        async request(e) {
            let t = await k.processRequest(e);

            try {
                let e = await this.doRequest(t);

                return await k.processResponse(e);
            } catch (e) {
                throw (
                    (e instanceof Qn || e instanceof er || e instanceof $n) &&
                        (await k.processError(e)),
                    e
                );
            }
        }
        doRequest(e) {
            return new Promise((t, n) => {
                let r = new XMLHttpRequest(),
                    i = ir(e.url, e.params);
                r.open(e.method.toUpperCase(), i, !0);
                let a = tr(this.xsrfCookieName);
                (a && r.setRequestHeader(this.xsrfHeaderName, a),
                    Object.keys(e.headers ?? {}).some(
                        (e) => e.toLowerCase() === `x-requested-with`,
                    ) ||
                        r.setRequestHeader(
                            `X-Requested-With`,
                            `XMLHttpRequest`,
                        ));
                let o = null;
                (e.data !== null &&
                    e.data !== void 0 &&
                    (e.data instanceof FormData
                        ? (o = e.data)
                        : typeof e.data == `object`
                          ? ((o = JSON.stringify(e.data)),
                            !e.headers?.[`Content-Type`] &&
                                !e.headers?.[`content-type`] &&
                                r.setRequestHeader(
                                    `Content-Type`,
                                    `application/json`,
                                ))
                          : (o = String(e.data))),
                    rr(r, e),
                    e.onUploadProgress &&
                        (r.upload.onprogress = (t) => {
                            let n = t.lengthComputable
                                ? t.loaded / t.total
                                : void 0;
                            e.onUploadProgress({
                                progress: n,
                                percentage: n ? Math.round(n * 100) : 0,
                                loaded: t.loaded,
                                total: t.lengthComputable ? t.total : void 0,
                            });
                        }),
                    e.signal &&
                        e.signal.addEventListener(`abort`, () => r.abort()),
                    (r.onabort = () =>
                        n(new $n(`Request was cancelled`, e.url))),
                    (r.onerror = () => n(new er(`Network error`, e.url))),
                    (r.onload = () => {
                        let i = {
                            status: r.status,
                            data: r.responseText,
                            headers: nr(r),
                        };
                        r.status >= 400
                            ? n(
                                  new Qn(
                                      `Request failed with status ${r.status}`,
                                      i,
                                      e.url,
                                  ),
                              )
                            : t(i);
                    }),
                    r.send(o));
            });
        }
    },
    or = new ar();
function sr(e) {
    return !(`request` in e);
}
var cr = {
        getClient() {
            return or;
        },
        setClient(e) {
            if (!sr(e)) {
                or = e;

                return;
            }

            ((or = new ar(e)),
                e.xsrfCookieName && vt.withXsrfCookieName(e.xsrfCookieName),
                e.xsrfHeaderName && vt.withXsrfHeaderName(e.xsrfHeaderName));
        },
        onRequest: k.onRequest.bind(k),
        onResponse: k.onResponse.bind(k),
        onError: k.onError.bind(k),
        processRequest: k.processRequest.bind(k),
        processResponse: k.processResponse.bind(k),
        processError: k.processError.bind(k),
    },
    lr = new (class {
        requestHandlers = [];
        responseHandlers = [];
        onVisitRequest(e) {
            return (
                this.requestHandlers.push(e),
                () => {
                    this.requestHandlers = this.requestHandlers.filter(
                        (t) => t !== e,
                    );
                }
            );
        }
        onVisitResponse(e) {
            return (
                this.responseHandlers.push(e),
                () => {
                    this.responseHandlers = this.responseHandlers.filter(
                        (t) => t !== e,
                    );
                }
            );
        }
        async processRequest(e, t) {
            let n = t;

            for (let t of this.requestHandlers) {
                n = await t(e, n);
            }

            return n;
        }
        async processResponse(e, t) {
            let n = t;

            for (let t of this.responseHandlers) {
                n = await t(e, n);
            }

            return n;
        }
    })();
function ur() {
    typeof window > `u` || (window.__inertia_interceptors__ = lr);
}
var dr = class e {
        callbacks = [];
        params;
        constructor(e) {
            if (!e.prefetch) {
                this.params = e;
            } else {
                let t = {
                    onBefore: this.wrapCallback(e, `onBefore`),
                    onBeforeUpdate: this.wrapCallback(e, `onBeforeUpdate`),
                    onStart: this.wrapCallback(e, `onStart`),
                    onProgress: this.wrapCallback(e, `onProgress`),
                    onFinish: this.wrapCallback(e, `onFinish`),
                    onCancel: this.wrapCallback(e, `onCancel`),
                    onSuccess: this.wrapCallback(e, `onSuccess`),
                    onError: this.wrapCallback(e, `onError`),
                    onHttpException: this.wrapCallback(e, `onHttpException`),
                    onNetworkError: this.wrapCallback(e, `onNetworkError`),
                    onFlash: this.wrapCallback(e, `onFlash`),
                    onCancelToken: this.wrapCallback(e, `onCancelToken`),
                    onPrefetched: this.wrapCallback(e, `onPrefetched`),
                    onPrefetching: this.wrapCallback(e, `onPrefetching`),
                };
                this.params = {
                    ...e,
                    ...t,
                    onPrefetchResponse: e.onPrefetchResponse || (() => {}),
                    onPrefetchError: e.onPrefetchError || (() => {}),
                };
            }
        }
        static create(t) {
            return new e(t);
        }
        data() {
            return this.params.method === `get` ? null : this.params.data;
        }
        queryParams() {
            return this.params.method === `get` ? this.params.data : {};
        }
        isPartial() {
            return (
                this.params.only.length > 0 ||
                this.params.except.length > 0 ||
                this.params.reset.length > 0
            );
        }
        isPrefetch() {
            return this.params.prefetch === !0;
        }
        isDeferredPropsRequest() {
            return this.params.deferredProps === !0;
        }
        isPollRequest() {
            return this.params.poll === !0;
        }
        onCancelToken(e) {
            this.params.onCancelToken({ cancel: e });
        }
        markAsFinished() {
            ((this.params.completed = !0),
                (this.params.cancelled = !1),
                (this.params.interrupted = !1));
        }
        markAsCancelled({ cancelled: e = !0, interrupted: t = !1 }) {
            (this.params.onCancel(),
                (this.params.completed = !1),
                (this.params.cancelled = e),
                (this.params.interrupted = t));
        }
        wasCancelledAtAll() {
            return this.params.cancelled || this.params.interrupted;
        }
        onFinish() {
            this.params.onFinish(this.params);
        }
        onStart() {
            this.params.onStart(this.params);
        }
        onPrefetching() {
            this.params.onPrefetching(this.params);
        }
        onPrefetchResponse(e) {
            this.params.onPrefetchResponse && this.params.onPrefetchResponse(e);
        }
        onPrefetchError(e) {
            this.params.onPrefetchError && this.params.onPrefetchError(e);
        }
        all() {
            return this.params;
        }
        headers() {
            let e = { ...this.params.headers };
            this.isPartial() &&
                (e[`X-Inertia-Partial-Component`] = D.get().component);
            let t = this.params.only.concat(this.params.reset);

            return (
                t.length > 0 && (e[`X-Inertia-Partial-Data`] = t.join(`,`)),
                this.params.except.length > 0 &&
                    (e[`X-Inertia-Partial-Except`] =
                        this.params.except.join(`,`)),
                this.params.reset.length > 0 &&
                    (e[`X-Inertia-Reset`] = this.params.reset.join(`,`)),
                this.params.errorBag &&
                    this.params.errorBag.length > 0 &&
                    (e[`X-Inertia-Error-Bag`] = this.params.errorBag),
                e
            );
        }
        setPreserveOptions(t) {
            ((this.params.preserveScroll = e.resolvePreserveOption(
                this.params.preserveScroll,
                t,
            )),
                (this.params.preserveState = e.resolvePreserveOption(
                    this.params.preserveState,
                    t,
                )));
        }
        runCallbacks() {
            this.callbacks.forEach(({ name: e, args: t }) => {
                this.params[e](...t);
            });
        }
        merge(e) {
            this.params = { ...this.params, ...e };
        }
        wrapCallback(e, t) {
            return (...n) => {
                (this.recordCallback(t, n), e[t](...n));
            };
        }
        recordCallback(e, t) {
            this.callbacks.push({ name: e, args: t });
        }
        static resolvePreserveOption(e, t) {
            return typeof e == `function`
                ? e(t)
                : e === `errors`
                  ? Object.keys(t.props.errors || {}).length > 0
                  : e;
        }
    },
    fr = {
        createIframeAndPage(e) {
            typeof e == `object` &&
                (e = `All Inertia requests must receive a valid Inertia response, however a plain JSON response was received.<hr>${JSON.stringify(e)}`);
            let t = document.createElement(`html`);
            ((t.innerHTML = e),
                t
                    .querySelectorAll(`a`)
                    .forEach((e) => e.setAttribute(`target`, `_top`)));
            let n = document.createElement(`iframe`);

            return (
                (n.style.backgroundColor = `white`),
                (n.style.borderRadius = `5px`),
                (n.style.width = `100%`),
                (n.style.height = `100%`),
                n.setAttribute(`sandbox`, `allow-scripts`),
                { iframe: n, page: t }
            );
        },
        show(e) {
            let { iframe: t, page: n } = this.createIframeAndPage(e);
            ((t.style.boxSizing = `border-box`), (t.style.display = `block`));
            let r = document.createElement(`dialog`);
            ((r.id = `inertia-error-dialog`),
                Object.assign(r.style, {
                    width: `calc(100vw - 100px)`,
                    height: `calc(100vh - 100px)`,
                    padding: `0`,
                    margin: `auto`,
                    border: `none`,
                    backgroundColor: `transparent`,
                }));
            let i = document.createElement(`style`);
            i.textContent = `
      dialog#inertia-error-dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.6);
      }

      dialog#inertia-error-dialog:focus {
        outline: none;
      }
    `;
            let a = Nt.get(`nonce`);
            (a && (i.nonce = a),
                document.head.appendChild(i),
                r.addEventListener(`click`, (e) => {
                    e.target === r && r.close();
                }),
                r.addEventListener(`close`, () => {
                    (i.remove(), r.remove());
                }),
                r.appendChild(t),
                document.body.prepend(r),
                r.showModal(),
                r.focus(),
                (t.srcdoc = n.outerHTML));
        },
    },
    pr = (e, t) => e === t || e.startsWith(`${t}.`),
    mr = (e, t) => {
        let { only: n, except: r } = e;

        return !(
            (n.length === 0 && r.length === 0) ||
            (n.length > 0 && !n.some((e) => pr(t, e))) ||
            (r.length > 0 && r.some((e) => pr(t, e)))
        );
    },
    hr = new Bn(),
    gr = class e {
        constructor(e, t, n) {
            ((this.requestParams = e),
                (this.response = t),
                (this.originatingPage = n));
        }
        requestParams;
        response;
        originatingPage;
        wasPrefetched = !1;
        processed = !1;
        static create(t, n, r) {
            return new e(t, n, r);
        }
        isProcessed() {
            return this.processed;
        }
        async handlePrefetch() {
            In(this.requestParams.all().url, window.location) && this.handle();
        }
        async handle() {
            return hr.add(() => this.process());
        }
        async process() {
            if (this.requestParams.all().prefetch) {
                return (
                    (this.wasPrefetched = !0),
                    (this.requestParams.all().prefetch = !1),
                    this.requestParams
                        .all()
                        .onPrefetched(this.response, this.requestParams.all()),
                    Kt(this.response, this.requestParams.all()),
                    Promise.resolve()
                );
            }

            if (
                (this.requestParams.runCallbacks(),
                (this.processed = !0),
                !this.isInertiaResponse())
            ) {
                return this.handleNonInertiaResponse();
            }

            if (this.isHttpException()) {
                let e = {
                    ...this.response,
                    data: this.getDataFromResponse(this.response.data),
                };

                if (
                    this.requestParams.all().onHttpException(e) === !1 ||
                    !zt(e)
                ) {
                    return;
                }
            }

            (await O.processQueue(),
                (O.preserveUrl = this.requestParams.all().preserveUrl),
                await this.setPage());
            let { flash: e } = D.get();
            Object.keys(e).length > 0 &&
                !this.requestParams.isDeferredPropsRequest() &&
                (Jt(e), this.requestParams.all().onFlash(e));
            let t = D.get().props.errors || {};

            if (Object.keys(t).length > 0) {
                let e = this.getScopedErrors(t);

                return (
                    It(e, {
                        page: D.get(),
                        visitId: this.requestParams.all().id,
                    }),
                    this.requestParams.all().onError(e)
                );
            }

            (ai.flushByCacheTags(
                this.requestParams.all().invalidateCacheTags || [],
            ),
                this.wasPrefetched || ai.flush(D.get().url),
                Gt(D.get(), { visitId: this.requestParams.all().id }),
                await this.requestParams.all().onSuccess(D.get()),
                (O.preserveUrl = !1));
        }
        mergeParams(e) {
            this.requestParams.merge(e);
        }
        getPageResponse() {
            let e = this.getDataFromResponse(this.response.data);

            return typeof e == `object`
                ? (this.response.data = {
                      ...e,
                      flash: e.flash ?? {},
                      rescuedProps: e.rescuedProps ?? [],
                  })
                : (this.response.data = e);
        }
        async handleNonInertiaResponse() {
            if (this.isInertiaRedirect()) {
                ai.visit(this.getHeader(`x-inertia-redirect`), {
                    ...this.requestParams.all(),
                    method: `get`,
                    data: {},
                });

                return;
            }

            if (this.isLocationVisit()) {
                let e = jn(this.getHeader(`x-inertia-location`));

                return (
                    Fn(this.requestParams.all().url, e),
                    this.locationVisit(e)
                );
            }

            let e = {
                ...this.response,
                data: this.getDataFromResponse(this.response.data),
            };

            if (this.requestParams.all().onHttpException(e) !== !1 && zt(e)) {
                return fr.show(e.data);
            }
        }
        isInertiaResponse() {
            return this.hasHeader(`x-inertia`);
        }
        isHttpException() {
            return this.response.status >= 400;
        }
        hasStatus(e) {
            return this.response.status === e;
        }
        getHeader(e) {
            return this.response.headers[e];
        }
        hasHeader(e) {
            return this.getHeader(e) !== void 0;
        }
        isInertiaRedirect() {
            return this.hasStatus(409) && this.hasHeader(`x-inertia-redirect`);
        }
        isLocationVisit() {
            return this.hasStatus(409) && this.hasHeader(`x-inertia-location`);
        }
        locationVisit(e) {
            try {
                if (typeof window > `u`) {
                    return;
                }

                let t = this.getHeader(`x-inertia-version`),
                    n = !!t && t !== D.get().version;

                if (!Yt(e, n) || (n && this.requestParams.all().async)) {
                    return;
                }

                (T.set(T.locationVisitKey, {
                    preserveScroll:
                        this.requestParams.all().preserveScroll === !0,
                }),
                    In(window.location, e)
                        ? window.location.reload()
                        : (window.location.href = e.href));
            } catch {
                return !1;
            }
        }
        async setPage() {
            let e = this.getPageResponse();

            return this.shouldSetPage(e)
                ? ((this.response = await lr.processResponse(
                      this.requestParams.all(),
                      this.response,
                  )),
                  this.mergeProps(e),
                  D.mergeOncePropsIntoResponse(e),
                  this.preserveOptimisticProps(e),
                  this.preserveEqualProps(e),
                  await this.setRememberedState(e),
                  this.requestParams.setPreserveOptions(e),
                  (e.url = O.preserveUrl ? D.get().url : this.pageUrl(e)),
                  this.requestParams.all().onBeforeUpdate(e),
                  Bt(e),
                  D.set(e, {
                      replace: this.requestParams.all().replace,
                      preserveScroll: this.requestParams.all().preserveScroll,
                      preserveState: this.requestParams.all().preserveState,
                      viewTransition: this.requestParams.all().viewTransition,
                      cached: this.requestParams.all().cached,
                      visitId: this.requestParams.all().id,
                  }))
                : Promise.resolve();
        }
        getDataFromResponse(e) {
            if (typeof e != `string`) {
                return e;
            }

            try {
                return JSON.parse(e);
            } catch {
                return e;
            }
        }
        shouldSetPage(e) {
            if (
                !this.requestParams.all().async ||
                this.originatingPage.component !== e.component
            ) {
                return !0;
            }

            if (this.originatingPage.component !== D.get().component) {
                return !1;
            }

            let t = jn(this.originatingPage.url),
                n = jn(D.get().url);

            return t.origin === n.origin && t.pathname === n.pathname;
        }
        pageUrl(e) {
            let t = jn(e.url);

            return (
                e.preserveFragment
                    ? (t.hash = this.requestParams.all().url.hash)
                    : Fn(this.requestParams.all().url, t),
                t.pathname + t.search + t.hash
            );
        }
        preserveOptimisticProps(e) {
            if (ai.hasPendingOptimistic()) {
                for (let t of Object.keys(e.props)) {
                    D.hasBaseline(t) &&
                        (D.updateBaseline(t, e.props[t]),
                        (e.props[t] = D.get().props[t]));
                }
            }
        }
        preserveEqualProps(e) {
            if (e.component !== D.get().component) {
                return;
            }

            let t = D.get().props;
            Object.entries(e.props).forEach(([n, r]) => {
                Ce(r, t[n]) && (e.props[n] = t[n]);
            });
        }
        mergeProps(e) {
            if (
                !this.requestParams.isPartial() ||
                e.component !== D.get().component
            ) {
                return;
            }

            let t = e.mergeProps || [],
                n = e.prependProps || [],
                r = e.deepMergeProps || [],
                i = e.matchPropsOn || [],
                a = (t, n) => {
                    let r = C(D.get().props, t),
                        a = C(e.props, t);

                    if (Array.isArray(a)) {
                        let o = this.mergeOrMatchItems(r || [], a, t, i, n);
                        Ke(e.props, t, o);
                    } else if (typeof a == `object` && a) {
                        let n = { ...(r || {}), ...a };
                        Ke(e.props, t, n);
                    }
                };
            (t.forEach((e) => a(e, !0)),
                n.forEach((e) => a(e, !1)),
                r.forEach((t) => {
                    let n = C(D.get().props, t),
                        r = C(e.props, t),
                        a = (e, t, n) =>
                            Array.isArray(t)
                                ? this.mergeOrMatchItems(e, t, n, i)
                                : typeof t == `object` && t
                                  ? Object.keys(t).reduce(
                                        (r, i) => (
                                            (r[i] = a(
                                                e ? e[i] : void 0,
                                                t[i],
                                                `${n}.${i}`,
                                            )),
                                            r
                                        ),
                                        { ...e },
                                    )
                                  : t;
                    Ke(e.props, t, a(n, r, t));
                }));
            let o = new Set(
                [
                    ...this.requestParams.all().only,
                    ...this.requestParams.all().except,
                ]
                    .filter((e) => e.includes(`.`))
                    .map((e) => e.split(`.`)[0]),
            );

            for (let t of o) {
                let n = D.get().props[t];
                this.isObject(n) &&
                    this.isObject(e.props[t]) &&
                    (e.props[t] = this.deepMergeObjects(n, e.props[t]));
            }

            ((e.props = { ...D.get().props, ...e.props }),
                this.shouldPreserveErrors(e) &&
                    (e.props.errors = D.get().props.errors),
                D.get().scrollProps &&
                    (e.scrollProps = {
                        ...(D.get().scrollProps || {}),
                        ...(e.scrollProps || {}),
                    }),
                D.hasOnceProps() &&
                    (e.onceProps = {
                        ...(D.get().onceProps || {}),
                        ...(e.onceProps || {}),
                    }),
                this.requestParams.isDeferredPropsRequest() &&
                    (e.flash = { ...D.get().flash }));
            let s = D.get().initialDeferredProps;
            (s && Object.keys(s).length > 0 && (e.initialDeferredProps = s),
                (e.rescuedProps = this.mergeRescuedProps(e)));
        }
        mergeRescuedProps(e) {
            let t = D.get().rescuedProps ?? [],
                n = e.rescuedProps ?? [],
                r = new Set(t.filter((e) => !mr(this.requestParams.all(), e)));

            return (n.forEach((e) => r.add(e)), Array.from(r));
        }
        shouldPreserveErrors(e) {
            if (!this.requestParams.all().preserveErrors) {
                return !1;
            }

            let t = D.get().props.errors;

            if (!t || Object.keys(t).length === 0) {
                return !1;
            }

            let n = e.props.errors;

            return !(n && Object.keys(n).length > 0);
        }
        isObject(e) {
            return e && typeof e == `object` && !Array.isArray(e);
        }
        deepMergeObjects(e, t) {
            let n = { ...e };

            for (let r of Object.keys(t)) {
                let i = e[r],
                    a = t[r];
                this.isObject(i) && this.isObject(a)
                    ? (n[r] = this.deepMergeObjects(i, a))
                    : (n[r] = a);
            }

            return n;
        }
        mergeOrMatchItems(e, t, n, r, i = !0) {
            let a = Array.isArray(e) ? e : [],
                o = r.find((e) => e.split(`.`).slice(0, -1).join(`.`) === n);

            if (!o) {
                return i ? [...a, ...t] : [...t, ...a];
            }

            let s = o.split(`.`).pop() || ``,
                c = new Map();

            return (
                t.forEach((e) => {
                    this.hasUniqueProperty(e, s) && c.set(e[s], e);
                }),
                i
                    ? this.appendWithMatching(a, t, c, s)
                    : this.prependWithMatching(a, t, c, s)
            );
        }
        appendWithMatching(e, t, n, r) {
            let i = e.map((e) =>
                    this.hasUniqueProperty(e, r) && n.has(e[r])
                        ? n.get(e[r])
                        : e,
                ),
                a = t.filter((t) =>
                    this.hasUniqueProperty(t, r)
                        ? !e.some(
                              (e) =>
                                  this.hasUniqueProperty(e, r) && e[r] === t[r],
                          )
                        : !0,
                );

            return [...i, ...a];
        }
        prependWithMatching(e, t, n, r) {
            let i = e.filter((e) =>
                this.hasUniqueProperty(e, r) ? !n.has(e[r]) : !0,
            );

            return [...t, ...i];
        }
        hasUniqueProperty(e, t) {
            return e && typeof e == `object` && t in e;
        }
        async setRememberedState(e) {
            let t = await O.getState(O.rememberedState, {});
            this.requestParams.all().preserveState &&
                t &&
                e.component === D.get().component &&
                (e.rememberedState = t);
        }
        getScopedErrors(e) {
            return this.requestParams.all().errorBag
                ? e[this.requestParams.all().errorBag || ``] || {}
                : e;
        }
    },
    _r = class e {
        constructor(e, t, { optimistic: n = !1 } = {}) {
            ((this.page = t),
                (this.requestParams = dr.create(e)),
                (this.cancelToken = new AbortController()),
                (this.optimistic = n));
        }
        page;
        response;
        cancelToken;
        requestParams;
        requestHasFinished = !1;
        optimistic;
        static create(t, n, r) {
            return new e(t, n, r);
        }
        isPrefetch() {
            return this.requestParams.isPrefetch();
        }
        isOptimistic() {
            return this.optimistic;
        }
        isPendingOptimistic() {
            return (
                this.isOptimistic() &&
                (!this.response || !this.response.isProcessed())
            );
        }
        async send() {
            (this.requestParams.onCancelToken(() =>
                this.cancel({ cancelled: !0 }),
            ),
                Wt(this.requestParams.all()),
                this.requestParams.onStart(),
                this.requestParams.all().prefetch &&
                    (this.requestParams.onPrefetching(),
                    qt(this.requestParams.all())));
            let e = this.requestParams.all().prefetch,
                t = {
                    method: this.requestParams.all().method,
                    url: Pn(this.requestParams.all().url).href,
                    data: this.requestParams.data(),
                    signal: this.cancelToken.signal,
                    headers: this.getHeaders(),
                    onUploadProgress: this.onProgress.bind(this),
                },
                n = await lr.processRequest(this.requestParams.all(), t);

            return cr
                .getClient()
                .request(n)
                .then(
                    (e) => (
                        (this.response = gr.create(
                            this.requestParams,
                            e,
                            this.page,
                        )),
                        this.response.handle()
                    ),
                )
                .catch((e) =>
                    e instanceof Qn
                        ? ((this.response = gr.create(
                              this.requestParams,
                              e.response,
                              this.page,
                          )),
                          this.response.handle())
                        : Promise.reject(e),
                )
                .catch((t) => {
                    if (
                        !(t instanceof $n) &&
                        this.requestParams.all().onNetworkError(t) !== !1 &&
                        Lt(t)
                    ) {
                        return (
                            e && this.requestParams.onPrefetchError(t),
                            Promise.reject(t)
                        );
                    }
                })
                .finally(() => {
                    (this.finish(),
                        e &&
                            this.response &&
                            this.requestParams.onPrefetchResponse(
                                this.response,
                            ));
                });
        }
        finish() {
            this.requestParams.wasCancelledAtAll() ||
                (this.requestParams.markAsFinished(), this.fireFinishEvents());
        }
        fireFinishEvents() {
            this.requestHasFinished ||
                ((this.requestHasFinished = !0),
                Rt(this.requestParams.all()),
                this.requestParams.onFinish());
        }
        cancel({ cancelled: e = !1, interrupted: t = !1 }) {
            this.requestHasFinished ||
                (this.cancelToken.abort(),
                this.requestParams.markAsCancelled({
                    cancelled: e,
                    interrupted: t,
                }),
                this.fireFinishEvents());
        }
        onProgress(e) {
            this.requestParams.data() instanceof FormData &&
                (Ut(e), this.requestParams.all().onProgress(e));
        }
        getHeaders() {
            let e = {
                    ...this.requestParams.headers(),
                    Accept: `text/html, application/xhtml+xml`,
                    'X-Requested-With': `XMLHttpRequest`,
                    'X-Inertia': !0,
                },
                t = D.get();
            t.version && (e[`X-Inertia-Version`] = t.version);
            let n = Object.entries(t.onceProps || {})
                .filter(([, e]) =>
                    C(t.props, e.prop) === void 0
                        ? !1
                        : !e.expiresAt || e.expiresAt > Date.now(),
                )
                .map(([e]) => e);

            return (
                n.length > 0 &&
                    (e[`X-Inertia-Except-Once-Props`] = n.join(`,`)),
                e
            );
        }
    },
    vr = class {
        requests = [];
        maxConcurrent;
        interruptible;
        constructor({ maxConcurrent: e, interruptible: t }) {
            ((this.maxConcurrent = e), (this.interruptible = t));
        }
        send(e) {
            (this.requests.push(e),
                e.send().finally(() => {
                    this.requests = this.requests.filter((t) => t !== e);
                }));
        }
        interruptInFlight() {
            this.cancel({ interrupted: !0 }, !1);
        }
        cancelInFlight({ prefetch: e = !0, optimistic: t = !0 } = {}) {
            this.requests
                .filter((t) => e || !t.isPrefetch())
                .filter((e) => t || !e.isOptimistic())
                .forEach((e) => e.cancel({ cancelled: !0 }));
        }
        cancel({ cancelled: e = !1, interrupted: t = !1 } = {}, n = !1) {
            (!n && !this.shouldCancel()) ||
                this.requests.shift()?.cancel({ cancelled: e, interrupted: t });
        }
        shouldCancel() {
            return (
                this.interruptible && this.requests.length >= this.maxConcurrent
            );
        }
        hasPendingOptimistic() {
            return this.requests.some((e) => e.isPendingOptimistic());
        }
    },
    A = () => {},
    yr = class {
        syncRequestStream = new vr({ maxConcurrent: 1, interruptible: !0 });
        asyncRequestStream = new vr({
            maxConcurrent: 1 / 0,
            interruptible: !1,
        });
        clientVisitQueue = new Bn();
        pendingOptimisticCallback = void 0;
        init({
            initialPage: e,
            resolveComponent: t,
            swapComponent: n,
            onFlash: r,
        }) {
            (D.init({
                initialPage: e,
                resolveComponent: t,
                swapComponent: n,
                onFlash: r,
            }),
                Jn.handle(),
                Gn.init(),
                Gn.on(`missingHistoryItem`, () => {
                    typeof window < `u` &&
                        this.visit(window.location.href, {
                            preserveState: !0,
                            preserveScroll: !0,
                            replace: !0,
                        });
                }),
                Gn.on(`loadDeferredProps`, (e) => {
                    this.loadDeferredProps(e);
                }),
                Gn.on(`historyQuotaExceeded`, (e) => {
                    window.location.href = e;
                }));
        }
        optimistic(e) {
            return ((this.pendingOptimisticCallback = e), this);
        }
        get(e, t = {}, n = {}) {
            return this.visit(e, { ...n, method: `get`, data: t });
        }
        post(e, t = {}, n = {}) {
            return this.visit(e, {
                preserveState: !0,
                ...n,
                method: `post`,
                data: t,
            });
        }
        put(e, t = {}, n = {}) {
            return this.visit(e, {
                preserveState: !0,
                ...n,
                method: `put`,
                data: t,
            });
        }
        patch(e, t = {}, n = {}) {
            return this.visit(e, {
                preserveState: !0,
                ...n,
                method: `patch`,
                data: t,
            });
        }
        delete(e, t = {}) {
            return this.visit(e, { preserveState: !0, ...t, method: `delete` });
        }
        reload(e = {}) {
            return this.doReload(e);
        }
        doReload(e = {}) {
            if (!(typeof window > `u`)) {
                return this.visit(window.location.href, {
                    ...e,
                    preserveScroll: !0,
                    preserveState: !0,
                    async: !0,
                    headers: {
                        ...(e.headers || {}),
                        'Cache-Control': `no-cache`,
                    },
                });
            }
        }
        remember(e, t = `default`) {
            O.remember(e, t);
        }
        restore(e = `default`) {
            return O.restore(e);
        }
        on(e, t) {
            return typeof window > `u` ? () => {} : Gn.onGlobalEvent(e, t);
        }
        once(e, t) {
            if (typeof window > `u`) {
                return () => {};
            }

            let n = this.on(e, (e) => (n(), t(e)));

            return n;
        }
        hasPendingOptimistic() {
            return this.asyncRequestStream.hasPendingOptimistic();
        }
        get activePolls() {
            return Xn.count;
        }
        cancelAll({ async: e = !0, prefetch: t = !0, sync: n = !0 } = {}) {
            (e && this.asyncRequestStream.cancelInFlight({ prefetch: t }),
                n && this.syncRequestStream.cancelInFlight());
        }
        poll(e, t = {}, n = {}) {
            return Xn.add(
                e,
                ({ onStart: e, onFinish: n }) => {
                    let r = typeof t == `function` ? t() : t;
                    this.doReload({
                        poll: !0,
                        preserveErrors: !0,
                        ...r,
                        onCancelToken: (t) => {
                            (e(t.cancel), r.onCancelToken?.(t));
                        },
                        onFinish: (e) => {
                            (n(), r.onFinish?.(e));
                        },
                    });
                },
                {
                    autoStart: n.autoStart ?? !0,
                    keepAlive: n.keepAlive ?? !1,
                    mode: n.mode,
                },
            );
        }
        visit(e, t = {}) {
            ((t.optimistic = t.optimistic ?? this.pendingOptimisticCallback),
                (this.pendingOptimisticCallback = void 0),
                t.optimistic && (t.async = t.async ?? !0));
            let n = this.getPendingVisit(e, {
                    ...t,
                    showProgress:
                        t.showProgress ?? (!t.async || !!t.optimistic),
                }),
                r = this.getVisitEvents(t);

            if (r.onBefore(n) === !1 || !Ft(n)) {
                return;
            }

            let i = jn(D.get().url);
            ((n.only.length > 0 || n.except.length > 0 || n.reset.length > 0
                ? Ln(n.url, i)
                : In(n.url, i)) ||
                this.asyncRequestStream.cancelInFlight({
                    prefetch: !1,
                    optimistic: !1,
                }),
                n.async || this.syncRequestStream.interruptInFlight(),
                t.optimistic && this.applyOptimisticUpdate(t.optimistic, r),
                !D.isCleared() && !n.preserveUrl && E.save());
            let a = { ...n, ...r },
                o = () => {
                    let e = fn.get(a);
                    e
                        ? (P.reveal(e.inFlight), fn.use(e, a))
                        : (P.reveal(!0),
                          (n.async
                              ? this.asyncRequestStream
                              : this.syncRequestStream
                          ).send(
                              _r.create(a, D.get(), {
                                  optimistic: !!t.optimistic,
                              }),
                          ));
                };
            (Array.isArray(n.component) &&
                (console.error(
                    `The "component" prop received an array of components (${n.component.join(`, `)}), but only a single component string is supported for instant visits. Pass an explicit component name instead.`,
                ),
                (n.component = null)),
                n.component
                    ? O.processQueue().then(() => {
                          this.performInstantSwap(n).then(() => {
                              ((a.preserveScroll = !0),
                                  (a.preserveState = !0),
                                  (a.replace = !0),
                                  (a.viewTransition = !1),
                                  o());
                          });
                      })
                    : o());
        }
        getCached(e, t = {}) {
            return fn.findCached(this.getPrefetchParams(e, t));
        }
        flush(e, t = {}) {
            fn.remove(this.getPrefetchParams(e, t));
        }
        flushAll() {
            fn.removeAll();
        }
        flushByCacheTags(e) {
            fn.removeByTags(Array.isArray(e) ? e : [e]);
        }
        getPrefetching(e, t = {}) {
            return fn.findInFlight(this.getPrefetchParams(e, t));
        }
        prefetch(e, t = {}, n = {}) {
            if ((t.method ?? (Rn(e) ? e.method : `get`)) !== `get`) {
                throw Error(`Prefetch requests must use the GET method`);
            }

            let r = this.getPendingVisit(e, {
                ...t,
                async: !0,
                showProgress: !1,
                prefetch: !0,
                viewTransition: !1,
            });

            if (
                r.url.origin + r.url.pathname + r.url.search ===
                window.location.origin +
                    window.location.pathname +
                    window.location.search
            ) {
                return;
            }

            let i = this.getVisitEvents(t);

            if (i.onBefore(r) === !1 || !Ft(r)) {
                return;
            }

            (P.hide(), this.asyncRequestStream.interruptInFlight());
            let a = { ...r, ...i };
            new Promise((e) => {
                let t = () => {
                    D.get() ? e() : setTimeout(t, 50);
                };
                t();
            }).then(() => {
                fn.add(
                    a,
                    (e) => {
                        this.asyncRequestStream.send(_r.create(e, D.get()));
                    },
                    {
                        cacheFor: Nt.get(`prefetch.cacheFor`),
                        cacheTags: [],
                        ...n,
                    },
                );
            });
        }
        clearHistory() {
            O.clear();
        }
        decryptHistory() {
            return O.decrypt();
        }
        resolveComponent(e, t) {
            return D.resolve(e, t);
        }
        replace(e) {
            this.clientVisit(e, { replace: !0 });
        }
        replaceProp(e, t, n) {
            this.replace({
                preserveScroll: !0,
                preserveState: !0,
                props(n) {
                    let r = typeof t == `function` ? t(C(n, e), n) : t;

                    return Ke(he(n), e, r);
                },
                ...(n || {}),
            });
        }
        appendToProp(e, t, n) {
            this.replaceProp(
                e,
                (e, n) => {
                    let r = typeof t == `function` ? t(e, n) : t;

                    return (
                        Array.isArray(e) || (e = e === void 0 ? [] : [e]),
                        [...e, r]
                    );
                },
                n,
            );
        }
        prependToProp(e, t, n) {
            this.replaceProp(
                e,
                (e, n) => {
                    let r = typeof t == `function` ? t(e, n) : t;

                    return (
                        Array.isArray(e) || (e = e === void 0 ? [] : [e]),
                        [r, ...e]
                    );
                },
                n,
            );
        }
        push(e) {
            this.clientVisit(e);
        }
        flash(e, t) {
            let n = D.get().flash,
                r;

            if (typeof e == `function`) {
                r = e(n);
            } else if (typeof e == `string`) {
                r = { ...n, [e]: t };
            } else if (e && Object.keys(e).length) {
                r = { ...n, ...e };
            } else {
                return;
            }

            (D.setFlash(r), Object.keys(r).length && Jt(r));
        }
        clientVisit(e, { replace: t = !1 } = {}) {
            this.clientVisitQueue.add(() =>
                this.performClientVisit(e, { replace: t }),
            );
        }
        performClientVisit(e, { replace: t = !1 } = {}) {
            let n = D.get(),
                r =
                    typeof e.props == `function`
                        ? Object.fromEntries(
                              Object.values(n.onceProps ?? {}).map((e) => [
                                  e.prop,
                                  C(n.props, e.prop),
                              ]),
                          )
                        : {},
                i =
                    typeof e.props == `function`
                        ? e.props(n.props, r)
                        : (e.props ?? n.props),
                a = typeof e.flash == `function` ? e.flash(n.flash) : e.flash,
                {
                    viewTransition: o,
                    onError: s,
                    onFinish: c,
                    onFlash: l,
                    onSuccess: u,
                    ...d
                } = e,
                f = { ...n, ...d, flash: a ?? {}, props: i },
                p = dr.resolvePreserveOption(e.preserveScroll ?? !1, f),
                m = dr.resolvePreserveOption(e.preserveState ?? !1, f),
                h = this.createVisitId();

            return D.set(f, {
                replace: t,
                preserveScroll: p,
                preserveState: m,
                viewTransition: o,
                visitId: h,
            })
                .then(() => {
                    Ht(D.get(), { replace: t, visitId: h });
                    let n = D.get().flash;
                    Object.keys(n).length > 0 && (Jt(n), l?.(n));
                    let r = D.get().props.errors || {};

                    if (Object.keys(r).length === 0) {
                        u?.(D.get());

                        return;
                    }

                    let i = e.errorBag ? r[e.errorBag || ``] || {} : r;
                    s?.(i);
                })
                .finally(() => c?.(e));
        }
        performInstantSwap(e) {
            let t = D.get(),
                n = Object.fromEntries(
                    (t.sharedProps ?? [])
                        .filter((e) => e in t.props)
                        .map((e) => [e, t.props[e]]),
                ),
                r =
                    typeof e.pageProps == `function`
                        ? e.pageProps(he(t.props), he(n))
                        : e.pageProps,
                i = r === null ? { ...n } : { ...r },
                a = {
                    component: e.component,
                    url: e.url.pathname + e.url.search + e.url.hash,
                    version: t.version,
                    props: { ...i, errors: {} },
                    flash: {},
                    rescuedProps: [],
                    clearHistory: !1,
                    encryptHistory: t.encryptHistory,
                    sharedProps: t.sharedProps,
                    rememberedState: {},
                };

            return D.set(a, {
                replace: e.replace,
                preserveScroll: dr.resolvePreserveOption(e.preserveScroll, a),
                preserveState: !1,
                viewTransition: e.viewTransition,
                visitId: e.id,
            });
        }
        getPrefetchParams(e, t) {
            return {
                ...this.getPendingVisit(e, {
                    ...t,
                    async: !0,
                    showProgress: !1,
                    prefetch: !0,
                    viewTransition: !1,
                }),
                ...this.getVisitEvents(t),
            };
        }
        createVisitId() {
            return qn();
        }
        getPendingVisit(e, t) {
            if (Rn(e)) {
                let n = e;
                ((e = n.url), (t.method = t.method ?? n.method));
            }

            let n = Nt.get(`visitOptions`),
                r = (n && n(e.toString(), he(t))) || {},
                i = {
                    method: `get`,
                    data: {},
                    replace: !1,
                    preserveScroll: !1,
                    preserveState: !1,
                    only: [],
                    except: [],
                    headers: {},
                    errorBag: ``,
                    forceFormData: !1,
                    queryStringArrayFormat: `brackets`,
                    async: !1,
                    showProgress: !0,
                    fresh: !1,
                    reset: [],
                    preserveUrl: !1,
                    preserveErrors: !1,
                    prefetch: !1,
                    invalidateCacheTags: [],
                    viewTransition: !1,
                    component: null,
                    pageProps: null,
                    cached: !1,
                    ...sn(t),
                    ...sn(r),
                },
                [a, o] = Mn(
                    e,
                    i.data,
                    i.method,
                    i.forceFormData,
                    i.queryStringArrayFormat,
                ),
                s = {
                    id: this.createVisitId(),
                    cancelled: !1,
                    completed: !1,
                    interrupted: !1,
                    ...i,
                    url: a,
                    data: o,
                };

            return (s.prefetch && (s.headers.Purpose = `prefetch`), s);
        }
        getVisitEvents(e) {
            return {
                onCancelToken: e.onCancelToken || A,
                onBefore: e.onBefore || A,
                onBeforeUpdate: e.onBeforeUpdate || A,
                onStart: e.onStart || A,
                onProgress: e.onProgress || A,
                onFinish: e.onFinish || A,
                onCancel: e.onCancel || A,
                onSuccess: e.onSuccess || A,
                onError: e.onError || A,
                onHttpException: e.onHttpException || A,
                onNetworkError: e.onNetworkError || A,
                onFlash: e.onFlash || A,
                onPrefetched: e.onPrefetched || A,
                onPrefetching: e.onPrefetching || A,
            };
        }
        applyOptimisticUpdate(e, t) {
            let n = D.get().props,
                r = e(he(n));

            if (!r) {
                return;
            }

            let i = [];

            for (let e of Object.keys(r)) {
                Ce(n[e], r[e]) || i.push(e);
            }

            if (i.length === 0) {
                return;
            }

            let a = D.nextOptimisticId(),
                o = D.get().component;

            for (let e of i) {
                D.setBaseline(e, he(n[e]));
            }

            (D.registerOptimistic(a, e), D.setPropsQuietly({ ...n, ...r }));
            let s = !0,
                c = t.onSuccess;
            t.onSuccess = (e) => ((s = !1), c(e));
            let l = t.onFinish;
            t.onFinish = (e) => {
                if ((D.unregisterOptimistic(a), s && D.get().component === o)) {
                    let e = D.replayOptimistics();
                    Object.keys(e).length > 0 &&
                        D.setPropsQuietly({ ...D.get().props, ...e });
                }

                return (
                    D.pendingOptimisticCount() === 0 &&
                        D.clearOptimisticState(),
                    l(e)
                );
            };
        }
        loadDeferredProps(e) {
            e &&
                Object.values(e).forEach((e) => {
                    this.doReload({
                        only: e,
                        deferredProps: !0,
                        preserveErrors: !0,
                    });
                });
        }
    },
    br = `server`;
function xr(e, t) {
    return e.match(/\sdata-inertia(=|\s|>)/)
        ? e
        : e.replace(
              /^<([a-zA-Z][^\s/>]*)/,
              `<$1 data-inertia="server-head-${t}"`,
          );
}
function Sr(e, t) {
    if (!t) {
        return [];
    }

    let n = typeof t == `function` ? t(e) : e.props[t === !0 ? `head` : t];

    return Array.isArray(n)
        ? n
              .map((e) => (typeof e == `string` ? e.trim() : e))
              .filter((e) => typeof e == `string` && e.length > 0)
              .map(xr)
        : [];
}
var Cr = {
    buildDOMElement(e) {
        let t = document.createElement(`template`);
        t.innerHTML = e;
        let n = t.content.firstChild;

        if (!e.startsWith(`<script `)) {
            return n;
        }

        let r = document.createElement(`script`);

        return (
            (r.innerHTML = n.innerHTML),
            n.getAttributeNames().forEach((e) => {
                r.setAttribute(e, n.getAttribute(e) || ``);
            }),
            r
        );
    },
    isInertiaManagedElement(e) {
        return (
            e.nodeType === Node.ELEMENT_NODE &&
            e.getAttribute(`data-inertia`) !== null
        );
    },
    findMatchingElementIndex(e, t) {
        let n = e.getAttribute(`data-inertia`);

        return n === null
            ? -1
            : t.findIndex((e) => e.getAttribute(`data-inertia`) === n);
    },
    update: Pt(function (e) {
        let t = e.map((e) => this.buildDOMElement(e)),
            n = Array.from(document.head.childNodes).filter((e) =>
                this.isInertiaManagedElement(e),
            );
        (t.some((e) => e instanceof HTMLTitleElement) &&
            document.head
                .querySelectorAll(`title:not([data-inertia])`)
                .forEach((e) => e.remove()),
            n.forEach((e) => {
                let n = this.findMatchingElementIndex(e, t);

                if (n === -1) {
                    e.remove();

                    return;
                }

                let r = t.splice(n, 1)[0];
                r && !e.isEqualNode(r) && e.replaceWith(r);
            }),
            t.forEach((e) => {
                document.head.appendChild(e);
            }));
    }, 1),
};
function wr(e, t, n, r = []) {
    let i = r.length ? { [br]: r } : {},
        a = 0;
    function o() {
        let e = (a += 1);

        return ((i[e] = []), e.toString());
    }
    function s(e) {
        e === null || Object.keys(i).indexOf(e) === -1 || (delete i[e], f());
    }
    function c(e) {
        Object.keys(i).indexOf(e) === -1 && (i[e] = []);
    }
    function l(e, t = []) {
        (e !== null && Object.keys(i).indexOf(e) > -1 && (i[e] = t), f());
    }
    function u(e = []) {
        (e.length ? (i[br] = e) : delete i[br], f());
    }
    function d() {
        let e = t(``),
            n = i[br] || [],
            r = Object.keys(i)
                .filter((e) => e !== br)
                .flatMap((e) => i[e]),
            a = {
                ...(e ? { title: `<title data-inertia="">${e}</title>` } : {}),
            },
            o = n.concat(r).reduce((e, n) => {
                if (n.indexOf(`<`) === -1) {
                    return e;
                }

                if (n.indexOf(`<title `) === 0) {
                    let r = n.match(/(<title [^>]+>)(.*?)(<\/title>)/s);

                    return ((e.title = r ? `${r[1]}${t(r[2])}${r[3]}` : n), e);
                }

                let r = n.match(/ data-inertia=(["'])[^"']+\1/);

                return (r ? (e[r[0]] = n) : (e[Object.keys(e).length] = n), e);
            }, a);

        return Object.values(o);
    }
    function f() {
        e ? n(d()) : Cr.update(d());
    }

    return (
        f(),
        {
            forceUpdate: f,
            updateServerHead: u,
            createProvider: function () {
                let e = o();

                return {
                    reconnect: () => c(e),
                    update: (t) => l(e, t),
                    disconnect: () => s(e),
                };
            },
        }
    );
}
new Bn();
function Tr() {
    let e = {},
        t = {},
        n = { shared: e, named: t },
        r = new Set(),
        i = !1,
        a = () => {
            n = { shared: e, named: t };
        },
        o = () => {
            i ||
                ((i = !0),
                queueMicrotask(() => {
                    ((i = !1), r.forEach((e) => e()));
                }));
        };

    return {
        set(t) {
            let n = { ...e, ...t };
            Ce(e, n) || ((e = n), a(), o());
        },
        setFor(e, n) {
            let r = t[e] || {},
                i = { ...r, ...n };
            Ce(r, i) || ((t = { ...t, [e]: i }), a(), o());
        },
        reset() {
            ((e = {}), (t = {}), a(), o());
        },
        subscribe(e) {
            return (r.add(e), () => r.delete(e));
        },
        get: () => n,
    };
}
function Er(e) {
    return typeof e == `object` && !!e && !Array.isArray(e);
}
function Dr(e) {
    return Er(e) && `component` in e;
}
function Or(e, t) {
    return `component` in e && t(e.component);
}
function kr(e, t) {
    return !Er(e) || t(e) || Or(e, t)
        ? !1
        : Object.values(e).every(
              (e) =>
                  t(e) ||
                  (Array.isArray(e) && t(e[0])) ||
                  (Dr(e) && t(e.component)),
          );
}
function Ar(e, t) {
    return Er(e) && !t(e) && !Or(e, t) && !kr(e, t);
}
function jr(e, t) {
    if (Ar(e, t)) {
        return !0;
    }

    if (!Er(e) || t(e) || Or(e, t)) {
        return !1;
    }

    let n = Object.values(e);

    return n.length > 0 && n.every((e) => typeof e == `function`);
}
function Mr(e, t) {
    return (
        Array.isArray(e) && e.length === 2 && t(e[0]) && Er(e[1]) && !t(e[1])
    );
}
function Nr(e, t) {
    if (Array.isArray(e) && t(e[0])) {
        return { component: e[0], props: e[1] ?? {} };
    }

    if (Dr(e) && t(e.component)) {
        return { component: e.component, props: e.props ?? {} };
    }

    if (t(e)) {
        return { component: e, props: {} };
    }

    throw Error(`Invalid layout definition: received ${typeof e}`);
}
function Pr(e, t, n) {
    return !e || (n && n(e))
        ? []
        : kr(e, t)
          ? Object.entries(e).map(([e, n]) => ({ ...Nr(n, t), name: e }))
          : Mr(e, t)
            ? [{ component: e[0], props: e[1] ?? {} }]
            : Array.isArray(e)
              ? e.map((e) => Nr(e, t))
              : Dr(e) && t(e.component)
                ? [{ component: e.component, props: e.props ?? {} }]
                : t(e)
                  ? [{ component: e, props: {} }]
                  : [];
}
var j = `nprogress`,
    Fr,
    M,
    N = {
        minimum: 0.08,
        easing: `linear`,
        speed: 200,
        trickle: !0,
        trickleSpeed: 200,
        showSpinner: !0,
        barSelector: `.bar, [role="bar"]`,
        spinnerSelector: `.spinner, [role="spinner"]`,
        parent: `body`,
        color: `#29d`,
        includeCSS: !0,
        popover: null,
        template: [
            `<div class="bar">`,
            `<div class="peg"></div>`,
            `</div>`,
            `<div class="spinner">`,
            `<div class="spinner-icon"></div>`,
            `</div>`,
        ].join(``),
    },
    Ir = null,
    Lr = !1,
    Rr = (e) => {
        (Object.assign(N, e),
            (Fr = N.popover ?? `popover` in HTMLElement.prototype),
            N.includeCSS && Zr(N.color),
            (M = document.createElement(`div`)),
            (M.id = j),
            M.setAttribute(`aria-hidden`, `true`),
            (M.innerHTML = N.template),
            Fr && (M.popover = `manual`));
    },
    zr = (e) => {
        let t = Br();
        ((e = Jr(e, N.minimum, 1)), (Ir = e === 1 ? null : e));
        let n = Wr(!t),
            r = n.querySelector(N.barSelector),
            i = N.speed,
            a = N.easing;
        (n.offsetWidth,
            Xr((t) => {
                let o = {
                    transition: `all ${i}ms ${a}`,
                    transform: `translate3d(${Yr(e)}%,0,0)`,
                };

                for (let e in o) {
                    r.style[e] = o[e];
                }

                if (e !== 1) {
                    return setTimeout(t, i);
                }

                ((n.style.transition = `none`),
                    (n.style.opacity = `1`),
                    n.offsetWidth,
                    setTimeout(() => {
                        ((n.style.transition = `all ${i}ms linear`),
                            (n.style.opacity = `0`),
                            setTimeout(() => {
                                (Kr(),
                                    (n.style.transition = ``),
                                    (n.style.opacity = ``),
                                    t());
                            }, i));
                    }, i));
            }));
    },
    Br = () => typeof Ir == `number`,
    Vr = () => {
        Ir || zr(0);
        let e = function () {
            setTimeout(function () {
                Ir && (Ur(), e());
            }, N.trickleSpeed);
        };
        N.trickle && e();
    },
    Hr = (e) => {
        (!e && !Ir) || (Ur(0.3 + 0.5 * Math.random()), zr(1));
    },
    Ur = (e) => {
        let t = Ir;

        if (t === null) {
            return Vr();
        }

        if (!(t > 1)) {
            return (
                (e =
                    typeof e == `number`
                        ? e
                        : (() => {
                              let e = {
                                  0.1: [0, 0.2],
                                  0.04: [0.2, 0.5],
                                  0.02: [0.5, 0.8],
                                  0.005: [0.8, 0.99],
                              };

                              for (let n in e) {
                                  if (t >= e[n][0] && t < e[n][1]) {
                                      return parseFloat(n);
                                  }
                              }

                              return 0;
                          })()),
                zr(Jr(t + e, 0, 0.994))
            );
        }
    },
    Wr = (e) => {
        if (qr()) {
            return document.getElementById(j);
        }

        document.documentElement.classList.add(`${j}-busy`);
        let t = M.querySelector(N.barSelector),
            n = e ? `-100` : Yr(Ir || 0);

        if (
            ((t.style.transition = `all 0 linear`),
            (t.style.transform = `translate3d(${n}%,0,0)`),
            N.showSpinner || M.querySelector(N.spinnerSelector)?.remove(),
            Fr)
        ) {
            (document.body.appendChild(M), Lr || M.showPopover());
        } else {
            let e = Gr();
            (e !== document.body && e.classList.add(`${j}-custom-parent`),
                e.appendChild(M),
                Lr && (M.style.display = `none`));
        }

        return M;
    },
    Gr = () => document.querySelector(N.parent),
    Kr = () => {
        if (
            (document.documentElement.classList.remove(`${j}-busy`),
            Fr && M?.isConnected)
        ) {
            try {
                M.hidePopover();
            } catch {}
        }

        (Fr || Gr().classList.remove(`${j}-custom-parent`), M?.remove());
    },
    qr = () => document.getElementById(j) !== null;
function Jr(e, t, n) {
    return e < t ? t : e > n ? n : e;
}
var Yr = (e) => (-1 + e) * 100,
    Xr = (() => {
        let e = [],
            t = () => {
                let n = e.shift();
                n && n(t);
            };

        return (n) => {
            (e.push(n), e.length === 1 && t());
        };
    })(),
    Zr = (e) => {
        let t = document.createElement(`style`),
            n = Nt.get(`nonce`);
        (n && (t.nonce = n),
            (t.textContent = `
    #${j} {
      pointer-events: none;
      background: none;
      border: none;
      margin: 0;
      padding: 0;
      overflow: visible;
      inset: unset;
      width: 100%;
      height: 0;
      position: fixed;
      top: 0;
      left: 0;
    }

    #${j}::backdrop {
      display: none;
    }

    #${j} .bar {
      background: ${e};

      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;

      width: 100%;
      height: 2px;
    }

    #${j} .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${e}, 0 0 5px ${e};
      opacity: 1.0;

      transform: rotate(3deg) translate(0px, -4px);
    }

    #${j} .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }

    #${j} .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;

      border: solid 2px transparent;
      border-top-color: ${e};
      border-left-color: ${e};
      border-radius: 50%;

      animation: ${j}-spinner 400ms linear infinite;
    }

    .${j}-custom-parent {
      overflow: hidden;
      position: relative;
    }

    .${j}-custom-parent #${j} .spinner,
    .${j}-custom-parent #${j} .bar {
      position: absolute;
    }

    @keyframes ${j}-spinner {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `),
            document.head.appendChild(t));
    },
    Qr = {
        configure: Rr,
        isStarted: Br,
        done: Hr,
        set: zr,
        remove: Kr,
        start: Vr,
        status: Ir,
        show: () => {
            if (((Lr = !1), M?.isConnected)) {
                if (Fr) {
                    try {
                        M.showPopover();
                    } catch {}
                } else {
                    M.style.display = ``;
                }
            }
        },
        hide: () => {
            if (((Lr = !0), M?.isConnected)) {
                if (Fr) {
                    try {
                        M.hidePopover();
                    } catch {}
                } else {
                    M.style.display = `none`;
                }
            }
        },
    },
    P = new (class {
        hideCount = 0;
        start() {
            Qr.start();
        }
        reveal(e = !1) {
            ((this.hideCount = Math.max(0, this.hideCount - 1)),
                (e || this.hideCount === 0) && Qr.show());
        }
        hide() {
            (this.hideCount++, Qr.hide());
        }
        set(e) {
            Qr.set(Math.max(0, Math.min(1, e)));
        }
        finish() {
            Qr.done();
        }
        reset() {
            Qr.set(0);
        }
        remove() {
            (Qr.done(), Qr.remove());
        }
        isStarted() {
            return Qr.isStarted();
        }
        getStatus() {
            return Qr.status;
        }
    })();
function $r(e) {
    (document.addEventListener(`inertia:start`, (t) => ei(t, e)),
        document.addEventListener(`inertia:progress`, ti));
}
function ei(e, t) {
    e.detail.visit.showProgress || P.hide();
    let n = setTimeout(() => P.start(), t);
    document.addEventListener(`inertia:finish`, (e) => ni(e, n), { once: !0 });
}
function ti(e) {
    P.isStarted() &&
        e.detail.progress?.percentage &&
        P.set(
            Math.max(P.getStatus(), (e.detail.progress.percentage / 100) * 0.9),
        );
}
function ni(e, t) {
    (clearTimeout(t),
        P.isStarted() &&
            (e.detail.visit.completed
                ? P.finish()
                : e.detail.visit.interrupted
                  ? P.reset()
                  : e.detail.visit.cancelled && P.remove()));
}
function ri({
    delay: e = 250,
    color: t = `#29d`,
    includeCSS: n = !0,
    showSpinner: r = !1,
    popover: i = null,
} = {}) {
    ($r(e),
        Qr.configure({ showSpinner: r, includeCSS: n, color: t, popover: i }));
}
function ii(e, t, n) {
    return `<script data-page="${e}" type="application/json">${JSON.stringify(t).replace(/\//g, `\\/`)}<\/script><div data-server-rendered="true" id="${e}">${n}</div>`;
}
var ai = new yr();
typeof window < `u` && ((window.__svelte ??= {}).v ??= new Set()).add(`5`);
var oi = {},
    F = Symbol(`uninitialized`),
    si = Array.isArray,
    ci = Array.prototype.indexOf,
    li = Array.prototype.includes,
    ui = Array.from,
    di = Object.defineProperty,
    fi = Object.getOwnPropertyDescriptor,
    pi = Object.prototype,
    mi = Array.prototype,
    hi = Object.getPrototypeOf,
    gi = Object.isExtensible;
function _i(e) {
    return typeof e == `function`;
}
var vi = () => {};
function yi(e) {
    for (var t = 0; t < e.length; t++) {
        e[t]();
    }
}
function bi() {
    var e, t;

    return {
        promise: new Promise((n, r) => {
            ((e = n), (t = r));
        }),
        resolve: e,
        reject: t,
    };
}
var I = 1024,
    xi = 2048,
    Si = 4096,
    Ci = 8192,
    wi = 16384,
    Ti = 32768,
    Ei = 1 << 25,
    Di = 65536,
    Oi = 1 << 18,
    ki = 1 << 19,
    Ai = 1 << 20,
    ji = 1 << 25,
    Mi = 65536,
    Ni = 1 << 21,
    Pi = 1 << 22,
    Fi = 1 << 23,
    Ii = Symbol(`$state`),
    Li = Symbol(`legacy props`),
    Ri = Symbol(`attributes`),
    zi = Symbol(`class`),
    Bi = Symbol(`style`),
    Vi = Symbol(`text`),
    Hi = new (class extends Error {
        name = `StaleReactionError`;
        message =
            'The reaction that called `getAbortSignal()` was re-run or destroyed';
    })();
globalThis.document?.contentType;
function Ui(e) {
    throw Error(`https://svelte.dev/e/lifecycle_outside_component`);
}
function Wi() {
    throw Error(`https://svelte.dev/e/missing_context`);
}
function Gi() {
    throw Error(`https://svelte.dev/e/async_derived_orphan`);
}
function Ki(e, t, n) {
    throw Error(`https://svelte.dev/e/each_key_duplicate`);
}
function qi(e) {
    throw Error(`https://svelte.dev/e/effect_in_teardown`);
}
function Ji() {
    throw Error(`https://svelte.dev/e/effect_in_unowned_derived`);
}
function Yi(e) {
    throw Error(`https://svelte.dev/e/effect_orphan`);
}
function Xi() {
    throw Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
}
function Zi() {
    throw Error(`https://svelte.dev/e/hydration_failed`);
}
function Qi(e) {
    throw Error(`https://svelte.dev/e/props_invalid_value`);
}
function $i() {
    throw Error(`https://svelte.dev/e/state_descriptors_fixed`);
}
function ea() {
    throw Error(`https://svelte.dev/e/state_prototype_fixed`);
}
function ta() {
    throw Error(`https://svelte.dev/e/state_unsafe_mutation`);
}
function na() {
    throw Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
}
function ra() {
    console.warn(`https://svelte.dev/e/derived_inert`);
}
function ia(e) {
    console.warn(`https://svelte.dev/e/hydration_mismatch`);
}
function aa() {
    console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
}
var L = !1;
function R(e) {
    L = e;
}
var z;
function B(e) {
    if (e === null) {
        throw (ia(), oi);
    }

    return (z = e);
}
function oa() {
    return B(zo(z));
}
function sa(e = 1) {
    if (L) {
        for (var t = e, n = z; t--;) {
            n = zo(n);
        }

        z = n;
    }
}
function ca(e = !0) {
    for (var t = 0, n = z; ;) {
        if (n.nodeType === 8) {
            var r = n.data;

            if (r === `]`) {
                if (t === 0) {
                    return n;
                }

                --t;
            } else {
                (r === `[` ||
                    r === `[!` ||
                    (r[0] === `[` && !isNaN(Number(r.slice(1))))) &&
                    (t += 1);
            }
        }

        var i = zo(n);
        (e && n.remove(), (n = i));
    }
}
function la(e) {
    if (!e || e.nodeType !== 8) {
        throw (ia(), oi);
    }

    return e.data;
}
function ua(e) {
    return e === this.v;
}
function da(e, t) {
    return e == e
        ? e !== t || (typeof e == `object` && !!e) || typeof e == `function`
        : t == t;
}
function fa(e) {
    return !da(e, this.v);
}
var pa = !1;
function ma() {
    pa = !0;
}
var V = null;
function ha(e) {
    V = e;
}
function ga() {
    let e = {};

    return [() => (ya(e) || Wi(), _a(e)), (t) => va(e, t)];
}
function _a(e) {
    return Ca(`getContext`).get(e);
}
function va(e, t) {
    return (Ca(`setContext`).set(e, t), t);
}
function ya(e) {
    return Ca(`hasContext`).has(e);
}
function ba(e, t = !1, n) {
    V = {
        p: V,
        i: !1,
        c: null,
        e: null,
        s: e,
        x: null,
        r: Y,
        l: pa && !t ? { s: null, u: null, $: [] } : null,
    };
}
function xa(e) {
    var t = V,
        n = t.e;

    if (n !== null) {
        t.e = null;

        for (var r of n) {
            Zo(r);
        }
    }

    return (e !== void 0 && (t.x = e), (t.i = !0), (V = t.p), e ?? {});
}
function Sa() {
    return !pa || (V !== null && V.l === null);
}
function Ca(e) {
    return (V === null && Ui(e), (V.c ??= new Map(wa(V) || void 0)));
}
function wa(e) {
    let t = e.p;

    for (; t !== null;) {
        let e = t.c;

        if (e !== null) {
            return e;
        }

        t = t.p;
    }

    return null;
}
var Ta = [];
function Ea() {
    var e = Ta;
    ((Ta = []), yi(e));
}
function Da(e) {
    if (Ta.length === 0 && !io) {
        var t = Ta;
        queueMicrotask(() => {
            t === Ta && Ea();
        });
    }

    Ta.push(e);
}
function Oa(e) {
    var t = Y;

    if (t === null) {
        return ((q.f |= Fi), e);
    }

    if (!(t.f & 32768) && !(t.f & 4)) {
        throw e;
    }

    ka(e, t);
}
function ka(e, t) {
    if (!(t !== null && t.f & 16384)) {
        for (; t !== null;) {
            if (t.f & 128) {
                if (!(t.f & 32768)) {
                    throw e;
                }

                try {
                    t.b.error(e);

                    return;
                } catch (t) {
                    e = t;
                }
            }

            t = t.parent;
        }

        throw e;
    }
}
var Aa = ~(xi | Si | I);
function H(e, t) {
    e.f = (e.f & Aa) | t;
}
function ja(e) {
    e.f & 512 || e.deps === null ? H(e, I) : H(e, Si);
}
function Ma(e) {
    if (e !== null) {
        for (let t of e) {
            !(t.f & 2) || !(t.f & 65536) || ((t.f ^= Mi), Ma(t.deps));
        }
    }
}
function Na(e, t, n) {
    (e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Ma(e.deps), H(e, I));
}
var Pa = !1;
function Fa(e) {
    var t = Pa;

    try {
        return ((Pa = !1), [e(), Pa]);
    } finally {
        Pa = t;
    }
}
function Ia(e) {
    let t = 0,
        n = Co(0),
        r;

    return () => {
        Yo() &&
            ($(n),
            ts(
                () => (
                    t === 0 && (r = Is(() => e(() => Oo(n)))),
                    (t += 1),
                    () => {
                        Da(() => {
                            (--t, t === 0 && (r?.(), (r = void 0), Oo(n)));
                        });
                    }
                ),
            ));
    };
}
var La = Di | ki;
function Ra(e, t, n, r) {
    new za(e, t, n, r);
}
var za = class {
    parent;
    is_pending = !1;
    transform_error;
    #e;
    #t = L ? z : null;
    #n;
    #r;
    #i;
    #a = null;
    #o = null;
    #s = null;
    #c = null;
    #l = 0;
    #u = 0;
    #d = !1;
    #f = new Set();
    #p = new Set();
    #m = null;
    #h = Ia(
        () => (
            (this.#m = Co(this.#l)),
            () => {
                this.#m = null;
            }
        ),
    );
    constructor(e, t, n, r) {
        ((this.#e = e),
            (this.#n = t),
            (this.#r = (e) => {
                var t = Y;
                ((t.b = this), (t.f |= 128), n(e));
            }),
            (this.parent = Y.b),
            (this.transform_error =
                r ?? this.parent?.transform_error ?? ((e) => e)),
            (this.#i = rs(() => {
                if (L) {
                    let e = this.#t;
                    oa();
                    let t = e.data === `[!`;

                    if (e.data.startsWith(`[?`)) {
                        let t = JSON.parse(e.data.slice(2));
                        this.#_(t);
                    } else {
                        t ? this.#v() : this.#g();
                    }
                } else {
                    this.#y();
                }
            }, La)),
            L && (this.#e = z));
    }
    #g() {
        try {
            this.#a = G(() => this.#r(this.#e));
        } catch (e) {
            this.error(e);
        }
    }
    #_(e) {
        let t = this.#n.failed;
        t &&
            (this.#s = G(() => {
                t(
                    this.#e,
                    () => e,
                    () => () => {},
                );
            }));
    }
    #v() {
        let e = this.#n.pending;
        e &&
            ((this.is_pending = !0),
            (this.#o = G(() => e(this.#e))),
            Da(() => {
                var e = (this.#c = document.createDocumentFragment()),
                    t = Lo();
                (e.append(t),
                    (this.#a = this.#x(() => G(() => this.#r(t)))),
                    this.#u === 0 &&
                        (this.#e.before(e),
                        (this.#c = null),
                        ls(this.#o, () => {
                            this.#o = null;
                        }),
                        this.#b(U)));
            }));
    }
    #y() {
        try {
            if (
                ((this.is_pending = this.has_pending_snippet()),
                (this.#u = 0),
                (this.#l = 0),
                (this.#a = G(() => {
                    this.#r(this.#e);
                })),
                this.#u > 0)
            ) {
                var e = (this.#c = document.createDocumentFragment());
                ps(this.#a, e);
                let t = this.#n.pending;
                this.#o = G(() => t(this.#e));
            } else {
                this.#b(U);
            }
        } catch (e) {
            this.error(e);
        }
    }
    #b(e) {
        ((this.is_pending = !1), e.transfer_effects(this.#f, this.#p));
    }
    defer_effect(e) {
        Na(e, this.#f, this.#p);
    }
    is_rendered() {
        return !this.is_pending && (!this.parent || this.parent.is_rendered());
    }
    has_pending_snippet() {
        return !!this.#n.pending;
    }
    #x(e) {
        var t = Y,
            n = q,
            r = V;
        (ys(this.#i), J(this.#i), ha(this.#i.ctx));

        try {
            return (uo.ensure(), e());
        } catch (e) {
            return (Oa(e), null);
        } finally {
            (ys(t), J(n), ha(r));
        }
    }
    #S(e, t) {
        if (!this.has_pending_snippet()) {
            this.parent && this.parent.#S(e, t);

            return;
        }

        ((this.#u += e),
            this.#u === 0 &&
                (this.#b(t),
                this.#o &&
                    ls(this.#o, () => {
                        this.#o = null;
                    }),
                (this.#c &&= (this.#e.before(this.#c), null))));
    }
    update_pending_count(e, t) {
        (this.#S(e, t),
            (this.#l += e),
            !(!this.#m || this.#d) &&
                ((this.#d = !0),
                Da(() => {
                    ((this.#d = !1), this.#m && Eo(this.#m, this.#l));
                })));
    }
    get_effect_pending() {
        return (this.#h(), $(this.#m));
    }
    error(e) {
        if (!this.#n.onerror && !this.#n.failed) {
            throw e;
        }

        U?.is_fork
            ? (this.#a && U.skip_effect(this.#a),
              this.#o && U.skip_effect(this.#o),
              this.#s && U.skip_effect(this.#s),
              U.oncommit(() => {
                  this.#C(e);
              }))
            : this.#C(e);
    }
    #C(e) {
        ((this.#a &&= (K(this.#a), null)),
            (this.#o &&= (K(this.#o), null)),
            (this.#s &&= (K(this.#s), null)),
            L && (B(this.#t), sa(), B(ca())));
        var t = this.#n.onerror;
        let n = this.#n.failed;
        var r = !1,
            i = !1;
        let a = () => {
                if (r) {
                    aa();

                    return;
                }

                ((r = !0),
                    i && na(),
                    this.#s !== null &&
                        ls(this.#s, () => {
                            this.#s = null;
                        }),
                    this.#x(() => {
                        this.#y();
                    }));
            },
            o = (e) => {
                try {
                    ((i = !0), t?.(e, a), (i = !1));
                } catch (e) {
                    ka(e, this.#i && this.#i.parent);
                }

                n &&
                    (this.#s = this.#x(() => {
                        try {
                            return G(() => {
                                var t = Y;
                                ((t.b = this),
                                    (t.f |= 128),
                                    n(
                                        this.#e,
                                        () => e,
                                        () => a,
                                    ));
                            });
                        } catch (e) {
                            return (ka(e, this.#i.parent), null);
                        }
                    }));
            };
        Da(() => {
            var t;

            try {
                t = this.transform_error(e);
            } catch (e) {
                ka(e, this.#i && this.#i.parent);

                return;
            }

            typeof t == `object` && t && typeof t.then == `function`
                ? t.then(o, (e) => ka(e, this.#i && this.#i.parent))
                : o(t);
        });
    }
};
function Ba(e, t, n, r) {
    let i = Sa() ? Wa : Ja;
    var a = e.filter((e) => !e.settled),
        o = t.map(i);

    if (n.length === 0 && a.length === 0) {
        r(o);

        return;
    }

    var s = Y,
        c = Va(),
        l =
            a.length === 1
                ? a[0].promise
                : a.length > 1
                  ? Promise.all(a.map((e) => e.promise))
                  : null;
    function u(e) {
        if (!(s.f & 16384)) {
            c();

            try {
                r([...o, ...e]);
            } catch (e) {
                ka(e, s);
            }

            Ha();
        }
    }
    var d = Ua();

    if (n.length === 0) {
        l.then(() => u([])).finally(d);

        return;
    }

    function f() {
        Promise.all(n.map((e) => Ka(e)))
            .then(u)
            .catch((e) => ka(e, s))
            .finally(d);
    }
    l
        ? l.then(() => {
              (c(), f(), Ha());
          })
        : f();
}
function Va() {
    var e = Y,
        t = q,
        n = V,
        r = U;

    return function (i = !0) {
        (ys(e),
            J(t),
            ha(n),
            i && !(e.f & 16384) && (r?.activate(), r?.apply()));
    };
}
function Ha(e = !0) {
    (ys(null), J(null), ha(null), e && U?.deactivate());
}
function Ua() {
    var e = Y,
        t = e.b,
        n = U,
        r = !!t?.is_rendered();

    return (
        t?.update_pending_count(1, n),
        n.increment(r, e),
        () => {
            (t?.update_pending_count(-1, n), n.decrement(r, e));
        }
    );
}
function Wa(e) {
    var t = 2 | xi;

    return (
        Y !== null && (Y.f |= ki),
        {
            ctx: V,
            deps: null,
            effects: null,
            equals: ua,
            f: t,
            fn: e,
            reactions: null,
            rv: 0,
            v: F,
            wv: 0,
            parent: Y,
            ac: null,
        }
    );
}
var Ga = Symbol(`obsolete`);
function Ka(e, t, n) {
    let r = Y;
    r === null && Gi();
    var i = void 0,
        a = Co(F),
        o = !q,
        s = new Set();

    return (
        es(() => {
            var t = Y,
                n = bi();
            i = n.promise;

            try {
                Promise.resolve(e())
                    .then(n.resolve, (e) => {
                        e !== Hi && n.reject(e);
                    })
                    .finally(Ha);
            } catch (e) {
                (n.reject(e), Ha());
            }

            var c = U;

            if (o) {
                if (t.f & 32768) {
                    var l = Ua();
                }

                if (r.b?.is_rendered()) {
                    c.async_deriveds.get(t)?.reject(Ga);
                } else {
                    for (let e of s.values()) {
                        e.reject(Ga);
                    }
                }

                (s.add(n), c.async_deriveds.set(t, n));
            }

            let u = (e, t = void 0) => {
                (l?.(),
                    s.delete(n),
                    t !== Ga &&
                        (c.activate(),
                        t
                            ? ((a.f |= Fi), Eo(a, t))
                            : (a.f & 8388608 && (a.f ^= Fi), Eo(a, e)),
                        c.deactivate()));
            };
            n.promise.then(u, (e) => u(null, e || `unknown`));
        }),
        Xo(() => {
            for (let e of s) {
                e.reject(Ga);
            }
        }),
        new Promise((e) => {
            function t(n) {
                function r() {
                    n === i ? e(a) : t(i);
                }
                n.then(r, r);
            }
            t(i);
        })
    );
}
function qa(e) {
    let t = Wa(e);

    return (xs(t), t);
}
function Ja(e) {
    let t = Wa(e);

    return ((t.equals = fa), t);
}
function Ya(e) {
    var t = e.effects;

    if (t !== null) {
        e.effects = null;

        for (var n = 0; n < t.length; n += 1) {
            K(t[n]);
        }
    }
}
function Xa(e) {
    var t,
        n = Y,
        r = e.parent;

    if (!gs && r !== null && e.v !== F && r.f & 24576) {
        return (ra(), e.v);
    }

    ys(r);

    try {
        ((e.f &= ~Mi), Ya(e), (t = As(e)));
    } finally {
        ys(n);
    }

    return t;
}
function Za(e) {
    var t = Xa(e);

    if (
        !e.equals(t) &&
        ((e.wv = Ds()),
        (!U?.is_fork || e.deps === null) &&
            (U === null
                ? (e.v = t)
                : (U.capture(e, t, !0), to?.capture(e, t, !0)),
            e.deps === null))
    ) {
        H(e, I);

        return;
    }

    gs || (no === null ? ja(e) : (Yo() || U?.is_fork) && no.set(e, t));
}
function Qa(e) {
    if (e.effects !== null) {
        for (let t of e.effects) {
            (t.teardown || t.ac) &&
                (t.teardown?.(),
                t.ac?.abort(Hi),
                t.fn !== null && (t.teardown = vi),
                (t.ac = null),
                Ms(t, 0),
                as(t));
        }
    }
}
function $a(e) {
    if (e.effects !== null) {
        for (let t of e.effects) {
            t.teardown && t.fn !== null && Ns(t);
        }
    }
}
var eo = null,
    U = null,
    to = null,
    no = null,
    ro = null,
    io = !1,
    ao = !1,
    oo = null,
    so = null,
    co = 0,
    lo = 1,
    uo = class e {
        id = lo++;
        #e = !1;
        linked = !0;
        #t = null;
        #n = null;
        async_deriveds = new Map();
        current = new Map();
        previous = new Map();
        #r = new Set();
        #i = new Set();
        #a = 0;
        #o = new Map();
        #s = null;
        #c = [];
        #l = [];
        #u = new Set();
        #d = new Set();
        #f = new Map();
        #p = new Set();
        is_fork = !1;
        #m = !1;
        constructor() {
            (eo === null ? (eo = this) : ((eo.#n = this), (this.#t = eo)),
                (eo = this));
        }
        #h() {
            if (this.is_fork) {
                return !0;
            }

            for (let n of this.#o.keys()) {
                for (var e = n, t = !1; e.parent !== null;) {
                    if (this.#f.has(e)) {
                        t = !0;
                        break;
                    }

                    e = e.parent;
                }

                if (!t) {
                    return !0;
                }
            }

            return !1;
        }
        skip_effect(e) {
            (this.#f.has(e) || this.#f.set(e, { d: [], m: [] }),
                this.#p.delete(e));
        }
        unskip_effect(e, t = (e) => this.schedule(e)) {
            var n = this.#f.get(e);

            if (n) {
                this.#f.delete(e);

                for (var r of n.d) {
                    (H(r, xi), t(r));
                }

                for (r of n.m) {
                    (H(r, Si), t(r));
                }
            }

            this.#p.add(e);
        }
        #g() {
            ((this.#e = !0), co++ > 1e3 && (this.#x(), fo()));

            for (let e of this.#u) {
                (this.#d.delete(e), H(e, xi), this.schedule(e));
            }

            for (let e of this.#d) {
                (H(e, Si), this.schedule(e));
            }

            let t = this.#c;
            ((this.#c = []), this.apply());
            var n = (oo = []),
                r = [],
                i = (so = []);

            for (let e of t) {
                try {
                    this.#_(e, n, r);
                } catch (t) {
                    throw (yo(e), this.#h() || this.discard(), t);
                }
            }

            if (((U = null), i.length > 0)) {
                var a = e.ensure();

                for (let e of i) {
                    a.schedule(e);
                }
            }

            if (((oo = null), (so = null), this.#h())) {
                (this.#b(r), this.#b(n));

                for (let [e, t] of this.#f) {
                    vo(e, t);
                }

                i.length > 0 && U.#g();

                return;
            }

            let o = this.#v();

            if (o) {
                (this.#b(r), this.#b(n), o.#y(this));

                return;
            }

            (this.#u.clear(), this.#d.clear());

            for (let e of this.#r) {
                e(this);
            }

            (this.#r.clear(),
                (to = this),
                mo(r),
                mo(n),
                (to = null),
                this.#s?.resolve());
            var s = U;

            if (
                (this.#a === 0 &&
                    (this.#c.length === 0 || s !== null) &&
                    this.#x(),
                this.#c.length > 0)
            ) {
                if (s !== null) {
                    let e = s;
                    e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
                } else {
                    s = this;
                }
            }

            s !== null && s.#g();
        }
        #_(e, t, n) {
            e.f ^= I;

            for (var r = e.first; r !== null;) {
                var i = r.f,
                    a = (i & 96) != 0;

                if (
                    !((a && i & 1024) || i & 8192 || this.#f.has(r)) &&
                    r.fn !== null
                ) {
                    a
                        ? (r.f ^= I)
                        : i & 4
                          ? t.push(r)
                          : Os(r) && (i & 16 && this.#d.add(r), Ns(r));
                    var o = r.first;

                    if (o !== null) {
                        r = o;
                        continue;
                    }
                }

                for (; r !== null;) {
                    var s = r.next;

                    if (s !== null) {
                        r = s;
                        break;
                    }

                    r = r.parent;
                }
            }
        }
        #v() {
            for (var e = this.#t; e !== null;) {
                if (!e.is_fork) {
                    for (let [t, [, n]] of this.current) {
                        if (e.current.has(t) && !n) {
                            return e;
                        }
                    }
                }

                e = e.#t;
            }

            return null;
        }
        #y(e) {
            for (let [t, n] of e.current) {
                (!this.previous.has(t) &&
                    e.previous.has(t) &&
                    this.previous.set(t, e.previous.get(t)),
                    this.current.set(t, n));
            }

            for (let [t, n] of e.async_deriveds) {
                let e = this.async_deriveds.get(t);
                e && n.promise.then(e.resolve).catch(e.reject);
            }

            (e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d));
            let t = (e) => {
                var n = e.reactions;

                if (n !== null) {
                    for (let e of n) {
                        var r = e.f;

                        if (r & 2) {
                            t(e);
                        } else {
                            var i = e;
                            r & 4194320 &&
                                !this.async_deriveds.has(i) &&
                                (this.#d.delete(i), H(i, xi), this.schedule(i));
                        }
                    }
                }
            };

            for (let e of this.current.keys()) {
                t(e);
            }

            (this.oncommit(() => e.discard()), e.#x(), (U = this), this.#g());
        }
        #b(e) {
            for (var t = 0; t < e.length; t += 1) {
                Na(e[t], this.#u, this.#d);
            }
        }
        capture(e, t, n = !1) {
            (e.v !== F && !this.previous.has(e) && this.previous.set(e, e.v),
                e.f & 8388608 || (this.current.set(e, [t, n]), no?.set(e, t)),
                this.is_fork || (e.v = t));
        }
        activate() {
            U = this;
        }
        deactivate() {
            ((U = null), (no = null));
        }
        flush() {
            try {
                ((ao = !0), (U = this), this.#g());
            } finally {
                ((co = 0),
                    (ro = null),
                    (oo = null),
                    (so = null),
                    (ao = !1),
                    (U = null),
                    (no = null),
                    xo.clear());
            }
        }
        discard() {
            for (let e of this.#i) {
                e(this);
            }

            this.#i.clear();

            for (let e of this.async_deriveds.values()) {
                e.reject(Ga);
            }

            (this.#x(), this.#s?.resolve());
        }
        register_created_effect(e) {
            this.#l.push(e);
        }
        increment(e, t) {
            if (((this.#a += 1), e)) {
                let e = this.#o.get(t) ?? 0;
                this.#o.set(t, e + 1);
            }
        }
        decrement(e, t) {
            if ((--this.#a, e)) {
                let e = this.#o.get(t) ?? 0;
                e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
            }

            this.#m ||
                ((this.#m = !0),
                Da(() => {
                    ((this.#m = !1), this.linked && this.flush());
                }));
        }
        transfer_effects(e, t) {
            for (let t of e) {
                this.#u.add(t);
            }

            for (let e of t) {
                this.#d.add(e);
            }

            (e.clear(), t.clear());
        }
        oncommit(e) {
            this.#r.add(e);
        }
        ondiscard(e) {
            this.#i.add(e);
        }
        settled() {
            return (this.#s ??= bi()).promise;
        }
        static ensure() {
            if (U === null) {
                let t = (U = new e());
                !ao &&
                    Da(() => {
                        t.#e || t.flush();
                    });
            }

            return U;
        }
        apply() {
            no = null;
        }
        schedule(e) {
            if (
                ((ro = e), e.b?.is_pending && e.f & 16777228 && !(e.f & 32768))
            ) {
                e.b.defer_effect(e);

                return;
            }

            for (var t = e; t.parent !== null;) {
                t = t.parent;
                var n = t.f;

                if (oo !== null && t === Y && (q === null || !(q.f & 2))) {
                    return;
                }

                if (n & 96) {
                    if (!(n & 1024)) {
                        return;
                    }

                    t.f ^= I;
                }
            }

            this.#c.push(t);
        }
        #x() {
            if (this.linked) {
                var e = this.#t,
                    t = this.#n;
                (e === null || (e.#n = t),
                    t === null ? (eo = e) : (t.#t = e),
                    (this.linked = !1));
            }
        }
    };
function fo() {
    try {
        Xi();
    } catch (e) {
        ka(e, ro);
    }
}
var po = null;
function mo(e) {
    var t = e.length;

    if (t !== 0) {
        for (var n = 0; n < t;) {
            var r = e[n++];

            if (
                !(r.f & 24576) &&
                Os(r) &&
                ((po = new Set()),
                Ns(r),
                r.deps === null &&
                    r.first === null &&
                    r.nodes === null &&
                    r.teardown === null &&
                    r.ac === null &&
                    cs(r),
                po?.size > 0)
            ) {
                xo.clear();

                for (let e of po) {
                    if (e.f & 24576) {
                        continue;
                    }

                    let t = [e],
                        n = e.parent;

                    for (; n !== null;) {
                        (po.has(n) && (po.delete(n), t.push(n)),
                            (n = n.parent));
                    }

                    for (let e = t.length - 1; e >= 0; e--) {
                        let n = t[e];
                        n.f & 24576 || Ns(n);
                    }
                }

                po.clear();
            }
        }

        po = null;
    }
}
function ho(e, t, n, r) {
    if (!n.has(e) && (n.add(e), e.reactions !== null)) {
        for (let i of e.reactions) {
            let e = i.f;
            e & 2
                ? ho(i, t, n, r)
                : e & 4194320 &&
                  !(e & 2048) &&
                  go(i, t, r) &&
                  (H(i, xi), _o(i));
        }
    }
}
function go(e, t, n) {
    let r = n.get(e);

    if (r !== void 0) {
        return r;
    }

    if (e.deps !== null) {
        for (let r of e.deps) {
            if (li.call(t, r)) {
                return !0;
            }

            if (r.f & 2 && go(r, t, n)) {
                return (n.set(r, !0), !0);
            }
        }
    }

    return (n.set(e, !1), !1);
}
function _o(e) {
    U.schedule(e);
}
function vo(e, t) {
    if (!(e.f & 32 && e.f & 1024)) {
        (e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), H(e, I));

        for (var n = e.first; n !== null;) {
            (vo(n, t), (n = n.next));
        }
    }
}
function yo(e) {
    H(e, I);

    for (var t = e.first; t !== null;) {
        (yo(t), (t = t.next));
    }
}
var bo = new Set(),
    xo = new Map(),
    So = !1;
function Co(e, t) {
    return { f: 0, v: e, reactions: null, equals: ua, rv: 0, wv: 0 };
}
function wo(e, t) {
    let n = Co(e, t);

    return (xs(n), n);
}
function To(e, t = !1, n = !0) {
    let r = Co(e);

    return (
        t || (r.equals = fa),
        pa && n && V !== null && V.l !== null && (V.l.s ??= []).push(r),
        r
    );
}
function W(e, t, n = !1) {
    return (
        q !== null &&
            (!vs || q.f & 131072) &&
            Sa() &&
            q.f & 4325394 &&
            (bs === null || !bs.has(e)) &&
            ta(),
        Eo(e, n ? Ao(t) : t, so)
    );
}
function Eo(e, t, n = null) {
    if (!e.equals(t)) {
        xo.set(e, gs ? t : e.v);
        var r = uo.ensure();

        if ((r.capture(e, t), e.f & 2)) {
            let t = e;
            (e.f & 2048 && Xa(t), no === null && ja(t));
        }

        ((e.wv = Ds()),
            ko(e, xi, n),
            Sa() &&
                Y !== null &&
                Y.f & 1024 &&
                !(Y.f & 96) &&
                (Q === null ? Ss([e]) : Q.push(e)),
            !r.is_fork && bo.size > 0 && !So && Do());
    }

    return t;
}
function Do() {
    So = !1;

    for (let e of bo) {
        e.f & 1024 && H(e, Si);
        let t;

        try {
            t = Os(e);
        } catch {
            t = !0;
        }

        t && Ns(e);
    }

    bo.clear();
}
function Oo(e) {
    W(e, e.v + 1);
}
function ko(e, t, n) {
    var r = e.reactions;

    if (r !== null) {
        for (var i = Sa(), a = r.length, o = 0; o < a; o++) {
            var s = r[o],
                c = s.f;

            if (!(!i && s === Y)) {
                var l = (c & xi) === 0;

                if ((l && H(s, t), c & 131072)) {
                    bo.add(s);
                } else if (c & 2) {
                    var u = s;
                    (no?.delete(u),
                        c & 65536 ||
                            (c & 512 &&
                                (Y === null || !(Y.f & 2097152)) &&
                                (s.f |= Mi),
                            ko(u, Si, n)));
                } else if (l) {
                    var d = s;
                    (c & 16 && po !== null && po.add(d),
                        n === null ? _o(d) : n.push(d));
                }
            }
        }
    }
}
function Ao(e) {
    if (typeof e != `object` || !e || Ii in e) {
        return e;
    }

    let t = hi(e);

    if (t !== pi && t !== mi) {
        return e;
    }

    var n = new Map(),
        r = si(e),
        i = wo(0),
        a = null,
        o = Ts,
        s = (e) => {
            if (Ts === o) {
                return e();
            }

            var t = q,
                n = Ts;
            (J(null), Es(o));
            var r = e();

            return (J(t), Es(n), r);
        };

    return (
        r && n.set(`length`, wo(e.length, a)),
        new Proxy(e, {
            defineProperty(e, t, r) {
                (!(`value` in r) ||
                    r.configurable === !1 ||
                    r.enumerable === !1 ||
                    r.writable === !1) &&
                    $i();
                var i = n.get(t);

                return (
                    i === void 0
                        ? s(() => {
                              var e = wo(r.value, a);

                              return (n.set(t, e), e);
                          })
                        : W(i, r.value, !0),
                    !0
                );
            },
            deleteProperty(e, t) {
                var r = n.get(t);

                if (r === void 0) {
                    if (t in e) {
                        let e = s(() => wo(F, a));
                        (n.set(t, e), Oo(i));
                    }
                } else {
                    (W(r, F), Oo(i));
                }

                return !0;
            },
            get(t, r, i) {
                if (r === Ii) {
                    return e;
                }

                var o = n.get(r),
                    c = r in t;

                if (
                    (o === void 0 &&
                        (!c || fi(t, r)?.writable) &&
                        ((o = s(() => wo(Ao(c ? t[r] : F), a))), n.set(r, o)),
                    o !== void 0)
                ) {
                    var l = $(o);

                    return l === F ? void 0 : l;
                }

                return Reflect.get(t, r, i);
            },
            getOwnPropertyDescriptor(e, t) {
                var r = Reflect.getOwnPropertyDescriptor(e, t);

                if (r && `value` in r) {
                    var i = n.get(t);
                    i && (r.value = $(i));
                } else if (r === void 0) {
                    var a = n.get(t),
                        o = a?.v;

                    if (a !== void 0 && o !== F) {
                        return {
                            enumerable: !0,
                            configurable: !0,
                            value: o,
                            writable: !0,
                        };
                    }
                }

                return r;
            },
            has(e, t) {
                if (t === Ii) {
                    return !0;
                }

                var r = n.get(t),
                    i = (r !== void 0 && r.v !== F) || Reflect.has(e, t);

                return (r !== void 0 ||
                    (Y !== null && (!i || fi(e, t)?.writable))) &&
                    (r === void 0 &&
                        ((r = s(() => wo(i ? Ao(e[t]) : F, a))), n.set(t, r)),
                    $(r) === F)
                    ? !1
                    : i;
            },
            set(e, t, o, c) {
                var l = n.get(t),
                    u = t in e;

                if (r && t === `length`) {
                    for (var d = o; d < l.v; d += 1) {
                        var f = n.get(d + ``);
                        f === void 0
                            ? d in e &&
                              ((f = s(() => wo(F, a))), n.set(d + ``, f))
                            : W(f, F);
                    }
                }

                if (l === void 0) {
                    (!u || fi(e, t)?.writable) &&
                        ((l = s(() => wo(void 0, a))),
                        W(l, Ao(o)),
                        n.set(t, l));
                } else {
                    u = l.v !== F;
                    var p = s(() => Ao(o));
                    W(l, p);
                }

                var m = Reflect.getOwnPropertyDescriptor(e, t);

                if ((m?.set && m.set.call(c, o), !u)) {
                    if (r && typeof t == `string`) {
                        var h = n.get(`length`),
                            g = Number(t);
                        Number.isInteger(g) && g >= h.v && W(h, g + 1);
                    }

                    Oo(i);
                }

                return !0;
            },
            ownKeys(e) {
                $(i);
                var t = Reflect.ownKeys(e).filter((e) => {
                    var t = n.get(e);

                    return t === void 0 || t.v !== F;
                });

                for (var [r, a] of n) {
                    a.v !== F && !(r in e) && t.push(r);
                }

                return t;
            },
            setPrototypeOf() {
                ea();
            },
        })
    );
}
var jo, Mo, No, Po, Fo;
function Io() {
    if (jo === void 0) {
        ((jo = window),
            (Mo = document),
            (No = /Firefox/.test(navigator.userAgent)));
        var e = Element.prototype,
            t = Node.prototype,
            n = Text.prototype;
        ((Po = fi(t, `firstChild`).get),
            (Fo = fi(t, `nextSibling`).get),
            gi(e) &&
                ((e[zi] = void 0),
                (e[Ri] = null),
                (e[Bi] = void 0),
                (e.__e = void 0)),
            gi(n) && (n[Vi] = void 0));
    }
}
function Lo(e = ``) {
    return document.createTextNode(e);
}
function Ro(e) {
    return Po.call(e);
}
function zo(e) {
    return Fo.call(e);
}
function Bo(e, t = !1) {
    if (!L) {
        var n = Ro(e);

        return n instanceof Comment && n.data === `` ? zo(n) : n;
    }

    if (t) {
        if (z?.nodeType !== 3) {
            var r = Lo();

            return (z?.before(r), B(r), r);
        }

        Wo(z);
    }

    return z;
}
function Vo(e) {
    e.textContent = ``;
}
function Ho() {
    return !1;
}
function Uo(e, t, n) {
    return t == null || t === `http://www.w3.org/1999/xhtml`
        ? n
            ? document.createElement(e, { is: n })
            : document.createElement(e)
        : n
          ? document.createElementNS(t, e, { is: n })
          : document.createElementNS(t, e);
}
function Wo(e) {
    if (e.nodeValue.length < 65536) {
        return;
    }

    let t = e.nextSibling;

    for (; t !== null && t.nodeType === 3;) {
        (t.remove(), (e.nodeValue += t.nodeValue), (t = e.nextSibling));
    }
}
function Go(e) {
    var t = q,
        n = Y;
    (J(null), ys(null));

    try {
        return e();
    } finally {
        (J(t), ys(n));
    }
}
function Ko(e) {
    (Y === null && (q === null && Yi(e), Ji()), gs && qi(e));
}
function qo(e, t) {
    var n = t.last;
    n === null
        ? (t.last = t.first = e)
        : ((n.next = e), (e.prev = n), (t.last = e));
}
function Jo(e, t) {
    var n = Y;
    n !== null && n.f & 8192 && (e |= Ci);
    var r = {
        ctx: V,
        deps: null,
        nodes: null,
        f: e | xi | 512,
        first: null,
        fn: t,
        last: null,
        next: null,
        parent: n,
        b: n && n.b,
        prev: null,
        teardown: null,
        wv: 0,
        ac: null,
    };
    U?.register_created_effect(r);
    var i = r;

    if (e & 4) {
        oo === null ? uo.ensure().schedule(r) : oo.push(r);
    } else if (t !== null) {
        try {
            Ns(r);
        } catch (e) {
            throw (K(r), e);
        }

        i.deps === null &&
            i.teardown === null &&
            i.nodes === null &&
            i.first === i.last &&
            !(i.f & 524288) &&
            ((i = i.first), e & 16 && e & 65536 && i !== null && (i.f |= Di));
    }

    if (
        i !== null &&
        ((i.parent = n),
        n !== null && qo(i, n),
        q !== null && q.f & 2 && !(e & 64))
    ) {
        var a = q;
        (a.effects ??= []).push(i);
    }

    return r;
}
function Yo() {
    return q !== null && !vs;
}
function Xo(e) {
    let t = Jo(8, null);

    return (H(t, I), (t.teardown = e), t);
}
function Zo(e) {
    return Jo(4 | Ai, e);
}
function Qo(e) {
    return (Ko(`$effect.pre`), Jo(8 | Ai, e));
}
function $o(e) {
    uo.ensure();
    let t = Jo(64 | ki, e);

    return (e = {}) =>
        new Promise((n) => {
            e.outro
                ? ls(t, () => {
                      (K(t), n(void 0));
                  })
                : (K(t), n(void 0));
        });
}
function es(e) {
    return Jo(Pi | ki, e);
}
function ts(e, t = 0) {
    return Jo(8 | t, e);
}
function ns(e, t = [], n = [], r = []) {
    Ba(r, t, n, (t) => {
        Jo(4, () => e(...t.map($)));
    });
}
function rs(e, t = 0) {
    return Jo(16 | t, e);
}
function G(e) {
    return Jo(32 | ki, e);
}
function is(e) {
    var t = e.teardown;

    if (t !== null) {
        let e = gs,
            n = q;
        (_s(!0), J(null));

        try {
            t.call(null);
        } finally {
            (_s(e), J(n));
        }
    }
}
function as(e, t = !1) {
    var n = e.first;

    for (e.first = e.last = null; n !== null;) {
        let e = n.ac;
        e !== null &&
            Go(() => {
                e.abort(Hi);
            });
        var r = n.next;
        (n.f & 64 ? (n.parent = null) : K(n, t), (n = r));
    }
}
function os(e) {
    for (var t = e.first; t !== null;) {
        var n = t.next;
        (t.f & 32 || K(t), (t = n));
    }
}
function K(e, t = !0) {
    var n = !1;
    ((t || e.f & 262144) &&
        e.nodes !== null &&
        e.nodes.end !== null &&
        (ss(e.nodes.start, e.nodes.end), (n = !0)),
        (e.f |= Ei),
        as(e, t && !n),
        Ms(e, 0));
    var r = e.nodes && e.nodes.t;

    if (r !== null) {
        for (let e of r) {
            e.stop();
        }
    }

    (is(e), (e.f ^= Ei), (e.f |= wi));
    var i = e.parent;
    (i !== null && i.first !== null && cs(e),
        (e.next =
            e.prev =
            e.teardown =
            e.ctx =
            e.deps =
            e.fn =
            e.nodes =
            e.ac =
            e.b =
                null));
}
function ss(e, t) {
    for (; e !== null;) {
        var n = e === t ? null : zo(e);
        (e.remove(), (e = n));
    }
}
function cs(e) {
    var t = e.parent,
        n = e.prev,
        r = e.next;
    (n !== null && (n.next = r),
        r !== null && (r.prev = n),
        t !== null &&
            (t.first === e && (t.first = r), t.last === e && (t.last = n)));
}
function ls(e, t, n = !0) {
    var r = [];
    us(e, r, !0);
    var i = () => {
            (n && K(e), t && t());
        },
        a = r.length;

    if (a > 0) {
        var o = () => --a || i();

        for (var s of r) {
            s.out(o);
        }
    } else {
        i();
    }
}
function us(e, t, n) {
    if (!(e.f & 8192)) {
        e.f ^= Ci;
        var r = e.nodes && e.nodes.t;

        if (r !== null) {
            for (let e of r) {
                (e.is_global || n) && t.push(e);
            }
        }

        for (var i = e.first; i !== null;) {
            var a = i.next;

            if (!(i.f & 64)) {
                var o =
                    (i.f & 65536) != 0 || ((i.f & 32) != 0 && (e.f & 16) != 0);
                us(i, t, o ? n : !1);
            }

            i = a;
        }
    }
}
function ds(e) {
    fs(e, !0);
}
function fs(e, t) {
    if (e.f & 8192) {
        ((e.f ^= Ci), e.f & 1024 || (H(e, xi), uo.ensure().schedule(e)));

        for (var n = e.first; n !== null;) {
            var r = n.next,
                i = (n.f & 65536) != 0 || (n.f & 32) != 0;
            (fs(n, i ? t : !1), (n = r));
        }

        var a = e.nodes && e.nodes.t;

        if (a !== null) {
            for (let e of a) {
                (e.is_global || t) && e.in();
            }
        }
    }
}
function ps(e, t) {
    if (e.nodes) {
        for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
            var i = n === r ? null : zo(n);
            (t.append(n), (n = i));
        }
    }
}
var ms = null,
    hs = !1,
    gs = !1;
function _s(e) {
    gs = e;
}
var q = null,
    vs = !1;
function J(e) {
    q = e;
}
var Y = null;
function ys(e) {
    Y = e;
}
var bs = null;
function xs(e) {
    q !== null && (bs ??= new Set()).add(e);
}
var X = null,
    Z = 0,
    Q = null;
function Ss(e) {
    Q = e;
}
var Cs = 1,
    ws = 0,
    Ts = ws;
function Es(e) {
    Ts = e;
}
function Ds() {
    return ++Cs;
}
function Os(e) {
    var t = e.f;

    if (t & 2048) {
        return !0;
    }

    if ((t & 2 && (e.f &= ~Mi), t & 4096)) {
        for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
            var a = n[i];

            if ((Os(a) && Za(a), a.wv > e.wv)) {
                return !0;
            }
        }

        t & 512 && no === null && H(e, I);
    }

    return !1;
}
function ks(e, t, n = !0) {
    var r = e.reactions;

    if (r !== null && !(bs !== null && bs.has(e))) {
        for (var i = 0; i < r.length; i++) {
            var a = r[i];
            a.f & 2
                ? ks(a, t, !1)
                : t === a && (n ? H(a, xi) : a.f & 1024 && H(a, Si), _o(a));
        }
    }
}
function As(e) {
    var t = X,
        n = Z,
        r = Q,
        i = q,
        a = bs,
        o = V,
        s = vs,
        c = Ts,
        l = e.f;
    ((X = null),
        (Z = 0),
        (Q = null),
        (q = l & 96 ? null : e),
        (bs = null),
        ha(e.ctx),
        (vs = !1),
        (Ts = ++ws),
        e.ac !== null &&
            (Go(() => {
                e.ac.abort(Hi);
            }),
            (e.ac = null)));

    try {
        e.f |= Ni;
        var u = e.fn,
            d = u();
        e.f |= Ti;
        var f = e.deps,
            p = U?.is_fork;

        if (X !== null) {
            var m;

            if ((p || Ms(e, Z), f !== null && Z > 0)) {
                for (f.length = Z + X.length, m = 0; m < X.length; m++) {
                    f[Z + m] = X[m];
                }
            } else {
                e.deps = f = X;
            }

            if (Yo() && e.f & 512) {
                for (m = Z; m < f.length; m++) {
                    (f[m].reactions ??= []).push(e);
                }
            }
        } else {
            !p && f !== null && Z < f.length && (Ms(e, Z), (f.length = Z));
        }

        if (Sa() && Q !== null && !vs && f !== null && !(e.f & 6146)) {
            for (m = 0; m < Q.length; m++) {
                ks(Q[m], e);
            }
        }

        if (i !== null && i !== e) {
            if ((ws++, i.deps !== null)) {
                for (let e = 0; e < n; e += 1) {
                    i.deps[e].rv = ws;
                }
            }

            if (t !== null) {
                for (let e of t) {
                    e.rv = ws;
                }
            }

            Q !== null && (r === null ? (r = Q) : r.push(...Q));
        }

        return (e.f & 8388608 && (e.f ^= Fi), d);
    } catch (e) {
        return Oa(e);
    } finally {
        ((e.f ^= Ni),
            (X = t),
            (Z = n),
            (Q = r),
            (q = i),
            (bs = a),
            ha(o),
            (vs = s),
            (Ts = c));
    }
}
function js(e, t) {
    let n = t.reactions;

    if (n !== null) {
        var r = ci.call(n, e);

        if (r !== -1) {
            var i = n.length - 1;
            i === 0 ? (n = t.reactions = null) : ((n[r] = n[i]), n.pop());
        }
    }

    if (n === null && t.f & 2 && (X === null || !li.call(X, t))) {
        var a = t;
        (a.f & 512 && ((a.f ^= 512), (a.f &= ~Mi)),
            a.v !== F && ja(a),
            Qa(a),
            Ms(a, 0));
    }
}
function Ms(e, t) {
    var n = e.deps;

    if (n !== null) {
        for (var r = t; r < n.length; r++) {
            js(e, n[r]);
        }
    }
}
function Ns(e) {
    var t = e.f;

    if (!(t & 16384)) {
        H(e, I);
        var n = Y,
            r = hs;
        ((Y = e), (hs = !0));

        try {
            (t & 16777232 ? os(e) : as(e), is(e));
            var i = As(e);
            ((e.teardown = typeof i == `function` ? i : null), (e.wv = Cs));
        } finally {
            ((hs = r), (Y = n));
        }
    }
}
function $(e) {
    var t = (e.f & 2) != 0;

    if (
        (ms?.add(e),
        q !== null &&
            !vs &&
            !(Y !== null && Y.f & 16384) &&
            (bs === null || !bs.has(e)))
    ) {
        var n = q.deps;

        if (q.f & 2097152) {
            e.rv < ws &&
                ((e.rv = ws),
                X === null && n !== null && n[Z] === e
                    ? Z++
                    : X === null
                      ? (X = [e])
                      : X.push(e));
        } else {
            ((q.deps ??= []), li.call(q.deps, e) || q.deps.push(e));
            var r = e.reactions;
            r === null ? (e.reactions = [q]) : li.call(r, q) || r.push(q);
        }
    }

    if (gs && xo.has(e)) {
        return xo.get(e);
    }

    if (t) {
        var i = e;

        if (gs) {
            var a = i.v;

            return (
                ((!(i.f & 1024) && i.reactions !== null) || Fs(i)) &&
                    (a = Xa(i)),
                xo.set(i, a),
                a
            );
        }

        var o =
                (i.f & 512) == 0 &&
                !vs &&
                q !== null &&
                (hs || (q.f & 512) != 0),
            s = (i.f & Ti) === 0;
        (Os(i) && (o && (i.f |= 512), Za(i)), o && !s && ($a(i), Ps(i)));
    }

    if (no?.has(e)) {
        return no.get(e);
    }

    if (e.f & 8388608) {
        throw e.v;
    }

    return e.v;
}
function Ps(e) {
    if (((e.f |= 512), e.deps !== null)) {
        for (let t of e.deps) {
            ((t.reactions ??= []).push(e),
                t.f & 2 && !(t.f & 512) && ($a(t), Ps(t)));
        }
    }
}
function Fs(e) {
    if (e.v === F) {
        return !0;
    }

    if (e.deps === null) {
        return !1;
    }

    for (let t of e.deps) {
        if (xo.has(t) || (t.f & 2 && Fs(t))) {
            return !0;
        }
    }

    return !1;
}
function Is(e) {
    var t = vs;

    try {
        return ((vs = !0), e());
    } finally {
        vs = t;
    }
}
var Ls = Symbol(`events`),
    Rs = new Set(),
    zs = new Set(),
    Bs = null;
function Vs(e) {
    var t = this,
        n = t.ownerDocument,
        r = e.type,
        i = e.composedPath?.() || [],
        a = i[0] || e.target;
    Bs = e;
    var o = 0,
        s = Bs === e && e[Ls];

    if (s) {
        var c = i.indexOf(s);

        if (c !== -1 && (t === document || t === window)) {
            e[Ls] = t;

            return;
        }

        var l = i.indexOf(t);

        if (l === -1) {
            return;
        }

        c <= l && (o = c);
    }

    if (((a = i[o] || e.target), a !== t)) {
        di(e, `currentTarget`, {
            configurable: !0,
            get() {
                return a || n;
            },
        });
        var u = q,
            d = Y;
        (J(null), ys(null));

        try {
            for (var f, p = []; a !== null && a !== t;) {
                try {
                    var m = a[Ls]?.[r];
                    m != null &&
                        (!a.disabled || e.target === a) &&
                        m.call(a, e);
                } catch (e) {
                    f ? p.push(e) : (f = e);
                }

                if (e.cancelBubble) {
                    break;
                }

                (o++, (a = o < i.length ? i[o] : null));
            }

            if (f) {
                for (let e of p) {
                    queueMicrotask(() => {
                        throw e;
                    });
                }

                throw f;
            }
        } finally {
            ((e[Ls] = t), delete e.currentTarget, J(u), ys(d));
        }
    }
}
var Hs =
    globalThis?.window?.trustedTypes &&
    globalThis.window.trustedTypes.createPolicy(`svelte-trusted-html`, {
        createHTML: (e) => e,
    });
function Us(e) {
    return Hs?.createHTML(e) ?? e;
}
function Ws(e) {
    var t = Uo(`template`);

    return ((t.innerHTML = Us(e.replaceAll(`<!>`, `<!---->`))), t.content);
}
function Gs(e, t) {
    var n = Y;
    n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
function Ks(e, t) {
    var n = (t & 1) != 0,
        r = (t & 2) != 0,
        i,
        a = !e.startsWith(`<!>`);

    return () => {
        if (L) {
            return (Gs(z, null), z);
        }

        i === void 0 && ((i = Ws(a ? e : `<!>` + e)), n || (i = Ro(i)));
        var t = r || No ? document.importNode(i, !0) : i.cloneNode(!0);

        if (n) {
            var o = Ro(t),
                s = t.lastChild;
            Gs(o, s);
        } else {
            Gs(t, t);
        }

        return t;
    };
}
function qs() {
    if (L) {
        return (Gs(z, null), z);
    }

    var e = document.createDocumentFragment(),
        t = document.createComment(``),
        n = Lo();

    return (e.append(t, n), Gs(t, n), e);
}
function Js(e, t) {
    if (L) {
        var n = Y;
        ((!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = z), oa());

        return;
    }

    e !== null && e.before(t);
}
[
    ...`allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback`.split(
        `.`,
    ),
];
var Ys = [`touchstart`, `touchmove`];
function Xs(e) {
    return Ys.includes(e);
}
function Zs(e, t) {
    return ec(e, t);
}
function Qs(e, t) {
    (Io(), (t.intro = t.intro ?? !1));
    let n = t.target,
        r = L,
        i = z;

    try {
        for (var a = Ro(n); a && (a.nodeType !== 8 || a.data !== `[`);) {
            a = zo(a);
        }

        if (!a) {
            throw oi;
        }

        (R(!0), B(a));
        let r = ec(e, { ...t, anchor: a });

        return (R(!1), r);
    } catch (r) {
        if (
            r instanceof Error &&
            r.message
                .split(
                    `
`,
                )
                .some((e) => e.startsWith(`https://svelte.dev/e/`))
        ) {
            throw r;
        }

        return (
            r !== oi && console.warn(`Failed to hydrate: `, r),
            t.recover === !1 && Zi(),
            Io(),
            Vo(n),
            R(!1),
            Zs(e, t)
        );
    } finally {
        (R(r), B(i));
    }
}
var $s = new Map();
function ec(
    e,
    {
        target: t,
        anchor: n,
        props: r = {},
        events: i,
        context: a,
        intro: o = !0,
        transformError: s,
    },
) {
    Io();
    var c = void 0,
        l = $o(() => {
            var o = n ?? t.appendChild(Lo());
            Ra(
                o,
                { pending: () => {} },
                (t) => {
                    ba({});
                    var n = V;

                    if (
                        (a && (n.c = a),
                        i && (r.$$events = i),
                        L && Gs(t, null),
                        (c = e(t, r) || {}),
                        L &&
                            ((Y.nodes.end = z),
                            z === null || z.nodeType !== 8 || z.data !== `]`))
                    ) {
                        throw (ia(), oi);
                    }

                    xa();
                },
                s,
            );
            var l = new Set(),
                u = (e) => {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];

                        if (!l.has(r)) {
                            l.add(r);
                            var i = Xs(r);

                            for (let e of [t, document]) {
                                var a = $s.get(e);
                                a === void 0 && ((a = new Map()), $s.set(e, a));
                                var o = a.get(r);
                                o === void 0
                                    ? (e.addEventListener(r, Vs, {
                                          passive: i,
                                      }),
                                      a.set(r, 1))
                                    : a.set(r, o + 1);
                            }
                        }
                    }
                };

            return (
                u(ui(Rs)),
                zs.add(u),
                () => {
                    for (var e of l) {
                        for (let n of [t, document]) {
                            var r = $s.get(n),
                                i = r.get(e);
                            --i == 0
                                ? (n.removeEventListener(e, Vs),
                                  r.delete(e),
                                  r.size === 0 && $s.delete(n))
                                : r.set(e, i);
                        }
                    }

                    (zs.delete(u), o !== n && o.parentNode?.removeChild(o));
                }
            );
        });

    return (tc.set(c, l), c);
}
var tc = new WeakMap(),
    nc = class {
        anchor;
        #e = new Map();
        #t = new Map();
        #n = new Map();
        #r = new Set();
        #i = !0;
        constructor(e, t = !0) {
            ((this.anchor = e), (this.#i = t));
        }
        #a = (e) => {
            if (this.#e.has(e)) {
                var t = this.#e.get(e),
                    n = this.#t.get(t);

                if (n) {
                    (ds(n), this.#r.delete(t));
                } else {
                    var r = this.#n.get(t);
                    r &&
                        (ds(r.effect),
                        this.#t.set(t, r.effect),
                        this.#n.delete(t),
                        r.fragment.lastChild.remove(),
                        this.anchor.before(r.fragment),
                        (n = r.effect));
                }

                for (let [t, n] of this.#e) {
                    if ((this.#e.delete(t), t === e)) {
                        break;
                    }

                    let r = this.#n.get(n);
                    r && (K(r.effect), this.#n.delete(n));
                }

                for (let [e, r] of this.#t) {
                    if (e === t || this.#r.has(e)) {
                        continue;
                    }

                    let i = () => {
                        if (Array.from(this.#e.values()).includes(e)) {
                            var t = document.createDocumentFragment();
                            (ps(r, t),
                                t.append(Lo()),
                                this.#n.set(e, { effect: r, fragment: t }));
                        } else {
                            K(r);
                        }

                        (this.#r.delete(e), this.#t.delete(e));
                    };
                    this.#i || !n ? (this.#r.add(e), ls(r, i, !1)) : i();
                }
            }
        };
        #o = (e) => {
            this.#e.delete(e);
            let t = Array.from(this.#e.values());

            for (let [e, n] of this.#n) {
                t.includes(e) || (K(n.effect), this.#n.delete(e));
            }
        };
        ensure(e, t) {
            var n = U,
                r = Ho();

            if (t && !this.#t.has(e) && !this.#n.has(e)) {
                if (r) {
                    var i = document.createDocumentFragment(),
                        a = Lo();
                    (i.append(a),
                        this.#n.set(e, { effect: G(() => t(a)), fragment: i }));
                } else {
                    this.#t.set(
                        e,
                        G(() => t(this.anchor)),
                    );
                }
            }

            if ((this.#e.set(n, e), r)) {
                for (let [t, r] of this.#t) {
                    t === e ? n.unskip_effect(r) : n.skip_effect(r);
                }

                for (let [t, r] of this.#n) {
                    t === e
                        ? n.unskip_effect(r.effect)
                        : n.skip_effect(r.effect);
                }

                (n.oncommit(this.#a), n.ondiscard(this.#o));
            } else {
                (L && (this.anchor = z), this.#a(n));
            }
        }
    };
function rc(e, t, ...n) {
    var r = new nc(e);
    rs(() => {
        let e = t() ?? null;
        r.ensure(e, e && ((t) => e(t, ...n)));
    }, Di);
}
function ic(e, t, n = !1) {
    var r;
    L && ((r = z), oa());
    var i = new nc(e),
        a = n ? Di : 0;
    function o(e, t) {
        if (L) {
            var n = la(r);

            if (e !== parseInt(n.substring(1))) {
                var a = ca();
                (B(a), (i.anchor = a), R(!1), i.ensure(e, t), R(!0));

                return;
            }
        }

        i.ensure(e, t);
    }
    rs(() => {
        var e = !1;
        (t((t, n = 0) => {
            ((e = !0), o(n, t));
        }),
            e || o(-1, null));
    }, a);
}
var ac = Symbol(`NaN`);
function oc(e, t, n) {
    L && oa();
    var r = new nc(e),
        i = !Sa();
    rs(() => {
        var e = t();
        (e !== e && (e = ac),
            i && typeof e == `object` && e && (e = {}),
            r.ensure(e, n));
    });
}
function sc(e, t) {
    return t;
}
function cc(e, t, n) {
    for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
        let n = t[s];
        ls(
            n,
            () => {
                if (a) {
                    if (
                        (a.pending.delete(n),
                        a.done.add(n),
                        a.pending.size === 0)
                    ) {
                        var t = e.outrogroups;
                        (lc(e, ui(a.done)),
                            t.delete(a),
                            t.size === 0 && (e.outrogroups = null));
                    }
                } else {
                    --o;
                }
            },
            !1,
        );
    }

    if (o === 0) {
        var c = r.length === 0 && n !== null;

        if (c) {
            var l = n,
                u = l.parentNode;
            (Vo(u), u.append(l), e.items.clear());
        }

        lc(e, t, !c);
    } else {
        ((a = { pending: new Set(t), done: new Set() }),
            (e.outrogroups ??= new Set()).add(a));
    }
}
function lc(e, t, n = !0) {
    var r;

    if (e.pending.size > 0) {
        r = new Set();

        for (let t of e.pending.values()) {
            for (let n of t) {
                r.add(e.items.get(n).e);
            }
        }
    }

    for (var i = 0; i < t.length; i++) {
        var a = t[i];
        r?.has(a)
            ? ((a.f |= ji), ps(a, document.createDocumentFragment()))
            : K(t[i], n);
    }
}
var uc;
function dc(e, t, n, r, i, a = null) {
    var o = e,
        s = new Map();

    if (t & 4) {
        var c = e;
        o = L ? B(Ro(c)) : c.appendChild(Lo());
    }

    L && oa();
    var l = null,
        u = Ja(() => {
            var e = n();

            return si(e) ? e : e == null ? [] : ui(e);
        }),
        d,
        f = new Map(),
        p = !0;
    function m(e) {
        g.effect.f & 16384 ||
            (g.pending.delete(e),
            (g.fallback = l),
            pc(g, d, o, t, r),
            l !== null &&
                (d.length === 0
                    ? l.f & 33554432
                        ? ((l.f ^= ji), hc(l, null, o))
                        : ds(l)
                    : ls(l, () => {
                          l = null;
                      })));
    }
    function h(e) {
        g.pending.delete(e);
    }
    var g = {
        effect: rs(() => {
            d = $(u);
            var e = d.length;
            let c = !1;
            L &&
                (la(o) === `[!`) != (e === 0) &&
                ((o = ca()), B(o), R(!1), (c = !0));

            for (var g = new Set(), _ = U, v = Ho(), y = 0; y < e; y += 1) {
                L &&
                    z.nodeType === 8 &&
                    z.data === `]` &&
                    ((o = z), (c = !0), R(!1));
                var b = d[y],
                    ee = r(b, y),
                    x = p ? null : s.get(ee);
                (x
                    ? (x.v && Eo(x.v, b),
                      x.i && Eo(x.i, y),
                      v && _.unskip_effect(x.e))
                    : ((x = mc(s, p ? o : (uc ??= Lo()), b, ee, y, i, t, n)),
                      p || (x.e.f |= ji),
                      s.set(ee, x)),
                    g.add(ee));
            }

            if (
                (e === 0 &&
                    a &&
                    !l &&
                    (p
                        ? (l = G(() => a(o)))
                        : ((l = G(() => a((uc ??= Lo())))), (l.f |= ji))),
                e > g.size && Ki(``, ``, ``),
                L && e > 0 && B(ca()),
                !p)
            ) {
                if ((f.set(_, g), v)) {
                    for (let [e, t] of s) {
                        g.has(e) || _.skip_effect(t.e);
                    }

                    (_.oncommit(m), _.ondiscard(h));
                } else {
                    m(_);
                }
            }

            (c && R(!0), $(u));
        }),
        flags: t,
        items: s,
        pending: f,
        outrogroups: null,
        fallback: l,
    };
    ((p = !1), L && (o = z));
}
function fc(e) {
    for (; e !== null && !(e.f & 32);) {
        e = e.next;
    }

    return e;
}
function pc(e, t, n, r, i) {
    var a = (r & 8) != 0,
        o = t.length,
        s = e.items,
        c = fc(e.effect.first),
        l,
        u = null,
        d,
        f = [],
        p = [],
        m,
        h,
        g,
        _;

    if (a) {
        for (_ = 0; _ < o; _ += 1) {
            ((m = t[_]),
                (h = i(m, _)),
                (g = s.get(h).e),
                g.f & 33554432 ||
                    (g.nodes?.a?.measure(), (d ??= new Set()).add(g)));
        }
    }

    for (_ = 0; _ < o; _ += 1) {
        if (
            ((m = t[_]),
            (h = i(m, _)),
            (g = s.get(h).e),
            e.outrogroups !== null)
        ) {
            for (let t of e.outrogroups) {
                (t.pending.delete(g), t.done.delete(g));
            }
        }

        if (
            (g.f & 8192 &&
                (ds(g),
                a && (g.nodes?.a?.unfix(), (d ??= new Set()).delete(g))),
            g.f & 33554432)
        ) {
            if (((g.f ^= ji), g === c)) {
                hc(g, null, n);
            } else {
                var v = u ? u.next : c;
                (g === e.effect.last && (e.effect.last = g.prev),
                    g.prev && (g.prev.next = g.next),
                    g.next && (g.next.prev = g.prev),
                    gc(e, u, g),
                    gc(e, g, v),
                    hc(g, v, n),
                    (u = g),
                    (f = []),
                    (p = []),
                    (c = fc(u.next)));
                continue;
            }
        }

        if (g !== c) {
            if (l !== void 0 && l.has(g)) {
                if (f.length < p.length) {
                    var y = p[0],
                        b;
                    u = y.prev;
                    var ee = f[0],
                        x = f[f.length - 1];

                    for (b = 0; b < f.length; b += 1) {
                        hc(f[b], y, n);
                    }

                    for (b = 0; b < p.length; b += 1) {
                        l.delete(p[b]);
                    }

                    (gc(e, ee.prev, x.next),
                        gc(e, u, ee),
                        gc(e, x, y),
                        (c = y),
                        (u = x),
                        --_,
                        (f = []),
                        (p = []));
                } else {
                    (l.delete(g),
                        hc(g, c, n),
                        gc(e, g.prev, g.next),
                        gc(e, g, u === null ? e.effect.first : u.next),
                        gc(e, u, g),
                        (u = g));
                }

                continue;
            }

            for (f = [], p = []; c !== null && c !== g;) {
                ((l ??= new Set()).add(c), p.push(c), (c = fc(c.next)));
            }

            if (c === null) {
                continue;
            }
        }

        (g.f & 33554432 || f.push(g), (u = g), (c = fc(g.next)));
    }

    if (e.outrogroups !== null) {
        for (let t of e.outrogroups) {
            t.pending.size === 0 &&
                (lc(e, ui(t.done)), e.outrogroups?.delete(t));
        }

        e.outrogroups.size === 0 && (e.outrogroups = null);
    }

    if (c !== null || l !== void 0) {
        var te = [];

        if (l !== void 0) {
            for (g of l) {
                g.f & 8192 || te.push(g);
            }
        }

        for (; c !== null;) {
            (!(c.f & 8192) && c !== e.fallback && te.push(c), (c = fc(c.next)));
        }

        var ne = te.length;

        if (ne > 0) {
            var re = r & 4 && o === 0 ? n : null;

            if (a) {
                for (_ = 0; _ < ne; _ += 1) {
                    te[_].nodes?.a?.measure();
                }

                for (_ = 0; _ < ne; _ += 1) {
                    te[_].nodes?.a?.fix();
                }
            }

            cc(e, te, re);
        }
    }

    a &&
        Da(() => {
            if (d !== void 0) {
                for (g of d) {
                    g.nodes?.a?.apply();
                }
            }
        });
}
function mc(e, t, n, r, i, a, o, s) {
    var c = o & 1 ? (o & 16 ? Co(n) : To(n, !1, !1)) : null,
        l = o & 2 ? Co(i) : null;

    return {
        v: c,
        i: l,
        e: G(
            () => (
                a(t, c ?? n, l ?? i, s),
                () => {
                    e.delete(r);
                }
            ),
        ),
    };
}
function hc(e, t, n) {
    if (e.nodes) {
        for (
            var r = e.nodes.start,
                i = e.nodes.end,
                a = t && !(t.f & 33554432) ? t.nodes.start : n;
            r !== null;
        ) {
            var o = zo(r);

            if ((a.before(r), r === i)) {
                return;
            }

            r = o;
        }
    }
}
function gc(e, t, n) {
    (t === null ? (e.effect.first = n) : (t.next = n),
        n === null ? (e.effect.last = t) : (n.prev = t));
}
function _c(e, t, n) {
    var r;
    L && ((r = z), oa());
    var i = new nc(e);
    rs(() => {
        var e = t() ?? null;

        if (L && (la(r) === `[`) != (e !== null)) {
            var a = ca();
            (B(a),
                (i.anchor = a),
                R(!1),
                i.ensure(e, e && ((t) => n(t, e))),
                R(!0));

            return;
        }

        i.ensure(e, e && ((t) => n(t, e)));
    }, Di);
}
function vc(e, t) {
    let n = null,
        r = L;
    var i;

    if (L) {
        n = z;

        for (
            var a = Ro(document.head);
            a !== null && (a.nodeType !== 8 || a.data !== e);
        ) {
            a = zo(a);
        }

        if (a === null) {
            R(!1);
        } else {
            var o = zo(a);
            (a.remove(), B(o));
        }
    }

    L || (i = document.head.appendChild(Lo()));

    try {
        rs(() => {
            var e = G(() => t(i));
            e.f |= Oi;
        });
    } finally {
        r && (R(!0), B(n));
    }
}
var yc = {
    get(e, t) {
        let n = e.props.length;

        for (; n--;) {
            let r = e.props[n];

            if ((_i(r) && (r = r()), typeof r == `object` && r && t in r)) {
                return r[t];
            }
        }
    },
    set(e, t, n) {
        let r = e.props.length;

        for (; r--;) {
            let i = e.props[r];
            _i(i) && (i = i());
            let a = fi(i, t);

            if (a && a.set) {
                return (a.set(n), !0);
            }
        }

        return !1;
    },
    getOwnPropertyDescriptor(e, t) {
        let n = e.props.length;

        for (; n--;) {
            let r = e.props[n];

            if ((_i(r) && (r = r()), typeof r == `object` && r && t in r)) {
                let e = fi(r, t);

                return (e && !e.configurable && (e.configurable = !0), e);
            }
        }
    },
    has(e, t) {
        if (t === Ii || t === Li) {
            return !1;
        }

        for (let n of e.props) {
            if ((_i(n) && (n = n()), n != null && t in n)) {
                return !0;
            }
        }

        return !1;
    },
    ownKeys(e) {
        let t = [];

        for (let n of e.props) {
            if ((_i(n) && (n = n()), n)) {
                for (let e in n) {
                    t.includes(e) || t.push(e);
                }

                for (let e of Object.getOwnPropertySymbols(n)) {
                    t.includes(e) || t.push(e);
                }
            }
        }

        return t;
    },
};
function bc(...e) {
    return new Proxy({ props: e }, yc);
}
function xc(e, t, n, r) {
    var i = !pa || (n & 2) != 0,
        a = (n & 8) != 0,
        o = (n & 16) != 0,
        s = r,
        c = !0,
        l = void 0,
        u = () =>
            o && i
                ? ((l ??= Wa(r)), $(l))
                : (c && ((c = !1), (s = o ? Is(r) : r)), s);
    let d;

    if (a) {
        var f = Ii in e || Li in e;
        d = fi(e, t)?.set ?? (f && t in e ? (n) => (e[t] = n) : void 0);
    }

    var p,
        m = !1;
    (a ? ([p, m] = Fa(() => e[t])) : (p = e[t]),
        p === void 0 && r !== void 0 && ((p = u()), d && (i && Qi(t), d(p))));
    var h = i
        ? () => {
              var n = e[t];

              return n === void 0 ? u() : ((c = !0), n);
          }
        : () => {
              var n = e[t];

              return (n !== void 0 && (s = void 0), n === void 0 ? s : n);
          };

    if (i && !(n & 4)) {
        return h;
    }

    if (d) {
        var g = e.$$legacy;

        return function (e, t) {
            return arguments.length > 0
                ? ((!i || !t || g || m) && d(t ? h() : e), e)
                : h();
        };
    }

    var _ = !1,
        v = (n & 1 ? Wa : Ja)(() => ((_ = !1), h()));
    a && $(v);
    var y = Y;

    return function (e, t) {
        if (arguments.length > 0) {
            let n = t ? $(v) : i && a ? Ao(e) : e;

            return (W(v, n), (_ = !0), s !== void 0 && (s = n), e);
        }

        return (gs && _) || y.f & 16384 ? v.v : $(v);
    };
}
var Sc = Tr(),
    Cc = Ao({ shared: {}, named: {} });
Sc.subscribe(() => {
    let e = Sc.get();
    ((Cc.shared = e.shared), (Cc.named = e.named));
});
function wc() {
    Sc.reset();
    let e = Sc.get();
    ((Cc.shared = e.shared), (Cc.named = e.named));
}
var Tc = Ao({ component: ``, props: {}, url: ``, version: null });
function Ec(e) {
    Object.assign(Tc, e);
}
var Dc = (e, t, n, r = null) => {
    let i = typeof t == `object` && !!t && !Array.isArray(t);

    return {
        component: e,
        key: i ? r : typeof n == `number` ? n : null,
        props: i ? t : {},
        children: i
            ? Array.isArray(n)
                ? n
                : n === null
                  ? []
                  : [n]
            : Array.isArray(t)
              ? t
              : t === null
                ? []
                : [t],
    };
};
function Oc(e, t) {
    ba(t, !0);
    let n = xc(t, `props`, 19, () => ({})),
        r = xc(t, `children`, 19, () => []),
        i = xc(t, `key`, 3, null);
    var a = qs(),
        o = Bo(a),
        s = (e) => {
            var a = qs();
            (oc(
                Bo(a),
                () => (r()?.length === 0 ? i() : null),
                (e) => {
                    var i = qs(),
                        a = Bo(i),
                        o = (e) => {
                            let i = qa(() => t.component);
                            var a = qs();
                            (_c(
                                Bo(a),
                                () => $(i),
                                (e, t) => {
                                    t(
                                        e,
                                        bc(n, {
                                            children: (e, t) => {
                                                var n = qs();
                                                (dc(
                                                    Bo(n),
                                                    17,
                                                    r,
                                                    sc,
                                                    (e, t) => {
                                                        Oc(
                                                            e,
                                                            bc(() => $(t)),
                                                        );
                                                    },
                                                ),
                                                    Js(e, n));
                                            },
                                            $$slots: { default: !0 },
                                        }),
                                    );
                                },
                            ),
                                Js(e, a));
                        },
                        s = (e) => {
                            let r = qa(() => t.component);
                            var i = qs();
                            (_c(
                                Bo(i),
                                () => $(r),
                                (e, t) => {
                                    t(e, bc(n));
                                },
                            ),
                                Js(e, i));
                        };
                    (ic(a, (e) => {
                        r().length > 0 ? e(o) : e(s, -1);
                    }),
                        Js(e, i));
                },
            ),
                Js(e, a));
        };
    (ic(o, (e) => {
        t.component && e(s);
    }),
        Js(e, a),
        xa());
}
function kc(e, t) {
    ba(t, !0);
    let n = wo(Ao(t.initialComponent)),
        r = wo(null),
        i = wo(Ao({ ...t.initialPage, flash: t.initialPage.flash ?? {} })),
        a = qa(() => l($(n), $(i), $(r)));
    (Ec($(i)),
        Qo(() => {
            Ec($(i));
        }));
    let o = typeof window > `u`;
    o ||
        ai.init({
            initialPage: t.initialPage,
            resolveComponent: t.resolveComponent,
            swapComponent: async (e) => {
                (W(n, e.component, !0),
                    W(i, e.page, !0),
                    W(r, e.preserveState ? $(r) : Date.now(), !0),
                    e.preserveState || wc());
            },
            onFlash: (e) => {
                W(i, { ...$(i), flash: e }, !0);
            },
        });
    function s(e) {
        return e
            ? typeof e == `function`
                ? e.name !== ``
                : typeof e == `object` && `$$` in e
            : !1;
    }
    function c(e) {
        return (
            typeof e == `function` && e.length === 2 && e.prototype === void 0
        );
    }
    function l(e, n, r = null) {
        let i = Dc(e.default, n.props, [], r);

        if (e.layout && c(e.layout)) {
            return e.layout(Dc, i);
        }

        let a,
            o = null,
            l = e.layout;

        if (typeof l == `function` && l.length <= 1 && l.prototype === void 0) {
            let e = l(n.props);
            jr(e, s)
                ? ((a = t.defaultLayout?.(n.component, n)), (o = e))
                : (a = e);
        } else {
            Ar(l, s)
                ? ((a = t.defaultLayout?.(n.component, n)), (o = l))
                : (a = l ?? t.defaultLayout?.(n.component, n));
        }

        return a ? u(a, i, n.props, r, !!e.layout && !o, o) : i;
    }
    function u(e, t, n, r, i = !0, a = null) {
        if (i && c(e)) {
            return e(Dc, t);
        }

        let l = Pr(e, s, i ? c : void 0);

        if (
            (a && (l = l.map((e) => ({ ...e, props: { ...e.props, ...a } }))),
            l.length > 0)
        ) {
            let e = o
                ? { shared: {}, named: {} }
                : { shared: Cc.shared, named: Cc.named };

            return l.reduceRight(
                (t, i) => ({
                    ...Dc(
                        i.component,
                        {
                            ...n,
                            ...i.props,
                            ...e.shared,
                            ...((i.name && e.named[i.name]) || {}),
                        },
                        [t],
                        r,
                    ),
                    name: i.name,
                }),
                t,
            );
        }

        return t;
    }
    (Oc(
        e,
        bc(() => $(a)),
    ),
        xa());
}
var [Ac, jc] = ga();
async function Mc({
    id: e = `app`,
    resolve: t,
    setup: n,
    progress: r = {},
    page: i,
    defaults: a = {},
    nonce: o,
    http: s,
    layout: c,
    serverHead: l,
    withApp: u,
    dev: d = !1,
} = {}) {
    (Nc.replace(a), o && Nc.set(`nonce`, o), s && cr.setClient(s), d && ur());
    let f = typeof window > `u`,
        p = (e, n) => Promise.resolve(t(e, n));

    if (f && !i) {
        return async (t, r) => {
            let i = {
                    initialPage: t,
                    initialComponent: await p(t.component, t),
                    resolveComponent: p,
                    defaultLayout: c,
                },
                a;

            if (n) {
                let e = await n({ el: null, App: kc, props: i });

                if (!e) {
                    throw Error(
                        `Inertia SSR setup function must return a render result ({ body, head })`,
                    );
                }

                a = e;
            } else {
                let e = new Map();
                (u && u(e, { ssr: !0, page: t }),
                    (a = r(kc, { props: i, context: e })));
            }

            return { body: ii(e, t, a.body), head: [...Sr(t, l), a.head] };
        };
    }

    let m = i || mn(e),
        h =
            !f && l
                ? wr(
                      !1,
                      (e) => e,
                      () => {},
                      Sr(m, l),
                  )
                : null,
        [g] = await Promise.all([
            p(m.component, m),
            ai.decryptHistory().catch(() => {}),
        ]),
        _ = {
            initialPage: m,
            initialComponent: g,
            resolveComponent: p,
            defaultLayout: c,
        };

    if (f) {
        if (!n) {
            throw Error(
                `Inertia SSR requires a setup function that returns a render result ({ body, head })`,
            );
        }

        let t = await n({ el: null, App: kc, props: _ });

        return t
            ? { body: ii(e, m, t.body), head: [...Sr(m, l), t.head] }
            : void 0;
    }

    let v = document.getElementById(e);

    if (n) {
        await n({ el: v, App: kc, props: _ });
    } else {
        let e = new Map();
        (u && u(e, { ssr: !1, page: m }),
            v.hasAttribute(`data-server-rendered`)
                ? Qs(kc, { target: v, props: _, context: e })
                : Zs(kc, { target: v, props: _, context: e }));
    }

    if (h) {
        let e = (e) => {
            h.updateServerHead(Sr(e.detail.page, l));
        };
        (ai.on(`navigate`, e), ai.on(`clientVisit`, e));
    }

    r && ri(r);
}
var Nc = Nt.extend({}),
    Pc = `Laravel`;
Mc({
    resolve: async (e, t) => {
        let n = Object.assign({
                './pages/Welcome.svelte': () =>
                    Mt(() => import(`./Welcome-hKsl5JUM.js`), []),
            }),
            r = await (
                n[`./pages/${e}.svelte`] || n[`./Pages/${e}.svelte`]
            )?.();

        if (!r) {
            throw Error(`Page not found: ${e}`);
        }

        return r;
    },
    title: (e) => (e ? `${e} - ${Pc}` : Pc),
    progress: { color: `#4B5563` },
});
export {
    qs as a,
    ns as c,
    qa as d,
    xa as f,
    vi as g,
    sa as h,
    Js as i,
    Mo as l,
    ma as m,
    vc as n,
    Ks as o,
    ba as p,
    rc as r,
    $ as s,
    xc as t,
    Bo as u,
};
