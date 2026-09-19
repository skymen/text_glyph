var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@pmndrs/glyph/dist/internal/dev.js
var e;
var init_dev = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/dev.js"() {
    e = true;
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-format-compiler.js
var e2, t;
var init_raster_format_compiler = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-format-compiler.js"() {
    e2 = Symbol(`pmndrs.glyph.raster-format.install-compiler`);
    t = Symbol(`pmndrs.glyph.raster-format.bind-compiler`);
  }
});

// node_modules/@pmndrs/glyph/dist/loaded-font.js
function i(e29, ...t31) {
  let r34 = [e29, ...t31];
  T(e29);
  let i36 = /* @__PURE__ */ new Set([e29]);
  for (let e30 of t31) {
    if (T(e30), i36.has(e30)) throw TypeError(`font stack cannot contain the same font more than once`);
    i36.add(e30);
  }
  let a34 = Object.freeze({ fonts: Object.freeze(r34) });
  return n.add(a34), a34;
}
function a(e29) {
  if (typeof e29 != `object` || !e29 || !n.has(e29)) throw TypeError(`font stack was not created by this package`);
  for (let t31 of e29.fonts) T(t31);
  return e29.fonts;
}
function o(e29) {
  if (typeof e29 != `object` || !e29) throw TypeError(`font selection must be an object`);
  return w(e29) ? a(e29) : (T(e29), [e29]);
}
function l(e29) {
  if (!e29.disposed) {
    e29.disposed = true;
    for (let t31 of e29.disposeListeners) try {
      t31();
    } catch (e30) {
      D(`notifying an immutable-font disposal observer`, e30);
    }
    e29.disposeListeners.clear(), e29.release();
  }
}
function u(e29, t31) {
  return E(e29).observeDispose(t31);
}
function d(e29) {
  return { font: e29, leases: 0, released: false };
}
function f(e29) {
  if (e29.backing.released) throw TypeError(`font backing has been released`);
  return e29.backing.leases += 1, { ...e29, compileRaster: e29.format[t](e29.data), releaseData: () => e29.format.dispose(e29.data), releaseListeners: /* @__PURE__ */ new Set(), leases: 0, released: false };
}
function p(e29) {
  return new c(e29);
}
function m(e29) {
  return p(E(e29).variant());
}
function h(e29) {
  if (e29.released) throw TypeError(`font variant has been released`);
  e29.leases += 1;
}
function g(e29) {
  if (e29.leases <= 0) throw Error(`immutable font lease underflow`);
  if (--e29.leases, !(e29.leases !== 0 || e29.released)) {
    e29.released = true;
    for (let t31 of e29.releaseListeners) try {
      t31();
    } catch (e30) {
      D(`notifying an immutable-variant release observer`, e30);
    }
    e29.releaseListeners.clear();
    try {
      e29.releaseData();
    } catch (e30) {
      D(`releasing immutable raster-format data`, e30);
    }
    try {
      e29.raster.dispose();
    } catch (e30) {
      D(`releasing immutable raster data`, e30);
    }
    C(e29.backing);
  }
}
function v(e29) {
  let t31 = E(e29).variant();
  return { font: t31.backing.font, raster: t31.raster, data: t31.data };
}
function y(e29) {
  return E(e29).variant();
}
function b(e29, t31) {
  return E(e29).variant().compileRaster(t31);
}
function x(e29) {
  return new S(E(e29).variant());
}
function C(e29) {
  if (e29.leases <= 0) throw Error(`immutable font backing lease underflow`);
  if (--e29.leases, !(e29.leases !== 0 || e29.released)) {
    e29.released = true;
    try {
      e29.font.dispose();
    } catch (e30) {
      D(`releasing immutable font backing`, e30);
    }
  }
}
function w(e29) {
  return n.has(e29);
}
function T(e29) {
  if (!(e29 instanceof c)) throw TypeError(`font was not created by this package`);
  if (e29.disposed) throw TypeError(`font has been disposed`);
}
function E(e29) {
  return T(e29), e29;
}
function D(t31, n39) {
  e && console.warn(`font teardown continued after ${t31} failed: ${String(n39)}`);
}
var n, r, c, S;
var init_loaded_font = __esm({
  "node_modules/@pmndrs/glyph/dist/loaded-font.js"() {
    init_dev();
    init_raster_format_compiler();
    n = /* @__PURE__ */ new WeakSet();
    r = new FinalizationRegistry((e29) => {
      l(e29);
    });
    c = class {
      #e;
      #t;
      metrics;
      glyphCount;
      raster;
      constructor(e29) {
        h(e29), this.#e = e29, this.metrics = e29.backing.font.metrics, this.glyphCount = e29.backing.font.glyphCount, this.raster = e29.format, this.#t = { release: () => g(e29), disposeListeners: /* @__PURE__ */ new Set(), disposed: false }, r.register(this, this.#t, this);
      }
      get disposed() {
        return this.#t.disposed;
      }
      dispose() {
        r.unregister(this), l(this.#t);
      }
      variant() {
        if (this.#t.disposed) throw TypeError(`font has been disposed`);
        return this.#e;
      }
      observeDispose(e29) {
        return this.#t.disposed ? (e29(), () => void 0) : (this.#t.disposeListeners.add(e29), () => this.#t.disposeListeners.delete(e29));
      }
    };
    S = class {
      #e;
      #t = false;
      constructor(e29) {
        h(e29), this.#e = e29;
      }
      get font() {
        return this.#n(), this.#e.backing.font;
      }
      get raster() {
        return this.#n(), this.#e.raster;
      }
      get data() {
        return this.#n(), this.#e.data;
      }
      get disposed() {
        return this.#t;
      }
      dispose() {
        this.#t || (this.#t = true, g(this.#e));
      }
      #n() {
        if (this.#t) throw Error(`immutable font resource lease has been disposed`);
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/glyph-error.js
var e3;
var init_glyph_error = __esm({
  "node_modules/@pmndrs/glyph/dist/glyph-error.js"() {
    e3 = class extends Error {
      code;
      constructor(e29, t31, n39) {
        super(t31, n39), this.name = `GlyphError`, this.code = e29;
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/fingerprint.js
function t2(e29, t31) {
  let n39 = t31 >>> 0, s33 = n39, c30 = n39, l29 = n39, u28 = Math.floor(e29.byteLength / 16);
  for (let t32 = 0; t32 < u28; t32 += 1) {
    let a34 = t32 * 16, o34 = r2(e29, a34), u29 = r2(e29, a34 + 4), d25 = r2(e29, a34 + 8), f27 = r2(e29, a34 + 12);
    o34 = Math.imul(o34, 597399067), o34 = i2(o34, 15), o34 = Math.imul(o34, 2869860233), n39 ^= o34, n39 = i2(n39, 19), n39 = n39 + s33 >>> 0, n39 = Math.imul(n39, 5) + 1444728091 >>> 0, u29 = Math.imul(u29, 2869860233), u29 = i2(u29, 16), u29 = Math.imul(u29, 951274213), s33 ^= u29, s33 = i2(s33, 17), s33 = s33 + c30 >>> 0, s33 = Math.imul(s33, 5) + 197830471 >>> 0, d25 = Math.imul(d25, 951274213), d25 = i2(d25, 17), d25 = Math.imul(d25, 2716044179), c30 ^= d25, c30 = i2(c30, 15), c30 = c30 + l29 >>> 0, c30 = Math.imul(c30, 5) + 2530024501 >>> 0, f27 = Math.imul(f27, 2716044179), f27 = i2(f27, 18), f27 = Math.imul(f27, 597399067), l29 ^= f27, l29 = i2(l29, 13), l29 = l29 + n39 >>> 0, l29 = Math.imul(l29, 5) + 850148119 >>> 0;
  }
  let d24 = u28 * 16, f26 = e29.byteLength & 15, p28 = 0, m24 = 0, h24 = 0, g23 = 0;
  f26 >= 15 && (g23 ^= e29[d24 + 14] << 16), f26 >= 14 && (g23 ^= e29[d24 + 13] << 8), f26 >= 13 && (g23 ^= e29[d24 + 12], g23 = Math.imul(g23, 2716044179), g23 = i2(g23, 18), g23 = Math.imul(g23, 597399067), l29 ^= g23), f26 >= 12 && (h24 ^= e29[d24 + 11] << 24), f26 >= 11 && (h24 ^= e29[d24 + 10] << 16), f26 >= 10 && (h24 ^= e29[d24 + 9] << 8), f26 >= 9 && (h24 ^= e29[d24 + 8], h24 = Math.imul(h24, 951274213), h24 = i2(h24, 17), h24 = Math.imul(h24, 2716044179), c30 ^= h24), f26 >= 8 && (m24 ^= e29[d24 + 7] << 24), f26 >= 7 && (m24 ^= e29[d24 + 6] << 16), f26 >= 6 && (m24 ^= e29[d24 + 5] << 8), f26 >= 5 && (m24 ^= e29[d24 + 4], m24 = Math.imul(m24, 2869860233), m24 = i2(m24, 16), m24 = Math.imul(m24, 951274213), s33 ^= m24), f26 >= 4 && (p28 ^= e29[d24 + 3] << 24), f26 >= 3 && (p28 ^= e29[d24 + 2] << 16), f26 >= 2 && (p28 ^= e29[d24 + 1] << 8), f26 >= 1 && (p28 ^= e29[d24], p28 = Math.imul(p28, 597399067), p28 = i2(p28, 15), p28 = Math.imul(p28, 2869860233), n39 ^= p28);
  let _20 = e29.byteLength >>> 0;
  return n39 ^= _20, s33 ^= _20, c30 ^= _20, l29 ^= _20, n39 = n39 + s33 + c30 + l29 >>> 0, s33 = s33 + n39 >>> 0, c30 = c30 + n39 >>> 0, l29 = l29 + n39 >>> 0, n39 = a2(n39), s33 = a2(s33), c30 = a2(c30), l29 = a2(l29), n39 = n39 + s33 + c30 + l29 >>> 0, s33 = s33 + n39 >>> 0, c30 = c30 + n39 >>> 0, l29 = l29 + n39 >>> 0, [n39, s33, c30, l29].map(o2).join(``);
}
function n2(e29) {
  return typeof e29 == `string` && /^[0-9a-f]{32}$/.test(e29);
}
function r2(e29, t31) {
  return (e29[t31] | e29[t31 + 1] << 8 | e29[t31 + 2] << 16 | e29[t31 + 3] << 24) >>> 0;
}
function i2(e29, t31) {
  return (e29 << t31 | e29 >>> 32 - t31) >>> 0;
}
function a2(e29) {
  return e29 ^= e29 >>> 16, e29 = Math.imul(e29, 2246822507), e29 ^= e29 >>> 13, e29 = Math.imul(e29, 3266489909), e29 ^= e29 >>> 16, e29 >>> 0;
}
function o2(e29) {
  return [e29, e29 >>> 8, e29 >>> 16, e29 >>> 24].map((e30) => (e30 & 255).toString(16).padStart(2, `0`)).join(``);
}
var e4;
var init_fingerprint = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/fingerprint.js"() {
    e4 = Object.freeze({ artifact: 1634890800, cache: 1667326768, compatibility: 1668116528, descriptor: 1685283632, shaping: 1936224304, source: 1936684402 });
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-identity.js
function r3(e29, t31) {
  for (let n39 = 0; n39 < e29.length; n39 += 1) {
    let r34 = e29.charCodeAt(n39);
    if (r34 >= 55296 && r34 <= 56319) {
      let r35 = e29.charCodeAt(n39 + 1);
      if (n39 + 1 >= e29.length || r35 < 56320 || r35 > 57343) throw TypeError(`${t31} contains an unpaired high surrogate`);
      n39 += 1;
      continue;
    }
    if (r34 >= 56320 && r34 <= 57343) throw TypeError(`${t31} contains an unpaired low surrogate`);
  }
}
function i3(e29, t31, n39, a34) {
  if (a34 > 256) throw TypeError(`${t31} exceeds the maximum JSON nesting depth`);
  if (e29 === null || typeof e29 == `boolean`) return JSON.stringify(e29);
  if (typeof e29 == `number`) {
    if (!Number.isFinite(e29)) throw TypeError(`${t31} must contain only finite numbers`);
    return JSON.stringify(e29);
  }
  if (typeof e29 == `string`) return r3(e29, t31), JSON.stringify(e29);
  if (Array.isArray(e29)) return o3(e29, t31, n39, () => `[${e29.map((e30, r34) => i3(e30, `${t31}/${r34}`, n39, a34 + 1)).join(`,`)}]`);
  if (typeof e29 == `object`) {
    let s33 = Object.getPrototypeOf(e29);
    if (s33 !== Object.prototype && s33 !== null) throw TypeError(`${t31} must contain only plain JSON objects`);
    let c30 = e29;
    return o3(e29, t31, n39, () => {
      let e30 = [];
      for (let o34 of Object.keys(c30).sort()) r3(o34, `${t31}/<key>`), e30.push(`${JSON.stringify(o34)}:${i3(c30[o34], `${t31}/${o34}`, n39, a34 + 1)}`);
      return `{${e30.join(`,`)}}`;
    });
  }
  throw TypeError(`${t31} is not a JSON value`);
}
function a3(e29) {
  return i3(e29, `$`, /* @__PURE__ */ new Set(), 0);
}
function o3(e29, t31, n39, r34) {
  if (n39.has(e29)) throw TypeError(`${t31} must not contain a cycle`);
  n39.add(e29);
  try {
    return r34();
  } finally {
    n39.delete(e29);
  }
}
function s(r34) {
  let i36 = a3({ descriptor: r34.descriptor, extension: r34.extension, kind: r34.kind, version: r34.version });
  return t2(n3.encode(i36), e4.descriptor);
}
function c2(r34) {
  let i36 = a3({ glyphCount: r34.glyphCount, glyphIdWidth: r34.glyphIdWidth, kind: r34.kind, rasterKey: r34.rasterKey, shaping: r34.shaping, source: r34.source, version: r34.version });
  return t2(n3.encode(i36), e4.compatibility);
}
var n3;
var init_raster_identity = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-identity.js"() {
    init_fingerprint();
    n3 = new TextEncoder();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-format-registry.js
function a10(t31, a34, o34) {
  e8.add(t31), n8.set(t31, a34), r10.set(t31, o34), i10.add(t31);
}
function o11(t31) {
  return (typeof t31 == `object` || typeof t31 == `function`) && t31 !== null && e8.has(t31);
}
function s9(e29, i36, a34) {
  t6.add(e29), n8.set(e29, i36), r10.set(e29, a34);
}
function c9(e29) {
  return typeof e29 == `object` && !!e29 && t6.has(e29);
}
function l6(e29) {
  let t31 = n8.get(e29);
  if (t31 === void 0) throw TypeError(`raster descriptor needs a package-defined format or request`);
  return t31();
}
function u6(e29) {
  let t31 = r10.get(e29);
  if (t31 === void 0) throw TypeError(`raster operation needs a package-defined format or request`);
  return t31;
}
function d5(e29) {
  let t31;
  for (let n39 of i10) if (n39.kind === e29 || n39.id === e29) {
    if (t31 !== void 0 && t31 !== n39) throw TypeError(`font format key ${JSON.stringify(e29)} matches more than one imported raster format`);
    t31 = n39;
  }
  return t31;
}
function f6(e29) {
  let t31;
  for (let n39 of i10) if (n39.kind === e29.kind && n39.extension === e29.extension && n39.version === e29.version) {
    if (t31 !== void 0 && t31 !== n39) throw TypeError(`raster directory entry ${JSON.stringify(e29.kind)} matches more than one imported raster format`);
    t31 = n39;
  }
  return t31;
}
var e8, t6, n8, r10, i10;
var init_raster_format_registry = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-format-registry.js"() {
    e8 = /* @__PURE__ */ new WeakSet();
    t6 = /* @__PURE__ */ new WeakSet();
    n8 = /* @__PURE__ */ new WeakMap();
    r10 = /* @__PURE__ */ new WeakMap();
    i10 = /* @__PURE__ */ new Set();
  }
});

// node_modules/@pmndrs/glyph/dist/config/raster-format.js
function o13(o34) {
  if (c11(o34.id, `raster format ID`), l8(o34.kind, /^[A-Za-z][A-Za-z0-9]*(?:[.-][A-Za-z0-9]+)*$/, `raster format kind`, `bitmap or vendor.name`), l8(o34.extension, /^[A-Z][A-Z0-9]*(?:_[A-Za-z0-9]+)+$/, `raster format extension`, `VENDOR_feature_name`), !Number.isSafeInteger(o34.version) || o34.version < 0) throw RangeError(`raster format version must be a nonnegative safe integer`);
  if (typeof o34.descriptor != `function` || typeof o34.decode != `function` || typeof o34.dispose != `function` || o34.runtimeBaker !== void 0 && typeof o34.runtimeBaker != `function`) throw TypeError(`raster formats need descriptor, decode, dispose, and optional runtimeBaker functions`);
  if (!Array.isArray(o34.textEffects)) throw TypeError(`raster format textEffects must be an array`);
  let s33 = [...o34.textEffects];
  for (let e29 of s33) if (e29 !== `outline` && e29 !== `shadow`) throw TypeError(`raster format text effect "${String(e29)}" is not supported`);
  if (new Set(s33).size !== s33.length) throw TypeError(`raster format textEffects must not contain duplicates`);
  let u28, d24, f26 = (...e29) => {
    let t31 = e29.length === 0 || e29[0] === void 0 ? Object.freeze({ raster: d24 }) : Object.freeze({ raster: d24, options: e29[0] });
    return s9(t31, () => o34.descriptor(e29[0]), { format: d24, visit(e30) {
      return e30.visit(d24, t31);
    } }), t31;
  }, p28 = o34.id;
  d24 = Object.freeze(Object.assign(f26, { id: p28, kind: o34.kind, extension: o34.extension, version: o34.version, textEffects: Object.freeze(s33), ...o34.runtimeBaker === void 0 ? {} : { runtimeBaker: o34.runtimeBaker }, descriptor: o34.descriptor, decode: o34.decode, dispose: o34.dispose, [e2](e29) {
    if (u28 !== void 0 && u28 !== e29) throw TypeError(`a different raster codec is already registered for "${o34.id}"`);
    u28 = e29;
  }, [t](e29) {
    return (t31) => u28?.(t31, e29);
  } }));
  let m24 = f26();
  return a10(d24, () => l6(m24), u6(m24)), d24;
}
function s11(e29) {
  return c11(e29, `raster resource ID`), e29;
}
function c11(e29, t31) {
  if (e29.length === 0) throw TypeError(`${t31} must not be empty`);
}
function l8(e29, t31, n39, r34) {
  if (c11(e29, n39), !t31.test(e29)) throw TypeError(`${n39} ${JSON.stringify(e29)} must look like ${r34}`);
}
var init_raster_format = __esm({
  "node_modules/@pmndrs/glyph/dist/config/raster-format.js"() {
    init_raster_format_compiler();
    init_raster_format_registry();
  }
});

// node_modules/@pmndrs/glyph/dist/raster-coverage.js
function o14(e29) {
  if (e29 === void 0) return;
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`raster coverage must be an object`);
  if (Object.keys(e29).some((e30) => e30 !== `glyphIds` && e30 !== `text` && e30 !== `unicodeRanges`)) throw TypeError(`raster coverage contains an unknown property`);
  let t31 = Object.hasOwn(e29, `unicodeRanges`) ? s12(Reflect.get(e29, `unicodeRanges`)) : void 0, n39 = Object.hasOwn(e29, `text`) ? c12(Reflect.get(e29, `text`)) : void 0, r34 = Object.hasOwn(e29, `glyphIds`) ? l9(Reflect.get(e29, `glyphIds`)) : void 0;
  if (t31 === void 0 && n39 === void 0 && r34 === void 0) throw TypeError(`raster coverage must provide at least one non-empty seed`);
  return Object.freeze({ ...t31 === void 0 ? {} : { unicodeRanges: t31 }, ...n39 === void 0 ? {} : { text: n39 }, ...r34 === void 0 ? {} : { glyphIds: r34 } });
}
function s12(e29) {
  if (!Array.isArray(e29)) throw TypeError(`raster coverage unicodeRanges must be an array`);
  if (e29.length === 0) return;
  if (e29.length > 1024) throw RangeError(`raster coverage supports at most ${t7} Unicode ranges`);
  let r34 = e29.map((e30, t31) => {
    if (typeof e30 != `object` || !e30 || Array.isArray(e30)) throw TypeError(`raster coverage unicodeRanges[${t31}] must be an object`);
    let n39 = Object.keys(e30);
    if (n39.length !== 2 || !Object.hasOwn(e30, `start`) || !Object.hasOwn(e30, `end`) || n39.some((e31) => e31 !== `start` && e31 !== `end`)) throw TypeError(`raster coverage unicodeRanges[${t31}] must contain only start and end`);
    let r35 = Reflect.get(e30, `start`), i37 = Reflect.get(e30, `end`);
    if (!u8(r35) || !u8(i37) || r35 > i37 || r35 <= 57343 && i37 >= 55296) throw RangeError(`raster coverage unicodeRanges[${t31}] must be an inclusive Unicode scalar range`);
    return Object.freeze({ start: r35, end: i37 });
  });
  r34.sort((e30, t31) => e30.start - t31.start || e30.end - t31.end);
  let i36 = 0;
  for (let e30 = 0; e30 < r34.length; e30 += 1) {
    let t31 = r34[e30], a34 = r34[e30 - 1];
    if (a34 !== void 0 && t31.start <= a34.end) throw RangeError(`raster coverage Unicode ranges must not overlap or repeat scalar values`);
    if (i36 += t31.end - t31.start + 1, i36 > 65536) throw RangeError(`raster coverage Unicode ranges may select at most ${n9} scalars`);
  }
  return Object.freeze(r34);
}
function c12(e29) {
  if (typeof e29 != `string`) throw TypeError(`raster coverage text must be a string`);
  if (e29.length === 0) return;
  let t31 = 0;
  for (let n39 of e29) {
    if (n39.length === 1 && n39.charCodeAt(0) >= 55296 && n39.charCodeAt(0) <= 57343) throw TypeError(`raster coverage text must contain only Unicode scalar values`);
    if (t31 += 1, t31 > 65536) throw RangeError(`raster coverage text may contain at most ${r12} code points`);
  }
  return e29;
}
function l9(e29) {
  if (!Array.isArray(e29)) throw TypeError(`raster coverage glyphIds must be an array`);
  if (e29.length === 0) return;
  if (e29.length > 65535) throw RangeError(`raster coverage supports at most ${i12} glyph IDs`);
  let t31 = e29.map((e30, t32) => {
    if (!Number.isSafeInteger(e30) || e30 < 0 || e30 > 65535) throw RangeError(`raster coverage glyphIds[${t32}] must be an integer in 0..=65535`);
    return e30;
  });
  t31.sort((e30, t32) => e30 - t32);
  for (let e30 = 1; e30 < t31.length; e30 += 1) if (t31[e30] === t31[e30 - 1]) throw RangeError(`raster coverage glyph ID ${t31[e30]} is duplicated`);
  return Object.freeze(t31);
}
function u8(e29) {
  return Number.isSafeInteger(e29) && typeof e29 == `number` && e29 >= 0 && e29 <= 1114111 && (e29 < 55296 || e29 > 57343);
}
var t7, n9, r12, i12;
var init_raster_coverage = __esm({
  "node_modules/@pmndrs/glyph/dist/raster-coverage.js"() {
    t7 = 1024;
    n9 = 65536;
    r12 = 65536;
    i12 = 65535;
  }
});

// node_modules/@pmndrs/glyph/dist/internal/bitmap-contract.js
function s13(e29) {
  if (e29.length === 0) throw TypeError(`bitmap strikes must be a non-empty tuple`);
  let t31 = /* @__PURE__ */ new Set();
  for (let n39 of e29) {
    if (!Number.isFinite(n39) || !Number.isInteger(n39) || n39 <= 0 || n39 > 1022) throw TypeError(`bitmap strikes must contain positive integers no greater than ${o15}`);
    if (t31.has(n39)) throw TypeError(`bitmap strike ${n39} is duplicated`);
    t31.add(n39);
  }
  return Object.freeze([...t31].sort((e30, t32) => e30 - t32));
}
function c13(e29) {
  let t31 = l10(e29);
  return u9(t31.strikes, t31.coverage);
}
function l10(t31) {
  if (typeof t31 != `object` || !t31 || Array.isArray(t31)) throw TypeError(`bitmap options must provide a strikes tuple`);
  if (Object.keys(t31).some((e29) => e29 !== `coverage` && e29 !== `strikes`)) throw TypeError(`bitmap options contain an unknown property`);
  let n39 = Reflect.get(t31, `strikes`);
  if (!Array.isArray(n39)) throw TypeError(`bitmap options must provide a strikes tuple`);
  let r34 = s13(n39), i36 = Object.hasOwn(t31, `coverage`) ? o14(Reflect.get(t31, `coverage`)) : void 0;
  return Object.freeze({ strikes: r34, ...i36 === void 0 ? {} : { coverage: i36 } });
}
function u9(t31, n39) {
  let r34 = o14(n39);
  return Object.freeze({ ...r34 === void 0 ? {} : { coverage: r34 }, generatorVersion: a12, strikes: s13(t31) });
}
function d6(e29) {
  return s({ descriptor: e29, extension: r13, kind: n10, version: 0 });
}
var n10, r13, a12, o15;
var init_bitmap_contract = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/bitmap-contract.js"() {
    init_raster_coverage();
    init_raster_identity();
    n10 = `bitmap`;
    r13 = `PMNDRS_font_bitmap`;
    a12 = `0.0.0`;
    o15 = 1022;
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-records.js
function i13(e29, t31, n39, i36 = false) {
  let a34 = n39 * 20;
  if (!Number.isSafeInteger(n39) || n39 < 0 || !Number.isSafeInteger(a34) || e29.byteLength !== a34) throw new r14(`RECORD_LENGTH`, `record table must contain exactly one dense 20-byte record per glyph`);
  let o34 = new DataView(e29.buffer, e29.byteOffset, e29.byteLength);
  for (let a35 = 0; a35 < n39; a35 += 1) {
    let n40 = a35 * 20, s33 = o34.getUint16(n40 + 16, true);
    if (o34.getUint16(n40 + 18, true) !== 0) throw new r14(`RECORD_FLAGS`, `V0 record flags must be zero`, a35);
    if (s33 === 65535) {
      if (e29.subarray(n40, n40 + 16).some((e30) => e30 !== 0)) throw new r14(`RECORD_ABSENT_DATA`, `absent records must zero every field except the page sentinel`, a35);
      continue;
    }
    let c30 = t31[s33];
    if (c30 === void 0) throw new r14(`RECORD_PAGE`, `record references a missing logical page`, a35);
    let l29 = o34.getInt16(n40, true), u28 = o34.getInt16(n40 + 2, true), d24 = o34.getInt16(n40 + 4, true), f26 = o34.getInt16(n40 + 6, true), p28 = o34.getUint16(n40 + 8, true), m24 = o34.getUint16(n40 + 10, true), h24 = o34.getUint16(n40 + 12, true), g23 = o34.getUint16(n40 + 14, true);
    if (l29 > d24 || u28 > f26 || i36 && (l29 === d24 || u28 === f26)) throw new r14(`RECORD_PLANE_BOUNDS`, `plane bounds must form ${i36 ? `a non-empty` : `an ordered`} span`, a35);
    if (p28 >= h24 || m24 >= g23 || h24 > c30.width || g23 > c30.height) throw new r14(`RECORD_ATLAS_BOUNDS`, `atlas bounds exceed their logical page`, a35);
  }
}
var r14;
var init_raster_records = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-records.js"() {
    init_glyph_error();
    r14 = class extends e3 {
      reason;
      glyphId;
      constructor(e29, t31, n39) {
        super(`artifact-invalid`, t31), this.name = `DenseGlyphRecordError`, this.reason = e29, this.glyphId = n39;
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/owned-array-buffer.js
function e9(e29) {
  let t31 = new Uint8Array(e29.byteLength);
  return t31.set(e29), t31.buffer;
}
var init_owned_array_buffer = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/owned-array-buffer.js"() {
  }
});

// node_modules/@pmndrs/glyph/dist/internal/bake-progress-protocol.js
function n11(t31) {
  return r15(t31) ? t31.type === `bake-progress-v0` && i14(t31.id) && (t31.stage === `font` || t31.stage === `raster`) && typeof t31.phase == `string` && e10.has(t31.phase) && i14(t31.total) && a13(t31.completed) && t31.completed <= t31.total : false;
}
function r15(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function i14(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 > 0;
}
function a13(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 >= 0;
}
var e10;
var init_bake_progress_protocol = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/bake-progress-protocol.js"() {
    e10 = /* @__PURE__ */ new Set([`queued`, `loading`, `baking`, `rasterizing`, `packaging`, `transferring`, `complete`]);
  }
});

// node_modules/@pmndrs/glyph/dist/internal/serial-worker-host.js
function t8(e29) {
  return e29?.reason ?? new DOMException(`The operation was aborted`, `AbortError`);
}
var e11;
var init_serial_worker_host = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/serial-worker-host.js"() {
    e11 = class {
      #e;
      #t = [];
      #n;
      #r = 1;
      #i;
      constructor(e29) {
        this.#e = e29;
      }
      run(e29, n39) {
        if (n39?.aborted === true) return Promise.reject(t8(n39));
        let r34 = this.#r++, i36;
        try {
          i36 = this.#e.prepare(e29, r34);
        } catch (e30) {
          return Promise.reject(e30);
        }
        return new Promise((a34, o34) => {
          let s33 = { id: r34, request: e29, ...i36, resolve: a34, reject: o34, removeAbortListener: () => {
          } }, c30 = () => this.#c(s33, t8(n39));
          s33.removeAbortListener = () => n39?.removeEventListener(`abort`, c30), n39?.addEventListener(`abort`, c30, { once: true }), this.#t.push(s33), this.#a();
        });
      }
      #a() {
        if (this.#n !== void 0) return;
        let e29 = this.#t.shift();
        if (e29 === void 0) {
          this.#u();
          return;
        }
        this.#n = e29;
        try {
          (this.#i ??= this.#o()).postMessage(e29.message, e29.transfer);
        } catch (e30) {
          this.#l(this.#i, e30);
        }
      }
      #o() {
        let e29 = new Worker(this.#e.workerUrl, { name: this.#e.name, type: `module` });
        return e29.addEventListener(`message`, (t31) => {
          this.#s(e29, t31.data);
        }), e29.addEventListener(`error`, (t31) => {
          this.#l(e29, t31.error ?? Error(t31.message || `Worker failed`));
        }), e29.addEventListener(`messageerror`, () => {
          this.#l(e29, TypeError(`${this.#e.name} returned an unreadable message`));
        }), e29;
      }
      #s(e29, t31) {
        if (e29 !== this.#i) return;
        let n39 = this.#n;
        if (n39 !== void 0 && this.#e.progress?.isProgress(t31) === true) {
          if (this.#e.progress.progressId(t31) !== n39.id) {
            this.#l(e29, TypeError(`${this.#e.name} returned progress for the wrong request`));
            return;
          }
          this.#e.progress.report(n39.request, t31);
          return;
        }
        if (n39 === void 0 || !this.#e.isResponse(t31) || this.#e.responseId(t31) !== n39.id) {
          this.#l(e29, TypeError(`${this.#e.name} returned an invalid protocol message`));
          return;
        }
        this.#n = void 0, n39.removeAbortListener();
        try {
          n39.resolve(this.#e.resolve(t31));
        } catch (e30) {
          n39.reject(e30);
        }
        this.#a();
      }
      #c(e29, t31) {
        if (e29 === this.#n) {
          this.#n = void 0, e29.removeAbortListener(), e29.reject(t31), this.#u(), this.#a();
          return;
        }
        let n39 = this.#t.indexOf(e29);
        n39 < 0 || (this.#t.splice(n39, 1), e29.removeAbortListener(), e29.reject(t31));
      }
      #l(e29, t31) {
        if (e29 !== void 0 && e29 !== this.#i) return;
        this.#u();
        let n39 = this.#n;
        this.#n = void 0, n39 !== void 0 && (n39.removeAbortListener(), n39.reject(t31));
        for (let e30 of this.#t.splice(0)) e30.removeAbortListener(), e30.reject(t31);
      }
      #u() {
        let e29 = this.#i;
        this.#i = void 0, e29?.terminate();
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-bake-worker-protocol.js
function n12(e29) {
  return !o16(e29) || e29.type !== `bake-raster-result-v0` || !c14(e29.id) || typeof e29.ok != `boolean` ? false : e29.ok ? s14(e29.rasterKey) && typeof e29.kind == `string` && typeof e29.extension == `string` && l11(e29.version) && Array.isArray(e29.artifacts) && e29.artifacts.every(r16) && i15(e29.report) : a14(e29.error);
}
function r16(e29) {
  return o16(e29) && e29.role === `raster` && typeof e29.id == `string` && e29.id.length > 0 && e29.bytes instanceof ArrayBuffer && s14(e29.fingerprint);
}
function i15(e29) {
  return o16(e29) && l11(e29.metadataBytes) && l11(e29.serializedBytes) && l11(e29.gpuBytes) && Array.isArray(e29.pages) && e29.pages.every((e30) => o16(e30) && c14(e30.width) && c14(e30.height) && typeof e30.format == `string` && c14(e30.gpuBytes) && (e30.source === `embedded` || e30.source === `external`) && c14(e30.encodedBytes));
}
function a14(e29) {
  return o16(e29) && typeof e29.code == `string` && typeof e29.message == `string` && (e29.path === void 0 || typeof e29.path == `string`);
}
function o16(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function s14(t31) {
  return n2(t31);
}
function c14(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 > 0;
}
function l11(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 >= 0;
}
var init_raster_bake_worker_protocol = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-bake-worker-protocol.js"() {
    init_fingerprint();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-bake-worker-host.js
function s15(e29) {
  let t31 = new e11({ name: e29.name, workerUrl: e29.workerUrl, prepare(e30, t32) {
    let r34 = e9(e30.source);
    return { message: { type: `bake-raster-v0`, id: t32, source: r34, sourceFingerprint: e30.sourceFingerprint, fontFaceIndex: e30.fontFaceIndex, glyphCount: e30.font.glyphCount, shapingFingerprint: e30.font.shapingFingerprint, rasterKey: c15(e30.rasterKey), options: `options` in e30 ? e30.options : void 0 }, transfer: [r34] };
  }, isResponse: n12, responseId: (e30) => e30.id, resolve(t32) {
    if (!t32.ok) throw new o17(t32.error);
    if (t32.kind !== e29.kind) throw TypeError(`${e29.name} returned ${t32.kind} instead of ${e29.kind}`);
    return { rasterKey: t32.rasterKey, kind: e29.kind, extension: t32.extension, version: t32.version, artifacts: t32.artifacts.map((e30) => ({ ...e30, bytes: new Uint8Array(e30.bytes) })), report: t32.report };
  }, progress: { isProgress: n11, progressId: (e30) => e30.id, report: (e30, { stage: t32, phase: n39, completed: r34, total: i36 }) => e30.onProgress?.({ stage: t32, phase: n39, completed: r34, total: i36 }) } });
  return { kind: e29.kind, bake(e30) {
    return e30.onProgress?.({ stage: `raster`, phase: `queued`, completed: 0, total: 1 }), t31.run(e30, e30.signal);
  } };
}
function c15(e29) {
  if (!n2(e29)) throw TypeError(`runtime raster key must be a 128-bit fingerprint`);
  return e29;
}
var o17;
var init_raster_bake_worker_host = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-bake-worker-host.js"() {
    init_glyph_error();
    init_fingerprint();
    init_owned_array_buffer();
    init_bake_progress_protocol();
    init_serial_worker_host();
    init_raster_bake_worker_protocol();
    o17 = class extends e3 {
      reason;
      path;
      constructor(e29) {
        super(`bake-failed`, e29.message), this.name = `RuntimeRasterBakeError`, this.reason = e29.code, this.path = e29.path;
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/runtime-bakers/bitmap.js
var bitmap_exports = {};
__export(bitmap_exports, {
  default: () => n13
});
var n13;
var init_bitmap = __esm({
  "node_modules/@pmndrs/glyph/dist/runtime-bakers/bitmap.js"() {
    init_bitmap_contract();
    init_raster_bake_worker_host();
    n13 = s15({ kind: n10, name: `pmndrs-glyph-bitmap-baker`, workerUrl: new URL(`../../dist/runtime-bakers/bitmap-worker.js`, void 0) });
  }
});

// node_modules/ktx-parse/dist/ktx-parse.modern.js
function createDefaultContainer() {
  return {
    vkFormat: VK_FORMAT_UNDEFINED,
    typeSize: 1,
    pixelWidth: 0,
    pixelHeight: 0,
    pixelDepth: 0,
    layerCount: 0,
    faceCount: 1,
    levelCount: 0,
    supercompressionScheme: KHR_SUPERCOMPRESSION_NONE,
    levels: [],
    dataFormatDescriptor: [{
      vendorId: KHR_DF_VENDORID_KHRONOS,
      descriptorType: KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT,
      versionNumber: KHR_DF_VERSION,
      colorModel: KHR_DF_MODEL_UNSPECIFIED,
      colorPrimaries: KHR_DF_PRIMARIES_BT709,
      transferFunction: KHR_DF_TRANSFER_SRGB,
      flags: KHR_DF_FLAG_ALPHA_STRAIGHT,
      texelBlockDimension: [0, 0, 0, 0],
      bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
      samples: []
    }],
    keyValue: {},
    globalData: null
  };
}
function decodeText(buffer) {
  return new TextDecoder().decode(buffer);
}
function read(data) {
  const id = new Uint8Array(data.buffer, data.byteOffset, KTX2_ID.length);
  if (id[0] !== KTX2_ID[0] || // '´'
  id[1] !== KTX2_ID[1] || // 'K'
  id[2] !== KTX2_ID[2] || // 'T'
  id[3] !== KTX2_ID[3] || // 'X'
  id[4] !== KTX2_ID[4] || // ' '
  id[5] !== KTX2_ID[5] || // '2'
  id[6] !== KTX2_ID[6] || // '0'
  id[7] !== KTX2_ID[7] || // 'ª'
  id[8] !== KTX2_ID[8] || // '\r'
  id[9] !== KTX2_ID[9] || // '\n'
  id[10] !== KTX2_ID[10] || // '\x1A'
  id[11] !== KTX2_ID[11]) {
    throw new Error("Missing KTX 2.0 identifier.");
  }
  const container = createDefaultContainer();
  const headerByteLength = 17 * Uint32Array.BYTES_PER_ELEMENT;
  const headerReader = new BufferReader(data, KTX2_ID.length, headerByteLength, true);
  container.vkFormat = headerReader._nextUint32();
  container.typeSize = headerReader._nextUint32();
  container.pixelWidth = headerReader._nextUint32();
  container.pixelHeight = headerReader._nextUint32();
  container.pixelDepth = headerReader._nextUint32();
  container.layerCount = headerReader._nextUint32();
  container.faceCount = headerReader._nextUint32();
  container.levelCount = headerReader._nextUint32();
  container.supercompressionScheme = headerReader._nextUint32();
  const dfdByteOffset = headerReader._nextUint32();
  const dfdByteLength = headerReader._nextUint32();
  const kvdByteOffset = headerReader._nextUint32();
  const kvdByteLength = headerReader._nextUint32();
  const sgdByteOffset = headerReader._nextUint64();
  const sgdByteLength = headerReader._nextUint64();
  const levelByteLength = Math.max(container.levelCount, 1) * 3 * 8;
  const levelReader = new BufferReader(data, KTX2_ID.length + headerByteLength, levelByteLength, true);
  for (let i36 = 0, il = Math.max(container.levelCount, 1); i36 < il; i36++) {
    container.levels.push({
      levelData: new Uint8Array(data.buffer, data.byteOffset + levelReader._nextUint64(), levelReader._nextUint64()),
      uncompressedByteLength: levelReader._nextUint64()
    });
  }
  const dfdReader = new BufferReader(data, dfdByteOffset, dfdByteLength, true);
  dfdReader._skip(4);
  const vendorId = dfdReader._nextUint16();
  const descriptorType = dfdReader._nextUint16();
  const versionNumber = dfdReader._nextUint16();
  const descriptorBlockSize = dfdReader._nextUint16();
  const colorModel = dfdReader._nextUint8();
  const colorPrimaries = dfdReader._nextUint8();
  const transferFunction = dfdReader._nextUint8();
  const flags = dfdReader._nextUint8();
  const texelBlockDimension = [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()];
  const bytesPlane = [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()];
  const samples = [];
  const dfd = {
    vendorId,
    descriptorType,
    versionNumber,
    colorModel,
    colorPrimaries,
    transferFunction,
    flags,
    texelBlockDimension,
    bytesPlane,
    samples
  };
  const sampleStart = 6;
  const sampleWords = 4;
  const numSamples = (descriptorBlockSize / 4 - sampleStart) / sampleWords;
  for (let i36 = 0; i36 < numSamples; i36++) {
    const sample = {
      bitOffset: dfdReader._nextUint16(),
      bitLength: dfdReader._nextUint8(),
      channelType: dfdReader._nextUint8(),
      samplePosition: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
      sampleLower: Number.NEGATIVE_INFINITY,
      sampleUpper: Number.POSITIVE_INFINITY
    };
    if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
      sample.sampleLower = dfdReader._nextInt32();
      sample.sampleUpper = dfdReader._nextInt32();
    } else {
      sample.sampleLower = dfdReader._nextUint32();
      sample.sampleUpper = dfdReader._nextUint32();
    }
    dfd.samples[i36] = sample;
  }
  container.dataFormatDescriptor.length = 0;
  container.dataFormatDescriptor.push(dfd);
  const kvdReader = new BufferReader(data, kvdByteOffset, kvdByteLength, true);
  while (kvdReader._offset < kvdByteLength) {
    const keyValueByteLength = kvdReader._nextUint32();
    const keyData = kvdReader._scan(keyValueByteLength);
    const key = decodeText(keyData);
    container.keyValue[key] = kvdReader._nextUint8Array(keyValueByteLength - keyData.byteLength - 1);
    if (key.match(/^ktx/i)) {
      const text = decodeText(container.keyValue[key]);
      container.keyValue[key] = text.substring(0, text.lastIndexOf("\0"));
    }
    const kvPadding = keyValueByteLength % 4 ? 4 - keyValueByteLength % 4 : 0;
    kvdReader._skip(kvPadding);
  }
  if (sgdByteLength <= 0) return container;
  const sgdReader = new BufferReader(data, sgdByteOffset, sgdByteLength, true);
  const endpointCount = sgdReader._nextUint16();
  const selectorCount = sgdReader._nextUint16();
  const endpointsByteLength = sgdReader._nextUint32();
  const selectorsByteLength = sgdReader._nextUint32();
  const tablesByteLength = sgdReader._nextUint32();
  const extendedByteLength = sgdReader._nextUint32();
  const imageDescs = [];
  for (let i36 = 0, il = Math.max(container.levelCount, 1); i36 < il; i36++) {
    imageDescs.push({
      imageFlags: sgdReader._nextUint32(),
      rgbSliceByteOffset: sgdReader._nextUint32(),
      rgbSliceByteLength: sgdReader._nextUint32(),
      alphaSliceByteOffset: sgdReader._nextUint32(),
      alphaSliceByteLength: sgdReader._nextUint32()
    });
  }
  const endpointsByteOffset = sgdByteOffset + sgdReader._offset;
  const selectorsByteOffset = endpointsByteOffset + endpointsByteLength;
  const tablesByteOffset = selectorsByteOffset + selectorsByteLength;
  const extendedByteOffset = tablesByteOffset + tablesByteLength;
  const endpointsData = new Uint8Array(data.buffer, data.byteOffset + endpointsByteOffset, endpointsByteLength);
  const selectorsData = new Uint8Array(data.buffer, data.byteOffset + selectorsByteOffset, selectorsByteLength);
  const tablesData = new Uint8Array(data.buffer, data.byteOffset + tablesByteOffset, tablesByteLength);
  const extendedData = new Uint8Array(data.buffer, data.byteOffset + extendedByteOffset, extendedByteLength);
  container.globalData = {
    endpointCount,
    selectorCount,
    imageDescs,
    endpointsData,
    selectorsData,
    tablesData,
    extendedData
  };
  return container;
}
var KHR_SUPERCOMPRESSION_NONE, KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT, KHR_DF_VENDORID_KHRONOS, KHR_DF_VERSION, KHR_DF_MODEL_UNSPECIFIED, KHR_DF_MODEL_RGBSDA, KHR_DF_FLAG_ALPHA_STRAIGHT, KHR_DF_TRANSFER_LINEAR, KHR_DF_TRANSFER_SRGB, KHR_DF_PRIMARIES_BT709, KHR_DF_CHANNEL_RGBSDA_RED, KHR_DF_CHANNEL_RGBSDA_GREEN, KHR_DF_CHANNEL_RGBSDA_BLUE, KHR_DF_CHANNEL_RGBSDA_ALPHA, KHR_DF_SAMPLE_DATATYPE_FLOAT, KHR_DF_SAMPLE_DATATYPE_SIGNED, VK_FORMAT_UNDEFINED, VK_FORMAT_R8_UNORM, VK_FORMAT_R8G8B8A8_UNORM, VK_FORMAT_R16G16B16A16_SFLOAT, BufferReader, NUL, KTX2_ID;
var init_ktx_parse_modern = __esm({
  "node_modules/ktx-parse/dist/ktx-parse.modern.js"() {
    KHR_SUPERCOMPRESSION_NONE = 0;
    KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT = 0;
    KHR_DF_VENDORID_KHRONOS = 0;
    KHR_DF_VERSION = 2;
    KHR_DF_MODEL_UNSPECIFIED = 0;
    KHR_DF_MODEL_RGBSDA = 1;
    KHR_DF_FLAG_ALPHA_STRAIGHT = 0;
    KHR_DF_TRANSFER_LINEAR = 1;
    KHR_DF_TRANSFER_SRGB = 2;
    KHR_DF_PRIMARIES_BT709 = 1;
    KHR_DF_CHANNEL_RGBSDA_RED = 0;
    KHR_DF_CHANNEL_RGBSDA_GREEN = 1;
    KHR_DF_CHANNEL_RGBSDA_BLUE = 2;
    KHR_DF_CHANNEL_RGBSDA_ALPHA = 15;
    KHR_DF_SAMPLE_DATATYPE_FLOAT = 128;
    KHR_DF_SAMPLE_DATATYPE_SIGNED = 64;
    VK_FORMAT_UNDEFINED = 0;
    VK_FORMAT_R8_UNORM = 9;
    VK_FORMAT_R8G8B8A8_UNORM = 37;
    VK_FORMAT_R16G16B16A16_SFLOAT = 97;
    BufferReader = class {
      constructor(data, byteOffset, byteLength, littleEndian) {
        this._dataView = void 0;
        this._littleEndian = void 0;
        this._offset = void 0;
        this._dataView = new DataView(data.buffer, data.byteOffset + byteOffset, byteLength);
        this._littleEndian = littleEndian;
        this._offset = 0;
      }
      _nextUint8() {
        const value = this._dataView.getUint8(this._offset);
        this._offset += 1;
        return value;
      }
      _nextUint16() {
        const value = this._dataView.getUint16(this._offset, this._littleEndian);
        this._offset += 2;
        return value;
      }
      _nextUint32() {
        const value = this._dataView.getUint32(this._offset, this._littleEndian);
        this._offset += 4;
        return value;
      }
      _nextUint64() {
        const left = this._dataView.getUint32(this._offset, this._littleEndian);
        const right = this._dataView.getUint32(this._offset + 4, this._littleEndian);
        const value = left + 2 ** 32 * right;
        this._offset += 8;
        return value;
      }
      _nextInt32() {
        const value = this._dataView.getInt32(this._offset, this._littleEndian);
        this._offset += 4;
        return value;
      }
      _nextUint8Array(len) {
        const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, len);
        this._offset += len;
        return value;
      }
      _skip(bytes) {
        this._offset += bytes;
        return this;
      }
      _scan(maxByteLength, term = 0) {
        const byteOffset = this._offset;
        let byteLength = 0;
        while (this._dataView.getUint8(this._offset) !== term && byteLength < maxByteLength) {
          byteLength++;
          this._offset++;
        }
        if (byteLength < maxByteLength) this._offset++;
        return new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + byteOffset, byteLength);
      }
    };
    NUL = new Uint8Array([0]);
    KTX2_ID = [
      // '´', 'K', 'T', 'X', '2', '0', 'ª', '\r', '\n', '\x1A', '\n'
      171,
      75,
      84,
      88,
      32,
      50,
      48,
      187,
      13,
      10,
      26,
      10
    ];
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-ktx.js
function f7(e29, t31, n39, r34) {
  let i36;
  try {
    i36 = read(e29);
  } catch (e30) {
    throw new d7(`KTX2_INVALID`, e30 instanceof Error ? e30.message : String(e30), { cause: e30 });
  }
  let a34 = Math.ceil(t31 / r34.blockWidth) * Math.ceil(n39 / r34.blockHeight) * r34.bytesPerBlock;
  if (!Number.isSafeInteger(a34)) throw new d7(`KTX2_VARIANT`, `KTX2 payload size overflowed`);
  if (i36.vkFormat !== r34.vkFormat || i36.typeSize !== (r34.typeSize ?? 1) || i36.pixelWidth !== t31 || i36.pixelHeight !== n39 || i36.pixelDepth !== 0 || i36.layerCount !== 0 || i36.faceCount !== 1 || i36.levelCount !== 1 || i36.supercompressionScheme !== KHR_SUPERCOMPRESSION_NONE || i36.levels.length !== 1 || i36.levels[0]?.levelData.byteLength !== a34 || i36.levels[0]?.uncompressedByteLength !== a34) throw new d7(`KTX2_VARIANT`, `KTX2 must be an uncompressed single-level native image matching its declared dimensions and GPU format`);
  if (r34.uncompressedChannelTypes !== void 0 && !m6(i36.dataFormatDescriptor, r34.bytesPerBlock, r34.uncompressedChannelTypes)) throw new d7(`KTX2_DFD`, `KTX2 data format descriptor does not match its linear UNORM channels`);
  if (r34.float16ChannelTypes !== void 0 && !p6(i36.dataFormatDescriptor, r34.float16ChannelTypes)) throw new d7(`KTX2_DFD`, `KTX2 data format descriptor does not match its linear signed float16 channels`);
  if (Object.keys(i36.keyValue).length !== 0 || i36.globalData !== null) throw new d7(`KTX2_METADATA`, `baseline KTX2 pages must not contain auxiliary metadata`);
  return i36;
}
function p6(e29, l29) {
  let u28 = e29.length === 1 ? e29[0] : void 0;
  if (u28 === void 0 || u28.vendorId !== KHR_DF_VENDORID_KHRONOS || u28.descriptorType !== KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT || u28.versionNumber !== KHR_DF_VERSION || u28.colorModel !== KHR_DF_MODEL_RGBSDA || u28.colorPrimaries !== KHR_DF_PRIMARIES_BT709 || u28.transferFunction !== KHR_DF_TRANSFER_LINEAR || u28.flags !== 0 || !h6(u28.texelBlockDimension, [0, 0, 0, 0]) || !h6(u28.bytesPlane, [8, 0, 0, 0, 0, 0, 0, 0]) || u28.samples.length !== l29.length) return false;
  let d24 = KHR_DF_SAMPLE_DATATYPE_SIGNED | KHR_DF_SAMPLE_DATATYPE_FLOAT;
  return u28.samples.every((e30, t31) => e30.bitOffset === t31 * 16 && e30.bitLength === 15 && e30.channelType === (l29[t31] | d24) && h6(e30.samplePosition, [0, 0, 0, 0]) && e30.sampleLower === -1082130432 && e30.sampleUpper === 1065353216);
}
function m6(e29, i36, a34) {
  let l29 = e29.length === 1 ? e29[0] : void 0;
  return l29 === void 0 || l29.vendorId !== KHR_DF_VENDORID_KHRONOS || l29.descriptorType !== KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT || l29.versionNumber !== KHR_DF_VERSION || l29.colorModel !== KHR_DF_MODEL_RGBSDA || l29.colorPrimaries !== KHR_DF_PRIMARIES_BT709 || l29.transferFunction !== KHR_DF_TRANSFER_LINEAR || l29.flags !== 0 || !h6(l29.texelBlockDimension, [0, 0, 0, 0]) || !h6(l29.bytesPlane, [i36, 0, 0, 0, 0, 0, 0, 0]) || l29.samples.length !== a34.length ? false : l29.samples.every((e30, t31) => e30.bitOffset === t31 * 8 && e30.bitLength === 7 && e30.channelType === a34[t31] && h6(e30.samplePosition, [0, 0, 0, 0]) && e30.sampleLower === 0 && e30.sampleUpper === 255);
}
function h6(e29, t31) {
  return e29.length === t31.length && e29.every((e30, n39) => e30 === t31[n39]);
}
var d7;
var init_raster_ktx = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-ktx.js"() {
    init_glyph_error();
    init_ktx_parse_modern();
    d7 = class extends e3 {
      reason;
      constructor(e29, t31, n39) {
        super(`artifact-invalid`, t31, n39), this.name = `RasterKtxValidationError`, this.reason = e29;
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-atlas.js
function o18(n39, r34, i36, a34) {
  let o34 = c16(r34, i36), s33 = u10(o34.width, `${i36} width`), f26 = u10(o34.height, `${i36} height`);
  if (s33 > 16384 || f26 > 16384) throw RangeError(`${i36} exceeds the 16384-pixel runtime texture limit`);
  if (o34.mipLevelCount !== 1 || o34.colorSpace !== `linear`) throw TypeError(`${i36} must be a single-level linear texture resource`);
  let p28 = l12(o34.variants, `${i36} variants`).find((e29) => c16(e29, `${i36} variant`).gpuFormat === a34.gpuFormat);
  if (p28 === void 0) throw TypeError(`${i36} has no lossless ${a34.gpuFormat} variant`);
  let m24 = c16(p28, `${i36} ${a34.gpuFormat} variant`);
  if (m24.container !== `ktx2` || m24.quality !== `lossless`) throw TypeError(`${i36} ${a34.gpuFormat} variant is not the lossless KTX2 baseline`);
  if (m24.requiredFeature !== void 0) throw TypeError(`${i36} lossless baseline must not require an optional GPU feature`);
  let h24 = c16(m24.source, `${i36} ${a34.gpuFormat} source`);
  if (h24.type !== `bufferView`) throw TypeError(`${i36} uses an external page; lazy page residency is not available yet`);
  let g23 = n39.view(d8(h24.bufferView, `${i36} bufferView`)), _20;
  try {
    _20 = f7(g23, s33, f26, a34);
  } catch (t31) {
    throw t31 instanceof d7 ? TypeError(`${i36} contains invalid KTX2: ${t31.message}`, { cause: t31 }) : t31;
  }
  let v22 = _20.levels[0];
  if (v22 === void 0) throw TypeError(`${i36} KTX2 contains no base level`);
  return { width: s33, height: f26, bytes: v22.levelData.slice() };
}
function s16(e29, t31, n39, r34 = false) {
  try {
    i13(e29, t31, e29.byteLength / 20, r34);
  } catch (e30) {
    throw e30 instanceof r14 ? TypeError(`${n39} record ${e30.message}`, { cause: e30 }) : e30;
  }
}
function c16(e29, t31) {
  if (typeof e29 != `object` || !e29 || f8(e29)) throw TypeError(`${t31} must be an object`);
  return e29;
}
function l12(e29, t31) {
  if (!f8(e29)) throw TypeError(`${t31} must be an array`);
  return e29;
}
function u10(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 <= 0) throw TypeError(`${t31} must be a positive integer`);
  return e29;
}
function d8(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 < 0) throw TypeError(`${t31} must be a non-negative integer`);
  return e29;
}
function f8(e29) {
  return Array.isArray(e29);
}
var init_raster_atlas = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-atlas.js"() {
    init_raster_ktx();
    init_raster_records();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/raster-coverage-artifact.js
function r17(e29, r34, i36, a34) {
  let o34 = e29.coverage !== void 0;
  if (o34 !== (e29.coverageBufferView !== void 0)) throw TypeError(`${a34} coverage descriptor and coverageBufferView must appear together`);
  if (!o34) return;
  let s33 = o14(e29.coverage);
  if (a3(e29.coverage) !== a3(s33)) throw TypeError(`${a34} coverage descriptor is not canonical`);
  let c30 = e29.coverageBufferView;
  if (typeof c30 != `number` || !Number.isSafeInteger(c30) || c30 < 0) throw TypeError(`${a34} coverageBufferView must be a nonnegative integer`);
  let l29 = i36(c30);
  if (l29.byteLength !== Math.ceil(r34 / 8)) throw TypeError(`${a34} coverage bitset does not match the registered glyph count`);
  let u28 = r34 % 8;
  if (u28 !== 0 && l29.at(-1) & ~((1 << u28) - 1)) throw TypeError(`${a34} coverage padding bits must be zero`);
  if (!l29.some((e30) => e30 !== 0)) throw TypeError(`${a34} coverage must select at least one glyph`);
  return Object.freeze({ descriptor: s33, bits: l29 });
}
var init_raster_coverage_artifact = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/raster-coverage-artifact.js"() {
    init_raster_coverage();
    init_raster_identity();
  }
});

// node_modules/@pmndrs/glyph/dist/raster/internal/bitmap-decoder.js
var bitmap_decoder_exports = {};
__export(bitmap_decoder_exports, {
  decodeBitmapData: () => f9
});
async function f9(f26, p28) {
  if (p28.kind !== `bitmap` || p28.extension !== `PMNDRS_font_bitmap` || p28.version !== 0) throw TypeError(`bitmap raster is not bound to the supplied font`);
  let m24 = c16(p28.extensionData, `bitmap extension`);
  if (m24.version !== 0 || m24.rasterKey !== p28.rasterKey || m24.fingerprint !== c2({ glyphCount: f26.glyphCount, glyphIdWidth: 16, kind: `bitmap`, rasterKey: p28.rasterKey, shaping: f26.shapingFingerprint, source: f26.sourceFingerprint, version: 0 })) throw TypeError(`bitmap extension identity does not match its registered font and raster`);
  let h24 = r17(m24, f26.glyphCount, (e29) => p28.view(e29), `bitmap`), g23 = l12(m24.strikes, `bitmap strikes`);
  if (g23.length === 0) throw TypeError(`bitmap raster must contain at least one strike`);
  let _20 = g23.map((e29, t31) => {
    let n39 = c16(e29, `bitmap strike ${t31}`), r34 = u10(n39.ppemX, `bitmap strike ${t31} ppemX`);
    if (n39.ppemY !== r34) throw TypeError(`bitmap runtime requires square strikes`);
    return r34;
  });
  if (p28.rasterKey !== await d6(u9(_20, h24?.descriptor))) throw TypeError(`bitmap raster key does not match its generation descriptor`);
  let v22 = [], y22 = 0;
  for (let t31 = 0; t31 < g23.length; t31 += 1) {
    let n39 = c16(g23[t31], `bitmap strike ${t31}`), r34 = u10(n39.ppemX, `bitmap strike ${t31} ppemX`);
    if (n39.ppemY !== r34) throw TypeError(`bitmap runtime requires square strikes`);
    let l29 = u10(n39.planeUnitsPerEm, `bitmap strike ${t31} planeUnitsPerEm`);
    if (n39.recordStride !== 20) throw TypeError(`bitmap records must use 20-byte stride`);
    let m25 = p28.view(d8(n39.recordBufferView, `bitmap strike ${t31} recordBufferView`));
    if (m25.byteLength !== f26.glyphCount * 20) throw TypeError(`bitmap record table does not match the registered glyph count`);
    let h25 = l12(n39.pages, `bitmap strike ${t31} pages`).map((n40, r35) => {
      let a34 = o18(p28, n40, `bitmap strike ${t31} page ${r35}`, { gpuFormat: `r8unorm`, vkFormat: VK_FORMAT_R8_UNORM, blockWidth: 1, blockHeight: 1, bytesPerBlock: 1, uncompressedChannelTypes: [KHR_DF_CHANNEL_RGBSDA_RED] });
      if (y22 += a34.bytes.byteLength, !Number.isSafeInteger(y22) || y22 > 268435456) throw RangeError(`bitmap pages exceed the runtime texture-memory limit`);
      return { ...a34, format: `r8unorm`, resource: s11(`pmndrs.bitmap/${f26.shapingFingerprint}/${p28.rasterKey}/${t31}/${r35}`) };
    });
    v22.push({ ppem: r34, planeUnitsPerEm: l29, records: m25, pages: h25 });
  }
  return { strikes: v22, ...h24 === void 0 ? {} : { coverage: h24.bits } };
}
var init_bitmap_decoder = __esm({
  "node_modules/@pmndrs/glyph/dist/raster/internal/bitmap-decoder.js"() {
    init_raster_format();
    init_raster_identity();
    init_bitmap_contract();
    init_raster_atlas();
    init_raster_coverage_artifact();
    init_ktx_parse_modern();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/msdf-contract.js
function p8(t31) {
  let n39 = v6(t31);
  if (n39 === void 0) return f11;
  let r34 = n39.emSize ?? 64, i36 = n39.pixelRange ?? 8, o34 = o14(n39.coverage);
  return r34 === 64 && i36 === 8 ? o34 === void 0 ? f11 : Object.freeze({ coverage: o34, generatorVersion: a16 }) : Object.freeze({ ...o34 === void 0 ? {} : { coverage: o34 }, emSize: r34, generatorVersion: a16, pixelRange: i36 });
}
function m8(t31) {
  let n39 = Object.keys(t31);
  if (t31.generatorVersion !== `0.0.0` || n39.some((e29) => e29 !== `coverage` && e29 !== `emSize` && e29 !== `generatorVersion` && e29 !== `pixelRange`)) throw TypeError(`invalid MTSDF descriptor`);
  o14(t31.coverage);
  let r34 = Object.hasOwn(t31, `emSize`), i36 = Object.hasOwn(t31, `pixelRange`);
  if (!r34 && !i36) return h8;
  if (!r34 || !i36) throw TypeError(`invalid MTSDF descriptor`);
  let a34 = Reflect.get(t31, `emSize`), o34 = Reflect.get(t31, `pixelRange`);
  if (typeof a34 != `number` || typeof o34 != `number`) throw TypeError(`invalid MTSDF descriptor`);
  if (y6(a34), b5(o34), a34 === 64 && o34 === 8) throw TypeError(`default MTSDF values must use the canonical default descriptor`);
  return Object.freeze({ emSize: a34, pixelRange: o34, planeUnitsPerEm: a34 });
}
function g6(e29 = f11) {
  return m8(e29), s({ descriptor: e29, extension: r18, kind: n15, version: 0 });
}
function _5(e29) {
  return g6(p8(e29));
}
function v6(t31) {
  if (t31 === void 0) return;
  if (typeof t31 != `object` || !t31 || Array.isArray(t31)) throw TypeError(`MTSDF options must be an object`);
  if (Object.keys(t31).some((e29) => e29 !== `coverage` && e29 !== `emSize` && e29 !== `pixelRange`)) throw TypeError(`MTSDF options contain an unknown property`);
  let n39;
  if (Object.hasOwn(t31, `emSize`)) {
    let e29 = Reflect.get(t31, `emSize`);
    if (typeof e29 != `number`) throw TypeError(`MTSDF emSize must be a number`);
    y6(e29), n39 = e29;
  }
  let r34;
  if (Object.hasOwn(t31, `pixelRange`)) {
    let e29 = Reflect.get(t31, `pixelRange`);
    if (typeof e29 != `number`) throw TypeError(`MTSDF pixelRange must be a number`);
    b5(e29), r34 = e29;
  }
  let i36 = Object.hasOwn(t31, `coverage`) ? o14(Reflect.get(t31, `coverage`)) : void 0;
  return Object.freeze({ ...i36 === void 0 ? {} : { coverage: i36 }, ...n39 === void 0 ? {} : { emSize: n39 }, ...r34 === void 0 ? {} : { pixelRange: r34 } });
}
function y6(e29) {
  if (!Number.isSafeInteger(e29) || e29 < 1 || e29 > 1022) throw TypeError(`MTSDF emSize must be an integer in 1..=${l13}`);
}
function b5(e29) {
  if (!Number.isSafeInteger(e29) || e29 < 1 || e29 > 1020) throw TypeError(`MTSDF pixelRange must be an integer in 1..=${u11}`);
}
var n15, r18, a16, l13, u11, f11, h8;
var init_msdf_contract = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/msdf-contract.js"() {
    init_raster_coverage();
    init_raster_identity();
    n15 = `msdf`;
    r18 = `PMNDRS_font_distance_field`;
    a16 = `0.0.0`;
    l13 = 1022;
    u11 = 1020;
    f11 = Object.freeze({ generatorVersion: a16 });
    h8 = Object.freeze({ emSize: 64, pixelRange: 8, planeUnitsPerEm: 64 });
  }
});

// node_modules/@pmndrs/glyph/dist/runtime-bakers/msdf.js
var msdf_exports = {};
__export(msdf_exports, {
  default: () => n16
});
var n16;
var init_msdf = __esm({
  "node_modules/@pmndrs/glyph/dist/runtime-bakers/msdf.js"() {
    init_msdf_contract();
    init_raster_bake_worker_host();
    n16 = s15({ kind: n15, name: `pmndrs-glyph-mtsdf-baker`, workerUrl: new URL(`../../dist/runtime-bakers/msdf-worker.js`, void 0) });
  }
});

// node_modules/@pmndrs/glyph/dist/raster/internal/msdf-decoder.js
var msdf_decoder_exports = {};
__export(msdf_decoder_exports, {
  decodeMsdfData: () => g7
});
async function g7(g23, y22) {
  if (y22.kind !== `msdf` || y22.extension !== `PMNDRS_font_distance_field` || y22.version !== 0) throw TypeError(`MSDF raster is not bound to the supplied font`);
  let b20 = c16(y22.extensionData, `MSDF extension`);
  if (b20.version !== 0 || b20.rasterKey !== y22.rasterKey || b20.fingerprint !== c2({ glyphCount: g23.glyphCount, glyphIdWidth: 16, kind: `msdf`, rasterKey: y22.rasterKey, shaping: g23.shapingFingerprint, source: g23.sourceFingerprint, version: 0 }) || b20.encoding !== `mtsdf` || b20.recordStride !== 20) throw TypeError(`MSDF extension does not match the runtime contract`);
  let x19 = _6(b20.emSize, `MSDF emSize`, l13), S17 = _6(b20.pixelRange, `MSDF pixelRange`, u11), C17 = _6(b20.planeUnitsPerEm, `MSDF planeUnitsPerEm`, l13);
  if (C17 !== x19) throw TypeError(`MSDF planeUnitsPerEm must equal emSize`);
  let w15 = r17(b20, g23.glyphCount, (e29) => y22.view(e29), `MSDF`);
  if (y22.rasterKey !== _5({ emSize: x19, pixelRange: S17, ...w15 === void 0 ? {} : { coverage: w15.descriptor } })) throw TypeError(`MSDF raster key does not match its generation descriptor`);
  let T13 = y22.view(d8(b20.recordBufferView, `MSDF recordBufferView`));
  if (T13.byteLength !== g23.glyphCount * 20) throw TypeError(`MSDF record table does not match the registered glyph count`);
  let E13 = l12(b20.pages, `MSDF pages`);
  if (E13.length === 0) throw TypeError(`MSDF raster must contain at least one page`);
  if (E13.length > 65535) throw RangeError(`MSDF raster contains too many pages`);
  let D12 = [];
  for (let e29 = 0; e29 < E13.length; e29 += 1) {
    v7(E13[e29], e29);
    let t31 = o18(y22, E13[e29], `MSDF page ${e29}`, { gpuFormat: `rgba8unorm`, vkFormat: VK_FORMAT_R8G8B8A8_UNORM, blockWidth: 1, blockHeight: 1, bytesPerBlock: 4, uncompressedChannelTypes: [KHR_DF_CHANNEL_RGBSDA_RED, KHR_DF_CHANNEL_RGBSDA_GREEN, KHR_DF_CHANNEL_RGBSDA_BLUE, KHR_DF_CHANNEL_RGBSDA_ALPHA] });
    D12.push({ ...t31, format: `rgba8unorm` });
  }
  s16(T13, D12, `MSDF`, true);
  let O11 = Math.max(...D12.map((e29) => e29.width)), k11 = Math.max(...D12.map((e29) => e29.height)), A10 = O11 * k11 * D12.length * 4;
  if (!Number.isSafeInteger(A10) || A10 > 268435456) throw RangeError(`MSDF pages exceed the runtime texture-memory limit`);
  let j9 = Object.freeze({ width: O11, height: k11, layers: D12.length });
  return { resource: s11(`pmndrs.msdf/${g23.shapingFingerprint}/${y22.rasterKey}`), binding: j9, emSize: x19, pixelRange: S17, planeUnitsPerEm: C17, records: T13, ...w15 === void 0 ? {} : { coverage: w15.bits }, pages: D12 };
}
function _6(e29, t31, n39) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 < 1 || e29 > n39) throw TypeError(`${t31} must be an integer in 1..=${n39}`);
  return e29;
}
function v7(e29, t31) {
  let n39 = c16(e29, `MSDF page ${t31}`), a34 = l12(n39.variants, `MSDF page ${t31} variants`);
  if (a34.length !== 1) throw TypeError(`MSDF V0 pages must contain exactly one lossless RGBA8 variant`);
  if (c16(a34[0], `MSDF page ${t31} variant`).gpuFormat !== `rgba8unorm`) throw TypeError(`MSDF V0 pages accept only the lossless rgba8unorm baseline`);
}
var init_msdf_decoder = __esm({
  "node_modules/@pmndrs/glyph/dist/raster/internal/msdf-decoder.js"() {
    init_raster_format();
    init_raster_identity();
    init_raster_atlas();
    init_msdf_contract();
    init_raster_coverage_artifact();
    init_ktx_parse_modern();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/slug-contract.js
function d9(e29) {
  let t31 = p10(e29)?.cubicSubdivisions;
  return t31 === void 0 || t31 === 4 ? u12 : Object.freeze({ cubicSubdivisions: t31, generatorVersion: i16 });
}
function p10(e29) {
  if (e29 == null) return;
  if (typeof e29 != `object`) throw TypeError(`Slug options must be an object`);
  let { cubicSubdivisions: t31 } = e29;
  if (t31 !== void 0) {
    if (!Number.isSafeInteger(t31) || t31 < 1 || t31 > 16) throw TypeError(`Slug cubicSubdivisions must be an integer from 1 to 16: ${String(t31)}`);
    return { cubicSubdivisions: t31 };
  }
}
var t10, n17, i16, a17, u12;
var init_slug_contract = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/slug-contract.js"() {
    t10 = `slug`;
    n17 = `PMNDRS_font_slug`;
    i16 = `0.0.0`;
    a17 = 2048;
    u12 = Object.freeze({ generatorVersion: i16 });
  }
});

// node_modules/@pmndrs/glyph/dist/runtime-bakers/slug.js
var slug_exports = {};
__export(slug_exports, {
  default: () => n18
});
var n18;
var init_slug = __esm({
  "node_modules/@pmndrs/glyph/dist/runtime-bakers/slug.js"() {
    init_slug_contract();
    init_raster_bake_worker_host();
    n18 = s15({ kind: t10, name: `pmndrs-glyph-slug-baker`, workerUrl: new URL(`../../dist/runtime-bakers/slug-worker.js`, void 0) });
  }
});

// node_modules/@pmndrs/glyph/dist/raster/internal/slug-decoder.js
var slug_decoder_exports = {};
__export(slug_decoder_exports, {
  decodeSlugData: () => m10
});
async function m10(e29, n39, o34) {
  if (n39.kind !== `slug` || n39.extension !== `PMNDRS_font_slug` || n39.version !== 0) throw TypeError(`Slug raster is not bound to the supplied font`);
  let c30 = c16(n39.extensionData, `Slug extension`);
  if (c30.version !== 0 || c30.rasterKey !== n39.rasterKey || c30.fingerprint !== c2({ glyphCount: e29.glyphCount, glyphIdWidth: 16, kind: `slug`, rasterKey: n39.rasterKey, shaping: e29.shapingFingerprint, source: e29.sourceFingerprint, version: 0 }) || c30.planeUnitsPerEm !== 2048 || c30.recordStride !== 40) throw TypeError(`Slug extension does not match the fixed runtime contract`);
  let l29 = n39.view(d8(c30.recordBufferView, `Slug recordBufferView`));
  if (l29.byteLength !== e29.glyphCount * 40) throw TypeError(`Slug record table does not match the registered glyph count`);
  let u28 = l12(c30.pages, `Slug pages`);
  if (u28.length === 0 || u28.length > 65535) throw TypeError(`Slug raster must contain 1..=65535 pages`);
  let d24 = [], f26 = 0;
  for (let t31 = 0; t31 < u28.length; t31 += 1) {
    let r34 = await h10(e29, n39, u28[t31], t31, o34);
    d24.push(r34), f26 = w6(f26, r34.curveBytes.byteLength + r34.headerBytes.byteLength + r34.referenceBytes.byteLength);
  }
  return _8(l29, d24, e29.glyphCount), { planeUnitsPerEm: a17, records: l29, pages: d24 };
}
async function h10(t31, a34, o34, s33, p28) {
  let m24 = `Slug page ${s33}`, h24 = c16(o34, m24), _20 = c16(h24.curve, `${m24} curve`), v22 = b7(_20.width, `${m24} curve width`), y22 = b7(_20.height, `${m24} curve height`);
  if (_20.mipLevelCount !== 1 || _20.colorSpace !== `linear`) throw TypeError(`${m24} curve must be a single-level linear texture`);
  let w15 = l12(_20.variants, `${m24} curve variants`);
  if (w15.length !== 1) throw TypeError(`${m24} must contain one curve variant`);
  let T13 = c16(w15[0], `${m24} curve variant`);
  if (T13.container !== `ktx2` || T13.gpuFormat !== `rgba16float` || T13.quality !== `lossless` || T13.requiredFeature !== void 0) throw TypeError(`${m24} curve does not match the lossless RGBA16F baseline`);
  let E13 = await g9(a34, T13.source, `${m24} curve source`, p28), D12 = f7(E13, v22, y22, { vkFormat: VK_FORMAT_R16G16B16A16_SFLOAT, typeSize: 2, blockWidth: 1, blockHeight: 1, bytesPerBlock: 8, float16ChannelTypes: [KHR_DF_CHANNEL_RGBSDA_RED, KHR_DF_CHANNEL_RGBSDA_GREEN, KHR_DF_CHANNEL_RGBSDA_BLUE, KHR_DF_CHANNEL_RGBSDA_ALPHA] }).levels[0];
  if (D12 === void 0) throw TypeError(`${m24} curve has no base level`);
  let O11 = D12.levelData.slice(), k11 = b7(h24.headerWidth, `${m24} header width`), A10 = b7(h24.headerHeight, `${m24} header height`), j9 = C6(k11, A10, `${m24} header dimensions`), M9 = x7(h24.headerCount, j9, `${m24} header count`), N9 = (await g9(a34, c16(h24.headerResource, `${m24} header resource`).source, `${m24} header source`, p28)).slice();
  S5(N9, j9, 4, `${m24} header`);
  let P8 = b7(h24.referenceWidth, `${m24} reference width`), F8 = b7(h24.referenceHeight, `${m24} reference height`), I6 = C6(P8, F8, `${m24} reference dimensions`), L5 = x7(h24.referenceCount, I6, `${m24} reference count`), R5 = (await g9(a34, c16(h24.referenceResource, `${m24} reference resource`).source, `${m24} reference source`, p28)).slice();
  return S5(R5, I6, 2, `${m24} reference`), { resource: s11(`pmndrs.slug/${t31.shapingFingerprint}/${a34.rasterKey}/${s33}`), curveWidth: v22, curveHeight: y22, curveBytes: O11, headerCount: M9, headerWidth: k11, headerHeight: A10, headerBytes: N9, referenceCount: L5, referenceWidth: P8, referenceHeight: F8, referenceBytes: R5 };
}
async function g9(e29, t31, n39, r34) {
  let o34 = c16(t31, n39);
  if (o34.type !== `bufferView`) throw TypeError(`${n39} must be a bufferView`);
  let s33 = { type: `bufferView`, bufferView: d8(o34.bufferView, `${n39} bufferView`) };
  return e29.resource(s33, r34);
}
function _8(e29, t31, n39) {
  let r34 = new DataView(e29.buffer, e29.byteOffset, e29.byteLength);
  for (let i36 = 0; i36 < n39; i36 += 1) {
    let n40 = i36 * 40, a34 = r34.getUint16(n40 + 8, true);
    if (a34 === 65535) {
      if (!v9(e29, n40)) throw TypeError(`Slug glyph ${i36} has non-canonical absent data`);
      continue;
    }
    let o34 = t31[a34];
    if (o34 === void 0) throw TypeError(`Slug glyph ${i36} references a missing page`);
    let s33 = r34.getInt16(n40, true), c30 = r34.getInt16(n40 + 2, true), l29 = r34.getInt16(n40 + 4, true), u28 = r34.getInt16(n40 + 6, true), d24 = r34.getUint16(n40 + 10, true), f26 = r34.getUint16(n40 + 12, true);
    if (s33 >= l29 || c30 >= u28 || d24 === 0 || f26 === 0 || r34.getUint16(n40 + 14, true) !== 0) throw TypeError(`Slug glyph ${i36} has invalid bounds, bands, or flags`);
    y8(r34.getUint32(n40 + 16, true), r34.getUint32(n40 + 20, true), o34.curveWidth * o34.curveHeight, `Slug glyph ${i36} curve`), y8(r34.getUint32(n40 + 24, true), d24, o34.headerCount, `Slug glyph ${i36} horizontal headers`), y8(r34.getUint32(n40 + 28, true), f26, o34.headerCount, `Slug glyph ${i36} vertical headers`), y8(r34.getUint32(n40 + 32, true), r34.getUint32(n40 + 36, true), o34.referenceCount, `Slug glyph ${i36} references`);
  }
}
function v9(e29, t31) {
  for (let n39 = 0; n39 < 40; n39 += 1) if (n39 !== 8 && n39 !== 9 && e29[t31 + n39] !== 0) return false;
  return true;
}
function y8(e29, t31, n39, r34) {
  if (t31 === 0 || e29 > n39 - t31) throw TypeError(`${r34} range is empty or outside its page resource`);
}
function b7(e29, t31) {
  let n39 = u10(e29, t31);
  if (n39 > p11) throw RangeError(`${t31} exceeds ${p11}`);
  return n39;
}
function x7(e29, t31, n39) {
  let r34 = u10(e29, n39);
  if (r34 > t31) throw TypeError(`${n39} exceeds its grid capacity`);
  return r34;
}
function S5(e29, t31, n39, r34) {
  let i36 = C6(t31, n39, `${r34} byte length`);
  if (e29.byteLength !== i36) throw TypeError(`${r34} byte length does not match its dimensions`);
}
function C6(e29, t31, n39) {
  let r34 = e29 * t31;
  if (!Number.isSafeInteger(r34)) throw RangeError(`${n39} overflow`);
  return r34;
}
function w6(e29, t31) {
  let n39 = e29 + t31;
  if (!Number.isSafeInteger(n39) || n39 > 268435456) throw RangeError(`Slug pages exceed the runtime resource-memory limit`);
  return n39;
}
var p11;
var init_slug_decoder = __esm({
  "node_modules/@pmndrs/glyph/dist/raster/internal/slug-decoder.js"() {
    init_raster_format();
    init_raster_identity();
    init_raster_ktx();
    init_raster_atlas();
    init_slug_contract();
    init_ktx_parse_modern();
    p11 = 16384;
  }
});

// node_modules/@pmndrs/glyph/dist/font-baker/contract.js
var e13;
var init_contract = __esm({
  "node_modules/@pmndrs/glyph/dist/font-baker/contract.js"() {
    e13 = `0.0.0`;
  }
});

// node_modules/@pmndrs/glyph/dist/internal/glb-reader.js
function r20(e29) {
  e29.byteLength < 28 && o20(`GLB_TOO_SHORT`, `GLB must contain a header plus JSON and BIN chunks`);
  let n39 = new DataView(e29.buffer, e29.byteOffset, e29.byteLength);
  n39.getUint32(0, true) !== 1179937895 && o20(`GLB_MAGIC`, `invalid GLB magic`, `/header/magic`), n39.getUint32(4, true) !== 2 && o20(`GLB_VERSION`, `only GLB version 2 is supported`, `/header/version`), n39.getUint32(8, true) !== e29.byteLength && o20(`GLB_LENGTH`, `declared GLB length must consume the complete input`, `/header/length`);
  let r34 = [], s33 = 12;
  for (; s33 < e29.byteLength; ) {
    s33 > e29.byteLength - 8 && o20(`GLB_CHUNK_HEADER`, `truncated GLB chunk header`, `/chunks/${r34.length}`);
    let t31 = n39.getUint32(s33, true), i36 = n39.getUint32(s33 + 4, true);
    t31 & 3 && o20(`GLB_CHUNK_ALIGNMENT`, `chunk byte length must be four-byte aligned`, `/chunks/${r34.length}`);
    let a34 = s33 + 8, c31 = a34 + t31;
    (!Number.isSafeInteger(c31) || c31 < a34 || c31 > e29.byteLength) && o20(`GLB_CHUNK_RANGE`, `chunk payload exceeds the declared GLB length`, `/chunks/${r34.length}`), r34.push({ type: i36, start: a34, end: c31 }), s33 = c31;
  }
  s33 !== e29.byteLength && o20(`GLB_TRAILING_BYTES`, `chunks must consume the complete GLB`), (r34.length !== 2 || r34[0]?.type !== 1313821514 || r34[1]?.type !== 5130562) && o20(`GLB_CHUNK_ORDER`, `GLB must contain exactly one JSON chunk followed by one BIN chunk`);
  let c30 = e29.subarray(r34[0].start, r34[0].end), l29 = c30.byteLength;
  for (; l29 > 0 && c30[l29 - 1] === 32; ) --l29;
  l29 === 0 && o20(`GLB_JSON_EMPTY`, `JSON chunk is empty`, `/json`);
  for (let e30 = l29; e30 < c30.byteLength; e30 += 1) c30[e30] !== 32 && o20(`GLB_JSON_PADDING`, `JSON chunk padding must use spaces`, `/json`);
  let u28;
  try {
    u28 = JSON.parse(t11.decode(c30.subarray(0, l29)));
  } catch (e30) {
    o20(`GLB_JSON`, e30 instanceof Error ? e30.message : String(e30), `/json`);
  }
  i18(u28) || o20(`GLB_JSON_ROOT`, `GLB JSON root must be an object`, `/json`);
  let d24 = u28.buffers;
  (!Array.isArray(d24) || d24.length !== 1 || !i18(d24[0])) && o20(`BUFFER_COUNT`, `GLB must contain exactly one embedded buffer`, `/buffers`), d24[0].uri !== void 0 && o20(`BUFFER_URI`, `GLB buffer must be embedded`, `/buffers/0/uri`);
  let f26 = a19(d24[0].byteLength, `BUFFER_LENGTH`, `/buffers/0/byteLength`), p28 = r34[1], m24 = e29.subarray(p28.start, p28.end);
  return (f26 < 0 || f26 > m24.byteLength || m24.byteLength - f26 > 3) && o20(`BIN_LENGTH`, `BIN chunk must equal its declared buffer length plus at most three padding bytes`), m24.subarray(f26).some((e30) => e30 !== 0) && o20(`BIN_PADDING`, `BIN chunk padding must be zero`, `/bin`), { document: u28, bin: m24, declaredBinLength: f26 };
}
function i18(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function a19(e29, t31, n39) {
  return (typeof e29 != `number` || !Number.isSafeInteger(e29)) && o20(t31, `value must be a safe integer`, n39), e29;
}
function o20(e29, t31, r34) {
  throw new n20({ code: e29, message: t31, ...r34 === void 0 ? {} : { path: r34 } });
}
var t11, n20;
var init_glb_reader = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/glb-reader.js"() {
    init_glyph_error();
    t11 = new TextDecoder(`utf-8`, { fatal: true });
    n20 = class extends e3 {
      issues;
      constructor(e29) {
        super(`artifact-invalid`, `${e29.code}${e29.path === void 0 ? `` : ` ${e29.path}`}: ${e29.message}`), this.name = `GlbReadError`, this.issues = [e29];
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/font-artifact-reader.js
function i19(e29) {
  let i36 = r20(e29);
  s20(i36.document.extensionsUsed, `extensionsUsed`), s20(i36.document.extensionsRequired, `extensionsRequired`);
  let l29 = c17(c17(i36.document.extensions, `extensions`)[n21], n21);
  if (l29.version !== 0 || l29.shaping?.format !== `opentype-sfnt-harfrust-v0` || l29.metrics?.glyphIdWidth !== 16 || l29.provenance?.bakerVersion !== `0.0.0` || l29.provenance?.harfrustVersion !== `0.12.0` || l29.provenance?.harfbuzzReferenceVersion !== `13.0.0` || l29.provenance?.unicodeVersion !== `17.0.0`) throw new r21(`FONT_VERSION_INCOMPATIBLE`, `PMNDRS_font uses an unsupported runtime format`);
  let d24 = a20(i36), f26 = l29.shaping.fontFunctions;
  return { parsed: i36, extension: l29, bufferViews: d24, shapingSfnt: o21(i36, d24, l29.shaping.bufferView, `shaping.bufferView`), glyphExtents: o21(i36, d24, f26.glyphExtentsBufferView, `glyphExtentsBufferView`), glyphExtentsAvailability: o21(i36, d24, f26.glyphExtentsAvailabilityBufferView, `glyphExtentsAvailabilityBufferView`), shapingFingerprint: u13(l29.shaping.fingerprint, `shaping.fingerprint`), sourceFingerprint: u13(l29.provenance.sourceFingerprint, `provenance.sourceFingerprint`) };
}
function a20(e29) {
  let t31 = e29.document.bufferViews;
  if (!Array.isArray(t31)) throw TypeError(`bufferViews must be an array`);
  return t31.map((t32, n39) => {
    let r34 = c17(t32, `bufferViews[${n39}]`);
    if (r34.buffer !== 0) throw TypeError(`bufferViews[${n39}] must use buffer 0`);
    let i36 = r34.byteOffset === void 0 ? 0 : l14(r34.byteOffset, `bufferViews[${n39}].byteOffset`), a34 = l14(r34.byteLength, `bufferViews[${n39}].byteLength`);
    if (i36 < 0 || a34 < 0 || !Number.isSafeInteger(i36 + a34) || i36 + a34 > e29.declaredBinLength) throw RangeError(`bufferViews[${n39}] exceeds the declared binary data`);
    return { byteOffset: i36, byteLength: a34 };
  });
}
function o21(e29, t31, n39, r34) {
  let i36 = t31[l14(n39, r34)];
  if (i36 === void 0) throw RangeError(`${r34} does not identify a buffer view`);
  return e29.bin.subarray(i36.byteOffset, i36.byteOffset + i36.byteLength);
}
function s20(e29, t31) {
  if (!Array.isArray(e29) || !e29.includes(n21)) throw new r21(`FONT_EXTENSION_REQUIRED`, `${t31} must include ${n21}`);
}
function c17(e29, t31) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`${t31} must be an object`);
  return e29;
}
function l14(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29)) throw TypeError(`${t31} must be a safe integer`);
  return e29;
}
function u13(e29, t31) {
  if (typeof e29 != `string`) throw TypeError(`${t31} must be a string`);
  return e29;
}
var n21, r21;
var init_font_artifact_reader = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/font-artifact-reader.js"() {
    init_glyph_error();
    init_glb_reader();
    n21 = `PMNDRS_font`;
    r21 = class extends e3 {
      issues;
      constructor(e29, t31) {
        super(`artifact-invalid`, `${e29}: ${t31}`), this.name = `RuntimeFontArtifactError`, this.issues = [{ code: e29, message: t31 }];
      }
    };
  }
});

// node_modules/@pmndrs/glyph/dist/internal/registered-font.js
function t12(t31, n39) {
  e14.set(t31, n39);
}
function n22(t31) {
  let n39 = e14.get(t31);
  if (n39 === void 0) throw TypeError(`font is not registered by this package`);
  return n39;
}
function r22(t31) {
  e14.delete(t31);
}
var e14;
var init_registered_font = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/registered-font.js"() {
    e14 = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/font-selection.js
function t13(t31) {
  if (!Array.isArray(t31) || t31.length === 0) throw TypeError(`font selection requires at least one Unicode range`);
  if (t31.length > e15) throw RangeError(`font selection exceeds ${e15} Unicode ranges`);
  let n39 = t31.map((e29, t32) => {
    if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`Unicode range ${t32} must be an object`);
    let { start: n40, end: r35 } = e29;
    if (!Number.isSafeInteger(n40) || !Number.isSafeInteger(r35) || n40 < 0 || n40 > r35 || r35 > 1114111) throw RangeError(`Unicode range ${t32} must contain ordered integers from U+0000 through U+10FFFF`);
    return { start: n40, end: r35 };
  });
  n39.sort((e29, t32) => e29.start - t32.start || e29.end - t32.end);
  let r34 = [];
  for (let e29 of n39) {
    let t32 = r34.at(-1);
    t32 !== void 0 && e29.start <= t32.end + 1 ? r34[r34.length - 1] = { start: t32.start, end: Math.max(t32.end, e29.end) } : r34.push(e29);
  }
  return r34;
}
var e15;
var init_font_selection = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/font-selection.js"() {
    e15 = 4096;
  }
});

// node_modules/@pmndrs/glyph/dist/internal/runtime-bake-protocol.js
function n23(e29) {
  return !l15(e29) || e29.type !== `bake-font-result-v0` || !c18(e29.id) ? false : e29.ok === false ? l15(e29.error) && typeof e29.error.code == `string` && typeof e29.error.message == `string` && (e29.error.path === void 0 || typeof e29.error.path == `string`) : e29.ok === true && Array.isArray(e29.artifacts) && e29.artifacts.length === 1 && e29.artifacts.every(s21) && l15(e29.report) && Array.isArray(e29.warnings);
}
function s21(t31) {
  return l15(t31) && t31.role === `font` && typeof t31.id == `string` && t31.bytes instanceof ArrayBuffer && n2(t31.fingerprint);
}
function c18(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 > 0;
}
function l15(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
var t14;
var init_runtime_bake_protocol = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/runtime-bake-protocol.js"() {
    init_fingerprint();
    t14 = Object.freeze([`bitmap`, `msdf`, `slug`]);
  }
});

// node_modules/@pmndrs/glyph/dist/internal/font-face-transfer.js
function e16(e29) {
  return i20(e29) && e29.kind === `glyph-font-face` && e29.version === 1;
}
function t15(e29) {
  return r23(structuredClone(e29, { transfer: n24(e29) }));
}
function n24(e29) {
  let t31 = [e29.data, ...e29.rasters.flatMap((e30) => e30.data === void 0 ? [] : [e30.data]), ...e29.resources.map((e30) => e30.data)];
  return [...new Set(t31)];
}
function r23(e29) {
  for (let t31 of e29.rasters) {
    for (let e30 of t31.resources) Object.freeze(e30);
    Object.freeze(t31.resources), Object.freeze(t31);
  }
  for (let t31 of e29.resources) Object.freeze(t31);
  return Object.freeze(e29.rasters), Object.freeze(e29.resources), Object.freeze(e29);
}
function i20(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
var init_font_face_transfer = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/font-face-transfer.js"() {
  }
});

// node_modules/@pmndrs/glyph/dist/internal/font-face-transfer-runtime.js
var font_face_transfer_runtime_exports = {};
__export(font_face_transfer_runtime_exports, {
  loadSerializedFontFaceSource: () => a21,
  snapshotSerializedFontFace: () => i21
});
function i21(n39, i36) {
  let a34 = n22(n39), s33 = [], c30 = /* @__PURE__ */ new Set(), l29 = /* @__PURE__ */ new Set();
  for (let t31 of i36) {
    let n40 = v(t31).raster.rasterKey;
    if (c30.has(n40)) continue;
    c30.add(n40);
    let r34 = a34.rasterSources.get(n40);
    for (let e29 of r34.resourceIdentities) l29.add(e29);
    let i37 = Object.freeze([...r34.resourceIdentities].map((e29) => {
      let t32 = a34.resources.get(e29);
      return Object.freeze({ artifactFingerprint: t32.artifactFingerprint, byteLength: t32.byteLength });
    }));
    s33.push(Object.freeze({ rasterKey: n40, kind: r34.reference.kind, extension: r34.reference.extension, version: r34.reference.version, ...r34.artifactBytes === void 0 ? {} : { data: o22(r34.artifactBytes), artifactFingerprint: r34.artifactFingerprint }, resources: i37 }));
  }
  return r23({ kind: `glyph-font-face`, version: 1, data: o22(a34.artifactBytes), artifactFingerprint: a34.artifactFingerprint, rasters: Object.freeze(s33), resources: Object.freeze([...l29].map((e29) => {
    let t31 = a34.resources.get(e29);
    return Object.freeze({ artifactFingerprint: t31.artifactFingerprint, byteLength: t31.byteLength, data: o22(t31.bytes) });
  })) });
}
async function a21(e29, r34, i36) {
  let a34 = new D4(r34), o34;
  try {
    o34 = await a34._registerAsset(new Uint8Array(e29.data), {}, `adopt`), i36?.throwIfAborted();
    let n39 = n22(o34);
    for (let t31 of e29.rasters) t31.data !== void 0 && await a34._attachRaster(o34, new Uint8Array(t31.data), {}, `adopt`), i36?.throwIfAborted();
    i36?.throwIfAborted();
    for (let t31 of e29.resources) n39.resources.set(`${t31.artifactFingerprint}:${t31.byteLength}`, Object.freeze({ artifactFingerprint: t31.artifactFingerprint, byteLength: t31.byteLength, bytes: new Uint8Array(t31.data) }));
    return o34;
  } catch (e30) {
    throw o34?.dispose(), e30;
  }
}
function o22(e29) {
  return new Uint8Array(e29.buffer, e29.byteOffset, e29.byteLength).slice().buffer;
}
var init_font_face_transfer_runtime = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/font-face-transfer-runtime.js"() {
    init_loaded_font();
    init_registered_font();
    init_loader();
    init_font_face_transfer();
  }
});

// node_modules/@pmndrs/glyph/dist/font-baker/generated/font-baker-abi.js
var e17;
var init_font_baker_abi = __esm({
  "node_modules/@pmndrs/glyph/dist/font-baker/generated/font-baker-abi.js"() {
    e17 = { endianness: `little`, functions: { allocate: { export: `pmndrs_font_baker_alloc`, parameters: [`byteLength`], result: `pointer` }, bake: { export: `pmndrs_font_baker_bake`, parameters: [`sourcePointer`, `sourceByteLength`, `descriptorPointer`, `descriptorByteLength`], result: `responsePointer` }, deallocate: { export: `pmndrs_font_baker_dealloc`, parameters: [`pointer`, `byteLength`] }, inspect: { export: `pmndrs_font_baker_inspect`, parameters: [`sourcePointer`, `sourceByteLength`, `descriptorPointer`, `descriptorByteLength`], result: `responsePointer` }, prepare: { export: `pmndrs_font_baker_prepare`, parameters: [`sourcePointer`, `sourceByteLength`, `selectionPointer`, `selectionByteLength`], result: `responsePointer` }, responseByteLength: { export: `pmndrs_font_baker_result_len`, parameters: [], result: `byteLength` } }, memory: `memory`, name: `pmndrs-glyph-font-baker`, pointerWidth: 32, response: { artifactByteLengthOffset: 12, headerAlignment: 4, headerByteLength: 16, magic: `PFB0`, magicOffset: 0, metadataByteLengthOffset: 8, payloadOffset: 16, statusOffset: 4, successStatus: 0 }, version: 0, versions: { baker: `0.0.0`, binaryen: `129.0.0`, fontFormat: 0, gltfSchemaRevision: `77b44be7bef26e01fb0b140e3d5bb1716421c5e9`, gltfSpec: `2.0`, gltfValidator: `2.0.0-dev.3.10`, harfbuzzReference: `13.0.0`, harfbuzzReferenceCommit: `a0fc099681a69ae40665fbea74982a2e9d7a5260`, harfrust: `0.12.0`, harfrustCommit: `60b28ea22b5261710018d69c168a762bcb28794c`, unicode: `17.0.0` } };
  }
});

// node_modules/@pmndrs/glyph/dist/font-baker/index.js
async function c19(e29) {
  let t31 = e29 instanceof WebAssembly.Module ? e29 : await WebAssembly.compile(e29);
  return l16(await WebAssembly.instantiate(t31, {}));
}
function l16(e29) {
  let t31 = u14(e29.exports, e17);
  return { bake({ source: e30, descriptor: n39 }) {
    return d10(t31, t31.pmndrs_font_baker_bake, e30, n39, m12);
  }, prepare({ source: e30, selection: n39 }) {
    return d10(t31, t31.pmndrs_font_baker_prepare, e30, n39, h12);
  }, inspect({ source: e30, descriptor: n39 }) {
    return d10(t31, t31.pmndrs_font_baker_inspect, e30, n39, g11);
  } };
}
function u14(e29, t31) {
  let n39 = e29[t31.memory], r34 = e29[t31.functions.allocate.export], i36 = e29[t31.functions.deallocate.export], a34 = e29[t31.functions.bake.export], o34 = e29[t31.functions.prepare.export], s33 = e29[t31.functions.inspect.export], c30 = e29[t31.functions.responseByteLength.export];
  if (!(n39 instanceof WebAssembly.Memory) || typeof r34 != `function` || typeof i36 != `function` || typeof a34 != `function` || typeof o34 != `function` || typeof s33 != `function` || typeof c30 != `function`) throw TypeError(`invalid @pmndrs/glyph bake Wasm exports`);
  return { memory: n39, pmndrs_font_baker_alloc: r34, pmndrs_font_baker_dealloc: i36, pmndrs_font_baker_bake: a34, pmndrs_font_baker_prepare: o34, pmndrs_font_baker_inspect: s33, pmndrs_font_baker_result_len: c30 };
}
function d10(e29, t31, r34, i36, a34) {
  let s33 = o23.encode(JSON.stringify(i36)), c30 = 0, l29 = 0, u28 = 0, d24 = 0;
  try {
    return c30 = f13(e29, r34), l29 = f13(e29, s33), u28 = t31(c30, r34.byteLength, l29, s33.byteLength), d24 = e29.pmndrs_font_baker_result_len(), a34(new Uint8Array(e29.memory.buffer, u28, d24), e17);
  } finally {
    c30 !== 0 && e29.pmndrs_font_baker_dealloc(c30, r34.byteLength), l29 !== 0 && e29.pmndrs_font_baker_dealloc(l29, s33.byteLength), u28 !== 0 && d24 !== 0 && e29.pmndrs_font_baker_dealloc(u28, d24);
  }
}
function f13(e29, t31) {
  let n39 = e29.pmndrs_font_baker_alloc(t31.byteLength);
  if (n39 === 0 && t31.byteLength !== 0) throw RangeError(`font baker Wasm allocation failed`);
  try {
    return new Uint8Array(e29.memory.buffer, n39, t31.byteLength).set(t31), n39;
  } catch (r34) {
    throw n39 !== 0 && e29.pmndrs_font_baker_dealloc(n39, t31.byteLength), r34;
  }
}
function p13(e29, t31) {
  let n39 = t31.response;
  if (e29.byteLength < n39.headerByteLength || s22.decode(e29.subarray(n39.magicOffset, n39.magicOffset + n39.magic.length)) !== n39.magic) throw TypeError(`invalid font baker response envelope`);
  let r34 = new DataView(e29.buffer, e29.byteOffset, e29.byteLength), i36 = r34.getUint32(n39.statusOffset, true), o34 = r34.getUint32(n39.metadataByteLengthOffset, true), c30 = r34.getUint32(n39.artifactByteLengthOffset, true);
  if (n39.payloadOffset + o34 + c30 !== e29.byteLength) throw TypeError(`invalid font baker response lengths`);
  let l29 = JSON.parse(s22.decode(e29.subarray(n39.payloadOffset, n39.payloadOffset + o34)));
  if (i36 !== n39.successStatus) throw new a22(O3(l29));
  return { metadata: l29, artifact: e29.slice(n39.payloadOffset + o34) };
}
function m12(e29, t31) {
  let { metadata: n39, artifact: r34 } = p13(e29, t31);
  _10(n39);
  let i36 = n39, a34 = i36.artifacts[0];
  if (i36.artifacts.length !== 1 || a34 === void 0) throw TypeError(`V0 font baker must return exactly one core artifact`);
  return { artifacts: [{ ...a34, bytes: r34 }], report: i36.report, warnings: i36.warnings };
}
function h12(e29, t31) {
  let { metadata: n39, artifact: r34 } = p13(e29, t31);
  if (!T5(n39) || r34.byteLength !== n39.preparedBytes) throw TypeError(`font baker returned invalid prepared font metadata`);
  return { bytes: r34, report: n39 };
}
function g11(e29, t31) {
  let { metadata: n39, artifact: r34 } = p13(e29, t31);
  if (!E5(n39) || r34.byteLength !== 0) throw TypeError(`font baker returned invalid font inspection metadata`);
  return n39;
}
function _10(e29) {
  if (!k3(e29) || !Array.isArray(e29.artifacts) || !e29.artifacts.every(v11) || !y10(e29.report) || !Array.isArray(e29.warnings) || !e29.warnings.every(w7)) throw TypeError(`font baker returned invalid result metadata`);
}
function v11(e29) {
  return k3(e29) && e29.role === `font` && typeof e29.id == `string` && e29.id.length > 0 && n2(e29.fingerprint);
}
function y10(e29) {
  if (!k3(e29)) return false;
  let { source: t31, shared: n39, containers: r34, transport: i36 } = e29;
  return k3(t31) && A2(t31.bytes) && k3(n39) && b9(n39.shaping) && Array.isArray(e29.rasters) && Array.isArray(r34) && r34.every(S7) && Array.isArray(i36) && i36.every(C8);
}
function b9(e29) {
  return k3(e29) && e29.format === `opentype-sfnt-harfrust-v0` && A2(e29.sfntDirectoryBytes) && Array.isArray(e29.tables) && e29.tables.every(x9) && A2(e29.extentsBytes) && A2(e29.extentsAvailabilityBytes) && A2(e29.totalRawBytes) && (e29.gzipBytes === void 0 || A2(e29.gzipBytes)) && (e29.brotliBytes === void 0 || A2(e29.brotliBytes));
}
function x9(e29) {
  return k3(e29) && typeof e29.tag == `string` && A2(e29.rawBytes) && A2(e29.paddedBytes);
}
function S7(e29) {
  return k3(e29) && typeof e29.artifactId == `string` && e29.role === `font` && A2(e29.jsonBytes) && A2(e29.paddingBytes) && A2(e29.totalBytes);
}
function C8(e29) {
  return k3(e29) && typeof e29.artifactId == `string` && (e29.format === `raw` || e29.format === `gzip` || e29.format === `brotli`) && A2(e29.bytes);
}
function w7(e29) {
  return k3(e29) && typeof e29.code == `string` && typeof e29.message == `string` && (e29.path === void 0 || typeof e29.path == `string`);
}
function T5(e29) {
  return k3(e29) && e29.formatVersion === 0 && A2(e29.sourceBytes) && A2(e29.preparedBytes) && e29.preparedBytes > 0 && e29.fontFaceIndex === 0 && A2(e29.glyphCount) && n2(e29.fingerprint);
}
function E5(e29) {
  return k3(e29) && e29.formatVersion === 0 && A2(e29.fontFaceIndex) && A2(e29.glyphCount) && (e29.glyphNameSource === `post` || e29.glyphNameSource === `cff` || e29.glyphNameSource === `none`) && Array.isArray(e29.glyphs) && e29.glyphs.every(D5);
}
function D5(e29) {
  return k3(e29) && A2(e29.codePoint) && e29.codePoint <= 1114111 && A2(e29.glyphId) && e29.glyphId <= 4294967295 && (e29.name === void 0 || typeof e29.name == `string`);
}
function O3(e29) {
  if (!w7(e29)) throw TypeError(`font baker returned invalid error metadata`);
  return e29;
}
function k3(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function A2(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 >= 0;
}
var a22, o23, s22;
var init_font_baker = __esm({
  "node_modules/@pmndrs/glyph/dist/font-baker/index.js"() {
    init_glyph_error();
    init_fingerprint();
    init_font_baker_abi();
    a22 = class extends e3 {
      reason;
      path;
      constructor(e29) {
        super(`bake-failed`, e29.message), this.name = `FontBakeError`, this.reason = e29.code, this.path = e29.path;
      }
    };
    o23 = new TextEncoder();
    s22 = new TextDecoder();
  }
});

// node_modules/@pmndrs/glyph/dist/internal/core-bake-policy.js
function e18(e29) {
  return { formatVersion: 0, fontFaceIndex: e29 };
}
function t16(e29) {
  let t31 = e29.artifacts[0];
  if (e29.artifacts.length !== 1 || t31?.role !== `font`) throw TypeError(`font bake result must contain exactly one core font artifact`);
  return t31;
}
var init_core_bake_policy = __esm({
  "node_modules/@pmndrs/glyph/dist/internal/core-bake-policy.js"() {
  }
});

// node_modules/@pmndrs/glyph/dist/runtime-bake.js
var runtime_bake_exports = {};
__export(runtime_bake_exports, {
  bakeFontInWorker: () => c20
});
var s23, c20;
var init_runtime_bake = __esm({
  "node_modules/@pmndrs/glyph/dist/runtime-bake.js"() {
    init_font_selection();
    init_runtime_bake_protocol();
    init_font_baker();
    init_owned_array_buffer();
    init_core_bake_policy();
    init_bake_progress_protocol();
    init_serial_worker_host();
    s23 = new e11({ name: `pmndrs-glyph-font-baker`, workerUrl: new URL(`../dist/runtime-bake-worker.js`, void 0), prepare(t31, n39) {
      let a34 = e9(t31.source);
      return { message: { type: `bake-font-v0`, id: n39, source: a34, font: e18(0), ...t31.cache === void 0 ? {} : { cache: t31.cache }, ...t31.unicodeRanges === void 0 ? {} : { unicodeRanges: t13(t31.unicodeRanges) }, ...t31.rasters === void 0 ? {} : { rasters: t31.rasters } }, transfer: [a34] };
    }, isResponse: n23, responseId: (e29) => e29.id, resolve(e29) {
      if (!e29.ok) throw new a22(e29.error);
      return new Uint8Array(e29.artifacts[0].bytes);
    }, progress: { isProgress: n11, progressId: (e29) => e29.id, report: (e29, { stage: t31, phase: n39, completed: r34, total: i36 }) => e29.onProgress?.({ stage: t31, phase: n39, completed: r34, total: i36 }) } });
    c20 = (e29) => (e29.onProgress?.({ stage: `font`, phase: `queued`, completed: 0, total: 1 }), s23.run(e29, e29.signal));
  }
});

// node_modules/@pmndrs/glyph/dist/loader.js
function ce(e29, t31, n39) {
  if (t31 === void 0) throw TypeError(`font loading requires a raster format`);
  return { input: e29, rasters: Array.isArray(t31) ? t31 : [t31], multiple: Array.isArray(t31), options: n39 === void 0 ? {} : n39 };
}
function ue(e29 = {}) {
  if (!q(e29)) throw TypeError(`font library options must be an object`);
  return new O4(e29);
}
function de(e29, t31, n39, r34 = {}) {
  return k4(e29, `FontFace loading`), ve(e29).openFontFaceSource(t31, n39, r34);
}
function fe(e29, t31, n39 = {}) {
  return k4(e29, `serialized FontFace loading`), ve(e29).openSerializedFontFaceSource(t31, n39);
}
function me() {
  return pe;
}
function he(e29, t31) {
  if (t31.rasters.length === 0) throw TypeError(`font request requires at least one raster format`);
  return e29.openFontFaceSource(t31.input, t31.rasters, t31.options).then((e30) => ge(e30, t31.rasters, t31.multiple));
}
async function ge(e29, t31, n39) {
  let r34 = t31.map((t32) => e29.load(t32));
  try {
    let t32 = await Promise.all(r34);
    return _e(e29, t32), n39 ? Object.freeze(t32) : t32[0];
  } catch (t32) {
    let n40 = await Promise.allSettled(r34);
    for (let e30 of n40) e30.status === `fulfilled` && e30.value.dispose();
    throw e29.dispose(), t32;
  }
}
function _e(e29, t31) {
  let n39 = t31.length;
  for (let i36 of t31) u(i36, () => {
    --n39, n39 === 0 && e29.dispose();
  });
}
function k4(e29, t31) {
  if (!(e29 instanceof O4)) throw TypeError(`${t31} requires a FontLibrary`);
}
function ve(e29) {
  if (!(e29 instanceof O4)) throw TypeError(`font library operation requires a FontLibrary`);
  return e29;
}
function ye(e29) {
  let t31 = new AbortController(), n39;
  return n39 = { controller: t31, promise: Promise.resolve().then(() => e29(t31.signal)).then((e30) => (n39.settled = true, n39.value = e30, n39.consumers === 0 && e30.leaseCount === 0 && e30.dispose(), e30), (e30) => {
    throw n39.settled = true, e30;
  }), consumers: 0, settled: false, value: void 0 }, n39;
}
function be(e29, t31) {
  return t31?.throwIfAborted(), e29.consumers += 1, new Promise((n39, r34) => {
    let i36 = true, a34 = () => {
      i36 && (i36 = false, t31?.removeEventListener(`abort`, o34), e29.controller.signal.removeEventListener(`abort`, s33), --e29.consumers, e29.consumers === 0 && (e29.settled ? e29.value?.leaseCount === 0 && e29.value.dispose() : e29.controller.abort(z(t31))));
    }, o34 = () => {
      a34(), r34(z(t31));
    }, s33 = () => {
      a34(), r34(z(e29.controller.signal));
    };
    t31?.addEventListener(`abort`, o34, { once: true }), e29.controller.signal.addEventListener(`abort`, s33, { once: true }), e29.promise.then((e30) => {
      if (!i36) return;
      let t32 = e30.acquire();
      a34(), n39(t32);
    }, (e30) => {
      i36 && (a34(), r34(e30));
    });
  });
}
async function Ce(e29, t31, n39) {
  let r34 = new D4({ ...t31.maxArtifactBytes === void 0 ? {} : { maxArtifactBytes: t31.maxArtifactBytes }, ...t31.maxBufferViews === void 0 ? {} : { maxBufferViews: t31.maxBufferViews }, ...t31.maxRasters === void 0 ? {} : { maxRasters: t31.maxRasters } }), i36 = e29.initialRasters.filter(({ operation: e30 }) => t14.includes(e30.format.kind)).map(({ operation: e30, descriptor: t32 }) => Pe(e30.format, t32)), a34 = e29.runtimeBake ?? t31.runtimeBake, o34 = async (t32) => (a34 ?? await Be(t32.sourceUrl))({ ...t32, ...e29.unicodeRanges === void 0 ? {} : { unicodeRanges: e29.unicodeRanges }, rasters: i36 }), s33 = await new se({ registry: r34, ...t31.fetch === void 0 ? {} : { fetch: t31.fetch }, ...t31.baseUrl === void 0 ? {} : { baseUrl: t31.baseUrl }, ...t31.development === void 0 ? {} : { development: t31.development }, runtimeBake: o34, ...e29.unicodeRanges === void 0 ? {} : { runtimeSourceIdentity: `transformed` }, ...t31.onDiagnostic === void 0 ? {} : { onDiagnostic: t31.onDiagnostic }, ...t31.onWarning === void 0 ? {} : { onWarning: t31.onWarning } }).load(e29.input, { signal: n39 });
  return n39.throwIfAborted(), s33;
}
async function we(e29, t31, r34, i36, a34) {
  return i36.visit({ async visit(i37) {
    let o34 = await e29.loadRaster({ rasterKey: r34.rasterKey, kind: i37.kind }, { signal: a34 });
    a34.throwIfAborted();
    try {
      let r35 = await i37.decode(e29, o34, a34);
      return A3(f({ backing: t31, format: i37, raster: o34, data: r35 }));
    } catch (e30) {
      throw o34.dispose(), e30;
    }
  } });
}
async function Te(e29, t31, r34, i36) {
  return r34.operation.visit({ async visit(a34, o34) {
    let s33 = s({ descriptor: r34.descriptor, extension: a34.extension, kind: a34.kind, version: a34.version });
    i36.throwIfAborted();
    let c30;
    try {
      c30 = await e29.loadRaster({ rasterKey: s33, kind: a34.kind }, { signal: i36 });
    } catch (t32) {
      if (!Le(t32)) throw t32;
      c30 = await Ee(e29, a34, o34, s33, i36);
    }
    i36.throwIfAborted();
    try {
      let r35 = await a34.decode(e29, c30, i36);
      return A3(f({ backing: t31, format: a34, raster: c30, data: r35 }));
    } catch (e30) {
      throw c30.dispose(), e30;
    }
  } });
}
async function Ee(e29, t31, n39, r34, i36) {
  let a34 = t31.runtimeBaker;
  if (a34 === void 0) throw new E6(`RASTER_NOT_FOUND`, `${t31.kind} has no baked artifact or runtime baker`);
  let o34 = n22(e29);
  if (o34.sourceBytes === void 0) throw new E6(`RASTER_SOURCE_UNAVAILABLE`, `${t31.kind} runtime generation requires retained source bytes`);
  let s33 = await a34();
  i36.throwIfAborted();
  let c30 = `default` in s33 ? s33.default : s33;
  Fe(t31, c30);
  let l29 = Object.assign({}, n39, { source: o34.sourceBytes.slice(), sourceFingerprint: o34.sourceFingerprint, font: e29, fontFaceIndex: o34.fontFaceIndex, rasterKey: r34, signal: i36 }), u28 = await c30.bake(l29);
  Ie(t31, r34, u28);
  let d24 = u28.artifacts.filter((e30) => e30.role === `raster`);
  if (d24.length !== 1) throw new E6(`INVALID_RASTER_ASSET`, `runtime raster generation must return one raster artifact`);
  let m24 = d24[0];
  if (m24.fingerprint !== t2(m24.bytes, e4.artifact)) throw new E6(`INVALID_RASTER_ASSET`, `runtime raster bytes do not match their stamped fingerprint`);
  return Re(e29)._attachGeneratedRaster(e29, m24.bytes, { rasterKey: r34, kind: u28.kind, extension: u28.extension, version: u28.version });
}
function A3(e29) {
  return { format: e29.format, acquire: () => p(e29), retain: () => h(e29), release: () => g(e29) };
}
function De(e29, t31, n39) {
  if (!Array.isArray(t31)) throw TypeError(`FontFace initial formats must be an array`);
  let r34 = t31.map((e30, t32) => Ne(e30, t32)), i36 = /* @__PURE__ */ new Set();
  for (let e30 of r34) {
    if (i36.has(e30.identity)) throw TypeError(`FontFace cannot repeat one raster format`);
    i36.add(e30.identity);
  }
  let a34 = Ae(e29), o34 = P2(a34.input, $e(n39.baseUrl));
  return { input: a34.input, ...a34.runtimeBake === void 0 ? {} : { runtimeBake: a34.runtimeBake }, ...a34.unicodeRanges === void 0 ? {} : { unicodeRanges: a34.unicodeRanges }, initialRasters: r34, key: `${L(o34)}:runtime:${ze(a34.runtimeBake ?? n39.runtimeBake)}:ranges:${a3(a34.unicodeRanges?.map(({ start: e30, end: t32 }) => ({ start: e30, end: t32 })) ?? null)}:font-face-source` };
}
function Oe(e29) {
  return { ...e29, input: ke(e29.input) };
}
function ke(e29) {
  let t31 = F2(e29), n39 = (e30) => H(e30) ? { bytes: B(e30.bytes, e30.ownership ?? `copy`), ownership: `transfer` } : e30;
  return t31.source === void 0 ? { baked: n39(t31.baked) } : { source: n39(t31.source), ...t31.baked === void 0 ? {} : { baked: t31.baked === null ? null : n39(t31.baked) } };
}
function Ae(e29) {
  if (q(e29) && Object.hasOwn(e29, `runtimeBake`)) {
    let t31 = e29.runtimeBake;
    if (!je(t31)) throw TypeError(`font request runtimeBake must be a function`);
    let n39 = V(e29.source, `input.source`);
    if (n39 === void 0) throw TypeError(`runtime-baked font request requires a source`);
    let r34 = e29.unicodeRanges === void 0 ? void 0 : Me(e29.unicodeRanges);
    return { input: { source: n39, baked: null }, runtimeBake: t31, ...r34 === void 0 ? {} : { unicodeRanges: r34 } };
  }
  return { input: Ze(e29) };
}
function je(e29) {
  return typeof e29 == `function`;
}
function Me(e29) {
  if (!Array.isArray(e29)) throw TypeError(`font selection requires Unicode ranges to be an array`);
  return t13(e29);
}
function Ne(e29, t31) {
  if (!o11(e29) && !c9(e29)) throw TypeError(`font request raster ${t31} must use a package-defined raster format`);
  let n39 = u6(e29), r34 = l6(e29);
  return { operation: n39, descriptor: r34, identity: `${n39.format.id}:${a3(r34)}` };
}
function Pe(e29, t31) {
  return { kind: e29.kind, extension: e29.extension, version: e29.version, rasterKey: s({ descriptor: t31, extension: e29.extension, kind: e29.kind, version: e29.version }), descriptor: t31 };
}
function Fe(e29, t31) {
  if (t31.kind !== e29.kind) throw new E6(`RASTER_INCOMPATIBLE`, `runtime baker kind mismatch`);
}
function Ie(e29, t31, n39) {
  if (n39.kind !== e29.kind || n39.extension !== e29.extension || n39.version !== e29.version || n39.rasterKey !== t31) throw new E6(`RASTER_INCOMPATIBLE`, `runtime raster artifact does not match the selected format`);
}
function Le(e29) {
  return e29 instanceof E6 && e29.reason === `RASTER_NOT_FOUND`;
}
function Re(e29) {
  return Ve(e29);
}
function ze(e29) {
  return e29 === void 0 ? `` : String(at(e29));
}
async function Be(e29) {
  return T6 ??= Promise.resolve().then(() => (init_runtime_bake(), runtime_bake_exports)).then(({ bakeFontInWorker: e30 }) => e30).catch((t31) => {
    throw T6 = void 0, new E6(`RUNTIME_BAKER_UNAVAILABLE`, `font source requires the dynamically imported runtime baker`, { url: e29, cause: t31 });
  }), T6;
}
function Ve(e29) {
  if (!(e29 instanceof j2)) throw new E6(`FOREIGN_FONT`, `font is not registered by this package`);
  return e29.assertActive(), e29.registry;
}
function Ue(e29, t31) {
  let n39 = n22(e29), r34 = n22(t31);
  n39.sourceBytes === void 0 && r34.sourceBytes !== void 0 && (n39.sourceBytes = r34.sourceBytes);
  for (let e30 of r34.sourceCandidates) n39.sourceCandidates.some((t32) => t32.sourceFingerprint === e30.sourceFingerprint && t32.sourceUrl === e30.sourceUrl && t32.fetch === e30.fetch) || n39.sourceCandidates.push(e30);
  for (let [t32, i36] of r34.rasterSources) {
    let r35 = n39.rasterSources.get(t32);
    if (r35.artifactBytes === void 0 && i36.artifactBytes !== void 0) {
      if (i36.artifactFingerprint === void 0 || i36.extensionData === void 0 || i36.binaryBytes === void 0 || i36.bufferViews === void 0) throw Error(`retained raster artifact data is incomplete`);
      r35.artifactBytes = i36.artifactBytes, r35.artifactFingerprint = i36.artifactFingerprint, r35.extensionData = i36.extensionData, r35.binaryBytes = i36.binaryBytes, r35.bufferViews = i36.bufferViews;
    }
    for (let e30 of i36.resourceIdentities) r35.resourceIdentities.add(e30);
    for (let e30 of i36.externalCandidates) r35.externalCandidates.some((t33) => lt(t33.source, e30.source) && t33.artifactUrl === e30.artifactUrl && t33.fetch === e30.fetch) || r35.externalCandidates.push(e30);
    let a34 = $(r35.resourceCandidates, i36.resourceCandidates);
    r35.resourceCandidates.splice(0, r35.resourceCandidates.length, ...a34);
    let o34 = e29.getRaster(t32);
    o34 instanceof M2 && o34.addResourceCandidates(i36.resourceCandidates);
  }
  for (let [e30, t32] of r34.resources) n39.resources.has(e30) || n39.resources.set(e30, t32);
}
function We(e29, t31) {
  return `${e29}:${t31}`;
}
function N2(e29, t31, n39, r34, i36, a34, o34, s33) {
  let c30 = n22(e29).rasterSources, l29 = c30.get(t31.rasterKey);
  if (l29 === void 0) {
    let e30 = { reference: Z(t31), extensionData: n39, binaryBytes: r34, bufferViews: i36, artifactBytes: a34, artifactFingerprint: o34, resourceIdentities: /* @__PURE__ */ new Set(), externalCandidates: [], resourceCandidates: $([], s33) };
    return c30.set(t31.rasterKey, e30), e30;
  }
  if (l29.reference.kind !== t31.kind || l29.reference.extension !== t31.extension || l29.reference.version !== t31.version || l29.artifactFingerprint !== void 0 && l29.artifactFingerprint !== o34) throw new E6(`RASTER_REFERENCE_CONFLICT`, `one raster identity resolved to conflicting artifact data`);
  return l29.extensionData ??= n39, l29.binaryBytes ??= r34, l29.bufferViews ??= i36, l29.artifactBytes ??= a34, l29.artifactFingerprint ??= o34, l29.resourceCandidates.splice(0, l29.resourceCandidates.length, ...$(l29.resourceCandidates, s33)), l29;
}
function Ge(e29, t31, n39, r34, i36, a34, o34) {
  let s33 = n22(e29), c30 = K(n39.extensions, `extensions`);
  for (let n40 of i36) {
    let i37 = s33.rasterSources.get(n40.rasterKey), l29 = n40.source.type === `embedded` ? X(c30[n40.extension], `extensions.${n40.extension}`) : void 0, u28 = l29 === void 0 ? void 0 : { ...a34 === void 0 ? {} : { artifactUrl: a34 }, ...o34 === void 0 ? {} : { fetch: o34 } }, d24 = n40.source.type === `external` ? { source: n40.source, ...a34 === void 0 ? {} : { artifactUrl: a34 }, ...o34 === void 0 ? {} : { fetch: o34 } } : void 0;
    if (i37 !== void 0) {
      if (i37.reference.kind !== n40.kind || i37.reference.extension !== n40.extension || i37.reference.version !== n40.version) throw new E6(`RASTER_REFERENCE_CONFLICT`, `one shaping identity declared conflicting raster references`);
      if (d24 !== void 0 && !i37.externalCandidates.some((e30) => lt(e30.source, d24.source) && e30.artifactUrl === d24.artifactUrl) && i37.externalCandidates.push(d24), l29 !== void 0 && i37.extensionData === void 0) s33.rasterSources.set(n40.rasterKey, { reference: Z(n40), extensionData: l29, binaryBytes: t31, bufferViews: r34, resourceIdentities: i37.resourceIdentities, externalCandidates: i37.externalCandidates, resourceCandidates: $(i37.resourceCandidates, u28 === void 0 ? [] : [u28]) });
      else if (u28 !== void 0) {
        i37.resourceCandidates.splice(0, i37.resourceCandidates.length, ...$(i37.resourceCandidates, [u28]));
        let t32 = e29.getRaster(n40.rasterKey);
        t32 instanceof M2 && t32.addResourceCandidates([u28]);
      }
      continue;
    }
    s33.rasterSources.set(n40.rasterKey, { reference: Z(n40), ...l29 === void 0 ? {} : { extensionData: l29 }, ...l29 === void 0 ? {} : { binaryBytes: t31, bufferViews: r34 }, resourceIdentities: /* @__PURE__ */ new Set(), externalCandidates: d24 === void 0 ? [] : [d24], resourceCandidates: u28 === void 0 ? [] : [u28] });
  }
}
function Ke(e29, t31, n39) {
  let r34 = n22(e29);
  t31 === r34.sourceFingerprint && n39.sourceBytes !== void 0 && r34.sourceBytes === void 0 && (r34.sourceBytes = n39.sourceBytes), n39.sourceUrl !== void 0 && !r34.sourceCandidates.some((e30) => e30.sourceFingerprint === t31 && e30.sourceUrl === n39.sourceUrl) && r34.sourceCandidates.push({ sourceFingerprint: t31, sourceUrl: n39.sourceUrl, ...n39.fetch === void 0 ? {} : { fetch: n39.fetch } });
}
function qe(e29, t31) {
  let n39 = K(t31.extensions, `extensions`), r34 = [];
  for (let t32 of n22(e29).rasterSources.values()) {
    let i36 = n39[t32.reference.extension];
    i36 !== void 0 && K(i36, t32.reference.extension).fingerprint === c2({ glyphCount: e29.glyphCount, glyphIdWidth: 16, kind: t32.reference.kind, rasterKey: t32.reference.rasterKey, shaping: e29.shapingFingerprint, source: e29.sourceFingerprint, version: t32.reference.version }) && r34.push({ reference: t32.reference, extensionData: X(i36, t32.reference.extension) });
  }
  if (r34.length !== 1) throw new E6(`RASTER_RECIPROCAL_IDENTITY`, `raster artifact must match exactly one font directory reference`);
  return r34[0];
}
function Je(e29, t31, n39) {
  let r34 = K(K(t31.extensions, `extensions`)[n39.extension], n39.extension), i36 = c2({ glyphCount: e29.glyphCount, glyphIdWidth: 16, kind: n39.kind, rasterKey: n39.rasterKey, shaping: e29.shapingFingerprint, source: e29.sourceFingerprint, version: n39.version });
  if (r34.fingerprint !== i36) throw new E6(`RASTER_RECIPROCAL_IDENTITY`, `runtime raster fingerprint ${String(r34.fingerprint)} does not match this font's ${i36}; rebake this font's rasters`);
  return X(r34, n39.extension);
}
function Ye(e29) {
  if (!Array.isArray(e29)) throw TypeError(`PMNDRS_font.rasters must be an array`);
  return e29.map((e30, t31) => {
    let n39 = K(e30, `rasters[${t31}]`), r34 = Xe(K(n39.source, `rasters[${t31}].source`), `rasters[${t31}].source`);
    return { rasterKey: Y(n39.rasterKey, `rasters[${t31}].rasterKey`), kind: Y(n39.kind, `rasters[${t31}].kind`), extension: Y(n39.extension, `rasters[${t31}].extension`), version: J(n39.version, `rasters[${t31}].version`), source: r34 };
  });
}
function Xe(e29, t31) {
  return e29.type === `embedded` ? { type: `embedded` } : e29.uri === void 0 ? { type: `external` } : { type: `external`, uri: Y(e29.uri, `${t31}.uri`) };
}
function P2(e29, t31) {
  let n39 = F2(e29);
  if (n39.source === void 0) return H(n39.baked) ? { bakedBytes: n39.baked } : { bakedUrl: I2(n39.baked, t31) };
  if (H(n39.source)) return n39.baked === void 0 || n39.baked === null ? { sourceBytes: n39.source } : H(n39.baked) ? { sourceBytes: n39.source, bakedBytes: n39.baked } : { sourceBytes: n39.source, bakedUrl: I2(n39.baked, t31) };
  let r34 = I2(n39.source, t31), i36 = new URL(r34);
  return n39.baked === null ? { sourceUrl: r34 } : n39.baked === void 0 ? /\.glb$/i.test(i36.pathname) ? { bakedUrl: r34 } : et(i36) ? (i36.pathname = /\.(?:ttf|otf|woff2?)$/i.test(i36.pathname) ? i36.pathname.replace(/\.(?:ttf|otf|woff2?)$/i, `.font.glb`) : `${i36.pathname}.font.glb`, i36.hash = ``, { sourceUrl: r34, bakedUrl: i36.href }) : { sourceUrl: r34 } : H(n39.baked) ? { sourceUrl: r34, bakedBytes: n39.baked } : { sourceUrl: r34, bakedUrl: I2(n39.baked, t31) };
}
function F2(e29) {
  if (typeof e29 == `string` || e29 instanceof URL) return { source: e29 };
  if (typeof e29 != `object` || !e29) throw new E6(`INVALID_FONT_INPUT`, `font input must be a URL or source object`);
  let t31 = V(Reflect.get(e29, `source`), `source`), n39 = Reflect.get(e29, `baked`), r34 = n39 === null ? null : V(n39, `baked`);
  if (t31 === void 0 && r34 == null) throw new E6(`INVALID_FONT_INPUT`, `font input must provide source or baked`);
  return { ...t31 === void 0 ? {} : { source: t31 }, ...r34 === void 0 ? {} : { baked: r34 } };
}
function Ze(e29) {
  let t31 = F2(e29);
  return t31.source === void 0 ? { baked: t31.baked } : t31.baked === void 0 ? { source: t31.source } : { source: t31.source, baked: t31.baked };
}
function I2(e29, t31) {
  let n39;
  try {
    n39 = e29 instanceof URL ? new URL(e29.href) : new URL(e29, t31);
  } catch (e30) {
    throw new E6(`INVALID_FONT_URL`, `font URL cannot be resolved`, { cause: e30 });
  }
  return n39.hash = ``, n39.href;
}
function Qe(e29, t31 = Date.now()) {
  let n39 = e29.headers.get(`cache-control`)?.toLowerCase();
  if (n39 !== void 0) {
    let r35 = n39.split(`,`).map((e30) => e30.trim());
    if (r35.includes(`no-store`) || r35.includes(`no-cache`)) return;
    let i36 = r35.map((e30) => /^max-age=(?:"(\d+)"|(\d+))$/.exec(e30)).find((e30) => e30 !== null);
    if (i36 !== void 0) {
      let n40 = Number(i36[1] ?? i36[2]);
      if (!Number.isSafeInteger(n40) || n40 <= 0) return;
      let r36 = Date.parse(e29.headers.get(`date`) ?? ``), a34 = (Number.isFinite(r36) ? r36 : t31) + n40 * 1e3;
      return Number.isSafeInteger(a34) && a34 > t31 ? a34 : void 0;
    }
  }
  let r34 = Date.parse(e29.headers.get(`expires`) ?? ``);
  return Number.isFinite(r34) && r34 > t31 ? r34 : void 0;
}
function $e(e29) {
  if (e29 !== void 0) return new URL(e29);
  let t31 = globalThis.location?.href;
  return t31 === void 0 ? void 0 : new URL(t31);
}
function L(e29) {
  return `font:0:${e13}:${e29.sourceUrl ?? it(e29.sourceBytes)}:${e29.bakedUrl ?? it(e29.bakedBytes)}`;
}
function et(e29) {
  return e29.protocol !== `data:` && e29.protocol !== `blob:`;
}
function tt() {
  return globalThis.process?.env?.NODE_ENV !== `production`;
}
function nt(e29, t31) {
  return t31?.throwIfAborted(), e29.consumers += 1, new Promise((n39, r34) => {
    let i36 = true, a34 = () => {
      i36 && (i36 = false, t31?.removeEventListener(`abort`, o34), --e29.consumers, e29.consumers === 0 && !e29.settled && e29.controller.abort(z(t31)));
    }, o34 = () => {
      a34(), r34(z(t31));
    };
    t31?.addEventListener(`abort`, o34, { once: true }), e29.promise.then((e30) => {
      i36 && (a34(), n39(e30));
    }, (e30) => {
      i36 && (a34(), r34(e30));
    });
  });
}
async function R(e29, t31, n39, r34, i36) {
  i36?.throwIfAborted();
  let a34 = e29.headers.get(`content-length`), o34 = a34 === null ? void 0 : Number(a34);
  if (o34 !== void 0 && Number.isFinite(o34) && o34 > t31) throw await e29.body?.cancel(), new E6(n39, `response declares ${o34} bytes; limit is ${t31}`, { url: r34 });
  if (e29.body === null) {
    let a35 = new Uint8Array(await e29.arrayBuffer());
    if (i36?.throwIfAborted(), a35.byteLength > t31) throw new E6(n39, `response has ${a35.byteLength} bytes; limit is ${t31}`, { url: r34 });
    return a35;
  }
  let s33 = e29.body.getReader(), c30 = [], l29 = 0, u28 = () => {
    s33.cancel(z(i36));
  };
  i36?.addEventListener(`abort`, u28, { once: true });
  try {
    for (; ; ) {
      let e30 = await s33.read();
      if (e30.done) break;
      let i37 = e30.value;
      if (!Number.isSafeInteger(l29 + i37.byteLength) || l29 + i37.byteLength > t31) throw await s33.cancel(), new E6(n39, `response exceeds the ${t31}-byte resource limit`, { url: r34 });
      c30.push(i37), l29 += i37.byteLength;
    }
  } finally {
    i36?.removeEventListener(`abort`, u28), s33.releaseLock();
  }
  i36?.throwIfAborted();
  let d24 = new Uint8Array(l29), f26 = 0;
  for (let e30 of c30) d24.set(e30, f26), f26 += e30.byteLength;
  return d24;
}
function z(e29) {
  return e29?.reason ?? new DOMException(`The operation was aborted`, `AbortError`);
}
function rt(e29) {
  return new Uint8Array(e29.buffer, e29.byteOffset, e29.byteLength).slice();
}
function B(e29, t31) {
  if (!ArrayBuffer.isView(e29)) throw TypeError(`font bytes must be an ArrayBuffer view`);
  if (e29.byteLength === 0) throw TypeError(`font bytes must not be empty or detached`);
  if (t31 === `copy`) return rt(e29);
  if (t31 === `adopt`) {
    if (!(e29.buffer instanceof ArrayBuffer)) throw TypeError(`internally adopted font bytes need an ArrayBuffer`);
    if (e29.byteOffset !== 0 || e29.byteLength !== e29.buffer.byteLength) throw TypeError(`internally adopted font bytes must span their complete ArrayBuffer`);
    return new Uint8Array(e29.buffer);
  }
  if (t31 !== `transfer`) throw TypeError(`font byte ownership must be copy or transfer`);
  if (!(e29.buffer instanceof ArrayBuffer)) throw TypeError(`transferred font bytes cannot use SharedArrayBuffer`);
  if (e29.byteOffset !== 0 || e29.byteLength !== e29.buffer.byteLength) throw TypeError(`transferred font bytes must span their complete ArrayBuffer`);
  let n39 = structuredClone(e29.buffer, { transfer: [e29.buffer] });
  return new Uint8Array(n39);
}
function V(e29, t31) {
  if (e29 === void 0 || typeof e29 == `string` || e29 instanceof URL) return e29;
  if (!q(e29) || !Object.hasOwn(e29, `bytes`)) throw TypeError(`${t31} must be a URL or explicit font byte input`);
  let n39 = e29.bytes;
  if (!ArrayBuffer.isView(n39)) throw TypeError(`${t31}.bytes must be an ArrayBuffer view`);
  if (n39.byteLength === 0) throw TypeError(`${t31}.bytes must not be empty or detached`);
  let r34 = e29.ownership;
  if (r34 !== void 0 && r34 !== `copy` && r34 !== `transfer`) throw TypeError(`${t31}.ownership must be copy or transfer`);
  if (r34 === `transfer`) {
    if (!(n39.buffer instanceof ArrayBuffer)) throw TypeError(`${t31} transfer bytes cannot use SharedArrayBuffer`);
    if (n39.byteLength === 0 || n39.byteOffset !== 0 || n39.byteLength !== n39.buffer.byteLength) throw TypeError(`${t31} transfer bytes must be a non-empty view spanning its complete ArrayBuffer`);
  }
  return r34 === void 0 ? { bytes: n39 } : { bytes: n39, ownership: r34 };
}
function H(e29) {
  return q(e29) && Object.hasOwn(e29, `bytes`);
}
function it(e29) {
  return e29 === void 0 ? `` : `bytes:${at(e29.bytes.buffer)}:${e29.bytes.byteOffset}:${e29.bytes.byteLength}:${e29.ownership ?? `copy`}`;
}
function U(e29) {
  if (!q(e29)) throw TypeError(`font load options must be an object`);
  if (Object.keys(e29).some((e30) => e30 !== `signal`)) throw TypeError(`font load options only accept signal`);
  let t31 = e29.signal;
  if (t31 !== void 0 && !(t31 instanceof AbortSignal)) throw TypeError(`font load signal must be an AbortSignal`);
  return t31;
}
function at(e29) {
  let t31 = oe.get(e29);
  return t31 === void 0 && (t31 = ae++, oe.set(e29, t31)), t31;
}
function W(e29, t31, n39) {
  let r34 = e29 ?? t31;
  if (!Number.isSafeInteger(r34) || r34 <= 0) throw RangeError(`${n39} must be a positive safe integer`);
  return r34;
}
function G(e29, t31, n39) {
  return n39 instanceof E6 ? n39 : new E6(e29, t31, { cause: n39 });
}
function ot(e29, t31) {
  let n39 = e29, r34 = /* @__PURE__ */ new Set();
  for (; q(n39) && !r34.has(n39); ) {
    if (r34.add(n39), Array.isArray(n39.issues) && n39.issues.some((e30) => q(e30) && e30.code === t31)) return true;
    n39 = n39.cause;
  }
  return false;
}
function K(e29, t31) {
  return st(e29, t31), e29;
}
function st(e29, t31) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`${t31} must be an object`);
}
function q(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function J(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29)) throw TypeError(`${t31} must be a safe integer`);
  return e29;
}
function Y(e29, t31) {
  if (typeof e29 != `string`) throw TypeError(`${t31} must be a string`);
  return e29;
}
function X(e29, t31) {
  if (e29 === null || typeof e29 == `boolean` || typeof e29 == `string` || typeof e29 == `number` && Number.isFinite(e29)) return e29;
  if (Array.isArray(e29)) return e29.map((e30, n40) => X(e30, `${t31}[${n40}]`));
  let n39 = K(e29, t31);
  return Object.fromEntries(Object.entries(n39).map(([e30, n40]) => [e30, X(n40, `${t31}.${e30}`)]));
}
function ct(e29) {
  if (typeof e29 != `object` || !e29) return e29;
  for (let t31 of Array.isArray(e29) ? e29 : Object.values(e29)) ct(t31);
  return Object.freeze(e29);
}
function Z(e29) {
  let t31 = structuredClone(e29);
  return Object.freeze(t31.source), Object.freeze(t31);
}
function lt(e29, t31) {
  return e29.uri === t31.uri;
}
function Q(e29, t31) {
  return $(e29, t31 === void 0 ? [] : [{ resolveResource: t31 }]);
}
function $(e29, t31) {
  let n39 = [...e29];
  for (let e30 of t31) n39.some((t32) => t32.artifactUrl === e30.artifactUrl && t32.fetch === e30.fetch && t32.resolveResource === e30.resolveResource) || n39.push(e30);
  return n39;
}
function ut(e29) {
  let t31 = e29.fontFaceIndex, n39 = t31 === void 0 ? 0 : J(t31, `provenance.fontFaceIndex`);
  if (n39 < 0 || n39 > 4294967295) throw new E6(`INVALID_FONT_ASSET`, `provenance.fontFaceIndex must be an unsigned 32-bit integer`);
  return n39;
}
function dt(e29, t31) {
  let n39 = n22(e29);
  if (e29.glyphCount !== t31.extension.metrics.glyphCount || n39.shapingSfnt.byteLength !== t31.shapingSfnt.byteLength || n39.glyphExtents.byteLength !== t31.glyphExtents.byteLength || n39.glyphExtentsAvailability.byteLength !== t31.glyphExtentsAvailability.byteLength) throw new E6(`INVALID_FONT_ASSET`, `font shaping fingerprint contradicts its declared payload shape`);
}
var ne, re, ie, ae, T6, oe, E6, D4, se, O4, pe, xe, Se, j2, M2;
var init_loader = __esm({
  "node_modules/@pmndrs/glyph/dist/loader.js"() {
    init_loaded_font();
    init_raster_format_registry();
    init_glyph_error();
    init_fingerprint();
    init_raster_identity();
    init_contract();
    init_glb_reader();
    init_font_artifact_reader();
    init_registered_font();
    init_font_selection();
    init_runtime_bake_protocol();
    ne = 1;
    re = 1;
    ie = 1;
    ae = 1;
    oe = /* @__PURE__ */ new WeakMap();
    E6 = class extends e3 {
      reason;
      url;
      constructor(e29, t31, n39 = {}) {
        super(`resource-unavailable`, t31, n39.cause === void 0 ? void 0 : { cause: n39.cause }), this.name = `GlyphFontError`, this.reason = e29, this.url = n39.url;
      }
    };
    D4 = class {
      #e;
      #t;
      #n;
      #r;
      #i = /* @__PURE__ */ new Map();
      #a = /* @__PURE__ */ new Map();
      #o = /* @__PURE__ */ new Map();
      #s = /* @__PURE__ */ new Set();
      constructor(e29 = {}) {
        this.#e = ne++, this.#t = W(e29.maxArtifactBytes, 67108864, `maxArtifactBytes`), this.#n = W(e29.maxBufferViews, 4096, `maxBufferViews`), this.#r = W(e29.maxRasters, 256, `maxRasters`);
      }
      async registerAsset(e29) {
        return this._registerAsset(e29);
      }
      get(e29) {
        return this.#i.get(e29);
      }
      getByHandle(e29) {
        return this.#o.get(e29);
      }
      async _registerAsset(e29, t31 = {}, n39 = `copy`) {
        this.#l(e29.byteLength);
        let r34 = B(e29, n39), i36 = t2(r34, e4.artifact), a34;
        try {
          a34 = i19(r34);
        } catch (e30) {
          throw G(`INVALID_FONT_ASSET`, `font artifact could not be read`, e30);
        }
        let { parsed: o34, extension: s33, bufferViews: c30 } = a34, l29 = o34.document, u28 = s33.metrics, d24 = s33.provenance, h24 = Y(d24.sourceFingerprint, `provenance.sourceFingerprint`);
        if (!n2(h24)) throw new E6(`INVALID_FONT_ASSET`, `provenance.sourceFingerprint must be lowercase 128-bit hexadecimal`);
        let g23 = ut(d24), _20 = Ye(s33.rasters), v22 = o34.bin.subarray(0, o34.declaredBinLength);
        if (c30.length > this.#n) throw new E6(`FONT_RESOURCE_LIMIT`, `font artifact has ${c30.length} buffer views; limit is ${this.#n}`);
        if (_20.length > this.#r) throw new E6(`FONT_RESOURCE_LIMIT`, `font artifact has ${_20.length} raster references; limit is ${this.#r}`);
        let y22 = a34.shapingFingerprint, b20 = this.#a.get(y22);
        if (b20 !== void 0) return b20.assertActive(), dt(b20, a34), Ge(b20, v22, l29, c30, _20, t31.artifactUrl, t31.fetch), Ke(b20, h24, t31), b20;
        let x19 = re++, S17 = `font:${this.#e}:${x19}:${y22}`, C17 = x19, w15 = new j2({ registry: this, key: S17, handle: C17, sourceFingerprint: h24, shapingFingerprint: y22, glyphCount: J(u28.glyphCount, `metrics.glyphCount`), metrics: { unitsPerEm: J(u28.unitsPerEm, `metrics.unitsPerEm`), ascender: J(u28.ascender, `metrics.ascender`), descender: J(u28.descender, `metrics.descender`), lineGap: J(u28.lineGap, `metrics.lineGap`), underlinePosition: J(u28.underlinePosition, `metrics.underlinePosition`), underlineThickness: J(u28.underlineThickness, `metrics.underlineThickness`), strikeoutPosition: J(u28.strikeoutPosition, `metrics.strikeoutPosition`), strikeoutSize: J(u28.strikeoutSize, `metrics.strikeoutSize`) } }), ne2 = /* @__PURE__ */ new Map();
        return t12(w15, { artifactBytes: r34, artifactFingerprint: i36, fontFaceIndex: g23, sourceFingerprint: h24, ...t31.sourceBytes === void 0 ? {} : { sourceBytes: t31.sourceBytes }, sourceCandidates: t31.sourceUrl === void 0 ? [] : [{ sourceFingerprint: h24, sourceUrl: t31.sourceUrl, ...t31.fetch === void 0 ? {} : { fetch: t31.fetch } }], shapingSfnt: a34.shapingSfnt, glyphExtents: a34.glyphExtents, glyphExtentsAvailability: a34.glyphExtentsAvailability, rasterSources: ne2, resources: /* @__PURE__ */ new Map(), unicodeVersion: Y(d24.unicodeVersion, `provenance.unicodeVersion`) }), Ge(w15, v22, l29, c30, _20, t31.artifactUrl, t31.fetch), this.#i.set(S17, w15), this.#a.set(y22, w15), this.#o.set(C17, w15), w15;
      }
      async attachRaster(e29, t31, n39 = {}) {
        let r34;
        if (n39.baseUrl !== void 0) try {
          r34 = new URL(n39.baseUrl).href;
        } catch (e30) {
          throw new E6(`INVALID_RASTER_BASE_URL`, `raster base URL is invalid`, { cause: e30 });
        }
        return this._attachRaster(e29, t31, { ...r34 === void 0 ? {} : { artifactUrl: r34 }, ...n39.fetch === void 0 ? {} : { fetch: n39.fetch }, ...n39.resolveResource === void 0 ? {} : { resolveResource: n39.resolveResource } });
      }
      async _attachRaster(e29, t31, n39 = {}, r34 = `copy`) {
        let i36 = this.#c(e29);
        this.#l(t31.byteLength);
        let a34 = B(t31, r34), o34, s33;
        try {
          o34 = r20(a34), s33 = a20(o34);
        } catch (e30) {
          throw G(`INVALID_RASTER_ASSET`, `raster artifact could not be read`, e30);
        }
        if (s33.length > this.#n) throw new E6(`FONT_RESOURCE_LIMIT`, `raster artifact has ${s33.length} buffer views; limit is ${this.#n}`);
        let c30 = qe(i36, o34.document), l29 = t2(a34, e4.artifact), u28 = N2(i36, c30.reference, c30.extensionData, o34.bin.subarray(0, o34.declaredBinLength), s33, a34, l29, [n39]);
        return i36.registerRaster(u28.reference, u28.extensionData, u28.binaryBytes, u28.bufferViews, u28.resourceCandidates);
      }
      async _attachGeneratedRaster(e29, t31, n39) {
        let r34 = this.#c(e29);
        this.#l(t31.byteLength);
        let i36 = rt(t31), a34, o34;
        try {
          a34 = r20(i36), o34 = a20(a34);
        } catch (e30) {
          throw G(`INVALID_RASTER_ASSET`, `raster artifact could not be read`, e30);
        }
        if (o34.length > this.#n) throw new E6(`FONT_RESOURCE_LIMIT`, `raster artifact has ${o34.length} buffer views; limit is ${this.#n}`);
        let s33 = { ...n39, source: { type: `external` } }, c30 = N2(r34, s33, Je(r34, a34.document, s33), a34.bin.subarray(0, a34.declaredBinLength), o34, i36, t2(i36, e4.artifact), []);
        return r34.registerRaster(c30.reference, c30.extensionData, c30.binaryBytes, c30.bufferViews, c30.resourceCandidates);
      }
      _disposeFont(e29) {
        if (this.#i.get(e29.key) === e29) {
          this.#i.delete(e29.key), this.#a.delete(e29.shapingFingerprint), this.#o.delete(e29.handle);
          for (let t31 of this.#s) t31(e29);
          r22(e29);
        }
      }
      _onFontDispose(e29) {
        return this.#s.add(e29), () => this.#s.delete(e29);
      }
      _artifactByteLimit() {
        return this.#t;
      }
      #c(e29) {
        if (!(e29 instanceof j2) || e29.registry !== this) throw new E6(`FOREIGN_FONT`, `font is not owned by this registry`);
        return e29.assertActive(), e29;
      }
      #l(e29) {
        if (e29 > this.#t) throw new E6(`FONT_RESOURCE_LIMIT`, `artifact has ${e29} bytes; limit is ${this.#t}`);
      }
    };
    se = class {
      registry;
      #e;
      #t;
      #n;
      #r;
      #i;
      #a;
      #o;
      #s = /* @__PURE__ */ new Map();
      #c = /* @__PURE__ */ new Set();
      constructor(e29 = {}) {
        this.registry = e29.registry ?? new D4();
        let t31 = e29.fetch ?? globalThis.fetch;
        if (typeof t31 != `function`) throw TypeError(`FontLoader requires a fetch implementation`);
        this.#e = (...e30) => t31(...e30), this.#t = $e(e29.baseUrl), this.#n = e29.development ?? tt(), this.#r = e29.runtimeBake, this.#i = e29.runtimeSourceIdentity ?? `original`, this.#a = e29.onDiagnostic, this.#o = e29.onWarning;
      }
      load(e29, t31 = {}) {
        t31.signal?.throwIfAborted();
        let n39 = P2(e29, this.#t), r34 = L(n39), i36 = this.#l(n39, r34);
        return nt(i36, t31.signal).then((e30) => this.registry.get(e30.key) === e30 ? e30 : (this.#s.get(r34) === i36 && this.#s.delete(r34), nt(this.#l(n39, r34), t31.signal)));
      }
      _peek(e29) {
        let t31 = L(P2(e29, this.#t)), n39 = this.#s.get(t31), r34 = n39?.value;
        if (r34 !== void 0) {
          if (this.registry.get(r34.key) === r34) return r34;
          this.#s.get(t31) === n39 && this.#s.delete(t31);
        }
      }
      #l(e29, t31) {
        let n39 = this.#s.get(t31);
        if (n39?.controller.signal.aborted === true && (this.#s.delete(t31), n39 = void 0), n39 === void 0) {
          let r34 = new AbortController(), i36;
          i36 = { controller: r34, value: void 0, consumers: 0, settled: false, promise: this.#u(e29, r34.signal).then((e30) => (i36.settled = true, i36.value = e30, e30), (e30) => {
            throw i36.settled = true, this.#s.get(t31) === i36 && this.#s.delete(t31), e30;
          }) }, n39 = i36, this.#s.set(t31, n39);
        }
        return n39;
      }
      attachRaster(e29, t31) {
        return this.registry.attachRaster(e29, t31);
      }
      async #u(e29, t31) {
        if (e29.bakedBytes !== void 0) return t31.throwIfAborted(), this.registry._registerAsset(e29.bakedBytes.bytes, {}, e29.bakedBytes.ownership ?? `copy`);
        if (e29.bakedUrl !== void 0) {
          let n40 = await this.#d(e29.bakedUrl, t31, e29.sourceUrl);
          if (n40.status === `hit`) return n40.font;
          if (e29.sourceUrl === void 0) throw n40.status === `missing` ? new E6(`BAKED_FONT_MISSING`, `baked-only font asset was not found`, { url: e29.bakedUrl }) : n40.error;
          n40.status === `missing` ? this.#p(e29.bakedUrl) : this.#m(n40.error);
        }
        if (e29.sourceUrl === void 0 && e29.sourceBytes === void 0) throw new E6(`INVALID_FONT_INPUT`, `font request has no source or baked asset`);
        let n39 = e29.sourceUrl ?? `memory://font-source`, r34 = this.#r ?? await Be(n39);
        t31.throwIfAborted();
        let i36 = e29.sourceBytes === void 0 ? await this.#f(e29.sourceUrl, `FONT_SOURCE_FETCH`, t31) : { bytes: B(e29.sourceBytes.bytes, e29.sourceBytes.ownership ?? `copy`), expiresAt: void 0 }, { bytes: a34 } = i36, o34 = await r34({ source: a34, sourceUrl: n39, ...e29.bakedUrl === void 0 ? {} : { bakedUrl: e29.bakedUrl }, ...i36.expiresAt === void 0 ? {} : { cache: { expiresAt: i36.expiresAt } }, signal: t31 });
        return t31.throwIfAborted(), this.registry._registerAsset(o34, { ...e29.bakedUrl === void 0 ? {} : { artifactUrl: e29.bakedUrl }, ...e29.sourceUrl === void 0 ? {} : { sourceUrl: e29.sourceUrl }, ...this.#i === `original` ? { sourceBytes: a34 } : {}, fetch: this.#e });
      }
      async #d(e29, t31, n39) {
        let r34;
        try {
          r34 = await this.#e(e29, { signal: t31 });
        } catch (n40) {
          return t31.throwIfAborted(), { status: `invalid`, error: new E6(`BAKED_FONT_FETCH`, `baked font request failed`, { url: e29, cause: n40 }) };
        }
        if (r34.status === 404 || r34.status === 410) return { status: `missing` };
        if (!r34.ok) return { status: `invalid`, error: new E6(`BAKED_FONT_FETCH`, `baked font request failed with HTTP ${r34.status}`, { url: e29 }) };
        try {
          let i36 = await R(r34, this.registry._artifactByteLimit(), `FONT_RESOURCE_LIMIT`, e29, t31);
          return t31.throwIfAborted(), { status: `hit`, font: await this.registry._registerAsset(i36, { artifactUrl: e29, ...n39 === void 0 ? {} : { sourceUrl: n39 }, fetch: this.#e }, `adopt`) };
        } catch (n40) {
          t31.throwIfAborted();
          let r35 = ot(n40, `FONT_VERSION_INCOMPATIBLE`), i36 = n40 instanceof E6 && n40.reason === `FONT_RESOURCE_LIMIT`;
          return { status: `invalid`, error: new E6(r35 ? `BAKED_FONT_INCOMPATIBLE` : i36 ? `BAKED_FONT_RESOURCE_LIMIT` : `BAKED_FONT_INVALID`, r35 ? `baked font asset uses an incompatible version contract` : i36 ? `baked font asset exceeds a configured resource limit` : `baked font asset is invalid`, { url: e29, cause: n40 }) };
        }
      }
      async #f(e29, t31, n39) {
        let r34;
        try {
          r34 = await this.#e(e29, { signal: n39 });
        } catch (r35) {
          throw n39.throwIfAborted(), new E6(t31, `font source request failed`, { url: e29, cause: r35 });
        }
        if (!r34.ok) throw new E6(t31, `font source request failed with HTTP ${r34.status}`, { url: e29 });
        let i36 = await R(r34, this.registry._artifactByteLimit(), `FONT_SOURCE_RESOURCE_LIMIT`, e29, n39), a34 = Qe(r34);
        return { bytes: i36, ...a34 === void 0 ? {} : { expiresAt: a34 } };
      }
      #p(e29) {
        if (!this.#n || this.#c.has(e29)) return;
        this.#c.add(e29);
        let t31 = { code: `BAKED_FONT_MISSING`, message: `No baked font asset was found at ${e29}; using the runtime baker.`, url: e29 };
        this.#o === void 0 ? console.warn(t31.message) : this.#o(t31);
      }
      #m(e29) {
        this.#a?.({ code: e29.reason, message: e29.message, ...e29.url === void 0 ? {} : { url: e29.url }, ...e29.cause === void 0 ? {} : { cause: e29.cause } });
      }
    };
    O4 = class {
      #e;
      #t = /* @__PURE__ */ new Map();
      #n = /* @__PURE__ */ new Map();
      #r = false;
      constructor(e29) {
        this.#e = { ...e29.fetch === void 0 ? {} : { fetch: e29.fetch }, ...e29.baseUrl === void 0 ? {} : { baseUrl: e29.baseUrl }, ...e29.development === void 0 ? {} : { development: e29.development }, ...e29.runtimeBake === void 0 ? {} : { runtimeBake: e29.runtimeBake }, ...e29.onDiagnostic === void 0 ? {} : { onDiagnostic: e29.onDiagnostic }, ...e29.onWarning === void 0 ? {} : { onWarning: e29.onWarning }, ...e29.maxArtifactBytes === void 0 ? {} : { maxArtifactBytes: e29.maxArtifactBytes }, ...e29.maxBufferViews === void 0 ? {} : { maxBufferViews: e29.maxBufferViews }, ...e29.maxRasters === void 0 ? {} : { maxRasters: e29.maxRasters } };
      }
      get disposed() {
        return this.#r;
      }
      loadFont(e29, t31, n39) {
        this.#i();
        let r34 = ce(e29, t31, n39);
        return he(this, r34);
      }
      openFontFaceSource(e29, t31, n39 = {}) {
        this.#i();
        let r34 = U(n39);
        r34?.throwIfAborted();
        let i36 = De(e29, t31, this.#e), a34 = this.#t.get(i36.key);
        if (a34 === void 0 || a34.controller.signal.aborted) {
          let e30 = Oe(i36), t32 = ye((t33) => this.#a(e30, t33));
          a34 = t32, this.#t.set(i36.key, t32), t32.promise.catch(() => {
            this.#t.get(i36.key) === t32 && this.#t.delete(i36.key);
          });
        }
        return be(a34, r34);
      }
      async openSerializedFontFaceSource(e29, t31 = {}) {
        this.#i();
        let n39 = U(t31);
        n39?.throwIfAborted();
        let r34 = this.#n.get(e29.artifactFingerprint);
        if (r34 !== void 0 && r34.contains(e29)) return r34.acquire();
        let { loadSerializedFontFaceSource: i36 } = await Promise.resolve().then(() => (init_font_face_transfer_runtime(), font_face_transfer_runtime_exports)), a34 = await i36(e29, this.#e, n39);
        try {
          return n39?.throwIfAborted(), this.#i(), this.#o(a34).acquire();
        } catch (e30) {
          throw a34.dispose(), e30;
        }
      }
      dispose() {
        if (!this.#r) {
          this.#r = true;
          for (let e29 of this.#t.values()) e29.controller.abort(new E6(`FONT_LIBRARY_DISPOSED`, `font library was disposed`)), e29.value?.dispose();
          this.#t.clear(), this.#n.clear();
        }
      }
      #i() {
        if (this.#r) throw new E6(`FONT_LIBRARY_DISPOSED`, `font library has been disposed`);
      }
      async #a(e29, t31) {
        let n39 = await Ce(e29, this.#e, t31);
        return t31.throwIfAborted(), this.#o(n39);
      }
      #o(e29) {
        let t31 = n22(e29).artifactFingerprint, n39 = this.#n.get(t31);
        if (n39 !== void 0) return n39.mergeAcquisition(e29), e29.dispose(), n39;
        let r34;
        return r34 = new xe(e29, () => {
          this.#n.get(t31) === r34 && this.#n.delete(t31);
          for (let [e30, t32] of this.#t) t32.value === r34 && this.#t.delete(e30);
        }), this.#n.set(t31, r34), r34;
      }
    };
    pe = new O4({});
    xe = class {
      formats;
      #e;
      #t;
      #n;
      #r = /* @__PURE__ */ new Map();
      #i = new AbortController();
      #a;
      #o = 0;
      #s = false;
      constructor(t31, n39) {
        this.#e = t31, this.#t = d(t31), this.#n = Object.freeze([...t31.rasterReferences]), this.formats = Object.freeze([...new Set(this.#n.map(({ kind: e29 }) => e29))]), this.#a = n39;
      }
      get leaseCount() {
        return this.#o;
      }
      mergeAcquisition(e29) {
        this.#d(), Ue(this.#e, e29);
      }
      contains(e29) {
        this.#d();
        let t31 = n22(this.#e);
        if (t31.artifactFingerprint !== e29.artifactFingerprint) return false;
        for (let n39 of e29.rasters) {
          let e30 = t31.rasterSources.get(n39.rasterKey);
          if (e30 === void 0 || e30.reference.kind !== n39.kind || e30.reference.extension !== n39.extension || e30.reference.version !== n39.version || n39.data !== void 0 && e30.artifactFingerprint !== n39.artifactFingerprint || e30.reference.source.type === `external` && e30.artifactBytes === void 0) return false;
        }
        for (let n39 of e29.resources) if (!t31.resources.has(We(n39.artifactFingerprint, n39.byteLength))) return false;
        return true;
      }
      acquire() {
        return this.#d(), this.#o += 1, new Se(this);
      }
      load(e29) {
        this.#d();
        let t31 = Ne(e29, 0);
        return this.#c(t31);
      }
      async loadAdvertised(e29 = []) {
        this.#d();
        let t31 = new Set(e29), n39 = this.#n.map((e30) => {
          let t32 = f6(e30);
          if (t32 === void 0) throw new E6(`FONT_FACE_FORMAT_UNAVAILABLE`, `font advertises ${JSON.stringify(e30.kind)}, but its raster format is not imported`);
          return { reference: e30, raster: t32 };
        }).filter(({ raster: e30 }) => !t31.has(e30)), r34 = /* @__PURE__ */ new Set();
        for (let { raster: e30 } of n39) {
          if (r34.has(e30.id)) throw new E6(`FONT_FACE_FORMAT_AMBIGUOUS`, `font advertises more than one ${JSON.stringify(e30.kind)} variant; declare the exact format contract`);
          r34.add(e30.id);
        }
        return Promise.all(n39.map(({ reference: e30, raster: t32 }) => this.#l(e30, t32)));
      }
      async snapshot(e29) {
        this.#d();
        let { snapshotSerializedFontFace: t31 } = await Promise.resolve().then(() => (init_font_face_transfer_runtime(), font_face_transfer_runtime_exports));
        return this.#d(), t31(this.#e, e29);
      }
      release() {
        if (this.#o <= 0) throw Error(`FontFace source lease underflow`);
        --this.#o, this.#o === 0 && this.dispose();
      }
      dispose() {
        if (this.#s) return;
        this.#s = true, this.#a(), this.#i.abort(new DOMException(`FontFace source node was disposed`, `AbortError`));
        let e29 = [...this.#r.values()].flatMap((e30) => [...e30.values()]);
        if (this.#r.clear(), e29.length === 0) {
          this.#e.dispose();
          return;
        }
        let t31 = e29.filter(({ value: e30 }) => e30 === void 0);
        for (let t32 of e29) t32.value?.release();
        t31.length !== 0 && Promise.allSettled(t31.map(({ promise: e30 }) => e30)).then((e30) => {
          for (let t32 of e30) t32.status === `fulfilled` && t32.value.release();
          this.#t.leases === 0 && !this.#t.released && this.#e.dispose();
        });
      }
      async #c(e29) {
        let t31 = await s({ descriptor: e29.descriptor, extension: e29.operation.format.extension, kind: e29.operation.format.kind, version: e29.operation.format.version });
        this.#d();
        let n39 = await this.#u(t31, e29.operation.format, () => Te(this.#e, this.#t, e29, this.#i.signal));
        return this.#d(), n39.acquire();
      }
      async #l(e29, t31) {
        let n39 = u6(t31), r34 = await this.#u(e29.rasterKey, t31, () => we(this.#e, this.#t, e29, n39, this.#i.signal));
        return this.#d(), r34.acquire();
      }
      #u(e29, t31, n39) {
        let r34 = this.#r.get(t31);
        r34 === void 0 && (r34 = /* @__PURE__ */ new Map(), this.#r.set(t31, r34));
        let i36 = r34.get(e29);
        if (i36 !== void 0) return i36.promise;
        let a34, o34 = n39().then((t32) => {
          if (a34.value = t32, t32.retain(), this.#s || r34.get(e29) !== a34) throw t32.release(), new DOMException(`FontFace source node was disposed`, `AbortError`);
          return t32;
        }, (n40) => {
          throw r34.get(e29) === a34 && (r34.delete(e29), r34.size === 0 && this.#r.delete(t31)), n40;
        });
        return a34 = { promise: o34, value: void 0 }, r34.set(e29, a34), o34;
      }
      #d() {
        if (this.#s) throw new DOMException(`FontFace source node was disposed`, `AbortError`);
      }
    };
    Se = class {
      #e;
      #t = false;
      constructor(e29) {
        this.#e = e29;
      }
      get formats() {
        return this.#n(), this.#e.formats;
      }
      load(e29) {
        return this.#n(), this.#e.load(e29);
      }
      loadAdvertised(e29) {
        return this.#n(), this.#e.loadAdvertised(e29);
      }
      snapshot(e29) {
        return this.#n(), this.#e.snapshot(e29);
      }
      dispose() {
        this.#t || (this.#t = true, this.#e.release());
      }
      #n() {
        if (this.#t) throw new DOMException(`FontFace source lease was disposed`, `AbortError`);
      }
    };
    j2 = class {
      registry;
      key;
      handle;
      sourceFingerprint;
      shapingFingerprint;
      glyphCount;
      glyphIdWidth = 16;
      metrics;
      #e = /* @__PURE__ */ new Map();
      #t = false;
      constructor(e29) {
        this.registry = e29.registry, this.key = e29.key, this.handle = e29.handle, this.sourceFingerprint = e29.sourceFingerprint, this.shapingFingerprint = e29.shapingFingerprint, this.glyphCount = e29.glyphCount, this.metrics = Object.freeze({ ...e29.metrics });
      }
      get rasterReferences() {
        return this.assertActive(), [...n22(this).rasterSources.values()].map(({ reference: e29 }) => e29);
      }
      getRaster(e29) {
        return this.assertActive(), this.#e.get(e29);
      }
      async loadRaster(e29, t31 = {}) {
        this.assertActive(), t31.signal?.throwIfAborted();
        let n39 = this.#e.get(e29.rasterKey);
        if (n39 !== void 0) return n39.addResourceCandidates(Q([], t31.resolveResource)), n39;
        let r34 = n22(this).rasterSources.get(e29.rasterKey);
        if (r34 === void 0 || e29.kind !== void 0 && e29.kind !== r34.reference.kind) throw new E6(`RASTER_NOT_FOUND`, `font has no matching raster reference`);
        if (r34.extensionData !== void 0 && r34.binaryBytes !== void 0 && r34.bufferViews !== void 0) return this.registerRaster(r34.reference, r34.extensionData, r34.binaryBytes, r34.bufferViews, Q(r34.resourceCandidates, t31.resolveResource));
        let i36 = await t31.resolve?.({ font: this, reference: r34.reference, ...t31.signal === void 0 ? {} : { signal: t31.signal } });
        if (t31.signal?.throwIfAborted(), i36 !== void 0) return this.registry._attachRaster(this, i36, { ...t31.resolveResource === void 0 ? {} : { resolveResource: t31.resolveResource } });
        if (r34.externalCandidates.length === 0) throw new E6(`RASTER_NOT_FOUND`, `raster reference has no resolvable artifact`);
        let a34 = [];
        for (let e30 of r34.externalCandidates) {
          if (!(`uri` in e30.source)) continue;
          let n40;
          try {
            n40 = new URL(e30.source.uri, e30.artifactUrl).href;
          } catch (e31) {
            a34.push(e31);
            continue;
          }
          let r35 = e30.fetch ?? globalThis.fetch;
          if (typeof r35 != `function`) {
            a34.push(TypeError(`no fetch implementation is available`));
            continue;
          }
          try {
            let e31 = await r35(n40, t31.signal === void 0 ? void 0 : { signal: t31.signal });
            if (!e31.ok) throw new E6(`RASTER_FETCH`, `raster request failed with HTTP ${e31.status}`, { url: n40 });
            return this.registry._attachRaster(this, await R(e31, this.registry._artifactByteLimit(), `RASTER_RESOURCE_LIMIT`, n40), { artifactUrl: n40, fetch: r35, ...t31.resolveResource === void 0 ? {} : { resolveResource: t31.resolveResource } });
          } catch (e31) {
            if (t31.signal?.throwIfAborted(), e31 instanceof E6 && e31.reason === `RASTER_RESOURCE_LIMIT`) throw e31;
            a34.push(e31);
          }
        }
        throw new E6(`RASTER_FETCH`, `no external raster candidate could be loaded`, { cause: AggregateError(a34) });
      }
      registerRaster(e29, t31, n39, r34, i36) {
        this.assertActive();
        let a34 = this.#e.get(e29.rasterKey);
        if (a34 !== void 0) return a34.addResourceCandidates(i36), a34;
        let o34 = new M2({ owner: this, reference: e29, extensionData: t31, binaryBytes: n39, views: r34, resources: n22(this).resources, resourceCandidates: i36, handle: ie++ });
        return this.#e.set(e29.rasterKey, o34), o34;
      }
      removeRaster(e29) {
        this.#e.get(e29.rasterKey) === e29 && this.#e.delete(e29.rasterKey);
      }
      assertActive() {
        if (this.#t) throw new E6(`STALE_FONT_HANDLE`, `font has been disposed`);
      }
      dispose() {
        if (!this.#t) {
          this.#t = true;
          for (let e29 of this.#e.values()) e29.disposeFromOwner();
          this.#e.clear(), this.registry._disposeFont(this);
        }
      }
    };
    M2 = class {
      #e;
      #t;
      #n;
      #r;
      rasterKey;
      handle;
      font;
      kind;
      extension;
      version;
      extensionData;
      #i = false;
      constructor(e29) {
        this.#e = e29.owner, this.#t = e29.binaryBytes, this.#n = e29.views, this.#r = $([], e29.resourceCandidates), this.rasterKey = e29.reference.rasterKey, this.handle = e29.handle, this.font = e29.owner.handle, this.kind = e29.reference.kind, this.extension = e29.reference.extension, this.version = e29.reference.version, this.extensionData = ct(structuredClone(e29.extensionData));
      }
      view(e29) {
        this.#a();
        let t31 = this.#n[e29];
        if (t31 === void 0) throw RangeError(`bufferView ${e29} is out of range`);
        return this.#t.subarray(t31.byteOffset, t31.byteOffset + t31.byteLength);
      }
      async resource(e29, t31) {
        return this.#a(), t31?.throwIfAborted(), this.view(e29.bufferView);
      }
      addResourceCandidates(e29) {
        this.#a(), this.#r.splice(0, this.#r.length, ...$(this.#r, e29));
      }
      dispose() {
        this.#i || (this.#i = true, this.#e.removeRaster(this));
      }
      disposeFromOwner() {
        this.#i = true;
      }
      #a() {
        if (this.#e.assertActive(), this.#i) throw new E6(`STALE_RASTER_HANDLE`, `raster has been disposed`);
      }
    };
  }
});

// (disabled):fs
var require_fs = __commonJS({
  "(disabled):fs"() {
  }
});

// node_modules/@pmndrs/glyph/dist/generated/text-shaper-abi.js
var e5 = { codec: { batchFields: { clip: 16, depth: 32, material: 8, order: 64, program: 4, resource: 2, technique: 1, transform: 128 }, bufferUsage: { copyDst: 4, storage: 2, vertex: 1 }, capabilityFlags: { aliasVec2: 4, aliasVec4: 8, indirectDraws: 2, orderedDirect: 16, storageBuffers: 1 }, inputScopes: { glyph: 2, resource: 3, semantic: 1, strike: 4 }, opcodes: { addF32: 5, constantF32: 3, constantU32: 4, convertU32ToF32: 10, lessThanF32: 8, loadF32: 1, loadU32: 2, multiplyF32: 7, selectF32: 9, storeF32: 11, storeU16: 13, storeU32: 12, subtractF32: 6 }, scalarTypes: { f32: 1, u16: 3, u32: 2 } }, endianness: `little`, engine: { axisModes: { atMost: 2, exact: 3, unconstrained: 1 }, blockAlignments: { center: 2, end: 3, start: 1 }, bufferStrategies: { orderedDirect: 1, sessionShared: 3 }, decorationFlags: { all: 15, lineThrough: 4, overline: 2, skipInk: 8, underline: 1 }, decorationStyles: { dashed: 4, dotted: 3, double: 2, none: 0, solid: 1, wavy: 5 }, defaultRootTextCapacity: 1024, dropCapAlignments: { baseline: 2, textTop: 1 }, dropCapSides: { inlineEnd: 2, inlineStart: 1 }, exclusionWrapSides: { both: 1, inlineEnd: 3, inlineStart: 2, largest: 4 }, flowShapeKinds: { polygon: 2, rectangle: 1 }, frameFlags: { compositingIndependent: 1 }, glyphFlags: { produced: 3, unsafeToBreak: 1, unsafeToConcat: 2 }, inlineAlignments: { center: 2, end: 3, justify: 4, start: 1 }, inlineObjectBaselines: { alphabetic: 1, middle: 3, textBottom: 4, textTop: 2 }, internalBufferBindings: { placement: 65534 }, internalBufferIds: { placement: 2147483647 }, lastLinePolicies: { auto: 1, justify: 2 }, measurementFlags: { inkBounds: 2, overflowed: 1 }, overflowModes: { clip: 2, ellipsis: 3, visible: 1 }, paragraphMutationOpcodes: { remove: 2, upsert: 1 }, patchOpcodes: { allocateOrResize: 1, copy: 4, fill: 3, retire: 5, write: 2 }, primitiveKinds: { clip: 4, codec: 5, decoration: 2, glyph: 1, inlineObject: 3 }, resourceActions: { create: 1, retain: 3, update: 2 }, resultFlags: { checkpoint: 1 }, retirementKinds: { buffer: 2, outputBytes: 4, resource: 1, slotRange: 3 }, semanticF32Fields: { blockExtent: 3, blockOrigin: 7, blockStart: 1, fontSize: 4, foregroundAlpha: 11, foregroundBlue: 10, foregroundGreen: 9, foregroundRed: 8, inlineExtent: 2, inlineOrigin: 6, inlineStart: 0, inverseFontSize: 12, outlineWidthEm: 13, rasterPixelRatio: 5, shadowOffsetXEm: 14, shadowOffsetYEm: 15 }, semanticKinds: { caret: 5, cluster: 4, fragment: 2, glyph: 9, insertedGlyph: 7, line: 1, paragraphMeasurement: 8, run: 3, selection: 6 }, semanticU32Fields: { clusterId: 1, flowThreadId: 3, foregroundRgba: 0, outlineRgba: 6, placementSlot: 8, regionId: 2, shadowRgba: 7, stableGlyphId: 5, transformIndex: 4 }, semanticViewMasks: { all: 3, borrowedLayout: 4, layoutInspection: 2, measurement: 1 }, styleFields: { all: 65535, baselineShift: 256, decoration: 4096, direction: 1024, features: 8, fontSize: 16, fontStack: 1, foreground: 2048, language: 4, letterSpacing: 64, lineHeight: 32, material: 2, opacity: 8192, outline: 16384, rasterPixelRatio: 512, shadow: 32768, wordSpacing: 128 }, styleFlags: { root: 1 }, styleMutationOpcodes: { remove: 2, upsert: 1 }, textEncodings: { utf16Le: 1 }, textMutationOpcodes: { replaceUtf16: 1 }, textOrientations: { mixed: 1, sideways: 3, upright: 2 }, wrapModes: { character: 3, none: 1, word: 2 }, writingModes: { horizontalTb: 1, verticalLr: 3, verticalRl: 2 } }, functions: { allocate: `pmndrs_glyph_shaper_alloc`, borrowParagraphGlyph: `pmndrs_glyph_engine_borrow_paragraph_glyph`, borrowParagraphLayout: `pmndrs_glyph_engine_borrow_paragraph_layout`, codecCount: `pmndrs_glyph_engine_codec_count`, copyDecorations: `pmndrs_glyph_engine_copy_decorations`, copyGlyphs: `pmndrs_glyph_engine_copy_glyphs`, createRoot: `pmndrs_glyph_engine_create_root`, deallocate: `pmndrs_glyph_shaper_dealloc`, disposeCodec: `pmndrs_glyph_engine_dispose_codec`, disposeFont: `pmndrs_glyph_shaper_dispose_font`, disposeFontBinding: `pmndrs_glyph_engine_dispose_font_binding`, disposeFontStack: `pmndrs_glyph_engine_dispose_font_stack`, disposeRoot: `pmndrs_glyph_engine_dispose_root`, fontBindingCount: `pmndrs_glyph_engine_font_binding_count`, fontCount: `pmndrs_glyph_shaper_font_count`, fontStackCount: `pmndrs_glyph_engine_font_stack_count`, initialize: `pmndrs_glyph_shaper_initialize`, measureParagraph: `pmndrs_glyph_engine_measure_paragraph`, registerCodec: `pmndrs_glyph_engine_register_codec`, registerFont: `pmndrs_glyph_shaper_register_font`, registerFontBinding: `pmndrs_glyph_engine_register_font_binding`, registerFontStack: `pmndrs_glyph_engine_register_font_stack`, requestCapacity: `pmndrs_glyph_engine_request_capacity`, requestPointer: `pmndrs_glyph_engine_request_ptr`, reserveRoot: `pmndrs_glyph_engine_reserve_root`, reserveUpdateBatch: `pmndrs_glyph_engine_reserve_update_batch`, retainedFontBytes: `pmndrs_glyph_shaper_retained_font_bytes`, rootCount: `pmndrs_glyph_engine_root_count`, shapePlanCount: `pmndrs_glyph_shaper_shape_plan_count`, textUpdate: `pmndrs_glyph_engine_update`, textUpdateBatch: `pmndrs_glyph_engine_update_batch`, updateBatchCapacity: `pmndrs_glyph_engine_update_batch_capacity`, updateBatchPointer: `pmndrs_glyph_engine_update_batch_ptr` }, layouts: { borrowedGlyph: { alignment: 4, bidiLevel: 16, blockOrigin: 28, cluster: 8, flags: 14, fontHandle: 4, fontSize: 20, glyphId: 12, inkBlockExtent: 48, inkBlockStart: 40, inkInlineExtent: 44, inkInlineStart: 36, inlineAdvance: 32, inlineOrigin: 24, size: 52, stableId: 0 }, borrowedLayoutDescriptor: { alignment: 4, generation: 0, glyphCount: 12, paragraphId: 8, rootId: 4, size: 16 }, codecBuffer: { alignment: 4, capacityClass: 12, id: 0, reserved0: 14, scalar: 2, size: 16, stride: 6, usage: 8, vectorWidth: 3 }, codecCapabilitySet: { alignment: 4, coalesceGapBytes: 16, flags: 4, fragmentationBudget: 30, id: 0, maxBufferBytes: 8, maxBuffersPerDraw: 24, maxIndirectDraws: 28, maxResourcesPerDraw: 26, rangeCallPenaltyBytes: 20, reserved: 34, size: 40, updateAlignment: 12, wholeBufferThresholdBasisPoints: 32 }, codecInput: { alignment: 2, field: 1, reserved: 2, scope: 0, size: 4 }, codecOperation: { alignment: 4, immediate0: 4, immediate1: 8, immediate2: 12, opcode: 0, operand0: 2, operand1: 3, size: 16, target: 1 }, codecProgram: { alignment: 4, bufferCount: 42, bufferStart: 32, capabilitySetId: 8, compositingCapabilities: 28, drawKeyMask: 52, f32InputCount: 48, inputCount: 60, inputStart: 56, operationCount: 44, operationStart: 36, paintCapabilities: 24, primitiveKind: 50, programId: 4, reserved0: 46, reserved1: 62, resourceKindMask: 12, semanticViewMask: 16, size: 64, storageKeyMask: 20, techniqueId: 0, u32InputCount: 49, variant: 40 }, codecRequest: { alignment: 4, bufferCount: 24, buffersOffset: 20, byteLength: 0, capabilitySetCount: 8, capabilitySetsOffset: 4, inputCount: 40, inputsOffset: 36, operationCount: 32, operationsOffset: 28, programCount: 16, programsOffset: 12, size: 44 }, engineBuffer: { alignment: 4, byteLength: 28, capacityRecords: 24, codecBufferId: 12, flags: 18, generation: 4, id: 0, liveRecords: 20, programId: 8, scalarType: 14, size: 32, strategy: 16, vectorWidth: 15 }, engineConstraint: { align: 47, alignment: 4, blockAlign: 49, dropCapAlignment: 82, dropCapLines: 81, dropCapMarginBlock: 88, dropCapMarginInline: 84, dropCapReserved: 98, dropCapSide: 83, dropCapVertexCount: 96, dropCapVerticesOffset: 92, firstLineIndent: 56, flags: 50, flowThreadId: 0, geometryRevision: 4, height: 12, heightMode: 45, justifyLetterSpaceExpansion: 76, justifyMaxWordSpaceRatio: 72, justifyMinWordSpaceRatio: 68, lastLine: 80, maxLines: 28, overflow: 48, paragraphId: 52, regionCount: 40, regionStart: 32, resumeBlockOffset: 24, resumeCluster: 36, resumeRegion: 42, size: 100, spaceAfter: 64, spaceBefore: 60, viewportBlockEnd: 20, viewportBlockStart: 16, width: 8, widthMode: 44, wrap: 46 }, engineDiagnostic: { alignment: 4, code: 0, durationNanosHigh: 20, durationNanosLow: 16, phase: 3, severity: 2, size: 24, subjectId: 4, value0: 8, value1: 12 }, engineDraw: { alignment: 4, bufferCount: 40, bufferStart: 36, clipId: 16, depthKey: 20, flags: 10, id: 0, materialId: 12, orderToken: 52, primitiveCount: 32, primitiveStart: 28, programId: 4, programVariant: 8, resourceCount: 48, resourceStart: 44, size: 56, transformId: 24 }, engineExclusion: { alignment: 4, blockEnd: 36, blockStart: 28, flags: 18, geometryRevision: 8, id: 0, inlineEnd: 32, inlineStart: 24, marginBlock: 44, marginInline: 40, regionId: 4, reserved0: 22, shape: 20, size: 48, vertexCount: 16, verticesOffset: 12, wrapSide: 21 }, engineFlowVertex: { alignment: 4, block: 4, inline: 0, size: 8 }, engineInlineObject: { alignment: 4, baselineAlignment: 52, baselineOffset: 32, blockExtent: 28, contentRevision: 4, flags: 53, id: 0, inlineExtent: 24, marginBlockEnd: 48, marginBlockStart: 44, marginInlineEnd: 40, marginInlineStart: 36, materialId: 12, paragraphId: 56, reserved0: 54, resourceGeneration: 20, resourceId: 16, size: 60, textOffset: 8 }, engineParagraphMutation: { alignment: 4, flags: 1, opcode: 0, order: 8, paragraphId: 4, reserved0: 2, size: 12 }, engineParagraphOrderMutation: { alignment: 8, orderRank: 8, orderScope: 4, paragraphId: 0, size: 16 }, enginePatch: { alignment: 4, bufferGeneration: 8, bufferId: 4, byteLength: 16, destinationOffset: 12, fillValue: 32, flags: 2, opcode: 0, payloadOffset: 20, size: 36, sourceBufferId: 24, sourceOffset: 28 }, enginePrimitive: { alignment: 4, blockExtent: 60, blockStart: 52, bufferId: 28, clipId: 40, flags: 6, id: 0, inlineExtent: 56, inlineStart: 48, kind: 4, logicalOrder: 36, programId: 20, programVariant: 24, recordCount: 26, recordIndex: 32, resourceGeneration: 16, resourceId: 12, semanticId: 44, size: 64, techniqueId: 8 }, engineRegion: { alignment: 4, blockEnd: 40, blockStart: 32, clipBlockEnd: 56, clipBlockStart: 48, clipInlineEnd: 52, clipInlineStart: 44, exclusionCount: 20, exclusionStart: 18, flags: 22, geometryRevision: 4, id: 0, inlineEnd: 36, inlineStart: 28, reserved0: 27, shape: 24, size: 60, textOrientation: 26, transformIndex: 8, vertexCount: 16, verticesOffset: 12, writingMode: 25 }, engineResource: { action: 14, alignment: 4, auxiliary0: 32, auxiliary1: 36, flags: 16, generation: 4, id: 0, lowerBound: 24, referenceId: 20, resourceKind: 12, size: 40, techniqueId: 8, upperBound: 28 }, engineResult: { abiVersion: 0, alignment: 16, bufferCount: 88, buffersOffset: 84, byteLength: 4, capabilitySet: 56, codecFingerprintHigh: 64, codecFingerprintLow: 60, codecHandle: 52, diagnosticCount: 128, diagnosticsOffset: 124, drawCount: 112, drawsOffset: 108, engineRevision: 20, faultParagraphId: 132, faultStyleId: 136, flags: 12, patchCount: 96, patchesOffset: 92, primitiveCount: 104, primitivesOffset: 100, publicationGeneration: 32, requestCapacity: 36, requiredBaseRevision: 28, requiredRequestCapacity: 40, requiredResultCapacity: 48, resourceCount: 80, resourcesOffset: 76, resultCapacity: 44, retirementCount: 120, retirementsOffset: 116, revision: 24, rootId: 16, semanticViewCount: 72, semanticViewsOffset: 68, size: 144, status: 8 }, engineRetirement: { alignment: 4, byteLength: 16, byteOffset: 12, flags: 2, generation: 8, id: 4, kind: 0, size: 20 }, engineSemanticView: { alignment: 4, ascent: 64, blockExtent: 40, blockStart: 32, flags: 6, id: 0, inkBlockExtent: 60, inkBlockStart: 52, inkInlineExtent: 56, inkInlineStart: 48, inlineAdvance: 44, inlineExtent: 36, inlineStart: 28, itemCount: 24, itemStart: 20, kind: 4, maxContentWidth: 72, minContentWidth: 68, parentId: 8, size: 76, textEnd: 16, textStart: 12 }, engineStyleMutation: { alignment: 4, baselineShift: 60, cascadeOrder: 8, decorationFlags: 76, decorationOffset: 84, decorationRgba: 72, decorationStyle: 2, decorationThickness: 80, direction: 1, featureCount: 38, featuresOffset: 40, fieldMask: 12, flags: 3, fontSize: 44, fontStackHandle: 24, foregroundRgba: 68, languageLength: 36, languageOffset: 32, letterSpacing: 52, lineHeight: 48, materialId: 28, opacity: 88, opcode: 0, outlineRgba: 92, outlineWidth: 96, paragraphId: 112, rasterPixelRatio: 64, shadowOffsetX: 104, shadowOffsetY: 108, shadowRgba: 100, size: 116, styleId: 4, textEnd: 20, textStart: 16, wordSpacing: 56 }, engineTextMutation: { alignment: 4, deleteCount: 8, encoding: 1, insertCount: 16, insertOffset: 12, opcode: 0, paragraphId: 20, reserved0: 2, size: 24, textStart: 4 }, engineUpdateBatchEntry: { alignment: 4, requestLength: 4, resultPointer: 8, rootId: 0, size: 16, status: 12 }, engineUpdateRequest: { abiVersion: 0, acknowledgedPublicationGeneration: 20, alignment: 4, byteLength: 4, capabilitySet: 28, codecHandle: 24, codecParametersLength: 120, codecParametersOffset: 116, constraintCount: 88, constraintsOffset: 84, consumedRevision: 16, exclusionCount: 104, exclusionsOffset: 100, expectedEngineRevision: 12, flags: 32, inlineObjectCount: 112, inlineObjectsOffset: 108, maxClusters: 40, maxExclusions: 52, maxInlineObjects: 56, maxLines: 44, maxOutputBytes: 64, maxParagraphs: 124, maxRegions: 48, maxSlotsPerBand: 60, paragraphMutationCount: 132, paragraphMutationsOffset: 128, paragraphOrderMutationCount: 140, paragraphOrderMutationsOffset: 136, regionCount: 96, regionsOffset: 92, rootId: 8, semanticViewMask: 36, size: 144, styleMutationCount: 80, styleMutationsOffset: 76, textMutationCount: 72, textMutationsOffset: 68 }, feature: { alignment: 4, end: 12, size: 16, start: 8, tag: 0, value: 4 }, fontBindingRequest: { abiVersion: 0, alignment: 4, byteLength: 4, glyphCount: 16, glyphF32FieldCount: 28, glyphF32Offset: 48, glyphU32FieldCount: 29, glyphU32Offset: 52, programVariant: 12, reserved0: 14, reserved1: 34, reserved2: 72, resourceCount: 24, resourceF32FieldCount: 32, resourceF32Offset: 64, resourceIndicesOffset: 44, resourceU32FieldCount: 33, resourceU32Offset: 68, resourcesOffset: 40, size: 76, strikeCount: 20, strikeF32FieldCount: 30, strikeF32Offset: 56, strikeU32FieldCount: 31, strikeU32Offset: 60, strikesOffset: 36, techniqueId: 8 }, fontBindingResource: { alignment: 4, generation: 4, id: 0, kind: 8, reference: 12, reserved: 10, size: 16 }, fontBindingStrike: { alignment: 4, ppem: 0, reserved: 4, size: 8 } }, memory: `memory`, name: `pmndrs-glyph-shaper`, pointerWidth: 32, status: { codecConflict: 8, codecMissing: 9, fontInUse: 14, fontMetricsMissing: 19, fontMissing: 5, fontStackMissing: 13, handleConflict: 4, invalidExtents: 3, invalidFont: 2, invalidHandle: 1, invalidRequest: 6, ok: 0, registrationInUse: 20, resultTooLarge: 7, revisionConflict: 12, rootConflict: 10, rootMissing: 11, styleNestingInvalid: 17, styleRangeInvalid: 15, styleRootInvalid: 18, styleSplitsCluster: 16 }, version: 0, versions: { fontFormat: 0, harfrust: `0.12.0`, harfrustCommit: `60b28ea22b5261710018d69c168a762bcb28794c`, shaper: `0.0.0`, unicode: `17.0.0` } };

// node_modules/@pmndrs/glyph/dist/internal/render-id.js
var e6 = new TextEncoder();
var t3 = /* @__PURE__ */ new WeakSet();
function n4(t31) {
  if (typeof t31 != `string` || t31.length === 0) throw TypeError(`render identity must be a nonempty string`);
  let n39 = 2166136261;
  for (let r34 of e6.encode(t31)) n39 = Math.imul(n39 ^ r34, 16777619) >>> 0;
  if (n39 === 0) throw RangeError(`render program family ID hashes to the reserved zero wire identity`);
  return n39;
}
var r4 = class {
  #e = /* @__PURE__ */ new Map();
  constructor() {
    t3.add(this);
  }
  idFor(e29) {
    let t31 = n4(e29), r34 = this.#e.get(t31);
    if (r34 !== void 0 && r34 !== e29) throw TypeError(`render wire identity collision between "${r34}" and "${e29}"`);
    return this.#e.set(t31, e29), t31;
  }
  technique(e29) {
    return this.idFor(s2(e29));
  }
  program(e29, t31, n39 = `default`) {
    return this.idFor(o4(e29, t31, n39));
  }
  resource(e29) {
    return this.idFor(e29);
  }
};
function i4(e29) {
  t3.add(e29);
}
function a4(e29, n39) {
  if (typeof e29 != `object` && typeof e29 != `function` || e29 === null || !t3.has(e29)) throw TypeError(`${n39} must be the id utility or a handle-supplied CodecIdFactory`);
  return e29;
}
function o4(e29, t31, n39) {
  if (typeof t31 != `string` || t31.length === 0) throw TypeError(`render program namespace must be a nonempty string`);
  if (typeof n39 != `string` || n39.length === 0) throw TypeError(`render program variant must be a nonempty string`);
  return JSON.stringify([`glyph-program-v1`, s2(e29), t31, n39]);
}
function s2(e29) {
  let t31 = typeof e29 == `string` ? e29 : e29?.id;
  if (typeof t31 != `string` || t31.length === 0) throw TypeError(`render raster identity must be a nonempty string`);
  return t31;
}

// node_modules/@pmndrs/glyph/dist/internal/glyph-id.js
var t4 = /* @__PURE__ */ new Map();
var n5 = /* @__PURE__ */ new Set([`generic`, `buffer`, `codec`, `font-binding`, `font-stack`, `planner`, `material`, `paragraph`, `style`, `flow-thread`, `region`, `exclusion`, `inline-object`, `resource`]);
var r5 = class {
  #e = /* @__PURE__ */ new Set();
  #t = false;
  id(e29, t31) {
    if (this.#t) throw Error(`glyph ID scope has been disposed`);
    let n39 = o5(e29, t31), r34 = s3(n39, false);
    return this.#e.has(n39.key) || (this.#e.add(n39.key), r34.scopeCount += 1), n39.value;
  }
  retain(e29, n39, r34) {
    if (this.#t) throw Error(`glyph ID scope has been disposed`);
    let i36 = `${n39}:${a5(e29, n39, r34)}`;
    if (this.#e.has(i36)) return false;
    let o34 = t4.get(i36);
    if (o34 === void 0) throw Error(`glyph ID provenance disappeared during retention`);
    return this.#e.add(i36), o34.scopeCount += 1, true;
  }
  release(e29, n39) {
    let r34 = `${n39}:${e29}`;
    if (!this.#e.delete(r34)) return;
    let i36 = t4.get(r34);
    if (i36 === void 0 || i36.scopeCount === 0) throw Error(`glyph ID scope lost an owned registration`);
    --i36.scopeCount, !i36.permanent && i36.scopeCount === 0 && t4.delete(r34);
  }
  dispose() {
    if (this.#t) return;
    this.#t = true;
    let e29;
    for (let n39 of this.#e) {
      let r34 = t4.get(n39);
      if (r34 === void 0 || r34.scopeCount === 0) {
        e29 ??= Error(`glyph ID scope lost an owned registration`);
        continue;
      }
      --r34.scopeCount, !r34.permanent && r34.scopeCount === 0 && t4.delete(n39);
    }
    if (this.#e.clear(), e29 !== void 0) throw e29;
  }
};
function i5(e29, t31) {
  let n39 = (n40, r34) => (t31(), e29.id(n40, r34));
  return Object.freeze(Object.assign(n39, { buffer: (e30) => n39(`buffer`, e30), codec: (e30) => n39(`codec`, e30), fontBinding: (e30) => n39(`font-binding`, e30), fontStack: (e30) => n39(`font-stack`, e30), planner: (e30) => n39(`planner`, e30), material: (e30) => n39(`material`, e30), paragraph: (e30) => n39(`paragraph`, e30), style: (e30) => n39(`style`, e30), flowThread: (e30) => n39(`flow-thread`, e30), region: (e30) => n39(`region`, e30), exclusion: (e30) => n39(`exclusion`, e30), inlineObject: (e30) => n39(`inline-object`, e30), resourceHandle: (e30) => n39(`resource`, e30) }));
}
function a5(e29, n39, r34) {
  let i36 = n39 === `buffer` ? `id.buffer(name)` : `package-owned Glyph identity state`;
  if (!Number.isSafeInteger(e29) || e29 < 1 || e29 > 4294967295 || !t4.has(`${n39}:${e29}`)) throw TypeError(`${r34} must come from ${i36}`);
  return e29;
}
function o5(t31, r34) {
  if (typeof t31 != `string` || !n5.has(t31)) throw TypeError(`glyph ID kind is not supported`);
  if (typeof r34 != `string` || r34.length === 0) throw TypeError(`glyph ID name must be a nonempty string`);
  let i36 = JSON.stringify([`glyph-id-v1`, t31, r34]), a34 = n4(i36), o34 = t31 === `buffer` ? a34 % 65534 + 1 : a34;
  return { canonical: i36, key: `${t31}:${o34}`, value: o34 };
}
function s3(e29, n39) {
  let r34 = t4.get(e29.key);
  if (r34 !== void 0) {
    if (r34.canonical !== e29.canonical) throw TypeError(`glyph ID collision between ${r34.canonical} and ${e29.canonical}`);
    return n39 && (r34.permanent = true), r34;
  }
  let i36 = { canonical: e29.canonical, permanent: n39, scopeCount: 0 };
  return t4.set(e29.key, i36), i36;
}
function c3(e29, t31) {
  let n39 = o5(e29, t31);
  return s3(n39, true), n39.value;
}

// node_modules/@pmndrs/glyph/dist/config/codec.js
var a6 = 4294967295;
var o6 = new DataView(new ArrayBuffer(4));
var s4 = new r4();
var c4 = Object.freeze({ buffer: (e29) => c3(`buffer`, e29), technique: (e29) => s4.technique(e29), program: (e29, t31, n39 = `default`) => s4.program(e29, t31, n39), resource: (e29) => s4.resource(e29) });
i4(c4);
var l2 = Object.freeze(c4);
function u2(t31, n39, r34, i36, a34) {
  if (p2(t31, `codec technique id`), p2(n39, `codec program id`), !I(r34)) throw TypeError(`codec program body needs an object`);
  if (!Array.isArray(r34.inputs) || !Array.isArray(r34.operations)) throw TypeError(`codec program body needs input and operation arrays`);
  if (!Array.isArray(i36)) throw TypeError(`codec program buffers need an array`);
  if (a34 !== `direct` && a34 !== `indexed`) throw TypeError(`codec transform mode must be "direct" or "indexed"`);
  let o34 = Object.freeze(r34.inputs.map((e29, t32) => {
    if (!I(e29)) throw TypeError(`codec program input ${t32} needs an object`);
    return Object.freeze({ scope: e29.scope, field: e29.field });
  })), s33 = Object.freeze(r34.operations.map((e29, t32) => {
    if (!I(e29)) throw TypeError(`codec program operation ${t32} needs an object`);
    return Object.freeze({ opcode: e29.opcode, ...e29.target === void 0 ? {} : { target: e29.target }, ...e29.operand0 === void 0 ? {} : { operand0: e29.operand0 }, ...e29.operand1 === void 0 ? {} : { operand1: e29.operand1 }, ...e29.immediate0 === void 0 ? {} : { immediate0: e29.immediate0 }, ...e29.immediate1 === void 0 ? {} : { immediate1: e29.immediate1 }, ...e29.immediate2 === void 0 ? {} : { immediate2: e29.immediate2 } });
  })), c30 = Object.freeze(i36.map((e29, t32) => {
    if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`codec program buffer ${t32} needs an object`);
    return Object.freeze({ id: e29.id, scalar: e29.scalar, vectorWidth: e29.vectorWidth, ...e29.alignment === void 0 ? {} : { alignment: e29.alignment }, ...e29.stride === void 0 ? {} : { stride: e29.stride }, ...e29.usage === void 0 ? {} : { usage: e29.usage }, ...e29.capacityClass === void 0 ? {} : { capacityClass: e29.capacityClass } });
  })), l29 = e5.codec.batchFields;
  return Object.freeze({ techniqueId: t31, programId: n39, f32InputCount: r34.f32InputCount, u32InputCount: r34.u32InputCount, inputs: o34, buffers: c30, operations: s33, storageKeyMask: l29.technique | l29.program | l29.resource | l29.depth, drawKeyMask: l29.technique | l29.program | l29.resource | l29.material | l29.clip | l29.depth | l29.order | (a34 === `direct` ? l29.transform : 0) });
}
function d2(t31) {
  f2(t31);
  let n39 = e5.layouts.codecRequest, i36 = e5.layouts.codecCapabilitySet, a34 = e5.layouts.codecProgram, o34 = e5.layouts.codecBuffer, s33 = e5.layouts.codecOperation, c30 = e5.layouts.codecInput, l29 = t31.programs;
  if (t31.capabilitySets.length === 0) throw RangeError(`codec declares no capability sets`);
  if (t31.capabilitySets.length > 8) throw RangeError(`codec declares more than 8 capability sets`);
  let u28 = t31.capabilitySets.map((e29, t32) => m2(e29, `codec capability set ${t32}`)), d24 = /* @__PURE__ */ new Map();
  for (let [e29, t32] of u28.entries()) {
    let n40 = v2(t32);
    if (d24.has(n40)) throw TypeError(`codec repeats an equivalent capability set`);
    d24.set(n40, e29 + 1);
  }
  if (l29.length === 0) throw RangeError(`codec declares no programs`);
  if (l29.length > 32) throw RangeError(`codec declares more than 32 programs`);
  let h24 = /* @__PURE__ */ new Set(), y22 = /* @__PURE__ */ new Set(), b20 = [];
  for (let t32 of l29) {
    p2(t32.techniqueId, `codec technique id`), p2(t32.programId, `codec program id`);
    let n40 = `codec program ${t32.programId}`;
    t32.resourceKindMask !== void 0 && k(t32.resourceKindMask, `${n40} resourceKindMask`), t32.semanticViewMask !== void 0 && k(t32.semanticViewMask, `${n40} semanticViewMask`), t32.storageKeyMask !== void 0 && k(t32.storageKeyMask, `${n40} storageKeyMask`), t32.drawKeyMask !== void 0 && k(t32.drawKeyMask, `${n40} drawKeyMask`), t32.paintCapabilities !== void 0 && k(t32.paintCapabilities, `${n40} paintCapabilities`), t32.compositingCapabilities !== void 0 && k(t32.compositingCapabilities, `${n40} compositingCapabilities`), t32.primitiveKind !== void 0 && T2(t32.primitiveKind, `${n40} primitiveKind`);
    let i37 = A(t32.variant ?? 0, `codec program variant`);
    j(t32.f32InputCount, `${n40} f32 input count`), j(t32.u32InputCount, `${n40} u32 input count`), A(t32.buffers.length, `${n40} buffer count`);
    let a35 = /* @__PURE__ */ new Set();
    for (let [e29, n41] of t32.buffers.entries()) {
      let i38 = `codec program ${t32.programId} buffer ${e29}`, o36 = A(a5(n41.id, `buffer`, `${i38} id`), `${i38} id`);
      if (a35.has(o36)) throw TypeError(`codec repeats buffer id ${o36} within a program`);
      a35.add(o36), w2(n41.scalar, `${i38} scalar`), j(n41.vectorWidth, `${i38} vectorWidth`), n41.alignment !== void 0 && A(n41.alignment, `${i38} alignment`), n41.stride !== void 0 && A(n41.stride, `${i38} stride`), n41.usage !== void 0 && k(n41.usage, `${i38} usage`), n41.capacityClass !== void 0 && A(n41.capacityClass, `${i38} capacityClass`);
    }
    A(t32.operations.length, `${n40} operation count`);
    for (let [e29, n41] of t32.operations.entries()) {
      let r34 = `codec program ${t32.programId} operation ${e29}`;
      j(n41.opcode, `${r34} opcode`), n41.target !== void 0 && j(n41.target, `${r34} target`), n41.operand0 !== void 0 && j(n41.operand0, `${r34} operand0`), n41.operand1 !== void 0 && j(n41.operand1, `${r34} operand1`), n41.immediate0 !== void 0 && k(n41.immediate0, `${r34} immediate0`), n41.immediate1 !== void 0 && k(n41.immediate1, `${r34} immediate1`), n41.immediate2 !== void 0 && k(n41.immediate2, `${r34} immediate2`);
    }
    A(t32.inputs.length, `${n40} input count`);
    for (let [n41, r34] of t32.inputs.entries()) {
      let i38 = `codec program ${t32.programId} input ${n41}`;
      if (!(typeof r34.scope == `string` && Object.hasOwn(e5.codec.inputScopes, r34.scope))) throw TypeError(`${i38} scope ${JSON.stringify(r34.scope)} is not a codec input scope`);
      j(r34.field, `${i38} field`);
    }
    let o35 = _(t32.capabilitySet, d24, n40);
    if (b20.push(o35), g2(t32, u28, o35), h24.has(t32.programId)) throw TypeError(`codec repeats program id ${t32.programId}`);
    h24.add(t32.programId);
    let s34 = `${o35}:${t32.techniqueId}:${i37}`;
    if (y22.has(s34)) throw TypeError(`codec repeats a technique, capability set, and program variant`);
    y22.add(s34);
  }
  for (let [e29] of u28.entries()) {
    let t32 = e29 + 1;
    if (!b20.some((e30) => e30 === 0 || e30 === t32)) throw TypeError(`codec capability set ${e29} is declared but referenced by no program`);
  }
  let x19 = M(l29, (e29) => e29.buffers.length), S17 = M(l29, (e29) => e29.operations.length), E13 = M(l29, (e29) => e29.inputs.length), D12 = N(n39.size, i36.alignment, `codec capability sets`), O11 = N(P(D12, F(i36.size, u28.length, `codec capabilities`), `codec programs`), a34.alignment, `codec programs`), I6 = N(P(O11, F(a34.size, l29.length, `codec programs`), `codec buffers`), o34.alignment, `codec buffers`), L5 = N(P(I6, F(o34.size, x19, `codec buffers`), `codec operations`), s33.alignment, `codec operations`), R5 = N(P(L5, F(s33.size, S17, `codec operations`), `codec inputs`), c30.alignment, `codec inputs`), z4 = P(R5, F(c30.size, E13, `codec inputs`), `codec bytes`), B4 = 0, V4 = 0, H4 = 0, U4 = l29.map((e29, t32) => {
    let n40 = { value: e29, capabilitySetId: b20[t32], bufferStart: B4, operationStart: V4, inputStart: H4 };
    return B4 = P(B4, e29.buffers.length, `codec buffer start`), V4 = P(V4, e29.operations.length, `codec operation start`), H4 = P(H4, e29.inputs.length, `codec input start`), n40;
  }), W4 = new Uint8Array(z4), G4 = new DataView(W4.buffer);
  G4.setUint32(n39.byteLength, W4.byteLength, true), G4.setUint32(n39.capabilitySetsOffset, D12, true), G4.setUint32(n39.capabilitySetCount, u28.length, true), G4.setUint32(n39.programsOffset, O11, true), G4.setUint32(n39.programCount, l29.length, true), G4.setUint32(n39.buffersOffset, I6, true), G4.setUint32(n39.bufferCount, x19, true), G4.setUint32(n39.operationsOffset, L5, true), G4.setUint32(n39.operationCount, S17, true), G4.setUint32(n39.inputsOffset, R5, true), G4.setUint32(n39.inputCount, E13, true);
  for (let [e29, t32] of u28.entries()) {
    let n40 = D12 + e29 * i36.size;
    G4.setUint32(n40 + i36.id, e29 + 1, true), G4.setUint32(n40 + i36.flags, C2(t32), true), G4.setUint32(n40 + i36.maxBufferBytes, t32.maxBufferBytes, true), G4.setUint32(n40 + i36.updateAlignment, t32.updateAlignment, true), G4.setUint32(n40 + i36.coalesceGapBytes, t32.coalesceGapBytes, true), G4.setUint32(n40 + i36.rangeCallPenaltyBytes, t32.rangeCallPenaltyBytes, true), G4.setUint16(n40 + i36.maxBuffersPerDraw, t32.maxBuffersPerDraw, true), G4.setUint16(n40 + i36.maxResourcesPerDraw, t32.maxResourcesPerDraw, true), G4.setUint16(n40 + i36.maxIndirectDraws, t32.maxIndirectDraws, true), G4.setUint16(n40 + i36.fragmentationBudget, t32.fragmentationBudget, true), G4.setUint16(n40 + i36.wholeBufferThresholdBasisPoints, t32.wholeBufferThresholdBasisPoints, true);
  }
  for (let [e29, t32] of U4.entries()) {
    let n40 = t32.value, r34 = O11 + e29 * a34.size;
    G4.setUint32(r34 + a34.techniqueId, n40.techniqueId, true), G4.setUint32(r34 + a34.programId, n40.programId, true), G4.setUint32(r34 + a34.capabilitySetId, t32.capabilitySetId, true), G4.setUint32(r34 + a34.resourceKindMask, n40.resourceKindMask ?? 1, true), G4.setUint32(r34 + a34.semanticViewMask, n40.semanticViewMask ?? 0, true), G4.setUint32(r34 + a34.storageKeyMask, n40.storageKeyMask ?? 0, true), G4.setUint32(r34 + a34.drawKeyMask, n40.drawKeyMask ?? 0, true), G4.setUint32(r34 + a34.paintCapabilities, n40.paintCapabilities ?? 0, true), G4.setUint32(r34 + a34.compositingCapabilities, n40.compositingCapabilities ?? 0, true), G4.setUint32(r34 + a34.bufferStart, t32.bufferStart, true), G4.setUint32(r34 + a34.operationStart, t32.operationStart, true), G4.setUint16(r34 + a34.variant, n40.variant ?? 0, true), G4.setUint16(r34 + a34.bufferCount, n40.buffers.length, true), G4.setUint16(r34 + a34.operationCount, n40.operations.length, true), G4.setUint16(r34 + a34.primitiveKind, T2(n40.primitiveKind ?? `glyph`, `codec program ${n40.programId} primitiveKind`), true), G4.setUint8(r34 + a34.f32InputCount, n40.f32InputCount), G4.setUint8(r34 + a34.u32InputCount, n40.u32InputCount), G4.setUint32(r34 + a34.inputStart, t32.inputStart, true), G4.setUint16(r34 + a34.inputCount, n40.inputs.length, true);
  }
  let K4 = 0, q4 = 0, J4 = 0;
  for (let t32 of l29) {
    for (let n40 of t32.buffers) {
      let t33 = I6 + K4 * o34.size, r34 = n40.scalar === `u16` ? 2 : 4;
      G4.setUint16(t33 + o34.id, n40.id, true), G4.setUint8(t33 + o34.scalar, w2(n40.scalar, `codec buffer ${n40.id} scalar`)), G4.setUint8(t33 + o34.vectorWidth, n40.vectorWidth), G4.setUint16(t33 + o34.alignment, n40.alignment ?? r34, true), G4.setUint16(t33 + o34.stride, n40.stride ?? r34 * n40.vectorWidth, true), G4.setUint32(t33 + o34.usage, n40.usage ?? e5.codec.bufferUsage.storage | e5.codec.bufferUsage.copyDst, true), G4.setUint16(t33 + o34.capacityClass, n40.capacityClass ?? 1, true), K4 += 1;
    }
    for (let e29 of t32.operations) {
      let t33 = L5 + q4 * s33.size;
      G4.setUint8(t33 + s33.opcode, e29.opcode), G4.setUint8(t33 + s33.target, e29.target ?? 0), G4.setUint8(t33 + s33.operand0, e29.operand0 ?? 0), G4.setUint8(t33 + s33.operand1, e29.operand1 ?? 0), G4.setUint32(t33 + s33.immediate0, e29.immediate0 ?? 0, true), G4.setUint32(t33 + s33.immediate1, e29.immediate1 ?? 0, true), G4.setUint32(t33 + s33.immediate2, e29.immediate2 ?? 0, true), q4 += 1;
    }
    for (let n40 of t32.inputs) {
      let t33 = R5 + J4 * c30.size;
      G4.setUint8(t33 + c30.scope, e5.codec.inputScopes[n40.scope]), G4.setUint8(t33 + c30.field, n40.field), J4 += 1;
    }
  }
  return W4;
}
function f2(e29) {
  if (!I(e29)) throw TypeError(`codec descriptor needs an object`);
  if (!Array.isArray(e29.capabilitySets)) throw TypeError(`codec descriptor capabilitySets needs an array`);
  if (!Array.isArray(e29.programs)) throw TypeError(`codec descriptor programs needs an array`);
  for (let [t31, n39] of e29.capabilitySets.entries()) if (!I(n39)) throw TypeError(`codec capability set ${t31} needs an object`);
  for (let [t31, n39] of e29.programs.entries()) {
    if (!I(n39)) throw TypeError(`codec program ${t31} needs an object`);
    let e30 = n39.inputs, r34 = n39.buffers, i36 = n39.operations;
    if (!Array.isArray(e30)) throw TypeError(`codec program ${t31} inputs needs an array`);
    if (!Array.isArray(r34)) throw TypeError(`codec program ${t31} buffers needs an array`);
    if (!Array.isArray(i36)) throw TypeError(`codec program ${t31} operations needs an array`);
    for (let [n40, r35] of e30.entries()) if (!I(r35)) throw TypeError(`codec program ${t31} input ${n40} needs an object`);
    for (let [e31, n40] of r34.entries()) if (!I(n40)) throw TypeError(`codec program ${t31} buffer ${e31} needs an object`);
    for (let [e31, n40] of i36.entries()) if (!I(n40)) throw TypeError(`codec program ${t31} operation ${e31} needs an object`);
  }
}
function p2(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 1 || e29 > 4294967295) throw RangeError(`${t31} needs a nonzero u32`);
  return e29;
}
function m2(e29, t31 = `codec capability set`) {
  if (!I(e29)) throw TypeError(`${t31} needs an object`);
  let n39 = e29.capabilities;
  if (!Array.isArray(n39)) throw TypeError(`${t31} capabilities needs an array`);
  let r34 = n39.map((e30, n40) => S2(e30, `${t31} capability ${n40}`));
  if (new Set(r34).size !== r34.length) throw TypeError(`${t31} repeats a capability`);
  let i36 = Object.freeze({ capabilities: Object.freeze(r34), maxBufferBytes: e29.maxBufferBytes, updateAlignment: e29.updateAlignment, coalesceGapBytes: e29.coalesceGapBytes, rangeCallPenaltyBytes: e29.rangeCallPenaltyBytes, maxBuffersPerDraw: e29.maxBuffersPerDraw, maxResourcesPerDraw: e29.maxResourcesPerDraw, maxIndirectDraws: e29.maxIndirectDraws, fragmentationBudget: e29.fragmentationBudget, wholeBufferThresholdBasisPoints: e29.wholeBufferThresholdBasisPoints });
  return h2(i36, t31), i36;
}
function h2(e29, t31) {
  if (k(e29.maxBufferBytes, `${t31} maxBufferBytes`), k(e29.updateAlignment, `${t31} updateAlignment`), k(e29.coalesceGapBytes, `${t31} coalesceGapBytes`), k(e29.rangeCallPenaltyBytes, `${t31} rangeCallPenaltyBytes`), A(e29.maxBuffersPerDraw, `${t31} maxBuffersPerDraw`), A(e29.maxResourcesPerDraw, `${t31} maxResourcesPerDraw`), A(e29.maxIndirectDraws, `${t31} maxIndirectDraws`), A(e29.fragmentationBudget, `${t31} fragmentationBudget`), A(e29.wholeBufferThresholdBasisPoints, `${t31} wholeBufferThresholdBasisPoints`), !e29.capabilities.includes(`ordered-direct`)) throw RangeError(`${t31} does not support ordered storage`);
  if (e29.maxBufferBytes === 0 || e29.maxBuffersPerDraw === 0 || e29.maxBuffersPerDraw > 16 || e29.maxResourcesPerDraw === 0 || e29.fragmentationBudget === 0) throw RangeError(`${t31} limits need nonzero capacity within 16 buffers per draw`);
  if (!O(e29.updateAlignment) || e29.updateAlignment > 256) throw RangeError(`${t31} updateAlignment needs a power of two up to 256`);
  if (e29.coalesceGapBytes > e29.maxBufferBytes || e29.rangeCallPenaltyBytes > e29.maxBufferBytes || e29.wholeBufferThresholdBasisPoints < 1 || e29.wholeBufferThresholdBasisPoints > 1e4) throw RangeError(`${t31} upload cost model exceeds its own buffer budget`);
  if (e29.capabilities.includes(`indirect-draws`) !== e29.maxIndirectDraws > 0) throw RangeError(`${t31} must pair the indirect-draw flag with its indirect draw limit`);
}
function g2(t31, n39, r34) {
  let i36 = `codec program ${t31.programId}`, { batchFields: a34 } = e5.codec, o34 = t31.primitiveKind ?? `glyph`;
  if (T2(o34, `${i36} primitiveKind`), (t31.resourceKindMask ?? 1) === 0 && o34 !== `decoration`) throw RangeError(`${i36} accepts no resource kinds but does not publish decoration records`);
  let s33 = a34.technique | a34.resource | a34.program | a34.material | a34.clip | a34.depth | a34.order | a34.transform, c30 = s33 & ~(a34.order | a34.transform), l29 = a34.technique | a34.resource | a34.program | a34.depth, u28 = l29 | a34.order, d24 = t31.storageKeyMask ?? 0, f26 = t31.drawKeyMask ?? 0;
  if ((d24 & ~c30) !== 0 || (d24 & l29) !== l29 || (f26 & ~s33) !== 0 || (f26 & u28) !== u28) throw RangeError(`${i36} storage/draw key masks miss a required batch field or use an unknown one`);
  y2(t31);
  for (let [e29, t32] of n39.entries()) if ((r34 === 0 || r34 === e29 + 1) && !t32.capabilities.includes(`ordered-direct`)) throw RangeError(`codec capability set ${e29} lacks direct ordered allocation for ${i36}`);
}
function _(e29, t31, n39) {
  if (e29 === void 0) return 0;
  let r34 = m2(e29, `${n39} capability set`), i36 = t31.get(v2(r34));
  if (i36 === void 0) throw TypeError(`${n39} references an undeclared capability set`);
  return i36;
}
function v2(e29) {
  return [[...e29.capabilities].sort().join(`,`), e29.maxBufferBytes, e29.updateAlignment, e29.coalesceGapBytes, e29.rangeCallPenaltyBytes, e29.maxBuffersPerDraw, e29.maxResourcesPerDraw, e29.maxIndirectDraws, e29.fragmentationBudget, e29.wholeBufferThresholdBasisPoints].join(`:`);
}
function y2(t31) {
  let n39 = `codec program ${t31.programId}`;
  if (t31.f32InputCount > 32 || t31.u32InputCount > 32) throw RangeError(`${n39} input counts exceed the 32-slot register file`);
  if (t31.inputs.length !== t31.f32InputCount + t31.u32InputCount) throw TypeError(`${n39} input table length must equal its declared f32 and u32 input counts`);
  if (t31.buffers.length === 0) throw RangeError(`${n39} declares no buffers`);
  if (t31.buffers.length > 16) throw RangeError(`${n39} declares more than 16 buffers`);
  let { bufferUsage: r34 } = e5.codec, i36 = r34.vertex | r34.storage | r34.copyDst, a34 = { f32: 4, u32: 4, u16: 2 };
  for (let [e29, o35] of t31.buffers.entries()) {
    let t32 = `${n39} buffer ${e29}`;
    w2(o35.scalar, `${t32} scalar`);
    let s34 = a34[o35.scalar];
    if (o35.id === 0) throw TypeError(`${t32} uses the reserved zero id`);
    if (o35.vectorWidth < 1 || o35.vectorWidth > 4) throw RangeError(`${t32} vectorWidth needs 1..4`);
    let c30 = o35.alignment ?? s34;
    if (!O(c30) || c30 > 256) throw RangeError(`${t32} alignment needs a power of two up to 256`);
    let l29 = o35.stride ?? s34 * o35.vectorWidth;
    if (l29 < s34 * o35.vectorWidth || l29 % c30 !== 0) throw RangeError(`${t32} stride fits every lane and is a multiple of its alignment`);
    let u28 = o35.usage ?? r34.storage | r34.copyDst;
    if (u28 === 0 || (u28 & ~i36) !== 0 || (u28 & r34.copyDst) === 0) throw RangeError(`${t32} usage needs copyDst and only known usage bits`);
    if ((o35.capacityClass ?? 1) === 0) throw RangeError(`${t32} capacityClass needs a nonzero class`);
  }
  if (t31.operations.length === 0) throw RangeError(`${n39} declares no operations`);
  if (t31.operations.length > 128) throw RangeError(`${n39} declares more than 128 operations`);
  let o34 = new Uint8Array(32), s33 = /* @__PURE__ */ new Map();
  for (let [e29, n40] of t31.operations.entries()) b2(n40, e29, t31, o34, s33);
  for (let e29 of t31.buffers) if ((s33.get(e29.id) ?? 0) !== (1 << e29.vectorWidth) - 1) throw TypeError(`${n39} leaves buffer ${e29.id} lanes unwritten`);
}
function b2(t31, n39, r34, i36, a34) {
  let s33 = `codec program ${r34.programId} operation ${n39}`, { opcodes: c30 } = e5.codec;
  switch (t31.opcode) {
    case c30.loadF32:
      if ((t31.operand0 ?? 0) >= r34.f32InputCount) throw RangeError(`${s33} loads an f32 input beyond the declared count`);
      E2(i36, t31.target ?? 0, 1, s33);
      return;
    case c30.loadU32:
      if ((t31.operand0 ?? 0) >= r34.u32InputCount) throw RangeError(`${s33} loads a u32 input beyond the declared count`);
      E2(i36, t31.target ?? 0, 2, s33);
      return;
    case c30.constantF32:
      if (o6.setUint32(0, t31.immediate0 ?? 0, true), !Number.isFinite(o6.getFloat32(0, true))) throw RangeError(`${s33} constant is not a finite f32`);
      E2(i36, t31.target ?? 0, 1, s33);
      return;
    case c30.constantU32:
      E2(i36, t31.target ?? 0, 2, s33);
      return;
    case c30.addF32:
    case c30.subtractF32:
    case c30.multiplyF32:
      D2(i36, t31.operand0 ?? 0, 1, s33), D2(i36, t31.operand1 ?? 0, 1, s33), E2(i36, t31.target ?? 0, 1, s33);
      return;
    case c30.lessThanF32:
      D2(i36, t31.operand0 ?? 0, 1, s33), D2(i36, t31.operand1 ?? 0, 1, s33), E2(i36, t31.target ?? 0, 2, s33);
      return;
    case c30.selectF32:
      D2(i36, t31.operand0 ?? 0, 2, s33), D2(i36, t31.operand1 ?? 0, 1, s33), D2(i36, t31.immediate0 ?? 0, 1, s33), E2(i36, t31.target ?? 0, 1, s33);
      return;
    case c30.convertU32ToF32:
      D2(i36, t31.operand0 ?? 0, 2, s33), E2(i36, t31.target ?? 0, 1, s33);
      return;
    case c30.storeF32:
    case c30.storeU32:
    case c30.storeU16: {
      let e29 = t31.opcode === c30.storeF32 ? 1 : 2;
      D2(i36, t31.operand0 ?? 0, e29, s33), x2(t31, n39, r34, a34);
      return;
    }
    default:
      throw RangeError(`${s33} opcode ${t31.opcode} is not a known codec opcode`);
  }
}
function x2(t31, n39, r34, i36) {
  let a34 = `codec program ${r34.programId} operation ${n39}`, { opcodes: o34 } = e5.codec, s33 = t31.immediate0 ?? 0, c30 = r34.buffers.find((e29) => e29.id === s33);
  if (c30 === void 0) throw TypeError(`${a34} stores into undeclared buffer ${s33}`);
  let l29 = t31.opcode === o34.storeF32 ? `f32` : t31.opcode === o34.storeU32 ? `u32` : `u16`;
  if (c30.scalar !== l29) throw TypeError(`${a34} stores ${l29} lanes into a ${c30.scalar} buffer`);
  let u28 = t31.operand1 ?? 0;
  if (u28 >= c30.vectorWidth) throw RangeError(`${a34} lane exceeds the buffer width`);
  let d24 = 1 << u28;
  if (((i36.get(s33) ?? 0) & d24) !== 0) throw TypeError(`${a34} writes buffer ${s33} lane ${u28} twice`);
  i36.set(s33, (i36.get(s33) ?? 0) | d24);
}
function S2(e29, t31) {
  if (e29 !== `storage-buffers` && e29 !== `indirect-draws` && e29 !== `alias-vec2` && e29 !== `alias-vec4` && e29 !== `ordered-direct`) throw TypeError(`${t31} is not a known codec capability`);
  return e29;
}
function C2(t31) {
  let n39 = e5.codec.capabilityFlags, r34 = { "storage-buffers": n39.storageBuffers, "indirect-draws": n39.indirectDraws, "alias-vec2": n39.aliasVec2, "alias-vec4": n39.aliasVec4, "ordered-direct": n39.orderedDirect };
  return t31.capabilities.reduce((e29, t32) => e29 | r34[t32], 0);
}
function w2(t31, n39) {
  let r34 = e5.codec.scalarTypes;
  if (t31 === `f32`) return r34.f32;
  if (t31 === `u32`) return r34.u32;
  if (t31 === `u16`) return r34.u16;
  throw TypeError(`${n39} is not f32, u32, or u16`);
}
function T2(t31, n39) {
  if (t31 === `glyph`) return e5.engine.primitiveKinds.glyph;
  if (t31 === `decoration`) return e5.engine.primitiveKinds.decoration;
  throw TypeError(`${n39} is not glyph or decoration`);
}
function E2(e29, t31, n39, r34) {
  if (t31 >= 32) throw RangeError(`${r34} targets a register beyond the register file`);
  e29[t31] = n39;
}
function D2(e29, t31, n39, r34) {
  if (t31 >= 32) throw RangeError(`${r34} reads a register beyond the register file`);
  let i36 = e29[t31];
  if (i36 === 0) throw TypeError(`${r34} reads register ${t31} before it is written`);
  if (i36 !== n39) throw TypeError(`${r34} register ${t31} holds the other wire type`);
}
function O(e29) {
  return Number.isSafeInteger(e29) && e29 > 0 && !(e29 & e29 - 1);
}
function k(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > a6) throw RangeError(`${t31} needs a u32`);
  return e29;
}
function A(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 65535) throw RangeError(`${t31} needs a u16`);
  return e29;
}
function j(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 255) throw RangeError(`${t31} needs a u8`);
  return e29;
}
function M(e29, t31) {
  return e29.reduce((e30, n39) => P(e30, t31(n39), `codec record count`), 0);
}
function N(e29, t31, n39) {
  if (!Number.isSafeInteger(t31) || t31 < 1) throw RangeError(`${n39} needs a positive integer alignment`);
  let r34 = Math.ceil(e29 / t31) * t31;
  if (!Number.isSafeInteger(r34) || r34 > a6) throw RangeError(`${n39} offset exceeds u32`);
  return r34;
}
function P(e29, t31, n39) {
  let r34 = e29 + t31;
  if (!Number.isSafeInteger(r34) || r34 > a6) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function F(e29, t31, n39) {
  let r34 = e29 * t31;
  if (!Number.isSafeInteger(r34) || r34 > a6) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function I(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/internal/resources.js
var e7 = Object.freeze([`r8unorm`, `rgba8unorm`, `rgba16float`, `rgba32uint`, `r32uint`]);
var t5 = Object.freeze([`buffer`, `texture`, `texture-array`, `geometry`, `group`]);
var n6 = Object.freeze([`triangle-list`, `triangle-strip`]);
var r6 = Object.freeze({ f32: 4, u32: 4, i16: 2, u16: 2, u8: 1 });
var i6 = Object.freeze({ r8unorm: 1, rgba8unorm: 4, rgba16float: 8, rgba32uint: 16, r32uint: 4 });
function o7(e29, t31, n39, r34, i36, a34) {
  if (e29 === `buffer`) return m3(t31, n39);
  if (e29 === `texture` || e29 === `texture-array`) return h3(e29, t31, n39, r34);
  if (e29 === `geometry`) {
    g3(t31, n39), i36 !== void 0 && _2(t31, n39, i36);
    return;
  }
  if (e29 === `group`) return c5(t31, n39, a34);
  throw TypeError(`portable resource kind "${e29}" is not reserved by the core contract`);
}
function s5(e29, t31, n39, r34, i36, a34) {
  if (e29 === `buffer`) {
    O2(n39, t31, `buffer`);
    let a35 = n39, s33 = a35.bytes;
    if (!(s33 instanceof Uint8Array)) throw TypeError(`portable buffer "${t31}" needs Uint8Array bytes`);
    let c30 = a35.stride, l29 = { kind: e29, bytes: s33, ...c30 === void 0 ? {} : { stride: c30 } };
    return o7(e29, t31, l29, r34, i36), Object.freeze({ ...l29, bytes: new Uint8Array(s33) });
  }
  if (e29 === `texture` || e29 === `texture-array`) {
    O2(n39, t31, e29);
    let a35 = n39, s33 = a35.bytes;
    if (!(s33 instanceof Uint8Array)) throw TypeError(`portable ${e29} "${t31}" needs Uint8Array bytes`);
    let c30 = a35.format, l29 = a35.width, u28 = a35.height, d24 = e29 === `texture-array` ? a35.layers : void 0, f26 = { kind: e29, format: c30, width: l29, height: u28, ...d24 === void 0 ? {} : { layers: d24 }, bytes: s33 };
    return o7(e29, t31, f26, r34, i36), Object.freeze({ ...f26, bytes: new Uint8Array(s33) });
  }
  if (e29 === `geometry`) {
    O2(n39, t31, `geometry`);
    let a35 = n39, s33 = a35.bytes, c30 = a35.views, m24 = a35.accessors, h24 = a35.attributes, g23 = a35.indices, _20 = a35.drawRange, v22 = a35.topology;
    if (Object.hasOwn(a35, `instances`)) throw TypeError(`portable geometry "${t31}" instance count comes from command-buffer records`);
    if (!(s33 instanceof Uint8Array)) throw TypeError(`portable geometry "${t31}" needs Uint8Array bytes`);
    if (!Array.isArray(c30)) throw TypeError(`portable geometry "${t31}" needs at least one buffer view`);
    if (!Array.isArray(m24)) throw TypeError(`portable geometry "${t31}" needs at least one accessor`);
    if (!Array.isArray(h24)) throw TypeError(`portable geometry "${t31}" needs at least one attribute`);
    let y22 = l3(c30, t31), b20 = u3(m24, t31), x19 = d3(h24, t31), S17 = g23 === void 0 ? void 0 : f3(g23, t31), C17 = _20 === void 0 ? void 0 : p3(_20, t31), w15 = { kind: e29, topology: v22, bytes: s33, views: y22, accessors: b20, attributes: x19, ...S17 === void 0 ? {} : { indices: S17 }, ...C17 === void 0 ? {} : { drawRange: C17 } };
    return o7(e29, t31, w15, r34, i36), Object.freeze({ ...w15, bytes: new Uint8Array(s33) });
  }
  if (e29 === `group`) {
    c5(t31, n39, a34);
    let r35 = n39, i37 = /* @__PURE__ */ Object.create(null);
    for (let [e30, n40] of Object.entries(r35.members)) {
      let r36 = a34?.[e30];
      i37[e30] = s5(r36?.kind ?? n40.kind, `${t31}.${e30}`, n40, r36?.format);
    }
    return Object.freeze({ kind: e29, members: Object.freeze(i37) });
  }
  throw TypeError(`portable resource kind "${e29}" is not reserved by the core contract`);
}
function c5(e29, t31, n39) {
  O2(t31, e29, `group`);
  let r34 = t31.members;
  if (!k2(r34) || Object.keys(r34).length === 0) throw TypeError(`portable resource group "${e29}" needs named members`);
  if (n39 !== void 0) {
    let t32 = Object.keys(n39), i36 = Object.keys(r34);
    if (t32.length !== i36.length || i36.some((e30) => !Object.hasOwn(n39, e30))) throw TypeError(`portable resource group "${e29}" members do not match its declaration`);
  }
  for (let [t32, i36] of Object.entries(r34)) {
    if (t32.length === 0) throw TypeError(`portable resource group "${e29}" has an empty member name`);
    if (!k2(i36)) throw TypeError(`portable resource group "${e29}" member "${t32}" needs a leaf resource`);
    let r35 = i36.kind;
    if (r35 === `group`) throw TypeError(`portable resource group "${e29}" member "${t32}" needs a leaf resource`);
    let a34 = n39?.[t32];
    if (a34 !== void 0 && r35 !== a34.kind) throw TypeError(`portable resource group "${e29}" member "${t32}" has the wrong payload kind`);
    o7(r35, `${e29}.${t32}`, i36, a34?.format);
  }
}
function l3(e29, t31) {
  return Object.freeze(e29.map((e30, n39) => {
    if (!k2(e30)) throw TypeError(`portable geometry "${t31}" buffer view ${n39} needs an object`);
    return Object.freeze({ offset: e30.offset, length: e30.length });
  }));
}
function u3(e29, t31) {
  return Object.freeze(e29.map((e30, n39) => {
    if (!k2(e30)) throw TypeError(`portable geometry "${t31}" accessor ${n39} needs an object`);
    return Object.freeze({ componentType: e30.componentType, components: e30.components, view: e30.view, count: e30.count, ...e30.offset === void 0 ? {} : { offset: e30.offset } });
  }));
}
function d3(e29, t31) {
  return Object.freeze(e29.map((e30, n39) => {
    if (!k2(e30)) throw TypeError(`portable geometry "${t31}" attribute ${n39} needs an object`);
    if (Object.hasOwn(e30, `rate`)) throw TypeError(`portable geometry "${t31}" attribute ${n39} must be vertex-rate`);
    return Object.freeze({ semantic: e30.semantic, accessor: e30.accessor });
  }));
}
function f3(e29, t31) {
  if (!k2(e29)) throw TypeError(`portable geometry "${t31}" indices need an object`);
  return Object.freeze({ accessor: e29.accessor });
}
function p3(e29, t31) {
  if (!k2(e29)) throw TypeError(`portable geometry "${t31}" draw range needs an object`);
  return Object.freeze({ start: e29.start, count: e29.count });
}
function m3(e29, t31) {
  if (O2(t31, e29, `buffer`), !(t31.bytes instanceof Uint8Array)) throw TypeError(`portable buffer "${e29}" needs Uint8Array bytes`);
  let n39 = t31.stride;
  if (n39 !== void 0) {
    if (!Number.isSafeInteger(n39) || n39 < 1) throw RangeError(`portable buffer "${e29}" needs a positive record stride`);
    if (t31.bytes.byteLength % n39 !== 0) throw RangeError(`portable buffer "${e29}" byte length ${t31.bytes.byteLength} is not whole ${n39}-byte records`);
  }
}
function h3(e29, t31, n39, r34) {
  if (O2(n39, t31, e29), !Object.hasOwn(i6, n39.format)) throw TypeError(`portable texture "${t31}" needs a supported sample format`);
  if (r34 !== void 0 && n39.format !== r34) throw TypeError(`portable texture "${t31}" format "${n39.format}" does not match declared format "${r34}"`);
  for (let e30 of [`width`, `height`]) if (!Number.isSafeInteger(n39[e30]) || n39[e30] < 1) throw RangeError(`portable texture "${t31}" needs a positive integer ${e30}`);
  let a34 = n39.layers;
  if (e29 === `texture-array` && (typeof a34 != `number` || !Number.isSafeInteger(a34) || a34 < 1)) throw RangeError(`portable texture-array "${t31}" needs a positive integer layer count`);
  if (!(n39.bytes instanceof Uint8Array)) throw TypeError(`portable texture "${t31}" needs Uint8Array bytes`);
  let o34 = D3(n39.width, n39.height, e29 === `texture-array` ? a34 : 1, i6[n39.format], t31);
  if (n39.bytes.byteLength !== o34) throw RangeError(`portable ${e29} "${t31}" needs exactly ${o34} bytes; got ${n39.bytes.byteLength}`);
}
function g3(e29, t31) {
  if (O2(t31, e29, `geometry`), Object.hasOwn(t31, `instances`)) throw TypeError(`portable geometry "${e29}" instance count comes from command-buffer records`);
  if (!v3(t31.topology)) throw TypeError(`portable geometry "${e29}" needs a triangle-list or triangle-strip topology`);
  if (!(t31.bytes instanceof Uint8Array)) throw TypeError(`portable geometry "${e29}" needs Uint8Array bytes`);
  b3(t31.views, t31.bytes.byteLength, e29);
  let n39 = x3(t31.accessors, t31.views, e29), r34 = S3(t31.attributes, n39, e29), i36 = t31.indices === void 0 ? void 0 : C3(t31.indices, n39, t31.bytes, t31.views, r34, e29);
  w3(t31.drawRange ?? { start: 0, count: i36 ?? r34 }, i36 ?? r34, e29, i36 !== void 0, t31.topology);
}
function _2(e29, t31, n39) {
  let r34 = new Map(t31.attributes.map((e30) => [e30.semantic, e30]));
  for (let i36 of n39) {
    let n40 = r34.get(i36.semantic);
    if (n40 === void 0) throw TypeError(`portable geometry "${e29}" omits required vertex input "${i36.semantic}"`);
    let a34 = t31.accessors[n40.accessor];
    if (a34.componentType !== i36.componentType || a34.components !== i36.components) throw TypeError(`portable geometry "${e29}" vertex input "${i36.semantic}" needs ${i36.componentType}x${i36.components}`);
  }
}
function v3(e29) {
  return e29 === `triangle-list` || e29 === `triangle-strip`;
}
function y3(e29) {
  return Array.isArray(e29);
}
function b3(e29, t31, n39) {
  if (!y3(e29) || e29.length === 0) throw TypeError(`portable geometry "${n39}" needs at least one buffer view`);
  e29.forEach((e30, r34) => {
    if (typeof e30?.offset != `number` || !Number.isSafeInteger(e30.offset) || e30.offset < 0) throw RangeError(`portable geometry "${n39}" buffer view ${r34} needs a nonnegative byte offset`);
    if (typeof e30.length != `number` || !Number.isSafeInteger(e30.length) || e30.length < 0) throw RangeError(`portable geometry "${n39}" buffer view ${r34} needs a nonnegative byte length`);
    let i36 = e30.offset + e30.length;
    if (!Number.isSafeInteger(i36) || i36 > t31) throw RangeError(`portable geometry "${n39}" buffer view ${r34} exceeds its ${t31} bytes`);
  });
}
function x3(e29, t31, n39) {
  if (!y3(e29) || e29.length === 0) throw TypeError(`portable geometry "${n39}" needs at least one accessor`);
  return e29.forEach((e30, i36) => {
    let a34 = `portable geometry "${n39}" accessor ${i36}`;
    if (!k2(e30)) throw TypeError(`${a34} needs an accessor object`);
    if (!Object.hasOwn(r6, e30.componentType)) throw TypeError(`${a34} needs an f32, u32, i16, u16, or u8 component type`);
    if (!Number.isSafeInteger(e30.components) || e30.components < 1 || e30.components > 4) throw RangeError(`${a34} needs one to four components`);
    if (!Number.isSafeInteger(e30.view) || e30.view < 0 || e30.view >= t31.length) throw RangeError(`${a34} names a buffer view outside the geometry`);
    if (!Number.isSafeInteger(e30.count) || e30.count < 0) throw RangeError(`${a34} needs a nonnegative element count`);
    let o34 = e30.offset ?? 0;
    if (!Number.isSafeInteger(o34) || o34 < 0) throw RangeError(`${a34} needs a nonnegative byte offset`);
    let s33 = r6[e30.componentType], c30 = t31[e30.view].offset + o34;
    if (c30 % s33 !== 0) throw RangeError(`${a34} absolute byte offset ${c30} is not aligned to ${s33} bytes`);
    let l29 = o34 + T3(e30.count, e30.components, s33, a34);
    if (l29 > t31[e30.view].length) throw RangeError(`${a34} reads past its buffer view (${l29} of ${t31[e30.view].length} bytes)`);
  }), e29;
}
function S3(e29, t31, n39) {
  if (!y3(e29) || e29.length === 0) throw TypeError(`portable geometry "${n39}" needs at least one attribute`);
  let r34 = false, i36, a34 = /* @__PURE__ */ new Set();
  if (e29.forEach((e30, o34) => {
    let s33 = `portable geometry "${n39}" attribute ${o34}`;
    if (!k2(e30)) throw TypeError(`${s33} needs an attribute object`);
    if (Object.hasOwn(e30, `rate`)) throw TypeError(`${s33} must be vertex-rate`);
    if (E3(e30.semantic, s33), a34.has(e30.semantic)) throw TypeError(`${s33} repeats semantic "${e30.semantic}"`);
    if (a34.add(e30.semantic), !Number.isSafeInteger(e30.accessor) || e30.accessor < 0 || e30.accessor >= t31.length) throw RangeError(`${s33} names an accessor outside the geometry`);
    e30.semantic === `position` && (r34 = true);
    let c30 = t31[e30.accessor].count;
    if (i36 === void 0) i36 = c30;
    else if (i36 !== c30) throw RangeError(`${s33} disagrees with the other vertex accessor counts (${i36})`);
  }), !r34) throw TypeError(`portable geometry "${n39}" needs a position attribute`);
  if (i36 === void 0 || i36 < 1) throw RangeError(`portable geometry "${n39}" needs at least one vertex`);
  return i36;
}
function C3(e29, t31, n39, r34, i36, a34) {
  let o34 = `portable geometry "${a34}" indices`;
  if (!k2(e29)) throw TypeError(`${o34} need an indices object`);
  if (typeof e29.accessor != `number` || !Number.isSafeInteger(e29.accessor)) throw TypeError(`${o34} need an accessor index`);
  let s33 = t31[e29.accessor];
  if (s33 === void 0) throw RangeError(`${o34} name an accessor outside the geometry`);
  if (s33.componentType !== `u16` && s33.componentType !== `u32`) throw TypeError(`${o34} need a u16 or u32 integer component type`);
  if (s33.components !== 1) throw RangeError(`${o34} need scalar indices`);
  if (s33.count < 1) throw RangeError(`${o34} need at least one index`);
  let c30 = r34[s33.view].offset + (s33.offset ?? 0), l29 = new DataView(n39.buffer, n39.byteOffset, n39.byteLength), u28 = s33.componentType === `u16` ? 2 : 4;
  for (let e30 = 0; e30 < s33.count; e30 += 1) {
    let t32 = s33.componentType === `u16` ? l29.getUint16(c30 + e30 * u28, true) : l29.getUint32(c30 + e30 * u28, true);
    if (t32 >= i36) throw RangeError(`${o34} value ${t32} at index ${e30} names vertex ${t32} outside ${i36} vertices`);
  }
  return s33.count;
}
function w3(e29, t31, n39, r34, i36) {
  let a34 = `portable geometry "${n39}" ${r34 ? `index` : `vertex`} draw range`;
  if (!k2(e29)) throw TypeError(`${a34} needs a range object`);
  for (let t32 of [`start`, `count`]) {
    let n40 = e29[t32];
    if (typeof n40 != `number` || !Number.isSafeInteger(n40) || n40 < 0) throw RangeError(`${a34} needs a nonnegative ${t32}`);
  }
  if (e29.count === 0) throw RangeError(`${a34} cannot be empty`);
  let o34 = e29.start + e29.count;
  if (!Number.isSafeInteger(o34) || o34 > t31) throw RangeError(`${a34} exceeds the ${t31} available ${r34 ? `indices` : `vertices`}`);
  if (e29.count < 3 || i36 === `triangle-list` && e29.count % 3 != 0) throw RangeError(`${a34} count ${e29.count} does not contain complete ${i36} primitives`);
}
function T3(e29, t31, n39, r34) {
  let i36 = e29 * t31 * n39;
  if (!Number.isSafeInteger(i36)) throw RangeError(`${r34} exceeds a safe byte span`);
  return i36;
}
function E3(e29, t31) {
  if (typeof e29 != `string` || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(e29) || e29 === `__proto__` || e29 === `constructor` || e29 === `prototype`) throw TypeError(`${t31} needs a safe shader attribute name`);
}
function D3(e29, t31, n39, r34, i36) {
  let a34 = e29 * t31 * n39 * r34;
  if (!Number.isSafeInteger(a34)) throw RangeError(`portable texture "${i36}" byte length exceeds a safe size`);
  return a34;
}
function O2(e29, t31, n39) {
  if (!k2(e29)) throw TypeError(`portable ${n39} resource "${t31}" needs a payload object`);
  if (e29.kind !== n39) throw TypeError(`portable ${n39} resource "${t31}" declares the wrong payload kind`);
}
function k2(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/internal/schema.js
var r7 = Symbol(`glyph.technique-schema`);
var i7 = /* @__PURE__ */ new WeakSet();
function a7(t31) {
  if (!m4(t31)) throw TypeError(`codec buffers need a declaration object`);
  let n39 = /* @__PURE__ */ new Set(), r34 = /* @__PURE__ */ Object.create(null);
  for (let [i36, a34] of Object.entries(t31)) {
    if (i36.length === 0) throw TypeError(`codec buffer names must not be empty`);
    let t32 = m4(a34) ? a34.lanes : void 0;
    if (!Array.isArray(t32)) throw TypeError(`codec buffer "${i36}" needs a declaration with named lanes`);
    let o34 = a5(a34.id, `buffer`, `codec buffer "${i36}" id`), s33 = a34.scalar, c30 = t32.map((e29, t33) => {
      if (typeof e29 != `string` || e29.length === 0) throw TypeError(`codec buffer "${i36}" lane ${t33} needs a nonempty name`);
      return e29;
    });
    if (!Number.isSafeInteger(o34) || o34 <= 0 || o34 > 65535) throw RangeError(`codec buffer "${i36}" needs a nonzero u16 id`);
    if (n39.has(o34)) throw TypeError(`codec buffer "${i36}" reuses id ${o34}`);
    if (n39.add(o34), s33 !== `f32` && s33 !== `u32`) throw TypeError(`codec buffer "${i36}" needs an f32 or u32 scalar kind`);
    if (c30.length === 0 || c30.length > 4) throw RangeError(`codec buffer "${i36}" needs one to four named lanes`);
    if (new Set(c30).size !== c30.length) throw TypeError(`codec buffer "${i36}" repeats a lane name`);
    r34[i36] = Object.freeze({ id: o34, scalar: s33, lanes: Object.freeze(c30) });
  }
  return Object.freeze(r34);
}
function o8(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29) && Object.isFrozen(e29) && i7.has(e29);
}
function s6(e29) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`technique schemas need a declaration object`);
  let t31 = e29.technique;
  if (typeof t31 != `string` || t31.length === 0) throw TypeError(`technique schemas need a wire identity`);
  let n39 = e29.scope;
  if (n39 !== `glyph` && n39 !== `strike` && n39 !== `resource`) throw TypeError(`technique "${t31}" needs a glyph, strike, or resource binding scope`);
  let o34 = e29.binding;
  if (!m4(o34)) throw TypeError(`technique "${t31}" needs a binding object`);
  let s33 = p4(o34.f32, t31, `f32`), l29 = p4(o34.u32, t31, `u32`), d24 = [...s33 ?? [], ...l29 ?? []];
  if (new Set(d24).size !== d24.length) throw TypeError(`technique "${t31}" repeats a binding field name`);
  let f26 = a7(e29.buffers), h24 = Object.freeze(/* @__PURE__ */ Object.create(null)), g23 = e29.resources;
  if (g23 !== void 0) {
    if (!m4(g23)) throw TypeError(`technique "${t31}" resources need a declaration object`);
    let e30 = /* @__PURE__ */ Object.create(null);
    for (let [n40, r34] of Object.entries(g23)) {
      if (n40.length === 0) throw TypeError(`technique "${t31}" resource names must not be empty`);
      e30[n40] = c6(r34, n40, t31);
    }
    h24 = Object.freeze(e30);
  }
  let _20 = Object.freeze({ geometry: Object.freeze({ kind: `synthetic-quad` }) }), v22 = e29.render;
  if (Object.keys(h24).length !== 0 && v22 === void 0) throw TypeError(`technique "${t31}" with resources needs a declared render resource`);
  if (v22 !== void 0) {
    if (typeof v22 != `object` || !v22 || Array.isArray(v22)) throw TypeError(`technique "${t31}" render declaration needs an object`);
    let e30 = v22.resource;
    if (Object.keys(h24).length !== 0 && e30 === void 0) throw TypeError(`technique "${t31}" with resources needs a declared render resource`);
    if (e30 !== void 0 && (typeof e30 != `string` || !Object.hasOwn(h24, e30))) throw TypeError(`technique "${t31}" render resource must name a declared resource`);
    let n40 = Object.entries(h24).filter(([, e31]) => e31.cardinality === `many`).map(([e31]) => e31);
    if (n40.length > 1) throw TypeError(`technique "${t31}" may declare only one repeated resource role`);
    if (n40.length === 1 && e30 !== n40[0]) throw TypeError(`technique "${t31}" must select its repeated resource as the render resource`);
    _20 = Object.freeze({ ...e30 === void 0 ? {} : { resource: e30 }, geometry: u4(v22.geometry, t31, h24) });
  }
  let y22, b20 = e29.glyphOrigin;
  if (b20 !== void 0) {
    let e30 = m4(b20) ? b20.buffer : void 0;
    if (typeof e30 != `string`) throw TypeError(`technique "${t31}" glyphOrigin needs a buffer name`);
    let n40 = Object.hasOwn(f26, e30) ? f26[e30] : void 0;
    if (n40 === void 0) throw TypeError(`technique "${t31}" points glyphOrigin at an undeclared buffer`);
    if (n40.scalar !== `f32` || n40.lanes.length < 2) throw TypeError(`technique "${t31}" needs an f32 glyphOrigin buffer with two origin lanes`);
    y22 = Object.freeze({ buffer: e30 });
  }
  let x19 = Object.freeze({ ...s33 === void 0 ? {} : { f32: s33 }, ...l29 === void 0 ? {} : { u32: l29 } }), S17 = { [r7]: true, technique: t31, scope: n39, binding: x19, buffers: f26, resources: h24, render: _20, ...y22 === void 0 ? {} : { glyphOrigin: y22 } }, C17 = Object.freeze(S17);
  return i7.add(C17), C17;
}
function c6(e29, t31, n39) {
  let r34 = e29, i36 = r34?.kind;
  if (typeof i36 != `string` || i36.length === 0) throw TypeError(`technique "${n39}" resource "${t31}" needs a nonempty resource kind`);
  let a34 = Object.keys(e29 ?? {}), o34 = r34?.cardinality ?? `one`;
  if (o34 !== `one` && o34 !== `many`) throw TypeError(`technique "${n39}" resource "${t31}" needs one or many cardinality`);
  if (i36 === `buffer`) {
    if (a34.some((e30) => e30 !== `kind` && e30 !== `cardinality`)) throw TypeError(`technique "${n39}" ${i36} resource "${t31}" declares kind and cardinality only`);
    return Object.freeze({ kind: i36, ...o34 === `many` ? { cardinality: o34 } : {} });
  }
  if (i36 === `geometry`) {
    if (o34 !== `one`) throw TypeError(`technique "${n39}" geometry resource "${t31}" must have one cardinality`);
    if (a34.some((e31) => e31 !== `kind` && e31 !== `attributes` && e31 !== `cardinality`)) throw TypeError(`technique "${n39}" geometry resource "${t31}" declares kind, attributes, and cardinality only`);
    let e30 = r34.attributes;
    return Object.freeze({ kind: i36, attributes: l4(e30, t31, n39) });
  }
  if (i36 === `group`) {
    if (a34.some((e31) => e31 !== `kind` && e31 !== `members` && e31 !== `cardinality`)) throw TypeError(`technique "${n39}" group resource "${t31}" declares kind, members, and cardinality only`);
    let e30 = r34.members;
    if (!m4(e30) || Object.keys(e30).length === 0) throw TypeError(`technique "${n39}" group resource "${t31}" needs named members`);
    let s34 = /* @__PURE__ */ Object.create(null);
    for (let [r35, i37] of Object.entries(e30)) {
      if (r35.length === 0) throw TypeError(`technique "${n39}" group resource "${t31}" has an empty member name`);
      let e31 = m4(i37) ? i37.kind : void 0;
      if (!m4(i37) || i37.cardinality === `many` || e31 === `geometry` || e31 === `group`) throw TypeError(`technique "${n39}" group resource "${t31}.${r35}" needs one leaf payload`);
      let a35 = c6(i37, `${t31}.${r35}`, n39);
      if (a35.kind === `geometry` || a35.kind === `group`) throw TypeError(`technique "${n39}" group resource "${t31}.${r35}" needs one leaf payload`);
      s34[r35] = a35;
    }
    return Object.freeze({ kind: i36, members: Object.freeze(s34), ...o34 === `many` ? { cardinality: o34 } : {} });
  }
  if (i36 !== `texture` && i36 !== `texture-array`) throw TypeError(`technique "${n39}" resource "${t31}" needs a portable resource kind`);
  let s33 = r34.format;
  if (!f4(s33)) throw TypeError(`technique "${n39}" resource "${t31}" needs a supported texture format`);
  if (a34.some((e30) => e30 !== `kind` && e30 !== `format` && e30 !== `cardinality`)) throw TypeError(`technique "${n39}" resource "${t31}" declares kind, format, and cardinality only`);
  return Object.freeze({ kind: i36, format: s33, ...o34 === `many` ? { cardinality: o34 } : {} });
}
function l4(e29, n39, r34) {
  if (!Array.isArray(e29) || e29.length === 0) throw TypeError(`technique "${r34}" geometry resource "${n39}" needs vertex inputs`);
  let i36 = /* @__PURE__ */ new Set();
  return Object.freeze(e29.map((e30, a34) => {
    let o34 = `technique "${r34}" geometry resource "${n39}" input ${a34}`;
    if (!m4(e30)) throw TypeError(`${o34} needs an object`);
    if (Object.keys(e30).some((e31) => e31 !== `semantic` && e31 !== `componentType` && e31 !== `components`)) throw TypeError(`${o34} declares only semantic, componentType, and components`);
    if (E3(e30.semantic, o34), i36.has(e30.semantic)) throw TypeError(`${o34} repeats semantic "${e30.semantic}"`);
    i36.add(e30.semantic);
    let s33 = e30.componentType;
    if (s33 !== `f32` && s33 !== `u32` && s33 !== `i16` && s33 !== `u16` && s33 !== `u8`) throw TypeError(`${o34} needs an f32, u32, i16, u16, or u8 component type`);
    let c30 = e30.components;
    if (c30 !== 1 && c30 !== 2 && c30 !== 3 && c30 !== 4) throw RangeError(`${o34} needs one to four components`);
    return Object.freeze({ semantic: e30.semantic, componentType: s33, components: c30 });
  }));
}
function u4(e29, t31, n39) {
  let r34 = e29?.kind;
  if (typeof r34 != `string` || r34.length === 0) throw TypeError(`technique "${t31}" needs a nonempty render geometry kind`);
  let i36 = e29.resource, a34 = e29.coordinates;
  if (r34 === `synthetic-quad`) {
    if (i36 !== void 0 || a34 !== void 0) throw TypeError(`technique "${t31}" synthetic-quad geometry declares no resource or coordinate convention`);
    return Object.freeze({ kind: `synthetic-quad` });
  }
  if (typeof i36 != `string` || i36.length === 0) throw TypeError(`technique "${t31}" geometry "${r34}" needs a declared geometry resource`);
  let o34 = Object.hasOwn(n39, i36) ? n39[i36] : void 0;
  if (o34 === void 0) throw TypeError(`technique "${t31}" points its "${r34}" geometry at undeclared resource "${i36}"`);
  if (o34.kind !== `geometry`) throw TypeError(`technique "${t31}" geometry resource "${i36}" needs the geometry resource kind`);
  if (a34 !== `unit-square` && a34 !== `em`) throw TypeError(`technique "${t31}" geometry "${r34}" needs unit-square or em coordinates`);
  if (r34 === `custom`) {
    let n40 = e29.name;
    if (typeof n40 != `string` || n40.length === 0) throw TypeError(`technique "${t31}" custom geometry needs a branded name`);
    return Object.freeze({ kind: r34, name: n40, resource: i36, coordinates: a34 });
  }
  if (r34 !== `quad` && r34 !== `hull`) throw TypeError(`technique "${t31}" geometry needs a supported or branded custom kind`);
  return Object.freeze({ kind: r34, resource: i36, coordinates: a34 });
}
function f4(e29) {
  return typeof e29 == `string` && e7.includes(e29);
}
function p4(e29, t31, n39) {
  if (e29 === void 0) return;
  if (!Array.isArray(e29)) throw TypeError(`technique "${t31}" ${n39} binding needs a name list`);
  let r34 = e29.map((e30, r35) => {
    if (typeof e30 != `string` || e30.length === 0) throw TypeError(`technique "${t31}" ${n39} binding name ${r35} needs a nonempty string`);
    return e30;
  });
  return Object.freeze(r34);
}
function m4(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function h4(e29) {
  return Object.values(e29.buffers).map((e30) => ({ id: e30.id, scalar: e30.scalar, vectorWidth: e30.lanes.length }));
}

// node_modules/@pmndrs/glyph/dist/internal/codec-program-contract.js
var n7 = /* @__PURE__ */ new WeakMap();
function r8(e29, t31) {
  n7.set(e29, t31);
}
function i8(e29, t31) {
  if (!c7(t31)) throw TypeError(`codec system buffers need an object`);
  let n39 = s7(t31.stableGlyphId, `stableGlyphId`), r34 = t31.transformIndex === void 0 ? void 0 : s7(t31.transformIndex, `transformIndex`), i36 = t31.placementSlot === void 0 ? void 0 : s7(t31.placementSlot, `placementSlot`), a34 = new Set(Object.values(e29).map((e30) => e30.id));
  if (a34.has(n39.id)) throw TypeError(`stableGlyphId system buffer collides with a technique buffer`);
  if (r34 !== void 0) {
    if (r34.id === n39.id) throw TypeError(`transformIndex and stableGlyphId system buffers collide`);
    if (a34.has(r34.id)) throw TypeError(`transformIndex system buffer collides with a technique buffer`);
  }
  if (i36 !== void 0) {
    if (i36.id === n39.id || i36.id === r34?.id) throw TypeError(`placementSlot system buffer collides with another system buffer`);
    if (a34.has(i36.id)) throw TypeError(`placementSlot system buffer collides with a technique buffer`);
  }
  return Object.freeze({ stableGlyphId: n39, ...r34 === void 0 ? {} : { transformIndex: r34 }, ...i36 === void 0 ? {} : { placementSlot: i36 } });
}
function a8(t31, n39, i36, a34) {
  let o34 = e5.codec.opcodes, s33 = i36.placementSlot === void 0 ? void 0 : a34 ?? { buffer: i36.placementSlot.id, lane: 0 }, c30 = a34 === void 0 ? [...t31.operations] : t31.operations.filter((e29) => e29.opcode !== o34.storeU32 || e29.immediate0 !== a34.buffer || (e29.operand1 ?? 0) !== a34.lane), l29 = (e29, t32, n40 = 0) => {
    c30.push({ opcode: o34.loadU32, target: 0, operand0: e29 }, { opcode: o34.storeU32, operand0: 0, operand1: n40, immediate0: t32 });
  };
  l29(1, i36.stableGlyphId.id), i36.transformIndex !== void 0 && l29(0, i36.transformIndex.id), s33 !== void 0 && l29(2, s33.buffer, s33.lane);
  let u28 = { ...t31, operations: c30 };
  return r8(u28, { schema: n39, stableGlyphId: i36.stableGlyphId.id, transformIndex: i36.transformIndex?.id, placementSlot: s33 }), u28;
}
function o9(e29, t31, r34, i36) {
  let a34 = typeof e29 == `object` && e29 ? n7.get(e29) : void 0;
  if (a34?.schema !== t31) throw TypeError(`technique "${t31.technique}" codec body does not belong to its registered schema`);
  let o34 = r34?.placementSlot === void 0 ? void 0 : i36 ?? { buffer: r34.placementSlot.id, lane: 0 };
  if (r34 !== void 0 && (a34.stableGlyphId !== r34.stableGlyphId.id || a34.transformIndex !== r34.transformIndex?.id || a34.placementSlot?.buffer !== o34?.buffer || a34.placementSlot?.lane !== o34?.lane)) throw TypeError(`technique "${t31.technique}" codec body does not use the requested system buffers`);
}
function s7(e29, n39) {
  if (!c7(e29)) throw TypeError(`${n39} system buffer needs one u32 "${n39}" lane`);
  let r34 = e29.lanes, i36 = e29.id;
  if (typeof i36 != `number` || !Number.isSafeInteger(i36) || i36 <= 0 || i36 > 65535 || e29.scalar !== `u32` || !Array.isArray(r34) || r34.length !== 1 || r34[0] !== n39) throw TypeError(`${n39} system buffer needs one u32 "${n39}" lane`);
  let a34 = [n39];
  return Object.freeze({ id: a5(i36, `buffer`, `${n39} system buffer id`), scalar: `u32`, lanes: a34 });
}
function c7(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/internal/codec-program.js
var r9 = /* @__PURE__ */ new WeakMap();
function i9(e29) {
  let t31 = {};
  return r9.set(t31, e29), t31;
}
function a9(e29) {
  let t31 = {};
  return r9.set(t31, e29), t31;
}
function o10(e29) {
  let t31 = r9.get(e29);
  if (t31 === void 0) throw TypeError(`codec value does not belong to this authoring scope`);
  return t31;
}
function s8(e29, t31) {
  if (e29.authoringScope !== void 0 && t31.authoringScope !== void 0 && e29.authoringScope !== t31.authoringScope) throw TypeError(`codec values from different authoring scopes cannot combine`);
  return e29.authoringScope ?? t31.authoringScope;
}
function c8(e29, t31) {
  if (e29.authoringScope !== void 0 && e29.authoringScope !== t31) throw TypeError(`codec value belongs to a different authoring scope`);
}
function l5(e29, t31, n39, r34) {
  let i36 = e29.kind === `loadU32` || e29.kind === `constantU32` ? `u32` : `f32`;
  if (i36 !== t31) throw TypeError(`codec buffer ${n39} lane ${r34} needs ${t31}; got ${i36}`);
}
function u5(e29, t31) {
  let n39 = o10(e29), r34 = o10(t31);
  return i9({ kind: `binary`, op: `addF32`, left: n39, right: r34, authoringScope: s8(n39, r34) });
}
function d4(e29, t31) {
  let n39 = o10(e29), r34 = o10(t31);
  return i9({ kind: `binary`, op: `subtractF32`, left: n39, right: r34, authoringScope: s8(n39, r34) });
}
function f5(e29, t31) {
  let n39 = o10(e29), r34 = o10(t31);
  return i9({ kind: `binary`, op: `multiplyF32`, left: n39, right: r34, authoringScope: s8(n39, r34) });
}
function p5(e29) {
  let t31 = o10(e29);
  return i9({ kind: `convertU32ToF32`, source: t31, authoringScope: t31.authoringScope });
}
function m5(e29) {
  if (!Number.isFinite(e29)) throw RangeError(`codec f32 constants must be finite`);
  return i9({ kind: `constantF32`, value: e29, authoringScope: void 0 });
}
function h5(e29) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 4294967295) throw RangeError(`codec u32 constants must be u32`);
  return a9({ kind: `constantU32`, value: e29, authoringScope: void 0 });
}
var g4 = Object.freeze({ add: u5, sub: d4, mul: f5, const: m5 });
var _3 = Object.freeze({ const: h5, toF32: p5 });
var v4 = Symbol(`glyph.compiled-codec-schema`);
function y4(e29, t31 = {}) {
  return x4(e29, t31, true);
}
function x4(e29, r34, i36) {
  if (!o8(e29)) throw TypeError(`technique codec programs need a defined technique schema`);
  let a34 = r34;
  if (!E4(a34)) throw TypeError(`technique codec options need an object`);
  if (`system` in a34) throw TypeError(`technique codec system buffers are host-owned and cannot be authored`);
  if (r34.inverseFontSize !== void 0 && typeof r34.inverseFontSize != `boolean`) throw TypeError(`technique codec inverseFontSize needs a boolean`);
  let o34 = C4({ scope: e29.scope, bindingF32: e29.binding.f32 ?? [], bindingU32: e29.binding.u32 ?? [], ...r34.inverseFontSize === void 0 ? {} : { inverseFontSize: r34.inverseFontSize }, ...r34.textEffects === void 0 ? {} : { textEffects: r34.textEffects } }, e29, i36), s33 = false;
  return Object.freeze({ semantics: o34.semantics, binding: o34.binding, compile(t31) {
    if (s33) throw Error(`technique codec program already compiled`);
    if (s33 = true, typeof t31 != `object` || !t31 || Array.isArray(t31)) throw TypeError(`technique codec stores need an object keyed by schema buffer name`);
    let r35 = Object.keys(e29.buffers), i37 = Object.keys(t31);
    for (let t32 of i37) if (!Object.hasOwn(e29.buffers, t32)) throw TypeError(`technique codec stores undeclared buffer "${t32}"`);
    for (let n39 of r35) {
      if (!Object.hasOwn(t31, n39)) throw TypeError(`technique codec omits declared buffer "${n39}"`);
      let r36 = e29.buffers[n39], i38 = t31[n39];
      if (!Array.isArray(i38)) throw TypeError(`technique codec buffer "${n39}" needs a value tuple`);
      if (i38.length !== r36.lanes.length) throw RangeError(`technique codec buffer "${n39}" declares ${r36.lanes.length} lanes; got ${i38.length} values`);
      r36.scalar === `f32` ? o34.storeF32(r36.id, i38) : o34.storeU32(r36.id, i38);
    }
    let a35 = o34.compile();
    return r8(a35, { schema: e29, stableGlyphId: void 0, transformIndex: void 0, placementSlot: void 0 }), a35;
  } });
}
function C4(t31, n39, r34) {
  if (!E4(t31)) throw TypeError(`codec program options need an object`);
  if (!(typeof t31.scope == `string` && Object.hasOwn(e5.codec.inputScopes, t31.scope))) throw TypeError(`codec program scope is not a codec input scope`);
  if (t31.bindingF32 !== void 0 && !Array.isArray(t31.bindingF32)) throw TypeError(`codec bindingF32 needs an array`);
  if (t31.bindingU32 !== void 0 && !Array.isArray(t31.bindingU32)) throw TypeError(`codec bindingU32 needs an array`);
  if (t31.inverseFontSize !== void 0 && typeof t31.inverseFontSize != `boolean`) throw TypeError(`codec inverseFontSize needs a boolean`);
  let s33 = w4(t31.textEffects), u28 = e5.engine.semanticF32Fields, d24 = e5.engine.semanticU32Fields, f26 = [...t31.bindingF32 ?? []], p28 = [...t31.bindingU32 ?? []];
  for (let e29 of [...f26, ...p28]) if (typeof e29 != `string` || e29 === ``) throw TypeError(`codec binding field names must be nonempty strings`);
  if ((/* @__PURE__ */ new Set([...f26, ...p28])).size !== f26.length + p28.length) throw TypeError(`codec binding field names must be unique`);
  let m24 = s33.includes(`outline`), h24 = s33.includes(`shadow`), g23 = 7 + +!!m24 + (h24 ? 2 : 0) + +(t31.inverseFontSize === true) + f26.length, _20 = 2 + +!!r34 + +!!m24 + +!!h24 + p28.length;
  if (g23 > 32 || _20 > 32) throw RangeError(`codec input fields exceed the 32-slot register file`);
  let y22 = [{ scope: `semantic`, field: u28.inlineOrigin }, { scope: `semantic`, field: u28.blockOrigin }, { scope: `semantic`, field: u28.fontSize }, { scope: `semantic`, field: u28.foregroundRed }, { scope: `semantic`, field: u28.foregroundGreen }, { scope: `semantic`, field: u28.foregroundBlue }, { scope: `semantic`, field: u28.foregroundAlpha }, ...m24 ? [{ scope: `semantic`, field: u28.outlineWidthEm }] : [], ...h24 ? [{ scope: `semantic`, field: u28.shadowOffsetXEm }, { scope: `semantic`, field: u28.shadowOffsetYEm }] : [], ...t31.inverseFontSize === true ? [{ scope: `semantic`, field: u28.inverseFontSize }] : [], ...f26.map((e29, n40) => ({ scope: t31.scope, field: n40 })), { scope: `semantic`, field: d24.transformIndex }, { scope: `semantic`, field: d24.stableGlyphId }, ...r34 ? [{ scope: `semantic`, field: d24.placementSlot }] : [], ...m24 ? [{ scope: `semantic`, field: d24.outlineRgba }] : [], ...h24 ? [{ scope: `semantic`, field: d24.shadowRgba }] : [], ...p28.map((e29, n40) => ({ scope: t31.scope, field: n40 }))], b20 = {}, x19 = 0, S17 = (e29) => i9({ kind: `loadF32`, input: x19++, label: e29, authoringScope: b20 }), C17 = { inlineOrigin: S17(`inlineOrigin`), blockOrigin: S17(`blockOrigin`), fontSize: S17(`fontSize`), color: { red: S17(`color.red`), green: S17(`color.green`), blue: S17(`color.blue`), alpha: S17(`color.alpha`) }, outline: m24 ? { color: a9({ kind: `loadU32`, input: 2 + +!!r34, label: `outline.color`, authoringScope: b20 }), widthEm: S17(`outline.widthEm`) } : void 0, shadow: h24 ? { color: a9({ kind: `loadU32`, input: 2 + +!!r34 + +!!m24, label: `shadow.color`, authoringScope: b20 }), offsetXEm: S17(`shadow.offsetXEm`), offsetYEm: S17(`shadow.offsetYEm`) } : void 0, inverseFontSize: t31.inverseFontSize === true ? S17(`inverseFontSize`) : void 0, transformIndex: a9({ kind: `loadU32`, input: 0, label: `transformIndex`, authoringScope: b20 }), stableGlyphId: a9({ kind: `loadU32`, input: 1, label: `stableGlyphId`, authoringScope: b20 }) }, D12 = {};
  for (let e29 of f26) D12[e29] = S17(e29);
  let O11 = 2 + +!!r34 + +!!m24 + +!!h24;
  for (let [e29, t32] of p28.entries()) D12[t32] = a9({ kind: `loadU32`, input: O11 + e29, label: t32, authoringScope: b20 });
  let k11 = [], A10 = e5.codec.opcodes;
  return { semantics: C17, binding: D12, store(e29, t32) {
    if (t32.length !== e29.lanes.length) throw RangeError(`buffer ${e29.id} declares ${e29.lanes.length} lanes (${e29.lanes.join(`, `)}); got ${t32.length} values`);
    let n40 = e29.scalar === `f32` ? A10.storeF32 : A10.storeU32;
    for (let [r35, i36] of t32.entries()) {
      let t33 = o10(i36);
      c8(t33, b20), l5(t33, e29.scalar, e29.id, r35), k11.push({ opcode: n40, buffer: e29.id, lane: r35, node: t33 });
    }
  }, storeF32(e29, t32) {
    for (let [n40, r35] of t32.entries()) {
      let t33 = o10(r35);
      c8(t33, b20), l5(t33, `f32`, e29, n40), k11.push({ opcode: A10.storeF32, buffer: e29, lane: n40, node: t33 });
    }
  }, storeU32(e29, t32) {
    for (let [n40, r35] of t32.entries()) {
      let t33 = o10(r35);
      c8(t33, b20), l5(t33, `u32`, e29, n40), k11.push({ opcode: A10.storeU32, buffer: e29, lane: n40, node: t33 });
    }
  }, compile() {
    let e29 = [], t32 = /* @__PURE__ */ new Map(), r35 = /* @__PURE__ */ new Map(), i36 = /* @__PURE__ */ new Set(), a34 = (e30) => {
      r35.set(e30, (r35.get(e30) ?? 0) + 1);
    }, o34 = (e30) => {
      i36.has(e30) || (i36.add(e30), e30.kind === `binary` ? (a34(e30.left), a34(e30.right), o34(e30.left), o34(e30.right)) : e30.kind === `convertU32ToF32` && (a34(e30.source), o34(e30.source)));
    };
    for (let e30 of k11) a34(e30.node), o34(e30.node);
    let s34 = [], c30 = 0, l29 = () => {
      let e30 = s34.pop();
      if (e30 !== void 0) return e30;
      if (c30 >= 32) throw RangeError(`codec program needs more than 32 simultaneously live registers`);
      return c30++;
    }, u29 = (e30) => {
      let n40 = (r35.get(e30) ?? 0) - 1;
      if (r35.set(e30, n40), n40 !== 0) return;
      let i37 = t32.get(e30);
      if (i37 === void 0) throw Error(`codec register liveness is inconsistent`);
      t32.delete(e30), s34.push(i37);
    }, d25 = (n40) => {
      let r36 = t32.get(n40);
      if (r36 !== void 0) return r36;
      let i37;
      switch (n40.kind) {
        case `loadF32`:
          i37 = { opcode: A10.loadF32, target: 0, operand0: n40.input };
          break;
        case `loadU32`:
          i37 = { opcode: A10.loadU32, target: 0, operand0: n40.input };
          break;
        case `binary`: {
          let e30 = d25(n40.left), t33 = d25(n40.right);
          i37 = { opcode: A10[n40.op], target: 0, operand0: e30, operand1: t33 };
          break;
        }
        case `constantF32`:
          i37 = { opcode: A10.constantF32, target: 0, immediate0: T4(n40.value) };
          break;
        case `constantU32`:
          i37 = { opcode: A10.constantU32, target: 0, immediate0: n40.value };
          break;
        case `convertU32ToF32`: {
          let e30 = d25(n40.source);
          i37 = { opcode: A10.convertU32ToF32, target: 0, operand0: e30 };
          break;
        }
      }
      let a35 = l29();
      return t32.set(n40, a35), e29.push({ ...i37, target: a35 }), n40.kind === `binary` ? (u29(n40.left), u29(n40.right)) : n40.kind === `convertU32ToF32` && u29(n40.source), a35;
    };
    for (let t33 of k11) {
      let n40 = d25(t33.node);
      e29.push({ opcode: t33.opcode, operand0: n40, operand1: t33.lane, immediate0: t33.buffer }), u29(t33.node);
    }
    return { [v4]: n39, inputs: y22, operations: e29, f32InputCount: g23, u32InputCount: _20 };
  } };
}
function w4(e29) {
  if (e29 === void 0) return [];
  if (!Array.isArray(e29)) throw TypeError(`codec textEffects must be an array`);
  for (let t31 of e29) if (t31 !== `outline` && t31 !== `shadow`) throw TypeError(`codec text effect "${String(t31)}" is not supported`);
  if (new Set(e29).size !== e29.length) throw TypeError(`codec textEffects must not contain duplicates`);
  return e29;
}
function T4(e29) {
  let t31 = new DataView(new ArrayBuffer(4));
  return t31.setFloat32(0, e29, true), t31.getUint32(0, true);
}
function E4(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/internal/raster-codec-registry.js
init_raster_format_compiler();
init_raster_format_registry();
var r11 = /* @__PURE__ */ new Map();
var i11 = /* @__PURE__ */ new WeakSet();
var a11;
function o12(e29) {
  if (a11 !== void 0 && a11 !== e29) throw Error(`raster Codec font compiler is already installed`);
  a11 = e29;
}
function s10(o34, s33) {
  if (typeof o34 != `object` || !o34) throw TypeError(`raster codecs need a format with id, kind, extension, and nonnegative version`);
  let c30 = o34.raster;
  if (!o11(c30)) throw TypeError(`raster codecs need a format with id, kind, extension, and nonnegative version`);
  let l29 = c30.id;
  if (!s33 && l29.startsWith(`pmndrs.`)) throw TypeError(`raster codec id "${l29}" is reserved for Glyph-owned formats`);
  let u28 = o34.schema, d24 = o34.programVariant ?? 0;
  if (!o8(u28)) throw TypeError(`raster codec "${l29}" needs a schema from defineTechniqueSchema`);
  if (u28.technique !== l29) throw TypeError(`raster codec "${l29}" schema names technique "${u28.technique}"`);
  if (Object.keys(u28.resources).length === 0) throw TypeError(`raster codec "${l29}" needs at least one declared resource`);
  if (u28.render.resource === void 0) throw TypeError(`raster codec "${l29}" needs a declared render resource`);
  if (!Number.isSafeInteger(d24) || d24 < 0 || d24 > 65535) throw RangeError(`raster codec "${l29}" needs a u16 program variant`);
  if (typeof o34.codecBody != `function` || typeof o34.compileFont != `function`) throw TypeError(`raster codec "${l29}" needs codecBody and compileFont callbacks`);
  if (i11.has(o34)) return o34;
  if (r11.has(l29)) throw TypeError(`a different raster codec is already registered for "${l29}"`);
  let f26 = Object.freeze(o34);
  return c30[e2]((e29, t31) => {
    let n39 = a11;
    if (n39 === void 0) throw Error(`raster Codec font compiler is not installed`);
    return n39(f26, e29, t31);
  }), r11.set(l29, Object.freeze({ raster: c30, schema: u28, programVariant: d24 })), i11.add(o34), f26;
}
function c10(e29) {
  return s10(e29, true);
}
function l7(e29) {
  return r11.get(e29);
}
function u7(e29) {
  return typeof e29 == `object` && !!e29 && i11.has(e29);
}

// node_modules/@pmndrs/glyph/dist/raster/bitmap.js
init_raster_format();
init_bitmap_contract();
var f10 = o13({ id: `pmndrs.bitmap`, kind: n10, extension: r13, version: 0, textEffects: [], runtimeBaker: () => Promise.resolve().then(() => (init_bitmap(), bitmap_exports)), descriptor(e29) {
  let t31 = l10(e29);
  return u9(t31.strikes, t31.coverage);
}, async decode(e29, t31, n39) {
  n39?.throwIfAborted();
  let { decodeBitmapData: r34 } = await Promise.resolve().then(() => (init_bitmap_decoder(), bitmap_decoder_exports)), i36 = await r34(e29, t31);
  return n39?.throwIfAborted(), i36;
}, dispose() {
} });
var p7 = l2.buffer(`pmndrs.bitmap/origin`);
var m7 = l2.buffer(`pmndrs.bitmap/size`);
var h7 = l2.buffer(`pmndrs.bitmap/uv-origin`);
var g5 = l2.buffer(`pmndrs.bitmap/uv-size`);
var _4 = l2.buffer(`pmndrs.bitmap/color`);
var v5 = l2.buffer(`pmndrs.bitmap/page`);
var y5 = s6({ technique: f10.id, scope: `strike`, glyphOrigin: { buffer: `origin` }, binding: { f32: [`bearingX`, `bearingY`, `width`, `height`, `uvOriginX`, `uvOriginY`, `uvSizeX`, `uvSizeY`], u32: [`page`] }, buffers: { origin: { id: p7, scalar: `f32`, lanes: [`inlineOrigin`, `blockOrigin`] }, size: { id: m7, scalar: `f32`, lanes: [`width`, `height`] }, uvOrigin: { id: h7, scalar: `f32`, lanes: [`u`, `v`] }, uvSize: { id: g5, scalar: `f32`, lanes: [`uSpan`, `vSpan`] }, color: { id: _4, scalar: `f32`, lanes: [`red`, `green`, `blue`, `alpha`] }, page: { id: v5, scalar: `u32`, lanes: [`page`] } }, resources: { atlas: { kind: `texture-array`, format: `r8unorm`, cardinality: `many` } }, render: { resource: `atlas`, geometry: { kind: `synthetic-quad` } } });
var b4 = c10({ raster: f10, schema: y5, codecBody() {
  let e29 = y4(y5), { inlineOrigin: t31, blockOrigin: i36, fontSize: a34, color: o34 } = e29.semantics, { bearingX: s33, bearingY: c30, width: l29, height: u28, uvOriginX: d24, uvOriginY: f26, uvSizeX: p28, uvSizeY: m24, page: h24 } = e29.binding;
  return e29.compile({ origin: [g4.add(t31, g4.mul(s33, a34)), g4.sub(i36, g4.mul(c30, a34))], size: [g4.mul(l29, a34), g4.mul(u28, a34)], uvOrigin: [d24, f26], uvSize: [p28, m24], color: [o34.red, o34.green, o34.blue, o34.alpha], page: [h24] });
}, compileFont(e29) {
  let t31 = e29.font.data, n39 = e29.font.glyphCount, r34 = t31.strikes.map((e30) => new DataView(e30.records.buffer, e30.records.byteOffset)), i36 = t31.strikes.map((t32, n40) => {
    let r35 = t32.pages[0]?.resource;
    if (r35 === void 0) throw TypeError(`bitmap strike ${n40} needs at least one atlas page`);
    let i37 = x5(t32, n40);
    return e29.retain(`atlas`, r35, i37), { key: r35, width: i37.width, height: i37.height };
  }), a34 = (e30) => {
    let t32 = Math.floor(e30 / n39);
    return { view: r34[t32], record: e30 % n39 * 20, strike: t32 };
  }, o34 = (e30, t32, n40) => {
    let r35 = a34(e30);
    return r35.view.getUint16(r35.record + 16, true) === 65535 ? 0 : r35.view.getUint16(r35.record + t32, true) / i36[r35.strike][n40];
  }, s33 = (e30, t32, n40, r35) => {
    let o35 = a34(e30);
    return o35.view.getUint16(o35.record + 16, true) === 65535 ? 0 : (o35.view.getUint16(o35.record + n40, true) - o35.view.getUint16(o35.record + t32, true)) / i36[o35.strike][r35];
  };
  return e29.compile({ strikes: t31.strikes.map((e30) => e30.ppem), resource(e30, t32) {
    let n40 = e30 * 20;
    return r34[t32].getUint16(n40 + 16, true) === 65535 ? void 0 : i36[t32].key;
  }, f32: { bearingX: (e30) => {
    let n40 = a34(e30);
    return n40.view.getInt16(n40.record, true) / t31.strikes[n40.strike].planeUnitsPerEm;
  }, bearingY: (e30) => {
    let n40 = a34(e30);
    return n40.view.getInt16(n40.record + 6, true) / t31.strikes[n40.strike].planeUnitsPerEm;
  }, width: (e30) => {
    let n40 = a34(e30);
    return (n40.view.getInt16(n40.record + 4, true) - n40.view.getInt16(n40.record, true)) / t31.strikes[n40.strike].planeUnitsPerEm;
  }, height: (e30) => {
    let n40 = a34(e30);
    return (n40.view.getInt16(n40.record + 6, true) - n40.view.getInt16(n40.record + 2, true)) / t31.strikes[n40.strike].planeUnitsPerEm;
  }, uvOriginX: (e30) => o34(e30, 8, `width`), uvOriginY: (e30) => o34(e30, 10, `height`), uvSizeX: (e30) => s33(e30, 8, 12, `width`), uvSizeY: (e30) => s33(e30, 10, 14, `height`) }, u32: { page: (e30) => {
    let t32 = a34(e30);
    return t32.view.getUint16(t32.record + 16, true);
  } } });
} });
function x5(e29, t31) {
  let n39 = Math.max(...e29.pages.map((e30) => e30.width)), r34 = Math.max(...e29.pages.map((e30) => e30.height)), i36 = n39 * r34 * e29.pages.length;
  if (!Number.isSafeInteger(i36) || i36 > 268435456) throw RangeError(`bitmap strike ${t31} padded atlas exceeds the runtime texture-memory limit`);
  let a34 = new Uint8Array(i36);
  for (let t32 = 0; t32 < e29.pages.length; t32 += 1) {
    let i37 = e29.pages[t32];
    for (let e30 = 0; e30 < i37.height; e30 += 1) a34.set(i37.bytes.subarray(e30 * i37.width, (e30 + 1) * i37.width), (t32 * r34 + e30) * n39);
  }
  return { kind: `texture-array`, format: `r8unorm`, width: n39, height: r34, layers: e29.pages.length, bytes: a34 };
}

// node_modules/@pmndrs/glyph/dist/raster/msdf.js
init_raster_format();
init_msdf_contract();
var p9 = o13({ id: `pmndrs.msdf`, kind: n15, extension: r18, version: 0, textEffects: [`outline`, `shadow`], runtimeBaker: () => Promise.resolve().then(() => (init_msdf(), msdf_exports)), descriptor(e29) {
  return p8(e29);
}, async decode(e29, t31, n39) {
  n39?.throwIfAborted();
  let { decodeMsdfData: r34 } = await Promise.resolve().then(() => (init_msdf_decoder(), msdf_decoder_exports)), i36 = await r34(e29, t31);
  return n39?.throwIfAborted(), i36;
}, dispose() {
} });
var m9 = l2.buffer(`pmndrs.msdf/rect`);
var h9 = l2.buffer(`pmndrs.msdf/uv-rect`);
var g8 = l2.buffer(`pmndrs.msdf/uv-bounds`);
var _7 = l2.buffer(`pmndrs.msdf/color`);
var v8 = l2.buffer(`pmndrs.msdf/effect-color`);
var y7 = l2.buffer(`pmndrs.msdf/page`);
var b6 = s6({ technique: p9.id, scope: `glyph`, glyphOrigin: { buffer: `rect` }, binding: { f32: [`bearingX`, `bearingY`, `width`, `height`, `uvOriginX`, `uvOriginY`, `uvSizeX`, `uvSizeY`, `uvMaxX`, `uvMaxY`], u32: [`page`] }, buffers: { rect: { id: m9, scalar: `f32`, lanes: [`left`, `top`, `width`, `height`] }, uvRect: { id: h9, scalar: `f32`, lanes: [`u0`, `v0`, `uSpan`, `vSpan`] }, uvBounds: { id: g8, scalar: `f32`, lanes: [`u0`, `v0`, `uMax`, `vMax`] }, color: { id: _7, scalar: `f32`, lanes: [`red`, `green`, `blue`, `alpha`] }, effectColor: { id: v8, scalar: `u32`, lanes: [`outline`, `shadow`] }, page: { id: y7, scalar: `f32`, lanes: [`x`, `y`, `z`, `page`] } }, resources: { atlas: { kind: `group`, members: { texture: { kind: `texture-array`, format: `rgba8unorm` }, pixelRange: { kind: `buffer` }, effectScale: { kind: `buffer` } } } }, render: { resource: `atlas`, geometry: { kind: `synthetic-quad` } } });
var x6 = c10({ raster: p9, schema: b6, codecBody() {
  let e29 = y4(b6, { textEffects: p9.textEffects }), { inlineOrigin: t31, blockOrigin: a34, fontSize: o34, color: s33, outline: c30, shadow: l29 } = e29.semantics;
  if (c30 === void 0 || l29 === void 0) throw Error(`MSDF text effects are not configured`);
  let { bearingX: u28, bearingY: d24, width: f26, height: m24, uvOriginX: h24, uvOriginY: g23, uvSizeX: _20, uvSizeY: v22, uvMaxX: y22, uvMaxY: x19, page: S17 } = e29.binding;
  return e29.compile({ rect: [g4.add(t31, g4.mul(u28, o34)), g4.sub(a34, g4.mul(d24, o34)), g4.mul(f26, o34), g4.mul(m24, o34)], uvRect: [h24, g23, _20, v22], uvBounds: [h24, g23, y22, x19], color: [s33.red, s33.green, s33.blue, s33.alpha], effectColor: [c30.color, l29.color], page: [l29.offsetXEm, l29.offsetYEm, c30.widthEm, _3.toF32(S17)] });
}, compileFont(e29) {
  let t31 = e29.font.data, n39 = new DataView(t31.records.buffer, t31.records.byteOffset);
  e29.retain(`atlas`, t31.resource, { kind: `group`, members: { texture: S4(t31), pixelRange: { kind: `buffer`, bytes: C5(t31.pixelRange), stride: 4 }, effectScale: { kind: `buffer`, bytes: w5(t31.planeUnitsPerEm / t31.binding.width, t31.planeUnitsPerEm / t31.binding.height, t31.planeUnitsPerEm / t31.pixelRange), stride: 12 } } });
  let r34 = (e30) => e30 * 20, i36 = (e30) => n39.getUint16(r34(e30) + 16, true), a34 = (e30, a35, o35) => i36(e30) === 65535 ? 0 : n39.getUint16(r34(e30) + a35, true) / t31.binding[o35], o34 = (e30, a35, o35, s33) => i36(e30) === 65535 ? 0 : (n39.getUint16(r34(e30) + o35, true) - n39.getUint16(r34(e30) + a35, true)) / t31.binding[s33];
  return e29.compile({ strikes: [0], resource: (e30) => i36(e30) === 65535 ? void 0 : t31.resource, f32: { bearingX: (e30) => n39.getInt16(r34(e30), true) / t31.planeUnitsPerEm, bearingY: (e30) => n39.getInt16(r34(e30) + 6, true) / t31.planeUnitsPerEm, width: (e30) => (n39.getInt16(r34(e30) + 4, true) - n39.getInt16(r34(e30), true)) / t31.planeUnitsPerEm, height: (e30) => (n39.getInt16(r34(e30) + 6, true) - n39.getInt16(r34(e30) + 2, true)) / t31.planeUnitsPerEm, uvOriginX: (e30) => a34(e30, 8, `width`), uvOriginY: (e30) => a34(e30, 10, `height`), uvSizeX: (e30) => o34(e30, 8, 12, `width`), uvSizeY: (e30) => o34(e30, 10, 14, `height`), uvMaxX: (e30) => a34(e30, 12, `width`), uvMaxY: (e30) => a34(e30, 14, `height`) }, u32: { page: i36 } });
} });
function S4(e29) {
  let t31 = new Uint8Array(e29.binding.width * e29.binding.height * e29.binding.layers * 4);
  for (let n39 = 0; n39 < e29.pages.length; n39 += 1) {
    let r34 = e29.pages[n39];
    for (let i36 = 0; i36 < r34.height; i36 += 1) {
      let a34 = i36 * r34.width * 4, o34 = (n39 * e29.binding.height + i36) * e29.binding.width * 4;
      t31.set(r34.bytes.subarray(a34, a34 + r34.width * 4), o34);
    }
  }
  return { kind: `texture-array`, format: `rgba8unorm`, width: e29.binding.width, height: e29.binding.height, layers: e29.binding.layers, bytes: t31 };
}
function C5(e29) {
  let t31 = new Uint8Array(4);
  return new DataView(t31.buffer).setFloat32(0, e29, true), t31;
}
function w5(e29, t31, n39) {
  let r34 = new Uint8Array(12), i36 = new DataView(r34.buffer);
  return i36.setFloat32(0, e29, true), i36.setFloat32(4, t31, true), i36.setFloat32(8, n39, true), r34;
}

// node_modules/@pmndrs/glyph/dist/raster/slug.js
init_raster_format();
init_slug_contract();
var f12 = o13({ id: `pmndrs.slug`, kind: t10, extension: n17, version: 0, textEffects: [], runtimeBaker: () => Promise.resolve().then(() => (init_slug(), slug_exports)), descriptor(e29) {
  return d9(e29);
}, async decode(e29, t31, n39) {
  n39?.throwIfAborted();
  let { decodeSlugData: r34 } = await Promise.resolve().then(() => (init_slug_decoder(), slug_decoder_exports)), i36 = await r34(e29, t31, n39);
  return n39?.throwIfAborted(), i36;
}, dispose() {
} });
var p12 = l2.buffer(`pmndrs.slug/rect`);
var m11 = l2.buffer(`pmndrs.slug/plane-rect`);
var h11 = l2.buffer(`pmndrs.slug/band-transform`);
var g10 = l2.buffer(`pmndrs.slug/color`);
var _9 = l2.buffer(`pmndrs.slug/inverse-font-size`);
var v10 = l2.buffer(`pmndrs.slug/table-starts`);
var y9 = l2.buffer(`pmndrs.slug/band-counts`);
var b8 = s6({ technique: f12.id, scope: `glyph`, glyphOrigin: { buffer: `rect` }, binding: { f32: [`bearingX`, `bearingY`, `width`, `height`, `bandScaleX`, `bandScaleY`, `bandOffsetX`, `bandOffsetY`], u32: [`curveBase`, `horizontalHeaderBase`, `verticalHeaderBase`, `referenceBase`, `horizontalBands`, `verticalBands`] }, buffers: { rect: { id: p12, scalar: `f32`, lanes: [`left`, `top`, `width`, `height`] }, planeRect: { id: m11, scalar: `f32`, lanes: [`left`, `top`, `width`, `height`] }, bandTransform: { id: h11, scalar: `f32`, lanes: [`scaleX`, `scaleY`, `offsetX`, `offsetY`] }, color: { id: g10, scalar: `f32`, lanes: [`red`, `green`, `blue`, `alpha`] }, inverseFontSize: { id: _9, scalar: `f32`, lanes: [`inverseFontSize`, `unused1`, `unused2`, `unused3`] }, tableStarts: { id: v10, scalar: `u32`, lanes: [`curveBase`, `horizontalHeaderBase`, `verticalHeaderBase`, `referenceBase`] }, bandCounts: { id: y9, scalar: `u32`, lanes: [`horizontalBands`, `verticalBands`, `unused2`, `unused3`] } }, resources: { page: { kind: `group`, cardinality: `many`, members: { curves: { kind: `texture`, format: `rgba16float` }, headers: { kind: `texture`, format: `r32uint` }, references: { kind: `texture`, format: `r32uint` } } } }, render: { resource: `page`, geometry: { kind: `synthetic-quad` } } });
var x8 = c10({ raster: f12, schema: b8, codecBody() {
  let e29 = y4(b8, { inverseFontSize: true }), { inlineOrigin: t31, blockOrigin: a34, fontSize: o34, color: s33, inverseFontSize: c30 } = e29.semantics;
  if (c30 === void 0) throw TypeError(`the Slug program declares inverseFontSize`);
  let { bearingX: l29, bearingY: u28, width: d24, height: f26, bandScaleX: p28, bandScaleY: m24, bandOffsetX: h24, bandOffsetY: g23, curveBase: _20, horizontalHeaderBase: v22, verticalHeaderBase: y22, referenceBase: x19, horizontalBands: S17, verticalBands: C17 } = e29.binding, w15 = g4.const(0), T13 = _3.const(0);
  return e29.compile({ rect: [g4.add(t31, g4.mul(l29, o34)), g4.sub(a34, g4.mul(u28, o34)), g4.mul(d24, o34), g4.mul(f26, o34)], planeRect: [l29, u28, d24, f26], bandTransform: [p28, m24, h24, g23], color: [s33.red, s33.green, s33.blue, s33.alpha], inverseFontSize: [c30, w15, w15, w15], tableStarts: [_20, v22, y22, x19], bandCounts: [S17, C17, T13, T13] });
}, compileFont(e29) {
  let t31 = e29.font.data;
  for (let n40 of t31.pages) e29.retain(`page`, n40.resource, S6(n40));
  let n39 = new DataView(t31.records.buffer, t31.records.byteOffset), r34 = (e30) => e30 * 40, i36 = (e30) => n39.getUint16(r34(e30) + 8, true), a34 = (e30, i37) => n39.getInt16(r34(e30) + i37, true) / t31.planeUnitsPerEm, o34 = (e30) => a34(e30, 4) - a34(e30, 0), s33 = (e30) => a34(e30, 6) - a34(e30, 2), c30 = (e30) => n39.getUint16(r34(e30) + 10, true), l29 = (e30) => n39.getUint16(r34(e30) + 12, true), u28 = (e30) => o34(e30) === 0 ? 0 : l29(e30) / o34(e30), d24 = (e30) => s33(e30) === 0 ? 0 : c30(e30) / s33(e30);
  return e29.compile({ strikes: [0], resource: (e30) => {
    let n40 = i36(e30);
    return n40 === 65535 ? void 0 : t31.pages[n40].resource;
  }, f32: { bearingX: (e30) => a34(e30, 0), bearingY: (e30) => a34(e30, 6), width: o34, height: s33, bandScaleX: u28, bandScaleY: d24, bandOffsetX: (e30) => -a34(e30, 0) * u28(e30), bandOffsetY: (e30) => -a34(e30, 2) * d24(e30) }, u32: { curveBase: (e30) => n39.getUint32(r34(e30) + 16, true), horizontalHeaderBase: (e30) => n39.getUint32(r34(e30) + 24, true), verticalHeaderBase: (e30) => n39.getUint32(r34(e30) + 28, true), referenceBase: (e30) => n39.getUint32(r34(e30) + 32, true), horizontalBands: c30, verticalBands: l29 } });
} });
function S6(e29) {
  let t31 = C7(e29.referenceBytes, e29.referenceWidth);
  return { kind: `group`, members: { curves: { kind: `texture`, format: `rgba16float`, width: e29.curveWidth, height: e29.curveHeight, bytes: e29.curveBytes }, headers: { kind: `texture`, format: `r32uint`, width: e29.headerWidth, height: e29.headerHeight, bytes: e29.headerBytes }, references: { kind: `texture`, format: `r32uint`, width: t31.width, height: t31.height, bytes: new Uint8Array(t31.data.buffer) } } };
}
function C7(e29, t31) {
  let n39 = e29.slice(), r34 = new Uint16Array(n39.buffer, n39.byteOffset, n39.byteLength / 2), i36 = Math.ceil(r34.length / 2), a34 = Math.min(t31, i36), o34 = Math.ceil(i36 / a34), s33 = new Uint32Array(a34 * o34);
  for (let e30 = 0; e30 < r34.length; e30 += 1) s33[e30 >> 1] = (s33[e30 >> 1] ?? 0) | r34[e30] << (e30 & 1) * 16;
  return { data: s33, width: a34, height: o34 };
}

// node_modules/@pmndrs/glyph/dist/engine-error.js
init_glyph_error();
var n19 = Object.freeze({ paragraphId: 0, styleId: 0 });
var r19 = /* @__PURE__ */ new Map([[e5.status.invalidHandle, `invalid-handle`], [e5.status.invalidFont, `invalid-font`], [e5.status.invalidExtents, `invalid-extents`], [e5.status.handleConflict, `handle-conflict`], [e5.status.fontMissing, `font-missing`], [e5.status.invalidRequest, `invalid-request`], [e5.status.resultTooLarge, `result-too-large`], [e5.status.codecConflict, `codec-conflict`], [e5.status.codecMissing, `codec-missing`], [e5.status.rootConflict, `root-conflict`], [e5.status.rootMissing, `root-missing`], [e5.status.revisionConflict, `revision-conflict`], [e5.status.fontStackMissing, `font-stack-missing`], [e5.status.fontInUse, `font-in-use`], [e5.status.styleRangeInvalid, `style-range-invalid`], [e5.status.styleSplitsCluster, `style-splits-cluster`], [e5.status.styleNestingInvalid, `style-nesting-invalid`], [e5.status.styleRootInvalid, `style-root-invalid`], [e5.status.fontMetricsMissing, `font-metrics-missing`], [e5.status.registrationInUse, `registration-in-use`]]);
var i17 = class extends e3 {
  statusCode;
  status;
  constructor(e29, t31) {
    super(`engine-failed`, `${e29} failed with glyph-engine status ${t31}`), this.name = `GlyphEngineStatusError`, this.statusCode = r19.get(t31) ?? `unknown`, this.status = t31;
  }
};
var a18 = /* @__PURE__ */ new WeakMap();
function s19(e29, t31) {
  a18.set(e29, t31);
}

// node_modules/@pmndrs/glyph/dist/property-list.js
function e19(e29, t31) {
  let n39 = {}, r34 = (e30) => {
    if (e30 != null && e30 !== false) {
      if (Array.isArray(e30)) {
        for (let t32 of e30) r34(t32);
        return;
      }
      if (typeof e30 != `object`) throw TypeError(`${t31} must be an object or property array`);
      Object.assign(n39, e30);
    }
  };
  return r34(e29), n39;
}

// node_modules/@pmndrs/glyph/dist/text-properties.js
var n25 = a23(`TextStyle`, o24);
var r24 = a23(`ParagraphLayout`, c21);
var i22 = a23(`Constraints`, l17);
function a23(t31, n39) {
  return Object.freeze({ create(r34) {
    if (typeof r34 != `object` || !r34 || Array.isArray(r34)) throw TypeError(`${t31}.create rules must be an object`);
    let i36 = {};
    for (let [a34, o34] of Object.entries(r34)) {
      let r35 = `${t31}.create rule "${a34}"`, s33 = e19(o34, r35);
      n39(s33, r35), i36[a34] = Object.freeze(s33);
    }
    return Object.freeze(i36);
  } });
}
function o24(e29, t31 = `text style`) {
  if (k5(e29, t31), j3(e29.fontSize, `${t31} fontSize`), j3(e29.lineHeight, `${t31} lineHeight`), A4(e29.letterSpacing, `${t31} letterSpacing`), A4(e29.wordSpacing, `${t31} wordSpacing`), e29.language !== void 0 && (typeof e29.language != `string` || !F3(e29.language))) throw TypeError(`${t31} language must be a valid language tag`);
  if (e29.direction !== void 0 && ![`auto`, `ltr`, `rtl`].includes(e29.direction)) throw TypeError(`${t31} direction is invalid`);
  if (e29.features !== void 0) {
    if (!Array.isArray(e29.features)) throw TypeError(`${t31} features must be an array`);
    for (let [n39, r34] of e29.features.entries()) E7(r34, `${t31} feature ${n39}`);
  }
  if (e29.decoration !== void 0 && D6(e29.decoration, `${t31} decoration`), e29.color !== void 0 && O5(e29.color, `${t31} color`), e29.opacity !== void 0 && (!Number.isFinite(e29.opacity) || e29.opacity < 0 || e29.opacity > 1)) throw RangeError(`${t31} opacity must be in [0, 1]`);
  if (e29.outline !== void 0 && (k5(e29.outline, `${t31} outline`), O5(e29.outline.color, `${t31} outline color`), M3(e29.outline.width, `${t31} outline width`, true)), e29.shadow !== void 0) {
    if (k5(e29.shadow, `${t31} shadow`), O5(e29.shadow.color, `${t31} shadow color`), !Array.isArray(e29.shadow.offset) || e29.shadow.offset.length !== 2) throw TypeError(`${t31} shadow offset must contain two numbers`);
    A4(e29.shadow.offset[0], `${t31} shadow offset x`, true), A4(e29.shadow.offset[1], `${t31} shadow offset y`, true);
  }
}
function s24(e29, t31, n39, r34 = `text style`) {
  for (let [i36, a34] of (e29.features ?? []).entries()) {
    let e30 = a34.start ?? t31, o34 = a34.end ?? n39;
    if (e30 < t31 || o34 > n39) throw RangeError(`${r34} feature ${i36} (${a34.tag}) must stay inside [${t31}, ${n39})`);
  }
}
function c21(e29, t31 = `paragraph layout`) {
  if (k5(e29, t31), e29.maxLines !== void 0 && (!Number.isSafeInteger(e29.maxLines) || e29.maxLines < 1)) throw RangeError(`${t31} maxLines must be a positive integer`);
  if (P3(e29.wrap, [`none`, `word`, `character`], `${t31} wrap`), P3(e29.align, [`start`, `center`, `end`, `justify`], `${t31} align`), P3(e29.overflow, [`visible`, `clip`, `ellipsis`], `${t31} overflow`), M3(e29.firstLineIndent, `${t31} firstLineIndent`), M3(e29.spaceBefore, `${t31} spaceBefore`), M3(e29.spaceAfter, `${t31} spaceAfter`), P3(e29.lastLine, [`auto`, `justify`], `${t31} lastLine`), e29.justify !== void 0) {
    k5(e29.justify, `${t31} justify`);
    let n39 = e29.justify.minWordSpaceRatio, r34 = e29.justify.maxWordSpaceRatio;
    if (n39 !== void 0 && (!Number.isFinite(n39) || n39 <= 0 || n39 > 1)) throw RangeError(`${t31} justify minWordSpaceRatio must be in (0, 1]`);
    if (r34 !== void 0 && (!Number.isFinite(r34) || r34 < 1)) throw RangeError(`${t31} justify maxWordSpaceRatio must be at least 1`);
    M3(e29.justify.letterSpaceExpansion, `${t31} justify letterSpaceExpansion`);
  }
  if (e29.columns !== void 0) {
    if (k5(e29.columns, `${t31} columns`), !Number.isSafeInteger(e29.columns.count) || e29.columns.count < 1 || e29.columns.count > 16) throw RangeError(`${t31} columns count must be an integer between 1 and 16`);
    M3(e29.columns.gap, `${t31} columns gap`);
  }
  if (e29.dropCap !== void 0) {
    if (k5(e29.dropCap, `${t31} dropCap`), !Number.isSafeInteger(e29.dropCap.lines) || e29.dropCap.lines < 1 || e29.dropCap.lines > 16) throw RangeError(`${t31} dropCap lines must be an integer between 1 and 16`);
    if (P3(e29.dropCap.align, [`text-top`, `baseline`], `${t31} dropCap align`), P3(e29.dropCap.side, [`inline-start`, `inline-end`], `${t31} dropCap side`), M3(e29.dropCap.marginInline, `${t31} dropCap marginInline`), M3(e29.dropCap.marginBlock, `${t31} dropCap marginBlock`), e29.dropCap.contour !== void 0) {
      let n39 = p14({ kind: `polygon`, vertices: e29.dropCap.contour }, `${t31} dropCap contour`);
      if (n39.kind !== `polygon` || n39.vertices.some(([e30, t32]) => e30 < 0 || e30 > 1 || t32 < 0 || t32 > 1)) throw RangeError(`${t31} dropCap contour vertices must stay within [0, 1]`);
    }
  }
}
function l17(e29, t31 = `text constraints`) {
  k5(e29, t31), T7(e29.width, `${t31} width`), T7(e29.height, `${t31} height`);
}
function u15(e29, t31 = `text flow`) {
  if (k5(e29, t31), !Array.isArray(e29.regions) || e29.regions.length === 0) throw TypeError(`${t31} regions must be a nonempty array`);
  let n39 = e29.regions, r34 = /* @__PURE__ */ new Set(), i36 = n39.map((e30, n40) => {
    let i37 = `${t31} region ${n40}`;
    k5(e30, i37);
    let a34 = w8(e30.key, `${i37} key`);
    if (r34.has(a34)) throw TypeError(`${t31} region key "${a34}" is duplicated`);
    r34.add(a34);
    let o34 = p14(e30.shape, `${i37} shape`), s33 = e30.clip === void 0 ? void 0 : m13(e30.clip, `${i37} clip`), c30 = /* @__PURE__ */ new Set(), l29 = (e30.exclusions ?? []).map((e31, t32) => {
      let n41 = `${i37} exclusion ${t32}`;
      k5(e31, n41);
      let r35 = w8(e31.key, `${n41} key`);
      if (c30.has(r35)) throw TypeError(`${i37} exclusion key "${r35}" is duplicated`);
      return c30.add(r35), f14(e31, n41, r35);
    });
    return Object.freeze({ key: a34, shape: o34, ...s33 === void 0 ? {} : { clip: s33 }, ...l29.length === 0 ? {} : { exclusions: Object.freeze(l29) } });
  });
  return Object.freeze({ regions: Object.freeze(i36) });
}
function f14(e29, t31, n39) {
  P3(e29.wrapSide, [`both`, `inline-start`, `inline-end`, `largest`], `${t31} wrapSide`);
  let r34 = g12(e29.marginInline, `${t31} marginInline`), i36 = g12(e29.marginBlock, `${t31} marginBlock`);
  return Object.freeze({ key: n39, shape: p14(e29.shape, `${t31} shape`), ...e29.wrapSide === void 0 ? {} : { wrapSide: e29.wrapSide }, ...r34 === void 0 ? {} : { marginInline: r34 }, ...i36 === void 0 ? {} : { marginBlock: i36 } });
}
function p14(e29, t31) {
  if (k5(e29, t31), e29.kind === `rectangle`) return Object.freeze({ kind: `rectangle`, bounds: m13(e29.bounds, `${t31} bounds`) });
  if (e29.kind !== `polygon` || !Array.isArray(e29.vertices) || e29.vertices.length < 3) throw TypeError(`${t31} must be a rectangle or a polygon with at least three vertices`);
  let n39 = e29.vertices.map((e30, n40) => h13(e30, `${t31} vertex ${n40}`));
  for (let e30 = 0; e30 < n39.length; e30 += 1) {
    let r35 = n39[(e30 + 1) % n39.length];
    if (C9(n39[e30], r35)) throw TypeError(`${t31} has consecutive duplicate vertices`);
  }
  for (let e30 = 0; e30 < n39.length; e30 += 1) for (let r35 = e30 + 1; r35 < n39.length; r35 += 1) if (C9(n39[e30], n39[r35])) throw TypeError(`${t31} repeats a vertex`);
  let r34 = v12(n39);
  if (!Number.isFinite(r34) || r34 === 0) throw RangeError(`${t31} must have nonzero finite area`);
  return y11(n39, t31), r34 < 0 && n39.reverse(), Object.freeze({ kind: `polygon`, vertices: Object.freeze(n39) });
}
function m13(e29, t31) {
  if (!Array.isArray(e29) || e29.length !== 4) throw TypeError(`${t31} must contain four finite coordinates`);
  let n39 = [_11(e29[0], t31), _11(e29[1], t31), _11(e29[2], t31), _11(e29[3], t31)];
  if (n39[0] >= n39[2] || n39[1] >= n39[3]) throw RangeError(`${t31} must have positive inline and block extents`);
  return Object.freeze(n39);
}
function h13(e29, t31) {
  if (!Array.isArray(e29) || e29.length !== 2) throw TypeError(`${t31} must contain two finite coordinates`);
  return Object.freeze([_11(e29[0], t31), _11(e29[1], t31)]);
}
function g12(e29, t31) {
  if (e29 === void 0) return;
  let n39 = _11(e29, t31);
  if (n39 < 0) throw RangeError(`${t31} must be nonnegative`);
  return n39;
}
function _11(e29, t31) {
  let n39 = Math.fround(e29);
  if (!Number.isFinite(e29) || !Number.isFinite(n39)) throw TypeError(`${t31} must contain finite f32 coordinates`);
  return n39 === 0 ? 0 : n39;
}
function v12(e29) {
  let t31 = 0;
  for (let n39 = 0; n39 < e29.length; n39 += 1) {
    let r34 = e29[n39], i36 = e29[(n39 + 1) % e29.length];
    t31 += r34[0] * i36[1] - i36[0] * r34[1];
  }
  return t31;
}
function y11(e29, t31) {
  for (let n39 = 0; n39 < e29.length; n39 += 1) {
    let r34 = (n39 + 1) % e29.length;
    for (let i36 = n39 + 1; i36 < e29.length; i36 += 1) {
      let a34 = (i36 + 1) % e29.length;
      if (n39 !== i36 && n39 !== a34 && r34 !== i36 && r34 !== a34 && b10(e29[n39], e29[r34], e29[i36], e29[a34])) throw TypeError(`${t31} must not self-intersect`);
    }
  }
}
function b10(e29, t31, n39, r34) {
  let i36 = x10(e29, t31, n39), a34 = x10(e29, t31, r34), o34 = x10(n39, r34, e29), s33 = x10(n39, r34, t31);
  return i36 === 0 && S8(e29, t31, n39) || a34 === 0 && S8(e29, t31, r34) || o34 === 0 && S8(n39, r34, e29) || s33 === 0 && S8(n39, r34, t31) ? true : Math.sign(i36) !== Math.sign(a34) && Math.sign(o34) !== Math.sign(s33);
}
function x10(e29, t31, n39) {
  return (t31[0] - e29[0]) * (n39[1] - e29[1]) - (t31[1] - e29[1]) * (n39[0] - e29[0]);
}
function S8(e29, t31, n39) {
  return Math.min(e29[0], t31[0]) <= n39[0] && n39[0] <= Math.max(e29[0], t31[0]) && Math.min(e29[1], t31[1]) <= n39[1] && n39[1] <= Math.max(e29[1], t31[1]);
}
function C9(e29, t31) {
  return Object.is(e29[0], t31[0]) && Object.is(e29[1], t31[1]);
}
function w8(e29, t31) {
  if (typeof e29 != `string` || e29.length === 0) throw TypeError(`${t31} must be a nonempty string`);
  return e29;
}
function T7(e29, t31) {
  if (e29 !== void 0) {
    if (k5(e29, t31), ![`unconstrained`, `at-most`, `exact`].includes(e29.mode)) throw TypeError(`${t31} mode is invalid`);
    if (e29.mode === `unconstrained`) {
      if (`size` in e29) throw TypeError(`${t31} must not state a size when unconstrained`);
      return;
    }
    M3(e29.size, `${t31} size`, true);
  }
}
function E7(e29, t31) {
  if (k5(e29, t31), typeof e29.tag != `string` || e29.tag.length !== 4 || !/^[\x20-\x7e]{4}$/u.test(e29.tag)) throw RangeError(`${t31} tag must contain exactly four printable ASCII bytes`);
  if (e29.value !== void 0 && (!Number.isSafeInteger(e29.value) || e29.value < 0 || e29.value > 4294967295)) throw RangeError(`${t31} value must be a u32`);
  if (N3(e29.start, `${t31} start`), N3(e29.end, `${t31} end`), e29.start !== void 0 && e29.end !== void 0 && e29.end < e29.start) throw RangeError(`${t31} end must not precede start`);
}
function D6(e29, t31) {
  k5(e29, t31);
  for (let [n39, r34] of [[`underline`, e29.underline], [`overline`, e29.overline], [`lineThrough`, e29.lineThrough]]) if (r34 !== void 0 && typeof r34 != `boolean`) throw TypeError(`${t31} ${n39} must be boolean`);
  if (e29.color !== void 0 && O5(e29.color, `${t31} color`), P3(e29.style, [`solid`, `double`, `dotted`, `dashed`, `wavy`], `${t31} style`), M3(e29.thickness, `${t31} thickness`), A4(e29.offset, `${t31} offset`), e29.style !== void 0 && e29.style !== `solid`) throw TypeError(`${t31} style '${e29.style}' is not implemented; only 'solid' is supported`);
}
function O5(e29, t31) {
  if (typeof e29 == `string`) {
    if (!/^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/iu.test(e29)) throw TypeError(`${t31} must be #rrggbb, #rrggbbaa, or linear RGBA`);
    return;
  }
  if (!Array.isArray(e29) || e29.length !== 4 || e29.some((e30) => !Number.isFinite(e30) || e30 < 0 || e30 > 1)) throw TypeError(`${t31} linear RGBA must contain four finite channels in [0, 1]`);
}
function k5(e29, t31) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`${t31} must be an object`);
}
function A4(e29, t31, n39 = false) {
  if (e29 === void 0) {
    if (n39) throw TypeError(`${t31} is required`);
    return;
  }
  if (!Number.isFinite(e29)) throw RangeError(`${t31} must be finite`);
}
function j3(e29, t31) {
  if (A4(e29, t31), e29 !== void 0 && e29 <= 0) throw RangeError(`${t31} must be positive`);
}
function M3(e29, t31, n39 = false) {
  if (A4(e29, t31, n39), e29 !== void 0 && e29 < 0) throw RangeError(`${t31} must be nonnegative`);
}
function N3(e29, t31) {
  if (e29 !== void 0 && (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 4294967295)) throw RangeError(`${t31} must be a u32`);
}
function P3(e29, t31, n39) {
  if (e29 !== void 0 && !t31.includes(e29)) throw TypeError(`${n39} is invalid`);
}
function F3(e29) {
  let t31 = e29.split(`-`), n39 = t31[0] ?? ``, r34 = /^[xi]$/iu.test(n39);
  return !r34 && !/^[a-z]{2,8}$/iu.test(n39) || r34 && t31.length === 1 ? false : t31.slice(1).every((e30) => /^[a-z0-9]{1,8}$/iu.test(e30));
}

// node_modules/unicode-segmenter/core.js
function decodeUnicodeData(data, cats = "") {
  let buf = (
    /** @type {Array<CategorizedUnicodeRange<T>>} */
    []
  ), nums = data.split(",").map((s33) => s33 ? parseInt(s33, 36) : 0), n39 = 0;
  for (let i36 = 0; i36 < nums.length; i36++)
    i36 % 2 ? buf.push([
      n39,
      n39 + nums[i36],
      /** @type {T} */
      cats ? parseInt(cats[i36 >> 1], 36) : 0
    ]) : n39 = nums[i36];
  return buf;
}
function findUnicodeRangeIndex(cp, ranges, lo = 0, hi = ranges.length - 1) {
  while (lo <= hi) {
    let mid = lo + hi >>> 1, range = ranges[mid];
    if (cp < range[0]) hi = mid - 1;
    else if (cp > range[1]) lo = mid + 1;
    else return mid;
  }
  return -1;
}

// node_modules/unicode-segmenter/_grapheme_data.js
var grapheme_ranges = decodeUnicodeData(
  /** @type {UnicodeDataEncoding} */
  ",9,a,,b,1,d,,e,h,3j,w,4p,,4t,,4u,,lc,33,w3,6,13l,18,14v,,14x,1,150,1,153,,16o,5,174,a,17g,,18r,k,19s,,1cm,6,1ct,,1cv,5,1d3,1,1d6,3,1e7,,1e9,,1f4,q,1ie,a,1kb,8,1kt,,1li,3,1ln,8,1lx,2,1m1,4,1nd,2,1ow,1,1p3,8,1qi,n,1r6,,1r7,v,1s3,,1tm,,1tn,,1to,,1tq,2,1tt,7,1u1,3,1u5,,1u6,1,1u9,6,1uq,1,1vl,,1vm,1,1x8,,1xa,,1xb,1,1xd,3,1xj,1,1xn,1,1xp,,1xz,,1ya,1,1z2,,1z5,1,1z7,,20s,,20u,2,20x,1,213,1,217,2,21d,,228,1,22d,,22p,1,22r,,24c,,24e,2,24h,4,24n,1,24p,,24r,1,24t,,25e,1,262,5,269,,26a,1,27w,,27y,1,280,,281,3,287,1,28b,1,28d,,28l,2,28y,1,29u,,2bi,,2bj,,2bk,,2bl,1,2bq,2,2bu,2,2bx,,2c7,,2dc,,2dd,2,2dg,,2f0,,2f2,2,2f5,3,2fa,2,2fe,3,2fp,1,2g2,1,2gx,,2gy,1,2ik,,2im,,2in,1,2ip,,2iq,,2ir,1,2iu,2,2iy,3,2j9,1,2jm,1,2k3,,2kg,1,2ki,1,2m3,1,2m6,,2m7,1,2m9,3,2me,2,2mi,2,2ml,,2mm,,2mv,,2n6,1,2o1,,2o2,1,2q2,,2q7,,2q8,1,2qa,2,2qe,,2qg,6,2qn,,2r6,1,2sx,,2sz,,2t0,6,2tj,7,2wh,,2wj,,2wk,8,2x4,6,2zc,1,305,,307,,309,,30e,1,31t,d,327,,328,4,32e,1,32l,a,32x,z,346,,371,3,375,,376,5,37d,1,37f,1,37h,1,386,1,388,1,38e,2,38x,3,39e,,39g,,39h,1,39p,,3a5,,3cw,2n,3fk,1z,3hk,2f,3tp,2,4k2,3,4ky,2,4lu,1,4mq,1,4ok,1,4om,,4on,6,4ou,7,4p2,,4p3,1,4p5,a,4pp,,4qz,2,4r2,,4r3,,4ud,1,4vd,,4yo,2,4yr,3,4yv,1,4yx,2,4z4,1,4z6,,4z7,5,4zd,2,55j,1,55l,1,55n,,579,,57a,,57b,,57c,6,57k,,57m,,57p,7,57x,5,583,9,58f,,59s,19,5b4,b,5c0,3,5c4,,5dg,9,5dq,3,5du,2,5ez,8,5fk,1,5fm,,5gh,,5gi,3,5gm,1,5go,5,5ie,,5if,,5ig,1,5ii,2,5il,,5im,,5in,4,5k4,7,5kc,7,5kk,1,5km,1,5ow,2,5p0,c,5pd,,5pe,6,5pp,,5pw,,5pz,,5q0,1,5vk,1r,6bv,,6bw,,6bx,,6by,1,6co,6,6d8,,6dl,,6e8,f,6hc,w,6jm,,6k9,,6ms,5,6nd,1,6xm,1,6y0,,72n,,73d,a,73s,2,79e,,7fu,1,7g6,,7gg,,7i3,3,7i8,4,7im,,7ip,,7is,1,7iw,,7j1,,7j4,,7j6,1,7ja,,7je,,7ji,1,7js,2,7k0,,7k2,,7k8,b,7kv,1,7kz,,7l1,1,7l4,,7ln,,7lq,1,7ma,5,7mh,,7mj,1,7mo,1,7mv,,7my,1,7n4,1,7nh,1,7no,1,7ns,,7ny,1,7o1,,7o3,1,7op,1,7ow,5,7p3,3,7p9,,7pe,,7ph,,7pk,5,7pr,,7pu,,7pw,,7py,,7q5,,7q9,,7qg,,7qr,1,7r8,,7rb,,7rg,,7ri,,7rn,2,7rr,,7s3,1,7th,2,7tt,,7u8,,7un,,850,1,8hx,2,8ij,1,8k0,,8k5,,8vj,2,8zj,,928,v,wvj,3,wvo,9,wwu,1,wz4,1,x6q,,x6u,,x6z,,x7n,1,x7p,1,x7r,,x7w,,xa8,1,xbo,f,xc4,1,xcw,h,xdr,,xeu,7,xfr,a,xg2,,xg3,,xgg,s,xhc,2,xhf,,xir,,xis,1,xiu,3,xiy,1,xj0,1,xj2,1,xj4,,xk5,,xm1,5,xm7,1,xm9,1,xmb,1,xmd,1,xmr,,xn0,,xn1,,xoc,,xps,,xpu,2,xpz,1,xq6,1,xq9,,xrf,,xrg,1,xri,1,xrp,,xrq,,xyb,1,xyd,,xye,1,xyg,,xyh,1,xyk,,xyl,,1e68,f,1e74,f,1edb,,1ehq,1,1ek0,b,1eyl,,1f4w,,1f92,4,1gjl,2,1gjp,1,1gjw,3,1gl4,2,1glb,,1gpx,1,1h5w,3,1h7t,4,1hgr,1,1hiy,5,1hl2,a,1hmq,3,1hq8,,1hq9,,1hqa,,1hrs,e,1htc,,1htf,1,1htr,2,1htu,,1hv4,2,1hv7,3,1hvb,1,1hvd,1,1hvh,,1hvm,,1hvx,,1hxc,2,1hyf,4,1hyk,,1hyl,7,1hz9,1,1i0j,,1i0w,1,1i0y,,1i2b,2,1i2e,8,1i2n,,1i2o,,1i2q,1,1i2x,3,1i32,,1i33,,1i5o,2,1i5r,2,1i5u,1,1i5w,3,1i66,,1i69,,1ian,,1iao,2,1iar,7,1ibk,1,1ibm,1,1id7,1,1ida,,1idb,,1idc,,1idd,3,1idj,1,1idn,1,1idp,,1idz,,1iea,1,1iee,6,1ieo,4,1igo,,1igp,1,1igr,5,1igy,,1ih1,,1ih3,2,1ih6,,1ih8,1,1iha,2,1ihd,,1ihe,,1iht,1,1ik5,2,1ik8,7,1ikg,1,1iki,2,1ikl,,1ikm,,1ila,,1ink,,1inl,1,1inn,5,1int,,1inu,,1inv,1,1inx,,1iny,,1inz,1,1io1,,1io2,1,1iun,,1iuo,1,1iuq,3,1iuw,3,1iv0,1,1iv2,,1iv3,1,1ivw,1,1iy8,2,1iyb,7,1iyj,1,1iyl,,1iym,,1iyn,1,1j1n,,1j1o,,1j1p,,1j1q,1,1j1s,7,1j4t,,1j4u,,1j4v,,1j4y,3,1j52,,1j53,4,1jcc,2,1jcf,8,1jco,,1jcp,1,1jjk,,1jjl,4,1jjr,1,1jjv,3,1jjz,,1jk0,,1jk1,,1jk2,,1jk3,,1jo1,2,1jo4,3,1joa,1,1joc,3,1jog,,1jok,,1jpd,9,1jqr,5,1jqx,,1jqz,3,1jrb,,1jrl,5,1jrr,1,1jrt,2,1jt0,5,1jt6,c,1jtj,,1jtk,1,1jz4,,1jz5,,1jz6,2,1jz9,,1jza,,1jzb,,1k4v,,1k4w,6,1k54,5,1k5a,,1k5b,,1k7m,l,1k89,,1k8a,6,1k8h,,1k8i,1,1k8k,,1k8l,1,1kc1,5,1kca,,1kcc,1,1kcf,6,1kcm,,1kcn,,1kei,4,1keo,1,1ker,1,1ket,,1keu,,1kev,,1koj,1,1kol,1,1kow,1,1koy,,1koz,,1kqc,1,1kqe,4,1kqm,1,1kqo,2,1kre,,1ovk,f,1ow0,,1ow7,e,1xr2,b,1xre,2,1xrh,2,1zow,4,1zqo,6,206b,,206f,3,20jz,,20k1,1i,20lr,3,20o4,,20og,1,2ftp,1,2fts,3,2jgg,19,2jhs,m,2jxh,4,2jxp,5,2jxv,7,2jy3,7,2jyd,6,2jze,3,2k3m,2,2lmo,1i,2lob,1d,2lpx,,2lqc,,2lqz,4,2lr5,e,2mtc,6,2mtk,g,2mu3,6,2mub,1,2mue,4,2mxb,,2n1s,6,2nce,,2ne4,3,2nsc,3,2nzi,1,2o6b,,2o6e,,2o6m,1,2o6t,,2ok0,6,2on8,6,2pz8,,2q0c,3,2q38,b,2q3z,1,2q4g,,2q4v,1,2q5y,9,2q9c,1,2q9q,1,2qa6,,2qa9,9,2qb2,1j,2qcm,p,2qdd,e,2qe2,,2qen,,2qeq,8,2qf0,3,2qfd,m,2qg6,57,2qlg,33,2qom,1,2qop,2,2qou,2a,2qr7,2,2qrb,3,2qrf,4,2qrk,71,2qyn,1q,2r0p,5,2r0w,n,2r1r,1,2r1v,7,2r2f,,2r2i,3,2r2o,,2r2t,1,2r38,1,2r3c,,2r3l,1,2r3w,,2r42,2,2r4h,2,2r4s,2,2r4x,,2r4z,,2r54,,2r5b,,2r5f,,2r5m,2d,2r9c,1x,2rbf,7,2rbp,g,2rc9,,2rcb,5,2rcj,c,2riy,11,2rkc,3,2rm0,7,2rmi,5,2rns,7,2rou,1,2rp8,3,2rpe,d,2rq1,12,2rrg,1a,2rss,9,2rt3,54,2s0o,7,2s1a,41,2scg,sd,jny8,v,jnz4,2n,jo1s,3j,jo5c,6n,joc0,2rz",
  "262122424333333393233393339333333333393393b3b3b3b3b333b33b3bb33333b3b3333333b3b33bb3333b33b3bb33333b3bbb333b333b33333b3b3b3b3333b3b33b3bb39333b33b33b3b3b333b333333b3b333333b33b3b3333b3335dc333333b3b3b33323333b3bb3b33b3b3b3333b33333b3b333bb3b33b3b3b3b3b333b333b3323e22442344444444444444444444444444444444444444444444444444444444444444444444444444444443333333333b3b3bb33333b353b3b3b3b333b3b333b333333b3bb3b3b3bb333232333333333333333b3b3333bb3b393933b3b33bb3b393b3b3b3333b33b33b3bbb33b333b3333bb3933b3b3b333b3b3b3b3b33b3b3b33b3b3b33b3b33b33b3b3b33bb39b9b3b33b3b33b333b393b33b3b3bb33b33b3b3b3333393b3b3b33b39bb3b332333b333dd3b3333233332333333333333333333333333333444444444444a444444444444434444444444444444444444444444444444444444444423232"
);

// node_modules/unicode-segmenter/_incb_data.js
var consonant_ranges = decodeUnicodeData(
  /** @type {UnicodeDataEncoding} */
  "1sl,10,1ug,7,1vc,7,1w5,j,1wq,6,1wy,,1x2,3,1y4,1,1y7,,1yo,1,239,j,23u,6,242,1,245,4,261,,26t,j,27e,6,27m,1,27p,4,28s,1,28v,,29d,,2dx,j,2ei,f,2fs,2,2l1,11,35s,16,37j,,380,5,38a,3,38h,,38l,1,38u,2,391,c,39q,,4n4,1f,55s,1g,5cb,1,5cj,w,5dx,7,5fn,t,5gu,1,5h7,2,xhl,2,xhr,z,xk0,4,xk7,8,xkq,4,xnk,f,xo1,2,xoa,,xoe,1,xr4,a,xxc,q,1gjk,,1gk0,3,1gk5,2,1gk9,s,1hxf,z,1hz8,,1hzb,,1if4,9,1iff,,1ifi,,1ifk,11,1ji8,6,1jih,,1jik,7,1jit,1,1jiw,n,1jpc,,1jpn,13,1jrk,,1jrw,13,1kp0,c,1kpe,x"
);

// node_modules/unicode-segmenter/grapheme.js
var BMP_MAX = 65535;
function* graphemeSegments(input) {
  let cp = input.codePointAt(0);
  if (cp == null) return;
  let cursor = cp <= BMP_MAX ? 1 : 2;
  let len = input.length;
  let catBefore = cat(cp);
  let catAfter = 0;
  let risCount = 0;
  let emoji = false;
  let consonant = false;
  let linker = false;
  let index = 0;
  let _catBegin = catBefore;
  let _hd = cp;
  while (cursor < len) {
    cp = /** @type {number} */
    input.codePointAt(cursor);
    catAfter = cat(cp);
    let boundary = true;
    if (catBefore === 1) {
      boundary = catAfter !== 6;
    } else if (catBefore === 2 || catBefore === 6) {
      boundary = true;
    } else if (catAfter === 1 || catAfter === 2 || catAfter === 6) {
      boundary = true;
    } else if (catAfter === 3 || catAfter === 14 || catAfter === 11) {
      boundary = false;
    } else if (catBefore === 9) {
      boundary = false;
    } else if (catBefore === 14 && catAfter === 4) {
      boundary = !emoji;
    } else if (catBefore === 10 && catAfter === 10) {
      boundary = risCount++ % 2 === 1;
    } else if (catBefore === 5) {
      boundary = !(catAfter === 5 || catAfter === 13 || catAfter === 7 || catAfter === 8);
    } else if ((catBefore === 7 || catBefore === 13) && (catAfter === 13 || catAfter === 12)) {
      boundary = false;
    } else if ((catBefore === 8 || catBefore === 12) && catAfter === 12) {
      boundary = false;
    } else if (catAfter === 0 && consonant && linker && isIndicConjunctConsonant(cp)) {
      boundary = false;
    }
    if (boundary) {
      yield {
        segment: input.slice(index, cursor),
        index,
        input,
        _hd,
        _catBegin,
        _catEnd: catBefore
      };
      emoji = false;
      risCount = 0;
      index = cursor;
      _catBegin = catAfter;
      _hd = cp;
    } else {
      if (catAfter === 14 && (catBefore === 3 || catBefore === 4)) {
        emoji = true;
      } else if (cp >= 2325) {
        if (!consonant && catBefore === 0) {
          consonant = isIndicConjunctConsonant(_hd);
        }
        if (consonant && catAfter === 3) {
          linker = linker || cp === 2381 || cp === 2509 || cp === 2637 || cp === 2765 || cp === 2893 || cp === 3149 || cp === 3405 || cp === 4153 || cp === 6098 || cp === 6752 || cp === 6980 || cp === 7083 || cp === 43456 || cp === 43766 || cp === 68159 || cp === 69939 || cp === 70608 || cp === 71998 || cp === 72263 || cp === 72345 || cp === 73538;
        } else {
          linker = false;
        }
      }
    }
    cursor += cp <= BMP_MAX ? 1 : 2;
    catBefore = catAfter;
  }
  if (index < len) {
    yield {
      segment: input.slice(index),
      index,
      input,
      _hd,
      _catBegin,
      _catEnd: catBefore
    };
  }
}
var SEG0 = new Uint8Array(6080);
var SEG0_MIN = 128;
var SEG0_MAX = 12287;
var SEG1 = new Uint8Array(1536);
var SEG1_MIN = 40960;
var SEG1_MAX = 44031;
var SEG_CURSOR = (() => {
  let cursor = 0;
  while (true) {
    let [start, end, cat2] = grapheme_ranges[cursor];
    if (start > SEG1_MAX) break;
    cursor++;
    if (end < SEG0_MIN || start > SEG0_MAX && end < SEG1_MIN) continue;
    for (let cp = start; cp <= end; cp++) {
      let seg, idx = 0;
      if (cp <= SEG0_MAX) {
        seg = SEG0;
        idx = cp - SEG0_MIN >> 1;
      } else {
        seg = SEG1;
        idx = cp - SEG1_MIN >> 1;
      }
      seg[idx] = cp & 1 ? seg[idx] & 15 | cat2 << 4 : seg[idx] & 240 | cat2;
    }
  }
  return cursor;
})();
function cat(cp) {
  if (cp < SEG0_MIN) {
    if (cp >= 32) return 0;
    if (cp === 10) return 6;
    if (cp === 13) return 1;
    return 2;
  }
  if (cp <= SEG0_MAX) {
    let byte = SEG0[cp - SEG0_MIN >> 1];
    return (
      /** @type {GraphemeCategoryNum} */
      cp & 1 ? byte >> 4 : byte & 15
    );
  }
  if (cp < SEG1_MIN) {
    if (cp < 12336) return cp >= 12330 ? 3 : 0;
    if (cp < 12443) {
      if (cp === 12336 || cp === 12349) return 4;
      return cp >= 12441 ? 3 : 0;
    }
    if (cp === 12951 || cp === 12953) return 4;
    return 0;
  }
  if (cp <= SEG1_MAX) {
    let byte = SEG1[cp - SEG1_MIN >> 1];
    return (
      /** @type {GraphemeCategoryNum} */
      cp & 1 ? byte >> 4 : byte & 15
    );
  }
  if (cp <= 55203) {
    return (cp - 44032) % 28 === 0 ? 7 : 8;
  }
  if (cp <= 55295) {
    if (cp <= 55238) return cp >= 55216 ? 13 : 0;
    return cp >= 55243 ? 12 : 0;
  }
  if (cp < 65024) {
    return cp === 64286 ? 3 : 0;
  }
  let idx = findUnicodeRangeIndex(cp, grapheme_ranges, SEG_CURSOR);
  return idx < 0 ? 0 : grapheme_ranges[idx][2];
}
function isIndicConjunctConsonant(cp) {
  return findUnicodeRangeIndex(cp, consonant_ranges) >= 0;
}

// node_modules/@pmndrs/glyph/dist/internal/graphemes.js
function t17(t31) {
  n26(t31);
  let r34 = new Uint32Array(t31.length + 1), i36 = 1;
  for (let n39 of graphemeSegments(t31)) {
    if (i36 === r34.length) {
      let e29 = new Uint32Array(r34.length * 2);
      e29.set(r34), r34 = e29;
    }
    r34[i36] = n39.index + n39.segment.length, i36 += 1;
  }
  return r34.subarray(0, i36);
}
function n26(e29) {
  if (!e29.isWellFormed()) throw RangeError(`paragraph text must be well-formed UTF-16`);
}
function r25(e29, t31) {
  let n39;
  for (let [r34, i36] of e29.entries()) {
    let o34 = a24(t31, i36.start), s33 = a24(t31, i36.end), c30 = i36.start <= i36.end ? Math.max(o34, s33) : s33;
    if (o34 === i36.start && c30 === i36.end) {
      n39?.push(i36);
      continue;
    }
    n39 ??= e29.slice(0, r34), n39.push({ ...i36, start: o34, end: c30 });
  }
  return n39 ?? e29;
}
function i23(e29, n39) {
  return n39.length === 0 || !e29.isWellFormed() ? n39 : r25(n39, t17(e29));
}
function a24(e29, t31) {
  let n39 = e29[e29.length - 1] ?? 0;
  if (!Number.isSafeInteger(t31) || t31 <= 0 || t31 >= n39) return t31;
  let r34 = 0, i36 = e29.length - 1;
  for (; r34 < i36; ) {
    let n40 = r34 + i36 >>> 1;
    e29[n40] < t31 ? r34 = n40 + 1 : i36 = n40;
  }
  return e29[r34] ?? t31;
}

// node_modules/@pmndrs/glyph/dist/formatted-text.js
function i24(e29, n39) {
  return i23(e29, n39);
}

// node_modules/@pmndrs/glyph/dist/layout.js
var t18 = e5.engine.glyphFlags;
function n27(e29) {
  return Object.freeze({ ...e29, fontHandles: e29.fontHandles.slice(), glyphStableIds: e29.glyphStableIds.slice(), glyphFontSlots: e29.glyphFontSlots.slice(), glyphIds: e29.glyphIds.slice(), clusters: e29.clusters.slice(), glyphBidiLevels: e29.glyphBidiLevels.slice(), glyphFontSizes: e29.glyphFontSizes.slice(), x: e29.x.slice(), y: e29.y.slice(), glyphAdvances: e29.glyphAdvances.slice(), glyphInkX: e29.glyphInkX.slice(), glyphInkY: e29.glyphInkY.slice(), glyphInkWidths: e29.glyphInkWidths.slice(), glyphInkHeights: e29.glyphInkHeights.slice(), glyphFlags: e29.glyphFlags.slice(), lineTextStarts: e29.lineTextStarts.slice(), lineTextEnds: e29.lineTextEnds.slice(), lineGlyphStarts: e29.lineGlyphStarts.slice(), lineGlyphCounts: e29.lineGlyphCounts.slice(), lineBaselines: e29.lineBaselines.slice(), lineAdvances: e29.lineAdvances.slice() });
}

// node_modules/@pmndrs/glyph/dist/glyph.js
init_loader();

// node_modules/@pmndrs/glyph/dist/font-face.js
init_loaded_font();
init_raster_format_registry();
init_loader();
init_font_face_transfer();
var u16 = /* @__PURE__ */ new WeakMap();
var d11 = /* @__PURE__ */ new WeakMap();
var f15 = /* @__PURE__ */ new Map();
var p15 = 1;
var m14 = 1;
var h14 = new FinalizationRegistry((e29) => {
  B2(e29.owner);
  let t31 = f15.get(e29.family);
  t31?.generation === e29.generation && t31.face.deref() === void 0 && f15.delete(e29.family);
});
function g13(e29, t31, n39 = {}) {
  G2(t31), W2(n39);
  let r34 = n39.family === void 0 ? J2() : q2(n39.family), i36 = f15.get(r34)?.face.deref();
  if (i36 !== void 0 && !i36.disposed) throw Error(`FontFace family ${JSON.stringify(r34)} already exists`);
  let a34 = e16(t31) ? t15(t31) : t31, o34 = V2(n39.format), l29 = /* @__PURE__ */ new Map(), d24 = { records: /* @__PURE__ */ new Map(), sourcePromise: void 0, sourceLease: void 0, sourceController: void 0, disposed: false }, p28 = { library: e29, source: a34, family: r34, formats: o34, owner: d24, selections: l29, formatsPromise: void 0, aggregatePromise: void 0, aggregateLoaded: false }, g23, _20 = o34[0], y22 = { family: r34, format: _20, get face() {
    return g23;
  }, get default() {
    return g23;
  }, get disposed() {
    return d24.disposed;
  }, load() {
    return C10(g23);
  }, formats() {
    return A5(g23);
  }, isLoaded() {
    return N4(g23);
  }, clone() {
    return w9(g23);
  }, dispose() {
    v13(g23);
  } };
  g23 = y22, u16.set(g23, { face: p28, format: _20, aggregate: true, promises: /* @__PURE__ */ new Map() });
  for (let e30 of o34) {
    let t32 = U2(e30);
    if (l29.has(t32)) throw TypeError(`FontFace format ${JSON.stringify(t32)} is declared more than once`);
    let n40;
    n40 = Object.freeze({ family: r34, format: e30, face: g23, load() {
      return E8(n40);
    }, isLoaded() {
      return D7(n40);
    }, clone() {
      return w9(n40);
    } }), u16.set(n40, { face: p28, format: e30, aggregate: false, promises: /* @__PURE__ */ new Map() }), l29.set(t32, n40), Object.defineProperty(y22, t32, { enumerable: true, value: n40 });
  }
  Object.freeze(y22);
  let b20 = m14++;
  return f15.set(r34, { generation: b20, face: new WeakRef(g23) }), h14.register(g23, { family: r34, generation: b20, owner: d24 }, g23), g23;
}
function v13(e29) {
  if (typeof e29 != `object` && typeof e29 != `function` || e29 === null) throw TypeError(`FontFace.dispose() requires an authentic FontFace declaration`);
  let t31 = u16.get(e29);
  if (t31 === void 0) throw TypeError(`FontFace.dispose() requires an authentic FontFace declaration`);
  if (t31.format !== e29.format || t31.face.family !== e29.family) throw TypeError(`FontFace.dispose() must be called on the declaration, not a format selection`);
  t31.face.owner.disposed || (h14.unregister(e29), z2(t31.face), f15.get(t31.face.family)?.face.deref() === e29 && f15.delete(t31.face.family));
}
function y12(e29) {
  if (typeof e29 != `object` && typeof e29 != `function` || e29 === null) throw TypeError(`font must be a FontFace selection`);
  let t31 = u16.get(e29);
  if (t31 === void 0) throw TypeError(`font was not created by glyph.fontFace()`);
  if (t31.face.owner.disposed) throw TypeError(`FontFace ${JSON.stringify(t31.face.family)} has been disposed`);
  return t31;
}
var S9 = class {
  #e;
  #t;
  #n = false;
  constructor(e29, n39) {
    if (typeof n39 != `string` || n39.length === 0) throw TypeError(`font default format must be a nonempty string`);
    let r34 = Object.keys(e29);
    if (r34.length === 0) throw TypeError(`font format map must not be empty`);
    let i36 = {};
    for (let n40 of r34) {
      let r35 = Reflect.get(e29, n40);
      if (n40.length === 0 || !o11(r35)) throw TypeError(`font format map must contain authentic raster formats under nonempty keys`);
      i36[n40] = r35;
    }
    if (i36[n39] === void 0) throw TypeError(`font default format ${JSON.stringify(n39)} is not registered`);
    this.#e = Object.freeze(i36), this.#t = n39;
  }
  isLoaded(e29) {
    return this.#i(), P4(e29, this.#r(y12(e29).format));
  }
  load(e29) {
    return this.#i(), O6(e29, this.#r(y12(e29).format));
  }
  acquire(t31) {
    this.#i();
    let n39 = F4(t31, this.#r(y12(t31).format));
    return m(n39);
  }
  peek(e29) {
    return this.#i(), F4(e29, this.#r(y12(e29).format));
  }
  dispose() {
    this.#n ||= true;
  }
  #r(e29) {
    if (e29 === void 0) return this.#e[this.#t];
    if (typeof e29 == `string`) {
      let t31 = this.#e[e29];
      if (t31 === void 0) throw TypeError(`font format ${JSON.stringify(e29)} is not supported`);
      return t31;
    }
    let n39 = e29, r34 = o11(n39) ? n39 : n39.raster;
    if (Object.values(this.#e).find((e30) => e30 === r34) === void 0) throw TypeError(`font format ${JSON.stringify(r34.kind)} is not supported`);
    return n39;
  }
  #i() {
    if (this.#n) throw Error(`font handle store has been disposed`);
  }
};
function C10(e29) {
  let t31 = y12(e29), n39 = t31.face;
  if (!t31.aggregate) throw TypeError(`FontFace aggregate loading requires the declaration object`);
  if (n39.aggregatePromise !== void 0) return n39.aggregatePromise;
  let r34;
  return r34 = Promise.resolve().then(() => T8(n39)).then(() => {
    if (n39.owner.disposed || n39.aggregatePromise !== r34) throw new DOMException(`FontFace load owner was disposed`, `AbortError`);
    return n39.aggregateLoaded = true, e29;
  }, (e30) => {
    throw n39.aggregatePromise === r34 && (n39.aggregatePromise = void 0), e30;
  }), n39.aggregatePromise = r34, r34;
}
async function w9(e29) {
  let t31 = y12(e29);
  t31.aggregate ? await C10(e29.face) : await E8(e29);
  let n39 = t31.aggregate ? [...t31.face.owner.records.values()].map((e30) => {
    if (e30.font === void 0) throw Error(`loaded FontFace record has no immutable Font`);
    return e30.font;
  }) : [F4(e29, I3(t31.format))], r34 = await (await j4(t31.face.owner, t31.face.library, t31.face.source, t31.face.formats.map(I3))).snapshot(n39);
  return [r34, n24(r34)];
}
async function T8(e29) {
  let t31 = e29.owner, n39 = e29.formats.map(I3), r34 = await j4(t31, e29.library, e29.source, n39), a34 = [...n39.map((e30) => r34.load(e30).then((e31) => [e31])), r34.loadAdvertised(n39.map(R2))], o34;
  try {
    o34 = await Promise.all(a34);
  } catch (e30) {
    let t32 = await Promise.allSettled(a34);
    for (let e31 of t32) if (e31.status === `fulfilled`) for (let t33 of e31.value) t33.dispose();
    throw e30;
  }
  let s33 = o34.flat();
  if (s33.length === 0) throw new E6(`FONT_FACE_FORMAT_REQUIRED`, `FontFace ${JSON.stringify(e29.family)} advertises no raster formats; runtime font sources must declare the formats to bake`);
  if (t31.disposed) {
    for (let e30 of s33) e30.dispose();
    throw new DOMException(`FontFace load owner was disposed`, `AbortError`);
  }
  for (let e30 of s33) {
    if (t31.records.get(e30.raster) !== void 0) {
      e30.dispose();
      continue;
    }
    t31.records.set(e30.raster, { promise: Promise.resolve(e30), font: e30 });
  }
}
function E8(e29) {
  let t31 = y12(e29);
  if (t31.aggregate || t31.format === void 0) throw TypeError(`FontFace format loading requires a declared format member`);
  return O6(e29, I3(t31.format));
}
function D7(e29) {
  let t31 = y12(e29);
  if (t31.aggregate || t31.format === void 0) return false;
  let n39 = L2(t31.format);
  return n39 !== void 0 && P4(e29, n39);
}
function O6(e29, t31) {
  let n39 = y12(e29), r34 = R2(t31), i36 = n39.promises.get(r34);
  if (i36 !== void 0) return i36;
  let a34 = n39.face.owner.records.get(r34);
  a34 === void 0 && (a34 = k6(n39.face.owner, n39.face.family, n39.face.library, n39.face.source, t31, r34), n39.face.owner.records.set(r34, a34));
  let o34 = a34, s33;
  return s33 = o34.promise.then(() => e29, (e30) => {
    throw n39.promises.get(r34) === s33 && n39.promises.delete(r34), e30;
  }), n39.promises.set(r34, s33), s33;
}
function k6(e29, t31, n39, r34, a34, o34) {
  let s33;
  return s33 = { promise: j4(e29, n39, r34, [a34]).then((e30) => e30.load(a34)).then((t32) => {
    if (e29.disposed || e29.records.get(o34) !== s33) throw t32.dispose(), new DOMException(`FontFace load owner was disposed`, `AbortError`);
    return s33.font = t32, t32;
  }, (n40) => {
    throw e29.records.get(o34) === s33 && e29.records.delete(o34), n40 instanceof E6 && (n40.reason === `RASTER_NOT_FOUND` || n40.reason === `RASTER_SOURCE_UNAVAILABLE`) ? new E6(`FONT_FACE_FORMAT_UNAVAILABLE`, `FontFace ${JSON.stringify(t31)} does not implement the declared ${JSON.stringify(o34.kind)} format`, { cause: n40 }) : n40;
  }), font: void 0 }, s33;
}
function A5(e29) {
  let t31 = y12(e29);
  if (!t31.aggregate) throw TypeError(`FontFace format inspection requires the declaration object`);
  let n39 = t31.face;
  if (n39.formatsPromise !== void 0) return n39.formatsPromise;
  let r34;
  return r34 = j4(n39.owner, n39.library, n39.source, []).then((e30) => e30.formats, (e30) => {
    throw n39.formatsPromise === r34 && (n39.formatsPromise = void 0), e30;
  }), n39.formatsPromise = r34, r34;
}
function j4(e29, t31, n39, r34) {
  if (e29.sourcePromise !== void 0) return e29.sourcePromise;
  let i36 = new AbortController();
  e29.sourceController = i36;
  let a34;
  return a34 = M4(t31, n39, r34, i36.signal).then((t32) => {
    if (e29.disposed || e29.sourcePromise !== a34) throw t32.dispose(), new DOMException(`FontFace source owner was disposed`, `AbortError`);
    return e29.sourceLease = t32, t32;
  }, (t32) => {
    throw e29.sourcePromise === a34 && (e29.sourcePromise = void 0, e29.sourceController = void 0), t32;
  }), e29.sourcePromise = a34, a34;
}
function M4(e29, t31, n39, r34) {
  return e16(t31) ? fe(e29, t31, { signal: r34 }) : K2(t31).then((t32) => de(e29, t32, n39, { signal: r34 }));
}
function N4(e29) {
  let t31 = y12(e29);
  return t31.aggregate ? t31.face.aggregateLoaded : false;
}
function P4(e29, t31) {
  return y12(e29).face.owner.records.get(R2(t31))?.font !== void 0;
}
function F4(e29, t31) {
  let n39 = y12(e29), r34 = R2(t31), a34 = n39.face.owner.records.get(r34)?.font;
  if (a34 === void 0) throw new E6(`FONT_FACE_FORMAT_NOT_LOADED`, `FontFace ${JSON.stringify(e29.family)} format ${JSON.stringify(r34.kind)} is not loaded`);
  return a34;
}
function I3(e29) {
  let t31 = L2(e29);
  if (t31 === void 0) throw new E6(`FONT_FACE_FORMAT_UNAVAILABLE`, `font format ${JSON.stringify(e29)} does not name an imported raster format`);
  return t31;
}
function L2(e29) {
  return typeof e29 == `string` ? d5(e29) : e29;
}
function R2(e29) {
  return o11(e29) ? e29 : e29.raster;
}
function z2(e29) {
  e29.aggregateLoaded = false, e29.aggregatePromise = void 0, e29.formatsPromise = void 0, B2(e29.owner);
}
function B2(e29) {
  if (!e29.disposed) {
    e29.disposed = true, e29.sourceController?.abort(new DOMException(`FontFace load owner was disposed`, `AbortError`)), e29.sourceController = void 0;
    for (let t31 of e29.records.values()) t31.font?.dispose(), t31.font = void 0;
    e29.records.clear(), e29.sourceLease?.dispose(), e29.sourceLease = void 0, e29.sourcePromise = void 0;
  }
}
function V2(e29) {
  if (e29 === void 0) return [];
  if (!Array.isArray(e29)) return H2(e29), [e29];
  if (e29.length === 0) throw TypeError(`FontFace format array must not be empty`);
  let t31 = [];
  for (let n39 of e29) H2(n39), t31.push(n39);
  return t31;
}
function H2(e29) {
  if (typeof e29 == `string`) {
    if (e29.length === 0) throw TypeError(`FontFace format key must not be empty`);
    return;
  }
  if (!o11(e29) && !c9(e29)) throw TypeError(`FontFace format must be a key, raster format, or package-created raster-format request`);
}
function U2(e29) {
  return typeof e29 == `string` ? e29 : o11(e29) ? e29.kind : e29.raster.kind;
}
function W2(e29) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`FontFace config must be an object`);
  if (Object.keys(e29).some((e30) => e30 !== `family` && e30 !== `format`)) throw TypeError(`FontFace config only accepts family and format`);
  let t31 = Reflect.get(e29, `family`);
  t31 !== void 0 && q2(t31), V2(Reflect.get(e29, `format`));
}
function G2(e29) {
  if (!(typeof Blob < `u` && e29 instanceof Blob) && !(typeof e29 == `string` || e29 instanceof URL) && !e16(e29)) throw TypeError(`FontFace source must be a URL, Blob, or SerializedFontFace`);
}
function K2(e29) {
  if (e16(e29)) throw TypeError(`SerializedFontFace uses the transfer loader`);
  if (typeof e29 == `string` || e29 instanceof URL) return Promise.resolve(e29);
  let t31 = d11.get(e29);
  if (t31 !== void 0) return t31;
  let n39;
  return n39 = e29.arrayBuffer().then((t32) => {
    let n40 = { bytes: new Uint8Array(t32), ownership: `copy` }, r34 = `name` in e29 && typeof e29.name == `string` ? e29.name : ``;
    return /\.(?:otf|ttf)$/iu.test(r34) || /^(?:font\/(?:otf|ttf)|application\/x-font-(?:otf|ttf))$/iu.test(e29.type) ? { source: n40 } : { baked: n40 };
  }, (t32) => {
    throw d11.get(e29) === n39 && d11.delete(e29), t32;
  }), d11.set(e29, n39), n39;
}
function q2(e29) {
  if (typeof e29 != `string` || e29.trim().length === 0) throw TypeError(`FontFace family must be a nonempty string`);
  return e29.trim();
}
function J2() {
  for (; ; ) {
    let e29 = `Font${p15++}`, t31 = f15.get(e29)?.face.deref();
    if (t31 === void 0 || t31.disposed) return e29;
  }
}

// node_modules/@pmndrs/glyph/dist/glyph-engine.js
init_dev();
init_loaded_font();

// node_modules/@pmndrs/glyph/dist/shaper.js
init_registered_font();
init_loader();

// node_modules/@pmndrs/glyph/dist/internal/shaper-wasm-url.js
function e20() {
  return new URL(`../../dist/text-shaper.wasm`, void 0);
}

// node_modules/@pmndrs/glyph/dist/shaper.js
function i25(e29) {
  if (!(e29 instanceof o25)) throw TypeError(`runtime shaper was not created by this package`);
  return e29._assertEngineAccess(), e29._engineExports();
}
async function a25(e29 = {}) {
  let t31 = e29.wasm ?? await s25(), r34 = t31 instanceof WebAssembly.Module ? t31 : await WebAssembly.compile(t31), i36 = c22(await WebAssembly.instantiate(r34, {}));
  return new o25(e29.registry ?? new D4(), i36);
}
var o25 = class {
  registry;
  #e;
  #t = /* @__PURE__ */ new Map();
  #n;
  #r = false;
  constructor(e29, t31) {
    this.registry = e29, this.#e = t31.exports, this.#n = e29._onFontDispose((e30) => this.#a(e30.handle));
  }
  registerFont(e29) {
    if (this.#o(), this.registry.getByHandle(e29.handle) !== e29) throw TypeError(`font is not active in this shaper's registry`);
    if (this.#t.get(e29.handle) === e29) return;
    let n39 = n22(e29);
    this.#i(e29.handle, n39.shapingSfnt, n39.glyphExtents, n39.glyphExtentsAvailability, p16(e29.metrics.underlinePosition, e29.metrics.underlineThickness), p16(e29.metrics.strikeoutPosition, e29.metrics.strikeoutSize)), this.#t.set(e29.handle, e29);
  }
  #i(e29, t31, n39, r34, i36, a34) {
    let o34, s33, c30;
    try {
      o34 = u17(this.#e, t31), s33 = u17(this.#e, n39), c30 = u17(this.#e, r34);
      let l29 = this.#e.registerFont(e29, o34.pointer, o34.length, s33.pointer, s33.length, c30.pointer, c30.length, i36, a34);
      if (l29 !== 0) throw m15(l29, `register font`);
    } finally {
      c30 !== void 0 && this.#e.deallocate(c30.pointer, c30.length), s33 !== void 0 && this.#e.deallocate(s33.pointer, s33.length), o34 !== void 0 && this.#e.deallocate(o34.pointer, o34.length);
    }
  }
  disposeFont(e29) {
    this.#o(), this.#t.get(e29.handle) === e29 && this.#a(e29.handle);
  }
  memoryReport() {
    return this.#o(), { fontCount: this.#e.fontCount(), retainedFontBytes: this.#e.retainedFontBytes(), shapePlanCount: this.#e.shapePlanCount(), wasmMemoryBytes: this.#e.memory.buffer.byteLength };
  }
  dispose() {
    if (!this.#r) {
      this.#n();
      for (let e29 of [...this.#t.keys()]) this.#a(e29);
      this.#r = true;
    }
  }
  _engineExports() {
    return this.#e;
  }
  _assertEngineAccess() {
    this.#o();
  }
  #a(e29) {
    if (!this.#t.has(e29)) return;
    let t31 = this.#e.disposeFont(e29);
    if (t31 !== 0 && t31 !== 5) throw m15(t31, `dispose font`);
    this.#t.delete(e29);
  }
  #o() {
    if (this.#r) throw Error(`runtime shaper is disposed`);
  }
};
async function s25() {
  let e29 = e20();
  if (e29.protocol === `file:` && typeof process < `u` && typeof process.getBuiltinModule == `function`) {
    let t32 = process.getBuiltinModule(`node:fs`).readFileSync(e29);
    return Uint8Array.from(t32).buffer;
  }
  let t31 = await fetch(e29);
  if (!t31.ok) throw Error(`text shaper Wasm request failed with HTTP ${t31.status}`);
  return t31.arrayBuffer();
}
function c22(t31) {
  let n39 = t31.exports.memory;
  if (!(n39 instanceof WebAssembly.Memory)) throw TypeError(`text shaper is missing memory`);
  let r34 = e5.functions, i36 = l18(t31, r34.initialize)();
  if (i36 !== 0) throw m15(i36, `initialize`);
  return { exports: { memory: n39, allocate: l18(t31, r34.allocate), deallocate: l18(t31, r34.deallocate), registerFont: l18(t31, r34.registerFont), disposeFont: l18(t31, r34.disposeFont), fontCount: l18(t31, r34.fontCount), retainedFontBytes: l18(t31, r34.retainedFontBytes), shapePlanCount: l18(t31, r34.shapePlanCount), registerFontBinding: l18(t31, r34.registerFontBinding), disposeFontBinding: l18(t31, r34.disposeFontBinding), fontBindingCount: l18(t31, r34.fontBindingCount), registerFontStack: l18(t31, r34.registerFontStack), disposeFontStack: l18(t31, r34.disposeFontStack), registerCodec: l18(t31, r34.registerCodec), disposeCodec: l18(t31, r34.disposeCodec), createRoot: l18(t31, r34.createRoot), reserveRoot: l18(t31, r34.reserveRoot), disposeRoot: l18(t31, r34.disposeRoot), requestPointer: l18(t31, r34.requestPointer), requestCapacity: l18(t31, r34.requestCapacity), reserveUpdateBatch: l18(t31, r34.reserveUpdateBatch), updateBatchPointer: l18(t31, r34.updateBatchPointer), updateBatchCapacity: l18(t31, r34.updateBatchCapacity), textUpdate: l18(t31, r34.textUpdate), textUpdateBatch: l18(t31, r34.textUpdateBatch), measureParagraph: l18(t31, r34.measureParagraph), borrowParagraphLayout: l18(t31, r34.borrowParagraphLayout), borrowParagraphGlyph: l18(t31, r34.borrowParagraphGlyph), copyGlyphs: l18(t31, r34.copyGlyphs), copyDecorations: l18(t31, r34.copyDecorations) } };
}
function l18(e29, t31) {
  let n39 = e29.exports[t31];
  if (typeof n39 != `function`) throw TypeError(`text shaper is missing export ${t31}`);
  return n39;
}
function u17(e29, t31) {
  let n39 = t31.byteLength, r34 = e29.allocate(n39);
  if (r34 === 0 && n39 !== 0) throw RangeError(`text shaper allocation failed`);
  return d12(e29.memory, r34, n39).set(t31), { pointer: r34, length: n39 };
}
function d12(e29, t31, n39) {
  if (f16(t31, `Wasm pointer`), f16(n39, `Wasm length`), t31 + n39 > e29.buffer.byteLength) throw RangeError(`text shaper memory range is out of bounds`);
  return new Uint8Array(e29.buffer, t31, n39);
}
function f16(e29, t31) {
  if (!Number.isInteger(e29) || e29 < 0 || e29 > 4294967295) throw RangeError(`${t31} must be an unsigned 32-bit integer`);
  return e29;
}
function p16(e29, t31) {
  return ((e29 & 65535) << 16 | t31 & 65535) >>> 0;
}
function m15(e29, t31) {
  return Error(`text shaper could not ${t31}: ${{ 1: `invalid font handle`, 2: `invalid shaping SFNT`, 3: `invalid glyph extents`, 4: `font handle conflict`, 5: `font handle is not registered`, 6: `invalid batch request`, 7: `result exceeds the V0 address space`, 13: `font stack handle is not registered`, 14: `font is retained by a registered font stack` }[e29] ?? `status ${e29}`}`);
}

// node_modules/@pmndrs/glyph/dist/internal/handle-state.js
init_loaded_font();

// node_modules/@pmndrs/glyph/dist/config/raster.js
init_loaded_font();

// node_modules/@pmndrs/glyph/dist/internal/font-binding.js
var i26 = 4294967295;
var a26 = 65535;
function o26(e29, t31, n39) {
  return { rows: t31, fields: e29.map((e30) => n39[e30]), names: e29 };
}
function c23(e29) {
  return typeof e29 == `object` && !!e29;
}
function l19(e29, t31) {
  a4(t31, `font binding resource ids`);
  let r34 = /* @__PURE__ */ new Map(), i36 = /* @__PURE__ */ new Map();
  for (let n39 of e29) {
    if (r34.has(n39)) continue;
    let e30 = t31.resource(n39), a35 = i36.get(e30);
    if (a35 !== void 0 && a35 !== n39) throw TypeError(`raster resource wire identity collision between "${a35}" and "${n39}"`);
    i36.set(e30, n39), r34.set(n39, { key: n39, id: e30, generation: 1, kind: 1, reference: e30 });
  }
  let a34 = [...r34.values()].sort((e30, t32) => e30.id - t32.id), o34 = new Map(a34.map((e30, t32) => [e30.key, t32]));
  return { resources: a34, indexFor(e30) {
    let t32 = o34.get(e30);
    if (t32 === void 0) throw TypeError(`font binding references unknown raster resource "${e30}"`);
    return t32;
  } };
}
function u18(t31) {
  if (!c23(t31)) throw TypeError(`font binding descriptor must be an object`);
  let { techniqueId: n39, programVariant: r34, glyphCount: i36, strikes: o34, resources: s33, resourceIndex: l29 } = t31, { glyphF32: u28, glyphU32: h24, strikeF32: g23, strikeU32: S17, resourceF32: C17, resourceU32: w15 } = t31, T13 = b11(n39, `font binding techniqueId`);
  if (T13 === 0) throw RangeError(`font binding techniqueId must not be the reserved zero technique`);
  let E13 = x11(r34, `font binding programVariant`), D12 = b11(i36, `font binding glyphCount`);
  if (D12 === 0) throw RangeError(`font binding glyphCount must be positive`);
  if (D12 > a26) throw RangeError(`font binding glyphCount ${D12} exceeds the u16 wire maximum`);
  let O11 = d13(o34), k11 = f17(s33);
  if (typeof l29 != `function`) throw TypeError(`font binding resourceIndex must be a function`);
  let A10 = y13(D12, O11.length, `font resource rows`), j9 = [[`glyphF32`, u28, D12], [`glyphU32`, h24, D12], [`strikeF32`, g23, A10], [`strikeU32`, S17, A10], [`resourceF32`, C17, k11.length], [`resourceU32`, w15, k11.length]], M9 = j9.map(([e29, t32, n40]) => p17(e29, t32, n40));
  y13(A10, 4, `font resource index bytes`);
  let N9 = new Uint32Array(A10);
  for (let e29 = 0; e29 < A10; e29 += 1) {
    let t32 = b11(l29(e29), `font binding resourceIndex(${e29})`);
    if (t32 !== 4294967295 && t32 >= k11.length) throw RangeError(`font binding resourceIndex(${e29}) selected resource ${t32} outside the ${k11.length} declared resources`);
    N9[e29] = t32;
  }
  let P8 = M9.map((e29, t32) => m16(j9[t32][0], e29)), F8 = e5.layouts.fontBindingRequest, I6 = e5.layouts.fontBindingStrike, L5 = e5.layouts.fontBindingResource, R5 = F8.size, z4 = (e29, t32, n40) => {
    if (e29 === 0) return 0;
    let r35 = _12(R5, n40);
    return R5 = v14(r35, y13(e29, t32, `font binding table`), `font binding bytes`), r35;
  }, B4 = z4(O11.length, I6.size, I6.alignment), V4 = z4(k11.length, L5.size, L5.alignment), H4 = z4(N9.length, 4, 4), U4 = P8.map((e29) => z4(y13(e29.rows, e29.fieldCount, `font binding fields`), 4, 4)), W4 = new Uint8Array(R5), G4 = new DataView(W4.buffer);
  G4.setUint32(F8.abiVersion, e5.version, true), G4.setUint32(F8.byteLength, W4.byteLength, true), G4.setUint32(F8.techniqueId, T13, true), G4.setUint16(F8.programVariant, E13, true), G4.setUint32(F8.glyphCount, D12, true), G4.setUint32(F8.strikeCount, O11.length, true), G4.setUint32(F8.resourceCount, k11.length, true), G4.setUint32(F8.strikesOffset, B4, true), G4.setUint32(F8.resourcesOffset, V4, true), G4.setUint32(F8.resourceIndicesOffset, H4, true);
  for (let [e29, t32] of O11.entries()) G4.setUint32(B4 + e29 * I6.size + I6.ppem, t32, true);
  for (let [e29, t32] of k11.entries()) {
    let n40 = V4 + e29 * L5.size;
    G4.setUint32(n40 + L5.id, t32.id, true), G4.setUint32(n40 + L5.generation, t32.generation, true), G4.setUint16(n40 + L5.kind, t32.kind, true), G4.setUint32(n40 + L5.reference, t32.reference, true);
  }
  for (let e29 = 0; e29 < N9.length; e29 += 1) G4.setUint32(H4 + e29 * 4, N9[e29], true);
  for (let [e29, t32] of P8.entries()) {
    let n40 = j9[e29][0];
    G4.setUint8(F8[`${n40}FieldCount`], t32.fieldCount), G4.setUint32(F8[`${n40}Offset`], U4[e29], true);
    for (let n41 = 0; n41 < t32.fieldCount; n41 += 1) {
      let r35 = U4[e29] + n41 * t32.rows * 4;
      for (let e30 = 0; e30 < t32.rows; e30 += 1) {
        let i37 = t32.values[n41 * t32.rows + e30];
        t32.float ? G4.setFloat32(r35 + e30 * 4, i37, true) : G4.setUint32(r35 + e30 * 4, i37, true);
      }
    }
  }
  return W4;
}
function d13(e29) {
  if (!Array.isArray(e29)) throw TypeError(`font binding strikes must be an array`);
  if (e29.length === 0 || e29.length > a26) throw RangeError(`font binding strikes must contain between 1 and ${a26} entries`);
  let t31 = e29.map((e30, t32) => b11(e30, `font binding strikes[${t32}] ppem`));
  if (t31[0] === 0 && t31.length !== 1) throw RangeError(`font binding strikes may only start at ppem 0 as the sole scalable strike`);
  for (let e30 = 1; e30 < t31.length; e30 += 1) if (t31[e30 - 1] >= t31[e30]) throw RangeError(`font binding strikes[${e30}] ppem ${t31[e30]} must strictly increase`);
  return t31;
}
function f17(e29) {
  if (!Array.isArray(e29)) throw TypeError(`font binding resources must be an array`);
  if (e29.length === 0 || e29.length > a26) throw RangeError(`font binding resources must contain between 1 and ${a26} entries`);
  let t31 = e29.map((e30, t32) => {
    if (!c23(e30)) throw TypeError(`font binding resources[${t32}] must be an object`);
    let n39 = b11(e30.id, `font binding resources[${t32}].id`), r34 = b11(e30.generation, `font binding resources[${t32}].generation`), i36 = x11(e30.kind, `font binding resources[${t32}].kind`), a34 = b11(e30.reference, `font binding resources[${t32}].reference`);
    if (n39 === 0) throw RangeError(`font binding resources[${t32}].id must not be the reserved zero identity`);
    if (r34 === 0) throw RangeError(`font binding resources[${t32}].generation must not be the reserved zero generation`);
    if (i36 < 1 || i36 > 32) throw RangeError(`font binding resources[${t32}].kind ${i36} must be between 1 and 32`);
    return { id: n39, generation: r34, kind: i36, reference: a34 };
  });
  for (let e30 = 1; e30 < t31.length; e30 += 1) if (t31[e30 - 1].id >= t31[e30].id) throw RangeError(`font binding resources[${e30}].id ${t31[e30].id} must strictly increase`);
  return t31;
}
function p17(e29, t31, n39) {
  if (!c23(t31)) throw TypeError(`font binding ${e29} must be a field table`);
  let r34 = t31.rows;
  if (!Number.isSafeInteger(r34) || r34 < 0) throw RangeError(`font binding ${e29} rows must be a u32`);
  if (r34 !== n39) throw RangeError(`font binding ${e29} declares ${r34} rows but this binding needs ${n39}`);
  let i36 = t31.fields;
  if (!Array.isArray(i36)) throw TypeError(`font binding ${e29} fields must be an array`);
  if (i36.length > 32) throw RangeError(`${e29} has more than 32 fields`);
  let a34 = t31.names;
  if (a34 !== void 0 && (!Array.isArray(a34) || a34.length !== i36.length || a34.some((e30) => typeof e30 != `string`))) throw TypeError(`font binding ${e29} names must match its fields`);
  let o34 = i36.map((t32, n40) => {
    if (typeof t32 != `function`) throw TypeError(`font binding ${h15(e29, a34, n40)} must be a function`);
    return t32;
  });
  return y13(y13(n39, o34.length, `font binding ${e29} values`), 4, `font binding ${e29} bytes`), { rows: n39, fieldCount: o34.length, float: e29.endsWith(`F32`), readers: o34, ...a34 === void 0 ? {} : { names: a34 } };
}
function m16(e29, t31) {
  let n39 = t31.float ? new Float32Array(t31.rows * t31.fieldCount) : new Uint32Array(t31.rows * t31.fieldCount);
  for (let r34 = 0; r34 < t31.readers.length; r34 += 1) {
    let i36 = t31.readers[r34], a34 = r34 * t31.rows;
    for (let o34 = 0; o34 < t31.rows; o34 += 1) {
      let s33 = i36(o34), c30 = `${h15(e29, t31.names, r34)} row ${o34}`;
      if (t31.float) {
        if (!Number.isFinite(s33)) throw TypeError(`font binding ${c30} produced a nonfinite value`);
        let e30 = Math.fround(s33);
        if (!Number.isFinite(e30)) throw TypeError(`font binding ${c30} produced ${s33}, which is not a finite f32`);
        n39[a34 + o34] = e30;
      } else n39[a34 + o34] = b11(s33, `font binding ${c30}`);
    }
  }
  return { rows: t31.rows, fieldCount: t31.fieldCount, float: t31.float, values: n39 };
}
function h15(e29, t31, n39) {
  let r34 = t31?.[n39];
  return r34 === void 0 ? `${e29} field ${n39}` : `${e29}.${r34}`;
}
function g14(e29) {
  return { rows: e29, fields: [] };
}
function _12(e29, t31) {
  return Math.ceil(e29 / t31) * t31;
}
function v14(e29, t31, n39) {
  let r34 = e29 + t31;
  if (!Number.isSafeInteger(r34) || r34 > i26) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function y13(e29, t31, n39) {
  let r34 = e29 * t31;
  if (!Number.isSafeInteger(r34) || r34 > i26) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function b11(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 < 0 || e29 > i26) throw RangeError(`${t31} must be a u32`);
  return e29;
}
function x11(e29, t31) {
  if (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 < 0 || e29 > a26) throw RangeError(`${t31} must be a u16`);
  return e29;
}

// node_modules/@pmndrs/glyph/dist/config/raster-host.js
function u19(c30, u28) {
  if (!u7(c30)) throw TypeError(`raster codec assembly needs a registered RasterCodec`);
  if (!p18(u28)) throw TypeError(`raster codec assembly options need an object`);
  if (`identityRegistry` in u28) throw TypeError(`raster codec identityRegistry was renamed to ids`);
  if (typeof u28.namespace != `string` || u28.namespace.length === 0) throw TypeError(`raster codec namespace must be a nonempty string`);
  if (u28.programName !== void 0 && (typeof u28.programName != `string` || u28.programName.length === 0)) throw TypeError(`raster codec programName must be a nonempty string`);
  if (u28.transformMode !== `direct` && u28.transformMode !== `indexed`) throw TypeError(`raster codec transform mode must be "direct" or "indexed"`);
  u28.ids !== void 0 && a4(u28.ids, `raster codec ids`);
  let m24 = i8(c30.schema.buffers, u28.system), h24 = m24.placementSlot;
  if (h24 === void 0) throw TypeError(`raster codec system needs a host-owned placementSlot buffer`);
  let g23 = Object.freeze({ ...m24, placementSlot: h24 }), _20 = f18(c30.schema, u28.placementSlotTarget), v22 = m2(u28.capabilitySet, `raster codec capability set`), y22 = u28.ids ?? new r4(), b20 = y22.technique(c30.raster), x19 = y22.program(c30.raster, u28.namespace, u28.programName), S17 = c30.codecBody(v22);
  o9(S17, c30.schema);
  let C17 = a8(S17, c30.schema, g23, _20);
  return o9(C17, c30.schema, g23, _20), Object.freeze({ ...u2(b20, x19, C17, [...h4(c30.schema), ...d14(g23, _20)], u28.transformMode), capabilitySet: v22, variant: c30.programVariant ?? 0 });
}
function d14(e29, t31) {
  return [{ id: e29.stableGlyphId.id, scalar: `u32`, vectorWidth: 1 }, ...t31 === void 0 ? [{ id: e29.placementSlot.id, scalar: `u32`, vectorWidth: 1 }] : [], ...e29.transformIndex === void 0 ? [] : [{ id: e29.transformIndex.id, scalar: `u32`, vectorWidth: 1 }]];
}
function f18(e29, t31) {
  if (t31 === void 0) return;
  if (!p18(t31) || !Number.isSafeInteger(t31.buffer) || !Number.isSafeInteger(t31.lane)) throw TypeError(`placementSlotTarget needs an existing u32 technique buffer and lane`);
  let n39 = Object.values(e29.buffers).find((e30) => e30.id === t31.buffer);
  if (n39?.scalar !== `u32` || t31.lane < 0 || t31.lane >= n39.lanes.length || !n39.lanes[t31.lane]?.startsWith(`unused`)) throw TypeError(`placementSlotTarget needs an unused lane in an existing u32 technique buffer`);
  return Object.freeze({ buffer: n39.id, lane: t31.lane });
}
function p18(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/config/raster.js
function g15(e29, t31) {
  if (P5(t31) && `placementSlotTarget` in t31) throw TypeError(`placementSlotTarget is package-private renderer packing`);
  return u19(e29, t31);
}
var _13 = /* @__PURE__ */ new WeakSet();
var v15 = /* @__PURE__ */ new WeakMap();
var y14 = 4294967295;
function S10(e29, r34 = new r4()) {
  a4(r34, `raster font compiler ids`), o12(D8);
  let s33 = v(e29);
  return b(e29, { cacheKey: y(e29), glyphCount: s33.font.glyphCount, identities: r34 });
}
function D8(e29, t31, n39) {
  let { cacheKey: r34, glyphCount: i36, identities: a34 } = t31, o34 = e29.raster, s33 = v15.get(r34);
  if (s33 !== void 0) {
    a34.technique(e29.raster);
    for (let e30 of s33.resources.keys()) a34.resource(e30);
    return s33;
  }
  let c30, l29 = false, u28 = /* @__PURE__ */ new Map(), d24 = /* @__PURE__ */ new Map(), f26 = true, p28 = false, m24, h24 = () => {
    if (!f26) throw Error(`raster codec font compiler is no longer active`);
    if (p28) throw Error(`raster codec font compiler already rejected an input`, { cause: m24 });
  }, g23 = Object.freeze({ get font() {
    return h24(), Object.freeze({ get raster() {
      return h24(), o34;
    }, get glyphCount() {
      return h24(), i36;
    }, get data() {
      return h24(), n39;
    } });
  }, compile(t32) {
    h24();
    try {
      if (l29) throw Error(`raster codec font compiler already attempted a binding`);
      l29 = true;
      let n40 = O7(e29, i36, a34, u28, d24, t32);
      return c30 = n40, _13.add(n40), n40;
    } catch (e30) {
      throw p28 = true, m24 = e30, e30;
    }
  }, retain(t32, n40, r35) {
    h24();
    try {
      if (l29) throw Error(`raster codec font retained a resource after compile started`);
      if (typeof t32 != `string` || t32.length === 0) throw TypeError(`raster codec font retained a resource without a declared name`);
      if (typeof n40 != `string` || n40.length === 0) throw TypeError(`raster codec font retained resource "${t32}" without a nonempty key`);
      let i37 = Object.hasOwn(e29.schema.resources, t32) ? e29.schema.resources[t32] : void 0;
      if (i37 === void 0) throw TypeError(`raster codec font retained "${n40}" under undeclared resource name "${t32}"`);
      let a35 = d24.get(t32) ?? [];
      if (i37.cardinality !== `many` && a35.length !== 0) throw TypeError(`raster codec font retained declared resource "${t32}" more than once`);
      if (u28.has(n40)) throw TypeError(`raster codec font retained duplicate resource "${n40}"`);
      let o35 = k7(i37, t32, r35);
      a35.push(n40), d24.set(t32, a35), u28.set(n40, o35);
    } catch (e30) {
      throw p28 = true, m24 = e30, e30;
    }
  } }), y22;
  try {
    y22 = e29.compileFont(g23);
  } finally {
    f26 = false;
  }
  if (p28) throw m24;
  if (N5(y22)) throw TypeError(`raster codec compileFont must return synchronously`);
  if (c30 === void 0 || y22 !== c30 || !_13.has(c30)) throw Error(`raster codec compileFont must return the result of compiler.compile`);
  return v15.set(r34, c30), c30;
}
function O7(e29, t31, n39, r34, i36, a34) {
  if (!P5(a34)) throw TypeError(`raster codec font binding needs an object`);
  let o34 = /* @__PURE__ */ new Set([`strikes`, `resource`, ...e29.schema.binding.f32 === void 0 ? [] : [`f32`], ...e29.schema.binding.u32 === void 0 ? [] : [`u32`]]);
  for (let e30 of Object.keys(a34)) if (!o34.has(e30)) throw TypeError(`raster codec font binding declares unknown field "${e30}"`);
  let s33 = j5(a34.strikes), c30 = a34.resource;
  if (typeof c30 != `function`) throw TypeError(`raster codec font binding needs a resource reader`);
  for (let t32 of Object.keys(e29.schema.resources ?? {})) if ((i36.get(t32)?.length ?? 0) === 0) throw Error(`raster codec font did not retain declared resource "${t32}"`);
  let l29 = e29.schema.render.resource;
  if (l29 === void 0) throw Error(`registered RasterCodec omitted its render resource`);
  let u28 = new Set(i36.get(l29)), { resources: h24, indexFor: g23 } = l19([...r34.keys()], n39), _20 = t31, v22 = M5(t31, s33.length, `raster codec strike rows`), b20 = h24.length, x19 = e29.schema.scope === `glyph` ? _20 : e29.schema.scope === `strike` ? v22 : b20, S17 = e29.schema.binding.f32 ?? [], C17 = e29.schema.binding.u32 ?? [], w15 = o26(S17, x19, A6(a34.f32, S17, `f32`)), T13 = o26(C17, x19, A6(a34.u32, C17, `u32`)), E13 = g14(_20), D12 = g14(v22), O11 = g14(b20), k11 = u18({ techniqueId: n39.technique(e29.raster), programVariant: e29.programVariant ?? 0, glyphCount: t31, strikes: s33, resources: h24, resourceIndex(e30) {
    let n40 = e30 % t31, r35 = Math.floor(e30 / t31), i37 = c30(n40, r35);
    if (i37 === void 0) return y14;
    if (!u28.has(i37)) throw TypeError(`raster codec font binding selected resource "${i37}" outside render role "${l29}"`);
    return g23(i37);
  }, glyphF32: e29.schema.scope === `glyph` ? w15 : E13, glyphU32: e29.schema.scope === `glyph` ? T13 : E13, strikeF32: e29.schema.scope === `strike` ? w15 : D12, strikeU32: e29.schema.scope === `strike` ? T13 : D12, resourceF32: e29.schema.scope === `resource` ? w15 : O11, resourceU32: e29.schema.scope === `resource` ? T13 : O11 });
  return Object.freeze({ binding: k11, resources: F5(r34), declaredResources: F5(new Map([...i36].map(([e30, t32]) => [e30, Object.freeze([...t32])]))) });
}
function k7(e29, t31, n39) {
  return e29.kind === `group` ? s5(`group`, t31, n39, void 0, void 0, e29.members) : s5(e29.kind, t31, n39, e29.kind === `texture` || e29.kind === `texture-array` ? e29.format : void 0, e29.kind === `geometry` ? e29.attributes : void 0);
}
function A6(e29, t31, n39) {
  if (!P5(e29)) {
    if (t31.length === 0) return {};
    throw TypeError(`raster codec font binding needs ${n39} readers`);
  }
  for (let r35 of Object.keys(e29)) if (!t31.includes(r35)) throw TypeError(`raster codec font binding declares unknown ${n39} reader "${r35}"`);
  let r34 = /* @__PURE__ */ Object.create(null);
  for (let i36 of t31) {
    let t32 = e29[i36];
    if (typeof t32 != `function`) throw TypeError(`raster codec font binding needs ${n39} reader "${i36}"`);
    r34[i36] = t32;
  }
  return r34;
}
function j5(e29) {
  if (!Array.isArray(e29) || e29.length === 0) throw TypeError(`raster codec font binding needs at least one strike`);
  let t31 = (e30, t32) => {
    if (typeof e30 != `number` || !Number.isSafeInteger(e30) || e30 < 0 || e30 > 4294967295) throw RangeError(`raster codec font binding strike ${t32} needs a u32 ppem`);
    return e30;
  }, n39 = [t31(e29[0], 0), ...e29.slice(1).map(t31)];
  return Object.freeze(n39);
}
function M5(e29, t31, n39) {
  let r34 = e29 * t31;
  if (!Number.isSafeInteger(r34) || r34 > 4294967295) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function N5(e29) {
  return P5(e29) && typeof e29.then == `function`;
}
function P5(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function F5(e29) {
  let t31;
  return t31 = Object.freeze({ get: e29.get.bind(e29), has: e29.has.bind(e29), get size() {
    return e29.size;
  }, entries: e29.entries.bind(e29), keys: e29.keys.bind(e29), values: e29.values.bind(e29), forEach(n39, r34) {
    e29.forEach((e30, i36) => n39.call(r34, e30, i36, t31));
  }, [Symbol.iterator]: e29[Symbol.iterator].bind(e29) }), t31;
}

// node_modules/@pmndrs/glyph/dist/internal/render-planner.js
init_glyph_error();

// node_modules/@pmndrs/glyph/dist/engine-encoding.js
function e21(e29, t31) {
  let n39 = e29?.columns;
  if (n39 === void 0) return { count: 1, gap: 0 };
  let r34 = n39.gap ?? 0;
  if (!Number.isSafeInteger(n39.count) || n39.count < 1 || n39.count > 16) throw RangeError(`layout columns count must be an integer between 1 and 16`);
  if (!Number.isFinite(r34) || r34 < 0) throw RangeError(`layout columns gap must be a nonnegative finite number`);
  if (n39.count > 1 && t31?.width?.mode !== `exact`) throw TypeError(`layout columns require an exact width constraint to derive the column measure`);
  if (n39.count > 1 && t31?.height === void 0) throw TypeError(`layout columns require a bounded height constraint to fill columns in order`);
  return { count: n39.count, gap: r34 };
}
function t19(t31, n39, i36, a34, o34, s33, c30) {
  let l29 = r26(s33?.width), u28 = r26(s33?.height), d24 = e21(o34, s33), f26 = l29.mode === `unconstrained` ? 16777216 : l29.size, p28 = u28.mode === `unconstrained` ? 16777216 : u28.size, m24 = o34?.maxLines ?? 0, h24 = o34?.dropCap, g23 = (() => {
    if (h24 === void 0) return;
    let { contour: e29, ...t32 } = h24;
    return { ...t32, ...e29 === void 0 ? {} : { contour: e29.map(([e30, t33]) => ({ inline: e30, block: t33 })) } };
  })(), _20 = (f26 - d24.gap * (d24.count - 1)) / d24.count;
  if (d24.count > 1 && _20 <= 0) throw RangeError(`layout columns and gap leave no positive column measure`);
  return { constraint: { paragraphId: n39, flowThreadId: t31.flowThread(`paragraph/${n39}`), geometryRevision: a34, width: l29.size, height: u28.size, viewportBlockStart: 0, viewportBlockEnd: p28, resumeBlockOffset: 0, maxLines: m24, regionStart: c30, resumeCluster: 0, regionCount: d24.count, resumeRegion: 0, widthMode: l29.mode, heightMode: u28.mode, wrap: o34?.wrap ?? `word`, align: o34?.align ?? `start`, overflow: o34?.overflow ?? `visible`, blockAlign: `start`, ...o34?.firstLineIndent === void 0 ? {} : { firstLineIndent: o34.firstLineIndent }, ...o34?.spaceBefore === void 0 ? {} : { spaceBefore: o34.spaceBefore }, ...o34?.spaceAfter === void 0 ? {} : { spaceAfter: o34.spaceAfter }, ...o34?.justify === void 0 ? {} : { justify: o34.justify }, ...o34?.lastLine === void 0 ? {} : { lastLine: o34.lastLine }, ...g23 === void 0 ? {} : { dropCap: g23 } }, regions: Array.from({ length: d24.count }, (e29, r34) => {
    let o35 = r34 * (_20 + d24.gap), s34 = r34 === d24.count - 1 ? f26 : o35 + _20;
    return { id: t31.region(`paragraph/${n39}/column/${r34}`), geometryRevision: a34, transformIndex: i36, shape: `rectangle`, exclusionStart: 0, exclusionCount: 0, writingMode: `horizontal-tb`, textOrientation: `mixed`, inlineStart: o35, blockStart: 0, inlineEnd: s34, blockEnd: p28, clipInlineStart: o35, clipBlockStart: 0, clipInlineEnd: s34, clipBlockEnd: p28 };
  }) };
}
function n28(e29, t31, n39) {
  if (!Number.isSafeInteger(n39) || n39 < 1) throw RangeError(`style index must be a positive integer`);
  return e29.style(`paragraph/${t31}/style/${n39}`);
}
function r26(e29) {
  return e29 === void 0 || e29.mode === `unconstrained` ? { mode: `unconstrained`, size: 0 } : { mode: e29.mode, size: e29.size };
}
function a27(e29, t31, n39, r34) {
  return { ...r34, ...e29.fontSize === void 0 ? {} : { fontSize: e29.fontSize }, ...e29.lineHeight === void 0 ? {} : { lineHeight: e29.lineHeight }, ...e29.letterSpacing === void 0 ? {} : { letterSpacing: e29.letterSpacing }, ...e29.wordSpacing === void 0 ? {} : { wordSpacing: e29.wordSpacing }, ...e29.language === void 0 ? {} : { language: e29.language }, ...e29.direction === void 0 ? {} : { direction: e29.direction }, ...e29.features === void 0 ? {} : { features: e29.features.map((e30) => ({ tag: e30.tag, value: e30.value ?? 1, start: e30.start ?? t31, end: e30.end ?? n39 })) }, ...e29.color === void 0 ? {} : { foregroundRgba: u20(e29.color) }, ...e29.opacity === void 0 ? {} : { opacity: e29.opacity }, ...e29.outline === void 0 ? {} : { outline: { rgba: u20(e29.outline.color), width: e29.outline.width } }, ...e29.shadow === void 0 ? {} : { shadow: { rgba: u20(e29.shadow.color), offsetX: e29.shadow.offset[0], offsetY: e29.shadow.offset[1] } }, ...e29.decoration === void 0 ? {} : { decoration: s26(e29.decoration, e29) } };
}
function o27(e29, t31, n39) {
  for (let r34 of t31) {
    if (e29.outline !== void 0 && !r34.textEffects.includes(`outline`)) throw TypeError(`raster format ${r34.id} does not support outline in ${n39}`);
    if (e29.shadow !== void 0 && !r34.textEffects.includes(`shadow`)) throw TypeError(`raster format ${r34.id} does not support shadow in ${n39}`);
  }
}
function s26(e29, t31) {
  if (e29.style !== void 0 && e29.style !== `solid`) throw TypeError(`'${e29.style}' decoration lines are not implemented yet; only 'solid' is supported`);
  return { style: e29.style ?? `solid`, rgba: l20(e29.color === void 0 ? t31 : { color: e29.color }), ...e29.underline === void 0 ? {} : { underline: e29.underline }, ...e29.overline === void 0 ? {} : { overline: e29.overline }, ...e29.lineThrough === void 0 ? {} : { lineThrough: e29.lineThrough }, thickness: e29.thickness ?? 0, offset: e29.offset ?? 0 };
}
function l20(e29) {
  let t31 = e29.opacity ?? 1;
  if (!Number.isFinite(t31) || t31 < 0 || t31 > 1) throw RangeError(`opacity must be in [0, 1]`);
  let n39 = d15(e29.color ?? `#ffffff`), r34 = Math.round(n39[3] * t31);
  return (n39[0] | n39[1] << 8 | n39[2] << 16 | r34 << 24) >>> 0;
}
function u20(e29) {
  let t31 = d15(e29);
  return (t31[0] | t31[1] << 8 | t31[2] << 16 | t31[3] << 24) >>> 0;
}
function d15(e29) {
  return typeof e29 == `string` ? f19(e29) : p19(e29);
}
function f19(e29) {
  let t31 = /^#([0-9a-f]{6}|[0-9a-f]{8})$/iu.exec(e29);
  if (t31 === null) throw TypeError(`colors must be #rrggbb, #rrggbbaa, or linear RGBA`);
  let n39 = t31[1];
  return [Number.parseInt(n39.slice(0, 2), 16), Number.parseInt(n39.slice(2, 4), 16), Number.parseInt(n39.slice(4, 6), 16), n39.length === 8 ? Number.parseInt(n39.slice(6), 16) : 255];
}
function p19(e29) {
  if (e29.length !== 4 || e29.some((e30) => !Number.isFinite(e30) || e30 < 0 || e30 > 1)) throw TypeError(`linear RGBA colors must contain four finite channels in [0, 1]`);
  let t31 = (e30) => {
    let t32 = e30 <= 31308e-7 ? e30 * 12.92 : 1.055 * e30 ** (1 / 2.4) - 0.055;
    return Math.round(t32 * 255);
  };
  return [t31(e29[0]), t31(e29[1]), t31(e29[2]), Math.round(e29[3] * 255)];
}
function h16(e29, t31) {
  if (e29 === t31) return;
  let n39 = Math.min(e29.length, t31.length), r34 = 0;
  for (; r34 < n39; ) {
    let n40 = e29.codePointAt(r34);
    if (n40 !== t31.codePointAt(r34)) break;
    r34 += n40 > 65535 ? 2 : 1;
  }
  let i36 = e29.length, a34 = t31.length;
  for (; i36 > r34 && a34 > r34; ) {
    let n40 = g16(e29, i36), r35 = g16(t31, a34);
    if (e29.codePointAt(n40) !== t31.codePointAt(r35)) break;
    i36 = n40, a34 = r35;
  }
  return { start: r34, deleteCount: i36 - r34, insert: t31.slice(r34, a34) };
}
function g16(e29, t31) {
  let n39 = t31 - 1, r34 = e29.charCodeAt(n39), i36 = e29.charCodeAt(n39 - 1);
  return r34 >= 56320 && r34 <= 57343 && n39 > 0 && i36 >= 55296 && i36 <= 56319 ? n39 - 1 : n39;
}

// node_modules/@pmndrs/glyph/dist/internal/codec-capability-selection.js
var e22 = /* @__PURE__ */ new WeakMap();
function t20(t31, n39, r34) {
  let i36 = n39.capabilitySets.indexOf(r34);
  if (i36 < 0) throw TypeError(`selected capability set does not belong to the installed Codec`);
  let a34 = Object.freeze({});
  return e22.set(a34, Object.freeze({ id: i36 + 1, codecHandle: t31 })), a34;
}
function n29(t31, n39) {
  let r34 = e22.get(t31);
  if (r34 === void 0) throw TypeError(`capability set selection is not package-owned`);
  if (r34.codecHandle !== n39) throw TypeError(`capability set selection belongs to another Codec`);
  return r34.id;
}

// node_modules/@pmndrs/glyph/dist/internal/frame-wire.js
var n30 = 4294967295;
var i27 = new TextEncoder();
function a28(t31) {
  let n39 = e5, r34 = n39.layouts.engineUpdateRequest, a34 = t31.paragraphMutations ?? [], d24 = t31.paragraphOrderMutations ?? [], f26 = t31.textMutations ?? [], g23 = t31.styleMutations ?? [], _20 = t31.constraints ?? [], y22 = t31.regions ?? [], b20 = t31.exclusions ?? [], x19 = t31.inlineObjects ?? [], S17 = r34.size, C17 = (e29, t32, n40, r35) => {
    if (e29 === 0) return 0;
    let i36 = I4(S17, n40);
    return S17 = R3(i36, L3(e29, t32, r35), r35), i36;
  }, w15 = C17(a34.length, n39.layouts.engineParagraphMutation.size, n39.layouts.engineParagraphMutation.alignment, `paragraph mutations`), T13 = C17(d24.length, n39.layouts.engineParagraphOrderMutation.size, n39.layouts.engineParagraphOrderMutation.alignment, `paragraph order mutations`), E13 = C17(f26.length, n39.layouts.engineTextMutation.size, 4, `text mutations`), D12 = C17(g23.length, n39.layouts.engineStyleMutation.size, 4, `style mutations`), O11 = C17(_20.length, n39.layouts.engineConstraint.size, 4, `constraints`), k11 = C17(y22.length, n39.layouts.engineRegion.size, 4, `regions`), A10 = C17(b20.length, n39.layouts.engineExclusion.size, 4, `exclusions`), j9 = C17(x19.length, n39.layouts.engineInlineObject.size, 4, `inline objects`), M9 = f26.map((e29) => C17(e29.insert.length, 2, 2, `text mutation payload`)), N9 = g23.map((e29) => e29.opcode === `upsert` && e29.value.language !== void 0 ? i27.encode(e29.value.language) : new Uint8Array()), P8 = [], F8 = [];
  for (let [e29, t32] of g23.entries()) P8.push(C17(N9[e29].length, 1, 1, `style language`)), F8.push(C17(t32.opcode === `upsert` ? t32.value.features?.length ?? 0 : 0, n39.layouts.feature.size, n39.layouts.feature.alignment, `style features`));
  let z4 = y22.map((e29) => C17(e29.vertices?.length ?? 0, n39.layouts.engineFlowVertex.size, 4, `region vertices`)), B4 = b20.map((e29) => C17(e29.vertices?.length ?? 0, n39.layouts.engineFlowVertex.size, 4, `exclusion vertices`)), V4 = _20.map((e29) => C17(e29.dropCap?.contour?.length ?? 0, n39.layouts.engineFlowVertex.size, 4, `drop cap vertices`)), H4 = new Uint8Array(S17), U4 = new DataView(H4.buffer);
  return o28(U4, t31, H4.length, { textOffset: E13, paragraphOffset: w15, paragraphOrderOffset: T13, styleOffset: D12, constraintOffset: O11, regionOffset: k11, exclusionOffset: A10, inlineObjectOffset: j9 }), s27(U4, w15, a34), c24(U4, T13, d24), l21(U4, E13, f26, M9), u21(U4, H4, D12, g23, N9, P8, F8), p20(U4, O11, _20, V4), m17(U4, k11, y22, z4), h17(U4, A10, b20, B4), v16(U4, j9, x19), H4;
}
function o28(n39, r34, i36, a34) {
  let o34 = e5.layouts.engineUpdateRequest, s33 = r34.limits;
  n39.setUint32(o34.flags, r34.compositingIndependent === true ? e5.engine.frameFlags.compositingIndependent : 0, true);
  for (let [c30, l29] of [[`abiVersion`, e5.version], [`byteLength`, i36], [`rootId`, r34.rootId], [`expectedEngineRevision`, r34.expectedEngineRevision], [`consumedRevision`, r34.consumedRevision], [`acknowledgedPublicationGeneration`, r34.acknowledgedPublicationGeneration], [`codecHandle`, r34.codecHandle], [`capabilitySet`, r34.capabilitySet === void 0 ? 1 : n29(r34.capabilitySet, r34.codecHandle)], [`semanticViewMask`, r34.semanticViewMask ?? 0], [`maxParagraphs`, s33.maxParagraphs], [`maxClusters`, s33.maxClusters], [`maxLines`, s33.maxLines], [`maxRegions`, s33.maxRegions], [`maxExclusions`, s33.maxExclusions], [`maxInlineObjects`, s33.maxInlineObjects], [`maxSlotsPerBand`, s33.maxSlotsPerBand], [`maxOutputBytes`, s33.maxOutputBytes], [`paragraphMutationsOffset`, a34.paragraphOffset], [`paragraphMutationCount`, r34.paragraphMutations?.length ?? 0], [`paragraphOrderMutationsOffset`, a34.paragraphOrderOffset], [`paragraphOrderMutationCount`, r34.paragraphOrderMutations?.length ?? 0], [`textMutationsOffset`, a34.textOffset], [`textMutationCount`, r34.textMutations?.length ?? 0], [`styleMutationsOffset`, a34.styleOffset], [`styleMutationCount`, r34.styleMutations?.length ?? 0], [`constraintsOffset`, a34.constraintOffset], [`constraintCount`, r34.constraints?.length ?? 0], [`regionsOffset`, a34.regionOffset], [`regionCount`, r34.regions?.length ?? 0], [`exclusionsOffset`, a34.exclusionOffset], [`exclusionCount`, r34.exclusions?.length ?? 0], [`inlineObjectsOffset`, a34.inlineObjectOffset], [`inlineObjectCount`, r34.inlineObjects?.length ?? 0], [`codecParametersOffset`, 0], [`codecParametersLength`, 0]]) n39.setUint32(o34[c30], F6(l29, c30), true);
}
function s27(t31, n39, r34) {
  let i36 = e5.layouts.engineParagraphMutation, a34 = e5.engine.paragraphMutationOpcodes;
  for (let [e29, o34] of r34.entries()) {
    let r35 = n39 + e29 * i36.size;
    t31.setUint8(r35 + i36.opcode, A7(a34, o34.opcode, `paragraph mutation opcode`)), t31.setUint32(r35 + i36.paragraphId, F6(o34.paragraphId, `paragraph ID`), true), o34.opcode === `upsert` && t31.setUint32(r35 + i36.order, F6(o34.order, `paragraph order`), true);
  }
}
function c24(t31, n39, r34) {
  let i36 = e5.layouts.engineParagraphOrderMutation;
  for (let [e29, a34] of r34.entries()) {
    let r35 = n39 + e29 * i36.size;
    if (t31.setUint32(r35 + i36.paragraphId, F6(a34.paragraphId, `paragraph ID`), true), t31.setUint32(r35 + i36.orderScope, F6(a34.orderScope, `paragraph order scope`), true), !Number.isFinite(a34.orderRank)) throw RangeError(`paragraph order rank must be finite`);
    t31.setFloat64(r35 + i36.orderRank, a34.orderRank, true);
  }
}
function l21(t31, n39, r34, i36) {
  let a34 = e5.layouts.engineTextMutation;
  for (let [o34, s33] of r34.entries()) {
    let r35 = n39 + o34 * a34.size, c30 = i36[o34];
    t31.setUint8(r35 + a34.opcode, e5.engine.textMutationOpcodes.replaceUtf16), t31.setUint8(r35 + a34.encoding, e5.engine.textEncodings.utf16Le), t31.setUint32(r35 + a34.paragraphId, F6(s33.paragraphId, `paragraph ID`), true), t31.setUint32(r35 + a34.textStart, F6(s33.start, `text mutation start`), true), t31.setUint32(r35 + a34.deleteCount, F6(s33.deleteCount, `text mutation delete count`), true), t31.setUint32(r35 + a34.insertOffset, c30, true), t31.setUint32(r35 + a34.insertCount, F6(s33.insert.length, `text mutation insert count`), true);
    for (let e29 = 0; e29 < s33.insert.length; e29 += 1) t31.setUint16(c30 + e29 * 2, s33.insert.charCodeAt(e29), true);
  }
}
function u21(t31, n39, r34, i36, a34, o34, s33) {
  let c30 = e5.layouts.engineStyleMutation;
  for (let [l29, u28] of i36.entries()) {
    let i37 = r34 + l29 * c30.size;
    if (t31.setUint32(i37 + c30.paragraphId, u28.paragraphId, true), t31.setUint32(i37 + c30.styleId, u28.styleId, true), u28.opcode === `remove`) {
      t31.setUint8(i37 + c30.opcode, e5.engine.styleMutationOpcodes.remove);
      continue;
    }
    let p28 = u28.value, m24 = e5.engine.styleFields, h24 = y15(p28.fontStackHandle, m24.fontStack) | y15(p28.materialId, m24.material) | y15(p28.language, m24.language) | y15(p28.features, m24.features) | y15(p28.fontSize, m24.fontSize) | y15(p28.lineHeight, m24.lineHeight) | y15(p28.letterSpacing, m24.letterSpacing) | y15(p28.wordSpacing, m24.wordSpacing) | y15(p28.baselineShift, m24.baselineShift) | y15(p28.rasterPixelRatio, m24.rasterPixelRatio) | y15(p28.direction, m24.direction) | y15(p28.foregroundRgba, m24.foreground) | y15(p28.opacity, m24.opacity) | y15(p28.outline, m24.outline) | y15(p28.shadow, m24.shadow) | y15(p28.decoration, m24.decoration);
    t31.setUint8(i37 + c30.opcode, e5.engine.styleMutationOpcodes.upsert), t31.setUint8(i37 + c30.direction, S11(p28.direction)), t31.setUint8(i37 + c30.flags, u28.root === true ? e5.engine.styleFlags.root : 0), t31.setUint32(i37 + c30.cascadeOrder, u28.cascadeOrder, true), t31.setUint32(i37 + c30.fieldMask, h24, true), t31.setUint32(i37 + c30.textStart, u28.start, true), t31.setUint32(i37 + c30.textEnd, u28.end, true), b12(t31, i37 + c30.fontStackHandle, p28.fontStackHandle), b12(t31, i37 + c30.materialId, p28.materialId);
    let g23 = a34[l29];
    t31.setUint32(i37 + c30.languageOffset, o34[l29], true), t31.setUint16(i37 + c30.languageLength, P6(g23.length, `language byte length`), true), n39.set(g23, o34[l29]);
    let _20 = p28.features ?? [], v22 = s33[l29];
    t31.setUint16(i37 + c30.featureCount, P6(_20.length, `feature count`), true), t31.setUint32(i37 + c30.featuresOffset, v22, true), d16(t31, v22, _20), x12(t31, i37 + c30.fontSize, p28.fontSize), x12(t31, i37 + c30.lineHeight, p28.lineHeight), x12(t31, i37 + c30.letterSpacing, p28.letterSpacing), x12(t31, i37 + c30.wordSpacing, p28.wordSpacing), x12(t31, i37 + c30.baselineShift, p28.baselineShift), x12(t31, i37 + c30.rasterPixelRatio, p28.rasterPixelRatio), b12(t31, i37 + c30.foregroundRgba, p28.foregroundRgba), x12(t31, i37 + c30.opacity, p28.opacity), b12(t31, i37 + c30.outlineRgba, p28.outline?.rgba), x12(t31, i37 + c30.outlineWidth, p28.outline?.width), b12(t31, i37 + c30.shadowRgba, p28.shadow?.rgba), x12(t31, i37 + c30.shadowOffsetX, p28.shadow?.offsetX), x12(t31, i37 + c30.shadowOffsetY, p28.shadow?.offsetY), f20(t31, i37, p28.decoration);
  }
}
function d16(t31, n39, r34) {
  let i36 = e5.layouts.feature;
  for (let [e29, a34] of r34.entries()) {
    let r35 = n39 + e29 * i36.size;
    t31.setUint32(r35 + i36.tag, j6(a34.tag), true), t31.setUint32(r35 + i36.value, a34.value, true), t31.setUint32(r35 + i36.start, a34.start, true), t31.setUint32(r35 + i36.end, a34.end, true);
  }
}
function f20(t31, n39, r34) {
  if (r34 === void 0) return;
  let i36 = e5.layouts.engineStyleMutation, a34 = e5.engine.decorationStyles, o34 = e5.engine.decorationFlags;
  t31.setUint8(n39 + i36.decorationStyle, a34[r34.style]), t31.setUint32(n39 + i36.decorationRgba, r34.rgba, true), t31.setUint32(n39 + i36.decorationFlags, (r34.underline === true ? o34.underline : 0) | (r34.overline === true ? o34.overline : 0) | (r34.lineThrough === true ? o34.lineThrough : 0) | (r34.skipInk === true ? o34.skipInk : 0), true), t31.setFloat32(n39 + i36.decorationThickness, r34.thickness, true), t31.setFloat32(n39 + i36.decorationOffset, r34.offset, true);
}
function p20(t31, n39, r34, i36) {
  let a34 = e5.layouts.engineConstraint, o34 = e5.engine;
  for (let [e29, s33] of r34.entries()) {
    let r35 = n39 + e29 * a34.size;
    t31.setUint32(r35 + a34.paragraphId, F6(s33.paragraphId, `paragraph ID`), true);
    for (let [e30, n40] of [[`flowThreadId`, s33.flowThreadId], [`geometryRevision`, s33.geometryRevision], [`maxLines`, s33.maxLines], [`regionStart`, s33.regionStart], [`resumeCluster`, s33.resumeCluster]]) t31.setUint32(r35 + a34[e30], F6(n40, e30), true);
    t31.setUint16(r35 + a34.regionCount, P6(s33.regionCount, `constraint region count`), true), t31.setUint16(r35 + a34.resumeRegion, P6(s33.resumeRegion, `constraint resume region`), true);
    for (let [e30, n40] of [[`width`, s33.width], [`height`, s33.height], [`viewportBlockStart`, s33.viewportBlockStart], [`viewportBlockEnd`, s33.viewportBlockEnd], [`resumeBlockOffset`, s33.resumeBlockOffset]]) t31.setFloat32(r35 + a34[e30], M6(n40, e30), true);
    t31.setUint8(r35 + a34.widthMode, C11(s33.widthMode)), t31.setUint8(r35 + a34.heightMode, C11(s33.heightMode)), t31.setUint8(r35 + a34.wrap, A7(o34.wrapModes, s33.wrap, `constraint wrap`)), t31.setUint8(r35 + a34.align, A7(o34.inlineAlignments, s33.align, `constraint align`)), t31.setUint8(r35 + a34.overflow, A7(o34.overflowModes, s33.overflow, `constraint overflow`)), t31.setUint8(r35 + a34.blockAlign, A7(o34.blockAlignments, s33.blockAlign, `constraint blockAlign`));
    for (let [e30, n40] of [[`firstLineIndent`, s33.firstLineIndent ?? 0], [`spaceBefore`, s33.spaceBefore ?? 0], [`spaceAfter`, s33.spaceAfter ?? 0], [`justifyMinWordSpaceRatio`, s33.justify?.minWordSpaceRatio ?? 0], [`justifyMaxWordSpaceRatio`, s33.justify?.maxWordSpaceRatio ?? 0], [`justifyLetterSpaceExpansion`, s33.justify?.letterSpaceExpansion ?? 0]]) t31.setFloat32(r35 + a34[e30], M6(n40, e30), true);
    t31.setUint8(r35 + a34.lastLine, A7(o34.lastLinePolicies, s33.lastLine ?? `auto`, `constraint lastLine`)), t31.setUint8(r35 + a34.dropCapLines, N6(s33.dropCap?.lines ?? 0, `constraint dropCap lines`)), t31.setUint8(r35 + a34.dropCapAlignment, s33.dropCap === void 0 ? 0 : O8(s33.dropCap.align ?? `text-top`)), t31.setUint8(r35 + a34.dropCapSide, s33.dropCap === void 0 ? 0 : k8(s33.dropCap.side ?? `inline-start`)), t31.setFloat32(r35 + a34.dropCapMarginInline, M6(s33.dropCap?.marginInline ?? 0, `constraint dropCap inline margin`), true), t31.setFloat32(r35 + a34.dropCapMarginBlock, M6(s33.dropCap?.marginBlock ?? 0, `constraint dropCap block margin`), true);
    let c30 = s33.dropCap?.contour ?? [];
    t31.setUint32(r35 + a34.dropCapVerticesOffset, i36[e29], true), t31.setUint16(r35 + a34.dropCapVertexCount, P6(c30.length, `constraint dropCap vertex count`), true), t31.setUint16(r35 + a34.dropCapReserved, 0, true), _14(t31, i36[e29], c30);
  }
}
function m17(t31, n39, r34, i36) {
  let a34 = e5.layouts.engineRegion;
  for (let [o34, s33] of r34.entries()) {
    let r35 = n39 + o34 * a34.size;
    t31.setUint32(r35 + a34.id, F6(s33.id, `region ID`), true), t31.setUint32(r35 + a34.geometryRevision, F6(s33.geometryRevision, `region geometry revision`), true), t31.setUint32(r35 + a34.transformIndex, F6(s33.transformIndex, `region transform index`), true), t31.setUint32(r35 + a34.verticesOffset, i36[o34], true), t31.setUint16(r35 + a34.vertexCount, P6(s33.vertices?.length ?? 0, `region vertex count`), true), t31.setUint16(r35 + a34.exclusionStart, P6(s33.exclusionStart, `region exclusion start`), true), t31.setUint16(r35 + a34.exclusionCount, P6(s33.exclusionCount, `region exclusion count`), true), t31.setUint8(r35 + a34.shape, A7(e5.engine.flowShapeKinds, s33.shape, `region shape`)), t31.setUint8(r35 + a34.writingMode, w10(s33.writingMode)), t31.setUint8(r35 + a34.textOrientation, T9(s33.textOrientation)), g17(t31, r35, a34, s33), _14(t31, i36[o34], s33.vertices ?? []);
  }
}
function h17(t31, n39, r34, i36) {
  let a34 = e5.layouts.engineExclusion;
  for (let [o34, s33] of r34.entries()) {
    let r35 = n39 + o34 * a34.size;
    t31.setUint32(r35 + a34.id, F6(s33.id, `exclusion ID`), true), t31.setUint32(r35 + a34.regionId, F6(s33.regionId, `exclusion region ID`), true), t31.setUint32(r35 + a34.geometryRevision, F6(s33.geometryRevision, `exclusion geometry revision`), true), t31.setUint32(r35 + a34.verticesOffset, i36[o34], true), t31.setUint16(r35 + a34.vertexCount, P6(s33.vertices?.length ?? 0, `exclusion vertex count`), true), t31.setUint8(r35 + a34.shape, A7(e5.engine.flowShapeKinds, s33.shape, `exclusion shape`)), t31.setUint8(r35 + a34.wrapSide, E9(s33.wrapSide)), g17(t31, r35, a34, s33), t31.setFloat32(r35 + a34.marginInline, M6(s33.marginInline, `exclusion inline margin`), true), t31.setFloat32(r35 + a34.marginBlock, M6(s33.marginBlock, `exclusion block margin`), true), _14(t31, i36[o34], s33.vertices ?? []);
  }
}
function g17(e29, t31, n39, r34) {
  for (let i36 of [`inlineStart`, `blockStart`, `inlineEnd`, `blockEnd`]) e29.setFloat32(t31 + n39[i36], M6(r34[i36], i36), true);
  `clipInlineStart` in r34 && (e29.setFloat32(t31 + n39.clipInlineStart, M6(r34.clipInlineStart, `clipInlineStart`), true), e29.setFloat32(t31 + n39.clipBlockStart, M6(r34.clipBlockStart, `clipBlockStart`), true), e29.setFloat32(t31 + n39.clipInlineEnd, M6(r34.clipInlineEnd, `clipInlineEnd`), true), e29.setFloat32(t31 + n39.clipBlockEnd, M6(r34.clipBlockEnd, `clipBlockEnd`), true));
}
function _14(t31, n39, r34) {
  let i36 = e5.layouts.engineFlowVertex;
  for (let [e29, a34] of r34.entries()) {
    let r35 = n39 + e29 * i36.size;
    t31.setFloat32(r35 + i36.inline, M6(a34.inline, `vertex inline`), true), t31.setFloat32(r35 + i36.block, M6(a34.block, `vertex block`), true);
  }
}
function v16(t31, n39, r34) {
  let i36 = e5.layouts.engineInlineObject;
  for (let [e29, a34] of r34.entries()) {
    let r35 = n39 + e29 * i36.size;
    t31.setUint32(r35 + i36.paragraphId, F6(a34.paragraphId, `paragraph ID`), true);
    for (let [e30, n40] of [[`id`, a34.id], [`contentRevision`, a34.contentRevision], [`textOffset`, a34.textOffset], [`materialId`, a34.materialId], [`resourceId`, a34.resourceId], [`resourceGeneration`, a34.resourceGeneration]]) t31.setUint32(r35 + i36[e30], F6(n40, `inline object ${e30}`), true);
    for (let [e30, n40] of [[`inlineExtent`, a34.inlineExtent], [`blockExtent`, a34.blockExtent], [`baselineOffset`, a34.baselineOffset], [`marginInlineStart`, a34.marginInlineStart], [`marginInlineEnd`, a34.marginInlineEnd], [`marginBlockStart`, a34.marginBlockStart], [`marginBlockEnd`, a34.marginBlockEnd]]) t31.setFloat32(r35 + i36[e30], M6(n40, `inline object ${e30}`), true);
    t31.setUint8(r35 + i36.baselineAlignment, D9(a34.baselineAlignment));
  }
}
function y15(e29, t31) {
  return e29 === void 0 ? 0 : t31;
}
function b12(e29, t31, n39) {
  n39 !== void 0 && e29.setUint32(t31, n39, true);
}
function x12(e29, t31, n39) {
  n39 !== void 0 && e29.setFloat32(t31, n39, true);
}
function S11(e29) {
  return e29 === void 0 ? 0 : { auto: 0, ltr: 1, rtl: 2 }[e29];
}
function C11(t31) {
  let n39 = e5.engine.axisModes;
  return t31 === `at-most` ? n39.atMost : A7(n39, t31, `constraint axis mode`);
}
function w10(t31) {
  let n39 = e5.engine.writingModes;
  if (t31 === `horizontal-tb`) return n39.horizontalTb;
  if (t31 === `vertical-rl`) return n39.verticalRl;
  if (t31 === `vertical-lr`) return n39.verticalLr;
  throw TypeError(`region writingMode is invalid`);
}
function T9(t31) {
  return A7(e5.engine.textOrientations, t31, `region textOrientation`);
}
function E9(t31) {
  let n39 = e5.engine.exclusionWrapSides;
  return t31 === `inline-start` ? n39.inlineStart : t31 === `inline-end` ? n39.inlineEnd : A7(n39, t31, `exclusion wrapSide`);
}
function D9(t31) {
  let n39 = e5.engine.inlineObjectBaselines;
  return t31 === `text-top` ? n39.textTop : t31 === `text-bottom` ? n39.textBottom : A7(n39, t31, `inline object baselineAlignment`);
}
function O8(t31) {
  let n39 = e5.engine.dropCapAlignments;
  return t31 === `text-top` ? n39.textTop : A7(n39, t31 ?? `text-top`, `constraint dropCap align`);
}
function k8(t31) {
  let n39 = e5.engine.dropCapSides;
  if (t31 === `inline-start`) return n39.inlineStart;
  if (t31 === `inline-end`) return n39.inlineEnd;
  throw TypeError(`constraint dropCap side is invalid`);
}
function A7(e29, t31, n39) {
  let r34 = e29[t31];
  if (r34 === void 0) throw TypeError(`${n39} is invalid`);
  return r34;
}
function j6(e29) {
  let t31 = 0;
  for (let n39 = 0; n39 < 4; n39 += 1) t31 = t31 << 8 | e29.charCodeAt(n39);
  return t31 >>> 0;
}
function M6(e29, t31) {
  if (!Number.isFinite(e29)) throw RangeError(`${t31} must be finite`);
  return e29;
}
function N6(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 255) throw RangeError(`${t31} must be a u8`);
  return e29;
}
function P6(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > 65535) throw RangeError(`${t31} must be a u16`);
  return e29;
}
function F6(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > n30) throw RangeError(`${t31} must be a u32`);
  return e29;
}
function I4(e29, t31) {
  return R3(e29, (t31 - e29 % t31) % t31, `aligned frame offset`);
}
function L3(e29, t31, r34) {
  let i36 = e29 * t31;
  if (!Number.isSafeInteger(i36) || i36 > n30) throw RangeError(`${r34} exceeds the frame ABI`);
  return i36;
}
function R3(e29, t31, r34) {
  let i36 = e29 + t31;
  if (!Number.isSafeInteger(i36) || i36 > n30) throw RangeError(`${r34} exceeds the frame ABI`);
  return i36;
}

// node_modules/@pmndrs/glyph/dist/internal/plan-view.js
var t21 = e5.layouts.engineResult;
var n31 = { resources: { offset: t21.resourcesOffset, count: t21.resourceCount, record: e5.layouts.engineResource }, buffers: { offset: t21.buffersOffset, count: t21.bufferCount, record: e5.layouts.engineBuffer }, patches: { offset: t21.patchesOffset, count: t21.patchCount, record: e5.layouts.enginePatch }, primitives: { offset: t21.primitivesOffset, count: t21.primitiveCount, record: e5.layouts.enginePrimitive }, draws: { offset: t21.drawsOffset, count: t21.drawCount, record: e5.layouts.engineDraw }, retirements: { offset: t21.retirementsOffset, count: t21.retirementCount, record: e5.layouts.engineRetirement }, diagnostics: { offset: t21.diagnosticsOffset, count: t21.diagnosticCount, record: e5.layouts.engineDiagnostic } };
var r27 = class {
  #e;
  #t;
  #n = 0;
  #r;
  bind(e29) {
    let t31 = e29.bytes, n39 = this.#e === t31.buffer ? this.#t : new DataView(t31.buffer);
    return this.#e !== t31.buffer && (this.#e = t31.buffer, this.#t = n39), this.#n = t31.byteOffset, this.#r = i28(n39, t31.byteOffset), this;
  }
  table(e29) {
    return this.#r[e29];
  }
  record(e29, t31) {
    return e29.offset + t31 * e29.stride;
  }
  u8(e29) {
    return this.#t.getUint8(this.#n + e29);
  }
  u16(e29) {
    return this.#t.getUint16(this.#n + e29, true);
  }
  u32(e29) {
    return this.#t.getUint32(this.#n + e29, true);
  }
  f32(e29) {
    return this.#t.getFloat32(this.#n + e29, true);
  }
  bytes(e29, t31) {
    return new Uint8Array(this.#e, this.#n + e29, t31);
  }
};
function i28(e29, t31) {
  let r34 = (r35) => {
    let i36 = n31[r35];
    return { offset: e29.getUint32(t31 + i36.offset, true), count: e29.getUint32(t31 + i36.count, true), stride: i36.record.size };
  };
  return { resources: r34(`resources`), buffers: r34(`buffers`), patches: r34(`patches`), primitives: r34(`primitives`), draws: r34(`draws`), retirements: r34(`retirements`), diagnostics: r34(`diagnostics`) };
}

// node_modules/@pmndrs/glyph/dist/internal/layout-query-view.js
function t22(t31, n39, r34) {
  if (!r34) return;
  let i36 = e5.layouts.engineSemanticView;
  return Object.freeze({ x: t31.f32(n39 + i36.inkInlineStart), y: t31.f32(n39 + i36.inkBlockStart), width: t31.f32(n39 + i36.inkInlineExtent), height: t31.f32(n39 + i36.inkBlockExtent) });
}
function n32(n39) {
  let r34 = new s28(n39), i36 = r34.table(), a34 = e5.layouts.engineSemanticView, o34 = e5.engine.semanticKinds, c30 = /* @__PURE__ */ new Map();
  for (let n40 = 0; n40 < i36.count; n40 += 1) {
    let s33 = r34.record(i36, n40);
    if (r34.u16(s33 + a34.kind) !== o34.paragraphMeasurement) continue;
    let l29 = r34.u32(s33 + a34.id), u28 = r34.u32(s33 + a34.itemStart), d24 = r34.u32(s33 + a34.itemCount);
    if (u28 + d24 > i36.count) throw RangeError(`paragraph measurement line span is outside the query`);
    let f26 = r34.u16(s33 + a34.flags), p28 = (f26 & e5.engine.measurementFlags.inkBounds) !== 0, m24 = u28 + d24, h24 = 0, g23 = 0, _20 = [];
    for (let e29 = 0; e29 < d24; e29 += 1) {
      let n41 = r34.record(i36, u28 + e29);
      if (r34.u16(n41 + a34.kind) !== o34.line || r34.u32(n41 + a34.parentId) !== l29) throw TypeError(`paragraph measurement references a foreign semantic line`);
      let s34 = r34.f32(n41 + a34.blockStart);
      e29 === 0 && (h24 = s34), g23 = s34;
      let c31 = r34.f32(n41 + a34.blockExtent), d25 = r34.f32(n41 + a34.ascent), f27 = r34.u32(n41 + a34.itemStart);
      _20.push(Object.freeze({ index: e29, textStart: r34.u32(n41 + a34.textStart), textEnd: r34.u32(n41 + a34.textEnd), glyphStart: f27 === 0 ? 0 : f27 - m24, glyphCount: r34.u32(n41 + a34.itemCount), baseline: s34, advance: r34.f32(n41 + a34.inlineExtent), ascent: d25, descent: c31 - d25, lineHeight: c31, inkBounds: t22(r34, n41, p28) }));
    }
    if (c30.has(l29)) throw TypeError(`text engine returned duplicate paragraph measurements`);
    let v22 = r34.f32(s33 + a34.blockExtent), y22 = r34.f32(s33 + a34.ascent);
    c30.set(l29, Object.freeze({ width: r34.f32(s33 + a34.inlineStart), height: r34.f32(s33 + a34.blockStart), contentWidth: r34.f32(s33 + a34.inlineExtent), contentHeight: v22, firstBaseline: h24, lastBaseline: g23, ascent: y22, descent: v22 - y22, lineHeight: v22, inkBounds: t22(r34, s33, p28), overflowed: (f26 & e5.engine.measurementFlags.overflowed) !== 0, minContentWidth: r34.f32(s33 + a34.minContentWidth), maxContentWidth: r34.f32(s33 + a34.maxContentWidth), glyphCount: r34.u32(s33 + a34.parentId), lineCount: d24, missingGlyphCount: r34.u32(s33 + a34.textStart), lines: Object.freeze(_20) }));
  }
  return c30;
}
function r28(e29) {
  return Object.freeze({ width: e29.width, height: e29.height, contentWidth: e29.contentWidth, contentHeight: e29.contentHeight, firstBaseline: e29.firstBaseline, lastBaseline: e29.lastBaseline, ascent: e29.ascent, descent: e29.descent, lineHeight: e29.lineHeight, inkBounds: e29.inkBounds, overflowed: e29.overflowed, minContentWidth: e29.minContentWidth, maxContentWidth: e29.maxContentWidth, glyphCount: e29.glyphCount, lineCount: e29.lineCount, missingGlyphCount: e29.missingGlyphCount, lines: e29.lines });
}
function i29(t31) {
  let r34 = new s28(t31), i36 = r34.table(), c30 = e5.layouts.engineSemanticView, l29 = e5.engine.semanticKinds, u28 = n32(t31), d24 = /* @__PURE__ */ new Map();
  for (let e29 = 0; e29 < i36.count; e29 += 1) {
    let t32 = r34.record(i36, e29);
    if (r34.u16(t32 + c30.kind) !== l29.paragraphMeasurement) continue;
    let n39 = r34.u32(t32 + c30.id), s33 = u28.get(n39);
    if (s33 === void 0) throw TypeError(`layout inspection has no paragraph measurement`);
    let f26 = r34.u32(t32 + c30.itemStart), p28 = r34.u32(t32 + c30.itemCount), m24 = o29(f26, p28, `layout inspection glyph start`), h24 = s33.glyphCount;
    if (o29(m24, h24, `layout inspection glyph end`) > i36.count) throw RangeError(`layout inspection glyph span is outside the query`);
    let g23 = [], _20 = /* @__PURE__ */ new Map(), v22 = new Uint32Array(h24), y22 = new Uint16Array(h24), b20 = new Uint16Array(h24), x19 = new Uint32Array(h24), S17 = new Uint8Array(h24), C17 = new Float32Array(h24), w15 = new Float32Array(h24), T13 = new Float32Array(h24), E13 = new Float32Array(h24), D12 = new Float32Array(h24), O11 = new Float32Array(h24), k11 = new Float32Array(h24), A10 = new Float32Array(h24), j9 = new Uint16Array(h24);
    for (let e30 = 0; e30 < h24; e30 += 1) {
      let t33 = r34.record(i36, m24 + e30);
      if (r34.u16(t33 + c30.kind) !== l29.glyph || r34.u32(t33 + c30.parentId) !== n39) throw TypeError(`layout inspection references a foreign semantic glyph`);
      let a34 = r34.u32(t33 + c30.textEnd), o34 = _20.get(a34);
      if (o34 === void 0) {
        if (o34 = g23.length, o34 > 65535) throw RangeError(`layout inspection exceeds the font-slot range`);
        _20.set(a34, o34), g23.push(a34);
      }
      v22[e30] = r34.u32(t33 + c30.id), y22[e30] = o34, b20[e30] = r34.u32(t33 + c30.itemStart), x19[e30] = r34.u32(t33 + c30.textStart);
      let s34 = r34.u32(t33 + c30.itemCount);
      if (s34 > 125) throw RangeError(`layout inspection glyph has an invalid bidi level`);
      S17[e30] = s34, C17[e30] = r34.f32(t33 + c30.inlineExtent), w15[e30] = r34.f32(t33 + c30.inlineStart), T13[e30] = r34.f32(t33 + c30.blockStart), E13[e30] = r34.f32(t33 + c30.inlineAdvance), D12[e30] = r34.f32(t33 + c30.inkInlineStart), O11[e30] = r34.f32(t33 + c30.inkBlockStart), k11[e30] = r34.f32(t33 + c30.inkInlineExtent), A10[e30] = r34.f32(t33 + c30.inkBlockExtent), j9[e30] = r34.u16(t33 + c30.flags);
    }
    let M9 = new Uint32Array(p28), N9 = new Uint32Array(p28), P8 = new Uint32Array(p28), F8 = new Uint32Array(p28), I6 = new Float32Array(p28), L5 = new Float32Array(p28);
    for (let e30 = 0; e30 < p28; e30 += 1) {
      let t33 = r34.record(i36, f26 + e30);
      if (r34.u16(t33 + c30.kind) !== l29.line || r34.u32(t33 + c30.parentId) !== n39) throw TypeError(`layout inspection references a foreign semantic line`);
      let a34 = r34.u32(t33 + c30.itemStart), s34 = r34.u32(t33 + c30.itemCount);
      if (a34 < m24 || o29(a34, s34, `line glyph end`) > m24 + h24) throw RangeError(`layout inspection line glyph span is outside its paragraph`);
      M9[e30] = r34.u32(t33 + c30.textStart), N9[e30] = r34.u32(t33 + c30.textEnd), P8[e30] = a34 - m24, F8[e30] = s34, I6[e30] = r34.f32(t33 + c30.blockStart), L5[e30] = r34.f32(t33 + c30.inlineExtent);
    }
    if (a29(h24, [v22, y22, b20, x19, S17, C17, w15, T13, E13, D12, O11, k11, A10, j9]), a29(p28, [M9, N9, P8, F8, I6, L5]), s33.lines.length !== p28) throw RangeError(`layout inspection line metrics disagree with its line count`);
    d24.set(n39, Object.freeze({ ...s33, fontHandles: Uint32Array.from(g23), glyphStableIds: v22, glyphFontSlots: y22, glyphIds: b20, clusters: x19, glyphBidiLevels: S17, glyphFontSizes: C17, x: w15, y: T13, glyphAdvances: E13, glyphInkX: D12, glyphInkY: O11, glyphInkWidths: k11, glyphInkHeights: A10, glyphFlags: j9, lineTextStarts: M9, lineTextEnds: N9, lineGlyphStarts: P8, lineGlyphCounts: F8, lineBaselines: I6, lineAdvances: L5 }));
  }
  return d24;
}
function a29(e29, t31) {
  for (let n39 of t31) if (n39.length !== e29) throw RangeError(`layout inspection published a ragged column`);
}
function o29(e29, t31, n39) {
  let r34 = e29 + t31;
  if (!Number.isSafeInteger(r34) || r34 < 0) throw RangeError(`${n39} overflows`);
  return r34;
}
var s28 = class {
  #e;
  #t;
  constructor(e29) {
    if (e29.bytes.buffer !== e29.memoryBuffer) throw TypeError(`text-engine query bytes do not belong to the reported Wasm memory`);
    this.#e = e29, this.#t = new DataView(e29.memoryBuffer);
  }
  table() {
    let t31 = e5.layouts.engineResult, n39 = e5.layouts.engineSemanticView, r34 = this.u32(t31.semanticViewsOffset), i36 = this.u32(t31.semanticViewCount);
    if (i36 !== this.#e.semanticViewCount) throw TypeError(`text-engine query metadata disagrees with its publication`);
    if (i36 === 0) {
      if (r34 !== 0) throw RangeError(`empty text-engine semantic view has a nonzero offset`);
      return { offset: 0, count: 0, stride: n39.size };
    }
    let a34 = i36 * n39.size;
    if (!Number.isSafeInteger(a34) || r34 % n39.alignment !== 0 || r34 < t31.size) throw RangeError(`text-engine semantic view has an invalid span`);
    return this.#n(r34, a34), { offset: r34, count: i36, stride: n39.size };
  }
  record(e29, t31) {
    if (!Number.isSafeInteger(t31) || t31 < 0 || t31 >= e29.count) throw RangeError(`text-engine semantic-view record index is outside its table`);
    return e29.offset + t31 * e29.stride;
  }
  u16(e29) {
    return this.#n(e29, 2), this.#t.getUint16(this.#e.bytes.byteOffset + e29, true);
  }
  u32(e29) {
    return this.#n(e29, 4), this.#t.getUint32(this.#e.bytes.byteOffset + e29, true);
  }
  f32(e29) {
    return this.#n(e29, 4), this.#t.getFloat32(this.#e.bytes.byteOffset + e29, true);
  }
  #n(e29, t31) {
    if (!Number.isSafeInteger(e29) || !Number.isSafeInteger(t31) || e29 < 0 || t31 < 0 || e29 + t31 > this.#e.bytes.byteLength) throw RangeError(`text-engine semantic-view read is outside the publication`);
  }
};

// node_modules/@pmndrs/glyph/dist/internal/borrowed-layout-view.js
function t23(e29, t31, n39) {
  return Object.freeze(new i30(e29, t31, n39));
}
function n33(e29, t31) {
  return Object.freeze(new a30(e29, t31));
}
function r29(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 >= t31) throw RangeError(`borrowed layout glyph index is outside its range`);
}
var i30 = class {
  #e;
  #t;
  #n;
  constructor(e29, t31, n39) {
    this.#e = e29, this.#t = t31, this.#n = n39;
  }
  get glyphCount() {
    return this.#n(), this.#t.glyphCount;
  }
  glyphAt(t31) {
    this.#n();
    let n39 = this.#e.borrowParagraphGlyph(this.#t, t31), r34 = e5.layouts.borrowedGlyph, i36 = new DataView(this.#t.memoryBuffer, n39, r34.size), a34 = i36.getUint8(r34.bidiLevel);
    if (a34 > 125) throw RangeError(`borrowed layout glyph has an invalid bidi level`);
    return Object.freeze({ stableId: i36.getUint32(r34.stableId, true), fontHandle: i36.getUint32(r34.fontHandle, true), glyphId: i36.getUint16(r34.glyphId, true), cluster: i36.getUint32(r34.cluster, true), bidiLevel: a34, fontSize: i36.getFloat32(r34.fontSize, true), x: i36.getFloat32(r34.inlineOrigin, true), y: i36.getFloat32(r34.blockOrigin, true), advance: i36.getFloat32(r34.inlineAdvance, true), inkX: i36.getFloat32(r34.inkInlineStart, true), inkY: i36.getFloat32(r34.inkBlockStart, true), inkWidth: i36.getFloat32(r34.inkInlineExtent, true), inkHeight: i36.getFloat32(r34.inkBlockExtent, true), flags: i36.getUint16(r34.flags, true) });
  }
};
var a30 = class {
  #e;
  #t;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get glyphCount() {
    return this.#t(), this.#e.glyphCount;
  }
  glyphAt(e29) {
    this.#t();
    let t31 = this.#e;
    r29(e29, t31.glyphCount);
    let n39 = t31.glyphFontSlots[e29], i36 = t31.fontHandles[n39];
    if (i36 === void 0) throw RangeError(`borrowed layout glyph references a missing font slot`);
    return Object.freeze({ stableId: t31.glyphStableIds[e29], fontHandle: i36, glyphId: t31.glyphIds[e29], cluster: t31.clusters[e29], bidiLevel: t31.glyphBidiLevels[e29], fontSize: t31.glyphFontSizes[e29], x: t31.x[e29], y: t31.y[e29], advance: t31.glyphAdvances[e29], inkX: t31.glyphInkX[e29], inkY: t31.glyphInkY[e29], inkWidth: t31.glyphInkWidths[e29], inkHeight: t31.glyphInkHeights[e29], flags: t31.glyphFlags[e29] });
  }
};

// node_modules/@pmndrs/glyph/dist/config/text-property.js
var e23 = /* @__PURE__ */ new WeakSet();
function t24(t31, r34, a34) {
  if (t31 === r34 || e23.has(r34)) return r34;
  if (t31 !== void 0 && n34(t31, r34)) return t31;
  let o34;
  try {
    o34 = structuredClone(r34);
  } catch (e29) {
    throw TypeError(`${a34} must contain cloneable data`, { cause: e29 });
  }
  return i31(o34), e23.add(o34), o34;
}
function n34(e29, t31) {
  return Object.is(e29, t31) ? true : typeof e29 != `object` || !e29 || typeof t31 != `object` || !t31 ? false : r30(e29, t31, /* @__PURE__ */ new WeakMap(), /* @__PURE__ */ new WeakMap());
}
function r30(e29, t31, n39, i36) {
  let a34 = n39.get(e29);
  if (a34 !== void 0) return a34 === t31;
  let o34 = i36.get(t31);
  if (o34 !== void 0) return o34 === e29;
  n39.set(e29, t31), i36.set(t31, e29);
  let s33 = Reflect.ownKeys(e29), c30 = Reflect.ownKeys(t31);
  return s33.length === c30.length && s33.every((a35) => {
    if (!Object.hasOwn(t31, a35)) return false;
    let o35 = Reflect.get(e29, a35), s34 = Reflect.get(t31, a35);
    return Object.is(o35, s34) ? true : typeof o35 != `object` || !o35 || typeof s34 != `object` || !s34 ? false : r30(o35, s34, n39, i36);
  });
}
function i31(e29, t31 = /* @__PURE__ */ new WeakSet()) {
  if (typeof e29 != `object` || !e29 || t31.has(e29)) return e29;
  t31.add(e29);
  for (let n39 of Reflect.ownKeys(e29)) i31(Reflect.get(e29, n39), t31);
  return Object.freeze(e29);
}

// node_modules/@pmndrs/glyph/dist/internal/render-planner.js
var S12 = 4294967295;
var C12 = /* @__PURE__ */ new WeakSet();
var re2 = class {
};
var w11 = class extends e3 {
  constructor() {
    super(`engine-failed`, `render planner has been disposed`), this.name = `RenderPlannerDisposedError`;
  }
};
var ie2 = /* @__PURE__ */ new WeakMap();
function ae2(e29, t31) {
  return new E10(e29, t31);
}
function se2(e29, t31) {
  if (!(e29 instanceof E10)) throw TypeError(`render planner was not created by this package`);
  return e29._observeDirty(t31);
}
function T10(e29, t31, n39 = false) {
  if (!(e29 instanceof E10)) throw TypeError(`render planner was not created by this package`);
  return e29._stageBatch(k9(t31), n39);
}
var E10 = class {
  #e;
  #t;
  #n;
  #r;
  #i;
  #a;
  #o = new AbortController();
  #s = Object.freeze(new re2());
  #c;
  #l = /* @__PURE__ */ new Set();
  #u = /* @__PURE__ */ new Set();
  #d = /* @__PURE__ */ new Map();
  #f = false;
  #p = 0;
  #m = 0;
  #h = 0;
  #g = 0;
  #_ = 0;
  #v = 0;
  #y = 0;
  #b = 0;
  #x = 1;
  #S = 0;
  #C = 0;
  #w = 0;
  #T = 0;
  #E = 0;
  #D = 0;
  #O = -1;
  #k = false;
  #A;
  #j = 0;
  #M;
  #N;
  #P;
  constructor(e29, t31, n39 = false) {
    this.#e = e29, n39 ? we2(t31) : Ce2(t31), this.#c = K3(t31.limits);
    let r34 = e29._retainInstalledCodec(t31.codec);
    if (n39) try {
      let n40 = e29._allocatePlannerHandle();
      this.#t = e29._createPlanTransport({ handle: n40, requestCapacity: t31.requestCapacity, resultCapacity: t31.resultCapacity, textCapacity: t31.textCapacity }), this.#n = r34, this.#r = void 0, this.#i = void 0, this.#a = void 0;
      return;
    } catch (e30) {
      throw r34.dispose(), e30;
    }
    let i36 = t31, a34, o34 = false, s33 = new Ee2(() => {
      this.#se(), this.#T = Oe2(this.#T), this.#P?.();
    });
    try {
      let n40 = r34.descriptor.capabilitySets[i36.capabilitySetIndex];
      if (n40 === void 0) throw RangeError(`Codec capability set index is out of range`);
      let c30 = t20(r34.handle, r34.descriptor, n40);
      if (a34 = i36.target(s33), Te2(a34), C12.has(a34)) throw TypeError(`plan target is already attached to another render planner`);
      C12.add(a34), o34 = true;
      let l29 = e29._allocatePlannerHandle();
      this.#t = e29._createPlanTransport({ handle: l29, requestCapacity: t31.requestCapacity, resultCapacity: t31.resultCapacity, textCapacity: t31.textCapacity }), this.#i = a34, this.#a = s33, this.#n = r34, this.#r = c30;
    } catch (e30) {
      if (s33.dispose(), r34.dispose(), o34) try {
        a34.dispose();
      } catch (t32) {
        throw Ae2(e30, t32, `render-planner construction and target disposal both failed`);
      }
      throw e30;
    }
  }
  get disposed() {
    return this.#k;
  }
  createText(e29) {
    this.#ie();
    let t31 = this.#x, n39 = De2(t31), r34 = A8(this.#e, e29), i36 = { paragraphId: this.#e.id(`paragraph`, `${this.#e.integration}/text/${t31}`), ordinal: t31, desired: r34, metrics: N7(r34, t31), publishedText: ``, publishedStyleCount: 0, geometryRevision: 0, committedFlowRegions: /* @__PURE__ */ new Map(), committedFlowExclusions: /* @__PURE__ */ new Map(), pendingFlowRegions: /* @__PURE__ */ new Map(), pendingFlowExclusions: /* @__PURE__ */ new Map(), published: false, dirty: true, semanticDirty: true, lifecycleDirty: true, styleDirty: true, geometryDirty: true, orderScope: 0, orderRank: 0, orderDirty: false, removed: false, disposed: false, desiredReleased: false, committed: void 0, measurement: void 0, inspection: void 0, inspectionBorrowMode: `sparse-first` };
    try {
      this.#V(i36);
    } catch (e30) {
      throw W3(r34), e30;
    }
    let a34 = new D10(this, i36);
    return ie2.set(a34, { planner: this, state: i36 }), this.#H(i36), this.#l.add(i36), this.#f = true, this.#D = J3(this.#D), this.#x = n39, this.#P?.(), a34;
  }
  _updateText(e29, t31) {
    if (this.#ie(), e29.disposed) throw Error(`text engine text has been disposed`);
    if (!Q2(t31)) throw TypeError(`text engine text update must be an object`);
    let n39 = pe2(t31, e29.desired), r34 = n39 === void 0 ? A8(this.#e, fe2(e29.desired.source, e29.metrics.order, t31)) : ge2(e29.desired, n39, e29.metrics.order), i36 = N7(r34, e29.ordinal), a34 = e29.styleDirty || r34.text.length !== e29.desired.text.length || me2(t31, e29.desired, r34), o34 = e29.geometryDirty || he2(t31), s33 = { desired: r34, metrics: i36, dirty: true, semanticDirty: true, styleDirty: a34, publishedStyleCount: e29.publishedStyleCount };
    try {
      this.#V(s33, e29);
    } catch (e30) {
      throw W3(r34), e30;
    }
    let c30 = e29.metrics.order, l29 = s33.metrics.order;
    this.#U(e29, s33.metrics, a34), W3(e29.desired), e29.desired = r34, e29.metrics = s33.metrics, e29.dirty = true, e29.semanticDirty = true, e29.lifecycleDirty = e29.lifecycleDirty || c30 !== l29, e29.styleDirty = a34, e29.geometryDirty = o34, e29.measurement = void 0, e29.inspection = void 0, e29.inspectionBorrowMode = `sparse-first`, c30 !== l29 && (this.#f = true, this.#D = J3(this.#D)), this.#P?.();
  }
  _updateTextOrder(e29, t31, n39, r34) {
    if (this.#ie(), e29.disposed) throw Error(`text engine text has been disposed`);
    if (X2(t31, `text order`), X2(n39, `text order scope`), !Number.isFinite(r34)) throw RangeError(`text order rank must be finite`);
    if (e29.metrics.order === t31 && e29.orderScope === n39 && Object.is(e29.orderRank, r34)) return;
    if (!e29.dirty && this.#u.size + this.#v + 1 > this.#c.maxParagraphs * 2) throw RangeError(`pending paragraph mutations exceed limits.maxParagraphs`);
    e29.dirty || (this.#v += 1);
    let i36 = e29.metrics.order !== t31, a34 = e29.orderScope !== n39 || !Object.is(e29.orderRank, r34);
    i36 && (e29.metrics = { ...e29.metrics, order: t31 }, this.#f = true), e29.orderScope = n39, e29.orderRank = r34, e29.dirty = true, e29.lifecycleDirty = e29.lifecycleDirty || i36, e29.orderDirty = e29.orderDirty || a34, this.#D = J3(this.#D), this.#P?.();
  }
  _layoutText(e29) {
    this.#ae(e29);
    let t31 = e29.measurement;
    return t31 === void 0 ? this.#I(e29, false) : t31;
  }
  _layoutTextInk(e29) {
    this.#ae(e29);
    let t31 = e29.measurement;
    return t31?.inkBounds === void 0 ? this.#I(e29, true) : t31;
  }
  _inspectText(e29) {
    this.#ae(e29);
    let t31 = e29.inspection;
    return n27(t31 === void 0 ? this.#L(e29) : t31);
  }
  _withGlyphs(t31, n39) {
    if (this.#ae(t31), typeof n39 != `function`) throw TypeError(`borrowed glyph inspection callback must be a function`);
    let r34 = true, i36, a34 = t31.inspection;
    if (a34 === void 0 && t31.inspectionBorrowMode === `promotion-ready`) try {
      a34 = this.#L(t31);
    } catch (e29) {
      if (!(e29 instanceof i17) || e29.statusCode !== `result-too-large`) throw e29;
      t31.inspectionBorrowMode = `sparse-only`;
    }
    if (a34 !== void 0) i36 = n33(a34, () => {
      if (!r34) throw Error(`borrowed glyph layout has expired`);
    });
    else {
      let n40 = this.#t.borrowParagraphLayout(this.#z(t31, e5.engine.semanticViewMasks.borrowedLayout), t31.paragraphId, this.#c.maxOutputBytes);
      i36 = t23(this.#t, n40, () => {
        if (!r34 || this.#t.isExpired(n40.publication)) throw Error(`borrowed glyph layout has expired`);
      }), t31.inspectionBorrowMode === `sparse-first` && (t31.inspectionBorrowMode = `promotion-ready`), this.#te(t31);
    }
    let o34 = this.#e._enterBorrowedPlan();
    try {
      let e29 = n39(i36);
      if ($2(e29)) throw TypeError(`a borrowed glyph inspection callback must answer synchronously`);
      return e29;
    } finally {
      r34 = false, o34();
    }
  }
  _copyGlyphs(e29, t31, n39) {
    this.#J(e29, n39);
    let r34 = this.#t.copyGlyphs(e29.paragraphId, t31, this.#n.handle, this.#Y(), this.#c.maxOutputBytes);
    return this.#q(r34, n39);
  }
  _copyDecorations(e29, t31) {
    this.#J(e29, t31);
    let n39 = this.#t.copyDecorations(e29.paragraphId, this.#n.handle, this.#Y(), this.#c.maxOutputBytes);
    return this.#q(n39, t31);
  }
  _disposeText(e29) {
    if (!e29.disposed) {
      if (this.#ie(), e29.disposed = true, this.#W(e29), W3(e29.desired), e29.desiredReleased = true, this.#D = J3(this.#D), e29.committed === void 0 && !this.#d.has(e29)) {
        this.#l.delete(e29);
        return;
      }
      e29.removed = true, e29.dirty = true, this.#u.add(e29), this.#P?.();
    }
  }
  _observeDirty(e29) {
    if (this.#se(), typeof e29 != `function`) throw TypeError(`render planner dirty listener must be a function`);
    if (this.#P !== void 0) throw Error(`render planner already has a dirty listener`);
    return this.#P = e29, this.#oe() && e29(), () => {
      this.#P === e29 && (this.#P = void 0);
    };
  }
  _stageBatch(e29, t31) {
    if (this.#ie(), this.#i === void 0) throw Error(`measurement-only planners cannot publish render plans`);
    if (this.#i.delivery !== `borrowed`) throw TypeError(`glyph.shape() requires a synchronous borrowed renderer target`);
    if (this.#A !== void 0) throw Error(`render planner is already staged`);
    if (!t31 && !this.#oe()) return;
    let n39 = this.#T, r34 = this.#B(e29, n39);
    return this.#j = this.#t.stageUpdate(r34), this.#A = { checkpointGeneration: n39, semanticViewMask: e29.semanticViewMask }, this;
  }
  get rootId() {
    if (this.#A === void 0) throw Error(`render planner is not staged`);
    return this.#t.handle;
  }
  get requestLength() {
    if (this.#A === void 0) throw Error(`render planner is not staged`);
    return this.#j;
  }
  adopt(e29, t31) {
    let n39 = this.#A;
    if (n39 === void 0) throw Error(`render planner is not staged`);
    if (this.#M !== void 0) throw Error(`render planner already adopted a staged publication`);
    this.#A = void 0, this.#j = 0;
    let r34 = this.#t.consumeStagedUpdate(e29, t31);
    this.#S = r34.engineRevision, this.#F(r34, n39.semanticViewMask), this.#G(), this.#M = { publication: r34, checkpointGeneration: n39.checkpointGeneration };
  }
  consume() {
    let e29 = this.#M;
    if (e29 === void 0) throw Error(`render planner has no adopted staged publication to consume`);
    this.#M = void 0;
    let { publication: t31 } = e29, n39 = new O9(t31, this.#t), r34 = this.#K(n39), i36;
    try {
      let e30 = this.#i.accept(r34, this.#o.signal);
      if ($2(e30)) throw TypeError(`a borrowed plan target must answer synchronously`);
      i36 = q3(e30);
    } finally {
      n39.expire();
    }
    return i36.accepted && (this.#N = e29), i36;
  }
  settle() {
    let e29 = this.#N;
    if (e29 === void 0) throw Error(`render planner has no accepted staged publication to settle`);
    this.#N = void 0, this.#re(e29);
  }
  discard() {
    this.#M = void 0, this.#N = void 0, this.#A !== void 0 && (this.#A = void 0, this.#j = 0, this.#t.discardStagedUpdate());
  }
  dispose() {
    if (this.#k) return;
    this.#e._assertEngineMutationAllowed(), this.#k = true, this.#P = void 0, this.discard(), this.#o.abort(new w11()), this.#a?.dispose();
    let e29, t31 = (t32) => {
      try {
        t32();
      } catch (t33) {
        e29 ??= t33;
      }
    };
    this.#i !== void 0 && t31(() => this.#i.dispose()), t31(() => this.#t.dispose()), t31(() => this.#ne());
    for (let e30 of this.#l) e30.disposed = true, e30.desiredReleased || t31(() => W3(e30.desired)), e30.desiredReleased = true, e30.committed !== void 0 && t31(() => W3(e30.committed)), e30.committed = void 0;
    if (this.#l.clear(), this.#u.clear(), this.#p = 0, this.#m = 0, this.#h = 0, this.#g = 0, this.#_ = 0, this.#v = 0, this.#y = 0, this.#b = 0, t31(() => this.#n.dispose()), this.#e._detachPlanner(this), e29 !== void 0) throw e29;
  }
  #F(t31, n39) {
    let r34 = e5.engine.semanticViewMasks;
    if ((n39 & r34.layoutInspection) !== 0) {
      let e29 = i29(t31);
      for (let t32 of this.#l) {
        let n40 = e29.get(t32.paragraphId);
        n40 !== void 0 && (t32.measurement = r28(n40), t32.inspection = n40);
      }
      return;
    }
    if ((n39 & r34.measurement) === 0) return;
    let i36 = n32(t31);
    for (let e29 of this.#l) {
      let t32 = i36.get(e29.paragraphId);
      t32 !== void 0 && (e29.measurement = t32);
    }
  }
  #I(t31, n39) {
    this.#ae(t31);
    let r34 = e5.engine.semanticViewMasks, i36 = this.#R(t31, r34.measurement | (n39 ? r34.borrowedLayout : 0)), a34 = n32(i36).get(t31.paragraphId);
    if (a34 === void 0) throw Error(`text engine returned no measurement for retained text`);
    return this.#te(t31), t31.measurement = a34, a34;
  }
  #L(t31) {
    this.#ae(t31);
    let n39 = this.#R(t31, e5.engine.semanticViewMasks.layoutInspection), r34 = i29(n39).get(t31.paragraphId);
    if (r34 === void 0) throw Error(`text engine returned no layout inspection for retained text`);
    return this.#te(t31), t31.measurement = r28(r34), t31.inspection = r34, r34;
  }
  #R(e29, t31) {
    let n39 = this.#z(e29, t31);
    return this.#t.measureParagraph(n39, e29.paragraphId, this.#c.maxOutputBytes);
  }
  #z(e29, t31) {
    let n39 = M7(this.#e, e29), r34 = [...n39];
    for (let t32 = n39.length + 1; t32 <= e29.publishedStyleCount; t32 += 1) r34.push({ opcode: `remove`, paragraphId: e29.paragraphId, styleId: n28(this.#e.id, e29.paragraphId, t32) });
    let a34 = F7(this.#e, e29, 0, 0), o34 = !e29.published || e29.publishedText !== e29.desired.text;
    return a28({ rootId: this.#t.handle, codecHandle: this.#n.handle, ...this.#r === void 0 ? {} : { capabilitySet: this.#r }, expectedEngineRevision: this.#S, consumedRevision: this.#C, acknowledgedPublicationGeneration: this.#w, semanticViewMask: t31, limits: this.#c, paragraphMutations: this.#Q(e29), paragraphOrderMutations: this.#$(), textMutations: o34 ? [{ paragraphId: e29.paragraphId, start: 0, deleteCount: e29.publishedText.length, insert: e29.desired.text }] : [], styleMutations: r34, constraints: [a34.constraint], regions: a34.regions, exclusions: a34.exclusions, inlineObjects: V3(this.#e, e29) });
  }
  #B(e29, t31) {
    this.#ee();
    let n39 = [...[...this.#u].map((e30) => ({ opcode: `remove`, paragraphId: e30.paragraphId })), ...[...this.#l].filter((e30) => !e30.removed && e30.lifecycleDirty).map((e30) => ({ opcode: `upsert`, paragraphId: e30.paragraphId, order: e30.metrics.order }))], r34 = [...this.#l].filter((e30) => !e30.removed && e30.orderDirty).map((e30) => ({ paragraphId: e30.paragraphId, orderScope: e30.orderScope, orderRank: e30.orderRank })), a34 = [...this.#l].filter((e30) => !e30.removed && e30.semanticDirty), s33 = a34.flatMap((e30) => {
      let t32 = h16(e30.publishedText, e30.desired.text);
      return t32 === void 0 ? [] : [{ paragraphId: e30.paragraphId, ...t32 }];
    }), c30 = [], l29 = [], u28 = [], d24 = [], f26 = [];
    for (let e30 of a34) {
      if (e30.styleDirty) {
        let t32 = M7(this.#e, e30);
        c30.push(...t32);
        for (let n40 = t32.length + 1; n40 <= e30.publishedStyleCount; n40 += 1) c30.push({ opcode: `remove`, paragraphId: e30.paragraphId, styleId: n28(this.#e.id, e30.paragraphId, n40) });
      }
      if (e30.geometryDirty) {
        let t32 = F7(this.#e, e30, u28.length, d24.length);
        I5(e30, t32.regions, t32.exclusions), l29.push(t32.constraint), u28.push(...t32.regions), d24.push(...t32.exclusions), f26.push(...V3(this.#e, e30));
      }
    }
    return a28({ rootId: this.#t.handle, codecHandle: this.#n.handle, ...this.#r === void 0 ? {} : { capabilitySet: this.#r }, expectedEngineRevision: this.#S, consumedRevision: t31 === this.#E ? this.#C : 0, acknowledgedPublicationGeneration: this.#w, semanticViewMask: e29.semanticViewMask, compositingIndependent: true, limits: this.#c, paragraphMutations: n39, paragraphOrderMutations: r34, textMutations: s33, styleMutations: c30, constraints: l29, regions: u28, exclusions: d24, inlineObjects: f26 });
  }
  #V(e29, t31) {
    let n39 = t31?.metrics, r34 = this.#p + +(t31 === void 0), i36 = this.#m - (n39?.styleCount ?? 0) + e29.metrics.styleCount, a34 = this.#h - (n39?.regionCount ?? 0) + e29.metrics.regionCount, o34 = this.#g - (n39?.exclusionCount ?? 0) + e29.metrics.exclusionCount, s33 = this.#_ - (n39?.inlineObjectCount ?? 0) + e29.metrics.inlineObjectCount, c30 = this.#v - Number(t31?.dirty ?? false) + 1, l29 = this.#y - Number(t31?.semanticDirty ?? false) + 1, u28 = this.#b - (t31?.dirty ? P7(t31) : 0) + P7(e29);
    if (r34 > this.#c.maxParagraphs) throw RangeError(`retained texts exceed limits.maxParagraphs`);
    if (i36 > this.#c.maxClusters) throw RangeError(`retained text styles exceed limits.maxClusters`);
    if (r34 > this.#c.maxRegions || a34 > this.#c.maxRegions) throw RangeError(`retained text regions exceed limits.maxRegions`);
    if (o34 > this.#c.maxExclusions) throw RangeError(`retained text exclusions exceed limits.maxExclusions`);
    if (s33 > this.#c.maxInlineObjects) throw RangeError(`retained inline objects exceed limits.maxInlineObjects`);
    if ((e29.desired.source.layout?.maxLines ?? 0) > this.#c.maxLines) throw RangeError(`retained text maxLines exceeds limits.maxLines`);
    if (this.#u.size + c30 > this.#c.maxParagraphs * 2) throw RangeError(`pending paragraph mutations exceed limits.maxParagraphs`);
    if (l29 > this.#c.maxClusters) throw RangeError(`pending text mutations exceed limits.maxClusters`);
    if (u28 > this.#c.maxClusters) throw RangeError(`pending style mutations exceed limits.maxClusters`);
  }
  #H(e29) {
    this.#p += 1, this.#m += e29.metrics.styleCount, this.#h += e29.metrics.regionCount, this.#g += e29.metrics.exclusionCount, this.#_ += e29.metrics.inlineObjectCount, this.#v += Number(e29.dirty), this.#y += Number(e29.semanticDirty), e29.dirty && (this.#b += P7(e29));
  }
  #U(e29, t31, n39) {
    this.#m += t31.styleCount - e29.metrics.styleCount, this.#h += t31.regionCount - e29.metrics.regionCount, this.#g += t31.exclusionCount - e29.metrics.exclusionCount, this.#_ += t31.inlineObjectCount - e29.metrics.inlineObjectCount;
    let r34 = e29.semanticDirty;
    e29.dirty && (this.#b -= P7(e29));
    let i36 = { ...e29, metrics: t31, dirty: true, semanticDirty: true, styleDirty: n39 };
    this.#v += Number(!e29.dirty), this.#y += Number(!r34), this.#b += P7(i36);
  }
  #W(e29) {
    --this.#p, this.#m -= e29.metrics.styleCount, this.#h -= e29.metrics.regionCount, this.#g -= e29.metrics.exclusionCount, this.#_ -= e29.metrics.inlineObjectCount, this.#v -= Number(e29.dirty), this.#y -= Number(e29.semanticDirty), e29.dirty && (this.#b -= P7(e29));
  }
  #G() {
    this.#ne();
    for (let e29 of this.#u) this.#l.delete(e29), e29.desiredReleased || W3(e29.desired), e29.desiredReleased = true, e29.committed !== void 0 && W3(e29.committed), e29.committed = void 0;
    this.#u.clear();
    for (let e29 of this.#l) e29.dirty && (e29.geometryDirty && L4(e29), e29.committed !== e29.desired && (U3(e29.desired), e29.committed !== void 0 && W3(e29.committed), e29.committed = e29.desired), e29.published = true, e29.semanticDirty && (e29.publishedText = e29.desired.text), e29.geometryDirty && (e29.geometryRevision += 1), --this.#v, this.#y -= Number(e29.semanticDirty), this.#b -= P7(e29), e29.styleDirty && (e29.publishedStyleCount = _e2(e29)), e29.dirty = false, e29.semanticDirty = false, e29.lifecycleDirty = false, e29.styleDirty = false, e29.geometryDirty = false, e29.orderDirty = false);
    this.#f = false;
  }
  #K(e29) {
    return Object.freeze({ origin: this.#s, plan: e29.reader, engineRevision: e29.publication.engineRevision, revision: e29.publication.revision, publicationGeneration: e29.publication.publicationGeneration, checkpoint: ke2(e29.publication), transforms: Object.freeze(this.#Z()), acquirePayload: (t31) => (e29.assertActive(), this.#X(t31)), resolveMaterial: (t31) => (e29.assertActive(), this.#e._resolveOpaqueBinding(`material`, t31)), resolveResource: (t31) => (e29.assertActive(), this.#e._resolveOpaqueBinding(`resource`, t31)) });
  }
  #q(e29, t31) {
    let n39 = new O9(e29, this.#t), r34 = this.#e._enterBorrowedPlan();
    try {
      let e30 = t31.accept(this.#K(n39), this.#o.signal);
      if ($2(e30)) throw TypeError(`a detached plan target must answer synchronously`);
      return q3(e30);
    } finally {
      n39.expire(), r34();
    }
  }
  #J(e29, t31) {
    if (this.#ae(e29), !e29.published || e29.committed === void 0) throw Error(`retained text must have a committed render publication before it can be copied`);
    if (typeof t31 != `object` || !t31 || t31.delivery !== `borrowed`) throw TypeError(`detached plan copies require a synchronous borrowed plan target`);
  }
  #Y() {
    return this.#r === void 0 ? 1 : n29(this.#r, this.#n.handle);
  }
  #X(e29) {
    let t31 = this.#e._acquirePortablePayload(e29), n39 = false;
    return Object.freeze({ referenceId: e29, techniqueId: t31.techniqueId, resourceName: t31.resourceName, payload: t31.payload, resources: Object.freeze(t31.resources.map((e30) => Object.freeze({ referenceId: e30.referenceId, resourceName: e30.resourceName, payload: e30.payload }))), get disposed() {
      return n39;
    }, dispose: () => {
      n39 || (n39 = true, t31.dispose());
    } });
  }
  #Z() {
    let e29 = /* @__PURE__ */ new Map(), t31 = (t32, n39, r34) => {
      let i36 = e29.get(t32);
      i36 === void 0 && (i36 = { binding: n39, instanceIds: [] }, e29.set(t32, i36)), r34 !== void 0 && i36.instanceIds.push(r34);
    };
    for (let e30 of this.#l) {
      if (e30.removed) continue;
      let n39 = e30.desired.transform.handle;
      t31(n39, this.#e._resolveOpaqueBinding(`transform`, e30.desired.transform.handle), e30.paragraphId);
      for (let n40 of e30.desired.flowTransforms) {
        let e31 = n40.handle;
        t31(e31, this.#e._resolveOpaqueBinding(`transform`, n40.handle));
      }
    }
    return [...e29].map(([e30, { binding: t32, instanceIds: n39 }]) => Object.freeze({ transformIndex: e30, ...n39.length === 0 ? {} : { instanceIds: Object.freeze(n39) }, binding: t32 }));
  }
  #Q(e29) {
    let t31 = [...this.#u].filter((e30) => e30.published).map((e30) => ({ opcode: `remove`, paragraphId: e30.paragraphId }));
    if (!e29.published) for (let e30 of this.#l) e30.removed || t31.push({ opcode: `upsert`, paragraphId: e30.paragraphId, order: e30.metrics.order });
    return t31;
  }
  #$() {
    return [...this.#l].filter((e29) => !e29.removed && e29.orderDirty).map((e29) => ({ paragraphId: e29.paragraphId, orderScope: e29.orderScope, orderRank: e29.orderRank }));
  }
  #ee() {
    if (!this.#f || this.#p <= 1) return;
    let e29 = /* @__PURE__ */ new Set();
    for (let t31 of this.#l) {
      if (t31.removed) continue;
      let n39 = t31.metrics.order;
      if (e29.has(n39)) throw RangeError(`retained text order ${String(n39)} is already in use`);
      e29.add(n39);
    }
  }
  #te(e29) {
    this.#O !== this.#D && this.#ne();
    let t31 = this.#d.get(e29);
    t31 !== e29.desired && (U3(e29.desired), this.#d.set(e29, e29.desired), t31 !== void 0 && W3(t31)), this.#O = this.#D;
    for (let e30 of [...this.#u]) e30.committed !== void 0 || this.#d.has(e30) || (this.#u.delete(e30), this.#l.delete(e30));
  }
  #ne() {
    let e29;
    for (let t31 of this.#d.values()) try {
      W3(t31);
    } catch (t32) {
      e29 ??= t32;
    }
    if (this.#d.clear(), this.#O = -1, e29 !== void 0) throw e29;
  }
  #re({ publication: e29, checkpointGeneration: t31 }) {
    this.#C = e29.revision, this.#w = e29.publicationGeneration, this.#E = t31;
  }
  #ie() {
    this.#se(), this.#e._assertEngineMutationAllowed();
  }
  #ae(e29) {
    if (this.#ie(), e29.disposed) throw Error(`text engine text has been disposed`);
  }
  #oe() {
    return this.#v !== 0 || this.#u.size !== 0 || this.#T !== this.#E;
  }
  #se() {
    if (this.#k) throw new w11();
  }
};
var D10 = class {
  #e;
  #t;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#t.disposed;
  }
  update(e29) {
    this.#e._updateText(this.#t, e29);
  }
  updateOrder(e29, t31, n39) {
    this.#e._updateTextOrder(this.#t, e29, t31, n39);
  }
  measure() {
    return this.#e._layoutText(this.#t);
  }
  measureInk() {
    return this.#e._layoutTextInk(this.#t);
  }
  glyphs() {
    return this.#e._inspectText(this.#t);
  }
  withGlyphs(e29) {
    return this.#e._withGlyphs(this.#t, e29);
  }
  copyGlyphs(e29, t31) {
    return this.#e._copyGlyphs(this.#t, e29, t31);
  }
  copyDecorations(e29) {
    return this.#e._copyDecorations(this.#t, e29);
  }
  dispose() {
    this.#e._disposeText(this.#t);
  }
};
var O9 = class {
  publication;
  reader;
  #e = true;
  constructor(e29, t31) {
    this.publication = e29;
    let n39 = new r27().bind(e29);
    this.reader = new ce2(`borrowed`, n39, () => this.assertActive()), this.#t = t31;
  }
  #t;
  assertActive() {
    if (!this.#e || this.#t.isExpired(this.publication)) throw Error(`borrowed text render plan has expired`);
  }
  expire() {
    this.#e = false;
  }
};
var ce2 = class {
  delivery = `borrowed`;
  #e;
  #t;
  constructor(e29, t31, n39) {
    this.#e = t31, this.#t = n39;
  }
  table(e29) {
    return this.#t(), this.#e.table(e29);
  }
  record(e29, t31) {
    return this.#t(), this.#e.record(e29, t31);
  }
  u8(e29) {
    return this.#t(), this.#e.u8(e29);
  }
  u16(e29) {
    return this.#t(), this.#e.u16(e29);
  }
  u32(e29) {
    return this.#t(), this.#e.u32(e29);
  }
  f32(e29) {
    return this.#t(), this.#e.f32(e29);
  }
  bytes(e29, t31) {
    return this.#t(), this.#e.bytes(e29, t31);
  }
};
function k9(t31) {
  if (t31 !== void 0 && !Q2(t31)) throw TypeError(`publish options must be an object`);
  let n39 = t31?.semanticViews ?? `none`, r34 = e5.engine.semanticViewMasks, i36 = n39 === `none` ? 0 : n39 === `measurement` ? r34.measurement : n39 === `layout-inspection` ? r34.layoutInspection : n39 === `all` ? r34.measurement | r34.layoutInspection : -1;
  if (i36 < 0) throw TypeError(`semanticViews is not supported`);
  return { semanticViewMask: i36 };
}
function A8(e29, t31) {
  if (!Q2(t31)) throw TypeError(`text engine text options must be an object`);
  de2(t31);
  let r34 = le(t31.text);
  j7(t31.inlineObjects, r34.text.length);
  let i36 = t31.style ?? {}, a34 = t31.layout ?? {}, o34 = t31.constraints ?? {};
  o24(i36, `text style`), s24(i36, 0, r34.text.length, `text style`), c21(a34, `text layout`), l17(o34, `text constraints`), e21(a34, o34);
  let c30 = e29._retainFontStackBinding(t31.font), p28 = [c30];
  try {
    o27(i36, c30.formats, `text engine text style`);
    let a35 = t31.material === void 0 ? void 0 : e29._retainOpaqueBinding(t31.material, `material`);
    a35 !== void 0 && p28.push(a35);
    let o35 = t31.transform === void 0, s33 = t31.transform ?? e29.createTransformBinding(), l29 = e29._retainOpaqueBinding(s33, `transform`);
    p28.push(l29), o35 && s33.dispose();
    let u28 = r34.spans.map((t32) => {
      t32.style !== void 0 && (o24(t32.style, `text span style [${t32.start}, ${t32.end})`), s24(t32.style, t32.start, t32.end, `text span style [${t32.start}, ${t32.end})`));
      let r35 = t32.font === void 0 ? void 0 : e29._retainFontStackBinding(t32.font);
      r35 !== void 0 && p28.push(r35), t32.style !== void 0 && o27(t32.style, r35?.formats ?? c30.formats, `text engine span [${t32.start}, ${t32.end}) style`);
      let i37 = t32.material === void 0 ? void 0 : e29._retainOpaqueBinding(t32.material, `material`);
      return i37 !== void 0 && p28.push(i37), Object.freeze({ start: t32.start, end: t32.end, font: r35, material: i37, style: t32.style });
    }), m24 = [];
    for (let n39 of t31.flow?.regions ?? []) {
      let t32 = e29._retainOpaqueBinding(n39.region.transform, `transform`);
      p28.push(t32), m24.push(t32);
    }
    let h24 = [], g23 = [];
    for (let n39 of t31.inlineObjects ?? []) {
      let t32 = e29._retainOpaqueBinding(n39.material, `material`);
      p28.push(t32), h24.push(t32);
      let r35 = e29._retainOpaqueBinding(n39.resource, `resource`);
      p28.push(r35), g23.push(r35);
    }
    return be2({ source: ue2(t31, r34, c30, a35, l29, u28, m24, h24, g23), text: r34.text, spans: Object.freeze(u28), font: c30, material: a35, transform: l29, flowTransforms: Object.freeze(m24), inlineMaterials: Object.freeze(h24), inlineResources: Object.freeze(g23) });
  } catch (e30) {
    for (let e31 of p28.reverse()) e31.dispose();
    throw e30;
  }
}
function j7(e29, t31) {
  let n39 = -1;
  for (let [r34, i36] of (e29 ?? []).entries()) {
    if (!Number.isSafeInteger(i36.textOffset)) throw TypeError(`text inline object ${r34} offset must be a safe integer`);
    if (i36.textOffset < 0 || i36.textOffset > t31) throw RangeError(`text inline object ${r34} offset is outside the text`);
    if (i36.textOffset <= n39) throw RangeError(`text inline object offsets must be strictly increasing`);
    n39 = i36.textOffset;
  }
}
function le(e29) {
  if (typeof e29 == `string`) return Object.freeze({ text: e29, spans: Object.freeze([]) });
  if (!Q2(e29) || typeof e29.text != `string` || !Array.isArray(e29.spans)) throw TypeError(`text must be a string or formatted text value`);
  let t31 = e29.text, n39 = e29.spans.map((e30, n40) => {
    if (!Q2(e30)) throw TypeError(`text span ${n40} must be an object`);
    if (!Number.isSafeInteger(e30.start) || !Number.isSafeInteger(e30.end)) throw TypeError(`text span ${n40} bounds must be safe integers`);
    if (e30.start < 0 || e30.end < e30.start || e30.end > t31.length) throw RangeError(`text span ${n40} is outside the text`);
    return Object.freeze({ start: e30.start, end: e30.end, ...e30.font === void 0 ? {} : { font: e30.font }, ...e30.material === void 0 ? {} : { material: e30.material }, ...e30.style === void 0 ? {} : { style: Z2(e30.style, `text span ${n40} style`) } });
  });
  return Object.freeze({ text: t31, spans: Object.freeze(i24(t31, n39)) });
}
function ue2(e29, t31, n39, r34, i36, a34, o34, s33, c30) {
  let l29 = Object.freeze({ text: t31.text, spans: Object.freeze(a34.map((e30) => Object.freeze({ start: e30.start, end: e30.end, ...e30.font === void 0 ? {} : { font: e30.font.binding }, ...e30.material === void 0 ? {} : { material: e30.material.binding }, ...e30.style === void 0 ? {} : { style: e30.style } }))) });
  return Object.freeze({ font: n39.binding, text: l29, ...r34 === void 0 ? {} : { material: r34.binding }, transform: i36.binding, ...e29.order === void 0 ? {} : { order: e29.order }, ...e29.rasterPixelRatio === void 0 ? {} : { rasterPixelRatio: e29.rasterPixelRatio }, ...e29.style === void 0 ? {} : { style: t24(void 0, e29.style, `text style`) }, ...e29.layout === void 0 ? {} : { layout: t24(void 0, e29.layout, `text layout`) }, ...e29.constraints === void 0 ? {} : { constraints: t24(void 0, e29.constraints, `text constraints`) }, ...e29.flow === void 0 ? {} : { flow: Object.freeze({ regions: Object.freeze(e29.flow.regions.map((e30, t32) => {
    let { transform: n40, ...r35 } = e30.region;
    return Object.freeze({ region: Object.freeze({ ...Z2(r35, `text flow region ${t32}`), transform: o34[t32].binding }), ...e30.exclusions === void 0 ? {} : { exclusions: Object.freeze(Z2(e30.exclusions, `text flow region ${t32} exclusions`)) } });
  })) }) }, ...e29.inlineObjects === void 0 ? {} : { inlineObjects: Object.freeze(e29.inlineObjects.map((e30, t32) => {
    let { material: n40, resource: r35, ...i37 } = e30;
    return Object.freeze({ ...Z2(i37, `text inline object ${t32}`), material: s33[t32].binding, resource: c30[t32].binding });
  })) } });
}
function de2(e29) {
  if (e29.order !== void 0 && X2(e29.order, `text order`), e29.rasterPixelRatio !== void 0 && (!Number.isFinite(e29.rasterPixelRatio) || e29.rasterPixelRatio <= 0)) throw RangeError(`text rasterPixelRatio must be positive and finite`);
}
function fe2(e29, t31, n39) {
  let r34 = { ...e29, order: t31, ...n39 };
  return Object.freeze({ font: r34.font, text: r34.text, ...r34.material === void 0 ? {} : { material: r34.material }, ...r34.transform === void 0 ? {} : { transform: r34.transform }, ...r34.order === void 0 ? {} : { order: r34.order }, ...r34.rasterPixelRatio === void 0 ? {} : { rasterPixelRatio: r34.rasterPixelRatio }, ...r34.style === void 0 ? {} : { style: r34.style }, ...r34.layout === void 0 ? {} : { layout: r34.layout }, ...r34.constraints === void 0 ? {} : { constraints: r34.constraints }, ...r34.flow === void 0 ? {} : { flow: r34.flow }, ...r34.inlineObjects === void 0 ? {} : { inlineObjects: r34.inlineObjects } });
}
function pe2(e29, t31) {
  let n39 = Reflect.ownKeys(e29);
  if (n39.length === 1 && n39[0] === `text` && typeof e29.text == `string` && t31.spans.length === 0) return j7(t31.source.inlineObjects, e29.text.length), s24(t31.source.style ?? {}, 0, e29.text.length, `text style`), e29.text;
}
function me2(e29, t31, n39) {
  return Object.hasOwn(e29, `font`) || Object.hasOwn(e29, `material`) || Object.hasOwn(e29, `rasterPixelRatio`) || Object.hasOwn(e29, `style`) || Object.hasOwn(e29, `text`) && (t31.spans.length !== 0 || n39.spans.length !== 0);
}
function he2(e29) {
  return Object.hasOwn(e29, `transform`) || Object.hasOwn(e29, `layout`) || Object.hasOwn(e29, `constraints`) || Object.hasOwn(e29, `flow`) || Object.hasOwn(e29, `inlineObjects`);
}
function ge2(e29, t31, n39) {
  return xe2({ ...e29, source: Object.freeze({ ...e29.source, text: t31, order: n39 }), text: t31 }, e29);
}
function M7(e29, t31) {
  let n39 = t31.desired, r34 = n39.source;
  return [{ opcode: `upsert`, paragraphId: t31.paragraphId, styleId: n28(e29.id, t31.paragraphId, 1), cascadeOrder: 0, start: 0, end: n39.text.length, root: true, value: a27(r34.style ?? {}, 0, n39.text.length, { fontStackHandle: n39.font.handle, fontSize: r34.style?.fontSize ?? 16, rasterPixelRatio: r34.rasterPixelRatio ?? 1, ...n39.material === void 0 ? {} : { materialId: n39.material.handle } }) }, ...n39.spans.filter((e30) => e30.start !== e30.end).map((n40, r35) => ({ opcode: `upsert`, paragraphId: t31.paragraphId, styleId: n28(e29.id, t31.paragraphId, r35 + 2), cascadeOrder: r35 + 1, start: n40.start, end: n40.end, value: a27(n40.style ?? {}, n40.start, n40.end, { ...n40.font === void 0 ? {} : { fontStackHandle: n40.font.handle }, ...n40.material === void 0 ? {} : { materialId: n40.material.handle } }) }))];
}
function _e2(e29) {
  return e29.metrics.styleCount;
}
function N7(e29, t31) {
  let n39 = 1;
  for (let t32 of e29.spans) n39 += Number(t32.start !== t32.end);
  let r34 = e29.source.flow;
  return { order: e29.source.order ?? t31 - 1, styleCount: n39, regionCount: r34?.regions.length ?? e29.source.layout?.columns?.count ?? 1, exclusionCount: r34?.regions.reduce((e30, t32) => e30 + (t32.exclusions?.length ?? 0), 0) ?? 0, inlineObjectCount: e29.source.inlineObjects?.length ?? 0 };
}
function P7(e29) {
  return e29.styleDirty ? e29.metrics.styleCount + Math.max(0, e29.publishedStyleCount - e29.metrics.styleCount) : 0;
}
function F7(e29, t31, n39, i36) {
  let a34 = t31.geometryRevision + 1, o34 = t19(e29.id, t31.paragraphId, t31.desired.transform.handle, a34, t31.desired.source.layout, t31.desired.source.constraints, n39), s33 = t31.desired.source.flow;
  if (s33 === void 0) return { ...o34, exclusions: [] };
  let c30 = [], l29 = [];
  for (let [n40, r34] of s33.regions.entries()) {
    let o35 = t31.desired.flowTransforms[n40], s34 = i36 + l29.length, { key: u28, ...d24 } = r34.region, f26 = e29.id(`region`, z3(t31.paragraphId, `region`, u28)), p28 = t31.committedFlowRegions.get(u28), m24 = p28 !== void 0 && p28.transformHandle === o35.handle && ve2(p28.input, r34.region) ? p28.revision : a34;
    c30.push({ ...d24, id: f26, geometryRevision: m24, transformIndex: o35.handle, exclusionStart: s34, exclusionCount: r34.exclusions?.length ?? 0 });
    for (let n41 of r34.exclusions ?? []) {
      let { key: r35, ...i37 } = n41, o36 = B3(u28, r35), s35 = t31.committedFlowExclusions.get(o36);
      l29.push({ ...i37, id: e29.id(`exclusion`, z3(t31.paragraphId, `exclusion`, u28, r35)), regionId: f26, geometryRevision: s35 !== void 0 && ye2(s35.input, n41) ? s35.revision : a34 });
    }
  }
  return { constraint: { ...o34.constraint, regionStart: n39, regionCount: c30.length }, regions: c30, exclusions: l29 };
}
function I5(e29, t31, n39) {
  let r34 = e29.pendingFlowRegions, i36 = e29.pendingFlowExclusions;
  if (r34.clear(), i36.clear(), e29.desired.source.flow === void 0) return;
  let a34 = 0;
  for (let [o34, s33] of e29.desired.source.flow.regions.entries()) {
    let c30 = t31[o34];
    if (c30 === void 0) throw Error(`compiled flow region count does not match the retained source`);
    let l29 = e29.desired.flowTransforms[o34].handle;
    r34.set(s33.region.key, { input: s33.region, transformHandle: l29, revision: c30.geometryRevision });
    for (let e30 of s33.exclusions ?? []) {
      let t32 = B3(s33.region.key, e30.key), r35 = n39[a34];
      if (r35 === void 0) throw Error(`compiled flow exclusion count does not match the retained source`);
      i36.set(t32, { input: e30, revision: r35.geometryRevision }), a34 += 1;
    }
  }
  if (t31.length !== r34.size || n39.length !== a34) throw Error(`compiled flow geometry does not match the retained source`);
}
function L4(e29) {
  let t31 = e29.pendingFlowRegions, n39 = e29.pendingFlowExclusions;
  [e29.committedFlowRegions, e29.pendingFlowRegions] = [t31, e29.committedFlowRegions], [e29.committedFlowExclusions, e29.pendingFlowExclusions] = [n39, e29.committedFlowExclusions];
}
function ve2(e29, t31) {
  return e29.shape === t31.shape && e29.writingMode === t31.writingMode && e29.textOrientation === t31.textOrientation && Object.is(e29.inlineStart, t31.inlineStart) && Object.is(e29.blockStart, t31.blockStart) && Object.is(e29.inlineEnd, t31.inlineEnd) && Object.is(e29.blockEnd, t31.blockEnd) && Object.is(e29.clipInlineStart, t31.clipInlineStart) && Object.is(e29.clipBlockStart, t31.clipBlockStart) && Object.is(e29.clipInlineEnd, t31.clipInlineEnd) && Object.is(e29.clipBlockEnd, t31.clipBlockEnd) && R4(e29.vertices, t31.vertices);
}
function ye2(e29, t31) {
  return e29.shape === t31.shape && e29.wrapSide === t31.wrapSide && Object.is(e29.inlineStart, t31.inlineStart) && Object.is(e29.blockStart, t31.blockStart) && Object.is(e29.inlineEnd, t31.inlineEnd) && Object.is(e29.blockEnd, t31.blockEnd) && Object.is(e29.marginInline, t31.marginInline) && Object.is(e29.marginBlock, t31.marginBlock) && R4(e29.vertices, t31.vertices);
}
function R4(e29, t31) {
  return e29 === t31 ? true : e29 === void 0 || t31 === void 0 || e29.length !== t31.length ? false : e29.every((e30, n39) => Object.is(e30.inline, t31[n39].inline) && Object.is(e30.block, t31[n39].block));
}
function z3(e29, t31, n39, r34) {
  let i36 = `${n39.length}:${n39}`;
  return r34 === void 0 ? `paragraph/${e29}/flow/${t31}/${i36}` : `paragraph/${e29}/flow/${t31}/${i36}/${r34.length}:${r34}`;
}
function B3(e29, t31) {
  return `${e29.length}:${e29}/${t31.length}:${t31}`;
}
function V3(e29, t31) {
  return (t31.desired.source.inlineObjects ?? []).map((n39, r34) => ({ ...n39, paragraphId: t31.paragraphId, id: e29.id(`inline-object`, `paragraph/${t31.paragraphId}/inline/${r34}`), contentRevision: t31.geometryRevision + 1, materialId: t31.desired.inlineMaterials[r34].handle, resourceId: t31.desired.inlineResources[r34].handle, resourceGeneration: 1 }));
}
var H3 = /* @__PURE__ */ new WeakMap();
function be2(e29) {
  return H3.set(e29, { references: 1, ownership: { references: 1, leases: Se2(e29) } }), e29;
}
function xe2(e29, t31) {
  let n39 = H3.get(t31).ownership;
  return n39.references += 1, H3.set(e29, { references: 1, ownership: n39 }), e29;
}
function U3(e29) {
  let t31 = H3.get(e29);
  t31.references += 1, t31.ownership.references += 1;
}
function W3(e29) {
  let t31 = H3.get(e29);
  if (--t31.references, --t31.ownership.references, t31.references === 0 && H3.delete(e29), t31.ownership.references !== 0) return;
  let n39;
  for (let e30 of [...t31.ownership.leases].reverse()) try {
    e30.dispose();
  } catch (e31) {
    n39 ??= e31;
  }
  if (n39 !== void 0) throw n39;
}
function Se2(e29) {
  return [e29.font, ...e29.material === void 0 ? [] : [e29.material], e29.transform, ...e29.flowTransforms, ...e29.inlineMaterials, ...e29.inlineResources, ...e29.spans.flatMap((e30) => [...e30.font === void 0 ? [] : [e30.font], ...e30.material === void 0 ? [] : [e30.material]])];
}
function Ce2(e29) {
  if (!Q2(e29)) throw TypeError(`render planner options must be an object`);
  if (typeof e29.target != `function`) throw TypeError(`render planner target must be a factory`);
  G3(e29);
}
function we2(e29) {
  if (!Q2(e29)) throw TypeError(`measurement plan options must be an object`);
  G3(e29);
}
function G3(e29) {
  Y2(e29.requestCapacity, `requestCapacity`), Y2(e29.resultCapacity, `resultCapacity`), Y2(e29.textCapacity, `textCapacity`), K3(e29.limits);
}
function K3(t31) {
  if (!Q2(t31)) throw TypeError(`text engine limits must be an object`);
  let n39 = Object.freeze({ maxParagraphs: t31.maxParagraphs, maxClusters: t31.maxClusters, maxLines: t31.maxLines, maxRegions: t31.maxRegions, maxExclusions: t31.maxExclusions, maxInlineObjects: t31.maxInlineObjects, maxSlotsPerBand: t31.maxSlotsPerBand, maxOutputBytes: t31.maxOutputBytes });
  for (let [e29, t32] of Object.entries(n39)) Y2(t32, e29);
  if (n39.maxOutputBytes < e5.layouts.engineResult.size) throw RangeError(`maxOutputBytes cannot hold a text engine result header`);
  if (n39.maxOutputBytes > 67108864) throw RangeError(`maxOutputBytes exceeds the text engine limit`);
  return n39;
}
function Te2(e29) {
  if (!Q2(e29)) throw TypeError(`plan target factory must return an object`);
  if (e29.delivery !== `borrowed`) throw TypeError(`plan target delivery must be borrowed`);
  if (typeof e29.accept != `function` || typeof e29.dispose != `function`) throw TypeError(`plan target must implement accept() and dispose()`);
}
var Ee2 = class {
  #e;
  #t = true;
  constructor(e29) {
    this.#e = e29;
  }
  requestCheckpoint() {
    if (!this.#t) throw new w11();
    this.#e();
  }
  dispose() {
    this.#t = false;
  }
};
function q3(e29) {
  if (!Q2(e29) || typeof e29.accepted != `boolean`) throw TypeError(`plan target returned an invalid acceptance`);
  if (e29.accepted) return Object.freeze({ accepted: true });
  if (!(`error` in e29)) throw TypeError(`rejected plan acceptance must carry an error`);
  return Object.freeze({ accepted: false, error: e29.error });
}
function De2(e29) {
  if (e29 >= S12) throw RangeError(`text handles are exhausted`);
  return e29 + 1;
}
function Oe2(e29) {
  if (e29 >= S12) throw RangeError(`plan target checkpoint generation is exhausted`);
  return e29 + 1;
}
function ke2(t31) {
  return (t31.flags & e5.engine.resultFlags.checkpoint) !== 0;
}
function J3(e29) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 >= 2 ** 53 - 1) throw RangeError(`retained text structure revision is exhausted`);
  return e29 + 1;
}
function Y2(e29, t31) {
  if (!Number.isSafeInteger(e29) || Number(e29) <= 0 || Number(e29) > S12) throw RangeError(`${t31} must be a positive u32`);
}
function X2(e29, t31) {
  if (!Number.isSafeInteger(e29) || Number(e29) < 0 || Number(e29) > S12) throw RangeError(`${t31} must be a u32`);
}
function Z2(e29, t31) {
  try {
    return structuredClone(e29);
  } catch (e30) {
    throw TypeError(`${t31} must contain cloneable data`, { cause: e30 });
  }
}
function Ae2(e29, t31, n39) {
  return AggregateError([e29, t31], n39, { cause: e29 });
}
function Q2(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}
function $2(e29) {
  return e29 !== null && (typeof e29 == `object` || typeof e29 == `function`) && typeof e29.then == `function`;
}

// node_modules/@pmndrs/glyph/dist/internal/handle-state.js
var p21 = 4294967295;
var m18 = Object.freeze({ paragraphId: 0, styleId: 0 });
var h18 = /* @__PURE__ */ new WeakMap();
function g18(e29) {
  let t31 = h18.get(e29);
  return t31 === void 0 && (t31 = { codecs: /* @__PURE__ */ new Map(), fontBindings: /* @__PURE__ */ new Map(), fontStacks: /* @__PURE__ */ new Map(), planners: /* @__PURE__ */ new Map() }, h18.set(e29, t31)), t31;
}
function _15(e29, t31, n39 = 0, r34 = 0, i36 = m18) {
  let a34 = new i17(e29, t31);
  return a34.message += (i36.paragraphId === 0 ? `` : ` (paragraph ${i36.paragraphId}`) + (i36.paragraphId === 0 ? `` : i36.styleId === 0 ? `)` : `, style ${i36.styleId})`) + (n39 === 0 && r34 === 0 ? `` : ` (required request=${n39}, result=${r34})`), s19(a34, { requiredRequestCapacity: n39, requiredResultCapacity: r34, fault: i36 }), a34;
}
function v17(t31) {
  let n39 = e5.layouts.engineResult, r34 = t31.getUint32(n39.faultParagraphId, true), i36 = t31.getUint32(n39.faultStyleId, true);
  return r34 === 0 && i36 === 0 ? m18 : Object.freeze({ paragraphId: r34, styleId: i36 });
}
var y16 = /* @__PURE__ */ new WeakMap();
var b13 = /* @__PURE__ */ new WeakMap();
var x13 = /* @__PURE__ */ new WeakMap();
var S13 = class {
  integration;
  #e;
  #t = new r4();
  #n = new r5();
  #r;
  #i;
  #a = /* @__PURE__ */ new Set();
  #o = /* @__PURE__ */ new Set();
  #s = /* @__PURE__ */ new Set();
  #c = /* @__PURE__ */ new Map();
  #l = /* @__PURE__ */ new Set();
  #u = /* @__PURE__ */ new Set();
  #d = /* @__PURE__ */ new WeakMap();
  #f = /* @__PURE__ */ new Set();
  #p = /* @__PURE__ */ new WeakMap();
  #m = /* @__PURE__ */ new Set();
  #h = /* @__PURE__ */ new Map();
  #g = /* @__PURE__ */ new Set();
  #_ = { material: /* @__PURE__ */ new Map(), resource: /* @__PURE__ */ new Map(), transform: /* @__PURE__ */ new Map() };
  #v;
  #y;
  #b;
  #x;
  #S = 1;
  #C = 1;
  #w = 1;
  #T = 1;
  #E = 1;
  #D = 1;
  #O = [];
  #k = 1;
  #A = false;
  constructor(e29, t31 = { integration: `internal` }, n39, r34, i36, a34, o34) {
    if (typeof t31 != `object` || !t31 || Array.isArray(t31)) throw TypeError(`Glyph handle state options must be an object`);
    if (typeof t31.integration != `string` || t31.integration.length === 0) throw TypeError(`Glyph handle state integration must be a nonempty string`);
    this.integration = t31.integration, this.#e = o34 ?? t31.integration, this.#r = i25(e29), this.#i = g18(this.#r), this.#v = n39, this.#y = r34, this.#b = i36, this.#x = a34;
  }
  id = i5(this.#n, () => this.#q());
  installCodec(e29) {
    if (this.#q(), typeof e29 != `function`) throw TypeError(`text engine codec must be a factory`);
    let t31 = D11(e29(this.#t)), n39 = d2(t31), r34 = this.#S, i36 = this.id(`codec`, `${this.#e}/codec/${r34}`);
    this.registerCodec(i36, n39), this.#S = r34 + 1;
    let o34 = { handle: i36, descriptor: t31, techniqueIds: new Set(t31.programs.map((e30) => e30.techniqueId)), leases: 1, disposed: false };
    this.#u.add(o34);
    let s33 = new C13(this, o34);
    return y16.set(s33, { handleState: this, state: o34 }), s33;
  }
  bindFont(e29) {
    return this.#j(e29);
  }
  #j(e29) {
    if (this.#q(), this.#y === void 0) throw Error(`Glyph handle state was not created by a glyph engine`);
    let t31 = this.#y(e29);
    try {
      let n39 = this.#t.technique(e29.raster);
      if (![...this.#u].some((e30) => !e30.disposed && e30.techniqueIds.has(n39))) throw TypeError(`Glyph handle state has no installed codec for "${e29.raster.id}"`);
      let r34 = this.#d.get(t31.identity);
      if (r34 !== void 0 && !r34.disposed) return t31.dispose(), r34.leases += 1, new w12(this, r34, e29.raster);
      let i36 = S10(e29, this.#t);
      if (i36 === void 0) throw TypeError(`no portable raster codec is registered for "${e29.raster.id}"`);
      let a34 = this.#C, o34 = this.id(`font-binding`, `${this.#e}/font/${a34}`), s33 = this.#N(e29.raster, i36);
      try {
        this.registerFontBinding(o34, t31.handle, i36.binding);
      } catch (e30) {
        throw this.#F(s33), e30;
      }
      this.#C = a34 + 1;
      let l29 = { identity: t31.identity, raster: e29.raster, handle: o34, engineBinding: t31, payloads: s33, leases: 1, disposed: false };
      return this.#d.set(t31.identity, l29), this.#f.add(l29), new w12(this, l29, e29.raster);
    } catch (e30) {
      throw t31.dispose(), e30;
    }
  }
  bindFontStack(e29) {
    this.#q();
    let t31 = a(e29);
    for (let e30 of t31) {
      let t32 = this.#t.technique(e30.raster);
      if (![...this.#u].some((e31) => !e31.disposed && e31.techniqueIds.has(t32))) throw TypeError(`Glyph handle state has no installed codec for "${e30.raster.id}"`);
    }
    let n39 = this.#p.get(e29);
    if (n39 !== void 0 && !n39.disposed) {
      n39.leases += 1;
      let e30 = new T11(this, n39);
      return b13.set(e30, { handleState: this, state: n39 }), e30;
    }
    let r34 = [];
    try {
      for (let e30 of t31) r34.push(this.#j(e30));
      let n40 = this.#w, i36 = this.id(`font-stack`, `${this.#e}/font-stack/${n40}`);
      this.registerFontStack(i36, r34.map((e30) => e30._state().handle)), this.#w = n40 + 1;
      let a34 = { identity: e29, handle: i36, bindings: Object.freeze(r34), leases: 1, disposed: false };
      this.#p.set(e29, a34), this.#m.add(a34);
      let o34 = new T11(this, a34);
      return b13.set(o34, { handleState: this, state: a34 }), o34;
    } catch (e30) {
      for (let e31 of r34.reverse()) e31.dispose();
      throw e30;
    }
  }
  _disposeInstalledCodec(e29) {
    if (!e29.disposed) {
      if (e29.leases <= 0) throw Error(`codec lease underflow`);
      --e29.leases, e29.leases === 0 && this.#R(e29);
    }
  }
  _retainInstalledCodec(e29) {
    this.#q();
    let t31 = y16.get(e29);
    if (t31 === void 0 || t31.handleState !== this || t31.state.disposed || e29.disposed) throw TypeError(`codec must be a live codec installed by this Glyph handle state`);
    t31.state.leases += 1;
    let n39 = false;
    return Object.freeze({ handle: t31.state.handle, descriptor: t31.state.descriptor, dispose: () => {
      n39 || (n39 = true, this._disposeInstalledCodec(t31.state));
    } });
  }
  _retainFontStackBinding(e29) {
    this.#q();
    let t31 = b13.get(e29);
    if (t31 === void 0 || t31.handleState !== this || t31.state.disposed || e29.disposed) throw TypeError(`font stack binding must be live and owned by this Glyph handle state`);
    t31.state.leases += 1;
    let n39 = new T11(this, t31.state);
    return b13.set(n39, { handleState: this, state: t31.state }), Object.freeze({ handle: t31.state.handle, binding: n39, formats: Object.freeze(t31.state.bindings.map((e30) => e30.raster)), dispose: () => n39.dispose() });
  }
  createMaterialBinding() {
    return this.#z(`material`);
  }
  createResourceBinding() {
    return this.#z(`resource`);
  }
  createTransformBinding() {
    return this.#z(`transform`);
  }
  _retainOpaqueBinding(e29, t31) {
    this.#q();
    let n39 = x13.get(e29);
    if (n39 === void 0 || n39.handleState !== this || n39.state.kind !== t31 || n39.state.disposed || e29.disposed) throw TypeError(`${t31} binding must be live and owned by this Glyph handle state`);
    n39.state.leases += 1;
    let r34 = new E11(this, n39.state);
    return x13.set(r34, { handleState: this, state: n39.state }), Object.freeze({ handle: n39.state.handle, binding: r34, dispose: () => r34.dispose() });
  }
  _acquirePortablePayload(e29) {
    if (this.#A) throw Error(`Glyph handle state is disposed`);
    j8(e29, `portable payload reference`);
    let t31 = this.#h.get(e29);
    if (t31 === void 0 || t31.owners === 0 || t31.group === void 0) throw Error(`text render plan references unknown portable payload ${e29}`);
    let n39 = t31.group;
    for (let e30 of n39) e30.leases += 1;
    let r34 = false;
    return Object.freeze({ techniqueId: t31.techniqueId, resourceName: t31.resourceName, payload: t31.payload, resources: Object.freeze(n39.map((e30) => Object.freeze({ referenceId: e30.referenceId, resourceName: e30.resourceName, payload: e30.payload }))), dispose: () => {
      if (!r34) {
        r34 = true;
        for (let e30 of n39) this.#I(e30);
      }
    } });
  }
  _resolveOpaqueBinding(e29, t31) {
    if (this.#A) throw Error(`Glyph handle state is disposed`);
    let n39 = this.#_[e29].get(t31);
    if (n39 !== void 0 && !n39.disposed && n39.binding !== void 0) return n39.binding;
    throw Error(`text render plan references unknown ${e29} binding ${t31}`);
  }
  _disposeRetainedFontBinding(e29) {
    if (!e29.disposed) {
      if (e29.leases <= 0) throw Error(`handle font binding lease underflow`);
      if (e29.leases > 1) {
        --e29.leases;
        return;
      }
      this.#M(e29);
    }
  }
  _disposeRetainedFontStack(e29) {
    if (!e29.disposed) {
      if (e29.leases <= 0) throw Error(`handle font stack lease underflow`);
      if (e29.leases > 1) {
        --e29.leases;
        return;
      }
      this.#H(e29);
    }
  }
  registerFontBinding(e29, t31, n39) {
    this.#q(), e29 = a5(e29, `font-binding`, `font binding handle`), j8(t31, `shaping font handle`);
    let i36 = this.#n.retain(e29, `font-binding`, `font binding handle`), a34 = false;
    try {
      a34 = this.#U(this.#i.fontBindings, e29, `font binding`), this.#K(n39, (n40, r34) => k10(this.#r.registerFontBinding(e29, t31, n40, r34), `register font binding`)), this.#l.add(e29);
    } catch (t32) {
      throw this.#W(this.#i.fontBindings, e29, a34), i36 && this.#n.release(e29, `font-binding`), t32;
    }
  }
  disposeFontBinding(e29) {
    if (this.#q(), a5(e29, `font-binding`, `font binding handle`), !this.#l.has(e29)) throw Error(`font binding ${e29} is not owned by this Glyph handle state`);
    for (let [t31, n39] of this.#c) if (n39.includes(e29)) throw Error(`font binding ${e29} is still used by font stack ${t31}`);
    k10(this.#r.disposeFontBinding(e29), `dispose font binding`), this.#l.delete(e29), this.#G(this.#i.fontBindings, e29), this.#n.release(e29, `font-binding`);
  }
  registerFontStack(e29, t31) {
    if (this.#q(), e29 = a5(e29, `font-stack`, `font stack handle`), t31.length === 0) throw RangeError(`font stack must contain at least one font`);
    let n39 = new Uint8Array(M8(t31.length, 4, `font stack bytes`)), i36 = new DataView(n39.buffer);
    for (let [e30, n40] of t31.entries()) {
      let t32 = a5(n40, `font-binding`, `font binding handle`);
      if (!this.#l.has(t32)) throw Error(`font binding ${t32} is not owned by this Glyph handle state`);
      i36.setUint32(e30 * 4, t32, true);
    }
    let a34 = this.#n.retain(e29, `font-stack`, `font stack handle`), o34 = false;
    try {
      o34 = this.#U(this.#i.fontStacks, e29, `font stack`), this.#K(n39, (n40) => k10(this.#r.registerFontStack(e29, n40, t31.length), `register font stack`)), this.#c.set(e29, Object.freeze([...t31]));
    } catch (t32) {
      throw this.#W(this.#i.fontStacks, e29, o34), a34 && this.#n.release(e29, `font-stack`), t32;
    }
  }
  disposeFontStack(e29) {
    if (this.#q(), a5(e29, `font-stack`, `font stack handle`), !this.#c.has(e29)) throw Error(`font stack ${e29} is not owned by this Glyph handle state`);
    k10(this.#r.disposeFontStack(e29), `dispose font stack`), this.#c.delete(e29), this.#G(this.#i.fontStacks, e29), this.#n.release(e29, `font-stack`);
  }
  registerCodec(e29, t31) {
    this.#q(), e29 = a5(e29, `codec`, `codec handle`);
    let n39 = this.#n.retain(e29, `codec`, `codec handle`), i36 = false;
    try {
      i36 = this.#U(this.#i.codecs, e29, `render codec`), this.#K(t31, (t32, n40) => k10(this.#r.registerCodec(e29, t32, n40), `register render codec`)), this.#s.add(e29);
    } catch (t32) {
      throw this.#W(this.#i.codecs, e29, i36), n39 && this.#n.release(e29, `codec`), t32;
    }
  }
  disposeCodec(e29) {
    if (this.#q(), e29 = a5(e29, `codec`, `codec handle`), !this.#s.has(e29)) throw Error(`render codec ${e29} is not owned by this Glyph handle state`);
    k10(this.#r.disposeCodec(e29), `dispose render codec`), this.#s.delete(e29), this.#G(this.#i.codecs, e29), this.#n.release(e29, `codec`);
  }
  createRootPlanner(e29) {
    let t31 = ae2(this, e29);
    return this.#a.add(t31), t31;
  }
  _detachPlanner(e29) {
    this.#a.delete(e29);
  }
  _createPlanTransport(e29) {
    this.#q();
    let t31 = a5(e29.handle, `planner`, `planner handle`), n39 = A9(e29.requestCapacity, `request capacity`), i36 = A9(e29.resultCapacity, `result capacity`), a34 = A9(e29.textCapacity ?? 0, `text capacity`), o34 = this.#n.retain(t31, `planner`, `planner handle`), s33 = false;
    try {
      s33 = this.#U(this.#i.planners, t31, `render planner`), k10(this.#r.createRoot(t31, n39, i36, a34), `create render planner`);
      let e30 = new O10(this.#r, t31, n39, i36, a34, () => this.#b?.(), () => {
        this.#o.delete(e30), this.#G(this.#i.planners, t31), this.#n.release(t31, `planner`);
      });
      return this.#o.add(e30), e30;
    } catch (e30) {
      throw this.#W(this.#i.planners, t31, s33), o34 && this.#n.release(t31, `planner`), e30;
    }
  }
  _allocatePlannerHandle() {
    this.#q();
    let e29 = this.#k;
    if (!Number.isSafeInteger(e29) || e29 <= 0 || e29 > p21) throw RangeError(`planner handles are exhausted`);
    return this.#k = e29 + 1, this.id(`planner`, `${this.#e}/planner/${e29}`);
  }
  _enterBorrowedPlan() {
    return this.#q(), this.#x?.() ?? (() => {
    });
  }
  _assertEngineMutationAllowed() {
    this.#q();
  }
  dispose() {
    if (this.#A) return;
    this.#b?.();
    let e29, t31 = (t32) => {
      try {
        t32();
      } catch (t33) {
        e29 ??= t33;
      }
    };
    for (let e30 of [...this.#a]) t31(() => e30.dispose());
    for (let e30 of [...this.#o]) t31(() => e30.dispose());
    for (let e30 of [...this.#g]) t31(() => this.#V(e30));
    let n39 = new Set([...this.#m].map((e30) => e30.handle));
    for (let e30 of [...this.#m]) t31(() => this.#H(e30));
    for (let e30 of [...this.#c.keys()]) n39.has(e30) || t31(() => this.disposeFontStack(e30));
    let r34 = new Set([...this.#f].map((e30) => e30.handle));
    for (let e30 of [...this.#f]) t31(() => this.#M(e30));
    for (let e30 of [...this.#l]) r34.has(e30) || t31(() => this.disposeFontBinding(e30));
    let i36 = new Set([...this.#u].map((e30) => e30.handle));
    for (let e30 of [...this.#u]) t31(() => this.#R(e30));
    for (let e30 of [...this.#s]) i36.has(e30) || t31(() => this.disposeCodec(e30));
    if (this.#o.size !== 0 || this.#c.size !== 0 || this.#l.size !== 0 || this.#s.size !== 0 || this.#h.size !== 0) e29 ??= Error(`Glyph handle state disposal left live registrations or payload leases`);
    else try {
      this.#n.dispose();
    } catch (t32) {
      e29 ??= t32;
    } finally {
      this.#A = true, this.#v?.();
    }
    if (e29 !== void 0) throw e29;
  }
  #M(e29) {
    e29.disposed || (this.disposeFontBinding(e29.handle), e29.leases = 0, e29.disposed = true, this.#d.delete(e29.identity), this.#f.delete(e29), this.#F(e29.payloads), e29.engineBinding.dispose());
  }
  #N(e29, t31) {
    let n39 = /* @__PURE__ */ new Map();
    for (let [e30, r35] of t31.declaredResources) for (let t32 of r35) n39.set(t32, e30);
    let r34 = /* @__PURE__ */ new Map();
    try {
      for (let [i36, a34] of t31.resources) {
        let t32 = n39.get(i36);
        if (t32 === void 0) throw Error(`compiled font retained an unnamed resource "${i36}"`);
        let o34 = this.#t.resource(i36), s33 = this.#h.get(o34);
        s33 === void 0 && (s33 = { referenceId: o34, techniqueId: e29.id, resourceName: t32, payload: a34, group: void 0, owners: 0, leases: 0 }, this.#h.set(o34, s33)), s33.owners += 1, r34.set(o34, s33);
      }
      return this.#P(e29, t31, r34), r34;
    } catch (e30) {
      throw this.#F(r34), e30;
    }
  }
  #P(e29, t31, n39) {
    let r34 = l7(e29.id);
    if (r34 === void 0) throw Error(`portable raster codec "${e29.id}" is no longer registered`);
    let i36 = r34.schema.render.resource;
    if (i36 === void 0) throw Error(`portable raster codec "${e29.id}" has no render resource`);
    let a34 = [];
    for (let [e30, o34] of t31.declaredResources) {
      if (e30 === i36 || r34.schema.resources[e30]?.cardinality === `many`) continue;
      if (o34.length !== 1) throw Error(`singleton resource "${e30}" does not have exactly one payload`);
      let t32 = n39.get(this.#t.resource(o34[0]));
      if (t32 === void 0) throw Error(`compiled font does not own companion resource "${e30}"`);
      a34.push(t32);
    }
    for (let e30 of t31.declaredResources.get(i36) ?? []) {
      let t32 = n39.get(this.#t.resource(e30));
      if (t32 === void 0) throw Error(`compiled font does not own selected resource "${e30}"`);
      let r35 = Object.freeze([t32, ...a34]);
      t32.group ??= r35;
    }
  }
  #F(e29) {
    for (let t31 of e29.values()) {
      if (t31.owners <= 0) throw Error(`portable payload owner underflow`);
      --t31.owners, this.#L(t31);
    }
  }
  #I(e29) {
    if (e29.leases <= 0) throw Error(`portable payload lease underflow`);
    --e29.leases, this.#L(e29);
  }
  #L(e29) {
    e29.owners === 0 && e29.leases === 0 && this.#h.get(e29.referenceId) === e29 && this.#h.delete(e29.referenceId);
  }
  #R(e29) {
    e29.disposed || (this.disposeCodec(e29.handle), e29.leases = 0, e29.disposed = true, this.#u.delete(e29));
  }
  #z(e29) {
    this.#q();
    let t31 = e29 === `transform` ? this.#O.pop() : void 0, n39 = t31 ?? (e29 === `material` ? this.#T : e29 === `resource` ? this.#E : this.#D), r34 = t31 === void 0 ? N8(n39, `${e29} binding`) : void 0, i36 = e29 === `transform` ? n39 : this.id(e29, `${this.#e}/${e29}/${n39}`), a34 = { kind: e29, handle: i36, binding: void 0, leases: 1, disposed: false }, o34 = new E11(this, a34);
    return a34.binding = o34, this.#g.add(a34), this.#_[e29].set(i36, a34), x13.set(o34, { handleState: this, state: a34 }), e29 === `material` ? this.#T = r34 : e29 === `resource` ? this.#E = r34 : r34 !== void 0 && (this.#D = r34), o34;
  }
  #B(e29) {
    if (!e29.disposed) {
      if (e29.leases <= 0) throw Error(`handle ${e29.kind} binding lease underflow`);
      --e29.leases, e29.leases === 0 && (e29.disposed = true, this.#g.delete(e29), this.#_[e29.kind].delete(e29.handle), e29.kind === `transform` && this.#O.push(e29.handle));
    }
  }
  #V(e29) {
    e29.disposed || (e29.leases = 0, e29.disposed = true, this.#g.delete(e29), this.#_[e29.kind].delete(e29.handle));
  }
  _disposeOpaqueBinding(e29) {
    let t31 = x13.get(e29);
    if (t31 === void 0 || t31.handleState !== this) throw TypeError(`opaque binding belongs to another handle`);
    this.#B(t31.state);
  }
  #H(e29) {
    if (e29.disposed) return;
    this.disposeFontStack(e29.handle), e29.leases = 0, e29.disposed = true, this.#p.delete(e29.identity), this.#m.delete(e29);
    let t31;
    for (let n39 of [...e29.bindings].reverse()) try {
      n39.dispose();
    } catch (e30) {
      t31 ??= e30;
    }
    if (t31 !== void 0) throw t31;
  }
  #U(e29, t31, n39) {
    let r34 = e29.get(t31);
    if (r34 === this) return false;
    if (r34 !== void 0) throw Error(`${n39} ${t31} is already owned by another Glyph handle state`);
    return e29.set(t31, this), true;
  }
  #W(e29, t31, n39) {
    n39 && e29.get(t31) === this && e29.delete(t31);
  }
  #G(e29, t31) {
    if (e29.get(t31) !== this) throw Error(`Glyph handle state lost registration ${t31}`);
    e29.delete(t31);
  }
  #K(t31, n39) {
    if (!(t31 instanceof Uint8Array) || t31.byteLength === 0) throw TypeError(`text-engine registration bytes must be a nonempty Uint8Array`);
    let r34 = A9(t31.byteLength, `registration byte length`), i36 = this.#r.allocate(r34);
    if (i36 === 0) throw _15(`allocate registration bytes`, e5.status.resultTooLarge);
    try {
      new Uint8Array(this.#r.memory.buffer, i36, r34).set(t31), n39(i36, r34);
    } finally {
      this.#r.deallocate(i36, r34);
    }
  }
  #q() {
    if (this.#A) throw Error(`Glyph handle state is disposed`);
    this.#b?.();
  }
};
var C13 = class {
  #e;
  #t;
  #n = false;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#n || this.#t.disposed;
  }
  dispose() {
    this.disposed || (this.#e._disposeInstalledCodec(this.#t), this.#n = true);
  }
};
var w12 = class {
  kind = `font-binding`;
  #e;
  #t;
  #n;
  #r = false;
  constructor(e29, t31, n39) {
    this.#e = e29, this.#t = t31, this.#n = n39;
  }
  get raster() {
    return this.#n;
  }
  get disposed() {
    return this.#r || this.#t.disposed;
  }
  dispose() {
    this.disposed || (this.#e._disposeRetainedFontBinding(this.#t), this.#r = true);
  }
  _state() {
    if (this.disposed) throw Error(`handle font binding has been disposed`);
    return this.#t;
  }
};
var T11 = class {
  #e;
  #t;
  #n = false;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#n || this.#t.disposed;
  }
  dispose() {
    this.disposed || (this.#e._disposeRetainedFontStack(this.#t), this.#n = true);
  }
};
var E11 = class {
  #e;
  #t;
  #n = false;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#n || this.#t.disposed;
  }
  dispose() {
    this.disposed || (this.#e._disposeOpaqueBinding(this), this.#n = true);
  }
};
function D11(e29) {
  try {
    return structuredClone(e29);
  } catch (e30) {
    throw TypeError(`codec descriptor must contain cloneable data`, { cause: e30 });
  }
}
var O10 = class {
  #e;
  #t;
  #n;
  #r;
  #i;
  #a;
  #o;
  #s = false;
  #c = 0;
  #l = /* @__PURE__ */ new WeakMap();
  #u = 0;
  #d;
  constructor(e29, t31, n39, r34, i36, a34, o34) {
    this.#e = e29, this.#t = t31, this.#i = n39, this.#a = r34, this.#o = i36, this.#r = a34, this.#n = o34;
  }
  get handle() {
    return this.#t;
  }
  isExpired(e29) {
    if (this.#l.get(e29) === void 0) throw TypeError(`publication was not issued by this plan transport`);
    return this.#s || this.#l.get(e29) !== this.#c || e29.memoryBuffer !== this.#e.memory.buffer;
  }
  #f() {
    this.#c += 1;
  }
  reserve(e29, t31, n39 = this.#o) {
    this.#_(), e29 = A9(e29, `request capacity`), t31 = A9(t31, `result capacity`), n39 = A9(n39, `text capacity`), this.#f(), k10(this.#e.reserveRoot(this.#t, e29, t31, n39), `reserve render planner`), this.#i = Math.max(this.#i, e29), this.#a = Math.max(this.#a, t31), this.#o = Math.max(this.#o, n39);
  }
  stageUpdate(t31) {
    if (this.#_(), this.#d !== void 0) throw Error(`text update request is already staged`);
    if (!(t31 instanceof Uint8Array) || t31.byteLength === 0) throw TypeError(`text update request must be a nonempty Uint8Array`);
    this.#f();
    let n39 = A9(t31.byteLength, `text update byte length`), r34 = this.#e.memory.buffer;
    (n39 > this.#i || n39 > this.#e.requestCapacity(this.#t)) && this.reserve(n39, this.#a);
    let i36 = this.#e.requestPointer(this.#t);
    if (i36 === 0) throw _15(`resolve text request arena`, e5.status.rootMissing);
    return new Uint8Array(this.#e.memory.buffer, i36, n39).set(t31), this.#d = { requestLength: n39, initialMemoryBuffer: r34 }, n39;
  }
  consumeStagedUpdate(t31, n39) {
    if (this.#s) throw Error(`plan transport is disposed`);
    let r34 = this.#d;
    if (r34 === void 0) throw Error(`no text update request is staged`);
    if (this.#d = void 0, n39 !== this.#e.memory.buffer) throw Error(`text update batch supplied stale Wasm memory`);
    if (t31 === 0) throw _15(`publish text update`, e5.status.resultTooLarge);
    let i36 = e5.layouts.engineResult;
    if (t31 + i36.size > n39.byteLength) throw RangeError(`text engine returned an out-of-bounds result header`);
    let a34 = new DataView(n39, t31, i36.size), o34 = a34.getUint32(i36.status, true);
    if (o34 !== e5.status.ok) throw _15(`publish text update`, o34, a34.getUint32(i36.requiredRequestCapacity, true), a34.getUint32(i36.requiredResultCapacity, true), v17(a34));
    return this.#g(a34, t31, n39, r34.initialMemoryBuffer);
  }
  discardStagedUpdate() {
    this.#s || this.#d !== void 0 && (this.#d = void 0);
  }
  measureParagraph(t31, n39, i36) {
    if (this.#_(), !(t31 instanceof Uint8Array) || t31.byteLength === 0) throw TypeError(`paragraph measure request must be a nonempty Uint8Array`);
    a5(n39, `paragraph`, `paragraph id`), i36 = A9(i36, `paragraph measure max output bytes`), this.#f();
    let a34 = A9(t31.byteLength, `paragraph measure byte length`), o34 = this.#e.memory.buffer;
    (a34 > this.#i || a34 > this.#e.requestCapacity(this.#t)) && this.reserve(a34, this.#a);
    let s33 = true;
    for (; ; ) {
      let r34 = this.#e.requestPointer(this.#t);
      if (r34 === 0) throw _15(`resolve text request arena`, e5.status.rootMissing);
      new Uint8Array(this.#e.memory.buffer, r34, a34).set(t31);
      let c30 = this.#e.measureParagraph(this.#t, r34, a34, n39), l29 = this.#e.memory.buffer;
      if (c30 === 0) throw _15(`measure paragraph`, e5.status.resultTooLarge);
      let u28 = e5.layouts.engineResult;
      if (c30 + u28.size > l29.byteLength) throw RangeError(`text engine returned an out-of-bounds result header`);
      let d24 = new DataView(l29, c30, u28.size), f26 = d24.getUint32(u28.status, true), p28 = d24.getUint32(u28.requiredResultCapacity, true), m24 = d24.getUint32(u28.resultCapacity, true);
      if (f26 === e5.status.resultTooLarge && s33 && p28 <= i36 && p28 > m24) {
        s33 = false, this.reserve(a34, p28);
        continue;
      }
      if (f26 !== e5.status.ok) throw _15(`measure paragraph`, f26, d24.getUint32(u28.requiredRequestCapacity, true), p28, v17(d24));
      return this.#g(d24, c30, l29, o34);
    }
  }
  borrowParagraphLayout(t31, n39, r34) {
    let i36 = this.measureParagraph(t31, n39, r34);
    if (i36.semanticViewCount !== 0) throw TypeError(`borrowed layout setup unexpectedly serialized semantic records`);
    let a34 = this.#e.borrowParagraphLayout(this.#t, n39), o34 = this.#e.memory.buffer, s33 = e5.layouts.borrowedLayoutDescriptor;
    this.#h(a34, s33.size, s33.alignment, o34, `borrowed layout descriptor`);
    let c30 = new DataView(o34, a34, s33.size), l29 = c30.getUint32(s33.rootId, true), u28 = c30.getUint32(s33.paragraphId, true);
    if (l29 !== this.#t || u28 !== n39) throw TypeError(`borrowed layout descriptor identifies a different paragraph`);
    return Object.freeze({ publication: i36, memoryBuffer: o34, rootId: l29, paragraphId: u28, generation: j8(c30.getUint32(s33.generation, true), `borrowed layout generation`), glyphCount: c30.getUint32(s33.glyphCount, true) });
  }
  borrowParagraphGlyph(e29, t31) {
    return this.#m(e29, t31);
  }
  copyGlyphs(t31, n39, i36, a34, o34) {
    if (this.#_(), a5(t31, `paragraph`, `paragraph id`), n39 == null || n39.length === 0) throw TypeError(`glyph copy needs at least one stable glyph id`);
    let s33 = M8(n39.length, Uint32Array.BYTES_PER_ELEMENT, `glyph copy stable ids`), c30 = new Uint8Array(s33), l29 = new DataView(c30.buffer), u28 = /* @__PURE__ */ new Set();
    for (let e29 = 0; e29 < n39.length; e29 += 1) {
      let t32 = n39[e29];
      if (t32 === void 0) throw RangeError(`glyph stable id ${e29} is missing`);
      let r34 = j8(t32, `glyph stable id ${e29}`);
      if (u28.has(r34)) throw RangeError(`glyph stable id ${e29} duplicates ${r34}`);
      u28.add(r34), l29.setUint32(e29 * Uint32Array.BYTES_PER_ELEMENT, r34, true);
    }
    this.#f();
    let d24 = this.#e.memory.buffer, f26 = this.#e.allocate(s33);
    if (f26 === 0) throw _15(`allocate glyph copy ids`, e5.status.resultTooLarge);
    try {
      new Uint8Array(this.#e.memory.buffer, f26, s33).set(c30);
      let e29 = this.#e.copyGlyphs(this.#t, t31, i36, A9(a34, `glyph copy capability set`), A9(o34, `glyph copy max output bytes`), f26, n39.length);
      return this.#p(e29, d24, `copy glyphs`);
    } finally {
      this.#e.deallocate(f26, s33);
    }
  }
  copyDecorations(e29, t31, n39, i36) {
    this.#_(), a5(e29, `paragraph`, `paragraph id`), this.#f();
    let a34 = this.#e.memory.buffer, o34 = this.#e.copyDecorations(this.#t, t31, A9(n39, `decoration copy capability set`), e29, A9(i36, `decoration copy max output bytes`));
    return this.#p(o34, a34, `copy decorations`);
  }
  #p(t31, n39, r34) {
    if (t31 === 0) throw _15(r34, e5.status.resultTooLarge);
    let i36 = this.#e.memory.buffer, a34 = e5.layouts.engineResult;
    if (t31 + a34.size > i36.byteLength) throw RangeError(`${r34} returned an out-of-bounds result header`);
    let o34 = new DataView(i36, t31, a34.size), s33 = o34.getUint32(a34.status, true);
    if (s33 !== e5.status.ok) throw _15(r34, s33, o34.getUint32(a34.requiredRequestCapacity, true), o34.getUint32(a34.requiredResultCapacity, true), v17(o34));
    return this.#g(o34, t31, i36, n39);
  }
  #m(t31, n39) {
    if (t31.rootId !== this.#t || this.isExpired(t31.publication)) throw Error(`borrowed glyph layout has expired`);
    if (!Number.isSafeInteger(n39) || n39 < 0 || n39 >= t31.glyphCount) throw RangeError(`borrowed layout glyph index is outside its range`);
    let r34 = this.#e.borrowParagraphGlyph(this.#t, t31.paragraphId, t31.generation, n39), i36 = this.#e.memory.buffer, a34 = e5.layouts.borrowedGlyph;
    return this.#h(r34, a34.size, a34.alignment, i36, `borrowed glyph record`), r34;
  }
  #h(e29, t31, n39, r34, i36) {
    if (e29 === 0 || e29 % n39 !== 0 || !Number.isSafeInteger(e29 + t31) || e29 + t31 > r34.byteLength) throw RangeError(`${i36} is outside Wasm memory`);
  }
  #g(t31, n39, r34, i36) {
    let a34 = e5.layouts.engineResult, o34 = t31.getUint32(a34.byteLength, true);
    if (o34 < a34.size || n39 + o34 > r34.byteLength) throw RangeError(`text engine returned an out-of-bounds publication`);
    this.#i = t31.getUint32(a34.requestCapacity, true), this.#a = t31.getUint32(a34.resultCapacity, true);
    let s33 = { bytes: new Uint8Array(r34, n39, o34), memoryBuffer: r34, memoryGrew: r34 !== i36, engineRevision: t31.getUint32(a34.engineRevision, true), revision: t31.getUint32(a34.revision, true), requiredBaseRevision: t31.getUint32(a34.requiredBaseRevision, true), publicationGeneration: t31.getUint32(a34.publicationGeneration, true), flags: t31.getUint32(a34.flags, true), codecHandle: A9(t31.getUint32(a34.codecHandle, true), `result codec handle`), capabilitySet: t31.getUint32(a34.capabilitySet, true), semanticViewCount: t31.getUint32(a34.semanticViewCount, true), primitiveCount: t31.getUint32(a34.primitiveCount, true), patchCount: t31.getUint32(a34.patchCount, true), drawCount: t31.getUint32(a34.drawCount, true) };
    return this.#l.set(s33, this.#c), this.#u = Math.max(this.#u, s33.publicationGeneration), s33;
  }
  dispose() {
    this.#s || (this.#r(), k10(this.#e.disposeRoot(this.#t), `dispose Glyph root`), this.#d = void 0, this.#f(), this.#s = true, this.#n());
  }
  #_() {
    if (this.#s) throw Error(`plan transport is disposed`);
    this.#r();
  }
};
function k10(t31, n39) {
  if (t31 !== e5.status.ok) throw _15(n39, t31);
}
function A9(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 < 0 || e29 > p21) throw RangeError(`${t31} must be a u32`);
  return e29;
}
function j8(e29, t31) {
  let n39 = A9(e29, t31);
  if (n39 === 0) throw RangeError(`${t31} must be nonzero`);
  return n39;
}
function M8(e29, t31, n39) {
  let r34 = e29 * t31;
  if (!Number.isSafeInteger(r34) || r34 > p21) throw RangeError(`${n39} exceeds u32`);
  return r34;
}
function N8(e29, t31) {
  if (!Number.isSafeInteger(e29) || e29 <= 0 || e29 > p21) throw RangeError(`${t31} identities are exhausted`);
  return e29 + 1;
}

// node_modules/@pmndrs/glyph/dist/glyph-engine.js
var l22 = class {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Set();
  getByHandle(e29) {
    return this.#e.get(e29);
  }
  add(e29) {
    let t31 = this.#e.get(e29.handle);
    if (t31 !== void 0 && t31 !== e29) throw Error(`glyph engine shaping font handle conflict`);
    this.#e.set(e29.handle, e29);
  }
  delete(e29) {
    if (this.#e.get(e29.handle) === e29) {
      this.#e.delete(e29.handle);
      for (let t31 of this.#t) t31(e29);
    }
  }
  _onFontDispose(e29) {
    return this.#t.add(e29), () => this.#t.delete(e29);
  }
};
async function u22(e29 = {}) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`glyph engine options must be an object`);
  let t31 = new l22(), n39 = await a25({ registry: t31, ...e29.wasm === void 0 ? {} : { wasm: e29.wasm } });
  try {
    return new y17(t31, n39);
  } catch (e30) {
    throw n39.dispose(), e30;
  }
}
function p22(e29, t31) {
  if (!(e29 instanceof y17)) throw TypeError(`glyph engine was not created by this package`);
  return e29._createHandleState(t31);
}
function m19(e29, t31) {
  if (!(e29 instanceof y17)) throw TypeError(`glyph engine was not created by this package`);
  return e29._registerShapeParticipant(t31);
}
function h19(e29) {
  if (!(e29 instanceof y17)) throw TypeError(`glyph engine was not created by this package`);
  e29._shape();
}
var y17 = class {
  #e;
  #t;
  #n = /* @__PURE__ */ new Set();
  #r = /* @__PURE__ */ new Set();
  #i = /* @__PURE__ */ new WeakMap();
  #a = /* @__PURE__ */ new Set();
  #o = /* @__PURE__ */ new Set();
  #s = /* @__PURE__ */ new Set();
  #c = [];
  #l = [];
  #u = [];
  #d = [];
  #f = false;
  #p = false;
  #m = false;
  #h = false;
  #g = 1;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#f;
  }
  _createHandleState(e29) {
    this.#x();
    let t31 = this.#g, n39 = t31 + 1;
    if (!Number.isSafeInteger(n39)) throw RangeError(`glyph handle identities are exhausted`);
    let r34;
    return r34 = new S13(this.#t, e29, () => this.#r.delete(r34), (e30) => this._acquireFont(e30), () => this.#S(), () => this.#C(), `${e29.integration}/handle/${t31}`), this.#r.add(r34), this.#g = n39, r34;
  }
  dispose() {
    if (this.#f || this.#p) return;
    if (this.#m) throw Error(`glyph engine cannot be disposed while a borrowed render plan is active`);
    this.#p = true;
    let e29 = (e30, n39) => {
      e && console.warn(`glyph engine teardown continued after ${e30} failed: ${String(n39)}`);
    };
    for (let t31 of [...this.#n]) try {
      t31();
    } catch (t32) {
      e29(`disposing a renderer integration`, t32);
    }
    this.#n.clear();
    for (let e30 of [...this.#o]) e30.dispose();
    this.#o.clear(), this.#s.clear();
    for (let t31 of [...this.#r]) try {
      t31.dispose();
    } catch (t32) {
      e29(`disposing Glyph handle state`, t32);
    }
    this.#r.clear();
    for (let t31 of [...this.#a]) try {
      this.#b(t31);
    } catch (t32) {
      e29(`disposing an engine font binding`, t32);
    }
    try {
      this.#t.dispose();
    } catch (t31) {
      e29(`disposing the shaper`, t31);
    } finally {
      this.#f = true, this.#p = false;
    }
  }
  _acquireFont(e29) {
    this.#x();
    let t31 = v(e29).font, a34 = y(e29), o34 = this.#i.get(t31), s33 = x(e29);
    if (o34 === void 0 || o34.disposed) {
      let e30 = { font: t31, resources: /* @__PURE__ */ new Set(), leases: 0, disposed: false }, n39 = false;
      try {
        this.#e.add(t31), n39 = true, this.#t.registerFont(t31);
      } catch (e31) {
        try {
          n39 && this.#e.delete(t31);
        } finally {
          s33.dispose();
        }
        throw e31;
      }
      o34 = e30, this.#i.set(t31, e30), this.#a.add(e30);
    }
    return o34.leases += 1, o34.resources.add(s33), new w13(this, o34, a34, e29.raster, s33);
  }
  _releaseFont(e29, t31) {
    if (e29.resources.delete(t31), t31.dispose(), !e29.disposed) {
      if (e29.leases <= 0) throw Error(`engine font binding lease underflow`);
      --e29.leases, e29.leases === 0 && this.#b(e29);
    }
  }
  _registerShapeParticipant(e29) {
    if (this.#x(), typeof e29 != `object` || !e29) throw TypeError(`Glyph shape participant must be an object`);
    if (typeof e29.stage != `function` || typeof e29.accepted != `function` || typeof e29.rejected != `function`) throw TypeError(`Glyph shape participant must implement stage(), accepted(), and rejected()`);
    let t31 = new x14(this, e29);
    return this.#o.add(t31), t31;
  }
  _invalidateShapeParticipant(e29) {
    if (this.#x(), !this.#o.has(e29)) throw Error(`Glyph shape participant is not registered with this engine`);
    this.#s.add(e29);
  }
  _disposeShapeParticipant(e29) {
    this.#s.delete(e29), this.#o.delete(e29);
  }
  _shape() {
    if (this.#x(), this.#h) throw Error(`glyph.shape() cannot be reentered`);
    if (this.#s.size === 0) return;
    this.#h = true;
    let e29 = this.#c, t31 = this.#l, n39 = this.#u, r34 = this.#d;
    e29.length = 0, t31.length = 0, n39.length = 0, r34.length = 0;
    let i36;
    try {
      for (let t32 of this.#s) e29.push(t32);
      if (this.#s.clear(), this.#_(e29, t31, n39, r34), t31.length !== 0) try {
        this.#v(t31, n39, r34);
      } catch (e30) {
        let t32 = C14(e30);
        for (let e31 = 0; e31 < r34.length; e31 += 1) r34[e31] === void 0 && (r34[e31] = t32);
      }
      this.#y(e29, r34);
    } catch (e30) {
      i36 = e30;
    } finally {
      for (let e30 of t31) try {
        e30.discard();
      } catch (e31) {
        i36 ??= e31;
      }
      e29.length = 0, t31.length = 0, n39.length = 0, r34.length = 0, this.#h = false;
    }
    if (i36 !== void 0) throw i36;
  }
  #_(e29, t31, n39, r34) {
    for (let i36 = 0; i36 < e29.length; i36 += 1) {
      let a34 = e29[i36];
      if (!a34.disposed) try {
        let e30 = a34.stage();
        this.#s.delete(a34), e30 === void 0 ? r34[i36] = b14 : (t31.push(e30), n39.push(i36), r34[i36] = void 0);
      } catch (e30) {
        this.#s.delete(a34), r34[i36] = C14(e30);
      }
    }
  }
  #v(t31, n39, r34) {
    let i36 = i25(this.#t), o34 = t31.length;
    o34 > i36.updateBatchCapacity() && S14(i36.reserveUpdateBatch(o34), `reserve Glyph shape batch`);
    let c30 = i36.updateBatchPointer();
    if (c30 === 0) throw new i17(`resolve Glyph shape batch`, e5.status.resultTooLarge);
    let l29 = e5.layouts.engineUpdateBatchEntry, u28 = o34 * l29.size;
    if (c30 + u28 > i36.memory.buffer.byteLength) throw RangeError(`Glyph shape batch descriptor arena is out of bounds`);
    let d24 = new DataView(i36.memory.buffer, c30, u28);
    for (let e29 = 0; e29 < o34; e29 += 1) {
      let n40 = t31[e29], r35 = e29 * l29.size;
      d24.setUint32(r35 + l29.rootId, n40.rootId, true), d24.setUint32(r35 + l29.requestLength, n40.requestLength, true), d24.setUint32(r35 + l29.resultPointer, 0, true), d24.setUint32(r35 + l29.status, 0, true);
    }
    S14(i36.textUpdateBatch(c30, o34), `publish Glyph shape batch`);
    let f26 = i36.memory.buffer;
    d24 = new DataView(f26, c30, u28);
    for (let e29 = 0; e29 < t31.length; e29 += 1) {
      let i37 = n39[e29], a34 = t31[e29], o35 = e29 * l29.size, s33 = d24.getUint32(o35 + l29.status, true), c31 = d24.getUint32(o35 + l29.resultPointer, true);
      try {
        c31 === 0 && S14(s33, `publish Glyph root`), a34.adopt(c31, f26);
      } catch (e30) {
        r34[i37] = C14(e30);
      }
    }
    let p28 = this.#C();
    try {
      for (let e29 = 0; e29 < t31.length; e29 += 1) {
        let i37 = n39[e29];
        if (r34[i37] instanceof Error) continue;
        let a34 = t31[e29];
        try {
          r34[i37] = a34.consume();
        } catch (e30) {
          r34[i37] = C14(e30);
        }
      }
    } finally {
      p28();
    }
    for (let e29 = 0; e29 < t31.length; e29 += 1) {
      let i37 = n39[e29], a34 = r34[i37];
      if (!(a34 === void 0 || a34 === b14 || a34 instanceof Error || !a34.accepted)) try {
        t31[e29].settle();
      } catch (e30) {
        r34[i37] = C14(e30);
      }
    }
  }
  #y(e29, t31) {
    let n39 = /* @__PURE__ */ new Set();
    for (let r34 = 0; r34 < e29.length; r34 += 1) {
      let i36 = e29[r34];
      if (i36.disposed) continue;
      let a34 = t31[r34];
      try {
        if (a34 === b14) continue;
        if (a34 === void 0 || a34 instanceof Error) {
          let e30 = a34 ?? Error(`Glyph root did not produce a shape outcome`);
          i36.rejected(e30), n39.add(e30);
        } else if (a34.accepted) i36.accepted();
        else {
          let e30 = C14(a34.error);
          i36.rejected(e30), n39.add(e30);
        }
      } catch (e30) {
        n39.add(C14(e30));
      }
    }
    if (n39.size === 1) throw n39.values().next().value;
    if (n39.size > 1) throw AggregateError(n39, `multiple Glyph roots rejected shape()`);
  }
  #b(e29) {
    if (!e29.disposed) {
      e29.disposed = true, e29.leases = 0, this.#a.delete(e29), this.#i.delete(e29.font);
      try {
        this.#e.delete(e29.font);
      } finally {
        for (let t31 of e29.resources) t31.dispose();
        e29.resources.clear(), e29.leases = 0;
      }
    }
  }
  #x() {
    if (this.#f || this.#p) throw Error(`glyph engine has been disposed`);
    this.#S();
  }
  #S() {
    if (this.#f) throw Error(`glyph engine has been disposed`);
    if (this.#m) throw Error(`glyph engine cannot be reentered while a borrowed render plan is active`);
  }
  #C() {
    this.#x(), this.#m = true;
    let e29 = true;
    return () => {
      if (!e29) throw Error(`borrowed render-plan gate was released twice`);
      e29 = false, this.#m = false;
    };
  }
  _shaper() {
    return this.#x(), this.#t;
  }
  _observeDispose(e29) {
    if (this.#x(), typeof e29 != `function`) throw TypeError(`glyph engine dispose observer must be a function`);
    this.#n.add(e29);
    let t31 = true;
    return () => {
      t31 && (t31 = false, this.#n.delete(e29));
    };
  }
};
var b14 = Symbol(`pmndrs.glyph.shape.skipped`);
var x14 = class {
  #e;
  #t;
  #n = false;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31;
  }
  get disposed() {
    return this.#n;
  }
  invalidate() {
    if (this.#n) throw Error(`Glyph shape registration has been disposed`);
    this.#e._invalidateShapeParticipant(this);
  }
  stage() {
    return this.#t.stage();
  }
  accepted() {
    this.#t.accepted();
  }
  rejected(e29) {
    this.#t.rejected(e29);
  }
  dispose() {
    this.#n || (this.#n = true, this.#e._disposeShapeParticipant(this));
  }
};
function S14(t31, n39) {
  if (t31 !== e5.status.ok) throw new i17(n39, t31);
}
function C14(e29) {
  return e29 instanceof Error ? e29 : Error(String(e29));
}
var w13 = class {
  #e;
  #t;
  #n;
  #r;
  #i;
  #a = false;
  constructor(e29, t31, n39, r34, i36) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34, this.#i = i36;
  }
  get disposed() {
    return this.#a || this.#t.disposed;
  }
  get raster() {
    return this.#r;
  }
  get handle() {
    if (this.disposed) throw Error(`engine font binding has been disposed`);
    return this.#t.font.handle;
  }
  get identity() {
    if (this.disposed) throw Error(`engine font binding has been disposed`);
    return this.#n;
  }
  dispose() {
    this.#a || (this.#a = true, this.#e._releaseFont(this.#t, this.#i));
  }
  _handle() {
    return this.handle;
  }
  _resources() {
    if (this.disposed) throw Error(`engine font binding has been disposed`);
    return { font: this.#i.font, raster: this.#i.raster, data: this.#i.data };
  }
};

// node_modules/@pmndrs/glyph/dist/internal/configured-handle.js
init_loaded_font();

// node_modules/@pmndrs/glyph/dist/internal/bind-command-buffer.js
function e24(e29, t31) {
  switch (e29.kind) {
    case `allocate-or-resize`:
    case `retire`:
      return Object.freeze({ kind: e29.kind, buffer: t31(e29.buffer), destinationOffset: e29.destinationOffset, byteLength: e29.byteLength });
    case `write`:
      return Object.freeze({ kind: e29.kind, buffer: t31(e29.buffer), destinationOffset: e29.destinationOffset, payload: e29.payload });
    case `fill`:
      return Object.freeze({ kind: e29.kind, buffer: t31(e29.buffer), destinationOffset: e29.destinationOffset, byteLength: e29.byteLength, value: e29.value });
    case `copy`:
      return Object.freeze({ kind: e29.kind, source: t31(e29.source), sourceOffset: e29.sourceOffset, destination: t31(e29.destination), destinationOffset: e29.destinationOffset, byteLength: e29.byteLength });
  }
}
function t25(e29, t31) {
  switch (e29.kind) {
    case `resource`: {
      let n39 = t31.resource(e29.resource);
      return n39 === void 0 ? void 0 : Object.freeze({ kind: e29.kind, resource: n39 });
    }
    case `buffer`: {
      let n39 = t31.buffer(e29.buffer);
      return n39 === void 0 ? void 0 : Object.freeze({ kind: e29.kind, buffer: n39 });
    }
    case `slot-range`:
    case `output-bytes`:
      return Object.freeze({ kind: e29.kind, byteOffset: e29.byteOffset, byteLength: e29.byteLength });
  }
}

// node_modules/@pmndrs/glyph/dist/internal/typed-command-identity.js
var e25 = class {
};
function t26(t31) {
  return Object.freeze(new e25());
}

// node_modules/@pmndrs/glyph/dist/internal/typed-command-tree.js
var n35 = class {
  engineRevision;
  revision;
  publicationGeneration;
  checkpoint;
  updates;
  group;
  delivery = `borrowed`;
  constructor(e29, t31, n39, r34, i36, a34) {
    this.engineRevision = e29, this.revision = t31, this.publicationGeneration = n39, this.checkpoint = r34, this.updates = i36, this.group = a34, Object.freeze(this);
  }
};
var r31 = e5.layouts.engineResource;
var i32 = e5.layouts.engineBuffer;
var a31 = e5.layouts.enginePatch;
var o30 = e5.layouts.enginePrimitive;
var s29 = e5.layouts.engineDraw;
var c25 = e5.layouts.engineRetirement;
var l23 = class {
  #e = /* @__PURE__ */ new WeakMap();
  #t = /* @__PURE__ */ new Map();
  #n = /* @__PURE__ */ new WeakMap();
  #r = /* @__PURE__ */ new Map();
  #i = /* @__PURE__ */ new WeakMap();
  #a = /* @__PURE__ */ new Map();
  #o = /* @__PURE__ */ new Map();
  #s = /* @__PURE__ */ new WeakMap();
  #c = /* @__PURE__ */ new Map();
  #l = /* @__PURE__ */ new Map();
  #u = /* @__PURE__ */ new Map();
  #d = /* @__PURE__ */ new WeakMap();
  #f = /* @__PURE__ */ new WeakMap();
  #p = /* @__PURE__ */ new WeakMap();
  #m = /* @__PURE__ */ new WeakMap();
  #h = /* @__PURE__ */ new WeakMap();
  #g = /* @__PURE__ */ new Map();
  #_ = /* @__PURE__ */ new Map();
  #v = false;
  source(e29, t31) {
    this.#w();
    let r34 = e29.plan, i36 = { candidate: e29, signal: t31, bufferOverlay: /* @__PURE__ */ new Map(), materials: /* @__PURE__ */ new Map(), batchOverlay: /* @__PURE__ */ new Map(), instanceOverlay: /* @__PURE__ */ new Map(), instanceSpanOverlay: /* @__PURE__ */ new Map(), drawDescriptors: /* @__PURE__ */ new WeakMap(), instanceSpanDescriptors: /* @__PURE__ */ new WeakMap(), transformBindings: void 0 }, a34 = r34.table(`resources`), o34 = r34.table(`buffers`), c30 = r34.table(`patches`), l29 = r34.table(`primitives`), d24 = r34.table(`draws`), m24 = r34.table(`retirements`), h24 = a34.count !== 0 || o34.count !== 0 || l29.count !== 0 || d24.count !== 0 || m24.count !== 0, v22 = new u23(a34.count, (e30) => new f21(this, i36, r34, a34, e30)), x19 = new u23(o34.count, (e30) => new p23(this, i36, r34, o34, e30)), S17 = new u23(d24.count, (e30) => {
      let t32 = r34.record(d24, e30);
      return r34.u32(t32 + s29.transformId) === 0 ? new g19(this, i36, r34, t32, l29) : new _16(this, i36, r34, t32);
    }), C17 = new n35(e29.engineRevision, e29.revision, e29.publicationGeneration, e29.checkpoint, Object.freeze({ resources: v22, buffers: x19, patches: new u23(c30.count, (e30) => y18(this, i36, r34, c30, e30)), retirements: new u23(m24.count, (e30) => b15(this, i36, r34, m24, e30)) }), Object.freeze(h24 ? { kind: `replace`, value: Object.freeze({ children: S17 }) } : { kind: `unchanged` }));
    return this.#e.set(C17, i36), C17;
  }
  settle(e29, t31) {
    let n39 = this.#x(e29);
    if (this.#e.delete(e29), t31) {
      for (let [e30, t32] of n39.bufferOverlay) t32 === null ? this.#a.delete(e30) : this.#a.set(e30, t32);
      for (let [e30, t32] of n39.batchOverlay) this.#c.set(e30, t32);
      for (let [e30, t32] of n39.instanceOverlay) this.#l.set(e30, t32);
      for (let [e30, t32] of n39.instanceSpanOverlay) this.#u.set(e30, t32);
    }
  }
  candidate(e29) {
    return this.#x(e29).candidate;
  }
  signal(e29) {
    return this.#x(e29).signal;
  }
  resourceIdentity(e29) {
    return this.#n.get(e29);
  }
  bufferIdentity(e29) {
    return this.#i.get(e29);
  }
  programIdentity(e29) {
    return this.#s.get(e29);
  }
  materialBinding(e29) {
    return this.#f.get(e29);
  }
  transformBinding(e29) {
    return this.#m.get(e29);
  }
  transformIndex(e29) {
    return this.#h.get(e29);
  }
  transformBindings(e29) {
    return this.#x(e29).candidate.transforms;
  }
  batchDescriptor(e29, t31) {
    return this.#C(this.#x(e29).drawDescriptors, t31, `batch`);
  }
  instanceDescriptor(e29, t31) {
    return this.#C(this.#x(e29).drawDescriptors, t31, `instance`);
  }
  instanceSpanDescriptor(e29, t31) {
    return this.#C(this.#x(e29).instanceSpanDescriptors, t31, `instance span`);
  }
  drawBindingDescriptor(e29, n39) {
    let r34 = this.#x(e29), i36 = r34.drawDescriptors.get(n39);
    if (i36 === void 0) throw TypeError(`draw identity does not belong to this command tree`);
    let { view: a34, offset: o34 } = i36, c30 = a34.table(`buffers`), l29 = a34.table(`resources`), d24 = a34.u32(o34 + s29.bufferStart), f26 = a34.u32(o34 + s29.bufferCount), p28 = a34.u32(o34 + s29.resourceStart), m24 = a34.u32(o34 + s29.resourceCount), h24 = a34.u32(o34 + s29.materialId), g23 = a34.u32(o34 + s29.clipId);
    return { program: this.program(a34.u32(o34 + s29.programId)), programVariant: a34.u16(o34 + s29.programVariant), material: h24 === 0 ? void 0 : this.material(r34, h24), buffers: new u23(f26, (e30) => this.#y(r34, a34, a34.record(c30, d24 + e30))), resources: new u23(m24, (e30) => this.#b(a34, a34.record(l29, p28 + e30))), flags: a34.u16(o34 + s29.flags), clip: g23 === 0 ? void 0 : x15(this.#g, g23, () => t26(`clip`)), depthKey: a34.u32(o34 + s29.depthKey), order: a34.u32(o34 + s29.orderToken) };
  }
  instanceSpanBindingDescriptor(e29, n39) {
    let r34 = this.#x(e29), { view: i36, offset: a34 } = this.instanceSpanDescriptor(e29, n39), s33 = i36.u32(a34 + o30.resourceId), c30 = i36.u32(a34 + o30.bufferId), l29 = i36.u32(a34 + o30.clipId), u28 = i36.u32(a34 + o30.semanticId);
    return { program: this.program(i36.u32(a34 + o30.programId)), programVariant: i36.u16(a34 + o30.programVariant), resource: s33 === 0 ? void 0 : this.resource(s33, i36.u32(a34 + o30.resourceGeneration), i36.u32(a34 + o30.techniqueId), 0, 0), buffer: c30 === 0 ? void 0 : this.currentBuffer(r34, c30), clip: l29 === 0 ? void 0 : x15(this.#g, l29, () => t26(`clip`)), semantic: u28 === 0 ? void 0 : x15(this.#_, u28, () => t26(`semantic`)), inlineStart: i36.f32(a34 + o30.inlineStart), blockStart: i36.f32(a34 + o30.blockStart), inlineExtent: i36.f32(a34 + o30.inlineExtent), blockExtent: i36.f32(a34 + o30.blockExtent) };
  }
  rootInstanceSpan(e29, t31) {
    let n39 = this.#x(e29), { view: r34, offset: i36 } = this.instanceDescriptor(e29, t31), a34 = r34.table(`primitives`);
    return new h20(this, n39, r34, a34, r34.u32(i36 + s29.primitiveStart));
  }
  dispose() {
    this.#v || (this.#v = true, this.#t.clear(), this.#r.clear(), this.#a.clear(), this.#o.clear(), this.#c.clear(), this.#l.clear(), this.#u.clear(), this.#g.clear(), this.#_.clear());
  }
  resource(e29, n39, r34, i36, a34) {
    let o34 = `${e29}:${n39}`, s33 = this.#t.get(o34);
    return s33 === void 0 && (s33 = t26(`resource`), this.#t.set(o34, s33), this.#n.set(s33, { id: e29, generation: n39, techniqueId: r34, resourceKind: i36, referenceId: a34 })), s33;
  }
  declareBuffer(e29, t31, n39, r34, i36) {
    let a34 = this.buffer(t31, n39, r34, i36);
    return e29.bufferOverlay.set(t31, a34), a34;
  }
  buffer(e29, n39, r34 = 0, i36 = 0) {
    let a34 = `${e29}:${n39}`, o34 = this.#r.get(a34);
    return o34 === void 0 && (o34 = t26(`buffer`), this.#r.set(a34, o34), this.#i.set(o34, { id: e29, generation: n39, programId: r34, bindingId: i36 })), o34;
  }
  currentBuffer(e29, t31) {
    return e29.bufferOverlay.get(t31) ?? this.#a.get(t31);
  }
  retireBuffer(e29, t31, n39) {
    let r34 = this.buffer(t31, n39);
    return e29.bufferOverlay.set(t31, null), r34;
  }
  program(e29) {
    let n39 = this.#o.get(e29);
    return n39 === void 0 && (n39 = t26(`program`), this.#o.set(e29, n39), this.#s.set(n39, e29)), n39;
  }
  batch(e29, n39, r34) {
    let i36 = this.#S(this.#c, e29.batchOverlay, n39, () => t26(`batch`));
    return e29.drawDescriptors.set(i36, r34), i36;
  }
  instance(e29, n39, r34) {
    let i36 = this.#S(this.#l, e29.instanceOverlay, n39, () => t26(`instance`));
    return e29.drawDescriptors.set(i36, r34), i36;
  }
  instanceSpan(e29, n39, r34) {
    let i36 = this.#S(this.#u, e29.instanceSpanOverlay, n39, () => t26(`instance-span`));
    return e29.instanceSpanDescriptors.set(i36, r34), i36;
  }
  material(e29, n39) {
    let r34 = e29.materials.get(n39);
    if (r34 !== void 0) return r34;
    let i36 = e29.candidate.resolveMaterial(n39);
    return r34 = this.#d.get(i36), r34 === void 0 && (r34 = t26(`material`), this.#d.set(i36, r34), this.#f.set(r34, i36)), e29.materials.set(n39, r34), r34;
  }
  transform(e29, n39) {
    e29.transformBindings ??= S15(e29.candidate.transforms);
    let r34 = e29.transformBindings.get(n39);
    if (r34 === void 0) throw Error(`command references unknown transform binding ${n39}; candidate provided ${[...e29.transformBindings.keys()].join(`, `)}`);
    let { binding: i36, recordIndex: a34 } = r34, o34 = this.#p.get(i36);
    return o34 === void 0 && (o34 = t26(`transform`), this.#p.set(i36, o34), this.#m.set(o34, i36)), this.#h.set(o34, a34), o34;
  }
  #y(t31, n39, r34) {
    let a34 = n39.u16(r34 + i32.codecBufferId);
    return this.declareBuffer(t31, n39.u32(r34 + i32.id), n39.u32(r34 + i32.generation), n39.u32(r34 + i32.programId), a34 === e5.engine.internalBufferBindings.placement ? `placement` : a34);
  }
  #b(e29, t31) {
    return this.resource(e29.u32(t31 + r31.id), e29.u32(t31 + r31.generation), e29.u32(t31 + r31.techniqueId), e29.u16(t31 + r31.resourceKind), e29.u32(t31 + r31.referenceId));
  }
  #x(e29) {
    let t31 = this.#e.get(e29);
    if (t31 === void 0) throw TypeError(`typed command tree does not belong to this mapper`);
    return t31;
  }
  #S(e29, t31, n39, r34) {
    let i36 = t31.get(n39) ?? e29.get(n39);
    if (i36 !== void 0) return i36;
    let a34 = r34();
    return t31.set(n39, a34), a34;
  }
  #C(e29, t31, n39) {
    let r34 = e29.get(t31);
    if (r34 === void 0) throw TypeError(`${n39} identity does not belong to this command tree`);
    return r34;
  }
  #w() {
    if (this.#v) throw Error(`typed command-tree mapper is disposed`);
  }
};
var u23 = class {
  length;
  #e;
  #t;
  constructor(e29, t31) {
    this.length = e29, this.#e = Array(e29), this.#t = t31;
  }
  at(e29) {
    if (!(e29 < 0 || e29 >= this.length || !Number.isInteger(e29))) return this.#e[e29] ??= this.#t(e29);
  }
  *[Symbol.iterator]() {
    for (let e29 = 0; e29 < this.length; e29 += 1) yield this.at(e29);
  }
};
function d17(e29, t31) {
  return new u23(e29.length, (n39) => t31(e29.at(n39), n39));
}
var f21 = class {
  #e;
  #t;
  #n;
  constructor(e29, t31, n39, r34, i36) {
    this.#e = e29, this.#t = n39, this.#n = n39.record(r34, i36);
  }
  get kind() {
    let t31 = this.#t.u16(this.#n + r31.action), n39 = e5.engine.resourceActions;
    return t31 === n39.create ? `acquire` : t31 === n39.update ? `update` : `retain`;
  }
  get resource() {
    return this.#e.resource(this.#t.u32(this.#n + r31.id), this.#t.u32(this.#n + r31.generation), this.#t.u32(this.#n + r31.techniqueId), this.#t.u16(this.#n + r31.resourceKind), this.#t.u32(this.#n + r31.referenceId));
  }
};
var p23 = class {
  kind = `ensure`;
  #e;
  #t;
  #n;
  #r;
  constructor(e29, t31, n39, r34, i36) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = n39.record(r34, i36);
  }
  get buffer() {
    let t31 = this.#n.u16(this.#r + i32.codecBufferId);
    return this.#e.declareBuffer(this.#t, this.#n.u32(this.#r + i32.id), this.#n.u32(this.#r + i32.generation), this.#n.u32(this.#r + i32.programId), t31 === e5.engine.internalBufferBindings.placement ? `placement` : t31);
  }
  get program() {
    let e29 = this.#n.u32(this.#r + i32.programId);
    return e29 === 0 ? void 0 : this.#e.program(e29);
  }
  get scalarType() {
    let t31 = this.#n.u8(this.#r + i32.scalarType), n39 = e5.codec.scalarTypes;
    return t31 === n39.f32 ? `f32` : t31 === n39.u32 ? `u32` : `u16`;
  }
  get vectorWidth() {
    return this.#n.u8(this.#r + i32.vectorWidth);
  }
  get capacityRecords() {
    return this.#n.u32(this.#r + i32.capacityRecords);
  }
  get byteLength() {
    return this.#n.u32(this.#r + i32.byteLength);
  }
};
var m20 = class {
  kind;
  #e;
  #t;
  #n;
  #r;
  constructor(e29, t31, n39, r34, i36) {
    this.kind = i36, this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34;
  }
  get buffer() {
    return this.#e.buffer(this.#n.u32(this.#r + a31.bufferId), this.#n.u32(this.#r + a31.bufferGeneration));
  }
  get source() {
    return this.#e.currentBuffer(this.#t, this.#n.u32(this.#r + a31.sourceBufferId));
  }
  get destination() {
    return this.buffer;
  }
  get sourceOffset() {
    return this.#n.u32(this.#r + a31.sourceOffset);
  }
  get destinationOffset() {
    return this.#n.u32(this.#r + a31.destinationOffset);
  }
  get byteLength() {
    return this.#n.u32(this.#r + a31.byteLength);
  }
  get value() {
    return this.#n.u32(this.#r + a31.fillValue);
  }
  get payload() {
    return this.#n.bytes(this.#n.u32(this.#r + a31.payloadOffset), this.byteLength);
  }
};
var h20 = class {
  #e;
  #t;
  #n;
  #r;
  constructor(e29, t31, n39, r34, i36) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = n39.record(r34, i36);
  }
  get identity() {
    return this.#e.instanceSpan(this.#t, this.#n.u32(this.#r + o30.id), { view: this.#n, offset: this.#r });
  }
  get kind() {
    let t31 = this.#n.u16(this.#r + o30.kind), n39 = e5.engine.primitiveKinds;
    return t31 === n39.glyph ? `glyph` : t31 === n39.decoration ? `decoration` : t31 === n39.inlineObject ? `inline-object` : t31 === n39.clip ? `clip` : `codec`;
  }
  get recordIndex() {
    return this.#n.u32(this.#r + o30.recordIndex);
  }
  get recordCount() {
    return this.#n.u16(this.#r + o30.recordCount);
  }
  get logicalOrder() {
    return this.#n.u32(this.#r + o30.logicalOrder);
  }
};
var g19 = class {
  kind = `batch`;
  #e;
  #t;
  #n;
  #r;
  #i;
  #a;
  constructor(e29, t31, n39, r34, i36) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34, this.#i = i36;
  }
  get identity() {
    return this.#e.batch(this.#t, this.#n.u32(this.#r + s29.id), { view: this.#n, offset: this.#r });
  }
  get instances() {
    let e29 = this.#n.u32(this.#r + s29.primitiveStart), t31 = this.#n.u32(this.#r + s29.primitiveCount);
    return this.#a ??= new u23(t31, (t32) => new h20(this.#e, this.#t, this.#n, this.#i, e29 + t32));
  }
};
var _16 = class {
  kind = `instance`;
  #e;
  #t;
  #n;
  #r;
  constructor(e29, t31, n39, r34) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34;
  }
  get identity() {
    return this.#e.instance(this.#t, this.#n.u32(this.#r + s29.id), { view: this.#n, offset: this.#r });
  }
  get transform() {
    let e29 = this.#n.u32(this.#r + s29.transformId);
    return e29 === 0 ? void 0 : this.#e.transform(this.#t, e29);
  }
};
var v18 = class {
  kind;
  #e;
  #t;
  #n;
  #r;
  constructor(e29, t31, n39, r34, i36) {
    this.kind = i36, this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34;
  }
  get resource() {
    return this.#e.resource(this.#n.u32(this.#r + c25.id), this.#n.u32(this.#r + c25.generation), 0, 0, 0);
  }
  get buffer() {
    return this.#e.retireBuffer(this.#t, this.#n.u32(this.#r + c25.id), this.#n.u32(this.#r + c25.generation));
  }
  get byteOffset() {
    return this.#n.u32(this.#r + c25.byteOffset);
  }
  get byteLength() {
    return this.#n.u32(this.#r + c25.byteLength);
  }
};
function y18(t31, n39, r34, i36, o34) {
  let s33 = r34.record(i36, o34), c30 = r34.u16(s33 + a31.opcode), l29 = e5.engine.patchOpcodes;
  return c30 === l29.allocateOrResize ? new m20(t31, n39, r34, s33, `allocate-or-resize`) : c30 === l29.write ? new m20(t31, n39, r34, s33, `write`) : c30 === l29.fill ? new m20(t31, n39, r34, s33, `fill`) : c30 === l29.copy ? new m20(t31, n39, r34, s33, `copy`) : new m20(t31, n39, r34, s33, `retire`);
}
function b15(t31, n39, r34, i36, a34) {
  let o34 = r34.record(i36, a34), s33 = r34.u16(o34 + c25.kind), l29 = e5.engine.retirementKinds;
  return s33 === l29.resource ? new v18(t31, n39, r34, o34, `resource`) : s33 === l29.buffer ? new v18(t31, n39, r34, o34, `buffer`) : s33 === l29.slotRange ? new v18(t31, n39, r34, o34, `slot-range`) : new v18(t31, n39, r34, o34, `output-bytes`);
}
function x15(e29, t31, n39) {
  let r34 = e29.get(t31);
  return r34 === void 0 && (r34 = n39(), e29.set(t31, r34)), r34;
}
function S15(e29) {
  let t31 = /* @__PURE__ */ new Map();
  for (let { transformIndex: n39, instanceIds: r34, binding: i36 } of e29) {
    let e30 = Object.freeze({ binding: i36, recordIndex: n39 });
    if (t31.set(n39, e30), r34 !== void 0) for (let n40 of r34) t31.set(n40, e30);
  }
  return t31;
}

// node_modules/@pmndrs/glyph/dist/internal/create-engine.js
function i33(e29) {
  return new a32(e29);
}
var a32 = class {
  #e;
  #t;
  #n;
  #r;
  #i = new l23();
  #a;
  #o = /* @__PURE__ */ new WeakMap();
  #s = /* @__PURE__ */ new WeakMap();
  #c = /* @__PURE__ */ new WeakMap();
  #l = /* @__PURE__ */ new WeakMap();
  #u = /* @__PURE__ */ new WeakMap();
  #d = /* @__PURE__ */ new WeakMap();
  #f = /* @__PURE__ */ new Map();
  #p = /* @__PURE__ */ new Map();
  #m = false;
  constructor(e29) {
    this.#e = e29.config, this.#t = e29.boundary, this.#n = e29.materialInput, this.#r = e29.transformInput, this.#a = new Map(e29.codec.descriptor.programs.map((e30) => [e30.programId, e30]));
  }
  source(e29, t31) {
    return this.#S(), this.#i.source(e29, t31);
  }
  project(n39) {
    if (this.#S(), this.#u.has(n39)) throw TypeError(`a command tree may be projected only once`);
    let i36 = this.#i.candidate(n39), a34 = this.#i.signal(n39);
    a34.throwIfAborted();
    let o34 = this.#f, s33 = this.#p, c30 = n39.updates.resources.length !== 0 || n39.updates.buffers.length !== 0 || n39.updates.retirements.length !== 0, l29 = c30 ? new Map(o34) : o34, u28 = c30 ? new Map(s33) : s33, d24 = /* @__PURE__ */ new Set(), f26 = /* @__PURE__ */ new WeakMap();
    try {
      let c31 = Array.from(n39.updates.resources, (e29) => {
        let t31 = this.#i.resourceIdentity(e29.resource), n40 = l29.get(t31.id);
        if (n40?.generation !== t31.generation) {
          let e30 = i36.acquirePayload(t31.referenceId), r34;
          try {
            let i37 = new Map(e30.resources.map((e31) => [e31.resourceName, e31.payload]));
            r34 = this.#e.resolve({ format: e30.techniqueId, resourceKind: String(t31.resourceKind), resourceName: e30.resourceName, payload: e30.payload, resources: i37, previous: n40?.value, signal: a34 }), n40 = { generation: t31.generation, value: r34.value, payload: e30, lease: r34 }, l29.set(t31.id, n40), d24.add(n40);
          } catch (t32) {
            throw r34?.dispose(), e30.dispose(), t32;
          }
        }
        if (n40 === void 0) throw Error(`resource binding was not retained`);
        return f26.set(e29.resource, n40.value), Object.freeze({ kind: e29.kind, resource: n40.value });
      }), p28 = Array.from(n39.updates.buffers, (e29) => {
        let t31 = this.#i.bufferIdentity(e29.buffer), n40 = e29.program === void 0 ? void 0 : this.#h(e29.program), r34 = u28.get(t31.id);
        if (r34?.generation !== t31.generation) {
          let i37 = this.#b(t31.programId, t31.bindingId), a35 = this.#e.schema.buffer(this.#t, { program: n40, declaration: i37 });
          r34 = { generation: t31.generation, value: a35 }, u28.set(t31.id, r34), this.#s.set(e29.buffer, a35);
        }
        return Object.freeze({ kind: e29.kind, buffer: r34.value, program: n40, scalarType: e29.scalarType, vectorWidth: e29.vectorWidth, capacityRecords: e29.capacityRecords, byteLength: e29.byteLength });
      }), m24 = d17(n39.updates.patches, (t31) => e24(t31, (e29) => this.#g(e29, u28))), h24 = [];
      for (let e29 of n39.updates.retirements) {
        let n40 = t25(e29, { resource: (e30) => {
          let t31 = this.#i.resourceIdentity(e30), n41 = o34.get(t31.id);
          if (n41 !== void 0 && n41.generation === t31.generation) return l29.get(t31.id)?.generation === t31.generation && l29.delete(t31.id), n41.value;
        }, buffer: (e30) => {
          let t31 = this.#i.bufferIdentity(e30), n41 = s33.get(t31.id);
          if (n41 !== void 0 && n41.generation === t31.generation) return u28.get(t31.id)?.generation === t31.generation && u28.delete(t31.id), n41.value;
        } });
        n40 !== void 0 && h24.push(n40);
      }
      let g23 = (e29) => {
        let t31 = this.#i.instanceSpanBindingDescriptor(n39, e29.identity), r34 = Object.freeze({ identity: e29.identity, kind: e29.kind, program: this.#h(t31.program), programVariant: t31.programVariant, resource: t31.resource === void 0 ? void 0 : this.#_(t31.resource, l29, f26), buffer: t31.buffer === void 0 ? void 0 : this.#g(t31.buffer, u28), recordIndex: e29.recordIndex, recordCount: e29.recordCount, logicalOrder: e29.logicalOrder, clip: t31.clip, semantic: t31.semantic, inlineStart: t31.inlineStart, blockStart: t31.blockStart, inlineExtent: t31.inlineExtent, blockExtent: t31.blockExtent });
        return Object.freeze({ value: this.#e.schema.instanceSpan(this.#t, r34), kind: e29.kind, recordIndex: e29.recordIndex, recordCount: e29.recordCount, logicalOrder: e29.logicalOrder });
      }, _20 = n39.group.kind === `unchanged` ? Object.freeze({ kind: `unchanged` }) : Object.freeze({ kind: `replace`, value: Object.freeze({ transforms: d17(this.#i.transformBindings(n39), ({ binding: e29, transformIndex: t31 }) => Object.freeze({ value: this.#y(e29, t31), recordIndex: t31 })), children: d17(n39.group.value.children, (e29) => {
        let t31 = this.#i.drawBindingDescriptor(n39, e29.identity), i37 = { program: this.#h(t31.program), programVariant: t31.programVariant, material: this.#v(t31.material), buffers: d17(t31.buffers, (e30) => this.#g(e30, u28)), resources: d17(t31.resources, (e30) => this.#_(e30, l29, f26)), flags: t31.flags, clip: t31.clip, depthKey: t31.depthKey, order: t31.order };
        if (e29.kind === `batch`) {
          let t32 = d17(e29.instances, g23);
          return Object.freeze({ kind: e29.kind, value: this.#e.schema.batch(this.#t, { identity: e29.identity, instances: t32, ...i37 }), instances: t32 });
        }
        let a35 = e29.transform === void 0 ? void 0 : this.#y(this.#i.transformBinding(e29.transform), this.#i.transformIndex(e29.transform)), o35 = g23(this.#i.rootInstanceSpan(n39, e29.identity));
        return Object.freeze({ kind: e29.kind, value: this.#e.schema.instance(this.#t, { identity: e29.identity, transform: a35, instance: o35, ...i37 }), transform: a35 });
      }) }) }), v22 = Object.freeze({ delivery: `borrowed-command-buffer`, engineRevision: n39.engineRevision, revision: n39.revision, publicationGeneration: n39.publicationGeneration, checkpoint: n39.checkpoint, updates: Object.freeze({ resources: Object.freeze(c31), buffers: Object.freeze(p28), patches: m24, retirements: Object.freeze(h24) }), displayList: _20 });
      return this.#u.set(n39, v22), this.#d.set(v22, { resources: l29, buffers: u28, fresh: d24 }), v22;
    } catch (e29) {
      for (let e30 of d24) this.#x(e30);
      throw e29;
    }
  }
  settle(e29, t31, n39) {
    let r34 = this.#u.get(e29);
    this.#u.delete(e29);
    let i36;
    try {
      if (r34 === void 0) throw TypeError(`cannot settle an unprojected command tree`);
      if (i36 = this.#d.get(r34), this.#d.delete(r34), i36 === void 0 || t31 !== r34) throw TypeError(`cannot settle a foreign command buffer view`);
      if (!n39) return;
      if (i36.resources === this.#f && i36.fresh.size === 0) {
        this.#p = i36.buffers;
        return;
      }
      let e30 = new Set(i36.resources.values()), a34 = /* @__PURE__ */ new Set([...this.#f.values(), ...i36.fresh]);
      for (let t32 of a34) e30.has(t32) || this.#x(t32);
      this.#f = i36.resources, this.#p = i36.buffers;
    } finally {
      if (!n39 && i36 !== void 0) for (let e30 of i36.fresh) this.#x(e30);
      this.#i.settle(e29, n39);
    }
  }
  dispose() {
    if (!this.#m) {
      this.#m = true;
      for (let e29 of this.#f.values()) this.#x(e29);
      this.#f.clear(), this.#p.clear(), this.#i.dispose();
    }
  }
  #h(e29) {
    let t31 = this.#o.get(e29);
    if (t31 !== void 0) return t31;
    let n39 = this.#i.programIdentity(e29), r34 = this.#a.get(n39);
    return t31 = this.#e.schema.program(this.#t, r34), this.#o.set(e29, t31), t31;
  }
  #g(e29, t31) {
    let n39 = this.#s.get(e29);
    if (n39 !== void 0) return n39;
    let r34 = this.#i.bufferIdentity(e29), i36 = t31.get(r34.id)?.value;
    if (i36 === void 0) throw Error(`command references an unknown buffer binding`);
    return this.#s.set(e29, i36), i36;
  }
  #_(e29, t31, n39) {
    let r34 = n39.get(e29);
    if (r34 !== void 0) return r34;
    let i36 = this.#i.resourceIdentity(e29), a34 = t31.get(i36.id)?.value;
    if (a34 === void 0) throw Error(`command references an unknown resource binding`);
    return n39.set(e29, a34), a34;
  }
  #v(e29) {
    if (e29 === void 0) return;
    let t31 = this.#c.get(e29);
    return t31 === void 0 && (t31 = this.#e.schema.material(this.#t, this.#n(this.#i.materialBinding(e29))), this.#c.set(e29, t31)), t31;
  }
  #y(e29, t31) {
    let n39 = this.#l.get(e29);
    return n39 === void 0 && (n39 = this.#e.schema.transform(this.#t, this.#r(e29), t31), this.#l.set(e29, n39)), n39;
  }
  #b(e29, t31) {
    if (t31 === `placement`) return Object.freeze({ kind: `placement` });
    let n39 = this.#a.get(e29).buffers.find((e30) => e30.id === t31);
    return Object.freeze({ kind: `codec`, value: n39 });
  }
  #x(e29) {
    e29.lease.dispose(), e29.payload.dispose();
  }
  #S() {
    if (this.#m) throw Error(`command binding engine is disposed`);
  }
};

// node_modules/@pmndrs/glyph/dist/internal/glyph-plan-target.js
function t27(e29) {
  return new r32(e29);
}
function n36(e29, t31, n39, r34) {
  if (t31.aborted) return { accepted: false, error: t31.reason };
  let i36, a34, o34, s33 = false;
  try {
    return i36 = n39.source(e29, t31), a34 = n39.project(i36), o34 = r34.decode(a34), s33 = true, o34.commit(), n39.settle(i36, a34, true), { accepted: true };
  } catch (e30) {
    try {
      o34?.discard();
    } catch {
    }
    if (i36 !== void 0) try {
      n39.settle(i36, a34, s33);
    } catch {
    }
    return { accepted: false, error: e30 };
  }
}
var r32 = class {
  delivery = `borrowed`;
  #e;
  #t;
  #n;
  #r;
  #i = new AbortController();
  #a = Object.freeze({ committed: false });
  #o = Object.freeze([]);
  #s = false;
  constructor(t31) {
    this.#e = i33({ config: t31.config, codec: t31.codec, boundary: t31.boundary, materialInput: t31.materialInput, transformInput: t31.transformInput }), this.#t = t31.defaultRenderer;
    let n39 = t31.config.renderer(Object.freeze({ boundary: t31.boundary, signal: this.#i.signal, codec: t31.codec, ...t31.defaultRenderer === void 0 ? {} : { defaultRenderer: t31.defaultRenderer } }));
    this.#n = n39, this.#r = Object.freeze({ decode: (e29) => {
      let t32 = n39.decode(e29), r34 = e29.displayList.kind === `replace` ? Object.freeze(Array.from(e29.displayList.value.transforms, ({ value: e30 }) => Object.freeze({ transform: e30 }))) : this.#o, i36 = false;
      return Object.freeze({ result: t32.result, commit: () => {
        if (i36) throw Error(`Glyph renderer preparation is already settled`);
        i36 = true, t32.commit(), this.#a = Object.freeze({ committed: true, value: t32.result }), this.#o = r34;
      }, discard: () => {
        i36 || (i36 = true, t32.discard());
      } });
    }, syncTransforms: (e29) => n39.syncTransforms(e29), dispose: () => n39.dispose() });
  }
  get lastResult() {
    if (!this.#a.committed) throw Error(`Glyph plan target has not committed a renderer result`);
    return this.#a.value;
  }
  accept(e29, t31) {
    return this.#s ? { accepted: false, error: Error(`Glyph plan target has been disposed`) } : n36(e29, t31, this.#e, this.#r);
  }
  syncTransforms(e29 = this.#o) {
    if (this.#s) throw Error(`Glyph plan target has been disposed`);
    this.#r.syncTransforms(e29);
  }
  dispose() {
    if (this.#s) return;
    this.#s = true, this.#i.abort(new DOMException(`Glyph plan target disposed`, `AbortError`));
    let e29, t31 = (t32) => {
      try {
        t32();
      } catch (t33) {
        e29 ??= t33;
      }
    };
    if (t31(() => this.#r.dispose()), this.#t !== void 0 && this.#t !== this.#n && t31(() => this.#t?.dispose()), t31(() => this.#e.dispose()), e29 !== void 0) throw e29;
  }
};

// node_modules/@pmndrs/glyph/dist/internal/configured-handle.js
var l24 = Object.freeze({ maxParagraphs: 4096, maxClusters: 65536, maxLines: 65536, maxRegions: 65536, maxExclusions: 65536, maxInlineObjects: 65536, maxSlotsPerBand: 32, maxOutputBytes: 67108864 });
function u24(e29, t31) {
  return new d18(e29, t31).handle;
}
var d18 = class {
  handle;
  #e;
  #t;
  #n;
  #r;
  #i;
  #a = /* @__PURE__ */ new Map();
  #o = 0;
  #s = false;
  #c = false;
  constructor(e29, t31) {
    this.#e = e29, this.#t = t31, this.#n = p22(e29.engine, { integration: e29.name });
    let n39;
    try {
      this.#r = this.#n.installCodec((r35) => {
        let i36 = t31.encode({ integration: e29.name, ids: r35 });
        return n39 = i36, i36.descriptor;
      });
    } catch (e30) {
      throw this.#n.dispose(), e30;
    }
    if (n39 === void 0) throw this.#r.dispose(), this.#n.dispose(), Error(`GlyphConfig.encode() did not produce a Codec`);
    this.#i = n39;
    let r34;
    try {
      r34 = this.#l(void 0);
    } catch (e30) {
      try {
        this.#r.dispose();
      } catch {
      }
      try {
        this.#i.dispose?.();
      } catch {
      }
      try {
        this.#n.dispose();
      } catch {
      }
      throw e30;
    }
    this.handle = this.#d(r34);
  }
  #l(e29) {
    this.#h();
    let t31 = this.#a.get(e29);
    if (t31 !== void 0) return t31;
    let n39 = new f22(this.#e.engine, this.#n, this.#r, this.#i, this.#t, () => this.#p()), r34, i36 = false, a34 = Object.freeze({ name: e29, codec: this.#i, config: this.#t, fonts: this.#e.fonts, services: n39, create: (t32, a35) => {
      if (i36) throw Error(`Glyph root recipe may call context.create() only once`);
      i36 = true, n39.activate(a35);
      let o34 = this.#u(e29, t32, n39, a35.dispose);
      return r34 = o34, o34;
    } });
    try {
      let t32 = this.#t.root.create(a34);
      if (!i36 || t32 !== r34 || t32.name !== e29 || typeof t32.dispose != `function`) throw TypeError(`GlyphConfig.root.create() must return context.create(...)`);
      return this.#a.set(e29, t32), t32;
    } catch (e30) {
      try {
        r34?.dispose();
      } catch {
      }
      throw n39.dispose(), e30;
    }
  }
  #u(e29, t31, n39, r34) {
    let i36 = false, a34 = /* @__PURE__ */ new Map(), o34 = () => {
      if (i36) return;
      i36 = true, this.#a.delete(e29);
      let t32;
      try {
        n39.dispose();
      } catch (e30) {
        t32 = e30;
      }
      try {
        r34?.();
      } catch (e30) {
        t32 ??= e30;
      }
      if (t32 !== void 0) throw t32;
    };
    return new Proxy(t31, { has: (e30, t32) => t32 === `name` || t32 === `handle` || t32 === `disposed` || t32 === `dispose` || Reflect.has(e30, t32), get: (t32, n40) => {
      if (n40 === `name`) return e29;
      if (n40 === `handle`) return this.handle;
      if (n40 === `disposed`) return i36;
      if (n40 === `dispose`) return o34;
      let r35 = Reflect.get(t32, n40, t32);
      if (typeof r35 != `function`) return r35;
      let s33 = a34.get(n40);
      if (s33 === void 0) {
        let e30 = r35.bind(t32);
        a34.set(n40, e30), s33 = e30;
      }
      return s33;
    }, set: (e30, t32, n40) => t32 === `name` || t32 === `handle` || t32 === `disposed` || t32 === `dispose` ? false : Reflect.set(e30, t32, n40, e30) });
  }
  #d(e29) {
    let t31 = (e30) => {
      if (typeof e30 != `string` || e30.trim().length === 0) throw TypeError(`Glyph named-root selection requires a nonempty string`);
      return this.#l(e30);
    }, n39 = /* @__PURE__ */ new Map(), r34 = () => this.#f();
    return new Proxy(t31, { has: (t32, n40) => n40 === `name` || n40 === `handle` || n40 === `disposed` || n40 === `dispose` || Reflect.has(e29, n40), get: (t32, i36) => {
      if (i36 === `name`) return;
      if (i36 === `handle`) return this.handle;
      if (i36 === `disposed`) return this.#c;
      if (i36 === `dispose`) return r34;
      let a34 = Reflect.get(e29, i36, e29);
      if (typeof a34 != `function`) return a34;
      let o34 = n39.get(i36);
      if (o34 === void 0) {
        let t33 = a34.bind(e29);
        n39.set(i36, t33), o34 = t33;
      }
      return o34;
    }, set: (t32, n40, r35) => n40 === `name` || n40 === `handle` || n40 === `disposed` || n40 === `dispose` ? false : Reflect.set(e29, n40, r35, e29) });
  }
  #f() {
    if (this.#c) return;
    this.#c = true;
    let e29;
    for (let t31 of [...this.#a.values()]) try {
      t31.dispose();
    } catch (t32) {
      e29 ??= t32;
    }
    this.#a.clear();
    try {
      this.#e.released(this.handle);
    } catch (t31) {
      e29 ??= t31;
    }
    if (this.#o === 0) try {
      this.#m();
    } catch (t31) {
      e29 ??= t31;
    }
    if (e29 !== void 0) throw e29;
  }
  #p() {
    this.#h(), this.#o += 1;
    let e29 = false;
    return () => {
      if (!e29) {
        if (e29 = true, this.#o <= 0) throw Error(`Glyph handle copy lease underflow`);
        --this.#o, this.#c && this.#o === 0 && this.#m();
      }
    };
  }
  #m() {
    if (this.#s) return;
    this.#s = true;
    let e29;
    try {
      this.#r.dispose();
    } catch (t31) {
      e29 = t31;
    }
    try {
      this.#i.dispose?.();
    } catch (t31) {
      e29 ??= t31;
    }
    try {
      this.#n.dispose();
    } catch (t31) {
      e29 ??= t31;
    }
    if (e29 !== void 0) throw e29;
  }
  #h() {
    if (this.#c) throw Error(`Glyph handle ${JSON.stringify(this.#e.name)} has been disposed`);
  }
};
var f22 = class {
  #e;
  #t;
  #n;
  #r;
  #i;
  #a;
  #o = /* @__PURE__ */ new WeakMap();
  #s = /* @__PURE__ */ new WeakMap();
  #c = /* @__PURE__ */ new Map();
  #l = /* @__PURE__ */ new WeakMap();
  #u = /* @__PURE__ */ new Map();
  #d = /* @__PURE__ */ new WeakMap();
  #f = 1;
  #p;
  #m;
  #h;
  #g;
  #_;
  #v = false;
  #y = false;
  constructor(e29, t31, n39, r34, i36, a34) {
    this.#e = e29, this.#t = t31, this.#n = n39, this.#r = r34, this.#i = i36, this.#a = a34;
  }
  activate(e29) {
    if (this.#p !== void 0) throw Error(`Glyph root services are already active`);
    let t31 = t27({ config: this.#i, codec: this.#r, boundary: e29.boundary, ...e29.defaultRenderer === void 0 ? {} : { defaultRenderer: e29.defaultRenderer }, materialInput: (e30) => this.#C(e30), transformInput: (e30) => this.#w(e30) }), n39, r34, a34;
    try {
      let o34 = this.#i.commands, c30 = this.#r.capabilitySet ?? 0;
      n39 = this.#t.createRootPlanner({ codec: this.#n, capabilitySetIndex: c30, target: () => t31, limits: o34?.limits ?? l24, requestCapacity: o34?.requestBytes ?? 65536, resultCapacity: o34?.resultBytes ?? 262144, textCapacity: o34?.textUnits ?? 64 }), r34 = m19(this.#e, { stage: () => this.#k(), accepted: () => this.#A(), rejected: (e30) => this.#j(e30) });
      let u28 = r34;
      a34 = se2(n39, () => u28.invalidate()), this.#p = n39, this.#m = t31, this.#_ = e29.shape, this.#h = r34, this.#g = a34;
    } catch (e30) {
      try {
        a34?.();
      } catch {
      }
      try {
        r34?.dispose();
      } catch {
      }
      try {
        n39 === void 0 ? t31.dispose() : n39.dispose();
      } catch {
      }
      throw e30;
    }
  }
  createText(e29) {
    return new m21(this.#O(), this, e29);
  }
  invalidate() {
    this.#O(), this.#v = true, this.#h.invalidate();
  }
  syncTransforms() {
    this.#O(), this.#m.syncTransforms();
  }
  copy(e29, t31, n39) {
    if (this.#O(), !(e29 instanceof m21) || !e29.belongsTo(this)) throw TypeError(`Glyph copy source must be a live Text controller from this root`);
    let r34 = this.#a(), i36;
    try {
      i36 = t27({ config: this.#i, codec: this.#r, boundary: n39.boundary, defaultRenderer: n39.renderer, materialInput: (e30) => this.#C(e30), transformInput: (e30) => this.#w(e30) });
    } catch (e30) {
      throw r34(), e30;
    }
    let a34;
    try {
      a34 = t31.kind === `glyphs` ? e29.copyGlyphs(t31.stableIds, i36) : e29.copyDecorations(i36);
    } catch (e30) {
      try {
        i36.dispose();
      } finally {
        r34();
      }
      throw e30;
    }
    if (!a34.accepted) {
      try {
        i36.dispose();
      } finally {
        r34();
      }
      throw a34.error;
    }
    let o34 = false;
    return Object.freeze({ result: i36.lastResult, syncTransforms: () => i36.syncTransforms(), dispose: () => {
      if (!o34) {
        o34 = true;
        try {
          i36.dispose();
        } finally {
          r34();
        }
      }
    } });
  }
  bind(e29) {
    let t31 = [];
    try {
      let n39 = this.#x(e29.font);
      t31.push(n39);
      let r34 = this.#T(e29.transform, t31), i36 = e29.material === void 0 ? void 0 : this.#S(e29.material, t31), a34 = typeof e29.text == `string` ? e29.text : this.#b(e29.text, t31), o34 = e29.flow === void 0 ? void 0 : y19(e29.flow, r34);
      return { options: Object.freeze({ font: n39, text: a34, transform: r34, ...i36 === void 0 ? {} : { material: i36 }, ...e29.order === void 0 ? {} : { order: e29.order }, ...e29.rasterPixelRatio === void 0 ? {} : { rasterPixelRatio: e29.rasterPixelRatio }, ...e29.style === void 0 ? {} : { style: e29.style }, ...e29.layout === void 0 ? {} : { layout: e29.layout }, ...e29.constraints === void 0 ? {} : { constraints: e29.constraints }, ...o34 === void 0 ? {} : { flow: o34 } }), leases: t31 };
    } catch (e30) {
      for (let e31 of t31.reverse()) e31.dispose();
      throw e30;
    }
  }
  bindParagraphOrderScope(e29) {
    if (e29 === void 0) return 0;
    if (typeof e29 != `object` || !e29) throw TypeError(`paragraph order scope must be an object`);
    let t31 = this.#d.get(e29);
    if (t31 === void 0) {
      if (this.#f > 4294967295) throw RangeError(`paragraph order scopes are exhausted`);
      t31 = this.#f, this.#f += 1, this.#d.set(e29, t31);
    }
    return t31;
  }
  assertTextCall() {
    this.#O();
  }
  dispose() {
    if (!this.#y) {
      this.#y = true, this.#g?.(), this.#g = void 0, this.#h?.dispose(), this.#h = void 0, this.#_ = void 0, this.#p?.dispose(), this.#p = void 0, this.#m = void 0;
      for (let e29 of this.#c.values()) e29.canonical.dispose();
      this.#c.clear();
      for (let e29 of this.#u.values()) e29.canonical.dispose();
      this.#u.clear();
    }
  }
  #b(e29, t31) {
    return Object.freeze({ text: e29.text, spans: Object.freeze(e29.spans.map((e30) => {
      let n39 = e30.font === void 0 ? void 0 : this.#x(e30.font);
      n39 !== void 0 && t31.push(n39);
      let r34 = e30.material === void 0 ? void 0 : this.#S(e30.material, t31);
      return Object.freeze({ start: e30.start, end: e30.end, ...n39 === void 0 ? {} : { font: n39 }, ...r34 === void 0 ? {} : { material: r34 }, ...e30.style === void 0 ? {} : { style: e30.style } });
    })) });
  }
  #x(n39) {
    if (`fonts` in n39) return this.#t.bindFontStack(n39);
    let r34 = o(n39)[0], i36 = this.#o.get(r34);
    if (i36 === void 0) {
      let t31 = i(r34);
      i36 = () => this.#t.bindFontStack(t31), this.#o.set(r34, i36);
    }
    return i36();
  }
  #S(e29, t31) {
    let n39 = this.#c.get(e29);
    if (n39 === void 0 || n39.canonical.disposed) {
      let t32 = this.#t.createMaterialBinding();
      n39 = { canonical: t32, references: 0 }, this.#c.set(e29, n39), this.#s.set(t32, e29);
    }
    let r34 = this.#t._retainOpaqueBinding(n39.canonical, `material`);
    return n39.references += 1, t31.push(this.#E(e29, n39, r34)), r34.binding;
  }
  #C(e29) {
    let t31 = this.#s.get(e29);
    if (t31 === void 0) throw Error(`command references an unknown adapter material`);
    return t31;
  }
  #w(e29) {
    let t31 = this.#l.get(e29);
    if (t31 === void 0) throw Error(`command references an unknown adapter transform`);
    return t31;
  }
  #T(e29, t31) {
    let n39 = this.#u.get(e29);
    if (n39 === void 0 || n39.canonical.disposed) {
      let t32 = this.#t.createTransformBinding();
      n39 = { canonical: t32, references: 0 }, this.#u.set(e29, n39), this.#l.set(t32, e29);
    }
    let r34 = this.#t._retainOpaqueBinding(n39.canonical, `transform`);
    return n39.references += 1, t31.push(this.#D(e29, n39, r34)), r34.binding;
  }
  #E(e29, t31, n39) {
    let r34 = false;
    return { dispose: () => {
      r34 || (r34 = true, n39.dispose(), --t31.references, t31.references === 0 && this.#c.get(e29) === t31 && (this.#c.delete(e29), t31.canonical.dispose()));
    } };
  }
  #D(e29, t31, n39) {
    let r34 = false;
    return { dispose: () => {
      r34 || (r34 = true, n39.dispose(), --t31.references, t31.references === 0 && this.#u.get(e29) === t31 && (this.#u.delete(e29), t31.canonical.dispose()));
    } };
  }
  #O() {
    if (this.#y) throw Error(`Glyph root services have been disposed`);
    if (this.#p === void 0) throw Error(`Glyph root services were used before context.create()`);
    return this.#p;
  }
  #k() {
    let e29 = this.#O(), t31 = this.#v;
    this.#v = false;
    let n39 = this.#_?.prepare?.();
    if (n39 !== false) return T10(e29, n39, t31);
  }
  #A() {
    let e29 = this.#m;
    if (e29 === void 0) throw Error(`Glyph root accepted shape after disposal`);
    this.#_?.accepted?.(e29.lastResult);
  }
  #j(e29) {
    this.#_?.rejected?.(e29);
  }
};
function p24(e29) {
  if (!Number.isFinite(e29)) throw RangeError(`paragraph order rank must be finite`);
  return e29 === 0 ? 0 : e29;
}
var m21 = class {
  #e;
  #t;
  #n;
  #r;
  #i = { style: void 0, layout: void 0, constraints: void 0, flow: void 0 };
  #a = false;
  constructor(e29, t31, n39) {
    this.#e = t31;
    let r34 = h21(void 0, this.#i, n39);
    this.#r = r34, this.#n = t31.bind(r34);
    try {
      this.#t = e29.createText(this.#n.options);
    } catch (e30) {
      throw this.#o(this.#n.leases), e30;
    }
    _17(this.#i, n39);
  }
  get disposed() {
    return this.#a;
  }
  update(e29) {
    this.#s(), this.#e.assertTextCall();
    let t31 = h21(this.#r, this.#i, e29), n39 = v19(this.#r, t31);
    if (n39 !== void 0) {
      this.#t.update(n39), this.#r = t31, _17(this.#i, e29);
      return;
    }
    let r34 = this.#e.bind(t31);
    try {
      this.#t.update({ ...r34.options, material: r34.options.material, order: r34.options.order, rasterPixelRatio: r34.options.rasterPixelRatio, style: r34.options.style, layout: r34.options.layout, constraints: r34.options.constraints, flow: r34.options.flow });
    } catch (e30) {
      throw this.#o(r34.leases), e30;
    }
    let i36 = this.#n;
    this.#n = r34, this.#r = t31, _17(this.#i, e29), this.#o(i36.leases);
  }
  updateParagraphOrder(e29, t31, n39) {
    this.#s(), this.#e.assertTextCall();
    let r34 = p24(n39);
    this.#t.updateOrder(e29, this.#e.bindParagraphOrderScope(t31), r34);
  }
  measure() {
    return this.#s(), this.#e.assertTextCall(), this.#t.measure();
  }
  measureInk() {
    return this.#s(), this.#e.assertTextCall(), this.#t.measureInk();
  }
  inspect() {
    return this.#s(), this.#e.assertTextCall(), this.#t.glyphs();
  }
  withGlyphs(e29) {
    return this.#s(), this.#e.assertTextCall(), this.#t.withGlyphs(e29);
  }
  belongsTo(e29) {
    return !this.#a && e29 === this.#e;
  }
  copyGlyphs(e29, t31) {
    return this.#s(), this.#t.copyGlyphs(e29, t31);
  }
  copyDecorations(e29) {
    return this.#s(), this.#t.copyDecorations(e29);
  }
  dispose() {
    if (!this.#a) {
      this.#a = true;
      try {
        this.#t.dispose();
      } finally {
        this.#o(this.#n.leases);
      }
    }
  }
  #o(e29) {
    for (let t31 of [...e29].reverse()) t31.dispose();
  }
  #s() {
    if (this.#a) throw Error(`Glyph Text controller has been disposed`);
  }
};
function h21(e29, t31, r34) {
  let i36 = { ...r34 };
  return r34.style !== void 0 && (i36.style = g20(e29?.style, t31.style, r34.style, `Glyph Text style`)), r34.layout !== void 0 && (i36.layout = g20(e29?.layout, t31.layout, r34.layout, `Glyph Text layout`)), r34.constraints !== void 0 && (i36.constraints = g20(e29?.constraints, t31.constraints, r34.constraints, `Glyph Text constraints`)), r34.flow !== void 0 && (i36.flow = e29?.flow !== void 0 && t31.flow === r34.flow ? e29.flow : u15(r34.flow, `Glyph Text flow`)), i36;
}
function g20(e29, t31, n39, i36) {
  return e29 !== void 0 && t31 === n39 ? e29 : t24(e29, n39, i36);
}
function _17(e29, t31) {
  e29.style = t31.style, e29.layout = t31.layout, e29.constraints = t31.constraints, e29.flow = t31.flow;
}
function v19(e29, t31) {
  if (typeof e29.text != `string` || typeof t31.text != `string` || e29.font !== t31.font || e29.transform !== t31.transform || e29.material !== t31.material || e29.flow !== t31.flow) return;
  let n39 = {};
  return e29.text !== t31.text && (n39.text = t31.text), e29.order !== t31.order && (n39.order = t31.order), e29.rasterPixelRatio !== t31.rasterPixelRatio && (n39.rasterPixelRatio = t31.rasterPixelRatio), e29.style !== t31.style && (n39.style = t31.style), e29.layout !== t31.layout && (n39.layout = t31.layout), e29.constraints !== t31.constraints && (n39.constraints = t31.constraints), n39;
}
function y19(e29, t31) {
  return Object.freeze({ regions: Object.freeze(e29.regions.map((e30) => {
    let n39 = b16(e30.shape), r34 = e30.clip ?? n39;
    return Object.freeze({ region: Object.freeze({ key: e30.key, transform: t31, shape: e30.shape.kind, ...e30.shape.kind === `polygon` ? { vertices: Object.freeze(e30.shape.vertices.map(([e31, t32]) => Object.freeze({ inline: e31, block: t32 }))) } : {}, writingMode: `horizontal-tb`, textOrientation: `mixed`, inlineStart: n39[0], blockStart: n39[1], inlineEnd: n39[2], blockEnd: n39[3], clipInlineStart: r34[0], clipBlockStart: r34[1], clipInlineEnd: r34[2], clipBlockEnd: r34[3] }), ...e30.exclusions === void 0 ? {} : { exclusions: Object.freeze(e30.exclusions.map((e31) => {
      let t32 = b16(e31.shape);
      return Object.freeze({ key: e31.key, shape: e31.shape.kind, ...e31.shape.kind === `polygon` ? { vertices: Object.freeze(e31.shape.vertices.map(([e32, t33]) => Object.freeze({ inline: e32, block: t33 }))) } : {}, wrapSide: e31.wrapSide ?? `both`, inlineStart: t32[0], blockStart: t32[1], inlineEnd: t32[2], blockEnd: t32[3], marginInline: e31.marginInline ?? 0, marginBlock: e31.marginBlock ?? 0 });
    })) } });
  })) });
}
function b16(e29) {
  if (e29.kind === `rectangle`) return e29.bounds;
  let t31 = 1 / 0, n39 = 1 / 0, r34 = -1 / 0, i36 = -1 / 0;
  for (let [a34, o34] of e29.vertices) t31 = Math.min(t31, a34), n39 = Math.min(n39, o34), r34 = Math.max(r34, a34), i36 = Math.max(i36, o34);
  return [t31, n39, r34, i36];
}

// node_modules/@pmndrs/glyph/dist/glyph.js
var o31 = class {
  #e = /* @__PURE__ */ new Map();
  fontLibrary;
  #t;
  #n;
  constructor(e29) {
    this.fontLibrary = e29;
  }
  get initialized() {
    return this.#t !== void 0;
  }
  init(e29 = {}) {
    if (this.#n !== void 0) return this.#n;
    let t31 = u22(e29).then((e30) => {
      this.#t = e30;
    });
    return this.#n = t31, t31;
  }
  handle(e29, n39) {
    let r34 = this.#t;
    if (r34 === void 0) throw Error(`await glyph.init() before creating a Glyph handle`);
    if (typeof e29 != `string` || e29.trim().length === 0) throw TypeError(`Glyph handle name must be a nonempty string`);
    if (typeof n39 != `object` || !n39 || Array.isArray(n39)) throw TypeError(`Glyph handle config must be a GlyphConfig object`);
    for (let e30 of [`encode`, `resolve`, `renderer`]) if (typeof n39[e30] != `function`) throw TypeError(`GlyphConfig.${e30} must be a function`);
    if (typeof n39.root != `object` || n39.root === null || typeof n39.root.create != `function`) throw TypeError(`GlyphConfig.root must define create`);
    if (typeof n39.schema != `object` || n39.schema === null) throw TypeError(`GlyphConfig.schema must be an object`);
    for (let e30 of [`program`, `buffer`, `material`, `transform`, `batch`, `instance`, `instanceSpan`]) if (typeof n39.schema[e30] != `function`) throw TypeError(`GlyphConfig.schema must define ${e30}`);
    if (n39.fonts !== void 0 && (typeof n39.fonts != `object` || n39.fonts === null || typeof n39.fonts.default != `string` || typeof n39.fonts.formats != `object` || n39.fonts.formats === null)) throw TypeError(`GlyphConfig.fonts needs a default key and format map`);
    if (this.#e.has(e29)) throw Error(`Glyph handle ${JSON.stringify(e29)} already exists`);
    let i36 = n39.fonts === void 0 ? void 0 : new S9(n39.fonts.formats, n39.fonts.default), o34 = Object.freeze({ name: e29, engine: r34, fonts: i36, released: (t31) => {
      this.#e.get(e29) === t31 && this.#e.delete(e29), i36?.dispose();
    } }), s33 = (() => {
      try {
        return u24(o34, n39);
      } catch (e30) {
        throw i36?.dispose(), e30;
      }
    })();
    return this.#e.set(e29, s33), s33;
  }
  shape() {
    let e29 = this.#t;
    if (e29 === void 0) throw Error(`await glyph.init() before calling glyph.shape()`);
    h19(e29);
  }
  fontFace(e29, t31 = {}) {
    return g13(this.fontLibrary, e29, t31);
  }
};
var s30 = import.meta.hot;
var c26 = s30?.data.glyphRuntime ?? new o31(me());
s30?.dispose((e29) => {
  e29.glyphRuntime = c26;
});
var l25 = c26;

// node_modules/@pmndrs/glyph/dist/config/glyph.js
function e26(e29) {
  if (typeof e29 != `object` || !e29 || Array.isArray(e29)) throw TypeError(`Glyph schema must be an object`);
  for (let t31 of [`program`, `buffer`, `material`, `transform`, `batch`, `instance`, `instanceSpan`]) if (typeof e29[t31] != `function`) throw TypeError(`Glyph schema ${t31} must be a function`);
  return Object.freeze({ ...e29 });
}
function t28(e29) {
  return e29;
}
function n37(e29, t31) {
  if (typeof e29 != `object` && typeof e29 != `function` || e29 === null) throw TypeError(`Glyph resource lease value must be an object`);
  if (typeof t31 != `function`) throw TypeError(`Glyph resource lease release must be a function`);
  let n39 = false;
  return Object.freeze({ value: e29, get disposed() {
    return n39;
  }, dispose() {
    n39 || (n39 = true, t31());
  } });
}

// node_modules/@pmndrs/glyph/dist/core.js
init_msdf_contract();
init_slug_contract();

// node_modules/@pmndrs/glyph/dist/generated/bitmap-baker-abi.js
var e27 = { endianness: `little`, functions: { allocate: { export: `pmndrs_bitmap_baker_alloc`, parameters: [`byteLength`], result: `pointer` }, bake: { export: `pmndrs_bitmap_baker_bake`, parameters: [`sourcePointer`, `sourceByteLength`, `requestPointer`, `requestByteLength`], result: `responsePointer` }, deallocate: { export: `pmndrs_bitmap_baker_dealloc`, parameters: [`pointer`, `byteLength`] }, responseByteLength: { export: `pmndrs_bitmap_baker_result_len`, parameters: [], result: `byteLength` } }, imports: { progress: { module: `env`, name: `pmndrs_glyph_bake_progress`, parameters: [`completed`, `total`] } }, memory: `memory`, name: `pmndrs-glyph-bitmap-baker`, pointerWidth: 32, response: { artifactByteLengthOffset: 12, headerAlignment: 4, headerByteLength: 16, magic: `PMBM`, magicOffset: 0, metadataByteLengthOffset: 8, payloadOffset: 16, statusOffset: 4, successStatus: 0 }, version: 0, versions: { bitmapFormat: 0, generator: `0.0.0`, ktx2: `0.5.0`, readFonts: `0.42.1`, skrifa: `0.45.1`, zeno: `0.3.3` } };

// node_modules/@pmndrs/glyph/dist/bakers/bitmap.js
init_glyph_error();
init_bitmap_contract();

// node_modules/@pmndrs/glyph/dist/internal/successful-promise-cache.js
function e28(e29) {
  let t31;
  return () => {
    if (t31 === void 0) {
      let n39 = Promise.resolve().then(e29).catch((e30) => {
        throw t31 === n39 && (t31 = void 0), e30;
      });
      t31 = n39;
    }
    return t31;
  };
}

// node_modules/@pmndrs/glyph/dist/internal/raster-baker-wasm.js
init_fingerprint();
var t29 = new TextEncoder();
var n38 = new TextDecoder();
async function r33(e29, t31 = {}) {
  let n39 = e29 instanceof WebAssembly.Module ? e29 : await WebAssembly.compile(e29);
  return WebAssembly.instantiate(n39, t31);
}
function i34(e29, n39, r34) {
  let i36 = a33(e29.exports, n39, r34.label);
  return { bake({ source: e30, request: a34 }) {
    let o34 = t29.encode(JSON.stringify(a34)), u28 = 0, d24 = 0, f26 = 0, p28 = 0, m24 = false;
    try {
      return u28 = s31(i36, e30, r34.label), d24 = s31(i36, o34, r34.label), f26 = h22(i36.bake(u28, e30.byteLength, d24, o34.byteLength)), p28 = h22(i36.responseLength()), f26 === 0 && p28 === 0 && i36.segmented !== void 0 ? (m24 = true, c27(i36, n39, r34)) : l26(g21(i36.memory, f26, p28, r34.label), n39, r34);
    } finally {
      u28 && i36.deallocate(u28, e30.byteLength), d24 && i36.deallocate(d24, o34.byteLength), f26 && p28 && i36.deallocate(f26, p28), m24 && i36.segmented?.release();
    }
  } };
}
function a33(e29, t31, n39) {
  let r34 = e29[t31.memory], i36 = e29[t31.functions.allocate.export], a34 = e29[t31.functions.deallocate.export], s33 = e29[t31.functions.bake.export], c30 = e29[t31.functions.responseByteLength.export];
  if (!(r34 instanceof WebAssembly.Memory) || typeof i36 != `function` || typeof a34 != `function` || typeof s33 != `function` || typeof c30 != `function`) throw TypeError(`invalid ${n39} Wasm exports`);
  let l29 = o32(e29, t31, n39);
  return { memory: r34, allocate: i36, deallocate: a34, bake: s33, responseLength: c30, ...l29 === void 0 ? {} : { segmented: l29 } };
}
function o32(e29, t31, n39) {
  if (t31.segmented === void 0) return;
  let r34 = t31.segmented.functions, i36 = { status: e29[r34.status.export], metadataPointer: e29[r34.metadataPointer.export], metadataByteLength: e29[r34.metadataByteLength.export], artifactCount: e29[r34.artifactCount.export], artifactByteLength: e29[r34.artifactByteLength.export], chunkPointer: e29[r34.chunkPointer.export], chunkByteLength: e29[r34.chunkByteLength.export], release: e29[r34.release.export] };
  if (Object.values(i36).some((e30) => typeof e30 != `function`)) throw TypeError(`invalid ${n39} segmented Wasm exports`);
  return i36;
}
function s31(e29, t31, n39) {
  let r34 = h22(e29.allocate(t31.byteLength));
  if (r34 === 0 && t31.byteLength !== 0) throw RangeError(`${n39} Wasm allocation failed`);
  try {
    return g21(e29.memory, r34, t31.byteLength, n39).set(t31), r34;
  } catch (n40) {
    throw r34 && e29.deallocate(r34, t31.byteLength), n40;
  }
}
function c27(e29, t31, r34) {
  let i36 = t31.segmented, a34 = e29.segmented;
  if (i36 === void 0 || a34 === void 0) throw TypeError(`${r34.label} did not expose its declared segmented response`);
  let o34 = h22(a34.status());
  if (o34 === i36.unavailableStatus) throw TypeError(`${r34.label} returned neither a direct nor segmented response`);
  let s33 = h22(a34.metadataByteLength()), c30 = h22(a34.metadataPointer());
  if (s33 === 0 || c30 === 0) throw TypeError(`${r34.label} returned empty segmented metadata`);
  let l29 = JSON.parse(n38.decode(g21(e29.memory, c30, s33, r34.label)));
  if (o34 !== t31.response.successStatus) throw r34.createError(m22(l29, r34.label));
  let d24 = h22(a34.artifactCount());
  if (!x17(l29) || !Array.isArray(l29.artifacts) || d24 !== l29.artifacts.length) throw TypeError(`${r34.label} segmented artifact count does not match its metadata`);
  let f26 = Array(d24), p28 = 0;
  for (let e30 = 0; e30 < d24; e30 += 1) {
    let t32 = h22(a34.artifactByteLength(e30));
    if (!Number.isSafeInteger(t32) || t32 <= 0) throw TypeError(`${r34.label} returned an invalid segmented artifact length`);
    f26[e30] = t32, p28 = _18(p28, t32, 2 ** 53 - 1, r34.label);
  }
  u25(l29, p28, r34);
  let v22 = l29, y22 = v22.artifacts.map((t32, n39) => {
    let o35 = f26[n39];
    if (o35 === void 0 || o35 !== t32.byteLength) throw TypeError(`${r34.label} segmented artifact length does not match its directory`);
    let s34 = new Uint8Array(o35), c31 = 0;
    for (; c31 < o35; ) {
      let t33 = h22(a34.chunkByteLength(n39, c31)), l30 = h22(a34.chunkPointer(n39, c31)), u28 = o35 - c31;
      if (l30 === 0 || !Number.isSafeInteger(t33) || t33 <= 0 || t33 > i36.chunkByteLength || t33 > u28) throw TypeError(`${r34.label} returned an invalid segmented artifact chunk`);
      s34.set(g21(e29.memory, l30, t33, r34.label), c31), c31 += t33;
    }
    return { role: t32.role, id: t32.id, bytes: s34, fingerprint: t32.fingerprint };
  });
  return { rasterKey: v22.rasterKey, kind: v22.kind, extension: v22.extension, version: v22.version, artifacts: y22, report: v22.report };
}
function l26(e29, t31, r34) {
  let i36 = t31.response;
  if (e29.byteLength < i36.headerByteLength) throw TypeError(`${r34.label} response is shorter than its ABI header`);
  if (n38.decode(e29.subarray(i36.magicOffset, i36.magicOffset + i36.magic.length)) !== i36.magic) throw TypeError(`${r34.label} response magic does not match its ABI`);
  let a34 = new DataView(e29.buffer, e29.byteOffset, e29.byteLength), o34 = a34.getUint32(i36.statusOffset, true), s33 = a34.getUint32(i36.metadataByteLengthOffset, true), c30 = a34.getUint32(i36.artifactByteLengthOffset, true), l29 = i36.payloadOffset, d24 = _18(l29, s33, e29.byteLength, r34.label);
  if (_18(d24, c30, e29.byteLength, r34.label) !== e29.byteLength) throw TypeError(`${r34.label} response carries undeclared trailing bytes`);
  let f26 = JSON.parse(n38.decode(e29.subarray(l29, d24)));
  if (o34 !== i36.successStatus) throw r34.createError(m22(f26, r34.label));
  u25(f26, c30, r34);
  let p28 = f26, h24 = p28.artifacts.map((t32) => ({ role: t32.role, id: t32.id, bytes: e29.subarray(d24 + t32.byteOffset, d24 + t32.byteOffset + t32.byteLength).slice(), fingerprint: t32.fingerprint }));
  return { rasterKey: p28.rasterKey, kind: p28.kind, extension: p28.extension, version: p28.version, artifacts: h24, report: p28.report };
}
function u25(e29, t31, n39) {
  if (!x17(e29) || e29.kind !== n39.kind || e29.extension !== n39.extension || e29.version !== n39.version || !b18(e29.rasterKey) || !Array.isArray(e29.artifacts) || !f23(e29.report, n39.pageFormat)) throw TypeError(`${n39.label} returned invalid result metadata`);
  let r34 = 0;
  for (let i36 of e29.artifacts) {
    if (!d21(i36) || i36.id.length === 0 || i36.byteOffset !== r34 || i36.byteLength <= 0) throw TypeError(`${n39.label} returned an invalid artifact directory`);
    r34 = _18(i36.byteOffset, i36.byteLength, t31, n39.label);
  }
  if (r34 !== t31) throw TypeError(`${n39.label} artifact directory does not cover its payload`);
}
function d21(e29) {
  return x17(e29) && e29.role === `raster` && typeof e29.id == `string` && b18(e29.fingerprint) && Number.isSafeInteger(e29.byteOffset) && Number.isSafeInteger(e29.byteLength);
}
function f23(e29, t31) {
  return x17(e29) && v20(e29.metadataBytes) && v20(e29.serializedBytes) && v20(e29.gpuBytes) && Array.isArray(e29.pages) && e29.pages.every((e30) => p25(e30, t31));
}
function p25(e29, t31) {
  return x17(e29) && y20(e29.width) && y20(e29.height) && e29.format === t31 && y20(e29.gpuBytes) && (e29.source === `embedded` || e29.source === `external`) && y20(e29.encodedBytes);
}
function m22(e29, t31) {
  if (!x17(e29) || typeof e29.code != `string` || typeof e29.message != `string` || e29.path !== void 0 && typeof e29.path != `string`) throw TypeError(`${t31} returned invalid error metadata`);
  return { code: e29.code, message: e29.message, ...e29.path === void 0 ? {} : { path: e29.path } };
}
function h22(e29) {
  return e29 >>> 0;
}
function g21(e29, t31, n39, r34) {
  let i36 = t31 + n39;
  if (!Number.isSafeInteger(t31) || !Number.isSafeInteger(n39) || t31 < 0 || n39 < 0 || !Number.isSafeInteger(i36) || i36 > e29.buffer.byteLength) throw TypeError(`${r34} memory range is outside linear memory`);
  return new Uint8Array(e29.buffer, t31, n39);
}
function _18(e29, t31, n39, r34) {
  let i36 = e29 + t31;
  if (!Number.isSafeInteger(e29) || !Number.isSafeInteger(t31) || t31 < 0 || !Number.isSafeInteger(i36) || i36 > n39) throw TypeError(`${r34} response range is outside its payload`);
  return i36;
}
function v20(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 >= 0;
}
function y20(e29) {
  return typeof e29 == `number` && Number.isSafeInteger(e29) && e29 > 0;
}
function b18(t31) {
  return n2(t31);
}
function x17(e29) {
  return typeof e29 == `object` && !!e29 && !Array.isArray(e29);
}

// node_modules/@pmndrs/glyph/dist/bakers/bitmap.js
var c28 = class extends e3 {
  reason;
  path;
  constructor(e29) {
    super(`bake-failed`, e29.message), this.name = `BitmapBakeError`, this.reason = e29.code, this.path = e29.path;
  }
};
async function l27(e29) {
  let t31, n39 = u26(await r33(e29, { env: { pmndrs_glyph_bake_progress(e30, n40) {
    t31?.({ stage: `raster`, phase: `rasterizing`, completed: e30, total: n40 });
  } } }));
  return { bake(e30) {
    t31 = e30.onProgress;
    try {
      return n39.bake(e30);
    } finally {
      t31 = void 0;
    }
  } };
}
function u26(t31) {
  return i34(t31, e27, { label: `bitmap baker`, kind: n10, extension: r13, version: 0, pageFormat: `r8unorm`, createError: (e29) => new c28(e29) });
}
function d22(e29) {
  return { kind: n10, extension: r13, version: 0, descriptor: c13, async bake(t31) {
    t31.signal?.throwIfAborted();
    let n39 = e29.bake({ source: t31.font.source, ...t31.onProgress === void 0 ? {} : { onProgress: t31.onProgress }, request: { sourceFingerprint: t31.font.sourceFingerprint, fontFaceIndex: t31.font.fontFaceIndex, glyphCount: t31.font.glyphCount, shapingFingerprint: t31.font.shapingFingerprint, rasterKey: t31.rasterKey, packaging: t31.packaging, descriptor: t31.descriptor } });
    return t31.signal?.throwIfAborted(), n39;
  } };
}
async function f24() {
  let e29 = new URL(`../../dist/bitmap-baker.wasm`, void 0), t31;
  if (e29.protocol === `file:`) {
    let { readFile: n39 } = await import("node:fs/promises");
    t31 = await n39(e29);
  } else {
    let n39 = await fetch(e29);
    if (!n39.ok) throw Error(`Unable to load bitmap baker Wasm (${n39.status})`);
    t31 = await n39.arrayBuffer();
  }
  return d22(await l27(t31));
}
var p26 = e28(f24);

// scripts/glyph-entry.js
init_loader();
init_font_baker();

// node_modules/@pmndrs/glyph/dist/internal/font-bake-pipeline.js
init_font_artifact_reader();
init_font_selection();

// node_modules/@pmndrs/glyph/dist/internal/compose-bake.js
init_glyph_error();
init_fingerprint();
init_raster_identity();
init_glb_reader();
var o33 = class extends e3 {
  reason;
  path;
  constructor(e29, t31, n39) {
    super(`bake-failed`, t31), this.name = `BakeCompositionError`, this.reason = e29, this.path = n39;
  }
};
async function s32(e29, r34) {
  let i36 = g22(e29.artifacts.filter(({ role: e30 }) => e30 === `font`), `CORE_ARTIFACT`, `font bake result must contain exactly one font artifact`), o34 = h23(i36);
  if (r34.length === 0) return { artifacts: [o34], report: u27(e29, [], [o34]), warnings: e29.warnings };
  let s33 = r20(i36.bytes), f26 = structuredClone(s33.document), v22 = _19(f26.extensions, `/extensions`), T13 = _19(v22.PMNDRS_font, `/extensions/PMNDRS_font`), D12 = _19(T13.shaping, `/extensions/PMNDRS_font/shaping`), O11 = _19(T13.metrics, `/extensions/PMNDRS_font/metrics`), k11 = S16(D12.fingerprint, `/extensions/PMNDRS_font/shaping/fingerprint`), A10 = S16(_19(T13.provenance, `/extensions/PMNDRS_font/provenance`).sourceFingerprint, `/extensions/PMNDRS_font/provenance/sourceFingerprint`), j9 = x18(O11.glyphCount, `/extensions/PMNDRS_font/metrics/glyphCount`), M9 = x18(O11.glyphIdWidth, `/extensions/PMNDRS_font/metrics/glyphIdWidth`);
  M9 !== 16 && E12(`GLYPH_ID_WIDTH`, `V0 composition requires 16-bit glyph IDs`);
  let N9 = y21(T13.rasters, `/extensions/PMNDRS_font/rasters`);
  N9.length !== 0 && E12(`CORE_ALREADY_COMPOSED`, `composition input must be the shaping-only core artifact`);
  let P8 = b19(f26.extensionsUsed, `/extensionsUsed`), F8 = b19(f26.extensionsRequired, `/extensionsRequired`), I6 = y21(f26.bufferViews, `/bufferViews`), L5 = [s33.bin.subarray(0, s33.declaredBinLength)], R5 = s33.declaredBinLength, z4 = /* @__PURE__ */ new Set(), B4 = /* @__PURE__ */ new Set(), V4 = [];
  for (let e30 = 0; e30 < r34.length; e30 += 1) {
    let { raster: t31, packaging: n39, companionName: i37 } = r34[e30], o35 = `/rasters/${e30}`;
    z4.has(t31.rasterKey) && E12(`RASTER_KEY_DUPLICATE`, `composition contains a duplicate raster key`, `${o35}/rasterKey`), z4.add(t31.rasterKey);
    let s34 = t31.artifacts.map(h23), u28 = g22(s34.filter(({ role: e31 }) => e31 === `raster`), `RASTER_ARTIFACT`, `raster bake result must contain exactly one companion artifact`, `${o35}/artifacts`);
    s34.some(({ role: e31 }) => e31 !== `raster`) && E12(`RASTER_ARTIFACT_ROLE`, `raster results may contain only one raster artifact`, `${o35}/artifacts`);
    let d24 = r20(u28.bytes), f27 = _19(_19(d24.document.extensions, `${o35}/extensions`)[t31.extension], `${o35}/extensions/${t31.extension}`);
    if (c29(f27, t31, k11, A10, j9, M9, `${o35}/extensions/${t31.extension}`), n39.artifact === `external`) {
      N9.push({ rasterKey: t31.rasterKey, kind: t31.kind, extension: t31.extension, version: t31.version, source: { type: `external`, uri: i37 ?? u28.id } }), V4.push(...s34.map((e31) => e31.role === `raster` && i37 !== void 0 ? { ...e31, id: i37 } : e31));
      continue;
    }
    (B4.has(t31.extension) || v22[t31.extension] !== void 0) && E12(`RASTER_EXTENSION_DUPLICATE`, `only one raster may be embedded for each companion extension`, `${o35}/extension`), B4.add(t31.extension);
    let p28 = y21(d24.document.bufferViews, `${o35}/bufferViews`), m24 = I6.length, b20 = C16(R5);
    b20 !== R5 && L5.push(new Uint8Array(b20 - R5)), L5.push(d24.bin.subarray(0, d24.declaredBinLength)), R5 = w14(b20, d24.declaredBinLength, `${o35}/binary`);
    for (let e31 = 0; e31 < p28.length; e31 += 1) {
      let t32 = structuredClone(_19(p28[e31], `${o35}/bufferViews/${e31}`));
      t32.byteOffset = w14(b20, t32.byteOffset === void 0 ? 0 : x18(t32.byteOffset, `${o35}/bufferViews/${e31}/byteOffset`), `${o35}/bufferViews/${e31}`), I6.push(t32);
    }
    v22[t31.extension] = l28(structuredClone(f27), m24, p28.length, `${o35}/extensions/${t31.extension}`), P8.includes(t31.extension) || P8.push(t31.extension), N9.push({ rasterKey: t31.rasterKey, kind: t31.kind, extension: t31.extension, version: t31.version, source: { type: `embedded` } });
  }
  f26.extensionsUsed = P8, f26.extensionsRequired = F8, _19(y21(f26.buffers, `/buffers`)[0], `/buffers/0`).byteLength = R5;
  let H4 = p27(f26, m23(L5, R5)), U4 = [{ role: `font`, id: i36.id, bytes: H4, fingerprint: t2(H4, e4.artifact) }, ...V4];
  return d23(U4), { artifacts: U4, report: u27(e29, r34, U4), warnings: e29.warnings };
}
function c29(e29, t31, n39, r34, a34, o34, s33) {
  let c30 = c2({ glyphCount: a34, glyphIdWidth: o34, kind: t31.kind, rasterKey: t31.rasterKey, shaping: n39, source: r34, version: t31.version });
  e29.fingerprint !== c30 && E12(`RASTER_RECIPROCAL_IDENTITY`, `companion fingerprint ${String(e29.fingerprint)} does not match the core's ${c30}; rebake this font's rasters`, s33);
}
function l28(e29, t31, n39, r34) {
  if (Array.isArray(e29)) return e29.map((e30, i37) => l28(e30, t31, n39, `${r34}/${i37}`));
  if (typeof e29 != `object` || !e29) return e29;
  let i36 = {};
  for (let [a34, o34] of Object.entries(e29)) {
    let e30 = `${r34}/${a34}`;
    if (a34 === `bufferView` || a34.endsWith(`BufferView`)) {
      let r35 = x18(o34, e30);
      r35 >= n39 && E12(`RASTER_BUFFER_VIEW_RANGE`, `companion bufferView reference is out of range`, e30), i36[a34] = w14(r35, t31, e30);
    } else i36[a34] = l28(o34, t31, n39, e30);
  }
  return i36;
}
function u27(e29, t31, n39) {
  let r34 = e29.report.shared.shaping;
  return { source: e29.report.source, shared: { shaping: { ...r34, rawBytes: r34.totalRawBytes } }, rasters: t31.map(({ raster: e30 }) => ({ kind: e30.kind, ...e30.report })), containers: t31.length === 0 ? e29.report.containers : n39.map((e30) => f25(e30)), transport: t31.length === 0 ? e29.report.transport : n39.map(({ id: e30, bytes: t32 }) => ({ artifactId: e30, format: `raw`, bytes: t32.byteLength })) };
}
function d23(e29) {
  let t31 = /* @__PURE__ */ new Set();
  for (let n39 = 0; n39 < e29.length; n39 += 1) {
    let r34 = e29[n39].id;
    (r34.length === 0 || t31.has(r34)) && E12(`ARTIFACT_ID`, `composed artifact IDs must be nonempty and unique`, `/artifacts/${n39}/id`), t31.add(r34);
  }
}
function f25(e29) {
  let t31 = T12(e29.bytes, 12), n39 = e29.bytes.subarray(20, 20 + t31), r34 = n39.byteLength;
  for (; r34 > 0 && n39[r34 - 1] === 32; ) --r34;
  let i36 = r20(e29.bytes);
  return { artifactId: e29.id, role: e29.role, jsonBytes: r34, paddingBytes: t31 - r34 + i36.bin.byteLength - i36.declaredBinLength, totalBytes: e29.bytes.byteLength };
}
function p27(e29, t31) {
  let n39 = new TextEncoder().encode(JSON.stringify(e29)), r34 = C16(n39.byteLength), i36 = C16(t31.byteLength), a34 = w14(28, w14(r34, i36, `/glb`), `/glb`);
  a34 > 4294967295 && E12(`GLB_TOO_LARGE`, `composed GLB exceeds uint32 length`);
  let o34 = new Uint8Array(a34);
  o34.fill(32, 20, 20 + r34);
  let s33 = new DataView(o34.buffer);
  s33.setUint32(0, 1179937895, true), s33.setUint32(4, 2, true), s33.setUint32(8, a34, true), s33.setUint32(12, r34, true), s33.setUint32(16, 1313821514, true), o34.set(n39, 20);
  let c30 = 20 + r34;
  return s33.setUint32(c30, i36, true), s33.setUint32(c30 + 4, 5130562, true), o34.set(t31, c30 + 8), o34;
}
function m23(e29, t31) {
  let n39 = new Uint8Array(t31), r34 = 0;
  for (let t32 of e29) n39.set(t32, r34), r34 += t32.byteLength;
  return r34 !== t31 && E12(`BINARY_LENGTH`, `composed binary parts have inconsistent length`), n39;
}
function h23(e29) {
  let r34 = S16(e29.fingerprint, `/artifact/fingerprint`);
  return r34 !== t2(e29.bytes, e4.artifact) && E12(`ARTIFACT_FINGERPRINT`, `artifact bytes do not match their stamped fingerprint`, `/artifact/fingerprint`), { ...e29, fingerprint: r34 };
}
function g22(e29, t31, n39, r34) {
  return e29.length !== 1 && E12(t31, n39, r34), e29[0];
}
function _19(e29, t31) {
  return v21(e29, t31), e29;
}
function v21(e29, t31) {
  (typeof e29 != `object` || !e29 || Array.isArray(e29)) && E12(`TYPE_OBJECT`, `value must be an object`, t31);
}
function y21(e29, t31) {
  return Array.isArray(e29) || E12(`TYPE_ARRAY`, `value must be an array`, t31), e29;
}
function b19(e29, t31) {
  return y21(e29, t31).map((e30, n39) => (typeof e30 != `string` && E12(`TYPE_STRING`, `value must be a string`, `${t31}/${n39}`), e30));
}
function x18(e29, t31) {
  return (typeof e29 != `number` || !Number.isSafeInteger(e29) || e29 < 0) && E12(`TYPE_INTEGER`, `value must be a nonnegative safe integer`, t31), e29;
}
function S16(e29, t31) {
  return n2(e29) || E12(`TYPE_FINGERPRINT`, `value must be a lowercase 128-bit fingerprint`, t31), e29;
}
function C16(e29) {
  e29 > 2 ** 53 - 1 - 3 && E12(`ARITHMETIC_OVERFLOW`, `alignment overflowed`);
  let t31 = e29 % 4;
  return t31 === 0 ? e29 : e29 + 4 - t31;
}
function w14(e29, t31, n39) {
  let r34 = e29 + t31;
  return Number.isSafeInteger(r34) || E12(`ARITHMETIC_OVERFLOW`, `integer sum overflowed`, n39), r34;
}
function T12(e29, t31) {
  return new DataView(e29.buffer, e29.byteOffset, e29.byteLength).getUint32(t31, true);
}
function E12(e29, t31, n39) {
  throw new o33(e29, t31, n39);
}

// node_modules/@pmndrs/glyph/dist/internal/font-bake-pipeline.js
init_core_bake_policy();
async function i35(i36) {
  let a34 = { coreBake: 0, rasterBake: 0, compose: 0, validate: 0 };
  i36.signal?.throwIfAborted();
  let o34 = performance.now(), s33 = i36.unicodeRanges === void 0 ? void 0 : i36.fontBaker.prepare({ source: i36.source, selection: { formatVersion: 0, fontFaceIndex: i36.fontFaceIndex, unicodeRanges: t13(i36.unicodeRanges) } }), c30 = s33?.bytes ?? i36.source, l29 = s33?.report.fontFaceIndex ?? i36.fontFaceIndex, u28 = i36.fontBaker.bake({ source: c30, descriptor: { formatVersion: 0, fontFaceIndex: l29 } });
  a34.coreBake = performance.now() - o34, i36.signal?.throwIfAborted();
  let d24 = t16(u28);
  i36.validateArtifact !== void 0 && (o34 = performance.now(), await i36.validateArtifact(d24.bytes), a34.validate += performance.now() - o34);
  let f26 = i19(d24.bytes);
  o34 = performance.now();
  let p28 = [];
  for (let e29 of i36.rasters) {
    i36.signal?.throwIfAborted();
    let t31 = await e29.baker.bake({ font: { source: c30, sourceFingerprint: f26.sourceFingerprint, fontFaceIndex: l29, glyphCount: f26.extension.metrics.glyphCount, shapingFingerprint: f26.shapingFingerprint }, rasterKey: e29.rasterKey, packaging: e29.packaging, descriptor: e29.descriptor, ...i36.signal === void 0 ? {} : { signal: i36.signal }, ...i36.onProgress === void 0 ? {} : { onProgress: i36.onProgress } });
    p28.push({ raster: t31, packaging: e29.packaging, ...e29.companionName === void 0 ? {} : { companionName: e29.companionName } });
  }
  a34.rasterBake = performance.now() - o34, o34 = performance.now();
  let m24 = await s32(u28, p28);
  return a34.compose = performance.now() - o34, i36.signal?.throwIfAborted(), i36.validateArtifact !== void 0 && (o34 = performance.now(), await i36.validateArtifact(m24.artifacts[0].bytes), a34.validate += performance.now() - o34), { composed: m24, ...s33 === void 0 ? {} : { preparation: s33.report }, timings: a34 };
}

// node_modules/@pmndrs/glyph/dist/internal/raster-bake-plan.js
function t30(e29, t31, n39, r34) {
  return { baker: { kind: e29.kind, extension: e29.extension, version: e29.version, bake(t32) {
    let { descriptor: r35, ...i36 } = t32;
    return e29.bake({ ...i36, descriptor: n39 });
  } }, packaging: t31, descriptor: n39, rasterKey: r34 };
}

// node_modules/opentype.js/dist/opentype.module.js
if (!String.prototype.codePointAt) {
  (function() {
    var defineProperty = function() {
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch (error) {
      }
      return result;
    }();
    var codePointAt = function(position) {
      if (this == null) {
        throw TypeError();
      }
      var string = String(this);
      var size = string.length;
      var index = position ? Number(position) : 0;
      if (index != index) {
        index = 0;
      }
      if (index < 0 || index >= size) {
        return void 0;
      }
      var first = string.charCodeAt(index);
      var second;
      if (
        // check if it’s the start of a surrogate pair
        first >= 55296 && first <= 56319 && // high surrogate
        size > index + 1
      ) {
        second = string.charCodeAt(index + 1);
        if (second >= 56320 && second <= 57343) {
          return (first - 55296) * 1024 + second - 56320 + 65536;
        }
      }
      return first;
    };
    if (defineProperty) {
      defineProperty(String.prototype, "codePointAt", {
        "value": codePointAt,
        "configurable": true,
        "writable": true
      });
    } else {
      String.prototype.codePointAt = codePointAt;
    }
  })();
}
var TINF_OK = 0;
var TINF_DATA_ERROR = -3;
function Tree() {
  this.table = new Uint16Array(16);
  this.trans = new Uint16Array(288);
}
function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  this.dest = dest;
  this.destLen = 0;
  this.ltree = new Tree();
  this.dtree = new Tree();
}
var sltree = new Tree();
var sdtree = new Tree();
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);
var clcidx = new Uint8Array([
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
]);
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);
function tinf_build_bits_base(bits, base, delta, first) {
  var i36, sum;
  for (i36 = 0; i36 < delta; ++i36) {
    bits[i36] = 0;
  }
  for (i36 = 0; i36 < 30 - delta; ++i36) {
    bits[i36 + delta] = i36 / delta | 0;
  }
  for (sum = first, i36 = 0; i36 < 30; ++i36) {
    base[i36] = sum;
    sum += 1 << bits[i36];
  }
}
function tinf_build_fixed_trees(lt2, dt2) {
  var i36;
  for (i36 = 0; i36 < 7; ++i36) {
    lt2.table[i36] = 0;
  }
  lt2.table[7] = 24;
  lt2.table[8] = 152;
  lt2.table[9] = 112;
  for (i36 = 0; i36 < 24; ++i36) {
    lt2.trans[i36] = 256 + i36;
  }
  for (i36 = 0; i36 < 144; ++i36) {
    lt2.trans[24 + i36] = i36;
  }
  for (i36 = 0; i36 < 8; ++i36) {
    lt2.trans[24 + 144 + i36] = 280 + i36;
  }
  for (i36 = 0; i36 < 112; ++i36) {
    lt2.trans[24 + 144 + 8 + i36] = 144 + i36;
  }
  for (i36 = 0; i36 < 5; ++i36) {
    dt2.table[i36] = 0;
  }
  dt2.table[5] = 32;
  for (i36 = 0; i36 < 32; ++i36) {
    dt2.trans[i36] = i36;
  }
}
var offs = new Uint16Array(16);
function tinf_build_tree(t31, lengths2, off, num) {
  var i36, sum;
  for (i36 = 0; i36 < 16; ++i36) {
    t31.table[i36] = 0;
  }
  for (i36 = 0; i36 < num; ++i36) {
    t31.table[lengths2[off + i36]]++;
  }
  t31.table[0] = 0;
  for (sum = 0, i36 = 0; i36 < 16; ++i36) {
    offs[i36] = sum;
    sum += t31.table[i36];
  }
  for (i36 = 0; i36 < num; ++i36) {
    if (lengths2[off + i36]) {
      t31.trans[offs[lengths2[off + i36]]++] = i36;
    }
  }
}
function tinf_getbit(d24) {
  if (!d24.bitcount--) {
    d24.tag = d24.source[d24.sourceIndex++];
    d24.bitcount = 7;
  }
  var bit = d24.tag & 1;
  d24.tag >>>= 1;
  return bit;
}
function tinf_read_bits(d24, num, base) {
  if (!num) {
    return base;
  }
  while (d24.bitcount < 24) {
    d24.tag |= d24.source[d24.sourceIndex++] << d24.bitcount;
    d24.bitcount += 8;
  }
  var val = d24.tag & 65535 >>> 16 - num;
  d24.tag >>>= num;
  d24.bitcount -= num;
  return val + base;
}
function tinf_decode_symbol(d24, t31) {
  while (d24.bitcount < 24) {
    d24.tag |= d24.source[d24.sourceIndex++] << d24.bitcount;
    d24.bitcount += 8;
  }
  var sum = 0, cur = 0, len = 0;
  var tag = d24.tag;
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;
    sum += t31.table[len];
    cur -= t31.table[len];
  } while (cur >= 0);
  d24.tag = tag;
  d24.bitcount -= len;
  return t31.trans[sum + cur];
}
function tinf_decode_trees(d24, lt2, dt2) {
  var hlit, hdist, hclen;
  var i36, num, length;
  hlit = tinf_read_bits(d24, 5, 257);
  hdist = tinf_read_bits(d24, 5, 1);
  hclen = tinf_read_bits(d24, 4, 4);
  for (i36 = 0; i36 < 19; ++i36) {
    lengths[i36] = 0;
  }
  for (i36 = 0; i36 < hclen; ++i36) {
    var clen = tinf_read_bits(d24, 3, 0);
    lengths[clcidx[i36]] = clen;
  }
  tinf_build_tree(code_tree, lengths, 0, 19);
  for (num = 0; num < hlit + hdist; ) {
    var sym = tinf_decode_symbol(d24, code_tree);
    switch (sym) {
      case 16:
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d24, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        for (length = tinf_read_bits(d24, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        for (length = tinf_read_bits(d24, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        lengths[num++] = sym;
        break;
    }
  }
  tinf_build_tree(lt2, lengths, 0, hlit);
  tinf_build_tree(dt2, lengths, hlit, hdist);
}
function tinf_inflate_block_data(d24, lt2, dt2) {
  while (1) {
    var sym = tinf_decode_symbol(d24, lt2);
    if (sym === 256) {
      return TINF_OK;
    }
    if (sym < 256) {
      d24.dest[d24.destLen++] = sym;
    } else {
      var length, dist, offs2;
      var i36;
      sym -= 257;
      length = tinf_read_bits(d24, length_bits[sym], length_base[sym]);
      dist = tinf_decode_symbol(d24, dt2);
      offs2 = d24.destLen - tinf_read_bits(d24, dist_bits[dist], dist_base[dist]);
      for (i36 = offs2; i36 < offs2 + length; ++i36) {
        d24.dest[d24.destLen++] = d24.dest[i36];
      }
    }
  }
}
function tinf_inflate_uncompressed_block(d24) {
  var length, invlength;
  var i36;
  while (d24.bitcount > 8) {
    d24.sourceIndex--;
    d24.bitcount -= 8;
  }
  length = d24.source[d24.sourceIndex + 1];
  length = 256 * length + d24.source[d24.sourceIndex];
  invlength = d24.source[d24.sourceIndex + 3];
  invlength = 256 * invlength + d24.source[d24.sourceIndex + 2];
  if (length !== (~invlength & 65535)) {
    return TINF_DATA_ERROR;
  }
  d24.sourceIndex += 4;
  for (i36 = length; i36; --i36) {
    d24.dest[d24.destLen++] = d24.source[d24.sourceIndex++];
  }
  d24.bitcount = 0;
  return TINF_OK;
}
function tinf_uncompress(source, dest) {
  var d24 = new Data(source, dest);
  var bfinal, btype, res;
  do {
    bfinal = tinf_getbit(d24);
    btype = tinf_read_bits(d24, 2, 0);
    switch (btype) {
      case 0:
        res = tinf_inflate_uncompressed_block(d24);
        break;
      case 1:
        res = tinf_inflate_block_data(d24, sltree, sdtree);
        break;
      case 2:
        tinf_decode_trees(d24, d24.ltree, d24.dtree);
        res = tinf_inflate_block_data(d24, d24.ltree, d24.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }
    if (res !== TINF_OK) {
      throw new Error("Data error");
    }
  } while (!bfinal);
  if (d24.destLen < d24.dest.length) {
    if (typeof d24.dest.slice === "function") {
      return d24.dest.slice(0, d24.destLen);
    } else {
      return d24.dest.subarray(0, d24.destLen);
    }
  }
  return d24.dest;
}
tinf_build_fixed_trees(sltree, sdtree);
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);
length_bits[28] = 0;
length_base[28] = 258;
var tinyInflate = tinf_uncompress;
function derive(v0, v1, v22, v32, t31) {
  return Math.pow(1 - t31, 3) * v0 + 3 * Math.pow(1 - t31, 2) * t31 * v1 + 3 * (1 - t31) * Math.pow(t31, 2) * v22 + Math.pow(t31, 3) * v32;
}
function BoundingBox() {
  this.x1 = Number.NaN;
  this.y1 = Number.NaN;
  this.x2 = Number.NaN;
  this.y2 = Number.NaN;
}
BoundingBox.prototype.isEmpty = function() {
  return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};
BoundingBox.prototype.addPoint = function(x19, y22) {
  if (typeof x19 === "number") {
    if (isNaN(this.x1) || isNaN(this.x2)) {
      this.x1 = x19;
      this.x2 = x19;
    }
    if (x19 < this.x1) {
      this.x1 = x19;
    }
    if (x19 > this.x2) {
      this.x2 = x19;
    }
  }
  if (typeof y22 === "number") {
    if (isNaN(this.y1) || isNaN(this.y2)) {
      this.y1 = y22;
      this.y2 = y22;
    }
    if (y22 < this.y1) {
      this.y1 = y22;
    }
    if (y22 > this.y2) {
      this.y2 = y22;
    }
  }
};
BoundingBox.prototype.addX = function(x19) {
  this.addPoint(x19, null);
};
BoundingBox.prototype.addY = function(y22) {
  this.addPoint(null, y22);
};
BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x22, y22, x19, y23) {
  var p0 = [x0, y0];
  var p1 = [x1, y1];
  var p28 = [x22, y22];
  var p32 = [x19, y23];
  this.addPoint(x0, y0);
  this.addPoint(x19, y23);
  for (var i36 = 0; i36 <= 1; i36++) {
    var b20 = 6 * p0[i36] - 12 * p1[i36] + 6 * p28[i36];
    var a34 = -3 * p0[i36] + 9 * p1[i36] - 9 * p28[i36] + 3 * p32[i36];
    var c30 = 3 * p1[i36] - 3 * p0[i36];
    if (a34 === 0) {
      if (b20 === 0) {
        continue;
      }
      var t31 = -c30 / b20;
      if (0 < t31 && t31 < 1) {
        if (i36 === 0) {
          this.addX(derive(p0[i36], p1[i36], p28[i36], p32[i36], t31));
        }
        if (i36 === 1) {
          this.addY(derive(p0[i36], p1[i36], p28[i36], p32[i36], t31));
        }
      }
      continue;
    }
    var b2ac = Math.pow(b20, 2) - 4 * c30 * a34;
    if (b2ac < 0) {
      continue;
    }
    var t1 = (-b20 + Math.sqrt(b2ac)) / (2 * a34);
    if (0 < t1 && t1 < 1) {
      if (i36 === 0) {
        this.addX(derive(p0[i36], p1[i36], p28[i36], p32[i36], t1));
      }
      if (i36 === 1) {
        this.addY(derive(p0[i36], p1[i36], p28[i36], p32[i36], t1));
      }
    }
    var t210 = (-b20 - Math.sqrt(b2ac)) / (2 * a34);
    if (0 < t210 && t210 < 1) {
      if (i36 === 0) {
        this.addX(derive(p0[i36], p1[i36], p28[i36], p32[i36], t210));
      }
      if (i36 === 1) {
        this.addY(derive(p0[i36], p1[i36], p28[i36], p32[i36], t210));
      }
    }
  }
};
BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x19, y22) {
  var cp1x = x0 + 2 / 3 * (x1 - x0);
  var cp1y = y0 + 2 / 3 * (y1 - y0);
  var cp2x = cp1x + 1 / 3 * (x19 - x0);
  var cp2y = cp1y + 1 / 3 * (y22 - y0);
  this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x19, y22);
};
function Path() {
  this.commands = [];
  this.fill = "black";
  this.stroke = null;
  this.strokeWidth = 1;
}
Path.prototype.moveTo = function(x19, y22) {
  this.commands.push({
    type: "M",
    x: x19,
    y: y22
  });
};
Path.prototype.lineTo = function(x19, y22) {
  this.commands.push({
    type: "L",
    x: x19,
    y: y22
  });
};
Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x22, y22, x19, y23) {
  this.commands.push({
    type: "C",
    x1,
    y1,
    x2: x22,
    y2: y22,
    x: x19,
    y: y23
  });
};
Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x19, y22) {
  this.commands.push({
    type: "Q",
    x1,
    y1,
    x: x19,
    y: y22
  });
};
Path.prototype.close = Path.prototype.closePath = function() {
  this.commands.push({
    type: "Z"
  });
};
Path.prototype.extend = function(pathOrCommands) {
  if (pathOrCommands.commands) {
    pathOrCommands = pathOrCommands.commands;
  } else if (pathOrCommands instanceof BoundingBox) {
    var box = pathOrCommands;
    this.moveTo(box.x1, box.y1);
    this.lineTo(box.x2, box.y1);
    this.lineTo(box.x2, box.y2);
    this.lineTo(box.x1, box.y2);
    this.close();
    return;
  }
  Array.prototype.push.apply(this.commands, pathOrCommands);
};
Path.prototype.getBoundingBox = function() {
  var box = new BoundingBox();
  var startX = 0;
  var startY = 0;
  var prevX = 0;
  var prevY = 0;
  for (var i36 = 0; i36 < this.commands.length; i36++) {
    var cmd = this.commands[i36];
    switch (cmd.type) {
      case "M":
        box.addPoint(cmd.x, cmd.y);
        startX = prevX = cmd.x;
        startY = prevY = cmd.y;
        break;
      case "L":
        box.addPoint(cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;
      case "Q":
        box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;
      case "C":
        box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        prevX = cmd.x;
        prevY = cmd.y;
        break;
      case "Z":
        prevX = startX;
        prevY = startY;
        break;
      default:
        throw new Error("Unexpected path command " + cmd.type);
    }
  }
  if (box.isEmpty()) {
    box.addPoint(0, 0);
  }
  return box;
};
Path.prototype.draw = function(ctx) {
  ctx.beginPath();
  for (var i36 = 0; i36 < this.commands.length; i36 += 1) {
    var cmd = this.commands[i36];
    if (cmd.type === "M") {
      ctx.moveTo(cmd.x, cmd.y);
    } else if (cmd.type === "L") {
      ctx.lineTo(cmd.x, cmd.y);
    } else if (cmd.type === "C") {
      ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === "Q") {
      ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
    } else if (cmd.type === "Z") {
      ctx.closePath();
    }
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  if (this.stroke) {
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }
};
Path.prototype.toPathData = function(decimalPlaces) {
  decimalPlaces = decimalPlaces !== void 0 ? decimalPlaces : 2;
  function floatToString(v22) {
    if (Math.round(v22) === v22) {
      return "" + Math.round(v22);
    } else {
      return v22.toFixed(decimalPlaces);
    }
  }
  function packValues() {
    var arguments$1 = arguments;
    var s33 = "";
    for (var i37 = 0; i37 < arguments.length; i37 += 1) {
      var v22 = arguments$1[i37];
      if (v22 >= 0 && i37 > 0) {
        s33 += " ";
      }
      s33 += floatToString(v22);
    }
    return s33;
  }
  var d24 = "";
  for (var i36 = 0; i36 < this.commands.length; i36 += 1) {
    var cmd = this.commands[i36];
    if (cmd.type === "M") {
      d24 += "M" + packValues(cmd.x, cmd.y);
    } else if (cmd.type === "L") {
      d24 += "L" + packValues(cmd.x, cmd.y);
    } else if (cmd.type === "C") {
      d24 += "C" + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    } else if (cmd.type === "Q") {
      d24 += "Q" + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
    } else if (cmd.type === "Z") {
      d24 += "Z";
    }
  }
  return d24;
};
Path.prototype.toSVG = function(decimalPlaces) {
  var svg = '<path d="';
  svg += this.toPathData(decimalPlaces);
  svg += '"';
  if (this.fill && this.fill !== "black") {
    if (this.fill === null) {
      svg += ' fill="none"';
    } else {
      svg += ' fill="' + this.fill + '"';
    }
  }
  if (this.stroke) {
    svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
  }
  svg += "/>";
  return svg;
};
Path.prototype.toDOMElement = function(decimalPlaces) {
  var temporaryPath = this.toPathData(decimalPlaces);
  var newPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  newPath.setAttribute("d", temporaryPath);
  return newPath;
};
function fail(message) {
  throw new Error(message);
}
function argument(predicate, message) {
  if (!predicate) {
    fail(message);
  }
}
var check = { fail, argument, assert: argument };
var LIMIT16 = 32768;
var LIMIT32 = 2147483648;
var decode = {};
var encode = {};
var sizeOf = {};
function constant(v22) {
  return function() {
    return v22;
  };
}
encode.BYTE = function(v22) {
  check.argument(v22 >= 0 && v22 <= 255, "Byte value should be between 0 and 255.");
  return [v22];
};
sizeOf.BYTE = constant(1);
encode.CHAR = function(v22) {
  return [v22.charCodeAt(0)];
};
sizeOf.CHAR = constant(1);
encode.CHARARRAY = function(v22) {
  if (typeof v22 === "undefined") {
    v22 = "";
    console.warn("Undefined CHARARRAY encountered and treated as an empty string. This is probably caused by a missing glyph name.");
  }
  var b20 = [];
  for (var i36 = 0; i36 < v22.length; i36 += 1) {
    b20[i36] = v22.charCodeAt(i36);
  }
  return b20;
};
sizeOf.CHARARRAY = function(v22) {
  if (typeof v22 === "undefined") {
    return 0;
  }
  return v22.length;
};
encode.USHORT = function(v22) {
  return [v22 >> 8 & 255, v22 & 255];
};
sizeOf.USHORT = constant(2);
encode.SHORT = function(v22) {
  if (v22 >= LIMIT16) {
    v22 = -(2 * LIMIT16 - v22);
  }
  return [v22 >> 8 & 255, v22 & 255];
};
sizeOf.SHORT = constant(2);
encode.UINT24 = function(v22) {
  return [v22 >> 16 & 255, v22 >> 8 & 255, v22 & 255];
};
sizeOf.UINT24 = constant(3);
encode.ULONG = function(v22) {
  return [v22 >> 24 & 255, v22 >> 16 & 255, v22 >> 8 & 255, v22 & 255];
};
sizeOf.ULONG = constant(4);
encode.LONG = function(v22) {
  if (v22 >= LIMIT32) {
    v22 = -(2 * LIMIT32 - v22);
  }
  return [v22 >> 24 & 255, v22 >> 16 & 255, v22 >> 8 & 255, v22 & 255];
};
sizeOf.LONG = constant(4);
encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;
encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;
encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;
encode.LONGDATETIME = function(v22) {
  return [0, 0, 0, 0, v22 >> 24 & 255, v22 >> 16 & 255, v22 >> 8 & 255, v22 & 255];
};
sizeOf.LONGDATETIME = constant(8);
encode.TAG = function(v22) {
  check.argument(v22.length === 4, "Tag should be exactly 4 ASCII characters.");
  return [
    v22.charCodeAt(0),
    v22.charCodeAt(1),
    v22.charCodeAt(2),
    v22.charCodeAt(3)
  ];
};
sizeOf.TAG = constant(4);
encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;
encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;
encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;
encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT;
encode.NUMBER = function(v22) {
  if (v22 >= -107 && v22 <= 107) {
    return [v22 + 139];
  } else if (v22 >= 108 && v22 <= 1131) {
    v22 = v22 - 108;
    return [(v22 >> 8) + 247, v22 & 255];
  } else if (v22 >= -1131 && v22 <= -108) {
    v22 = -v22 - 108;
    return [(v22 >> 8) + 251, v22 & 255];
  } else if (v22 >= -32768 && v22 <= 32767) {
    return encode.NUMBER16(v22);
  } else {
    return encode.NUMBER32(v22);
  }
};
sizeOf.NUMBER = function(v22) {
  return encode.NUMBER(v22).length;
};
encode.NUMBER16 = function(v22) {
  return [28, v22 >> 8 & 255, v22 & 255];
};
sizeOf.NUMBER16 = constant(3);
encode.NUMBER32 = function(v22) {
  return [29, v22 >> 24 & 255, v22 >> 16 & 255, v22 >> 8 & 255, v22 & 255];
};
sizeOf.NUMBER32 = constant(5);
encode.REAL = function(v22) {
  var value = v22.toString();
  var m24 = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
  if (m24) {
    var epsilon = parseFloat("1e" + ((m24[2] ? +m24[2] : 0) + m24[1].length));
    value = (Math.round(v22 * epsilon) / epsilon).toString();
  }
  var nibbles = "";
  for (var i36 = 0, ii = value.length; i36 < ii; i36 += 1) {
    var c30 = value[i36];
    if (c30 === "e") {
      nibbles += value[++i36] === "-" ? "c" : "b";
    } else if (c30 === ".") {
      nibbles += "a";
    } else if (c30 === "-") {
      nibbles += "e";
    } else {
      nibbles += c30;
    }
  }
  nibbles += nibbles.length & 1 ? "f" : "ff";
  var out = [30];
  for (var i$1 = 0, ii$1 = nibbles.length; i$1 < ii$1; i$1 += 2) {
    out.push(parseInt(nibbles.substr(i$1, 2), 16));
  }
  return out;
};
sizeOf.REAL = function(v22) {
  return encode.REAL(v22).length;
};
encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;
encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;
decode.UTF8 = function(data, offset, numBytes) {
  var codePoints = [];
  var numChars = numBytes;
  for (var j9 = 0; j9 < numChars; j9++, offset += 1) {
    codePoints[j9] = data.getUint8(offset);
  }
  return String.fromCharCode.apply(null, codePoints);
};
decode.UTF16 = function(data, offset, numBytes) {
  var codePoints = [];
  var numChars = numBytes / 2;
  for (var j9 = 0; j9 < numChars; j9++, offset += 2) {
    codePoints[j9] = data.getUint16(offset);
  }
  return String.fromCharCode.apply(null, codePoints);
};
encode.UTF16 = function(v22) {
  var b20 = [];
  for (var i36 = 0; i36 < v22.length; i36 += 1) {
    var codepoint = v22.charCodeAt(i36);
    b20[b20.length] = codepoint >> 8 & 255;
    b20[b20.length] = codepoint & 255;
  }
  return b20;
};
sizeOf.UTF16 = function(v22) {
  return v22.length * 2;
};
var eightBitMacEncodings = {
  "x-mac-croatian": (
    // Python: 'mac_croatian'
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\u0160\u2122\xB4\xA8\u2260\u017D\xD8\u221E\xB1\u2264\u2265\u2206\xB5\u2202\u2211\u220F\u0161\u222B\xAA\xBA\u03A9\u017E\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u0106\xAB\u010C\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uF8FF\xA9\u2044\u20AC\u2039\u203A\xC6\xBB\u2013\xB7\u201A\u201E\u2030\xC2\u0107\xC1\u010D\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u0111\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u03C0\xCB\u02DA\xB8\xCA\xE6\u02C7"
  ),
  "x-mac-cyrillic": (
    // Python: 'mac_cyrillic'
    "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u2020\xB0\u0490\xA3\xA7\u2022\xB6\u0406\xAE\xA9\u2122\u0402\u0452\u2260\u0403\u0453\u221E\xB1\u2264\u2265\u0456\xB5\u0491\u0408\u0404\u0454\u0407\u0457\u0409\u0459\u040A\u045A\u0458\u0405\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\u040B\u045B\u040C\u045C\u0455\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201E\u040E\u045E\u040F\u045F\u2116\u0401\u0451\u044F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E"
  ),
  "x-mac-gaelic": (
    // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u1E02\xB1\u2264\u2265\u1E03\u010A\u010B\u1E0A\u1E0B\u1E1E\u1E1F\u0120\u0121\u1E40\xE6\xF8\u1E41\u1E56\u1E57\u027C\u0192\u017F\u1E60\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\u1E61\u1E9B\xFF\u0178\u1E6A\u20AC\u2039\u203A\u0176\u0177\u1E6B\xB7\u1EF2\u1EF3\u204A\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u2663\xD2\xDA\xDB\xD9\u0131\xDD\xFD\u0174\u0175\u1E84\u1E85\u1E80\u1E81\u1E82\u1E83"
  ),
  "x-mac-greek": (
    // Python: 'mac_greek'
    "\xC4\xB9\xB2\xC9\xB3\xD6\xDC\u0385\xE0\xE2\xE4\u0384\xA8\xE7\xE9\xE8\xEA\xEB\xA3\u2122\xEE\xEF\u2022\xBD\u2030\xF4\xF6\xA6\u20AC\xF9\xFB\xFC\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xDF\xAE\xA9\u03A3\u03AA\xA7\u2260\xB0\xB7\u0391\xB1\u2264\u2265\xA5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xAC\u039F\u03A1\u2248\u03A4\xAB\xBB\u2026\xA0\u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xF7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\xAD"
  ),
  "x-mac-icelandic": (
    // Python: 'mac_iceland'
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\xDD\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\xD0\xF0\xDE\xFE\xFD\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
  ),
  "x-mac-inuit": (
    // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    "\u1403\u1404\u1405\u1406\u140A\u140B\u1431\u1432\u1433\u1434\u1438\u1439\u1449\u144E\u144F\u1450\u1451\u1455\u1456\u1466\u146D\u146E\u146F\u1470\u1472\u1473\u1483\u148B\u148C\u148D\u148E\u1490\u1491\xB0\u14A1\u14A5\u14A6\u2022\xB6\u14A7\xAE\xA9\u2122\u14A8\u14AA\u14AB\u14BB\u14C2\u14C3\u14C4\u14C5\u14C7\u14C8\u14D0\u14EF\u14F0\u14F1\u14F2\u14F4\u14F5\u1505\u14D5\u14D6\u14D7\u14D8\u14DA\u14DB\u14EA\u1528\u1529\u152A\u152B\u152D\u2026\xA0\u152E\u153E\u1555\u1556\u1557\u2013\u2014\u201C\u201D\u2018\u2019\u1558\u1559\u155A\u155D\u1546\u1547\u1548\u1549\u154B\u154C\u1550\u157F\u1580\u1581\u1582\u1583\u1584\u1585\u158F\u1590\u1591\u1592\u1593\u1594\u1595\u1671\u1672\u1673\u1674\u1675\u1676\u1596\u15A0\u15A1\u15A2\u15A3\u15A4\u15A5\u15A6\u157C\u0141\u0142"
  ),
  "x-mac-ce": (
    // Python: 'mac_latin2'
    "\xC4\u0100\u0101\xC9\u0104\xD6\xDC\xE1\u0105\u010C\xE4\u010D\u0106\u0107\xE9\u0179\u017A\u010E\xED\u010F\u0112\u0113\u0116\xF3\u0117\xF4\xF6\xF5\xFA\u011A\u011B\xFC\u2020\xB0\u0118\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\u0119\xA8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xAC\u221A\u0144\u0147\u2206\xAB\xBB\u2026\xA0\u0148\u0150\xD5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xC1\u0164\u0165\xCD\u017D\u017E\u016A\xD3\xD4\u016B\u016E\xDA\u016F\u0170\u0171\u0172\u0173\xDD\xFD\u0137\u017B\u0141\u017C\u0122\u02C7"
  ),
  macintosh: (
    // Python: 'mac_roman'
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\uFB01\uFB02\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
  ),
  "x-mac-romanian": (
    // Python: 'mac_romanian'
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\u0102\u0218\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\u0103\u0219\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\u20AC\u2039\u203A\u021A\u021B\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
  ),
  "x-mac-turkish": (
    // Python: 'mac_turkish'
    "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u03A9\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uF8FF\xD2\xDA\xDB\xD9\uF8A0\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
  )
};
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
  var table2 = eightBitMacEncodings[encoding];
  if (table2 === void 0) {
    return void 0;
  }
  var result = "";
  for (var i36 = 0; i36 < dataLength; i36++) {
    var c30 = dataView.getUint8(offset + i36);
    if (c30 <= 127) {
      result += String.fromCharCode(c30);
    } else {
      result += table2[c30 & 127];
    }
  }
  return result;
};
var macEncodingTableCache = typeof WeakMap === "function" && /* @__PURE__ */ new WeakMap();
var macEncodingCacheKeys;
var getMacEncodingTable = function(encoding) {
  if (!macEncodingCacheKeys) {
    macEncodingCacheKeys = {};
    for (var e29 in eightBitMacEncodings) {
      macEncodingCacheKeys[e29] = new String(e29);
    }
  }
  var cacheKey = macEncodingCacheKeys[encoding];
  if (cacheKey === void 0) {
    return void 0;
  }
  if (macEncodingTableCache) {
    var cachedTable = macEncodingTableCache.get(cacheKey);
    if (cachedTable !== void 0) {
      return cachedTable;
    }
  }
  var decodingTable = eightBitMacEncodings[encoding];
  if (decodingTable === void 0) {
    return void 0;
  }
  var encodingTable = {};
  for (var i36 = 0; i36 < decodingTable.length; i36++) {
    encodingTable[decodingTable.charCodeAt(i36)] = i36 + 128;
  }
  if (macEncodingTableCache) {
    macEncodingTableCache.set(cacheKey, encodingTable);
  }
  return encodingTable;
};
encode.MACSTRING = function(str, encoding) {
  var table2 = getMacEncodingTable(encoding);
  if (table2 === void 0) {
    return void 0;
  }
  var result = [];
  for (var i36 = 0; i36 < str.length; i36++) {
    var c30 = str.charCodeAt(i36);
    if (c30 >= 128) {
      c30 = table2[c30];
      if (c30 === void 0) {
        return void 0;
      }
    }
    result[i36] = c30;
  }
  return result;
};
sizeOf.MACSTRING = function(str, encoding) {
  var b20 = encode.MACSTRING(str, encoding);
  if (b20 !== void 0) {
    return b20.length;
  } else {
    return 0;
  }
};
function isByteEncodable(value) {
  return value >= -128 && value <= 127;
}
function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
  var runLength = 0;
  var numDeltas = deltas.length;
  while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
    ++pos;
    ++runLength;
  }
  result.push(128 | runLength - 1);
  return pos;
}
function encodeVarDeltaRunAsBytes(deltas, offset, result) {
  var runLength = 0;
  var numDeltas = deltas.length;
  var pos = offset;
  while (pos < numDeltas && runLength < 64) {
    var value = deltas[pos];
    if (!isByteEncodable(value)) {
      break;
    }
    if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
      break;
    }
    ++pos;
    ++runLength;
  }
  result.push(runLength - 1);
  for (var i36 = offset; i36 < pos; ++i36) {
    result.push(deltas[i36] + 256 & 255);
  }
  return pos;
}
function encodeVarDeltaRunAsWords(deltas, offset, result) {
  var runLength = 0;
  var numDeltas = deltas.length;
  var pos = offset;
  while (pos < numDeltas && runLength < 64) {
    var value = deltas[pos];
    if (value === 0) {
      break;
    }
    if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
      break;
    }
    ++pos;
    ++runLength;
  }
  result.push(64 | runLength - 1);
  for (var i36 = offset; i36 < pos; ++i36) {
    var val = deltas[i36];
    result.push(val + 65536 >> 8 & 255, val + 256 & 255);
  }
  return pos;
}
encode.VARDELTAS = function(deltas) {
  var pos = 0;
  var result = [];
  while (pos < deltas.length) {
    var value = deltas[pos];
    if (value === 0) {
      pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
    } else if (value >= -128 && value <= 127) {
      pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
    } else {
      pos = encodeVarDeltaRunAsWords(deltas, pos, result);
    }
  }
  return result;
};
encode.INDEX = function(l29) {
  var offset = 1;
  var offsets = [offset];
  var data = [];
  for (var i36 = 0; i36 < l29.length; i36 += 1) {
    var v22 = encode.OBJECT(l29[i36]);
    Array.prototype.push.apply(data, v22);
    offset += v22.length;
    offsets.push(offset);
  }
  if (data.length === 0) {
    return [0, 0];
  }
  var encodedOffsets = [];
  var offSize = 1 + Math.floor(Math.log(offset) / Math.log(2)) / 8 | 0;
  var offsetEncoder = [void 0, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
  for (var i$1 = 0; i$1 < offsets.length; i$1 += 1) {
    var encodedOffset = offsetEncoder(offsets[i$1]);
    Array.prototype.push.apply(encodedOffsets, encodedOffset);
  }
  return Array.prototype.concat(
    encode.Card16(l29.length),
    encode.OffSize(offSize),
    encodedOffsets,
    data
  );
};
sizeOf.INDEX = function(v22) {
  return encode.INDEX(v22).length;
};
encode.DICT = function(m24) {
  var d24 = [];
  var keys = Object.keys(m24);
  var length = keys.length;
  for (var i36 = 0; i36 < length; i36 += 1) {
    var k11 = parseInt(keys[i36], 0);
    var v22 = m24[k11];
    d24 = d24.concat(encode.OPERAND(v22.value, v22.type));
    d24 = d24.concat(encode.OPERATOR(k11));
  }
  return d24;
};
sizeOf.DICT = function(m24) {
  return encode.DICT(m24).length;
};
encode.OPERATOR = function(v22) {
  if (v22 < 1200) {
    return [v22];
  } else {
    return [12, v22 - 1200];
  }
};
encode.OPERAND = function(v22, type) {
  var d24 = [];
  if (Array.isArray(type)) {
    for (var i36 = 0; i36 < type.length; i36 += 1) {
      check.argument(v22.length === type.length, "Not enough arguments given for type" + type);
      d24 = d24.concat(encode.OPERAND(v22[i36], type[i36]));
    }
  } else {
    if (type === "SID") {
      d24 = d24.concat(encode.NUMBER(v22));
    } else if (type === "offset") {
      d24 = d24.concat(encode.NUMBER32(v22));
    } else if (type === "number") {
      d24 = d24.concat(encode.NUMBER(v22));
    } else if (type === "real") {
      d24 = d24.concat(encode.REAL(v22));
    } else {
      throw new Error("Unknown operand type " + type);
    }
  }
  return d24;
};
encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE;
var wmm = typeof WeakMap === "function" && /* @__PURE__ */ new WeakMap();
encode.CHARSTRING = function(ops) {
  if (wmm) {
    var cachedValue = wmm.get(ops);
    if (cachedValue !== void 0) {
      return cachedValue;
    }
  }
  var d24 = [];
  var length = ops.length;
  for (var i36 = 0; i36 < length; i36 += 1) {
    var op = ops[i36];
    d24 = d24.concat(encode[op.type](op.value));
  }
  if (wmm) {
    wmm.set(ops, d24);
  }
  return d24;
};
sizeOf.CHARSTRING = function(ops) {
  return encode.CHARSTRING(ops).length;
};
encode.OBJECT = function(v22) {
  var encodingFunction = encode[v22.type];
  check.argument(encodingFunction !== void 0, "No encoding function for type " + v22.type);
  return encodingFunction(v22.value);
};
sizeOf.OBJECT = function(v22) {
  var sizeOfFunction = sizeOf[v22.type];
  check.argument(sizeOfFunction !== void 0, "No sizeOf function for type " + v22.type);
  return sizeOfFunction(v22.value);
};
encode.TABLE = function(table2) {
  var d24 = [];
  var length = table2.fields.length;
  var subtables = [];
  var subtableOffsets = [];
  for (var i36 = 0; i36 < length; i36 += 1) {
    var field = table2.fields[i36];
    var encodingFunction = encode[field.type];
    check.argument(encodingFunction !== void 0, "No encoding function for field type " + field.type + " (" + field.name + ")");
    var value = table2[field.name];
    if (value === void 0) {
      value = field.value;
    }
    var bytes = encodingFunction(value);
    if (field.type === "TABLE") {
      subtableOffsets.push(d24.length);
      d24 = d24.concat([0, 0]);
      subtables.push(bytes);
    } else {
      d24 = d24.concat(bytes);
    }
  }
  for (var i$1 = 0; i$1 < subtables.length; i$1 += 1) {
    var o34 = subtableOffsets[i$1];
    var offset = d24.length;
    check.argument(offset < 65536, "Table " + table2.tableName + " too big.");
    d24[o34] = offset >> 8;
    d24[o34 + 1] = offset & 255;
    d24 = d24.concat(subtables[i$1]);
  }
  return d24;
};
sizeOf.TABLE = function(table2) {
  var numBytes = 0;
  var length = table2.fields.length;
  for (var i36 = 0; i36 < length; i36 += 1) {
    var field = table2.fields[i36];
    var sizeOfFunction = sizeOf[field.type];
    check.argument(sizeOfFunction !== void 0, "No sizeOf function for field type " + field.type + " (" + field.name + ")");
    var value = table2[field.name];
    if (value === void 0) {
      value = field.value;
    }
    numBytes += sizeOfFunction(value);
    if (field.type === "TABLE") {
      numBytes += 2;
    }
  }
  return numBytes;
};
encode.RECORD = encode.TABLE;
sizeOf.RECORD = sizeOf.TABLE;
encode.LITERAL = function(v22) {
  return v22;
};
sizeOf.LITERAL = function(v22) {
  return v22.length;
};
function Table(tableName, fields, options) {
  if (fields.length && (fields[0].name !== "coverageFormat" || fields[0].value === 1)) {
    for (var i36 = 0; i36 < fields.length; i36 += 1) {
      var field = fields[i36];
      this[field.name] = field.value;
    }
  }
  this.tableName = tableName;
  this.fields = fields;
  if (options) {
    var optionKeys = Object.keys(options);
    for (var i$1 = 0; i$1 < optionKeys.length; i$1 += 1) {
      var k11 = optionKeys[i$1];
      var v22 = options[k11];
      if (this[k11] !== void 0) {
        this[k11] = v22;
      }
    }
  }
}
Table.prototype.encode = function() {
  return encode.TABLE(this);
};
Table.prototype.sizeOf = function() {
  return sizeOf.TABLE(this);
};
function ushortList(itemName, list, count) {
  if (count === void 0) {
    count = list.length;
  }
  var fields = new Array(list.length + 1);
  fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
  for (var i36 = 0; i36 < list.length; i36++) {
    fields[i36 + 1] = { name: itemName + i36, type: "USHORT", value: list[i36] };
  }
  return fields;
}
function tableList(itemName, records, itemCallback) {
  var count = records.length;
  var fields = new Array(count + 1);
  fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
  for (var i36 = 0; i36 < count; i36++) {
    fields[i36 + 1] = { name: itemName + i36, type: "TABLE", value: itemCallback(records[i36], i36) };
  }
  return fields;
}
function recordList(itemName, records, itemCallback) {
  var count = records.length;
  var fields = [];
  fields[0] = { name: itemName + "Count", type: "USHORT", value: count };
  for (var i36 = 0; i36 < count; i36++) {
    fields = fields.concat(itemCallback(records[i36], i36));
  }
  return fields;
}
function Coverage(coverageTable) {
  if (coverageTable.format === 1) {
    Table.call(
      this,
      "coverageTable",
      [{ name: "coverageFormat", type: "USHORT", value: 1 }].concat(ushortList("glyph", coverageTable.glyphs))
    );
  } else if (coverageTable.format === 2) {
    Table.call(
      this,
      "coverageTable",
      [{ name: "coverageFormat", type: "USHORT", value: 2 }].concat(recordList("rangeRecord", coverageTable.ranges, function(RangeRecord) {
        return [
          { name: "startGlyphID", type: "USHORT", value: RangeRecord.start },
          { name: "endGlyphID", type: "USHORT", value: RangeRecord.end },
          { name: "startCoverageIndex", type: "USHORT", value: RangeRecord.index }
        ];
      }))
    );
  } else {
    check.assert(false, "Coverage format must be 1 or 2.");
  }
}
Coverage.prototype = Object.create(Table.prototype);
Coverage.prototype.constructor = Coverage;
function ScriptList(scriptListTable) {
  Table.call(
    this,
    "scriptListTable",
    recordList("scriptRecord", scriptListTable, function(scriptRecord, i36) {
      var script = scriptRecord.script;
      var defaultLangSys = script.defaultLangSys;
      check.assert(!!defaultLangSys, "Unable to write GSUB: script " + scriptRecord.tag + " has no default language system.");
      return [
        { name: "scriptTag" + i36, type: "TAG", value: scriptRecord.tag },
        { name: "script" + i36, type: "TABLE", value: new Table("scriptTable", [
          { name: "defaultLangSys", type: "TABLE", value: new Table("defaultLangSys", [
            { name: "lookupOrder", type: "USHORT", value: 0 },
            { name: "reqFeatureIndex", type: "USHORT", value: defaultLangSys.reqFeatureIndex }
          ].concat(ushortList("featureIndex", defaultLangSys.featureIndexes))) }
        ].concat(recordList("langSys", script.langSysRecords, function(langSysRecord, i37) {
          var langSys = langSysRecord.langSys;
          return [
            { name: "langSysTag" + i37, type: "TAG", value: langSysRecord.tag },
            { name: "langSys" + i37, type: "TABLE", value: new Table("langSys", [
              { name: "lookupOrder", type: "USHORT", value: 0 },
              { name: "reqFeatureIndex", type: "USHORT", value: langSys.reqFeatureIndex }
            ].concat(ushortList("featureIndex", langSys.featureIndexes))) }
          ];
        }))) }
      ];
    })
  );
}
ScriptList.prototype = Object.create(Table.prototype);
ScriptList.prototype.constructor = ScriptList;
function FeatureList(featureListTable) {
  Table.call(
    this,
    "featureListTable",
    recordList("featureRecord", featureListTable, function(featureRecord, i36) {
      var feature = featureRecord.feature;
      return [
        { name: "featureTag" + i36, type: "TAG", value: featureRecord.tag },
        { name: "feature" + i36, type: "TABLE", value: new Table("featureTable", [
          { name: "featureParams", type: "USHORT", value: feature.featureParams }
        ].concat(ushortList("lookupListIndex", feature.lookupListIndexes))) }
      ];
    })
  );
}
FeatureList.prototype = Object.create(Table.prototype);
FeatureList.prototype.constructor = FeatureList;
function LookupList(lookupListTable, subtableMakers2) {
  Table.call(this, "lookupListTable", tableList("lookup", lookupListTable, function(lookupTable) {
    var subtableCallback = subtableMakers2[lookupTable.lookupType];
    check.assert(!!subtableCallback, "Unable to write GSUB lookup type " + lookupTable.lookupType + " tables.");
    return new Table("lookupTable", [
      { name: "lookupType", type: "USHORT", value: lookupTable.lookupType },
      { name: "lookupFlag", type: "USHORT", value: lookupTable.lookupFlag }
    ].concat(tableList("subtable", lookupTable.subtables, subtableCallback)));
  }));
}
LookupList.prototype = Object.create(Table.prototype);
LookupList.prototype.constructor = LookupList;
var table = {
  Table,
  Record: Table,
  Coverage,
  ScriptList,
  FeatureList,
  LookupList,
  ushortList,
  tableList,
  recordList
};
function getByte(dataView, offset) {
  return dataView.getUint8(offset);
}
function getUShort(dataView, offset) {
  return dataView.getUint16(offset, false);
}
function getShort(dataView, offset) {
  return dataView.getInt16(offset, false);
}
function getULong(dataView, offset) {
  return dataView.getUint32(offset, false);
}
function getFixed(dataView, offset) {
  var decimal = dataView.getInt16(offset, false);
  var fraction = dataView.getUint16(offset + 2, false);
  return decimal + fraction / 65535;
}
function getTag(dataView, offset) {
  var tag = "";
  for (var i36 = offset; i36 < offset + 4; i36 += 1) {
    tag += String.fromCharCode(dataView.getInt8(i36));
  }
  return tag;
}
function getOffset(dataView, offset, offSize) {
  var v22 = 0;
  for (var i36 = 0; i36 < offSize; i36 += 1) {
    v22 <<= 8;
    v22 += dataView.getUint8(offset + i36);
  }
  return v22;
}
function getBytes(dataView, startOffset, endOffset) {
  var bytes = [];
  for (var i36 = startOffset; i36 < endOffset; i36 += 1) {
    bytes.push(dataView.getUint8(i36));
  }
  return bytes;
}
function bytesToString(bytes) {
  var s33 = "";
  for (var i36 = 0; i36 < bytes.length; i36 += 1) {
    s33 += String.fromCharCode(bytes[i36]);
  }
  return s33;
}
var typeOffsets = {
  byte: 1,
  uShort: 2,
  short: 2,
  uLong: 4,
  fixed: 4,
  longDateTime: 8,
  tag: 4
};
function Parser(data, offset) {
  this.data = data;
  this.offset = offset;
  this.relativeOffset = 0;
}
Parser.prototype.parseByte = function() {
  var v22 = this.data.getUint8(this.offset + this.relativeOffset);
  this.relativeOffset += 1;
  return v22;
};
Parser.prototype.parseChar = function() {
  var v22 = this.data.getInt8(this.offset + this.relativeOffset);
  this.relativeOffset += 1;
  return v22;
};
Parser.prototype.parseCard8 = Parser.prototype.parseByte;
Parser.prototype.parseUShort = function() {
  var v22 = this.data.getUint16(this.offset + this.relativeOffset);
  this.relativeOffset += 2;
  return v22;
};
Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;
Parser.prototype.parseShort = function() {
  var v22 = this.data.getInt16(this.offset + this.relativeOffset);
  this.relativeOffset += 2;
  return v22;
};
Parser.prototype.parseF2Dot14 = function() {
  var v22 = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
  this.relativeOffset += 2;
  return v22;
};
Parser.prototype.parseULong = function() {
  var v22 = getULong(this.data, this.offset + this.relativeOffset);
  this.relativeOffset += 4;
  return v22;
};
Parser.prototype.parseOffset32 = Parser.prototype.parseULong;
Parser.prototype.parseFixed = function() {
  var v22 = getFixed(this.data, this.offset + this.relativeOffset);
  this.relativeOffset += 4;
  return v22;
};
Parser.prototype.parseString = function(length) {
  var dataView = this.data;
  var offset = this.offset + this.relativeOffset;
  var string = "";
  this.relativeOffset += length;
  for (var i36 = 0; i36 < length; i36++) {
    string += String.fromCharCode(dataView.getUint8(offset + i36));
  }
  return string;
};
Parser.prototype.parseTag = function() {
  return this.parseString(4);
};
Parser.prototype.parseLongDateTime = function() {
  var v22 = getULong(this.data, this.offset + this.relativeOffset + 4);
  v22 -= 2082844800;
  this.relativeOffset += 8;
  return v22;
};
Parser.prototype.parseVersion = function(minorBase) {
  var major = getUShort(this.data, this.offset + this.relativeOffset);
  var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
  this.relativeOffset += 4;
  if (minorBase === void 0) {
    minorBase = 4096;
  }
  return major + minor / minorBase / 10;
};
Parser.prototype.skip = function(type, amount) {
  if (amount === void 0) {
    amount = 1;
  }
  this.relativeOffset += typeOffsets[type] * amount;
};
Parser.prototype.parseULongList = function(count) {
  if (count === void 0) {
    count = this.parseULong();
  }
  var offsets = new Array(count);
  var dataView = this.data;
  var offset = this.offset + this.relativeOffset;
  for (var i36 = 0; i36 < count; i36++) {
    offsets[i36] = dataView.getUint32(offset);
    offset += 4;
  }
  this.relativeOffset += count * 4;
  return offsets;
};
Parser.prototype.parseOffset16List = Parser.prototype.parseUShortList = function(count) {
  if (count === void 0) {
    count = this.parseUShort();
  }
  var offsets = new Array(count);
  var dataView = this.data;
  var offset = this.offset + this.relativeOffset;
  for (var i36 = 0; i36 < count; i36++) {
    offsets[i36] = dataView.getUint16(offset);
    offset += 2;
  }
  this.relativeOffset += count * 2;
  return offsets;
};
Parser.prototype.parseShortList = function(count) {
  var list = new Array(count);
  var dataView = this.data;
  var offset = this.offset + this.relativeOffset;
  for (var i36 = 0; i36 < count; i36++) {
    list[i36] = dataView.getInt16(offset);
    offset += 2;
  }
  this.relativeOffset += count * 2;
  return list;
};
Parser.prototype.parseByteList = function(count) {
  var list = new Array(count);
  var dataView = this.data;
  var offset = this.offset + this.relativeOffset;
  for (var i36 = 0; i36 < count; i36++) {
    list[i36] = dataView.getUint8(offset++);
  }
  this.relativeOffset += count;
  return list;
};
Parser.prototype.parseList = function(count, itemCallback) {
  if (!itemCallback) {
    itemCallback = count;
    count = this.parseUShort();
  }
  var list = new Array(count);
  for (var i36 = 0; i36 < count; i36++) {
    list[i36] = itemCallback.call(this);
  }
  return list;
};
Parser.prototype.parseList32 = function(count, itemCallback) {
  if (!itemCallback) {
    itemCallback = count;
    count = this.parseULong();
  }
  var list = new Array(count);
  for (var i36 = 0; i36 < count; i36++) {
    list[i36] = itemCallback.call(this);
  }
  return list;
};
Parser.prototype.parseRecordList = function(count, recordDescription) {
  if (!recordDescription) {
    recordDescription = count;
    count = this.parseUShort();
  }
  var records = new Array(count);
  var fields = Object.keys(recordDescription);
  for (var i36 = 0; i36 < count; i36++) {
    var rec = {};
    for (var j9 = 0; j9 < fields.length; j9++) {
      var fieldName = fields[j9];
      var fieldType = recordDescription[fieldName];
      rec[fieldName] = fieldType.call(this);
    }
    records[i36] = rec;
  }
  return records;
};
Parser.prototype.parseRecordList32 = function(count, recordDescription) {
  if (!recordDescription) {
    recordDescription = count;
    count = this.parseULong();
  }
  var records = new Array(count);
  var fields = Object.keys(recordDescription);
  for (var i36 = 0; i36 < count; i36++) {
    var rec = {};
    for (var j9 = 0; j9 < fields.length; j9++) {
      var fieldName = fields[j9];
      var fieldType = recordDescription[fieldName];
      rec[fieldName] = fieldType.call(this);
    }
    records[i36] = rec;
  }
  return records;
};
Parser.prototype.parseStruct = function(description) {
  if (typeof description === "function") {
    return description.call(this);
  } else {
    var fields = Object.keys(description);
    var struct = {};
    for (var j9 = 0; j9 < fields.length; j9++) {
      var fieldName = fields[j9];
      var fieldType = description[fieldName];
      struct[fieldName] = fieldType.call(this);
    }
    return struct;
  }
};
Parser.prototype.parseValueRecord = function(valueFormat) {
  if (valueFormat === void 0) {
    valueFormat = this.parseUShort();
  }
  if (valueFormat === 0) {
    return;
  }
  var valueRecord = {};
  if (valueFormat & 1) {
    valueRecord.xPlacement = this.parseShort();
  }
  if (valueFormat & 2) {
    valueRecord.yPlacement = this.parseShort();
  }
  if (valueFormat & 4) {
    valueRecord.xAdvance = this.parseShort();
  }
  if (valueFormat & 8) {
    valueRecord.yAdvance = this.parseShort();
  }
  if (valueFormat & 16) {
    valueRecord.xPlaDevice = void 0;
    this.parseShort();
  }
  if (valueFormat & 32) {
    valueRecord.yPlaDevice = void 0;
    this.parseShort();
  }
  if (valueFormat & 64) {
    valueRecord.xAdvDevice = void 0;
    this.parseShort();
  }
  if (valueFormat & 128) {
    valueRecord.yAdvDevice = void 0;
    this.parseShort();
  }
  return valueRecord;
};
Parser.prototype.parseValueRecordList = function() {
  var valueFormat = this.parseUShort();
  var valueCount = this.parseUShort();
  var values = new Array(valueCount);
  for (var i36 = 0; i36 < valueCount; i36++) {
    values[i36] = this.parseValueRecord(valueFormat);
  }
  return values;
};
Parser.prototype.parsePointer = function(description) {
  var structOffset = this.parseOffset16();
  if (structOffset > 0) {
    return new Parser(this.data, this.offset + structOffset).parseStruct(description);
  }
  return void 0;
};
Parser.prototype.parsePointer32 = function(description) {
  var structOffset = this.parseOffset32();
  if (structOffset > 0) {
    return new Parser(this.data, this.offset + structOffset).parseStruct(description);
  }
  return void 0;
};
Parser.prototype.parseListOfLists = function(itemCallback) {
  var offsets = this.parseOffset16List();
  var count = offsets.length;
  var relativeOffset = this.relativeOffset;
  var list = new Array(count);
  for (var i36 = 0; i36 < count; i36++) {
    var start = offsets[i36];
    if (start === 0) {
      list[i36] = void 0;
      continue;
    }
    this.relativeOffset = start;
    if (itemCallback) {
      var subOffsets = this.parseOffset16List();
      var subList = new Array(subOffsets.length);
      for (var j9 = 0; j9 < subOffsets.length; j9++) {
        this.relativeOffset = start + subOffsets[j9];
        subList[j9] = itemCallback.call(this);
      }
      list[i36] = subList;
    } else {
      list[i36] = this.parseUShortList();
    }
  }
  this.relativeOffset = relativeOffset;
  return list;
};
Parser.prototype.parseCoverage = function() {
  var startOffset = this.offset + this.relativeOffset;
  var format = this.parseUShort();
  var count = this.parseUShort();
  if (format === 1) {
    return {
      format: 1,
      glyphs: this.parseUShortList(count)
    };
  } else if (format === 2) {
    var ranges = new Array(count);
    for (var i36 = 0; i36 < count; i36++) {
      ranges[i36] = {
        start: this.parseUShort(),
        end: this.parseUShort(),
        index: this.parseUShort()
      };
    }
    return {
      format: 2,
      ranges
    };
  }
  throw new Error("0x" + startOffset.toString(16) + ": Coverage format must be 1 or 2.");
};
Parser.prototype.parseClassDef = function() {
  var startOffset = this.offset + this.relativeOffset;
  var format = this.parseUShort();
  if (format === 1) {
    return {
      format: 1,
      startGlyph: this.parseUShort(),
      classes: this.parseUShortList()
    };
  } else if (format === 2) {
    return {
      format: 2,
      ranges: this.parseRecordList({
        start: Parser.uShort,
        end: Parser.uShort,
        classId: Parser.uShort
      })
    };
  }
  throw new Error("0x" + startOffset.toString(16) + ": ClassDef format must be 1 or 2.");
};
Parser.list = function(count, itemCallback) {
  return function() {
    return this.parseList(count, itemCallback);
  };
};
Parser.list32 = function(count, itemCallback) {
  return function() {
    return this.parseList32(count, itemCallback);
  };
};
Parser.recordList = function(count, recordDescription) {
  return function() {
    return this.parseRecordList(count, recordDescription);
  };
};
Parser.recordList32 = function(count, recordDescription) {
  return function() {
    return this.parseRecordList32(count, recordDescription);
  };
};
Parser.pointer = function(description) {
  return function() {
    return this.parsePointer(description);
  };
};
Parser.pointer32 = function(description) {
  return function() {
    return this.parsePointer32(description);
  };
};
Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
Parser.uLongList = Parser.prototype.parseULongList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef;
var langSysTable = {
  reserved: Parser.uShort,
  reqFeatureIndex: Parser.uShort,
  featureIndexes: Parser.uShortList
};
Parser.prototype.parseScriptList = function() {
  return this.parsePointer(Parser.recordList({
    tag: Parser.tag,
    script: Parser.pointer({
      defaultLangSys: Parser.pointer(langSysTable),
      langSysRecords: Parser.recordList({
        tag: Parser.tag,
        langSys: Parser.pointer(langSysTable)
      })
    })
  })) || [];
};
Parser.prototype.parseFeatureList = function() {
  return this.parsePointer(Parser.recordList({
    tag: Parser.tag,
    feature: Parser.pointer({
      featureParams: Parser.offset16,
      lookupListIndexes: Parser.uShortList
    })
  })) || [];
};
Parser.prototype.parseLookupList = function(lookupTableParsers) {
  return this.parsePointer(Parser.list(Parser.pointer(function() {
    var lookupType = this.parseUShort();
    check.argument(1 <= lookupType && lookupType <= 9, "GPOS/GSUB lookup type " + lookupType + " unknown.");
    var lookupFlag = this.parseUShort();
    var useMarkFilteringSet = lookupFlag & 16;
    return {
      lookupType,
      lookupFlag,
      subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
      markFilteringSet: useMarkFilteringSet ? this.parseUShort() : void 0
    };
  }))) || [];
};
Parser.prototype.parseFeatureVariationsList = function() {
  return this.parsePointer32(function() {
    var majorVersion = this.parseUShort();
    var minorVersion = this.parseUShort();
    check.argument(majorVersion === 1 && minorVersion < 1, "GPOS/GSUB feature variations table unknown.");
    var featureVariations = this.parseRecordList32({
      conditionSetOffset: Parser.offset32,
      featureTableSubstitutionOffset: Parser.offset32
    });
    return featureVariations;
  }) || [];
};
var parse = {
  getByte,
  getCard8: getByte,
  getUShort,
  getCard16: getUShort,
  getShort,
  getULong,
  getFixed,
  getTag,
  getOffset,
  getBytes,
  bytesToString,
  Parser
};
function parseCmapTableFormat12(cmap2, p28) {
  p28.parseUShort();
  cmap2.length = p28.parseULong();
  cmap2.language = p28.parseULong();
  var groupCount;
  cmap2.groupCount = groupCount = p28.parseULong();
  cmap2.glyphIndexMap = {};
  for (var i36 = 0; i36 < groupCount; i36 += 1) {
    var startCharCode = p28.parseULong();
    var endCharCode = p28.parseULong();
    var startGlyphId = p28.parseULong();
    for (var c30 = startCharCode; c30 <= endCharCode; c30 += 1) {
      cmap2.glyphIndexMap[c30] = startGlyphId;
      startGlyphId++;
    }
  }
}
function parseCmapTableFormat4(cmap2, p28, data, start, offset) {
  cmap2.length = p28.parseUShort();
  cmap2.language = p28.parseUShort();
  var segCount;
  cmap2.segCount = segCount = p28.parseUShort() >> 1;
  p28.skip("uShort", 3);
  cmap2.glyphIndexMap = {};
  var endCountParser = new parse.Parser(data, start + offset + 14);
  var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
  var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
  var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
  var glyphIndexOffset = start + offset + 16 + segCount * 8;
  for (var i36 = 0; i36 < segCount - 1; i36 += 1) {
    var glyphIndex = void 0;
    var endCount = endCountParser.parseUShort();
    var startCount = startCountParser.parseUShort();
    var idDelta = idDeltaParser.parseShort();
    var idRangeOffset = idRangeOffsetParser.parseUShort();
    for (var c30 = startCount; c30 <= endCount; c30 += 1) {
      if (idRangeOffset !== 0) {
        glyphIndexOffset = idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2;
        glyphIndexOffset += idRangeOffset;
        glyphIndexOffset += (c30 - startCount) * 2;
        glyphIndex = parse.getUShort(data, glyphIndexOffset);
        if (glyphIndex !== 0) {
          glyphIndex = glyphIndex + idDelta & 65535;
        }
      } else {
        glyphIndex = c30 + idDelta & 65535;
      }
      cmap2.glyphIndexMap[c30] = glyphIndex;
    }
  }
}
function parseCmapTable(data, start) {
  var cmap2 = {};
  cmap2.version = parse.getUShort(data, start);
  check.argument(cmap2.version === 0, "cmap table version should be 0.");
  cmap2.numTables = parse.getUShort(data, start + 2);
  var offset = -1;
  for (var i36 = cmap2.numTables - 1; i36 >= 0; i36 -= 1) {
    var platformId = parse.getUShort(data, start + 4 + i36 * 8);
    var encodingId = parse.getUShort(data, start + 4 + i36 * 8 + 2);
    if (platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10) || platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4)) {
      offset = parse.getULong(data, start + 4 + i36 * 8 + 4);
      break;
    }
  }
  if (offset === -1) {
    throw new Error("No valid cmap sub-tables found.");
  }
  var p28 = new parse.Parser(data, start + offset);
  cmap2.format = p28.parseUShort();
  if (cmap2.format === 12) {
    parseCmapTableFormat12(cmap2, p28);
  } else if (cmap2.format === 4) {
    parseCmapTableFormat4(cmap2, p28, data, start, offset);
  } else {
    throw new Error("Only format 4 and 12 cmap tables are supported (found format " + cmap2.format + ").");
  }
  return cmap2;
}
function addSegment(t31, code, glyphIndex) {
  t31.segments.push({
    end: code,
    start: code,
    delta: -(code - glyphIndex),
    offset: 0,
    glyphIndex
  });
}
function addTerminatorSegment(t31) {
  t31.segments.push({
    end: 65535,
    start: 65535,
    delta: 1,
    offset: 0
  });
}
function makeCmapTable(glyphs) {
  var isPlan0Only = true;
  var i36;
  for (i36 = glyphs.length - 1; i36 > 0; i36 -= 1) {
    var g23 = glyphs.get(i36);
    if (g23.unicode > 65535) {
      console.log("Adding CMAP format 12 (needed!)");
      isPlan0Only = false;
      break;
    }
  }
  var cmapTable = [
    { name: "version", type: "USHORT", value: 0 },
    { name: "numTables", type: "USHORT", value: isPlan0Only ? 1 : 2 },
    // CMAP 4 header
    { name: "platformID", type: "USHORT", value: 3 },
    { name: "encodingID", type: "USHORT", value: 1 },
    { name: "offset", type: "ULONG", value: isPlan0Only ? 12 : 12 + 8 }
  ];
  if (!isPlan0Only) {
    cmapTable = cmapTable.concat([
      // CMAP 12 header
      { name: "cmap12PlatformID", type: "USHORT", value: 3 },
      // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
      { name: "cmap12EncodingID", type: "USHORT", value: 10 },
      { name: "cmap12Offset", type: "ULONG", value: 0 }
    ]);
  }
  cmapTable = cmapTable.concat([
    // CMAP 4 Subtable
    { name: "format", type: "USHORT", value: 4 },
    { name: "cmap4Length", type: "USHORT", value: 0 },
    { name: "language", type: "USHORT", value: 0 },
    { name: "segCountX2", type: "USHORT", value: 0 },
    { name: "searchRange", type: "USHORT", value: 0 },
    { name: "entrySelector", type: "USHORT", value: 0 },
    { name: "rangeShift", type: "USHORT", value: 0 }
  ]);
  var t31 = new table.Table("cmap", cmapTable);
  t31.segments = [];
  for (i36 = 0; i36 < glyphs.length; i36 += 1) {
    var glyph = glyphs.get(i36);
    for (var j9 = 0; j9 < glyph.unicodes.length; j9 += 1) {
      addSegment(t31, glyph.unicodes[j9], i36);
    }
    t31.segments = t31.segments.sort(function(a34, b20) {
      return a34.start - b20.start;
    });
  }
  addTerminatorSegment(t31);
  var segCount = t31.segments.length;
  var segCountToRemove = 0;
  var endCounts = [];
  var startCounts = [];
  var idDeltas = [];
  var idRangeOffsets = [];
  var glyphIds = [];
  var cmap12Groups = [];
  for (i36 = 0; i36 < segCount; i36 += 1) {
    var segment = t31.segments[i36];
    if (segment.end <= 65535 && segment.start <= 65535) {
      endCounts = endCounts.concat({ name: "end_" + i36, type: "USHORT", value: segment.end });
      startCounts = startCounts.concat({ name: "start_" + i36, type: "USHORT", value: segment.start });
      idDeltas = idDeltas.concat({ name: "idDelta_" + i36, type: "SHORT", value: segment.delta });
      idRangeOffsets = idRangeOffsets.concat({ name: "idRangeOffset_" + i36, type: "USHORT", value: segment.offset });
      if (segment.glyphId !== void 0) {
        glyphIds = glyphIds.concat({ name: "glyph_" + i36, type: "USHORT", value: segment.glyphId });
      }
    } else {
      segCountToRemove += 1;
    }
    if (!isPlan0Only && segment.glyphIndex !== void 0) {
      cmap12Groups = cmap12Groups.concat({ name: "cmap12Start_" + i36, type: "ULONG", value: segment.start });
      cmap12Groups = cmap12Groups.concat({ name: "cmap12End_" + i36, type: "ULONG", value: segment.end });
      cmap12Groups = cmap12Groups.concat({ name: "cmap12Glyph_" + i36, type: "ULONG", value: segment.glyphIndex });
    }
  }
  t31.segCountX2 = (segCount - segCountToRemove) * 2;
  t31.searchRange = Math.pow(2, Math.floor(Math.log(segCount - segCountToRemove) / Math.log(2))) * 2;
  t31.entrySelector = Math.log(t31.searchRange / 2) / Math.log(2);
  t31.rangeShift = t31.segCountX2 - t31.searchRange;
  t31.fields = t31.fields.concat(endCounts);
  t31.fields.push({ name: "reservedPad", type: "USHORT", value: 0 });
  t31.fields = t31.fields.concat(startCounts);
  t31.fields = t31.fields.concat(idDeltas);
  t31.fields = t31.fields.concat(idRangeOffsets);
  t31.fields = t31.fields.concat(glyphIds);
  t31.cmap4Length = 14 + // Subtable header
  endCounts.length * 2 + 2 + // reservedPad
  startCounts.length * 2 + idDeltas.length * 2 + idRangeOffsets.length * 2 + glyphIds.length * 2;
  if (!isPlan0Only) {
    var cmap12Length = 16 + // Subtable header
    cmap12Groups.length * 4;
    t31.cmap12Offset = 12 + 2 * 2 + 4 + t31.cmap4Length;
    t31.fields = t31.fields.concat([
      { name: "cmap12Format", type: "USHORT", value: 12 },
      { name: "cmap12Reserved", type: "USHORT", value: 0 },
      { name: "cmap12Length", type: "ULONG", value: cmap12Length },
      { name: "cmap12Language", type: "ULONG", value: 0 },
      { name: "cmap12nGroups", type: "ULONG", value: cmap12Groups.length / 3 }
    ]);
    t31.fields = t31.fields.concat(cmap12Groups);
  }
  return t31;
}
var cmap = { parse: parseCmapTable, make: makeCmapTable };
var cffStandardStrings = [
  ".notdef",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quoteright",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "quoteleft",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "exclamdown",
  "cent",
  "sterling",
  "fraction",
  "yen",
  "florin",
  "section",
  "currency",
  "quotesingle",
  "quotedblleft",
  "guillemotleft",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "endash",
  "dagger",
  "daggerdbl",
  "periodcentered",
  "paragraph",
  "bullet",
  "quotesinglbase",
  "quotedblbase",
  "quotedblright",
  "guillemotright",
  "ellipsis",
  "perthousand",
  "questiondown",
  "grave",
  "acute",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "dieresis",
  "ring",
  "cedilla",
  "hungarumlaut",
  "ogonek",
  "caron",
  "emdash",
  "AE",
  "ordfeminine",
  "Lslash",
  "Oslash",
  "OE",
  "ordmasculine",
  "ae",
  "dotlessi",
  "lslash",
  "oslash",
  "oe",
  "germandbls",
  "onesuperior",
  "logicalnot",
  "mu",
  "trademark",
  "Eth",
  "onehalf",
  "plusminus",
  "Thorn",
  "onequarter",
  "divide",
  "brokenbar",
  "degree",
  "thorn",
  "threequarters",
  "twosuperior",
  "registered",
  "minus",
  "eth",
  "multiply",
  "threesuperior",
  "copyright",
  "Aacute",
  "Acircumflex",
  "Adieresis",
  "Agrave",
  "Aring",
  "Atilde",
  "Ccedilla",
  "Eacute",
  "Ecircumflex",
  "Edieresis",
  "Egrave",
  "Iacute",
  "Icircumflex",
  "Idieresis",
  "Igrave",
  "Ntilde",
  "Oacute",
  "Ocircumflex",
  "Odieresis",
  "Ograve",
  "Otilde",
  "Scaron",
  "Uacute",
  "Ucircumflex",
  "Udieresis",
  "Ugrave",
  "Yacute",
  "Ydieresis",
  "Zcaron",
  "aacute",
  "acircumflex",
  "adieresis",
  "agrave",
  "aring",
  "atilde",
  "ccedilla",
  "eacute",
  "ecircumflex",
  "edieresis",
  "egrave",
  "iacute",
  "icircumflex",
  "idieresis",
  "igrave",
  "ntilde",
  "oacute",
  "ocircumflex",
  "odieresis",
  "ograve",
  "otilde",
  "scaron",
  "uacute",
  "ucircumflex",
  "udieresis",
  "ugrave",
  "yacute",
  "ydieresis",
  "zcaron",
  "exclamsmall",
  "Hungarumlautsmall",
  "dollaroldstyle",
  "dollarsuperior",
  "ampersandsmall",
  "Acutesmall",
  "parenleftsuperior",
  "parenrightsuperior",
  "266 ff",
  "onedotenleader",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "questionsmall",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "isuperior",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "ff",
  "ffi",
  "ffl",
  "parenleftinferior",
  "parenrightinferior",
  "Circumflexsmall",
  "hyphensuperior",
  "Gravesmall",
  "Asmall",
  "Bsmall",
  "Csmall",
  "Dsmall",
  "Esmall",
  "Fsmall",
  "Gsmall",
  "Hsmall",
  "Ismall",
  "Jsmall",
  "Ksmall",
  "Lsmall",
  "Msmall",
  "Nsmall",
  "Osmall",
  "Psmall",
  "Qsmall",
  "Rsmall",
  "Ssmall",
  "Tsmall",
  "Usmall",
  "Vsmall",
  "Wsmall",
  "Xsmall",
  "Ysmall",
  "Zsmall",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "Tildesmall",
  "exclamdownsmall",
  "centoldstyle",
  "Lslashsmall",
  "Scaronsmall",
  "Zcaronsmall",
  "Dieresissmall",
  "Brevesmall",
  "Caronsmall",
  "Dotaccentsmall",
  "Macronsmall",
  "figuredash",
  "hypheninferior",
  "Ogoneksmall",
  "Ringsmall",
  "Cedillasmall",
  "questiondownsmall",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "zerosuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior",
  "Agravesmall",
  "Aacutesmall",
  "Acircumflexsmall",
  "Atildesmall",
  "Adieresissmall",
  "Aringsmall",
  "AEsmall",
  "Ccedillasmall",
  "Egravesmall",
  "Eacutesmall",
  "Ecircumflexsmall",
  "Edieresissmall",
  "Igravesmall",
  "Iacutesmall",
  "Icircumflexsmall",
  "Idieresissmall",
  "Ethsmall",
  "Ntildesmall",
  "Ogravesmall",
  "Oacutesmall",
  "Ocircumflexsmall",
  "Otildesmall",
  "Odieresissmall",
  "OEsmall",
  "Oslashsmall",
  "Ugravesmall",
  "Uacutesmall",
  "Ucircumflexsmall",
  "Udieresissmall",
  "Yacutesmall",
  "Thornsmall",
  "Ydieresissmall",
  "001.000",
  "001.001",
  "001.002",
  "001.003",
  "Black",
  "Bold",
  "Book",
  "Light",
  "Medium",
  "Regular",
  "Roman",
  "Semibold"
];
var cffStandardEncoding = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quoteright",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "quoteleft",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "exclamdown",
  "cent",
  "sterling",
  "fraction",
  "yen",
  "florin",
  "section",
  "currency",
  "quotesingle",
  "quotedblleft",
  "guillemotleft",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "",
  "endash",
  "dagger",
  "daggerdbl",
  "periodcentered",
  "",
  "paragraph",
  "bullet",
  "quotesinglbase",
  "quotedblbase",
  "quotedblright",
  "guillemotright",
  "ellipsis",
  "perthousand",
  "",
  "questiondown",
  "",
  "grave",
  "acute",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "dieresis",
  "",
  "ring",
  "cedilla",
  "",
  "hungarumlaut",
  "ogonek",
  "caron",
  "emdash",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "AE",
  "",
  "ordfeminine",
  "",
  "",
  "",
  "",
  "Lslash",
  "Oslash",
  "OE",
  "ordmasculine",
  "",
  "",
  "",
  "",
  "",
  "ae",
  "",
  "",
  "",
  "dotlessi",
  "",
  "",
  "lslash",
  "oslash",
  "oe",
  "germandbls"
];
var cffExpertEncoding = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "space",
  "exclamsmall",
  "Hungarumlautsmall",
  "",
  "dollaroldstyle",
  "dollarsuperior",
  "ampersandsmall",
  "Acutesmall",
  "parenleftsuperior",
  "parenrightsuperior",
  "twodotenleader",
  "onedotenleader",
  "comma",
  "hyphen",
  "period",
  "fraction",
  "zerooldstyle",
  "oneoldstyle",
  "twooldstyle",
  "threeoldstyle",
  "fouroldstyle",
  "fiveoldstyle",
  "sixoldstyle",
  "sevenoldstyle",
  "eightoldstyle",
  "nineoldstyle",
  "colon",
  "semicolon",
  "commasuperior",
  "threequartersemdash",
  "periodsuperior",
  "questionsmall",
  "",
  "asuperior",
  "bsuperior",
  "centsuperior",
  "dsuperior",
  "esuperior",
  "",
  "",
  "isuperior",
  "",
  "",
  "lsuperior",
  "msuperior",
  "nsuperior",
  "osuperior",
  "",
  "",
  "rsuperior",
  "ssuperior",
  "tsuperior",
  "",
  "ff",
  "fi",
  "fl",
  "ffi",
  "ffl",
  "parenleftinferior",
  "",
  "parenrightinferior",
  "Circumflexsmall",
  "hyphensuperior",
  "Gravesmall",
  "Asmall",
  "Bsmall",
  "Csmall",
  "Dsmall",
  "Esmall",
  "Fsmall",
  "Gsmall",
  "Hsmall",
  "Ismall",
  "Jsmall",
  "Ksmall",
  "Lsmall",
  "Msmall",
  "Nsmall",
  "Osmall",
  "Psmall",
  "Qsmall",
  "Rsmall",
  "Ssmall",
  "Tsmall",
  "Usmall",
  "Vsmall",
  "Wsmall",
  "Xsmall",
  "Ysmall",
  "Zsmall",
  "colonmonetary",
  "onefitted",
  "rupiah",
  "Tildesmall",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "exclamdownsmall",
  "centoldstyle",
  "Lslashsmall",
  "",
  "",
  "Scaronsmall",
  "Zcaronsmall",
  "Dieresissmall",
  "Brevesmall",
  "Caronsmall",
  "",
  "Dotaccentsmall",
  "",
  "",
  "Macronsmall",
  "",
  "",
  "figuredash",
  "hypheninferior",
  "",
  "",
  "Ogoneksmall",
  "Ringsmall",
  "Cedillasmall",
  "",
  "",
  "",
  "onequarter",
  "onehalf",
  "threequarters",
  "questiondownsmall",
  "oneeighth",
  "threeeighths",
  "fiveeighths",
  "seveneighths",
  "onethird",
  "twothirds",
  "",
  "",
  "zerosuperior",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "foursuperior",
  "fivesuperior",
  "sixsuperior",
  "sevensuperior",
  "eightsuperior",
  "ninesuperior",
  "zeroinferior",
  "oneinferior",
  "twoinferior",
  "threeinferior",
  "fourinferior",
  "fiveinferior",
  "sixinferior",
  "seveninferior",
  "eightinferior",
  "nineinferior",
  "centinferior",
  "dollarinferior",
  "periodinferior",
  "commainferior",
  "Agravesmall",
  "Aacutesmall",
  "Acircumflexsmall",
  "Atildesmall",
  "Adieresissmall",
  "Aringsmall",
  "AEsmall",
  "Ccedillasmall",
  "Egravesmall",
  "Eacutesmall",
  "Ecircumflexsmall",
  "Edieresissmall",
  "Igravesmall",
  "Iacutesmall",
  "Icircumflexsmall",
  "Idieresissmall",
  "Ethsmall",
  "Ntildesmall",
  "Ogravesmall",
  "Oacutesmall",
  "Ocircumflexsmall",
  "Otildesmall",
  "Odieresissmall",
  "OEsmall",
  "Oslashsmall",
  "Ugravesmall",
  "Uacutesmall",
  "Ucircumflexsmall",
  "Udieresissmall",
  "Yacutesmall",
  "Thornsmall",
  "Ydieresissmall"
];
var standardNames = [
  ".notdef",
  ".null",
  "nonmarkingreturn",
  "space",
  "exclam",
  "quotedbl",
  "numbersign",
  "dollar",
  "percent",
  "ampersand",
  "quotesingle",
  "parenleft",
  "parenright",
  "asterisk",
  "plus",
  "comma",
  "hyphen",
  "period",
  "slash",
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "colon",
  "semicolon",
  "less",
  "equal",
  "greater",
  "question",
  "at",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "bracketleft",
  "backslash",
  "bracketright",
  "asciicircum",
  "underscore",
  "grave",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "braceleft",
  "bar",
  "braceright",
  "asciitilde",
  "Adieresis",
  "Aring",
  "Ccedilla",
  "Eacute",
  "Ntilde",
  "Odieresis",
  "Udieresis",
  "aacute",
  "agrave",
  "acircumflex",
  "adieresis",
  "atilde",
  "aring",
  "ccedilla",
  "eacute",
  "egrave",
  "ecircumflex",
  "edieresis",
  "iacute",
  "igrave",
  "icircumflex",
  "idieresis",
  "ntilde",
  "oacute",
  "ograve",
  "ocircumflex",
  "odieresis",
  "otilde",
  "uacute",
  "ugrave",
  "ucircumflex",
  "udieresis",
  "dagger",
  "degree",
  "cent",
  "sterling",
  "section",
  "bullet",
  "paragraph",
  "germandbls",
  "registered",
  "copyright",
  "trademark",
  "acute",
  "dieresis",
  "notequal",
  "AE",
  "Oslash",
  "infinity",
  "plusminus",
  "lessequal",
  "greaterequal",
  "yen",
  "mu",
  "partialdiff",
  "summation",
  "product",
  "pi",
  "integral",
  "ordfeminine",
  "ordmasculine",
  "Omega",
  "ae",
  "oslash",
  "questiondown",
  "exclamdown",
  "logicalnot",
  "radical",
  "florin",
  "approxequal",
  "Delta",
  "guillemotleft",
  "guillemotright",
  "ellipsis",
  "nonbreakingspace",
  "Agrave",
  "Atilde",
  "Otilde",
  "OE",
  "oe",
  "endash",
  "emdash",
  "quotedblleft",
  "quotedblright",
  "quoteleft",
  "quoteright",
  "divide",
  "lozenge",
  "ydieresis",
  "Ydieresis",
  "fraction",
  "currency",
  "guilsinglleft",
  "guilsinglright",
  "fi",
  "fl",
  "daggerdbl",
  "periodcentered",
  "quotesinglbase",
  "quotedblbase",
  "perthousand",
  "Acircumflex",
  "Ecircumflex",
  "Aacute",
  "Edieresis",
  "Egrave",
  "Iacute",
  "Icircumflex",
  "Idieresis",
  "Igrave",
  "Oacute",
  "Ocircumflex",
  "apple",
  "Ograve",
  "Uacute",
  "Ucircumflex",
  "Ugrave",
  "dotlessi",
  "circumflex",
  "tilde",
  "macron",
  "breve",
  "dotaccent",
  "ring",
  "cedilla",
  "hungarumlaut",
  "ogonek",
  "caron",
  "Lslash",
  "lslash",
  "Scaron",
  "scaron",
  "Zcaron",
  "zcaron",
  "brokenbar",
  "Eth",
  "eth",
  "Yacute",
  "yacute",
  "Thorn",
  "thorn",
  "minus",
  "multiply",
  "onesuperior",
  "twosuperior",
  "threesuperior",
  "onehalf",
  "onequarter",
  "threequarters",
  "franc",
  "Gbreve",
  "gbreve",
  "Idotaccent",
  "Scedilla",
  "scedilla",
  "Cacute",
  "cacute",
  "Ccaron",
  "ccaron",
  "dcroat"
];
function DefaultEncoding(font) {
  this.font = font;
}
DefaultEncoding.prototype.charToGlyphIndex = function(c30) {
  var code = c30.codePointAt(0);
  var glyphs = this.font.glyphs;
  if (glyphs) {
    for (var i36 = 0; i36 < glyphs.length; i36 += 1) {
      var glyph = glyphs.get(i36);
      for (var j9 = 0; j9 < glyph.unicodes.length; j9 += 1) {
        if (glyph.unicodes[j9] === code) {
          return i36;
        }
      }
    }
  }
  return null;
};
function CmapEncoding(cmap2) {
  this.cmap = cmap2;
}
CmapEncoding.prototype.charToGlyphIndex = function(c30) {
  return this.cmap.glyphIndexMap[c30.codePointAt(0)] || 0;
};
function CffEncoding(encoding, charset) {
  this.encoding = encoding;
  this.charset = charset;
}
CffEncoding.prototype.charToGlyphIndex = function(s33) {
  var code = s33.codePointAt(0);
  var charName = this.encoding[code];
  return this.charset.indexOf(charName);
};
function GlyphNames(post2) {
  switch (post2.version) {
    case 1:
      this.names = standardNames.slice();
      break;
    case 2:
      this.names = new Array(post2.numberOfGlyphs);
      for (var i36 = 0; i36 < post2.numberOfGlyphs; i36++) {
        if (post2.glyphNameIndex[i36] < standardNames.length) {
          this.names[i36] = standardNames[post2.glyphNameIndex[i36]];
        } else {
          this.names[i36] = post2.names[post2.glyphNameIndex[i36] - standardNames.length];
        }
      }
      break;
    case 2.5:
      this.names = new Array(post2.numberOfGlyphs);
      for (var i$1 = 0; i$1 < post2.numberOfGlyphs; i$1++) {
        this.names[i$1] = standardNames[i$1 + post2.glyphNameIndex[i$1]];
      }
      break;
    case 3:
      this.names = [];
      break;
    default:
      this.names = [];
      break;
  }
}
GlyphNames.prototype.nameToGlyphIndex = function(name) {
  return this.names.indexOf(name);
};
GlyphNames.prototype.glyphIndexToName = function(gid) {
  return this.names[gid];
};
function addGlyphNamesAll(font) {
  var glyph;
  var glyphIndexMap = font.tables.cmap.glyphIndexMap;
  var charCodes = Object.keys(glyphIndexMap);
  for (var i36 = 0; i36 < charCodes.length; i36 += 1) {
    var c30 = charCodes[i36];
    var glyphIndex = glyphIndexMap[c30];
    glyph = font.glyphs.get(glyphIndex);
    glyph.addUnicode(parseInt(c30));
  }
  for (var i$1 = 0; i$1 < font.glyphs.length; i$1 += 1) {
    glyph = font.glyphs.get(i$1);
    if (font.cffEncoding) {
      if (font.isCIDFont) {
        glyph.name = "gid" + i$1;
      } else {
        glyph.name = font.cffEncoding.charset[i$1];
      }
    } else if (font.glyphNames.names) {
      glyph.name = font.glyphNames.glyphIndexToName(i$1);
    }
  }
}
function addGlyphNamesToUnicodeMap(font) {
  font._IndexToUnicodeMap = {};
  var glyphIndexMap = font.tables.cmap.glyphIndexMap;
  var charCodes = Object.keys(glyphIndexMap);
  for (var i36 = 0; i36 < charCodes.length; i36 += 1) {
    var c30 = charCodes[i36];
    var glyphIndex = glyphIndexMap[c30];
    if (font._IndexToUnicodeMap[glyphIndex] === void 0) {
      font._IndexToUnicodeMap[glyphIndex] = {
        unicodes: [parseInt(c30)]
      };
    } else {
      font._IndexToUnicodeMap[glyphIndex].unicodes.push(parseInt(c30));
    }
  }
}
function addGlyphNames(font, opt) {
  if (opt.lowMemory) {
    addGlyphNamesToUnicodeMap(font);
  } else {
    addGlyphNamesAll(font);
  }
}
function line(ctx, x1, y1, x22, y22) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x22, y22);
  ctx.stroke();
}
var draw = { line };
function getPathDefinition(glyph, path) {
  var _path = path || new Path();
  return {
    configurable: true,
    get: function() {
      if (typeof _path === "function") {
        _path = _path();
      }
      return _path;
    },
    set: function(p28) {
      _path = p28;
    }
  };
}
function Glyph(options) {
  this.bindConstructorValues(options);
}
Glyph.prototype.bindConstructorValues = function(options) {
  this.index = options.index || 0;
  this.name = options.name || null;
  this.unicode = options.unicode || void 0;
  this.unicodes = options.unicodes || options.unicode !== void 0 ? [options.unicode] : [];
  if ("xMin" in options) {
    this.xMin = options.xMin;
  }
  if ("yMin" in options) {
    this.yMin = options.yMin;
  }
  if ("xMax" in options) {
    this.xMax = options.xMax;
  }
  if ("yMax" in options) {
    this.yMax = options.yMax;
  }
  if ("advanceWidth" in options) {
    this.advanceWidth = options.advanceWidth;
  }
  Object.defineProperty(this, "path", getPathDefinition(this, options.path));
};
Glyph.prototype.addUnicode = function(unicode) {
  if (this.unicodes.length === 0) {
    this.unicode = unicode;
  }
  this.unicodes.push(unicode);
};
Glyph.prototype.getBoundingBox = function() {
  return this.path.getBoundingBox();
};
Glyph.prototype.getPath = function(x19, y22, fontSize, options, font) {
  x19 = x19 !== void 0 ? x19 : 0;
  y22 = y22 !== void 0 ? y22 : 0;
  fontSize = fontSize !== void 0 ? fontSize : 72;
  var commands;
  var hPoints;
  if (!options) {
    options = {};
  }
  var xScale = options.xScale;
  var yScale = options.yScale;
  if (options.hinting && font && font.hinting) {
    hPoints = this.path && font.hinting.exec(this, fontSize);
  }
  if (hPoints) {
    commands = font.hinting.getCommands(hPoints);
    x19 = Math.round(x19);
    y22 = Math.round(y22);
    xScale = yScale = 1;
  } else {
    commands = this.path.commands;
    var scale = 1 / (this.path.unitsPerEm || 1e3) * fontSize;
    if (xScale === void 0) {
      xScale = scale;
    }
    if (yScale === void 0) {
      yScale = scale;
    }
  }
  var p28 = new Path();
  for (var i36 = 0; i36 < commands.length; i36 += 1) {
    var cmd = commands[i36];
    if (cmd.type === "M") {
      p28.moveTo(x19 + cmd.x * xScale, y22 + -cmd.y * yScale);
    } else if (cmd.type === "L") {
      p28.lineTo(x19 + cmd.x * xScale, y22 + -cmd.y * yScale);
    } else if (cmd.type === "Q") {
      p28.quadraticCurveTo(
        x19 + cmd.x1 * xScale,
        y22 + -cmd.y1 * yScale,
        x19 + cmd.x * xScale,
        y22 + -cmd.y * yScale
      );
    } else if (cmd.type === "C") {
      p28.curveTo(
        x19 + cmd.x1 * xScale,
        y22 + -cmd.y1 * yScale,
        x19 + cmd.x2 * xScale,
        y22 + -cmd.y2 * yScale,
        x19 + cmd.x * xScale,
        y22 + -cmd.y * yScale
      );
    } else if (cmd.type === "Z") {
      p28.closePath();
    }
  }
  return p28;
};
Glyph.prototype.getContours = function() {
  if (this.points === void 0) {
    return [];
  }
  var contours = [];
  var currentContour = [];
  for (var i36 = 0; i36 < this.points.length; i36 += 1) {
    var pt = this.points[i36];
    currentContour.push(pt);
    if (pt.lastPointOfContour) {
      contours.push(currentContour);
      currentContour = [];
    }
  }
  check.argument(currentContour.length === 0, "There are still points left in the current contour.");
  return contours;
};
Glyph.prototype.getMetrics = function() {
  var commands = this.path.commands;
  var xCoords = [];
  var yCoords = [];
  for (var i36 = 0; i36 < commands.length; i36 += 1) {
    var cmd = commands[i36];
    if (cmd.type !== "Z") {
      xCoords.push(cmd.x);
      yCoords.push(cmd.y);
    }
    if (cmd.type === "Q" || cmd.type === "C") {
      xCoords.push(cmd.x1);
      yCoords.push(cmd.y1);
    }
    if (cmd.type === "C") {
      xCoords.push(cmd.x2);
      yCoords.push(cmd.y2);
    }
  }
  var metrics = {
    xMin: Math.min.apply(null, xCoords),
    yMin: Math.min.apply(null, yCoords),
    xMax: Math.max.apply(null, xCoords),
    yMax: Math.max.apply(null, yCoords),
    leftSideBearing: this.leftSideBearing
  };
  if (!isFinite(metrics.xMin)) {
    metrics.xMin = 0;
  }
  if (!isFinite(metrics.xMax)) {
    metrics.xMax = this.advanceWidth;
  }
  if (!isFinite(metrics.yMin)) {
    metrics.yMin = 0;
  }
  if (!isFinite(metrics.yMax)) {
    metrics.yMax = 0;
  }
  metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
  return metrics;
};
Glyph.prototype.draw = function(ctx, x19, y22, fontSize, options) {
  this.getPath(x19, y22, fontSize, options).draw(ctx);
};
Glyph.prototype.drawPoints = function(ctx, x19, y22, fontSize) {
  function drawCircles(l29, x20, y23, scale2) {
    ctx.beginPath();
    for (var j9 = 0; j9 < l29.length; j9 += 1) {
      ctx.moveTo(x20 + l29[j9].x * scale2, y23 + l29[j9].y * scale2);
      ctx.arc(x20 + l29[j9].x * scale2, y23 + l29[j9].y * scale2, 2, 0, Math.PI * 2, false);
    }
    ctx.closePath();
    ctx.fill();
  }
  x19 = x19 !== void 0 ? x19 : 0;
  y22 = y22 !== void 0 ? y22 : 0;
  fontSize = fontSize !== void 0 ? fontSize : 24;
  var scale = 1 / this.path.unitsPerEm * fontSize;
  var blueCircles = [];
  var redCircles = [];
  var path = this.path;
  for (var i36 = 0; i36 < path.commands.length; i36 += 1) {
    var cmd = path.commands[i36];
    if (cmd.x !== void 0) {
      blueCircles.push({ x: cmd.x, y: -cmd.y });
    }
    if (cmd.x1 !== void 0) {
      redCircles.push({ x: cmd.x1, y: -cmd.y1 });
    }
    if (cmd.x2 !== void 0) {
      redCircles.push({ x: cmd.x2, y: -cmd.y2 });
    }
  }
  ctx.fillStyle = "blue";
  drawCircles(blueCircles, x19, y22, scale);
  ctx.fillStyle = "red";
  drawCircles(redCircles, x19, y22, scale);
};
Glyph.prototype.drawMetrics = function(ctx, x19, y22, fontSize) {
  var scale;
  x19 = x19 !== void 0 ? x19 : 0;
  y22 = y22 !== void 0 ? y22 : 0;
  fontSize = fontSize !== void 0 ? fontSize : 24;
  scale = 1 / this.path.unitsPerEm * fontSize;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  draw.line(ctx, x19, -1e4, x19, 1e4);
  draw.line(ctx, -1e4, y22, 1e4, y22);
  var xMin = this.xMin || 0;
  var yMin = this.yMin || 0;
  var xMax = this.xMax || 0;
  var yMax = this.yMax || 0;
  var advanceWidth = this.advanceWidth || 0;
  ctx.strokeStyle = "blue";
  draw.line(ctx, x19 + xMin * scale, -1e4, x19 + xMin * scale, 1e4);
  draw.line(ctx, x19 + xMax * scale, -1e4, x19 + xMax * scale, 1e4);
  draw.line(ctx, -1e4, y22 + -yMin * scale, 1e4, y22 + -yMin * scale);
  draw.line(ctx, -1e4, y22 + -yMax * scale, 1e4, y22 + -yMax * scale);
  ctx.strokeStyle = "green";
  draw.line(ctx, x19 + advanceWidth * scale, -1e4, x19 + advanceWidth * scale, 1e4);
};
function defineDependentProperty(glyph, externalName, internalName) {
  Object.defineProperty(glyph, externalName, {
    get: function() {
      glyph.path;
      return glyph[internalName];
    },
    set: function(newValue) {
      glyph[internalName] = newValue;
    },
    enumerable: true,
    configurable: true
  });
}
function GlyphSet(font, glyphs) {
  this.font = font;
  this.glyphs = {};
  if (Array.isArray(glyphs)) {
    for (var i36 = 0; i36 < glyphs.length; i36++) {
      var glyph = glyphs[i36];
      glyph.path.unitsPerEm = font.unitsPerEm;
      this.glyphs[i36] = glyph;
    }
  }
  this.length = glyphs && glyphs.length || 0;
}
GlyphSet.prototype.get = function(index) {
  if (this.glyphs[index] === void 0) {
    this.font._push(index);
    if (typeof this.glyphs[index] === "function") {
      this.glyphs[index] = this.glyphs[index]();
    }
    var glyph = this.glyphs[index];
    var unicodeObj = this.font._IndexToUnicodeMap[index];
    if (unicodeObj) {
      for (var j9 = 0; j9 < unicodeObj.unicodes.length; j9++) {
        glyph.addUnicode(unicodeObj.unicodes[j9]);
      }
    }
    if (this.font.cffEncoding) {
      if (this.font.isCIDFont) {
        glyph.name = "gid" + index;
      } else {
        glyph.name = this.font.cffEncoding.charset[index];
      }
    } else if (this.font.glyphNames.names) {
      glyph.name = this.font.glyphNames.glyphIndexToName(index);
    }
    this.glyphs[index].advanceWidth = this.font._hmtxTableData[index].advanceWidth;
    this.glyphs[index].leftSideBearing = this.font._hmtxTableData[index].leftSideBearing;
  } else {
    if (typeof this.glyphs[index] === "function") {
      this.glyphs[index] = this.glyphs[index]();
    }
  }
  return this.glyphs[index];
};
GlyphSet.prototype.push = function(index, loader) {
  this.glyphs[index] = loader;
  this.length++;
};
function glyphLoader(font, index) {
  return new Glyph({ index, font });
}
function ttfGlyphLoader(font, index, parseGlyph2, data, position, buildPath2) {
  return function() {
    var glyph = new Glyph({ index, font });
    glyph.path = function() {
      parseGlyph2(glyph, data, position);
      var path = buildPath2(font.glyphs, glyph);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };
    defineDependentProperty(glyph, "xMin", "_xMin");
    defineDependentProperty(glyph, "xMax", "_xMax");
    defineDependentProperty(glyph, "yMin", "_yMin");
    defineDependentProperty(glyph, "yMax", "_yMax");
    return glyph;
  };
}
function cffGlyphLoader(font, index, parseCFFCharstring2, charstring) {
  return function() {
    var glyph = new Glyph({ index, font });
    glyph.path = function() {
      var path = parseCFFCharstring2(font, glyph, charstring);
      path.unitsPerEm = font.unitsPerEm;
      return path;
    };
    return glyph;
  };
}
var glyphset = { GlyphSet, glyphLoader, ttfGlyphLoader, cffGlyphLoader };
function equals(a34, b20) {
  if (a34 === b20) {
    return true;
  } else if (Array.isArray(a34) && Array.isArray(b20)) {
    if (a34.length !== b20.length) {
      return false;
    }
    for (var i36 = 0; i36 < a34.length; i36 += 1) {
      if (!equals(a34[i36], b20[i36])) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}
function calcCFFSubroutineBias(subrs) {
  var bias;
  if (subrs.length < 1240) {
    bias = 107;
  } else if (subrs.length < 33900) {
    bias = 1131;
  } else {
    bias = 32768;
  }
  return bias;
}
function parseCFFIndex(data, start, conversionFn) {
  var offsets = [];
  var objects = [];
  var count = parse.getCard16(data, start);
  var objectOffset;
  var endOffset;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
    var pos = start + 3;
    for (var i36 = 0; i36 < count + 1; i36 += 1) {
      offsets.push(parse.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    }
    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }
  for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
    var value = parse.getBytes(data, objectOffset + offsets[i$1], objectOffset + offsets[i$1 + 1]);
    if (conversionFn) {
      value = conversionFn(value);
    }
    objects.push(value);
  }
  return { objects, startOffset: start, endOffset };
}
function parseCFFIndexLowMemory(data, start) {
  var offsets = [];
  var count = parse.getCard16(data, start);
  var objectOffset;
  var endOffset;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
    var pos = start + 3;
    for (var i36 = 0; i36 < count + 1; i36 += 1) {
      offsets.push(parse.getOffset(data, pos, offsetSize));
      pos += offsetSize;
    }
    endOffset = objectOffset + offsets[count];
  } else {
    endOffset = start + 2;
  }
  return { offsets, startOffset: start, endOffset };
}
function getCffIndexObject(i36, offsets, data, start, conversionFn) {
  var count = parse.getCard16(data, start);
  var objectOffset = 0;
  if (count !== 0) {
    var offsetSize = parse.getByte(data, start + 2);
    objectOffset = start + (count + 1) * offsetSize + 2;
  }
  var value = parse.getBytes(data, objectOffset + offsets[i36], objectOffset + offsets[i36 + 1]);
  if (conversionFn) {
    value = conversionFn(value);
  }
  return value;
}
function parseFloatOperand(parser) {
  var s33 = "";
  var eof = 15;
  var lookup = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "E", "E-", null, "-"];
  while (true) {
    var b20 = parser.parseByte();
    var n1 = b20 >> 4;
    var n210 = b20 & 15;
    if (n1 === eof) {
      break;
    }
    s33 += lookup[n1];
    if (n210 === eof) {
      break;
    }
    s33 += lookup[n210];
  }
  return parseFloat(s33);
}
function parseOperand(parser, b0) {
  var b1;
  var b22;
  var b32;
  var b42;
  if (b0 === 28) {
    b1 = parser.parseByte();
    b22 = parser.parseByte();
    return b1 << 8 | b22;
  }
  if (b0 === 29) {
    b1 = parser.parseByte();
    b22 = parser.parseByte();
    b32 = parser.parseByte();
    b42 = parser.parseByte();
    return b1 << 24 | b22 << 16 | b32 << 8 | b42;
  }
  if (b0 === 30) {
    return parseFloatOperand(parser);
  }
  if (b0 >= 32 && b0 <= 246) {
    return b0 - 139;
  }
  if (b0 >= 247 && b0 <= 250) {
    b1 = parser.parseByte();
    return (b0 - 247) * 256 + b1 + 108;
  }
  if (b0 >= 251 && b0 <= 254) {
    b1 = parser.parseByte();
    return -(b0 - 251) * 256 - b1 - 108;
  }
  throw new Error("Invalid b0 " + b0);
}
function entriesToObject(entries) {
  var o34 = {};
  for (var i36 = 0; i36 < entries.length; i36 += 1) {
    var key = entries[i36][0];
    var values = entries[i36][1];
    var value = void 0;
    if (values.length === 1) {
      value = values[0];
    } else {
      value = values;
    }
    if (o34.hasOwnProperty(key) && !isNaN(o34[key])) {
      throw new Error("Object " + o34 + " already has key " + key);
    }
    o34[key] = value;
  }
  return o34;
}
function parseCFFDict(data, start, size) {
  start = start !== void 0 ? start : 0;
  var parser = new parse.Parser(data, start);
  var entries = [];
  var operands = [];
  size = size !== void 0 ? size : data.length;
  while (parser.relativeOffset < size) {
    var op = parser.parseByte();
    if (op <= 21) {
      if (op === 12) {
        op = 1200 + parser.parseByte();
      }
      entries.push([op, operands]);
      operands = [];
    } else {
      operands.push(parseOperand(parser, op));
    }
  }
  return entriesToObject(entries);
}
function getCFFString(strings, index) {
  if (index <= 390) {
    index = cffStandardStrings[index];
  } else {
    index = strings[index - 391];
  }
  return index;
}
function interpretDict(dict, meta2, strings) {
  var newDict = {};
  var value;
  for (var i36 = 0; i36 < meta2.length; i36 += 1) {
    var m24 = meta2[i36];
    if (Array.isArray(m24.type)) {
      var values = [];
      values.length = m24.type.length;
      for (var j9 = 0; j9 < m24.type.length; j9++) {
        value = dict[m24.op] !== void 0 ? dict[m24.op][j9] : void 0;
        if (value === void 0) {
          value = m24.value !== void 0 && m24.value[j9] !== void 0 ? m24.value[j9] : null;
        }
        if (m24.type[j9] === "SID") {
          value = getCFFString(strings, value);
        }
        values[j9] = value;
      }
      newDict[m24.name] = values;
    } else {
      value = dict[m24.op];
      if (value === void 0) {
        value = m24.value !== void 0 ? m24.value : null;
      }
      if (m24.type === "SID") {
        value = getCFFString(strings, value);
      }
      newDict[m24.name] = value;
    }
  }
  return newDict;
}
function parseCFFHeader(data, start) {
  var header = {};
  header.formatMajor = parse.getCard8(data, start);
  header.formatMinor = parse.getCard8(data, start + 1);
  header.size = parse.getCard8(data, start + 2);
  header.offsetSize = parse.getCard8(data, start + 3);
  header.startOffset = start;
  header.endOffset = start + 4;
  return header;
}
var TOP_DICT_META = [
  { name: "version", op: 0, type: "SID" },
  { name: "notice", op: 1, type: "SID" },
  { name: "copyright", op: 1200, type: "SID" },
  { name: "fullName", op: 2, type: "SID" },
  { name: "familyName", op: 3, type: "SID" },
  { name: "weight", op: 4, type: "SID" },
  { name: "isFixedPitch", op: 1201, type: "number", value: 0 },
  { name: "italicAngle", op: 1202, type: "number", value: 0 },
  { name: "underlinePosition", op: 1203, type: "number", value: -100 },
  { name: "underlineThickness", op: 1204, type: "number", value: 50 },
  { name: "paintType", op: 1205, type: "number", value: 0 },
  { name: "charstringType", op: 1206, type: "number", value: 2 },
  {
    name: "fontMatrix",
    op: 1207,
    type: ["real", "real", "real", "real", "real", "real"],
    value: [1e-3, 0, 0, 1e-3, 0, 0]
  },
  { name: "uniqueId", op: 13, type: "number" },
  { name: "fontBBox", op: 5, type: ["number", "number", "number", "number"], value: [0, 0, 0, 0] },
  { name: "strokeWidth", op: 1208, type: "number", value: 0 },
  { name: "xuid", op: 14, type: [], value: null },
  { name: "charset", op: 15, type: "offset", value: 0 },
  { name: "encoding", op: 16, type: "offset", value: 0 },
  { name: "charStrings", op: 17, type: "offset", value: 0 },
  { name: "private", op: 18, type: ["number", "offset"], value: [0, 0] },
  { name: "ros", op: 1230, type: ["SID", "SID", "number"] },
  { name: "cidFontVersion", op: 1231, type: "number", value: 0 },
  { name: "cidFontRevision", op: 1232, type: "number", value: 0 },
  { name: "cidFontType", op: 1233, type: "number", value: 0 },
  { name: "cidCount", op: 1234, type: "number", value: 8720 },
  { name: "uidBase", op: 1235, type: "number" },
  { name: "fdArray", op: 1236, type: "offset" },
  { name: "fdSelect", op: 1237, type: "offset" },
  { name: "fontName", op: 1238, type: "SID" }
];
var PRIVATE_DICT_META = [
  { name: "subrs", op: 19, type: "offset", value: 0 },
  { name: "defaultWidthX", op: 20, type: "number", value: 0 },
  { name: "nominalWidthX", op: 21, type: "number", value: 0 }
];
function parseCFFTopDict(data, strings) {
  var dict = parseCFFDict(data, 0, data.byteLength);
  return interpretDict(dict, TOP_DICT_META, strings);
}
function parseCFFPrivateDict(data, start, size, strings) {
  var dict = parseCFFDict(data, start, size);
  return interpretDict(dict, PRIVATE_DICT_META, strings);
}
function gatherCFFTopDicts(data, start, cffIndex, strings) {
  var topDictArray = [];
  for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
    var topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
    var topDict = parseCFFTopDict(topDictData, strings);
    topDict._subrs = [];
    topDict._subrsBias = 0;
    topDict._defaultWidthX = 0;
    topDict._nominalWidthX = 0;
    var privateSize = topDict.private[0];
    var privateOffset = topDict.private[1];
    if (privateSize !== 0 && privateOffset !== 0) {
      var privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
      topDict._defaultWidthX = privateDict.defaultWidthX;
      topDict._nominalWidthX = privateDict.nominalWidthX;
      if (privateDict.subrs !== 0) {
        var subrOffset = privateOffset + privateDict.subrs;
        var subrIndex = parseCFFIndex(data, subrOffset + start);
        topDict._subrs = subrIndex.objects;
        topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
      }
      topDict._privateDict = privateDict;
    }
    topDictArray.push(topDict);
  }
  return topDictArray;
}
function parseCFFCharset(data, start, nGlyphs, strings) {
  var sid;
  var count;
  var parser = new parse.Parser(data, start);
  nGlyphs -= 1;
  var charset = [".notdef"];
  var format = parser.parseCard8();
  if (format === 0) {
    for (var i36 = 0; i36 < nGlyphs; i36 += 1) {
      sid = parser.parseSID();
      charset.push(getCFFString(strings, sid));
    }
  } else if (format === 1) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard8();
      for (var i$1 = 0; i$1 <= count; i$1 += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else if (format === 2) {
    while (charset.length <= nGlyphs) {
      sid = parser.parseSID();
      count = parser.parseCard16();
      for (var i$2 = 0; i$2 <= count; i$2 += 1) {
        charset.push(getCFFString(strings, sid));
        sid += 1;
      }
    }
  } else {
    throw new Error("Unknown charset format " + format);
  }
  return charset;
}
function parseCFFEncoding(data, start, charset) {
  var code;
  var enc = {};
  var parser = new parse.Parser(data, start);
  var format = parser.parseCard8();
  if (format === 0) {
    var nCodes = parser.parseCard8();
    for (var i36 = 0; i36 < nCodes; i36 += 1) {
      code = parser.parseCard8();
      enc[code] = i36;
    }
  } else if (format === 1) {
    var nRanges = parser.parseCard8();
    code = 1;
    for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
      var first = parser.parseCard8();
      var nLeft = parser.parseCard8();
      for (var j9 = first; j9 <= first + nLeft; j9 += 1) {
        enc[j9] = code;
        code += 1;
      }
    }
  } else {
    throw new Error("Unknown encoding format " + format);
  }
  return new CffEncoding(enc, charset);
}
function parseCFFCharstring(font, glyph, code) {
  var c1x;
  var c1y;
  var c2x;
  var c2y;
  var p28 = new Path();
  var stack = [];
  var nStems = 0;
  var haveWidth = false;
  var open = false;
  var x19 = 0;
  var y22 = 0;
  var subrs;
  var subrsBias;
  var defaultWidthX;
  var nominalWidthX;
  if (font.isCIDFont) {
    var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
    var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
    subrs = fdDict._subrs;
    subrsBias = fdDict._subrsBias;
    defaultWidthX = fdDict._defaultWidthX;
    nominalWidthX = fdDict._nominalWidthX;
  } else {
    subrs = font.tables.cff.topDict._subrs;
    subrsBias = font.tables.cff.topDict._subrsBias;
    defaultWidthX = font.tables.cff.topDict._defaultWidthX;
    nominalWidthX = font.tables.cff.topDict._nominalWidthX;
  }
  var width = defaultWidthX;
  function newContour(x20, y23) {
    if (open) {
      p28.closePath();
    }
    p28.moveTo(x20, y23);
    open = true;
  }
  function parseStems() {
    var hasWidthArg;
    hasWidthArg = stack.length % 2 !== 0;
    if (hasWidthArg && !haveWidth) {
      width = stack.shift() + nominalWidthX;
    }
    nStems += stack.length >> 1;
    stack.length = 0;
    haveWidth = true;
  }
  function parse2(code2) {
    var b1;
    var b22;
    var b32;
    var b42;
    var codeIndex;
    var subrCode;
    var jpx;
    var jpy;
    var c3x;
    var c3y;
    var c4x;
    var c4y;
    var i36 = 0;
    while (i36 < code2.length) {
      var v22 = code2[i36];
      i36 += 1;
      switch (v22) {
        case 1:
          parseStems();
          break;
        case 3:
          parseStems();
          break;
        case 4:
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          y22 += stack.pop();
          newContour(x19, y22);
          break;
        case 5:
          while (stack.length > 0) {
            x19 += stack.shift();
            y22 += stack.shift();
            p28.lineTo(x19, y22);
          }
          break;
        case 6:
          while (stack.length > 0) {
            x19 += stack.shift();
            p28.lineTo(x19, y22);
            if (stack.length === 0) {
              break;
            }
            y22 += stack.shift();
            p28.lineTo(x19, y22);
          }
          break;
        case 7:
          while (stack.length > 0) {
            y22 += stack.shift();
            p28.lineTo(x19, y22);
            if (stack.length === 0) {
              break;
            }
            x19 += stack.shift();
            p28.lineTo(x19, y22);
          }
          break;
        case 8:
          while (stack.length > 0) {
            c1x = x19 + stack.shift();
            c1y = y22 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x + stack.shift();
            y22 = c2y + stack.shift();
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          break;
        case 10:
          codeIndex = stack.pop() + subrsBias;
          subrCode = subrs[codeIndex];
          if (subrCode) {
            parse2(subrCode);
          }
          break;
        case 11:
          return;
        case 12:
          v22 = code2[i36];
          i36 += 1;
          switch (v22) {
            case 35:
              c1x = x19 + stack.shift();
              c1y = y22 + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y + stack.shift();
              c3x = jpx + stack.shift();
              c3y = jpy + stack.shift();
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              x19 = c4x + stack.shift();
              y22 = c4y + stack.shift();
              stack.shift();
              p28.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p28.curveTo(c3x, c3y, c4x, c4y, x19, y22);
              break;
            case 34:
              c1x = x19 + stack.shift();
              c1y = y22;
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y;
              c3x = jpx + stack.shift();
              c3y = c2y;
              c4x = c3x + stack.shift();
              c4y = y22;
              x19 = c4x + stack.shift();
              p28.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p28.curveTo(c3x, c3y, c4x, c4y, x19, y22);
              break;
            case 36:
              c1x = x19 + stack.shift();
              c1y = y22 + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y;
              c3x = jpx + stack.shift();
              c3y = c2y;
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              x19 = c4x + stack.shift();
              p28.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p28.curveTo(c3x, c3y, c4x, c4y, x19, y22);
              break;
            case 37:
              c1x = x19 + stack.shift();
              c1y = y22 + stack.shift();
              c2x = c1x + stack.shift();
              c2y = c1y + stack.shift();
              jpx = c2x + stack.shift();
              jpy = c2y + stack.shift();
              c3x = jpx + stack.shift();
              c3y = jpy + stack.shift();
              c4x = c3x + stack.shift();
              c4y = c3y + stack.shift();
              if (Math.abs(c4x - x19) > Math.abs(c4y - y22)) {
                x19 = c4x + stack.shift();
              } else {
                y22 = c4y + stack.shift();
              }
              p28.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
              p28.curveTo(c3x, c3y, c4x, c4y, x19, y22);
              break;
            default:
              console.log("Glyph " + glyph.index + ": unknown operator 1200" + v22);
              stack.length = 0;
          }
          break;
        case 14:
          if (stack.length > 0 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          if (open) {
            p28.closePath();
            open = false;
          }
          break;
        case 18:
          parseStems();
          break;
        case 19:
        // hintmask
        case 20:
          parseStems();
          i36 += nStems + 7 >> 3;
          break;
        case 21:
          if (stack.length > 2 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          y22 += stack.pop();
          x19 += stack.pop();
          newContour(x19, y22);
          break;
        case 22:
          if (stack.length > 1 && !haveWidth) {
            width = stack.shift() + nominalWidthX;
            haveWidth = true;
          }
          x19 += stack.pop();
          newContour(x19, y22);
          break;
        case 23:
          parseStems();
          break;
        case 24:
          while (stack.length > 2) {
            c1x = x19 + stack.shift();
            c1y = y22 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x + stack.shift();
            y22 = c2y + stack.shift();
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          x19 += stack.shift();
          y22 += stack.shift();
          p28.lineTo(x19, y22);
          break;
        case 25:
          while (stack.length > 6) {
            x19 += stack.shift();
            y22 += stack.shift();
            p28.lineTo(x19, y22);
          }
          c1x = x19 + stack.shift();
          c1y = y22 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x19 = c2x + stack.shift();
          y22 = c2y + stack.shift();
          p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          break;
        case 26:
          if (stack.length % 2) {
            x19 += stack.shift();
          }
          while (stack.length > 0) {
            c1x = x19;
            c1y = y22 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x;
            y22 = c2y + stack.shift();
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          break;
        case 27:
          if (stack.length % 2) {
            y22 += stack.shift();
          }
          while (stack.length > 0) {
            c1x = x19 + stack.shift();
            c1y = y22;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x + stack.shift();
            y22 = c2y;
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          break;
        case 28:
          b1 = code2[i36];
          b22 = code2[i36 + 1];
          stack.push((b1 << 24 | b22 << 16) >> 16);
          i36 += 2;
          break;
        case 29:
          codeIndex = stack.pop() + font.gsubrsBias;
          subrCode = font.gsubrs[codeIndex];
          if (subrCode) {
            parse2(subrCode);
          }
          break;
        case 30:
          while (stack.length > 0) {
            c1x = x19;
            c1y = y22 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x + stack.shift();
            y22 = c2y + (stack.length === 1 ? stack.shift() : 0);
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
            if (stack.length === 0) {
              break;
            }
            c1x = x19 + stack.shift();
            c1y = y22;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y22 = c2y + stack.shift();
            x19 = c2x + (stack.length === 1 ? stack.shift() : 0);
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          break;
        case 31:
          while (stack.length > 0) {
            c1x = x19 + stack.shift();
            c1y = y22;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y22 = c2y + stack.shift();
            x19 = c2x + (stack.length === 1 ? stack.shift() : 0);
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
            if (stack.length === 0) {
              break;
            }
            c1x = x19;
            c1y = y22 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x19 = c2x + stack.shift();
            y22 = c2y + (stack.length === 1 ? stack.shift() : 0);
            p28.curveTo(c1x, c1y, c2x, c2y, x19, y22);
          }
          break;
        default:
          if (v22 < 32) {
            console.log("Glyph " + glyph.index + ": unknown operator " + v22);
          } else if (v22 < 247) {
            stack.push(v22 - 139);
          } else if (v22 < 251) {
            b1 = code2[i36];
            i36 += 1;
            stack.push((v22 - 247) * 256 + b1 + 108);
          } else if (v22 < 255) {
            b1 = code2[i36];
            i36 += 1;
            stack.push(-(v22 - 251) * 256 - b1 - 108);
          } else {
            b1 = code2[i36];
            b22 = code2[i36 + 1];
            b32 = code2[i36 + 2];
            b42 = code2[i36 + 3];
            i36 += 4;
            stack.push((b1 << 24 | b22 << 16 | b32 << 8 | b42) / 65536);
          }
      }
    }
  }
  parse2(code);
  glyph.advanceWidth = width;
  return p28;
}
function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
  var fdSelect = [];
  var fdIndex;
  var parser = new parse.Parser(data, start);
  var format = parser.parseCard8();
  if (format === 0) {
    for (var iGid = 0; iGid < nGlyphs; iGid++) {
      fdIndex = parser.parseCard8();
      if (fdIndex >= fdArrayCount) {
        throw new Error("CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")");
      }
      fdSelect.push(fdIndex);
    }
  } else if (format === 3) {
    var nRanges = parser.parseCard16();
    var first = parser.parseCard16();
    if (first !== 0) {
      throw new Error("CFF Table CID Font FDSelect format 3 range has bad initial GID " + first);
    }
    var next;
    for (var iRange = 0; iRange < nRanges; iRange++) {
      fdIndex = parser.parseCard8();
      next = parser.parseCard16();
      if (fdIndex >= fdArrayCount) {
        throw new Error("CFF table CID Font FDSelect has bad FD index value " + fdIndex + " (FD count " + fdArrayCount + ")");
      }
      if (next > nGlyphs) {
        throw new Error("CFF Table CID Font FDSelect format 3 range has bad GID " + next);
      }
      for (; first < next; first++) {
        fdSelect.push(fdIndex);
      }
      first = next;
    }
    if (next !== nGlyphs) {
      throw new Error("CFF Table CID Font FDSelect format 3 range has bad final GID " + next);
    }
  } else {
    throw new Error("CFF Table CID Font FDSelect table has unsupported format " + format);
  }
  return fdSelect;
}
function parseCFFTable(data, start, font, opt) {
  font.tables.cff = {};
  var header = parseCFFHeader(data, start);
  var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
  var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
  var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
  var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
  font.gsubrs = globalSubrIndex.objects;
  font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);
  var topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);
  if (topDictArray.length !== 1) {
    throw new Error("CFF table has too many fonts in 'FontSet' - count of fonts NameIndex.length = " + topDictArray.length);
  }
  var topDict = topDictArray[0];
  font.tables.cff.topDict = topDict;
  if (topDict._privateDict) {
    font.defaultWidthX = topDict._privateDict.defaultWidthX;
    font.nominalWidthX = topDict._privateDict.nominalWidthX;
  }
  if (topDict.ros[0] !== void 0 && topDict.ros[1] !== void 0) {
    font.isCIDFont = true;
  }
  if (font.isCIDFont) {
    var fdArrayOffset = topDict.fdArray;
    var fdSelectOffset = topDict.fdSelect;
    if (fdArrayOffset === 0 || fdSelectOffset === 0) {
      throw new Error("Font is marked as a CID font, but FDArray and/or FDSelect information is missing");
    }
    fdArrayOffset += start;
    var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
    var fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
    topDict._fdArray = fdArray;
    fdSelectOffset += start;
    topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
  }
  var privateDictOffset = start + topDict.private[1];
  var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
  font.defaultWidthX = privateDict.defaultWidthX;
  font.nominalWidthX = privateDict.nominalWidthX;
  if (privateDict.subrs !== 0) {
    var subrOffset = privateDictOffset + privateDict.subrs;
    var subrIndex = parseCFFIndex(data, subrOffset);
    font.subrs = subrIndex.objects;
    font.subrsBias = calcCFFSubroutineBias(font.subrs);
  } else {
    font.subrs = [];
    font.subrsBias = 0;
  }
  var charStringsIndex;
  if (opt.lowMemory) {
    charStringsIndex = parseCFFIndexLowMemory(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.offsets.length;
  } else {
    charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;
  }
  var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
  if (topDict.encoding === 0) {
    font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
  } else if (topDict.encoding === 1) {
    font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
  } else {
    font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
  }
  font.encoding = font.encoding || font.cffEncoding;
  font.glyphs = new glyphset.GlyphSet(font);
  if (opt.lowMemory) {
    font._push = function(i37) {
      var charString2 = getCffIndexObject(i37, charStringsIndex.offsets, data, start + topDict.charStrings);
      font.glyphs.push(i37, glyphset.cffGlyphLoader(font, i37, parseCFFCharstring, charString2));
    };
  } else {
    for (var i36 = 0; i36 < font.nGlyphs; i36 += 1) {
      var charString = charStringsIndex.objects[i36];
      font.glyphs.push(i36, glyphset.cffGlyphLoader(font, i36, parseCFFCharstring, charString));
    }
  }
}
function encodeString(s33, strings) {
  var sid;
  var i36 = cffStandardStrings.indexOf(s33);
  if (i36 >= 0) {
    sid = i36;
  }
  i36 = strings.indexOf(s33);
  if (i36 >= 0) {
    sid = i36 + cffStandardStrings.length;
  } else {
    sid = cffStandardStrings.length + strings.length;
    strings.push(s33);
  }
  return sid;
}
function makeHeader() {
  return new table.Record("Header", [
    { name: "major", type: "Card8", value: 1 },
    { name: "minor", type: "Card8", value: 0 },
    { name: "hdrSize", type: "Card8", value: 4 },
    { name: "major", type: "Card8", value: 1 }
  ]);
}
function makeNameIndex(fontNames) {
  var t31 = new table.Record("Name INDEX", [
    { name: "names", type: "INDEX", value: [] }
  ]);
  t31.names = [];
  for (var i36 = 0; i36 < fontNames.length; i36 += 1) {
    t31.names.push({ name: "name_" + i36, type: "NAME", value: fontNames[i36] });
  }
  return t31;
}
function makeDict(meta2, attrs, strings) {
  var m24 = {};
  for (var i36 = 0; i36 < meta2.length; i36 += 1) {
    var entry = meta2[i36];
    var value = attrs[entry.name];
    if (value !== void 0 && !equals(value, entry.value)) {
      if (entry.type === "SID") {
        value = encodeString(value, strings);
      }
      m24[entry.op] = { name: entry.name, type: entry.type, value };
    }
  }
  return m24;
}
function makeTopDict(attrs, strings) {
  var t31 = new table.Record("Top DICT", [
    { name: "dict", type: "DICT", value: {} }
  ]);
  t31.dict = makeDict(TOP_DICT_META, attrs, strings);
  return t31;
}
function makeTopDictIndex(topDict) {
  var t31 = new table.Record("Top DICT INDEX", [
    { name: "topDicts", type: "INDEX", value: [] }
  ]);
  t31.topDicts = [{ name: "topDict_0", type: "TABLE", value: topDict }];
  return t31;
}
function makeStringIndex(strings) {
  var t31 = new table.Record("String INDEX", [
    { name: "strings", type: "INDEX", value: [] }
  ]);
  t31.strings = [];
  for (var i36 = 0; i36 < strings.length; i36 += 1) {
    t31.strings.push({ name: "string_" + i36, type: "STRING", value: strings[i36] });
  }
  return t31;
}
function makeGlobalSubrIndex() {
  return new table.Record("Global Subr INDEX", [
    { name: "subrs", type: "INDEX", value: [] }
  ]);
}
function makeCharsets(glyphNames, strings) {
  var t31 = new table.Record("Charsets", [
    { name: "format", type: "Card8", value: 0 }
  ]);
  for (var i36 = 0; i36 < glyphNames.length; i36 += 1) {
    var glyphName = glyphNames[i36];
    var glyphSID = encodeString(glyphName, strings);
    t31.fields.push({ name: "glyph_" + i36, type: "SID", value: glyphSID });
  }
  return t31;
}
function glyphToOps(glyph) {
  var ops = [];
  var path = glyph.path;
  ops.push({ name: "width", type: "NUMBER", value: glyph.advanceWidth });
  var x19 = 0;
  var y22 = 0;
  for (var i36 = 0; i36 < path.commands.length; i36 += 1) {
    var dx = void 0;
    var dy = void 0;
    var cmd = path.commands[i36];
    if (cmd.type === "Q") {
      var _132 = 1 / 3;
      var _23 = 2 / 3;
      cmd = {
        type: "C",
        x: cmd.x,
        y: cmd.y,
        x1: Math.round(_132 * x19 + _23 * cmd.x1),
        y1: Math.round(_132 * y22 + _23 * cmd.y1),
        x2: Math.round(_132 * cmd.x + _23 * cmd.x1),
        y2: Math.round(_132 * cmd.y + _23 * cmd.y1)
      };
    }
    if (cmd.type === "M") {
      dx = Math.round(cmd.x - x19);
      dy = Math.round(cmd.y - y22);
      ops.push({ name: "dx", type: "NUMBER", value: dx });
      ops.push({ name: "dy", type: "NUMBER", value: dy });
      ops.push({ name: "rmoveto", type: "OP", value: 21 });
      x19 = Math.round(cmd.x);
      y22 = Math.round(cmd.y);
    } else if (cmd.type === "L") {
      dx = Math.round(cmd.x - x19);
      dy = Math.round(cmd.y - y22);
      ops.push({ name: "dx", type: "NUMBER", value: dx });
      ops.push({ name: "dy", type: "NUMBER", value: dy });
      ops.push({ name: "rlineto", type: "OP", value: 5 });
      x19 = Math.round(cmd.x);
      y22 = Math.round(cmd.y);
    } else if (cmd.type === "C") {
      var dx1 = Math.round(cmd.x1 - x19);
      var dy1 = Math.round(cmd.y1 - y22);
      var dx2 = Math.round(cmd.x2 - cmd.x1);
      var dy2 = Math.round(cmd.y2 - cmd.y1);
      dx = Math.round(cmd.x - cmd.x2);
      dy = Math.round(cmd.y - cmd.y2);
      ops.push({ name: "dx1", type: "NUMBER", value: dx1 });
      ops.push({ name: "dy1", type: "NUMBER", value: dy1 });
      ops.push({ name: "dx2", type: "NUMBER", value: dx2 });
      ops.push({ name: "dy2", type: "NUMBER", value: dy2 });
      ops.push({ name: "dx", type: "NUMBER", value: dx });
      ops.push({ name: "dy", type: "NUMBER", value: dy });
      ops.push({ name: "rrcurveto", type: "OP", value: 8 });
      x19 = Math.round(cmd.x);
      y22 = Math.round(cmd.y);
    }
  }
  ops.push({ name: "endchar", type: "OP", value: 14 });
  return ops;
}
function makeCharStringsIndex(glyphs) {
  var t31 = new table.Record("CharStrings INDEX", [
    { name: "charStrings", type: "INDEX", value: [] }
  ]);
  for (var i36 = 0; i36 < glyphs.length; i36 += 1) {
    var glyph = glyphs.get(i36);
    var ops = glyphToOps(glyph);
    t31.charStrings.push({ name: glyph.name, type: "CHARSTRING", value: ops });
  }
  return t31;
}
function makePrivateDict(attrs, strings) {
  var t31 = new table.Record("Private DICT", [
    { name: "dict", type: "DICT", value: {} }
  ]);
  t31.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
  return t31;
}
function makeCFFTable(glyphs, options) {
  var t31 = new table.Table("CFF ", [
    { name: "header", type: "RECORD" },
    { name: "nameIndex", type: "RECORD" },
    { name: "topDictIndex", type: "RECORD" },
    { name: "stringIndex", type: "RECORD" },
    { name: "globalSubrIndex", type: "RECORD" },
    { name: "charsets", type: "RECORD" },
    { name: "charStringsIndex", type: "RECORD" },
    { name: "privateDict", type: "RECORD" }
  ]);
  var fontScale = 1 / options.unitsPerEm;
  var attrs = {
    version: options.version,
    fullName: options.fullName,
    familyName: options.familyName,
    weight: options.weightName,
    fontBBox: options.fontBBox || [0, 0, 0, 0],
    fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
    charset: 999,
    encoding: 0,
    charStrings: 999,
    private: [0, 999]
  };
  var privateAttrs = {};
  var glyphNames = [];
  var glyph;
  for (var i36 = 1; i36 < glyphs.length; i36 += 1) {
    glyph = glyphs.get(i36);
    glyphNames.push(glyph.name);
  }
  var strings = [];
  t31.header = makeHeader();
  t31.nameIndex = makeNameIndex([options.postScriptName]);
  var topDict = makeTopDict(attrs, strings);
  t31.topDictIndex = makeTopDictIndex(topDict);
  t31.globalSubrIndex = makeGlobalSubrIndex();
  t31.charsets = makeCharsets(glyphNames, strings);
  t31.charStringsIndex = makeCharStringsIndex(glyphs);
  t31.privateDict = makePrivateDict(privateAttrs, strings);
  t31.stringIndex = makeStringIndex(strings);
  var startOffset = t31.header.sizeOf() + t31.nameIndex.sizeOf() + t31.topDictIndex.sizeOf() + t31.stringIndex.sizeOf() + t31.globalSubrIndex.sizeOf();
  attrs.charset = startOffset;
  attrs.encoding = 0;
  attrs.charStrings = attrs.charset + t31.charsets.sizeOf();
  attrs.private[1] = attrs.charStrings + t31.charStringsIndex.sizeOf();
  topDict = makeTopDict(attrs, strings);
  t31.topDictIndex = makeTopDictIndex(topDict);
  return t31;
}
var cff = { parse: parseCFFTable, make: makeCFFTable };
function parseHeadTable(data, start) {
  var head2 = {};
  var p28 = new parse.Parser(data, start);
  head2.version = p28.parseVersion();
  head2.fontRevision = Math.round(p28.parseFixed() * 1e3) / 1e3;
  head2.checkSumAdjustment = p28.parseULong();
  head2.magicNumber = p28.parseULong();
  check.argument(head2.magicNumber === 1594834165, "Font header has wrong magic number.");
  head2.flags = p28.parseUShort();
  head2.unitsPerEm = p28.parseUShort();
  head2.created = p28.parseLongDateTime();
  head2.modified = p28.parseLongDateTime();
  head2.xMin = p28.parseShort();
  head2.yMin = p28.parseShort();
  head2.xMax = p28.parseShort();
  head2.yMax = p28.parseShort();
  head2.macStyle = p28.parseUShort();
  head2.lowestRecPPEM = p28.parseUShort();
  head2.fontDirectionHint = p28.parseShort();
  head2.indexToLocFormat = p28.parseShort();
  head2.glyphDataFormat = p28.parseShort();
  return head2;
}
function makeHeadTable(options) {
  var timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3) + 2082844800;
  var createdTimestamp = timestamp;
  if (options.createdTimestamp) {
    createdTimestamp = options.createdTimestamp + 2082844800;
  }
  return new table.Table("head", [
    { name: "version", type: "FIXED", value: 65536 },
    { name: "fontRevision", type: "FIXED", value: 65536 },
    { name: "checkSumAdjustment", type: "ULONG", value: 0 },
    { name: "magicNumber", type: "ULONG", value: 1594834165 },
    { name: "flags", type: "USHORT", value: 0 },
    { name: "unitsPerEm", type: "USHORT", value: 1e3 },
    { name: "created", type: "LONGDATETIME", value: createdTimestamp },
    { name: "modified", type: "LONGDATETIME", value: timestamp },
    { name: "xMin", type: "SHORT", value: 0 },
    { name: "yMin", type: "SHORT", value: 0 },
    { name: "xMax", type: "SHORT", value: 0 },
    { name: "yMax", type: "SHORT", value: 0 },
    { name: "macStyle", type: "USHORT", value: 0 },
    { name: "lowestRecPPEM", type: "USHORT", value: 0 },
    { name: "fontDirectionHint", type: "SHORT", value: 2 },
    { name: "indexToLocFormat", type: "SHORT", value: 0 },
    { name: "glyphDataFormat", type: "SHORT", value: 0 }
  ], options);
}
var head = { parse: parseHeadTable, make: makeHeadTable };
function parseHheaTable(data, start) {
  var hhea2 = {};
  var p28 = new parse.Parser(data, start);
  hhea2.version = p28.parseVersion();
  hhea2.ascender = p28.parseShort();
  hhea2.descender = p28.parseShort();
  hhea2.lineGap = p28.parseShort();
  hhea2.advanceWidthMax = p28.parseUShort();
  hhea2.minLeftSideBearing = p28.parseShort();
  hhea2.minRightSideBearing = p28.parseShort();
  hhea2.xMaxExtent = p28.parseShort();
  hhea2.caretSlopeRise = p28.parseShort();
  hhea2.caretSlopeRun = p28.parseShort();
  hhea2.caretOffset = p28.parseShort();
  p28.relativeOffset += 8;
  hhea2.metricDataFormat = p28.parseShort();
  hhea2.numberOfHMetrics = p28.parseUShort();
  return hhea2;
}
function makeHheaTable(options) {
  return new table.Table("hhea", [
    { name: "version", type: "FIXED", value: 65536 },
    { name: "ascender", type: "FWORD", value: 0 },
    { name: "descender", type: "FWORD", value: 0 },
    { name: "lineGap", type: "FWORD", value: 0 },
    { name: "advanceWidthMax", type: "UFWORD", value: 0 },
    { name: "minLeftSideBearing", type: "FWORD", value: 0 },
    { name: "minRightSideBearing", type: "FWORD", value: 0 },
    { name: "xMaxExtent", type: "FWORD", value: 0 },
    { name: "caretSlopeRise", type: "SHORT", value: 1 },
    { name: "caretSlopeRun", type: "SHORT", value: 0 },
    { name: "caretOffset", type: "SHORT", value: 0 },
    { name: "reserved1", type: "SHORT", value: 0 },
    { name: "reserved2", type: "SHORT", value: 0 },
    { name: "reserved3", type: "SHORT", value: 0 },
    { name: "reserved4", type: "SHORT", value: 0 },
    { name: "metricDataFormat", type: "SHORT", value: 0 },
    { name: "numberOfHMetrics", type: "USHORT", value: 0 }
  ], options);
}
var hhea = { parse: parseHheaTable, make: makeHheaTable };
function parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs) {
  var advanceWidth;
  var leftSideBearing;
  var p28 = new parse.Parser(data, start);
  for (var i36 = 0; i36 < numGlyphs; i36 += 1) {
    if (i36 < numMetrics) {
      advanceWidth = p28.parseUShort();
      leftSideBearing = p28.parseShort();
    }
    var glyph = glyphs.get(i36);
    glyph.advanceWidth = advanceWidth;
    glyph.leftSideBearing = leftSideBearing;
  }
}
function parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs) {
  font._hmtxTableData = {};
  var advanceWidth;
  var leftSideBearing;
  var p28 = new parse.Parser(data, start);
  for (var i36 = 0; i36 < numGlyphs; i36 += 1) {
    if (i36 < numMetrics) {
      advanceWidth = p28.parseUShort();
      leftSideBearing = p28.parseShort();
    }
    font._hmtxTableData[i36] = {
      advanceWidth,
      leftSideBearing
    };
  }
}
function parseHmtxTable(font, data, start, numMetrics, numGlyphs, glyphs, opt) {
  if (opt.lowMemory) {
    parseHmtxTableOnLowMemory(font, data, start, numMetrics, numGlyphs);
  } else {
    parseHmtxTableAll(data, start, numMetrics, numGlyphs, glyphs);
  }
}
function makeHmtxTable(glyphs) {
  var t31 = new table.Table("hmtx", []);
  for (var i36 = 0; i36 < glyphs.length; i36 += 1) {
    var glyph = glyphs.get(i36);
    var advanceWidth = glyph.advanceWidth || 0;
    var leftSideBearing = glyph.leftSideBearing || 0;
    t31.fields.push({ name: "advanceWidth_" + i36, type: "USHORT", value: advanceWidth });
    t31.fields.push({ name: "leftSideBearing_" + i36, type: "SHORT", value: leftSideBearing });
  }
  return t31;
}
var hmtx = { parse: parseHmtxTable, make: makeHmtxTable };
function makeLtagTable(tags) {
  var result = new table.Table("ltag", [
    { name: "version", type: "ULONG", value: 1 },
    { name: "flags", type: "ULONG", value: 0 },
    { name: "numTags", type: "ULONG", value: tags.length }
  ]);
  var stringPool = "";
  var stringPoolOffset = 12 + tags.length * 4;
  for (var i36 = 0; i36 < tags.length; ++i36) {
    var pos = stringPool.indexOf(tags[i36]);
    if (pos < 0) {
      pos = stringPool.length;
      stringPool += tags[i36];
    }
    result.fields.push({ name: "offset " + i36, type: "USHORT", value: stringPoolOffset + pos });
    result.fields.push({ name: "length " + i36, type: "USHORT", value: tags[i36].length });
  }
  result.fields.push({ name: "stringPool", type: "CHARARRAY", value: stringPool });
  return result;
}
function parseLtagTable(data, start) {
  var p28 = new parse.Parser(data, start);
  var tableVersion = p28.parseULong();
  check.argument(tableVersion === 1, "Unsupported ltag table version.");
  p28.skip("uLong", 1);
  var numTags = p28.parseULong();
  var tags = [];
  for (var i36 = 0; i36 < numTags; i36++) {
    var tag = "";
    var offset = start + p28.parseUShort();
    var length = p28.parseUShort();
    for (var j9 = offset; j9 < offset + length; ++j9) {
      tag += String.fromCharCode(data.getInt8(j9));
    }
    tags.push(tag);
  }
  return tags;
}
var ltag = { make: makeLtagTable, parse: parseLtagTable };
function parseMaxpTable(data, start) {
  var maxp2 = {};
  var p28 = new parse.Parser(data, start);
  maxp2.version = p28.parseVersion();
  maxp2.numGlyphs = p28.parseUShort();
  if (maxp2.version === 1) {
    maxp2.maxPoints = p28.parseUShort();
    maxp2.maxContours = p28.parseUShort();
    maxp2.maxCompositePoints = p28.parseUShort();
    maxp2.maxCompositeContours = p28.parseUShort();
    maxp2.maxZones = p28.parseUShort();
    maxp2.maxTwilightPoints = p28.parseUShort();
    maxp2.maxStorage = p28.parseUShort();
    maxp2.maxFunctionDefs = p28.parseUShort();
    maxp2.maxInstructionDefs = p28.parseUShort();
    maxp2.maxStackElements = p28.parseUShort();
    maxp2.maxSizeOfInstructions = p28.parseUShort();
    maxp2.maxComponentElements = p28.parseUShort();
    maxp2.maxComponentDepth = p28.parseUShort();
  }
  return maxp2;
}
function makeMaxpTable(numGlyphs) {
  return new table.Table("maxp", [
    { name: "version", type: "FIXED", value: 20480 },
    { name: "numGlyphs", type: "USHORT", value: numGlyphs }
  ]);
}
var maxp = { parse: parseMaxpTable, make: makeMaxpTable };
var nameTableNames = [
  "copyright",
  // 0
  "fontFamily",
  // 1
  "fontSubfamily",
  // 2
  "uniqueID",
  // 3
  "fullName",
  // 4
  "version",
  // 5
  "postScriptName",
  // 6
  "trademark",
  // 7
  "manufacturer",
  // 8
  "designer",
  // 9
  "description",
  // 10
  "manufacturerURL",
  // 11
  "designerURL",
  // 12
  "license",
  // 13
  "licenseURL",
  // 14
  "reserved",
  // 15
  "preferredFamily",
  // 16
  "preferredSubfamily",
  // 17
  "compatibleFullName",
  // 18
  "sampleText",
  // 19
  "postScriptFindFontName",
  // 20
  "wwsFamily",
  // 21
  "wwsSubfamily"
  // 22
];
var macLanguages = {
  0: "en",
  1: "fr",
  2: "de",
  3: "it",
  4: "nl",
  5: "sv",
  6: "es",
  7: "da",
  8: "pt",
  9: "no",
  10: "he",
  11: "ja",
  12: "ar",
  13: "fi",
  14: "el",
  15: "is",
  16: "mt",
  17: "tr",
  18: "hr",
  19: "zh-Hant",
  20: "ur",
  21: "hi",
  22: "th",
  23: "ko",
  24: "lt",
  25: "pl",
  26: "hu",
  27: "es",
  28: "lv",
  29: "se",
  30: "fo",
  31: "fa",
  32: "ru",
  33: "zh",
  34: "nl-BE",
  35: "ga",
  36: "sq",
  37: "ro",
  38: "cz",
  39: "sk",
  40: "si",
  41: "yi",
  42: "sr",
  43: "mk",
  44: "bg",
  45: "uk",
  46: "be",
  47: "uz",
  48: "kk",
  49: "az-Cyrl",
  50: "az-Arab",
  51: "hy",
  52: "ka",
  53: "mo",
  54: "ky",
  55: "tg",
  56: "tk",
  57: "mn-CN",
  58: "mn",
  59: "ps",
  60: "ks",
  61: "ku",
  62: "sd",
  63: "bo",
  64: "ne",
  65: "sa",
  66: "mr",
  67: "bn",
  68: "as",
  69: "gu",
  70: "pa",
  71: "or",
  72: "ml",
  73: "kn",
  74: "ta",
  75: "te",
  76: "si",
  77: "my",
  78: "km",
  79: "lo",
  80: "vi",
  81: "id",
  82: "tl",
  83: "ms",
  84: "ms-Arab",
  85: "am",
  86: "ti",
  87: "om",
  88: "so",
  89: "sw",
  90: "rw",
  91: "rn",
  92: "ny",
  93: "mg",
  94: "eo",
  128: "cy",
  129: "eu",
  130: "ca",
  131: "la",
  132: "qu",
  133: "gn",
  134: "ay",
  135: "tt",
  136: "ug",
  137: "dz",
  138: "jv",
  139: "su",
  140: "gl",
  141: "af",
  142: "br",
  143: "iu",
  144: "gd",
  145: "gv",
  146: "ga",
  147: "to",
  148: "el-polyton",
  149: "kl",
  150: "az",
  151: "nn"
};
var macLanguageToScript = {
  0: 0,
  // langEnglish → smRoman
  1: 0,
  // langFrench → smRoman
  2: 0,
  // langGerman → smRoman
  3: 0,
  // langItalian → smRoman
  4: 0,
  // langDutch → smRoman
  5: 0,
  // langSwedish → smRoman
  6: 0,
  // langSpanish → smRoman
  7: 0,
  // langDanish → smRoman
  8: 0,
  // langPortuguese → smRoman
  9: 0,
  // langNorwegian → smRoman
  10: 5,
  // langHebrew → smHebrew
  11: 1,
  // langJapanese → smJapanese
  12: 4,
  // langArabic → smArabic
  13: 0,
  // langFinnish → smRoman
  14: 6,
  // langGreek → smGreek
  15: 0,
  // langIcelandic → smRoman (modified)
  16: 0,
  // langMaltese → smRoman
  17: 0,
  // langTurkish → smRoman (modified)
  18: 0,
  // langCroatian → smRoman (modified)
  19: 2,
  // langTradChinese → smTradChinese
  20: 4,
  // langUrdu → smArabic
  21: 9,
  // langHindi → smDevanagari
  22: 21,
  // langThai → smThai
  23: 3,
  // langKorean → smKorean
  24: 29,
  // langLithuanian → smCentralEuroRoman
  25: 29,
  // langPolish → smCentralEuroRoman
  26: 29,
  // langHungarian → smCentralEuroRoman
  27: 29,
  // langEstonian → smCentralEuroRoman
  28: 29,
  // langLatvian → smCentralEuroRoman
  29: 0,
  // langSami → smRoman
  30: 0,
  // langFaroese → smRoman (modified)
  31: 4,
  // langFarsi → smArabic (modified)
  32: 7,
  // langRussian → smCyrillic
  33: 25,
  // langSimpChinese → smSimpChinese
  34: 0,
  // langFlemish → smRoman
  35: 0,
  // langIrishGaelic → smRoman (modified)
  36: 0,
  // langAlbanian → smRoman
  37: 0,
  // langRomanian → smRoman (modified)
  38: 29,
  // langCzech → smCentralEuroRoman
  39: 29,
  // langSlovak → smCentralEuroRoman
  40: 0,
  // langSlovenian → smRoman (modified)
  41: 5,
  // langYiddish → smHebrew
  42: 7,
  // langSerbian → smCyrillic
  43: 7,
  // langMacedonian → smCyrillic
  44: 7,
  // langBulgarian → smCyrillic
  45: 7,
  // langUkrainian → smCyrillic (modified)
  46: 7,
  // langByelorussian → smCyrillic
  47: 7,
  // langUzbek → smCyrillic
  48: 7,
  // langKazakh → smCyrillic
  49: 7,
  // langAzerbaijani → smCyrillic
  50: 4,
  // langAzerbaijanAr → smArabic
  51: 24,
  // langArmenian → smArmenian
  52: 23,
  // langGeorgian → smGeorgian
  53: 7,
  // langMoldavian → smCyrillic
  54: 7,
  // langKirghiz → smCyrillic
  55: 7,
  // langTajiki → smCyrillic
  56: 7,
  // langTurkmen → smCyrillic
  57: 27,
  // langMongolian → smMongolian
  58: 7,
  // langMongolianCyr → smCyrillic
  59: 4,
  // langPashto → smArabic
  60: 4,
  // langKurdish → smArabic
  61: 4,
  // langKashmiri → smArabic
  62: 4,
  // langSindhi → smArabic
  63: 26,
  // langTibetan → smTibetan
  64: 9,
  // langNepali → smDevanagari
  65: 9,
  // langSanskrit → smDevanagari
  66: 9,
  // langMarathi → smDevanagari
  67: 13,
  // langBengali → smBengali
  68: 13,
  // langAssamese → smBengali
  69: 11,
  // langGujarati → smGujarati
  70: 10,
  // langPunjabi → smGurmukhi
  71: 12,
  // langOriya → smOriya
  72: 17,
  // langMalayalam → smMalayalam
  73: 16,
  // langKannada → smKannada
  74: 14,
  // langTamil → smTamil
  75: 15,
  // langTelugu → smTelugu
  76: 18,
  // langSinhalese → smSinhalese
  77: 19,
  // langBurmese → smBurmese
  78: 20,
  // langKhmer → smKhmer
  79: 22,
  // langLao → smLao
  80: 30,
  // langVietnamese → smVietnamese
  81: 0,
  // langIndonesian → smRoman
  82: 0,
  // langTagalog → smRoman
  83: 0,
  // langMalayRoman → smRoman
  84: 4,
  // langMalayArabic → smArabic
  85: 28,
  // langAmharic → smEthiopic
  86: 28,
  // langTigrinya → smEthiopic
  87: 28,
  // langOromo → smEthiopic
  88: 0,
  // langSomali → smRoman
  89: 0,
  // langSwahili → smRoman
  90: 0,
  // langKinyarwanda → smRoman
  91: 0,
  // langRundi → smRoman
  92: 0,
  // langNyanja → smRoman
  93: 0,
  // langMalagasy → smRoman
  94: 0,
  // langEsperanto → smRoman
  128: 0,
  // langWelsh → smRoman (modified)
  129: 0,
  // langBasque → smRoman
  130: 0,
  // langCatalan → smRoman
  131: 0,
  // langLatin → smRoman
  132: 0,
  // langQuechua → smRoman
  133: 0,
  // langGuarani → smRoman
  134: 0,
  // langAymara → smRoman
  135: 7,
  // langTatar → smCyrillic
  136: 4,
  // langUighur → smArabic
  137: 26,
  // langDzongkha → smTibetan
  138: 0,
  // langJavaneseRom → smRoman
  139: 0,
  // langSundaneseRom → smRoman
  140: 0,
  // langGalician → smRoman
  141: 0,
  // langAfrikaans → smRoman
  142: 0,
  // langBreton → smRoman (modified)
  143: 28,
  // langInuktitut → smEthiopic (modified)
  144: 0,
  // langScottishGaelic → smRoman (modified)
  145: 0,
  // langManxGaelic → smRoman (modified)
  146: 0,
  // langIrishGaelicScript → smRoman (modified)
  147: 0,
  // langTongan → smRoman
  148: 6,
  // langGreekAncient → smRoman
  149: 0,
  // langGreenlandic → smRoman
  150: 0,
  // langAzerbaijanRoman → smRoman
  151: 0
  // langNynorsk → smRoman
};
var windowsLanguages = {
  1078: "af",
  1052: "sq",
  1156: "gsw",
  1118: "am",
  5121: "ar-DZ",
  15361: "ar-BH",
  3073: "ar",
  2049: "ar-IQ",
  11265: "ar-JO",
  13313: "ar-KW",
  12289: "ar-LB",
  4097: "ar-LY",
  6145: "ary",
  8193: "ar-OM",
  16385: "ar-QA",
  1025: "ar-SA",
  10241: "ar-SY",
  7169: "aeb",
  14337: "ar-AE",
  9217: "ar-YE",
  1067: "hy",
  1101: "as",
  2092: "az-Cyrl",
  1068: "az",
  1133: "ba",
  1069: "eu",
  1059: "be",
  2117: "bn",
  1093: "bn-IN",
  8218: "bs-Cyrl",
  5146: "bs",
  1150: "br",
  1026: "bg",
  1027: "ca",
  3076: "zh-HK",
  5124: "zh-MO",
  2052: "zh",
  4100: "zh-SG",
  1028: "zh-TW",
  1155: "co",
  1050: "hr",
  4122: "hr-BA",
  1029: "cs",
  1030: "da",
  1164: "prs",
  1125: "dv",
  2067: "nl-BE",
  1043: "nl",
  3081: "en-AU",
  10249: "en-BZ",
  4105: "en-CA",
  9225: "en-029",
  16393: "en-IN",
  6153: "en-IE",
  8201: "en-JM",
  17417: "en-MY",
  5129: "en-NZ",
  13321: "en-PH",
  18441: "en-SG",
  7177: "en-ZA",
  11273: "en-TT",
  2057: "en-GB",
  1033: "en",
  12297: "en-ZW",
  1061: "et",
  1080: "fo",
  1124: "fil",
  1035: "fi",
  2060: "fr-BE",
  3084: "fr-CA",
  1036: "fr",
  5132: "fr-LU",
  6156: "fr-MC",
  4108: "fr-CH",
  1122: "fy",
  1110: "gl",
  1079: "ka",
  3079: "de-AT",
  1031: "de",
  5127: "de-LI",
  4103: "de-LU",
  2055: "de-CH",
  1032: "el",
  1135: "kl",
  1095: "gu",
  1128: "ha",
  1037: "he",
  1081: "hi",
  1038: "hu",
  1039: "is",
  1136: "ig",
  1057: "id",
  1117: "iu",
  2141: "iu-Latn",
  2108: "ga",
  1076: "xh",
  1077: "zu",
  1040: "it",
  2064: "it-CH",
  1041: "ja",
  1099: "kn",
  1087: "kk",
  1107: "km",
  1158: "quc",
  1159: "rw",
  1089: "sw",
  1111: "kok",
  1042: "ko",
  1088: "ky",
  1108: "lo",
  1062: "lv",
  1063: "lt",
  2094: "dsb",
  1134: "lb",
  1071: "mk",
  2110: "ms-BN",
  1086: "ms",
  1100: "ml",
  1082: "mt",
  1153: "mi",
  1146: "arn",
  1102: "mr",
  1148: "moh",
  1104: "mn",
  2128: "mn-CN",
  1121: "ne",
  1044: "nb",
  2068: "nn",
  1154: "oc",
  1096: "or",
  1123: "ps",
  1045: "pl",
  1046: "pt",
  2070: "pt-PT",
  1094: "pa",
  1131: "qu-BO",
  2155: "qu-EC",
  3179: "qu",
  1048: "ro",
  1047: "rm",
  1049: "ru",
  9275: "smn",
  4155: "smj-NO",
  5179: "smj",
  3131: "se-FI",
  1083: "se",
  2107: "se-SE",
  8251: "sms",
  6203: "sma-NO",
  7227: "sms",
  1103: "sa",
  7194: "sr-Cyrl-BA",
  3098: "sr",
  6170: "sr-Latn-BA",
  2074: "sr-Latn",
  1132: "nso",
  1074: "tn",
  1115: "si",
  1051: "sk",
  1060: "sl",
  11274: "es-AR",
  16394: "es-BO",
  13322: "es-CL",
  9226: "es-CO",
  5130: "es-CR",
  7178: "es-DO",
  12298: "es-EC",
  17418: "es-SV",
  4106: "es-GT",
  18442: "es-HN",
  2058: "es-MX",
  19466: "es-NI",
  6154: "es-PA",
  15370: "es-PY",
  10250: "es-PE",
  20490: "es-PR",
  // Microsoft has defined two different language codes for
  // “Spanish with modern sorting” and “Spanish with traditional
  // sorting”. This makes sense for collation APIs, and it would be
  // possible to express this in BCP 47 language tags via Unicode
  // extensions (eg., es-u-co-trad is Spanish with traditional
  // sorting). However, for storing names in fonts, the distinction
  // does not make sense, so we give “es” in both cases.
  3082: "es",
  1034: "es",
  21514: "es-US",
  14346: "es-UY",
  8202: "es-VE",
  2077: "sv-FI",
  1053: "sv",
  1114: "syr",
  1064: "tg",
  2143: "tzm",
  1097: "ta",
  1092: "tt",
  1098: "te",
  1054: "th",
  1105: "bo",
  1055: "tr",
  1090: "tk",
  1152: "ug",
  1058: "uk",
  1070: "hsb",
  1056: "ur",
  2115: "uz-Cyrl",
  1091: "uz",
  1066: "vi",
  1106: "cy",
  1160: "wo",
  1157: "sah",
  1144: "ii",
  1130: "yo"
};
function getLanguageCode(platformID, languageID, ltag2) {
  switch (platformID) {
    case 0:
      if (languageID === 65535) {
        return "und";
      } else if (ltag2) {
        return ltag2[languageID];
      }
      break;
    case 1:
      return macLanguages[languageID];
    case 3:
      return windowsLanguages[languageID];
  }
  return void 0;
}
var utf16 = "utf-16";
var macScriptEncodings = {
  0: "macintosh",
  // smRoman
  1: "x-mac-japanese",
  // smJapanese
  2: "x-mac-chinesetrad",
  // smTradChinese
  3: "x-mac-korean",
  // smKorean
  6: "x-mac-greek",
  // smGreek
  7: "x-mac-cyrillic",
  // smCyrillic
  9: "x-mac-devanagai",
  // smDevanagari
  10: "x-mac-gurmukhi",
  // smGurmukhi
  11: "x-mac-gujarati",
  // smGujarati
  12: "x-mac-oriya",
  // smOriya
  13: "x-mac-bengali",
  // smBengali
  14: "x-mac-tamil",
  // smTamil
  15: "x-mac-telugu",
  // smTelugu
  16: "x-mac-kannada",
  // smKannada
  17: "x-mac-malayalam",
  // smMalayalam
  18: "x-mac-sinhalese",
  // smSinhalese
  19: "x-mac-burmese",
  // smBurmese
  20: "x-mac-khmer",
  // smKhmer
  21: "x-mac-thai",
  // smThai
  22: "x-mac-lao",
  // smLao
  23: "x-mac-georgian",
  // smGeorgian
  24: "x-mac-armenian",
  // smArmenian
  25: "x-mac-chinesesimp",
  // smSimpChinese
  26: "x-mac-tibetan",
  // smTibetan
  27: "x-mac-mongolian",
  // smMongolian
  28: "x-mac-ethiopic",
  // smEthiopic
  29: "x-mac-ce",
  // smCentralEuroRoman
  30: "x-mac-vietnamese",
  // smVietnamese
  31: "x-mac-extarabic"
  // smExtArabic
};
var macLanguageEncodings = {
  15: "x-mac-icelandic",
  // langIcelandic
  17: "x-mac-turkish",
  // langTurkish
  18: "x-mac-croatian",
  // langCroatian
  24: "x-mac-ce",
  // langLithuanian
  25: "x-mac-ce",
  // langPolish
  26: "x-mac-ce",
  // langHungarian
  27: "x-mac-ce",
  // langEstonian
  28: "x-mac-ce",
  // langLatvian
  30: "x-mac-icelandic",
  // langFaroese
  37: "x-mac-romanian",
  // langRomanian
  38: "x-mac-ce",
  // langCzech
  39: "x-mac-ce",
  // langSlovak
  40: "x-mac-ce",
  // langSlovenian
  143: "x-mac-inuit",
  // langInuktitut
  146: "x-mac-gaelic"
  // langIrishGaelicScript
};
function getEncoding(platformID, encodingID, languageID) {
  switch (platformID) {
    case 0:
      return utf16;
    case 1:
      return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];
    case 3:
      if (encodingID === 1 || encodingID === 10) {
        return utf16;
      }
      break;
  }
  return void 0;
}
function parseNameTable(data, start, ltag2) {
  var name = {};
  var p28 = new parse.Parser(data, start);
  var format = p28.parseUShort();
  var count = p28.parseUShort();
  var stringOffset = p28.offset + p28.parseUShort();
  for (var i36 = 0; i36 < count; i36++) {
    var platformID = p28.parseUShort();
    var encodingID = p28.parseUShort();
    var languageID = p28.parseUShort();
    var nameID = p28.parseUShort();
    var property = nameTableNames[nameID] || nameID;
    var byteLength = p28.parseUShort();
    var offset = p28.parseUShort();
    var language = getLanguageCode(platformID, languageID, ltag2);
    var encoding = getEncoding(platformID, encodingID, languageID);
    if (encoding !== void 0 && language !== void 0) {
      var text = void 0;
      if (encoding === utf16) {
        text = decode.UTF16(data, stringOffset + offset, byteLength);
      } else {
        text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
      }
      if (text) {
        var translations = name[property];
        if (translations === void 0) {
          translations = name[property] = {};
        }
        translations[language] = text;
      }
    }
  }
  var langTagCount = 0;
  if (format === 1) {
    langTagCount = p28.parseUShort();
  }
  return name;
}
function reverseDict(dict) {
  var result = {};
  for (var key in dict) {
    result[dict[key]] = parseInt(key);
  }
  return result;
}
function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
  return new table.Record("NameRecord", [
    { name: "platformID", type: "USHORT", value: platformID },
    { name: "encodingID", type: "USHORT", value: encodingID },
    { name: "languageID", type: "USHORT", value: languageID },
    { name: "nameID", type: "USHORT", value: nameID },
    { name: "length", type: "USHORT", value: length },
    { name: "offset", type: "USHORT", value: offset }
  ]);
}
function findSubArray(needle, haystack) {
  var needleLength = needle.length;
  var limit = haystack.length - needleLength + 1;
  loop:
    for (var pos = 0; pos < limit; pos++) {
      for (; pos < limit; pos++) {
        for (var k11 = 0; k11 < needleLength; k11++) {
          if (haystack[pos + k11] !== needle[k11]) {
            continue loop;
          }
        }
        return pos;
      }
    }
  return -1;
}
function addStringToPool(s33, pool) {
  var offset = findSubArray(s33, pool);
  if (offset < 0) {
    offset = pool.length;
    var i36 = 0;
    var len = s33.length;
    for (; i36 < len; ++i36) {
      pool.push(s33[i36]);
    }
  }
  return offset;
}
function makeNameTable(names, ltag2) {
  var nameID;
  var nameIDs = [];
  var namesWithNumericKeys = {};
  var nameTableIds = reverseDict(nameTableNames);
  for (var key in names) {
    var id = nameTableIds[key];
    if (id === void 0) {
      id = key;
    }
    nameID = parseInt(id);
    if (isNaN(nameID)) {
      throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
    }
    namesWithNumericKeys[nameID] = names[key];
    nameIDs.push(nameID);
  }
  var macLanguageIds = reverseDict(macLanguages);
  var windowsLanguageIds = reverseDict(windowsLanguages);
  var nameRecords = [];
  var stringPool = [];
  for (var i36 = 0; i36 < nameIDs.length; i36++) {
    nameID = nameIDs[i36];
    var translations = namesWithNumericKeys[nameID];
    for (var lang in translations) {
      var text = translations[lang];
      var macPlatform = 1;
      var macLanguage = macLanguageIds[lang];
      var macScript = macLanguageToScript[macLanguage];
      var macEncoding = getEncoding(macPlatform, macScript, macLanguage);
      var macName = encode.MACSTRING(text, macEncoding);
      if (macName === void 0) {
        macPlatform = 0;
        macLanguage = ltag2.indexOf(lang);
        if (macLanguage < 0) {
          macLanguage = ltag2.length;
          ltag2.push(lang);
        }
        macScript = 4;
        macName = encode.UTF16(text);
      }
      var macNameOffset = addStringToPool(macName, stringPool);
      nameRecords.push(makeNameRecord(
        macPlatform,
        macScript,
        macLanguage,
        nameID,
        macName.length,
        macNameOffset
      ));
      var winLanguage = windowsLanguageIds[lang];
      if (winLanguage !== void 0) {
        var winName = encode.UTF16(text);
        var winNameOffset = addStringToPool(winName, stringPool);
        nameRecords.push(makeNameRecord(
          3,
          1,
          winLanguage,
          nameID,
          winName.length,
          winNameOffset
        ));
      }
    }
  }
  nameRecords.sort(function(a34, b20) {
    return a34.platformID - b20.platformID || a34.encodingID - b20.encodingID || a34.languageID - b20.languageID || a34.nameID - b20.nameID;
  });
  var t31 = new table.Table("name", [
    { name: "format", type: "USHORT", value: 0 },
    { name: "count", type: "USHORT", value: nameRecords.length },
    { name: "stringOffset", type: "USHORT", value: 6 + nameRecords.length * 12 }
  ]);
  for (var r34 = 0; r34 < nameRecords.length; r34++) {
    t31.fields.push({ name: "record_" + r34, type: "RECORD", value: nameRecords[r34] });
  }
  t31.fields.push({ name: "strings", type: "LITERAL", value: stringPool });
  return t31;
}
var _name = { parse: parseNameTable, make: makeNameTable };
var unicodeRanges = [
  { begin: 0, end: 127 },
  // Basic Latin
  { begin: 128, end: 255 },
  // Latin-1 Supplement
  { begin: 256, end: 383 },
  // Latin Extended-A
  { begin: 384, end: 591 },
  // Latin Extended-B
  { begin: 592, end: 687 },
  // IPA Extensions
  { begin: 688, end: 767 },
  // Spacing Modifier Letters
  { begin: 768, end: 879 },
  // Combining Diacritical Marks
  { begin: 880, end: 1023 },
  // Greek and Coptic
  { begin: 11392, end: 11519 },
  // Coptic
  { begin: 1024, end: 1279 },
  // Cyrillic
  { begin: 1328, end: 1423 },
  // Armenian
  { begin: 1424, end: 1535 },
  // Hebrew
  { begin: 42240, end: 42559 },
  // Vai
  { begin: 1536, end: 1791 },
  // Arabic
  { begin: 1984, end: 2047 },
  // NKo
  { begin: 2304, end: 2431 },
  // Devanagari
  { begin: 2432, end: 2559 },
  // Bengali
  { begin: 2560, end: 2687 },
  // Gurmukhi
  { begin: 2688, end: 2815 },
  // Gujarati
  { begin: 2816, end: 2943 },
  // Oriya
  { begin: 2944, end: 3071 },
  // Tamil
  { begin: 3072, end: 3199 },
  // Telugu
  { begin: 3200, end: 3327 },
  // Kannada
  { begin: 3328, end: 3455 },
  // Malayalam
  { begin: 3584, end: 3711 },
  // Thai
  { begin: 3712, end: 3839 },
  // Lao
  { begin: 4256, end: 4351 },
  // Georgian
  { begin: 6912, end: 7039 },
  // Balinese
  { begin: 4352, end: 4607 },
  // Hangul Jamo
  { begin: 7680, end: 7935 },
  // Latin Extended Additional
  { begin: 7936, end: 8191 },
  // Greek Extended
  { begin: 8192, end: 8303 },
  // General Punctuation
  { begin: 8304, end: 8351 },
  // Superscripts And Subscripts
  { begin: 8352, end: 8399 },
  // Currency Symbol
  { begin: 8400, end: 8447 },
  // Combining Diacritical Marks For Symbols
  { begin: 8448, end: 8527 },
  // Letterlike Symbols
  { begin: 8528, end: 8591 },
  // Number Forms
  { begin: 8592, end: 8703 },
  // Arrows
  { begin: 8704, end: 8959 },
  // Mathematical Operators
  { begin: 8960, end: 9215 },
  // Miscellaneous Technical
  { begin: 9216, end: 9279 },
  // Control Pictures
  { begin: 9280, end: 9311 },
  // Optical Character Recognition
  { begin: 9312, end: 9471 },
  // Enclosed Alphanumerics
  { begin: 9472, end: 9599 },
  // Box Drawing
  { begin: 9600, end: 9631 },
  // Block Elements
  { begin: 9632, end: 9727 },
  // Geometric Shapes
  { begin: 9728, end: 9983 },
  // Miscellaneous Symbols
  { begin: 9984, end: 10175 },
  // Dingbats
  { begin: 12288, end: 12351 },
  // CJK Symbols And Punctuation
  { begin: 12352, end: 12447 },
  // Hiragana
  { begin: 12448, end: 12543 },
  // Katakana
  { begin: 12544, end: 12591 },
  // Bopomofo
  { begin: 12592, end: 12687 },
  // Hangul Compatibility Jamo
  { begin: 43072, end: 43135 },
  // Phags-pa
  { begin: 12800, end: 13055 },
  // Enclosed CJK Letters And Months
  { begin: 13056, end: 13311 },
  // CJK Compatibility
  { begin: 44032, end: 55215 },
  // Hangul Syllables
  { begin: 55296, end: 57343 },
  // Non-Plane 0 *
  { begin: 67840, end: 67871 },
  // Phoenicia
  { begin: 19968, end: 40959 },
  // CJK Unified Ideographs
  { begin: 57344, end: 63743 },
  // Private Use Area (plane 0)
  { begin: 12736, end: 12783 },
  // CJK Strokes
  { begin: 64256, end: 64335 },
  // Alphabetic Presentation Forms
  { begin: 64336, end: 65023 },
  // Arabic Presentation Forms-A
  { begin: 65056, end: 65071 },
  // Combining Half Marks
  { begin: 65040, end: 65055 },
  // Vertical Forms
  { begin: 65104, end: 65135 },
  // Small Form Variants
  { begin: 65136, end: 65279 },
  // Arabic Presentation Forms-B
  { begin: 65280, end: 65519 },
  // Halfwidth And Fullwidth Forms
  { begin: 65520, end: 65535 },
  // Specials
  { begin: 3840, end: 4095 },
  // Tibetan
  { begin: 1792, end: 1871 },
  // Syriac
  { begin: 1920, end: 1983 },
  // Thaana
  { begin: 3456, end: 3583 },
  // Sinhala
  { begin: 4096, end: 4255 },
  // Myanmar
  { begin: 4608, end: 4991 },
  // Ethiopic
  { begin: 5024, end: 5119 },
  // Cherokee
  { begin: 5120, end: 5759 },
  // Unified Canadian Aboriginal Syllabics
  { begin: 5760, end: 5791 },
  // Ogham
  { begin: 5792, end: 5887 },
  // Runic
  { begin: 6016, end: 6143 },
  // Khmer
  { begin: 6144, end: 6319 },
  // Mongolian
  { begin: 10240, end: 10495 },
  // Braille Patterns
  { begin: 40960, end: 42127 },
  // Yi Syllables
  { begin: 5888, end: 5919 },
  // Tagalog
  { begin: 66304, end: 66351 },
  // Old Italic
  { begin: 66352, end: 66383 },
  // Gothic
  { begin: 66560, end: 66639 },
  // Deseret
  { begin: 118784, end: 119039 },
  // Byzantine Musical Symbols
  { begin: 119808, end: 120831 },
  // Mathematical Alphanumeric Symbols
  { begin: 1044480, end: 1048573 },
  // Private Use (plane 15)
  { begin: 65024, end: 65039 },
  // Variation Selectors
  { begin: 917504, end: 917631 },
  // Tags
  { begin: 6400, end: 6479 },
  // Limbu
  { begin: 6480, end: 6527 },
  // Tai Le
  { begin: 6528, end: 6623 },
  // New Tai Lue
  { begin: 6656, end: 6687 },
  // Buginese
  { begin: 11264, end: 11359 },
  // Glagolitic
  { begin: 11568, end: 11647 },
  // Tifinagh
  { begin: 19904, end: 19967 },
  // Yijing Hexagram Symbols
  { begin: 43008, end: 43055 },
  // Syloti Nagri
  { begin: 65536, end: 65663 },
  // Linear B Syllabary
  { begin: 65856, end: 65935 },
  // Ancient Greek Numbers
  { begin: 66432, end: 66463 },
  // Ugaritic
  { begin: 66464, end: 66527 },
  // Old Persian
  { begin: 66640, end: 66687 },
  // Shavian
  { begin: 66688, end: 66735 },
  // Osmanya
  { begin: 67584, end: 67647 },
  // Cypriot Syllabary
  { begin: 68096, end: 68191 },
  // Kharoshthi
  { begin: 119552, end: 119647 },
  // Tai Xuan Jing Symbols
  { begin: 73728, end: 74751 },
  // Cuneiform
  { begin: 119648, end: 119679 },
  // Counting Rod Numerals
  { begin: 7040, end: 7103 },
  // Sundanese
  { begin: 7168, end: 7247 },
  // Lepcha
  { begin: 7248, end: 7295 },
  // Ol Chiki
  { begin: 43136, end: 43231 },
  // Saurashtra
  { begin: 43264, end: 43311 },
  // Kayah Li
  { begin: 43312, end: 43359 },
  // Rejang
  { begin: 43520, end: 43615 },
  // Cham
  { begin: 65936, end: 65999 },
  // Ancient Symbols
  { begin: 66e3, end: 66047 },
  // Phaistos Disc
  { begin: 66208, end: 66271 },
  // Carian
  { begin: 127024, end: 127135 }
  // Domino Tiles
];
function getUnicodeRange(unicode) {
  for (var i36 = 0; i36 < unicodeRanges.length; i36 += 1) {
    var range = unicodeRanges[i36];
    if (unicode >= range.begin && unicode < range.end) {
      return i36;
    }
  }
  return -1;
}
function parseOS2Table(data, start) {
  var os22 = {};
  var p28 = new parse.Parser(data, start);
  os22.version = p28.parseUShort();
  os22.xAvgCharWidth = p28.parseShort();
  os22.usWeightClass = p28.parseUShort();
  os22.usWidthClass = p28.parseUShort();
  os22.fsType = p28.parseUShort();
  os22.ySubscriptXSize = p28.parseShort();
  os22.ySubscriptYSize = p28.parseShort();
  os22.ySubscriptXOffset = p28.parseShort();
  os22.ySubscriptYOffset = p28.parseShort();
  os22.ySuperscriptXSize = p28.parseShort();
  os22.ySuperscriptYSize = p28.parseShort();
  os22.ySuperscriptXOffset = p28.parseShort();
  os22.ySuperscriptYOffset = p28.parseShort();
  os22.yStrikeoutSize = p28.parseShort();
  os22.yStrikeoutPosition = p28.parseShort();
  os22.sFamilyClass = p28.parseShort();
  os22.panose = [];
  for (var i36 = 0; i36 < 10; i36++) {
    os22.panose[i36] = p28.parseByte();
  }
  os22.ulUnicodeRange1 = p28.parseULong();
  os22.ulUnicodeRange2 = p28.parseULong();
  os22.ulUnicodeRange3 = p28.parseULong();
  os22.ulUnicodeRange4 = p28.parseULong();
  os22.achVendID = String.fromCharCode(p28.parseByte(), p28.parseByte(), p28.parseByte(), p28.parseByte());
  os22.fsSelection = p28.parseUShort();
  os22.usFirstCharIndex = p28.parseUShort();
  os22.usLastCharIndex = p28.parseUShort();
  os22.sTypoAscender = p28.parseShort();
  os22.sTypoDescender = p28.parseShort();
  os22.sTypoLineGap = p28.parseShort();
  os22.usWinAscent = p28.parseUShort();
  os22.usWinDescent = p28.parseUShort();
  if (os22.version >= 1) {
    os22.ulCodePageRange1 = p28.parseULong();
    os22.ulCodePageRange2 = p28.parseULong();
  }
  if (os22.version >= 2) {
    os22.sxHeight = p28.parseShort();
    os22.sCapHeight = p28.parseShort();
    os22.usDefaultChar = p28.parseUShort();
    os22.usBreakChar = p28.parseUShort();
    os22.usMaxContent = p28.parseUShort();
  }
  return os22;
}
function makeOS2Table(options) {
  return new table.Table("OS/2", [
    { name: "version", type: "USHORT", value: 3 },
    { name: "xAvgCharWidth", type: "SHORT", value: 0 },
    { name: "usWeightClass", type: "USHORT", value: 0 },
    { name: "usWidthClass", type: "USHORT", value: 0 },
    { name: "fsType", type: "USHORT", value: 0 },
    { name: "ySubscriptXSize", type: "SHORT", value: 650 },
    { name: "ySubscriptYSize", type: "SHORT", value: 699 },
    { name: "ySubscriptXOffset", type: "SHORT", value: 0 },
    { name: "ySubscriptYOffset", type: "SHORT", value: 140 },
    { name: "ySuperscriptXSize", type: "SHORT", value: 650 },
    { name: "ySuperscriptYSize", type: "SHORT", value: 699 },
    { name: "ySuperscriptXOffset", type: "SHORT", value: 0 },
    { name: "ySuperscriptYOffset", type: "SHORT", value: 479 },
    { name: "yStrikeoutSize", type: "SHORT", value: 49 },
    { name: "yStrikeoutPosition", type: "SHORT", value: 258 },
    { name: "sFamilyClass", type: "SHORT", value: 0 },
    { name: "bFamilyType", type: "BYTE", value: 0 },
    { name: "bSerifStyle", type: "BYTE", value: 0 },
    { name: "bWeight", type: "BYTE", value: 0 },
    { name: "bProportion", type: "BYTE", value: 0 },
    { name: "bContrast", type: "BYTE", value: 0 },
    { name: "bStrokeVariation", type: "BYTE", value: 0 },
    { name: "bArmStyle", type: "BYTE", value: 0 },
    { name: "bLetterform", type: "BYTE", value: 0 },
    { name: "bMidline", type: "BYTE", value: 0 },
    { name: "bXHeight", type: "BYTE", value: 0 },
    { name: "ulUnicodeRange1", type: "ULONG", value: 0 },
    { name: "ulUnicodeRange2", type: "ULONG", value: 0 },
    { name: "ulUnicodeRange3", type: "ULONG", value: 0 },
    { name: "ulUnicodeRange4", type: "ULONG", value: 0 },
    { name: "achVendID", type: "CHARARRAY", value: "XXXX" },
    { name: "fsSelection", type: "USHORT", value: 0 },
    { name: "usFirstCharIndex", type: "USHORT", value: 0 },
    { name: "usLastCharIndex", type: "USHORT", value: 0 },
    { name: "sTypoAscender", type: "SHORT", value: 0 },
    { name: "sTypoDescender", type: "SHORT", value: 0 },
    { name: "sTypoLineGap", type: "SHORT", value: 0 },
    { name: "usWinAscent", type: "USHORT", value: 0 },
    { name: "usWinDescent", type: "USHORT", value: 0 },
    { name: "ulCodePageRange1", type: "ULONG", value: 0 },
    { name: "ulCodePageRange2", type: "ULONG", value: 0 },
    { name: "sxHeight", type: "SHORT", value: 0 },
    { name: "sCapHeight", type: "SHORT", value: 0 },
    { name: "usDefaultChar", type: "USHORT", value: 0 },
    { name: "usBreakChar", type: "USHORT", value: 0 },
    { name: "usMaxContext", type: "USHORT", value: 0 }
  ], options);
}
var os2 = { parse: parseOS2Table, make: makeOS2Table, unicodeRanges, getUnicodeRange };
function parsePostTable(data, start) {
  var post2 = {};
  var p28 = new parse.Parser(data, start);
  post2.version = p28.parseVersion();
  post2.italicAngle = p28.parseFixed();
  post2.underlinePosition = p28.parseShort();
  post2.underlineThickness = p28.parseShort();
  post2.isFixedPitch = p28.parseULong();
  post2.minMemType42 = p28.parseULong();
  post2.maxMemType42 = p28.parseULong();
  post2.minMemType1 = p28.parseULong();
  post2.maxMemType1 = p28.parseULong();
  switch (post2.version) {
    case 1:
      post2.names = standardNames.slice();
      break;
    case 2:
      post2.numberOfGlyphs = p28.parseUShort();
      post2.glyphNameIndex = new Array(post2.numberOfGlyphs);
      for (var i36 = 0; i36 < post2.numberOfGlyphs; i36++) {
        post2.glyphNameIndex[i36] = p28.parseUShort();
      }
      post2.names = [];
      for (var i$1 = 0; i$1 < post2.numberOfGlyphs; i$1++) {
        if (post2.glyphNameIndex[i$1] >= standardNames.length) {
          var nameLength = p28.parseChar();
          post2.names.push(p28.parseString(nameLength));
        }
      }
      break;
    case 2.5:
      post2.numberOfGlyphs = p28.parseUShort();
      post2.offset = new Array(post2.numberOfGlyphs);
      for (var i$2 = 0; i$2 < post2.numberOfGlyphs; i$2++) {
        post2.offset[i$2] = p28.parseChar();
      }
      break;
  }
  return post2;
}
function makePostTable() {
  return new table.Table("post", [
    { name: "version", type: "FIXED", value: 196608 },
    { name: "italicAngle", type: "FIXED", value: 0 },
    { name: "underlinePosition", type: "FWORD", value: 0 },
    { name: "underlineThickness", type: "FWORD", value: 0 },
    { name: "isFixedPitch", type: "ULONG", value: 0 },
    { name: "minMemType42", type: "ULONG", value: 0 },
    { name: "maxMemType42", type: "ULONG", value: 0 },
    { name: "minMemType1", type: "ULONG", value: 0 },
    { name: "maxMemType1", type: "ULONG", value: 0 }
  ]);
}
var post = { parse: parsePostTable, make: makePostTable };
var subtableParsers = new Array(9);
subtableParsers[1] = function parseLookup1() {
  var start = this.offset + this.relativeOffset;
  var substFormat = this.parseUShort();
  if (substFormat === 1) {
    return {
      substFormat: 1,
      coverage: this.parsePointer(Parser.coverage),
      deltaGlyphId: this.parseUShort()
    };
  } else if (substFormat === 2) {
    return {
      substFormat: 2,
      coverage: this.parsePointer(Parser.coverage),
      substitute: this.parseOffset16List()
    };
  }
  check.assert(false, "0x" + start.toString(16) + ": lookup type 1 format must be 1 or 2.");
};
subtableParsers[2] = function parseLookup2() {
  var substFormat = this.parseUShort();
  check.argument(substFormat === 1, "GSUB Multiple Substitution Subtable identifier-format must be 1");
  return {
    substFormat,
    coverage: this.parsePointer(Parser.coverage),
    sequences: this.parseListOfLists()
  };
};
subtableParsers[3] = function parseLookup3() {
  var substFormat = this.parseUShort();
  check.argument(substFormat === 1, "GSUB Alternate Substitution Subtable identifier-format must be 1");
  return {
    substFormat,
    coverage: this.parsePointer(Parser.coverage),
    alternateSets: this.parseListOfLists()
  };
};
subtableParsers[4] = function parseLookup4() {
  var substFormat = this.parseUShort();
  check.argument(substFormat === 1, "GSUB ligature table identifier-format must be 1");
  return {
    substFormat,
    coverage: this.parsePointer(Parser.coverage),
    ligatureSets: this.parseListOfLists(function() {
      return {
        ligGlyph: this.parseUShort(),
        components: this.parseUShortList(this.parseUShort() - 1)
      };
    })
  };
};
var lookupRecordDesc = {
  sequenceIndex: Parser.uShort,
  lookupListIndex: Parser.uShort
};
subtableParsers[5] = function parseLookup5() {
  var start = this.offset + this.relativeOffset;
  var substFormat = this.parseUShort();
  if (substFormat === 1) {
    return {
      substFormat,
      coverage: this.parsePointer(Parser.coverage),
      ruleSets: this.parseListOfLists(function() {
        var glyphCount2 = this.parseUShort();
        var substCount2 = this.parseUShort();
        return {
          input: this.parseUShortList(glyphCount2 - 1),
          lookupRecords: this.parseRecordList(substCount2, lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 2) {
    return {
      substFormat,
      coverage: this.parsePointer(Parser.coverage),
      classDef: this.parsePointer(Parser.classDef),
      classSets: this.parseListOfLists(function() {
        var glyphCount2 = this.parseUShort();
        var substCount2 = this.parseUShort();
        return {
          classes: this.parseUShortList(glyphCount2 - 1),
          lookupRecords: this.parseRecordList(substCount2, lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 3) {
    var glyphCount = this.parseUShort();
    var substCount = this.parseUShort();
    return {
      substFormat,
      coverages: this.parseList(glyphCount, Parser.pointer(Parser.coverage)),
      lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
    };
  }
  check.assert(false, "0x" + start.toString(16) + ": lookup type 5 format must be 1, 2 or 3.");
};
subtableParsers[6] = function parseLookup6() {
  var start = this.offset + this.relativeOffset;
  var substFormat = this.parseUShort();
  if (substFormat === 1) {
    return {
      substFormat: 1,
      coverage: this.parsePointer(Parser.coverage),
      chainRuleSets: this.parseListOfLists(function() {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 2) {
    return {
      substFormat: 2,
      coverage: this.parsePointer(Parser.coverage),
      backtrackClassDef: this.parsePointer(Parser.classDef),
      inputClassDef: this.parsePointer(Parser.classDef),
      lookaheadClassDef: this.parsePointer(Parser.classDef),
      chainClassSet: this.parseListOfLists(function() {
        return {
          backtrack: this.parseUShortList(),
          input: this.parseUShortList(this.parseShort() - 1),
          lookahead: this.parseUShortList(),
          lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
      })
    };
  } else if (substFormat === 3) {
    return {
      substFormat: 3,
      backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
      inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
      lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
      lookupRecords: this.parseRecordList(lookupRecordDesc)
    };
  }
  check.assert(false, "0x" + start.toString(16) + ": lookup type 6 format must be 1, 2 or 3.");
};
subtableParsers[7] = function parseLookup7() {
  var substFormat = this.parseUShort();
  check.argument(substFormat === 1, "GSUB Extension Substitution subtable identifier-format must be 1");
  var extensionLookupType = this.parseUShort();
  var extensionParser = new Parser(this.data, this.offset + this.parseULong());
  return {
    substFormat: 1,
    lookupType: extensionLookupType,
    extension: subtableParsers[extensionLookupType].call(extensionParser)
  };
};
subtableParsers[8] = function parseLookup8() {
  var substFormat = this.parseUShort();
  check.argument(substFormat === 1, "GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1");
  return {
    substFormat,
    coverage: this.parsePointer(Parser.coverage),
    backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
    lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
    substitutes: this.parseUShortList()
  };
};
function parseGsubTable(data, start) {
  start = start || 0;
  var p28 = new Parser(data, start);
  var tableVersion = p28.parseVersion(1);
  check.argument(tableVersion === 1 || tableVersion === 1.1, "Unsupported GSUB table version.");
  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p28.parseScriptList(),
      features: p28.parseFeatureList(),
      lookups: p28.parseLookupList(subtableParsers)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p28.parseScriptList(),
      features: p28.parseFeatureList(),
      lookups: p28.parseLookupList(subtableParsers),
      variations: p28.parseFeatureVariationsList()
    };
  }
}
var subtableMakers = new Array(9);
subtableMakers[1] = function makeLookup1(subtable) {
  if (subtable.substFormat === 1) {
    return new table.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 1 },
      { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) },
      { name: "deltaGlyphID", type: "USHORT", value: subtable.deltaGlyphId }
    ]);
  } else {
    return new table.Table("substitutionTable", [
      { name: "substFormat", type: "USHORT", value: 2 },
      { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) }
    ].concat(table.ushortList("substitute", subtable.substitute)));
  }
};
subtableMakers[2] = function makeLookup2(subtable) {
  check.assert(subtable.substFormat === 1, "Lookup type 2 substFormat must be 1.");
  return new table.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) }
  ].concat(table.tableList("seqSet", subtable.sequences, function(sequenceSet) {
    return new table.Table("sequenceSetTable", table.ushortList("sequence", sequenceSet));
  })));
};
subtableMakers[3] = function makeLookup3(subtable) {
  check.assert(subtable.substFormat === 1, "Lookup type 3 substFormat must be 1.");
  return new table.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) }
  ].concat(table.tableList("altSet", subtable.alternateSets, function(alternateSet) {
    return new table.Table("alternateSetTable", table.ushortList("alternate", alternateSet));
  })));
};
subtableMakers[4] = function makeLookup4(subtable) {
  check.assert(subtable.substFormat === 1, "Lookup type 4 substFormat must be 1.");
  return new table.Table("substitutionTable", [
    { name: "substFormat", type: "USHORT", value: 1 },
    { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) }
  ].concat(table.tableList("ligSet", subtable.ligatureSets, function(ligatureSet) {
    return new table.Table("ligatureSetTable", table.tableList("ligature", ligatureSet, function(ligature) {
      return new table.Table(
        "ligatureTable",
        [{ name: "ligGlyph", type: "USHORT", value: ligature.ligGlyph }].concat(table.ushortList("component", ligature.components, ligature.components.length + 1))
      );
    }));
  })));
};
subtableMakers[6] = function makeLookup6(subtable) {
  if (subtable.substFormat === 1) {
    var returnTable = new table.Table("chainContextTable", [
      { name: "substFormat", type: "USHORT", value: subtable.substFormat },
      { name: "coverage", type: "TABLE", value: new table.Coverage(subtable.coverage) }
    ].concat(table.tableList("chainRuleSet", subtable.chainRuleSets, function(chainRuleSet) {
      return new table.Table("chainRuleSetTable", table.tableList("chainRule", chainRuleSet, function(chainRule) {
        var tableData2 = table.ushortList("backtrackGlyph", chainRule.backtrack, chainRule.backtrack.length).concat(table.ushortList("inputGlyph", chainRule.input, chainRule.input.length + 1)).concat(table.ushortList("lookaheadGlyph", chainRule.lookahead, chainRule.lookahead.length)).concat(table.ushortList("substitution", [], chainRule.lookupRecords.length));
        chainRule.lookupRecords.forEach(function(record, i36) {
          tableData2 = tableData2.concat({ name: "sequenceIndex" + i36, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i36, type: "USHORT", value: record.lookupListIndex });
        });
        return new table.Table("chainRuleTable", tableData2);
      }));
    })));
    return returnTable;
  } else if (subtable.substFormat === 2) {
    check.assert(false, "lookup type 6 format 2 is not yet supported.");
  } else if (subtable.substFormat === 3) {
    var tableData = [
      { name: "substFormat", type: "USHORT", value: subtable.substFormat }
    ];
    tableData.push({ name: "backtrackGlyphCount", type: "USHORT", value: subtable.backtrackCoverage.length });
    subtable.backtrackCoverage.forEach(function(coverage, i36) {
      tableData.push({ name: "backtrackCoverage" + i36, type: "TABLE", value: new table.Coverage(coverage) });
    });
    tableData.push({ name: "inputGlyphCount", type: "USHORT", value: subtable.inputCoverage.length });
    subtable.inputCoverage.forEach(function(coverage, i36) {
      tableData.push({ name: "inputCoverage" + i36, type: "TABLE", value: new table.Coverage(coverage) });
    });
    tableData.push({ name: "lookaheadGlyphCount", type: "USHORT", value: subtable.lookaheadCoverage.length });
    subtable.lookaheadCoverage.forEach(function(coverage, i36) {
      tableData.push({ name: "lookaheadCoverage" + i36, type: "TABLE", value: new table.Coverage(coverage) });
    });
    tableData.push({ name: "substitutionCount", type: "USHORT", value: subtable.lookupRecords.length });
    subtable.lookupRecords.forEach(function(record, i36) {
      tableData = tableData.concat({ name: "sequenceIndex" + i36, type: "USHORT", value: record.sequenceIndex }).concat({ name: "lookupListIndex" + i36, type: "USHORT", value: record.lookupListIndex });
    });
    var returnTable$1 = new table.Table("chainContextTable", tableData);
    return returnTable$1;
  }
  check.assert(false, "lookup type 6 format must be 1, 2 or 3.");
};
function makeGsubTable(gsub2) {
  return new table.Table("GSUB", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "scripts", type: "TABLE", value: new table.ScriptList(gsub2.scripts) },
    { name: "features", type: "TABLE", value: new table.FeatureList(gsub2.features) },
    { name: "lookups", type: "TABLE", value: new table.LookupList(gsub2.lookups, subtableMakers) }
  ]);
}
var gsub = { parse: parseGsubTable, make: makeGsubTable };
function parseMetaTable(data, start) {
  var p28 = new parse.Parser(data, start);
  var tableVersion = p28.parseULong();
  check.argument(tableVersion === 1, "Unsupported META table version.");
  p28.parseULong();
  p28.parseULong();
  var numDataMaps = p28.parseULong();
  var tags = {};
  for (var i36 = 0; i36 < numDataMaps; i36++) {
    var tag = p28.parseTag();
    var dataOffset = p28.parseULong();
    var dataLength = p28.parseULong();
    var text = decode.UTF8(data, start + dataOffset, dataLength);
    tags[tag] = text;
  }
  return tags;
}
function makeMetaTable(tags) {
  var numTags = Object.keys(tags).length;
  var stringPool = "";
  var stringPoolOffset = 16 + numTags * 12;
  var result = new table.Table("meta", [
    { name: "version", type: "ULONG", value: 1 },
    { name: "flags", type: "ULONG", value: 0 },
    { name: "offset", type: "ULONG", value: stringPoolOffset },
    { name: "numTags", type: "ULONG", value: numTags }
  ]);
  for (var tag in tags) {
    var pos = stringPool.length;
    stringPool += tags[tag];
    result.fields.push({ name: "tag " + tag, type: "TAG", value: tag });
    result.fields.push({ name: "offset " + tag, type: "ULONG", value: stringPoolOffset + pos });
    result.fields.push({ name: "length " + tag, type: "ULONG", value: tags[tag].length });
  }
  result.fields.push({ name: "stringPool", type: "CHARARRAY", value: stringPool });
  return result;
}
var meta = { parse: parseMetaTable, make: makeMetaTable };
function log2(v22) {
  return Math.log(v22) / Math.log(2) | 0;
}
function computeCheckSum(bytes) {
  while (bytes.length % 4 !== 0) {
    bytes.push(0);
  }
  var sum = 0;
  for (var i36 = 0; i36 < bytes.length; i36 += 4) {
    sum += (bytes[i36] << 24) + (bytes[i36 + 1] << 16) + (bytes[i36 + 2] << 8) + bytes[i36 + 3];
  }
  sum %= Math.pow(2, 32);
  return sum;
}
function makeTableRecord(tag, checkSum, offset, length) {
  return new table.Record("Table Record", [
    { name: "tag", type: "TAG", value: tag !== void 0 ? tag : "" },
    { name: "checkSum", type: "ULONG", value: checkSum !== void 0 ? checkSum : 0 },
    { name: "offset", type: "ULONG", value: offset !== void 0 ? offset : 0 },
    { name: "length", type: "ULONG", value: length !== void 0 ? length : 0 }
  ]);
}
function makeSfntTable(tables) {
  var sfnt2 = new table.Table("sfnt", [
    { name: "version", type: "TAG", value: "OTTO" },
    { name: "numTables", type: "USHORT", value: 0 },
    { name: "searchRange", type: "USHORT", value: 0 },
    { name: "entrySelector", type: "USHORT", value: 0 },
    { name: "rangeShift", type: "USHORT", value: 0 }
  ]);
  sfnt2.tables = tables;
  sfnt2.numTables = tables.length;
  var highestPowerOf2 = Math.pow(2, log2(sfnt2.numTables));
  sfnt2.searchRange = 16 * highestPowerOf2;
  sfnt2.entrySelector = log2(highestPowerOf2);
  sfnt2.rangeShift = sfnt2.numTables * 16 - sfnt2.searchRange;
  var recordFields = [];
  var tableFields = [];
  var offset = sfnt2.sizeOf() + makeTableRecord().sizeOf() * sfnt2.numTables;
  while (offset % 4 !== 0) {
    offset += 1;
    tableFields.push({ name: "padding", type: "BYTE", value: 0 });
  }
  for (var i36 = 0; i36 < tables.length; i36 += 1) {
    var t31 = tables[i36];
    check.argument(t31.tableName.length === 4, "Table name" + t31.tableName + " is invalid.");
    var tableLength = t31.sizeOf();
    var tableRecord = makeTableRecord(t31.tableName, computeCheckSum(t31.encode()), offset, tableLength);
    recordFields.push({ name: tableRecord.tag + " Table Record", type: "RECORD", value: tableRecord });
    tableFields.push({ name: t31.tableName + " table", type: "RECORD", value: t31 });
    offset += tableLength;
    check.argument(!isNaN(offset), "Something went wrong calculating the offset.");
    while (offset % 4 !== 0) {
      offset += 1;
      tableFields.push({ name: "padding", type: "BYTE", value: 0 });
    }
  }
  recordFields.sort(function(r1, r210) {
    if (r1.value.tag > r210.value.tag) {
      return 1;
    } else {
      return -1;
    }
  });
  sfnt2.fields = sfnt2.fields.concat(recordFields);
  sfnt2.fields = sfnt2.fields.concat(tableFields);
  return sfnt2;
}
function metricsForChar(font, chars, notFoundMetrics) {
  for (var i36 = 0; i36 < chars.length; i36 += 1) {
    var glyphIndex = font.charToGlyphIndex(chars[i36]);
    if (glyphIndex > 0) {
      var glyph = font.glyphs.get(glyphIndex);
      return glyph.getMetrics();
    }
  }
  return notFoundMetrics;
}
function average(vs) {
  var sum = 0;
  for (var i36 = 0; i36 < vs.length; i36 += 1) {
    sum += vs[i36];
  }
  return sum / vs.length;
}
function fontToSfntTable(font) {
  var xMins = [];
  var yMins = [];
  var xMaxs = [];
  var yMaxs = [];
  var advanceWidths = [];
  var leftSideBearings = [];
  var rightSideBearings = [];
  var firstCharIndex;
  var lastCharIndex = 0;
  var ulUnicodeRange1 = 0;
  var ulUnicodeRange2 = 0;
  var ulUnicodeRange3 = 0;
  var ulUnicodeRange4 = 0;
  for (var i36 = 0; i36 < font.glyphs.length; i36 += 1) {
    var glyph = font.glyphs.get(i36);
    var unicode = glyph.unicode | 0;
    if (isNaN(glyph.advanceWidth)) {
      throw new Error("Glyph " + glyph.name + " (" + i36 + "): advanceWidth is not a number.");
    }
    if (firstCharIndex > unicode || firstCharIndex === void 0) {
      if (unicode > 0) {
        firstCharIndex = unicode;
      }
    }
    if (lastCharIndex < unicode) {
      lastCharIndex = unicode;
    }
    var position = os2.getUnicodeRange(unicode);
    if (position < 32) {
      ulUnicodeRange1 |= 1 << position;
    } else if (position < 64) {
      ulUnicodeRange2 |= 1 << position - 32;
    } else if (position < 96) {
      ulUnicodeRange3 |= 1 << position - 64;
    } else if (position < 123) {
      ulUnicodeRange4 |= 1 << position - 96;
    } else {
      throw new Error("Unicode ranges bits > 123 are reserved for internal usage");
    }
    if (glyph.name === ".notdef") {
      continue;
    }
    var metrics = glyph.getMetrics();
    xMins.push(metrics.xMin);
    yMins.push(metrics.yMin);
    xMaxs.push(metrics.xMax);
    yMaxs.push(metrics.yMax);
    leftSideBearings.push(metrics.leftSideBearing);
    rightSideBearings.push(metrics.rightSideBearing);
    advanceWidths.push(glyph.advanceWidth);
  }
  var globals = {
    xMin: Math.min.apply(null, xMins),
    yMin: Math.min.apply(null, yMins),
    xMax: Math.max.apply(null, xMaxs),
    yMax: Math.max.apply(null, yMaxs),
    advanceWidthMax: Math.max.apply(null, advanceWidths),
    advanceWidthAvg: average(advanceWidths),
    minLeftSideBearing: Math.min.apply(null, leftSideBearings),
    maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
    minRightSideBearing: Math.min.apply(null, rightSideBearings)
  };
  globals.ascender = font.ascender;
  globals.descender = font.descender;
  var headTable = head.make({
    flags: 3,
    // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
    unitsPerEm: font.unitsPerEm,
    xMin: globals.xMin,
    yMin: globals.yMin,
    xMax: globals.xMax,
    yMax: globals.yMax,
    lowestRecPPEM: 3,
    createdTimestamp: font.createdTimestamp
  });
  var hheaTable = hhea.make({
    ascender: globals.ascender,
    descender: globals.descender,
    advanceWidthMax: globals.advanceWidthMax,
    minLeftSideBearing: globals.minLeftSideBearing,
    minRightSideBearing: globals.minRightSideBearing,
    xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
    numberOfHMetrics: font.glyphs.length
  });
  var maxpTable = maxp.make(font.glyphs.length);
  var os2Table = os2.make(Object.assign({
    xAvgCharWidth: Math.round(globals.advanceWidthAvg),
    usFirstCharIndex: firstCharIndex,
    usLastCharIndex: lastCharIndex,
    ulUnicodeRange1,
    ulUnicodeRange2,
    ulUnicodeRange3,
    ulUnicodeRange4,
    // See http://typophile.com/node/13081 for more info on vertical metrics.
    // We get metrics for typical characters (such as "x" for xHeight).
    // We provide some fallback characters if characters are unavailable: their
    // ordering was chosen experimentally.
    sTypoAscender: globals.ascender,
    sTypoDescender: globals.descender,
    sTypoLineGap: 0,
    usWinAscent: globals.yMax,
    usWinDescent: Math.abs(globals.yMin),
    ulCodePageRange1: 1,
    // FIXME: hard-code Latin 1 support for now
    sxHeight: metricsForChar(font, "xyvw", { yMax: Math.round(globals.ascender / 2) }).yMax,
    sCapHeight: metricsForChar(font, "HIKLEFJMNTZBDPRAGOQSUVWXY", globals).yMax,
    usDefaultChar: font.hasChar(" ") ? 32 : 0,
    // Use space as the default character, if available.
    usBreakChar: font.hasChar(" ") ? 32 : 0
    // Use space as the break character, if available.
  }, font.tables.os2));
  var hmtxTable = hmtx.make(font.glyphs);
  var cmapTable = cmap.make(font.glyphs);
  var englishFamilyName = font.getEnglishName("fontFamily");
  var englishStyleName = font.getEnglishName("fontSubfamily");
  var englishFullName = englishFamilyName + " " + englishStyleName;
  var postScriptName = font.getEnglishName("postScriptName");
  if (!postScriptName) {
    postScriptName = englishFamilyName.replace(/\s/g, "") + "-" + englishStyleName;
  }
  var names = {};
  for (var n39 in font.names) {
    names[n39] = font.names[n39];
  }
  if (!names.uniqueID) {
    names.uniqueID = { en: font.getEnglishName("manufacturer") + ":" + englishFullName };
  }
  if (!names.postScriptName) {
    names.postScriptName = { en: postScriptName };
  }
  if (!names.preferredFamily) {
    names.preferredFamily = font.names.fontFamily;
  }
  if (!names.preferredSubfamily) {
    names.preferredSubfamily = font.names.fontSubfamily;
  }
  var languageTags = [];
  var nameTable = _name.make(names, languageTags);
  var ltagTable = languageTags.length > 0 ? ltag.make(languageTags) : void 0;
  var postTable = post.make();
  var cffTable = cff.make(font.glyphs, {
    version: font.getEnglishName("version"),
    fullName: englishFullName,
    familyName: englishFamilyName,
    weightName: englishStyleName,
    postScriptName,
    unitsPerEm: font.unitsPerEm,
    fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
  });
  var metaTable = font.metas && Object.keys(font.metas).length > 0 ? meta.make(font.metas) : void 0;
  var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
  if (ltagTable) {
    tables.push(ltagTable);
  }
  if (font.tables.gsub) {
    tables.push(gsub.make(font.tables.gsub));
  }
  if (metaTable) {
    tables.push(metaTable);
  }
  var sfntTable = makeSfntTable(tables);
  var bytes = sfntTable.encode();
  var checkSum = computeCheckSum(bytes);
  var tableFields = sfntTable.fields;
  var checkSumAdjusted = false;
  for (var i$1 = 0; i$1 < tableFields.length; i$1 += 1) {
    if (tableFields[i$1].name === "head table") {
      tableFields[i$1].value.checkSumAdjustment = 2981146554 - checkSum;
      checkSumAdjusted = true;
      break;
    }
  }
  if (!checkSumAdjusted) {
    throw new Error("Could not find head table with checkSum to adjust.");
  }
  return sfntTable;
}
var sfnt = { make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum };
function searchTag(arr, tag) {
  var imin = 0;
  var imax = arr.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    var val = arr[imid].tag;
    if (val === tag) {
      return imid;
    } else if (val < tag) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  return -imin - 1;
}
function binSearch(arr, value) {
  var imin = 0;
  var imax = arr.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    var val = arr[imid];
    if (val === value) {
      return imid;
    } else if (val < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  return -imin - 1;
}
function searchRange(ranges, value) {
  var range;
  var imin = 0;
  var imax = ranges.length - 1;
  while (imin <= imax) {
    var imid = imin + imax >>> 1;
    range = ranges[imid];
    var start = range.start;
    if (start === value) {
      return range;
    } else if (start < value) {
      imin = imid + 1;
    } else {
      imax = imid - 1;
    }
  }
  if (imin > 0) {
    range = ranges[imin - 1];
    if (value > range.end) {
      return 0;
    }
    return range;
  }
}
function Layout(font, tableName) {
  this.font = font;
  this.tableName = tableName;
}
Layout.prototype = {
  /**
   * Binary search an object by "tag" property
   * @instance
   * @function searchTag
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {string} tag
   * @return {number}
   */
  searchTag,
  /**
   * Binary search in a list of numbers
   * @instance
   * @function binSearch
   * @memberof opentype.Layout
   * @param  {Array} arr
   * @param  {number} value
   * @return {number}
   */
  binSearch,
  /**
   * Get or create the Layout table (GSUB, GPOS etc).
   * @param  {boolean} create - Whether to create a new one.
   * @return {Object} The GSUB or GPOS table.
   */
  getTable: function(create) {
    var layout = this.font.tables[this.tableName];
    if (!layout && create) {
      layout = this.font.tables[this.tableName] = this.createDefaultTable();
    }
    return layout;
  },
  /**
   * Returns all scripts in the substitution table.
   * @instance
   * @return {Array}
   */
  getScriptNames: function() {
    var layout = this.getTable();
    if (!layout) {
      return [];
    }
    return layout.scripts.map(function(script) {
      return script.tag;
    });
  },
  /**
   * Returns the best bet for a script name.
   * Returns 'DFLT' if it exists.
   * If not, returns 'latn' if it exists.
   * If neither exist, returns undefined.
   */
  getDefaultScriptName: function() {
    var layout = this.getTable();
    if (!layout) {
      return;
    }
    var hasLatn = false;
    for (var i36 = 0; i36 < layout.scripts.length; i36++) {
      var name = layout.scripts[i36].tag;
      if (name === "DFLT") {
        return name;
      }
      if (name === "latn") {
        hasLatn = true;
      }
    }
    if (hasLatn) {
      return "latn";
    }
  },
  /**
   * Returns all LangSysRecords in the given script.
   * @instance
   * @param {string} [script='DFLT']
   * @param {boolean} create - forces the creation of this script table if it doesn't exist.
   * @return {Object} An object with tag and script properties.
   */
  getScriptTable: function(script, create) {
    var layout = this.getTable(create);
    if (layout) {
      script = script || "DFLT";
      var scripts = layout.scripts;
      var pos = searchTag(layout.scripts, script);
      if (pos >= 0) {
        return scripts[pos].script;
      } else if (create) {
        var scr = {
          tag: script,
          script: {
            defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
            langSysRecords: []
          }
        };
        scripts.splice(-1 - pos, 0, scr);
        return scr.script;
      }
    }
  },
  /**
   * Returns a language system table
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
   * @return {Object}
   */
  getLangSysTable: function(script, language, create) {
    var scriptTable = this.getScriptTable(script, create);
    if (scriptTable) {
      if (!language || language === "dflt" || language === "DFLT") {
        return scriptTable.defaultLangSys;
      }
      var pos = searchTag(scriptTable.langSysRecords, language);
      if (pos >= 0) {
        return scriptTable.langSysRecords[pos].langSys;
      } else if (create) {
        var langSysRecord = {
          tag: language,
          langSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] }
        };
        scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
        return langSysRecord.langSys;
      }
    }
  },
  /**
   * Get a specific feature table.
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
   * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
   * @return {Object}
   */
  getFeatureTable: function(script, language, feature, create) {
    var langSysTable2 = this.getLangSysTable(script, language, create);
    if (langSysTable2) {
      var featureRecord;
      var featIndexes = langSysTable2.featureIndexes;
      var allFeatures = this.font.tables[this.tableName].features;
      for (var i36 = 0; i36 < featIndexes.length; i36++) {
        featureRecord = allFeatures[featIndexes[i36]];
        if (featureRecord.tag === feature) {
          return featureRecord.feature;
        }
      }
      if (create) {
        var index = allFeatures.length;
        check.assert(index === 0 || feature >= allFeatures[index - 1].tag, "Features must be added in alphabetical order.");
        featureRecord = {
          tag: feature,
          feature: { params: 0, lookupListIndexes: [] }
        };
        allFeatures.push(featureRecord);
        featIndexes.push(index);
        return featureRecord.feature;
      }
    }
  },
  /**
   * Get the lookup tables of a given type for a script/language/feature.
   * @instance
   * @param {string} [script='DFLT']
   * @param {string} [language='dlft']
   * @param {string} feature - 4-letter feature code
   * @param {number} lookupType - 1 to 9
   * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
   * @return {Object[]}
   */
  getLookupTables: function(script, language, feature, lookupType, create) {
    var featureTable = this.getFeatureTable(script, language, feature, create);
    var tables = [];
    if (featureTable) {
      var lookupTable;
      var lookupListIndexes = featureTable.lookupListIndexes;
      var allLookups = this.font.tables[this.tableName].lookups;
      for (var i36 = 0; i36 < lookupListIndexes.length; i36++) {
        lookupTable = allLookups[lookupListIndexes[i36]];
        if (lookupTable.lookupType === lookupType) {
          tables.push(lookupTable);
        }
      }
      if (tables.length === 0 && create) {
        lookupTable = {
          lookupType,
          lookupFlag: 0,
          subtables: [],
          markFilteringSet: void 0
        };
        var index = allLookups.length;
        allLookups.push(lookupTable);
        lookupListIndexes.push(index);
        return [lookupTable];
      }
    }
    return tables;
  },
  /**
   * Find a glyph in a class definition table
   * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
   * @param {object} classDefTable - an OpenType Layout class definition table
   * @param {number} glyphIndex - the index of the glyph to find
   * @returns {number} -1 if not found
   */
  getGlyphClass: function(classDefTable, glyphIndex) {
    switch (classDefTable.format) {
      case 1:
        if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
          return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
        }
        return 0;
      case 2:
        var range = searchRange(classDefTable.ranges, glyphIndex);
        return range ? range.classId : 0;
    }
  },
  /**
   * Find a glyph in a coverage table
   * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
   * @param {object} coverageTable - an OpenType Layout coverage table
   * @param {number} glyphIndex - the index of the glyph to find
   * @returns {number} -1 if not found
   */
  getCoverageIndex: function(coverageTable, glyphIndex) {
    switch (coverageTable.format) {
      case 1:
        var index = binSearch(coverageTable.glyphs, glyphIndex);
        return index >= 0 ? index : -1;
      case 2:
        var range = searchRange(coverageTable.ranges, glyphIndex);
        return range ? range.index + glyphIndex - range.start : -1;
    }
  },
  /**
   * Returns the list of glyph indexes of a coverage table.
   * Format 1: the list is stored raw
   * Format 2: compact list as range records.
   * @instance
   * @param  {Object} coverageTable
   * @return {Array}
   */
  expandCoverage: function(coverageTable) {
    if (coverageTable.format === 1) {
      return coverageTable.glyphs;
    } else {
      var glyphs = [];
      var ranges = coverageTable.ranges;
      for (var i36 = 0; i36 < ranges.length; i36++) {
        var range = ranges[i36];
        var start = range.start;
        var end = range.end;
        for (var j9 = start; j9 <= end; j9++) {
          glyphs.push(j9);
        }
      }
      return glyphs;
    }
  }
};
function Position(font) {
  Layout.call(this, font, "gpos");
}
Position.prototype = Layout.prototype;
Position.prototype.init = function() {
  var script = this.getDefaultScriptName();
  this.defaultKerningTables = this.getKerningTables(script);
};
Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
  for (var i36 = 0; i36 < kerningLookups.length; i36++) {
    var subtables = kerningLookups[i36].subtables;
    for (var j9 = 0; j9 < subtables.length; j9++) {
      var subtable = subtables[j9];
      var covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
      if (covIndex < 0) {
        continue;
      }
      switch (subtable.posFormat) {
        case 1:
          var pairSet = subtable.pairSets[covIndex];
          for (var k11 = 0; k11 < pairSet.length; k11++) {
            var pair = pairSet[k11];
            if (pair.secondGlyph === rightIndex) {
              return pair.value1 && pair.value1.xAdvance || 0;
            }
          }
          break;
        // left glyph found, not right glyph - try next subtable
        case 2:
          var class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
          var class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
          var pair$1 = subtable.classRecords[class1][class2];
          return pair$1.value1 && pair$1.value1.xAdvance || 0;
      }
    }
  }
  return 0;
};
Position.prototype.getKerningTables = function(script, language) {
  if (this.font.tables.gpos) {
    return this.getLookupTables(script, language, "kern", 2);
  }
};
function Substitution(font) {
  Layout.call(this, font, "gsub");
}
function arraysEqual(ar1, ar2) {
  var n39 = ar1.length;
  if (n39 !== ar2.length) {
    return false;
  }
  for (var i36 = 0; i36 < n39; i36++) {
    if (ar1[i36] !== ar2[i36]) {
      return false;
    }
  }
  return true;
}
function getSubstFormat(lookupTable, format, defaultSubtable) {
  var subtables = lookupTable.subtables;
  for (var i36 = 0; i36 < subtables.length; i36++) {
    var subtable = subtables[i36];
    if (subtable.substFormat === format) {
      return subtable;
    }
  }
  if (defaultSubtable) {
    subtables.push(defaultSubtable);
    return defaultSubtable;
  }
  return void 0;
}
Substitution.prototype = Layout.prototype;
Substitution.prototype.createDefaultTable = function() {
  return {
    version: 1,
    scripts: [{
      tag: "DFLT",
      script: {
        defaultLangSys: { reserved: 0, reqFeatureIndex: 65535, featureIndexes: [] },
        langSysRecords: []
      }
    }],
    features: [],
    lookups: []
  };
};
Substitution.prototype.getSingle = function(feature, script, language) {
  var substitutions = [];
  var lookupTables = this.getLookupTables(script, language, feature, 1);
  for (var idx = 0; idx < lookupTables.length; idx++) {
    var subtables = lookupTables[idx].subtables;
    for (var i36 = 0; i36 < subtables.length; i36++) {
      var subtable = subtables[i36];
      var glyphs = this.expandCoverage(subtable.coverage);
      var j9 = void 0;
      if (subtable.substFormat === 1) {
        var delta = subtable.deltaGlyphId;
        for (j9 = 0; j9 < glyphs.length; j9++) {
          var glyph = glyphs[j9];
          substitutions.push({ sub: glyph, by: glyph + delta });
        }
      } else {
        var substitute = subtable.substitute;
        for (j9 = 0; j9 < glyphs.length; j9++) {
          substitutions.push({ sub: glyphs[j9], by: substitute[j9] });
        }
      }
    }
  }
  return substitutions;
};
Substitution.prototype.getMultiple = function(feature, script, language) {
  var substitutions = [];
  var lookupTables = this.getLookupTables(script, language, feature, 2);
  for (var idx = 0; idx < lookupTables.length; idx++) {
    var subtables = lookupTables[idx].subtables;
    for (var i36 = 0; i36 < subtables.length; i36++) {
      var subtable = subtables[i36];
      var glyphs = this.expandCoverage(subtable.coverage);
      var j9 = void 0;
      for (j9 = 0; j9 < glyphs.length; j9++) {
        var glyph = glyphs[j9];
        var replacements = subtable.sequences[j9];
        substitutions.push({ sub: glyph, by: replacements });
      }
    }
  }
  return substitutions;
};
Substitution.prototype.getAlternates = function(feature, script, language) {
  var alternates = [];
  var lookupTables = this.getLookupTables(script, language, feature, 3);
  for (var idx = 0; idx < lookupTables.length; idx++) {
    var subtables = lookupTables[idx].subtables;
    for (var i36 = 0; i36 < subtables.length; i36++) {
      var subtable = subtables[i36];
      var glyphs = this.expandCoverage(subtable.coverage);
      var alternateSets = subtable.alternateSets;
      for (var j9 = 0; j9 < glyphs.length; j9++) {
        alternates.push({ sub: glyphs[j9], by: alternateSets[j9] });
      }
    }
  }
  return alternates;
};
Substitution.prototype.getLigatures = function(feature, script, language) {
  var ligatures = [];
  var lookupTables = this.getLookupTables(script, language, feature, 4);
  for (var idx = 0; idx < lookupTables.length; idx++) {
    var subtables = lookupTables[idx].subtables;
    for (var i36 = 0; i36 < subtables.length; i36++) {
      var subtable = subtables[i36];
      var glyphs = this.expandCoverage(subtable.coverage);
      var ligatureSets = subtable.ligatureSets;
      for (var j9 = 0; j9 < glyphs.length; j9++) {
        var startGlyph = glyphs[j9];
        var ligSet = ligatureSets[j9];
        for (var k11 = 0; k11 < ligSet.length; k11++) {
          var lig = ligSet[k11];
          ligatures.push({
            sub: [startGlyph].concat(lig.components),
            by: lig.ligGlyph
          });
        }
      }
    }
  }
  return ligatures;
};
Substitution.prototype.addSingle = function(feature, substitution, script, language) {
  var lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
  var subtable = getSubstFormat(lookupTable, 2, {
    // lookup type 1 subtable, format 2, coverage format 1
    substFormat: 2,
    coverage: { format: 1, glyphs: [] },
    substitute: []
  });
  check.assert(subtable.coverage.format === 1, "Single: unable to modify coverage table format " + subtable.coverage.format);
  var coverageGlyph = substitution.sub;
  var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
  if (pos < 0) {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.substitute.splice(pos, 0, 0);
  }
  subtable.substitute[pos] = substitution.by;
};
Substitution.prototype.addMultiple = function(feature, substitution, script, language) {
  check.assert(substitution.by instanceof Array && substitution.by.length > 1, 'Multiple: "by" must be an array of two or more ids');
  var lookupTable = this.getLookupTables(script, language, feature, 2, true)[0];
  var subtable = getSubstFormat(lookupTable, 1, {
    // lookup type 2 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: { format: 1, glyphs: [] },
    sequences: []
  });
  check.assert(subtable.coverage.format === 1, "Multiple: unable to modify coverage table format " + subtable.coverage.format);
  var coverageGlyph = substitution.sub;
  var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
  if (pos < 0) {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.sequences.splice(pos, 0, 0);
  }
  subtable.sequences[pos] = substitution.by;
};
Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
  var lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
  var subtable = getSubstFormat(lookupTable, 1, {
    // lookup type 3 subtable, format 1, coverage format 1
    substFormat: 1,
    coverage: { format: 1, glyphs: [] },
    alternateSets: []
  });
  check.assert(subtable.coverage.format === 1, "Alternate: unable to modify coverage table format " + subtable.coverage.format);
  var coverageGlyph = substitution.sub;
  var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
  if (pos < 0) {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.alternateSets.splice(pos, 0, 0);
  }
  subtable.alternateSets[pos] = substitution.by;
};
Substitution.prototype.addLigature = function(feature, ligature, script, language) {
  var lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
  var subtable = lookupTable.subtables[0];
  if (!subtable) {
    subtable = {
      // lookup type 4 subtable, format 1, coverage format 1
      substFormat: 1,
      coverage: { format: 1, glyphs: [] },
      ligatureSets: []
    };
    lookupTable.subtables[0] = subtable;
  }
  check.assert(subtable.coverage.format === 1, "Ligature: unable to modify coverage table format " + subtable.coverage.format);
  var coverageGlyph = ligature.sub[0];
  var ligComponents = ligature.sub.slice(1);
  var ligatureTable = {
    ligGlyph: ligature.by,
    components: ligComponents
  };
  var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
  if (pos >= 0) {
    var ligatureSet = subtable.ligatureSets[pos];
    for (var i36 = 0; i36 < ligatureSet.length; i36++) {
      if (arraysEqual(ligatureSet[i36].components, ligComponents)) {
        return;
      }
    }
    ligatureSet.push(ligatureTable);
  } else {
    pos = -1 - pos;
    subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
    subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
  }
};
Substitution.prototype.getFeature = function(feature, script, language) {
  if (/ss\d\d/.test(feature)) {
    return this.getSingle(feature, script, language);
  }
  switch (feature) {
    case "aalt":
    case "salt":
      return this.getSingle(feature, script, language).concat(this.getAlternates(feature, script, language));
    case "dlig":
    case "liga":
    case "rlig":
      return this.getLigatures(feature, script, language);
    case "ccmp":
      return this.getMultiple(feature, script, language).concat(this.getLigatures(feature, script, language));
    case "stch":
      return this.getMultiple(feature, script, language);
  }
  return void 0;
};
Substitution.prototype.add = function(feature, sub, script, language) {
  if (/ss\d\d/.test(feature)) {
    return this.addSingle(feature, sub, script, language);
  }
  switch (feature) {
    case "aalt":
    case "salt":
      if (typeof sub.by === "number") {
        return this.addSingle(feature, sub, script, language);
      }
      return this.addAlternate(feature, sub, script, language);
    case "dlig":
    case "liga":
    case "rlig":
      return this.addLigature(feature, sub, script, language);
    case "ccmp":
      if (sub.by instanceof Array) {
        return this.addMultiple(feature, sub, script, language);
      }
      return this.addLigature(feature, sub, script, language);
  }
  return void 0;
};
function isBrowser() {
  return typeof window !== "undefined";
}
function arrayBufferToNodeBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i36 = 0; i36 < buffer.length; ++i36) {
    buffer[i36] = view[i36];
  }
  return buffer;
}
function checkArgument(expression, message) {
  if (!expression) {
    throw message;
  }
}
function parseGlyphCoordinate(p28, flag, previousValue, shortVectorBitMask, sameBitMask) {
  var v22;
  if ((flag & shortVectorBitMask) > 0) {
    v22 = p28.parseByte();
    if ((flag & sameBitMask) === 0) {
      v22 = -v22;
    }
    v22 = previousValue + v22;
  } else {
    if ((flag & sameBitMask) > 0) {
      v22 = previousValue;
    } else {
      v22 = previousValue + p28.parseShort();
    }
  }
  return v22;
}
function parseGlyph(glyph, data, start) {
  var p28 = new parse.Parser(data, start);
  glyph.numberOfContours = p28.parseShort();
  glyph._xMin = p28.parseShort();
  glyph._yMin = p28.parseShort();
  glyph._xMax = p28.parseShort();
  glyph._yMax = p28.parseShort();
  var flags;
  var flag;
  if (glyph.numberOfContours > 0) {
    var endPointIndices = glyph.endPointIndices = [];
    for (var i36 = 0; i36 < glyph.numberOfContours; i36 += 1) {
      endPointIndices.push(p28.parseUShort());
    }
    glyph.instructionLength = p28.parseUShort();
    glyph.instructions = [];
    for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
      glyph.instructions.push(p28.parseByte());
    }
    var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
    flags = [];
    for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
      flag = p28.parseByte();
      flags.push(flag);
      if ((flag & 8) > 0) {
        var repeatCount = p28.parseByte();
        for (var j9 = 0; j9 < repeatCount; j9 += 1) {
          flags.push(flag);
          i$2 += 1;
        }
      }
    }
    check.argument(flags.length === numberOfCoordinates, "Bad flags.");
    if (endPointIndices.length > 0) {
      var points = [];
      var point;
      if (numberOfCoordinates > 0) {
        for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
          flag = flags[i$3];
          point = {};
          point.onCurve = !!(flag & 1);
          point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
          points.push(point);
        }
        var px = 0;
        for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
          flag = flags[i$4];
          point = points[i$4];
          point.x = parseGlyphCoordinate(p28, flag, px, 2, 16);
          px = point.x;
        }
        var py = 0;
        for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
          flag = flags[i$5];
          point = points[i$5];
          point.y = parseGlyphCoordinate(p28, flag, py, 4, 32);
          py = point.y;
        }
      }
      glyph.points = points;
    } else {
      glyph.points = [];
    }
  } else if (glyph.numberOfContours === 0) {
    glyph.points = [];
  } else {
    glyph.isComposite = true;
    glyph.points = [];
    glyph.components = [];
    var moreComponents = true;
    while (moreComponents) {
      flags = p28.parseUShort();
      var component = {
        glyphIndex: p28.parseUShort(),
        xScale: 1,
        scale01: 0,
        scale10: 0,
        yScale: 1,
        dx: 0,
        dy: 0
      };
      if ((flags & 1) > 0) {
        if ((flags & 2) > 0) {
          component.dx = p28.parseShort();
          component.dy = p28.parseShort();
        } else {
          component.matchedPoints = [p28.parseUShort(), p28.parseUShort()];
        }
      } else {
        if ((flags & 2) > 0) {
          component.dx = p28.parseChar();
          component.dy = p28.parseChar();
        } else {
          component.matchedPoints = [p28.parseByte(), p28.parseByte()];
        }
      }
      if ((flags & 8) > 0) {
        component.xScale = component.yScale = p28.parseF2Dot14();
      } else if ((flags & 64) > 0) {
        component.xScale = p28.parseF2Dot14();
        component.yScale = p28.parseF2Dot14();
      } else if ((flags & 128) > 0) {
        component.xScale = p28.parseF2Dot14();
        component.scale01 = p28.parseF2Dot14();
        component.scale10 = p28.parseF2Dot14();
        component.yScale = p28.parseF2Dot14();
      }
      glyph.components.push(component);
      moreComponents = !!(flags & 32);
    }
    if (flags & 256) {
      glyph.instructionLength = p28.parseUShort();
      glyph.instructions = [];
      for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
        glyph.instructions.push(p28.parseByte());
      }
    }
  }
}
function transformPoints(points, transform) {
  var newPoints = [];
  for (var i36 = 0; i36 < points.length; i36 += 1) {
    var pt = points[i36];
    var newPt = {
      x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
      y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
      onCurve: pt.onCurve,
      lastPointOfContour: pt.lastPointOfContour
    };
    newPoints.push(newPt);
  }
  return newPoints;
}
function getContours(points) {
  var contours = [];
  var currentContour = [];
  for (var i36 = 0; i36 < points.length; i36 += 1) {
    var pt = points[i36];
    currentContour.push(pt);
    if (pt.lastPointOfContour) {
      contours.push(currentContour);
      currentContour = [];
    }
  }
  check.argument(currentContour.length === 0, "There are still points left in the current contour.");
  return contours;
}
function getPath(points) {
  var p28 = new Path();
  if (!points) {
    return p28;
  }
  var contours = getContours(points);
  for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
    var contour = contours[contourIndex];
    var prev = null;
    var curr = contour[contour.length - 1];
    var next = contour[0];
    if (curr.onCurve) {
      p28.moveTo(curr.x, curr.y);
    } else {
      if (next.onCurve) {
        p28.moveTo(next.x, next.y);
      } else {
        var start = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
        p28.moveTo(start.x, start.y);
      }
    }
    for (var i36 = 0; i36 < contour.length; ++i36) {
      prev = curr;
      curr = next;
      next = contour[(i36 + 1) % contour.length];
      if (curr.onCurve) {
        p28.lineTo(curr.x, curr.y);
      } else {
        var prev2 = prev;
        var next2 = next;
        if (!prev.onCurve) {
          prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 };
        }
        if (!next.onCurve) {
          next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
        }
        p28.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
      }
    }
    p28.closePath();
  }
  return p28;
}
function buildPath(glyphs, glyph) {
  if (glyph.isComposite) {
    for (var j9 = 0; j9 < glyph.components.length; j9 += 1) {
      var component = glyph.components[j9];
      var componentGlyph = glyphs.get(component.glyphIndex);
      componentGlyph.getPath();
      if (componentGlyph.points) {
        var transformedPoints = void 0;
        if (component.matchedPoints === void 0) {
          transformedPoints = transformPoints(componentGlyph.points, component);
        } else {
          if (component.matchedPoints[0] > glyph.points.length - 1 || component.matchedPoints[1] > componentGlyph.points.length - 1) {
            throw Error("Matched points out of range in " + glyph.name);
          }
          var firstPt = glyph.points[component.matchedPoints[0]];
          var secondPt = componentGlyph.points[component.matchedPoints[1]];
          var transform = {
            xScale: component.xScale,
            scale01: component.scale01,
            scale10: component.scale10,
            yScale: component.yScale,
            dx: 0,
            dy: 0
          };
          secondPt = transformPoints([secondPt], transform)[0];
          transform.dx = firstPt.x - secondPt.x;
          transform.dy = firstPt.y - secondPt.y;
          transformedPoints = transformPoints(componentGlyph.points, transform);
        }
        glyph.points = glyph.points.concat(transformedPoints);
      }
    }
  }
  return getPath(glyph.points);
}
function parseGlyfTableAll(data, start, loca2, font) {
  var glyphs = new glyphset.GlyphSet(font);
  for (var i36 = 0; i36 < loca2.length - 1; i36 += 1) {
    var offset = loca2[i36];
    var nextOffset = loca2[i36 + 1];
    if (offset !== nextOffset) {
      glyphs.push(i36, glyphset.ttfGlyphLoader(font, i36, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i36, glyphset.glyphLoader(font, i36));
    }
  }
  return glyphs;
}
function parseGlyfTableOnLowMemory(data, start, loca2, font) {
  var glyphs = new glyphset.GlyphSet(font);
  font._push = function(i36) {
    var offset = loca2[i36];
    var nextOffset = loca2[i36 + 1];
    if (offset !== nextOffset) {
      glyphs.push(i36, glyphset.ttfGlyphLoader(font, i36, parseGlyph, data, start + offset, buildPath));
    } else {
      glyphs.push(i36, glyphset.glyphLoader(font, i36));
    }
  };
  return glyphs;
}
function parseGlyfTable(data, start, loca2, font, opt) {
  if (opt.lowMemory) {
    return parseGlyfTableOnLowMemory(data, start, loca2, font);
  } else {
    return parseGlyfTableAll(data, start, loca2, font);
  }
}
var glyf = { getPath, parse: parseGlyfTable };
var instructionTable;
var exec;
var execGlyph;
var execComponent;
function Hinting(font) {
  this.font = font;
  this.getCommands = function(hPoints) {
    return glyf.getPath(hPoints).commands;
  };
  this._fpgmState = this._prepState = void 0;
  this._errorState = 0;
}
function roundOff(v22) {
  return v22;
}
function roundToGrid(v22) {
  return Math.sign(v22) * Math.round(Math.abs(v22));
}
function roundToDoubleGrid(v22) {
  return Math.sign(v22) * Math.round(Math.abs(v22 * 2)) / 2;
}
function roundToHalfGrid(v22) {
  return Math.sign(v22) * (Math.round(Math.abs(v22) + 0.5) - 0.5);
}
function roundUpToGrid(v22) {
  return Math.sign(v22) * Math.ceil(Math.abs(v22));
}
function roundDownToGrid(v22) {
  return Math.sign(v22) * Math.floor(Math.abs(v22));
}
var roundSuper = function(v22) {
  var period = this.srPeriod;
  var phase = this.srPhase;
  var threshold = this.srThreshold;
  var sign = 1;
  if (v22 < 0) {
    v22 = -v22;
    sign = -1;
  }
  v22 += threshold - phase;
  v22 = Math.trunc(v22 / period) * period;
  v22 += phase;
  if (v22 < 0) {
    return phase * sign;
  }
  return v22 * sign;
};
var xUnitVector = {
  x: 1,
  y: 0,
  axis: "x",
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function(p1, p28, o1, o210) {
    return (o1 ? p1.xo : p1.x) - (o210 ? p28.xo : p28.x);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function(p28, rp1, rp2, pv) {
    var do1;
    var do2;
    var doa1;
    var doa2;
    var dm1;
    var dm2;
    var dt2;
    if (!pv || pv === this) {
      do1 = p28.xo - rp1.xo;
      do2 = p28.xo - rp2.xo;
      dm1 = rp1.x - rp1.xo;
      dm2 = rp2.x - rp2.xo;
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt2 = doa1 + doa2;
      if (dt2 === 0) {
        p28.x = p28.xo + (dm1 + dm2) / 2;
        return;
      }
      p28.x = p28.xo + (dm1 * doa2 + dm2 * doa1) / dt2;
      return;
    }
    do1 = pv.distance(p28, rp1, true, true);
    do2 = pv.distance(p28, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt2 = doa1 + doa2;
    if (dt2 === 0) {
      xUnitVector.setRelative(p28, p28, (dm1 + dm2) / 2, pv, true);
      return;
    }
    xUnitVector.setRelative(p28, p28, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
  },
  // Slope of line normal to this
  normalSlope: Number.NEGATIVE_INFINITY,
  // Sets the point 'p' relative to point 'rp'
  // by the distance 'd'.
  //
  // See APPENDIX on SETRELATIVE at the bottom of this file.
  //
  // p   ... point to set
  // rp  ... reference point
  // d   ... distance on projection vector
  // pv  ... projection vector (undefined = this)
  // org ... if true, uses the original position of rp as reference.
  setRelative: function(p28, rp, d24, pv, org) {
    if (!pv || pv === this) {
      p28.x = (org ? rp.xo : rp.x) + d24;
      return;
    }
    var rpx = org ? rp.xo : rp.x;
    var rpy = org ? rp.yo : rp.y;
    var rpdx = rpx + d24 * pv.x;
    var rpdy = rpy + d24 * pv.y;
    p28.x = rpdx + (p28.y - rpdy) / pv.normalSlope;
  },
  // Slope of vector line.
  slope: 0,
  // Touches the point p.
  touch: function(p28) {
    p28.xTouched = true;
  },
  // Tests if a point p is touched.
  touched: function(p28) {
    return p28.xTouched;
  },
  // Untouches the point p.
  untouch: function(p28) {
    p28.xTouched = false;
  }
};
var yUnitVector = {
  x: 0,
  y: 1,
  axis: "y",
  // Gets the projected distance between two points.
  // o1/o2 ... if true, respective original position is used.
  distance: function(p1, p28, o1, o210) {
    return (o1 ? p1.yo : p1.y) - (o210 ? p28.yo : p28.y);
  },
  // Moves point p so the moved position has the same relative
  // position to the moved positions of rp1 and rp2 than the
  // original positions had.
  //
  // See APPENDIX on INTERPOLATE at the bottom of this file.
  interpolate: function(p28, rp1, rp2, pv) {
    var do1;
    var do2;
    var doa1;
    var doa2;
    var dm1;
    var dm2;
    var dt2;
    if (!pv || pv === this) {
      do1 = p28.yo - rp1.yo;
      do2 = p28.yo - rp2.yo;
      dm1 = rp1.y - rp1.yo;
      dm2 = rp2.y - rp2.yo;
      doa1 = Math.abs(do1);
      doa2 = Math.abs(do2);
      dt2 = doa1 + doa2;
      if (dt2 === 0) {
        p28.y = p28.yo + (dm1 + dm2) / 2;
        return;
      }
      p28.y = p28.yo + (dm1 * doa2 + dm2 * doa1) / dt2;
      return;
    }
    do1 = pv.distance(p28, rp1, true, true);
    do2 = pv.distance(p28, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt2 = doa1 + doa2;
    if (dt2 === 0) {
      yUnitVector.setRelative(p28, p28, (dm1 + dm2) / 2, pv, true);
      return;
    }
    yUnitVector.setRelative(p28, p28, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
  },
  // Slope of line normal to this.
  normalSlope: 0,
  // Sets the point 'p' relative to point 'rp'
  // by the distance 'd'
  //
  // See APPENDIX on SETRELATIVE at the bottom of this file.
  //
  // p   ... point to set
  // rp  ... reference point
  // d   ... distance on projection vector
  // pv  ... projection vector (undefined = this)
  // org ... if true, uses the original position of rp as reference.
  setRelative: function(p28, rp, d24, pv, org) {
    if (!pv || pv === this) {
      p28.y = (org ? rp.yo : rp.y) + d24;
      return;
    }
    var rpx = org ? rp.xo : rp.x;
    var rpy = org ? rp.yo : rp.y;
    var rpdx = rpx + d24 * pv.x;
    var rpdy = rpy + d24 * pv.y;
    p28.y = rpdy + pv.normalSlope * (p28.x - rpdx);
  },
  // Slope of vector line.
  slope: Number.POSITIVE_INFINITY,
  // Touches the point p.
  touch: function(p28) {
    p28.yTouched = true;
  },
  // Tests if a point p is touched.
  touched: function(p28) {
    return p28.yTouched;
  },
  // Untouches the point p.
  untouch: function(p28) {
    p28.yTouched = false;
  }
};
Object.freeze(xUnitVector);
Object.freeze(yUnitVector);
function UnitVector(x19, y22) {
  this.x = x19;
  this.y = y22;
  this.axis = void 0;
  this.slope = y22 / x19;
  this.normalSlope = -x19 / y22;
  Object.freeze(this);
}
UnitVector.prototype.distance = function(p1, p28, o1, o210) {
  return this.x * xUnitVector.distance(p1, p28, o1, o210) + this.y * yUnitVector.distance(p1, p28, o1, o210);
};
UnitVector.prototype.interpolate = function(p28, rp1, rp2, pv) {
  var dm1;
  var dm2;
  var do1;
  var do2;
  var doa1;
  var doa2;
  var dt2;
  do1 = pv.distance(p28, rp1, true, true);
  do2 = pv.distance(p28, rp2, true, true);
  dm1 = pv.distance(rp1, rp1, false, true);
  dm2 = pv.distance(rp2, rp2, false, true);
  doa1 = Math.abs(do1);
  doa2 = Math.abs(do2);
  dt2 = doa1 + doa2;
  if (dt2 === 0) {
    this.setRelative(p28, p28, (dm1 + dm2) / 2, pv, true);
    return;
  }
  this.setRelative(p28, p28, (dm1 * doa2 + dm2 * doa1) / dt2, pv, true);
};
UnitVector.prototype.setRelative = function(p28, rp, d24, pv, org) {
  pv = pv || this;
  var rpx = org ? rp.xo : rp.x;
  var rpy = org ? rp.yo : rp.y;
  var rpdx = rpx + d24 * pv.x;
  var rpdy = rpy + d24 * pv.y;
  var pvns = pv.normalSlope;
  var fvs = this.slope;
  var px = p28.x;
  var py = p28.y;
  p28.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
  p28.y = fvs * (p28.x - px) + py;
};
UnitVector.prototype.touch = function(p28) {
  p28.xTouched = true;
  p28.yTouched = true;
};
function getUnitVector(x19, y22) {
  var d24 = Math.sqrt(x19 * x19 + y22 * y22);
  x19 /= d24;
  y22 /= d24;
  if (x19 === 1 && y22 === 0) {
    return xUnitVector;
  } else if (x19 === 0 && y22 === 1) {
    return yUnitVector;
  } else {
    return new UnitVector(x19, y22);
  }
}
function HPoint(x19, y22, lastPointOfContour, onCurve) {
  this.x = this.xo = Math.round(x19 * 64) / 64;
  this.y = this.yo = Math.round(y22 * 64) / 64;
  this.lastPointOfContour = lastPointOfContour;
  this.onCurve = onCurve;
  this.prevPointOnContour = void 0;
  this.nextPointOnContour = void 0;
  this.xTouched = false;
  this.yTouched = false;
  Object.preventExtensions(this);
}
HPoint.prototype.nextTouched = function(v22) {
  var p28 = this.nextPointOnContour;
  while (!v22.touched(p28) && p28 !== this) {
    p28 = p28.nextPointOnContour;
  }
  return p28;
};
HPoint.prototype.prevTouched = function(v22) {
  var p28 = this.prevPointOnContour;
  while (!v22.touched(p28) && p28 !== this) {
    p28 = p28.prevPointOnContour;
  }
  return p28;
};
var HPZero = Object.freeze(new HPoint(0, 0));
var defaultState = {
  cvCutIn: 17 / 16,
  // control value cut in
  deltaBase: 9,
  deltaShift: 0.125,
  loop: 1,
  // loops some instructions
  minDis: 1,
  // minimum distance
  autoFlip: true
};
function State(env, prog) {
  this.env = env;
  this.stack = [];
  this.prog = prog;
  switch (env) {
    case "glyf":
      this.zp0 = this.zp1 = this.zp2 = 1;
      this.rp0 = this.rp1 = this.rp2 = 0;
    /* fall through */
    case "prep":
      this.fv = this.pv = this.dpv = xUnitVector;
      this.round = roundToGrid;
  }
}
Hinting.prototype.exec = function(glyph, ppem) {
  if (typeof ppem !== "number") {
    throw new Error("Point size is not a number!");
  }
  if (this._errorState > 2) {
    return;
  }
  var font = this.font;
  var prepState = this._prepState;
  if (!prepState || prepState.ppem !== ppem) {
    var fpgmState = this._fpgmState;
    if (!fpgmState) {
      State.prototype = defaultState;
      fpgmState = this._fpgmState = new State("fpgm", font.tables.fpgm);
      fpgmState.funcs = [];
      fpgmState.font = font;
      if (exports.DEBUG) {
        console.log("---EXEC FPGM---");
        fpgmState.step = -1;
      }
      try {
        exec(fpgmState);
      } catch (e29) {
        console.log("Hinting error in FPGM:" + e29);
        this._errorState = 3;
        return;
      }
    }
    State.prototype = fpgmState;
    prepState = this._prepState = new State("prep", font.tables.prep);
    prepState.ppem = ppem;
    var oCvt = font.tables.cvt;
    if (oCvt) {
      var cvt = prepState.cvt = new Array(oCvt.length);
      var scale = ppem / font.unitsPerEm;
      for (var c30 = 0; c30 < oCvt.length; c30++) {
        cvt[c30] = oCvt[c30] * scale;
      }
    } else {
      prepState.cvt = [];
    }
    if (exports.DEBUG) {
      console.log("---EXEC PREP---");
      prepState.step = -1;
    }
    try {
      exec(prepState);
    } catch (e29) {
      if (this._errorState < 2) {
        console.log("Hinting error in PREP:" + e29);
      }
      this._errorState = 2;
    }
  }
  if (this._errorState > 1) {
    return;
  }
  try {
    return execGlyph(glyph, prepState);
  } catch (e29) {
    if (this._errorState < 1) {
      console.log("Hinting error:" + e29);
      console.log("Note: further hinting errors are silenced");
    }
    this._errorState = 1;
    return void 0;
  }
};
execGlyph = function(glyph, prepState) {
  var xScale = prepState.ppem / prepState.font.unitsPerEm;
  var yScale = xScale;
  var components = glyph.components;
  var contours;
  var gZone;
  var state;
  State.prototype = prepState;
  if (!components) {
    state = new State("glyf", glyph.instructions);
    if (exports.DEBUG) {
      console.log("---EXEC GLYPH---");
      state.step = -1;
    }
    execComponent(glyph, state, xScale, yScale);
    gZone = state.gZone;
  } else {
    var font = prepState.font;
    gZone = [];
    contours = [];
    for (var i36 = 0; i36 < components.length; i36++) {
      var c30 = components[i36];
      var cg = font.glyphs.get(c30.glyphIndex);
      state = new State("glyf", cg.instructions);
      if (exports.DEBUG) {
        console.log("---EXEC COMP " + i36 + "---");
        state.step = -1;
      }
      execComponent(cg, state, xScale, yScale);
      var dx = Math.round(c30.dx * xScale);
      var dy = Math.round(c30.dy * yScale);
      var gz = state.gZone;
      var cc = state.contours;
      for (var pi = 0; pi < gz.length; pi++) {
        var p28 = gz[pi];
        p28.xTouched = p28.yTouched = false;
        p28.xo = p28.x = p28.x + dx;
        p28.yo = p28.y = p28.y + dy;
      }
      var gLen = gZone.length;
      gZone.push.apply(gZone, gz);
      for (var j9 = 0; j9 < cc.length; j9++) {
        contours.push(cc[j9] + gLen);
      }
    }
    if (glyph.instructions && !state.inhibitGridFit) {
      state = new State("glyf", glyph.instructions);
      state.gZone = state.z0 = state.z1 = state.z2 = gZone;
      state.contours = contours;
      gZone.push(
        new HPoint(0, 0),
        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
      );
      if (exports.DEBUG) {
        console.log("---EXEC COMPOSITE---");
        state.step = -1;
      }
      exec(state);
      gZone.length -= 2;
    }
  }
  return gZone;
};
execComponent = function(glyph, state, xScale, yScale) {
  var points = glyph.points || [];
  var pLen = points.length;
  var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
  var contours = state.contours = [];
  var cp;
  for (var i36 = 0; i36 < pLen; i36++) {
    cp = points[i36];
    gZone[i36] = new HPoint(
      cp.x * xScale,
      cp.y * yScale,
      cp.lastPointOfContour,
      cp.onCurve
    );
  }
  var sp;
  var np;
  for (var i$1 = 0; i$1 < pLen; i$1++) {
    cp = gZone[i$1];
    if (!sp) {
      sp = cp;
      contours.push(i$1);
    }
    if (cp.lastPointOfContour) {
      cp.nextPointOnContour = sp;
      sp.prevPointOnContour = cp;
      sp = void 0;
    } else {
      np = gZone[i$1 + 1];
      cp.nextPointOnContour = np;
      np.prevPointOnContour = cp;
    }
  }
  if (state.inhibitGridFit) {
    return;
  }
  if (exports.DEBUG) {
    console.log("PROCESSING GLYPH", state.stack);
    for (var i$2 = 0; i$2 < pLen; i$2++) {
      console.log(i$2, gZone[i$2].x, gZone[i$2].y);
    }
  }
  gZone.push(
    new HPoint(0, 0),
    new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
  );
  exec(state);
  gZone.length -= 2;
  if (exports.DEBUG) {
    console.log("FINISHED GLYPH", state.stack);
    for (var i$3 = 0; i$3 < pLen; i$3++) {
      console.log(i$3, gZone[i$3].x, gZone[i$3].y);
    }
  }
};
exec = function(state) {
  var prog = state.prog;
  if (!prog) {
    return;
  }
  var pLen = prog.length;
  var ins;
  for (state.ip = 0; state.ip < pLen; state.ip++) {
    if (exports.DEBUG) {
      state.step++;
    }
    ins = instructionTable[prog[state.ip]];
    if (!ins) {
      throw new Error(
        "unknown instruction: 0x" + Number(prog[state.ip]).toString(16)
      );
    }
    ins(state);
  }
};
function initTZone(state) {
  var tZone = state.tZone = new Array(state.gZone.length);
  for (var i36 = 0; i36 < tZone.length; i36++) {
    tZone[i36] = new HPoint(0, 0);
  }
}
function skip(state, handleElse) {
  var prog = state.prog;
  var ip = state.ip;
  var nesting = 1;
  var ins;
  do {
    ins = prog[++ip];
    if (ins === 88) {
      nesting++;
    } else if (ins === 89) {
      nesting--;
    } else if (ins === 64) {
      ip += prog[ip + 1] + 1;
    } else if (ins === 65) {
      ip += 2 * prog[ip + 1] + 1;
    } else if (ins >= 176 && ins <= 183) {
      ip += ins - 176 + 1;
    } else if (ins >= 184 && ins <= 191) {
      ip += (ins - 184 + 1) * 2;
    } else if (handleElse && nesting === 1 && ins === 27) {
      break;
    }
  } while (nesting > 0);
  state.ip = ip;
}
function SVTCA(v22, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SVTCA[" + v22.axis + "]");
  }
  state.fv = state.pv = state.dpv = v22;
}
function SPVTCA(v22, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SPVTCA[" + v22.axis + "]");
  }
  state.pv = state.dpv = v22;
}
function SFVTCA(v22, state) {
  if (exports.DEBUG) {
    console.log(state.step, "SFVTCA[" + v22.axis + "]");
  }
  state.fv = v22;
}
function SPVTL(a34, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p28 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log("SPVTL[" + a34 + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a34) {
    dx = p1.x - p28.x;
    dy = p1.y - p28.y;
  } else {
    dx = p28.y - p1.y;
    dy = p1.x - p28.x;
  }
  state.pv = state.dpv = getUnitVector(dx, dy);
}
function SFVTL(a34, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p28 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log("SFVTL[" + a34 + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a34) {
    dx = p1.x - p28.x;
    dy = p1.y - p28.y;
  } else {
    dx = p28.y - p1.y;
    dy = p1.x - p28.x;
  }
  state.fv = getUnitVector(dx, dy);
}
function SPVFS(state) {
  var stack = state.stack;
  var y22 = stack.pop();
  var x19 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SPVFS[]", y22, x19);
  }
  state.pv = state.dpv = getUnitVector(x19, y22);
}
function SFVFS(state) {
  var stack = state.stack;
  var y22 = stack.pop();
  var x19 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SPVFS[]", y22, x19);
  }
  state.fv = getUnitVector(x19, y22);
}
function GPV(state) {
  var stack = state.stack;
  var pv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "GPV[]");
  }
  stack.push(pv.x * 16384);
  stack.push(pv.y * 16384);
}
function GFV(state) {
  var stack = state.stack;
  var fv = state.fv;
  if (exports.DEBUG) {
    console.log(state.step, "GFV[]");
  }
  stack.push(fv.x * 16384);
  stack.push(fv.y * 16384);
}
function SFVTPV(state) {
  state.fv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "SFVTPV[]");
  }
}
function ISECT(state) {
  var stack = state.stack;
  var pa0i = stack.pop();
  var pa1i = stack.pop();
  var pb0i = stack.pop();
  var pb1i = stack.pop();
  var pi = stack.pop();
  var z0 = state.z0;
  var z1 = state.z1;
  var pa0 = z0[pa0i];
  var pa1 = z0[pa1i];
  var pb0 = z1[pb0i];
  var pb1 = z1[pb1i];
  var p28 = state.z2[pi];
  if (exports.DEBUG) {
    console.log("ISECT[], ", pa0i, pa1i, pb0i, pb1i, pi);
  }
  var x1 = pa0.x;
  var y1 = pa0.y;
  var x22 = pa1.x;
  var y22 = pa1.y;
  var x32 = pb0.x;
  var y32 = pb0.y;
  var x42 = pb1.x;
  var y42 = pb1.y;
  var div = (x1 - x22) * (y32 - y42) - (y1 - y22) * (x32 - x42);
  var f1 = x1 * y22 - y1 * x22;
  var f26 = x32 * y42 - y32 * x42;
  p28.x = (f1 * (x32 - x42) - f26 * (x1 - x22)) / div;
  p28.y = (f1 * (y32 - y42) - f26 * (y1 - y22)) / div;
}
function SRP0(state) {
  state.rp0 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP0[]", state.rp0);
  }
}
function SRP1(state) {
  state.rp1 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP1[]", state.rp1);
  }
}
function SRP2(state) {
  state.rp2 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SRP2[]", state.rp2);
  }
}
function SZP0(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP0[]", n39);
  }
  state.zp0 = n39;
  switch (n39) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z0 = state.tZone;
      break;
    case 1:
      state.z0 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZP1(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP1[]", n39);
  }
  state.zp1 = n39;
  switch (n39) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z1 = state.tZone;
      break;
    case 1:
      state.z1 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZP2(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZP2[]", n39);
  }
  state.zp2 = n39;
  switch (n39) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z2 = state.tZone;
      break;
    case 1:
      state.z2 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SZPS(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SZPS[]", n39);
  }
  state.zp0 = state.zp1 = state.zp2 = n39;
  switch (n39) {
    case 0:
      if (!state.tZone) {
        initTZone(state);
      }
      state.z0 = state.z1 = state.z2 = state.tZone;
      break;
    case 1:
      state.z0 = state.z1 = state.z2 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone pointer");
  }
}
function SLOOP(state) {
  state.loop = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SLOOP[]", state.loop);
  }
}
function RTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTG[]");
  }
  state.round = roundToGrid;
}
function RTHG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTHG[]");
  }
  state.round = roundToHalfGrid;
}
function SMD(state) {
  var d24 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SMD[]", d24);
  }
  state.minDis = d24 / 64;
}
function ELSE(state) {
  if (exports.DEBUG) {
    console.log(state.step, "ELSE[]");
  }
  skip(state, false);
}
function JMPR(state) {
  var o34 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "JMPR[]", o34);
  }
  state.ip += o34 - 1;
}
function SCVTCI(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCVTCI[]", n39);
  }
  state.cvCutIn = n39 / 64;
}
function DUP(state) {
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.step, "DUP[]");
  }
  stack.push(stack[stack.length - 1]);
}
function POP(state) {
  if (exports.DEBUG) {
    console.log(state.step, "POP[]");
  }
  state.stack.pop();
}
function CLEAR(state) {
  if (exports.DEBUG) {
    console.log(state.step, "CLEAR[]");
  }
  state.stack.length = 0;
}
function SWAP(state) {
  var stack = state.stack;
  var a34 = stack.pop();
  var b20 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SWAP[]");
  }
  stack.push(a34);
  stack.push(b20);
}
function DEPTH(state) {
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.step, "DEPTH[]");
  }
  stack.push(stack.length);
}
function LOOPCALL(state) {
  var stack = state.stack;
  var fn = stack.pop();
  var c30 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LOOPCALL[]", fn, c30);
  }
  var cip = state.ip;
  var cprog = state.prog;
  state.prog = state.funcs[fn];
  for (var i36 = 0; i36 < c30; i36++) {
    exec(state);
    if (exports.DEBUG) {
      console.log(
        ++state.step,
        i36 + 1 < c30 ? "next loopcall" : "done loopcall",
        i36
      );
    }
  }
  state.ip = cip;
  state.prog = cprog;
}
function CALL(state) {
  var fn = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CALL[]", fn);
  }
  var cip = state.ip;
  var cprog = state.prog;
  state.prog = state.funcs[fn];
  exec(state);
  state.ip = cip;
  state.prog = cprog;
  if (exports.DEBUG) {
    console.log(++state.step, "returning from", fn);
  }
}
function CINDEX(state) {
  var stack = state.stack;
  var k11 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CINDEX[]", k11);
  }
  stack.push(stack[stack.length - k11]);
}
function MINDEX(state) {
  var stack = state.stack;
  var k11 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MINDEX[]", k11);
  }
  stack.push(stack.splice(stack.length - k11, 1)[0]);
}
function FDEF(state) {
  if (state.env !== "fpgm") {
    throw new Error("FDEF not allowed here");
  }
  var stack = state.stack;
  var prog = state.prog;
  var ip = state.ip;
  var fn = stack.pop();
  var ipBegin = ip;
  if (exports.DEBUG) {
    console.log(state.step, "FDEF[]", fn);
  }
  while (prog[++ip] !== 45) {
  }
  state.ip = ip;
  state.funcs[fn] = prog.slice(ipBegin + 1, ip);
}
function MDAP(round, state) {
  var pi = state.stack.pop();
  var p28 = state.z0[pi];
  var fv = state.fv;
  var pv = state.pv;
  if (exports.DEBUG) {
    console.log(state.step, "MDAP[" + round + "]", pi);
  }
  var d24 = pv.distance(p28, HPZero);
  if (round) {
    d24 = state.round(d24);
  }
  fv.setRelative(p28, HPZero, d24, pv);
  fv.touch(p28);
  state.rp0 = state.rp1 = pi;
}
function IUP(v22, state) {
  var z22 = state.z2;
  var pLen = z22.length - 2;
  var cp;
  var pp;
  var np;
  if (exports.DEBUG) {
    console.log(state.step, "IUP[" + v22.axis + "]");
  }
  for (var i36 = 0; i36 < pLen; i36++) {
    cp = z22[i36];
    if (v22.touched(cp)) {
      continue;
    }
    pp = cp.prevTouched(v22);
    if (pp === cp) {
      continue;
    }
    np = cp.nextTouched(v22);
    if (pp === np) {
      v22.setRelative(cp, cp, v22.distance(pp, pp, false, true), v22, true);
    }
    v22.interpolate(cp, pp, np, v22);
  }
}
function SHP(a34, state) {
  var stack = state.stack;
  var rpi = a34 ? state.rp1 : state.rp2;
  var rp = (a34 ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var loop = state.loop;
  var z22 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p28 = z22[pi];
    var d24 = pv.distance(rp, rp, false, true);
    fv.setRelative(p28, p28, d24, pv);
    fv.touch(p28);
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHP[" + (a34 ? "rp1" : "rp2") + "]",
        pi
      );
    }
  }
  state.loop = 1;
}
function SHC(a34, state) {
  var stack = state.stack;
  var rpi = a34 ? state.rp1 : state.rp2;
  var rp = (a34 ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var ci = stack.pop();
  var sp = state.z2[state.contours[ci]];
  var p28 = sp;
  if (exports.DEBUG) {
    console.log(state.step, "SHC[" + a34 + "]", ci);
  }
  var d24 = pv.distance(rp, rp, false, true);
  do {
    if (p28 !== rp) {
      fv.setRelative(p28, p28, d24, pv);
    }
    p28 = p28.nextPointOnContour;
  } while (p28 !== sp);
}
function SHZ(a34, state) {
  var stack = state.stack;
  var rpi = a34 ? state.rp1 : state.rp2;
  var rp = (a34 ? state.z0 : state.z1)[rpi];
  var fv = state.fv;
  var pv = state.pv;
  var e29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SHZ[" + a34 + "]", e29);
  }
  var z4;
  switch (e29) {
    case 0:
      z4 = state.tZone;
      break;
    case 1:
      z4 = state.gZone;
      break;
    default:
      throw new Error("Invalid zone");
  }
  var p28;
  var d24 = pv.distance(rp, rp, false, true);
  var pLen = z4.length - 2;
  for (var i36 = 0; i36 < pLen; i36++) {
    p28 = z4[i36];
    fv.setRelative(p28, p28, d24, pv);
  }
}
function SHPIX(state) {
  var stack = state.stack;
  var loop = state.loop;
  var fv = state.fv;
  var d24 = stack.pop() / 64;
  var z22 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p28 = z22[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "SHPIX[]",
        pi,
        d24
      );
    }
    fv.setRelative(p28, p28, d24);
    fv.touch(p28);
  }
  state.loop = 1;
}
function IP(state) {
  var stack = state.stack;
  var rp1i = state.rp1;
  var rp2i = state.rp2;
  var loop = state.loop;
  var rp1 = state.z0[rp1i];
  var rp2 = state.z1[rp2i];
  var fv = state.fv;
  var pv = state.dpv;
  var z22 = state.z2;
  while (loop--) {
    var pi = stack.pop();
    var p28 = z22[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "IP[]",
        pi,
        rp1i,
        "<->",
        rp2i
      );
    }
    fv.interpolate(p28, rp1, rp2, pv);
    fv.touch(p28);
  }
  state.loop = 1;
}
function MSIRP(a34, state) {
  var stack = state.stack;
  var d24 = stack.pop() / 64;
  var pi = stack.pop();
  var p28 = state.z1[pi];
  var rp0 = state.z0[state.rp0];
  var fv = state.fv;
  var pv = state.pv;
  fv.setRelative(p28, rp0, d24, pv);
  fv.touch(p28);
  if (exports.DEBUG) {
    console.log(state.step, "MSIRP[" + a34 + "]", d24, pi);
  }
  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (a34) {
    state.rp0 = pi;
  }
}
function ALIGNRP(state) {
  var stack = state.stack;
  var rp0i = state.rp0;
  var rp0 = state.z0[rp0i];
  var loop = state.loop;
  var fv = state.fv;
  var pv = state.pv;
  var z1 = state.z1;
  while (loop--) {
    var pi = stack.pop();
    var p28 = z1[pi];
    if (exports.DEBUG) {
      console.log(
        state.step,
        (state.loop > 1 ? "loop " + (state.loop - loop) + ": " : "") + "ALIGNRP[]",
        pi
      );
    }
    fv.setRelative(p28, rp0, 0, pv);
    fv.touch(p28);
  }
  state.loop = 1;
}
function RTDG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RTDG[]");
  }
  state.round = roundToDoubleGrid;
}
function MIAP(round, state) {
  var stack = state.stack;
  var n39 = stack.pop();
  var pi = stack.pop();
  var p28 = state.z0[pi];
  var fv = state.fv;
  var pv = state.pv;
  var cv = state.cvt[n39];
  if (exports.DEBUG) {
    console.log(
      state.step,
      "MIAP[" + round + "]",
      n39,
      "(",
      cv,
      ")",
      pi
    );
  }
  var d24 = pv.distance(p28, HPZero);
  if (round) {
    if (Math.abs(d24 - cv) < state.cvCutIn) {
      d24 = cv;
    }
    d24 = state.round(d24);
  }
  fv.setRelative(p28, HPZero, d24, pv);
  if (state.zp0 === 0) {
    p28.xo = p28.x;
    p28.yo = p28.y;
  }
  fv.touch(p28);
  state.rp0 = state.rp1 = pi;
}
function NPUSHB(state) {
  var prog = state.prog;
  var ip = state.ip;
  var stack = state.stack;
  var n39 = prog[++ip];
  if (exports.DEBUG) {
    console.log(state.step, "NPUSHB[]", n39);
  }
  for (var i36 = 0; i36 < n39; i36++) {
    stack.push(prog[++ip]);
  }
  state.ip = ip;
}
function NPUSHW(state) {
  var ip = state.ip;
  var prog = state.prog;
  var stack = state.stack;
  var n39 = prog[++ip];
  if (exports.DEBUG) {
    console.log(state.step, "NPUSHW[]", n39);
  }
  for (var i36 = 0; i36 < n39; i36++) {
    var w15 = prog[++ip] << 8 | prog[++ip];
    if (w15 & 32768) {
      w15 = -((w15 ^ 65535) + 1);
    }
    stack.push(w15);
  }
  state.ip = ip;
}
function WS(state) {
  var stack = state.stack;
  var store = state.store;
  if (!store) {
    store = state.store = [];
  }
  var v22 = stack.pop();
  var l29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WS", v22, l29);
  }
  store[l29] = v22;
}
function RS(state) {
  var stack = state.stack;
  var store = state.store;
  var l29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "RS", l29);
  }
  var v22 = store && store[l29] || 0;
  stack.push(v22);
}
function WCVTP(state) {
  var stack = state.stack;
  var v22 = stack.pop();
  var l29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WCVTP", v22, l29);
  }
  state.cvt[l29] = v22 / 64;
}
function RCVT(state) {
  var stack = state.stack;
  var cvte = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "RCVT", cvte);
  }
  stack.push(state.cvt[cvte] * 64);
}
function GC(a34, state) {
  var stack = state.stack;
  var pi = stack.pop();
  var p28 = state.z2[pi];
  if (exports.DEBUG) {
    console.log(state.step, "GC[" + a34 + "]", pi);
  }
  stack.push(state.dpv.distance(p28, HPZero, a34, false) * 64);
}
function MD(a34, state) {
  var stack = state.stack;
  var pi2 = stack.pop();
  var pi1 = stack.pop();
  var p28 = state.z1[pi2];
  var p1 = state.z0[pi1];
  var d24 = state.dpv.distance(p1, p28, a34, a34);
  if (exports.DEBUG) {
    console.log(state.step, "MD[" + a34 + "]", pi2, pi1, "->", d24);
  }
  state.stack.push(Math.round(d24 * 64));
}
function MPPEM(state) {
  if (exports.DEBUG) {
    console.log(state.step, "MPPEM[]");
  }
  state.stack.push(state.ppem);
}
function FLIPON(state) {
  if (exports.DEBUG) {
    console.log(state.step, "FLIPON[]");
  }
  state.autoFlip = true;
}
function LT(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LT[]", e29, e1);
  }
  stack.push(e1 < e29 ? 1 : 0);
}
function LTEQ(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "LTEQ[]", e29, e1);
  }
  stack.push(e1 <= e29 ? 1 : 0);
}
function GT(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "GT[]", e29, e1);
  }
  stack.push(e1 > e29 ? 1 : 0);
}
function GTEQ(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "GTEQ[]", e29, e1);
  }
  stack.push(e1 >= e29 ? 1 : 0);
}
function EQ(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "EQ[]", e29, e1);
  }
  stack.push(e29 === e1 ? 1 : 0);
}
function NEQ(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NEQ[]", e29, e1);
  }
  stack.push(e29 !== e1 ? 1 : 0);
}
function ODD(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ODD[]", n39);
  }
  stack.push(Math.trunc(n39) % 2 ? 1 : 0);
}
function EVEN(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "EVEN[]", n39);
  }
  stack.push(Math.trunc(n39) % 2 ? 0 : 1);
}
function IF(state) {
  var test = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "IF[]", test);
  }
  if (!test) {
    skip(state, true);
    if (exports.DEBUG) {
      console.log(state.step, "EIF[]");
    }
  }
}
function EIF(state) {
  if (exports.DEBUG) {
    console.log(state.step, "EIF[]");
  }
}
function AND(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "AND[]", e29, e1);
  }
  stack.push(e29 && e1 ? 1 : 0);
}
function OR(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "OR[]", e29, e1);
  }
  stack.push(e29 || e1 ? 1 : 0);
}
function NOT(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NOT[]", e29);
  }
  stack.push(e29 ? 0 : 1);
}
function DELTAP123(b20, state) {
  var stack = state.stack;
  var n39 = stack.pop();
  var fv = state.fv;
  var pv = state.pv;
  var ppem = state.ppem;
  var base = state.deltaBase + (b20 - 1) * 16;
  var ds = state.deltaShift;
  var z0 = state.z0;
  if (exports.DEBUG) {
    console.log(state.step, "DELTAP[" + b20 + "]", n39, stack);
  }
  for (var i36 = 0; i36 < n39; i36++) {
    var pi = stack.pop();
    var arg = stack.pop();
    var appem = base + ((arg & 240) >> 4);
    if (appem !== ppem) {
      continue;
    }
    var mag = (arg & 15) - 8;
    if (mag >= 0) {
      mag++;
    }
    if (exports.DEBUG) {
      console.log(state.step, "DELTAPFIX", pi, "by", mag * ds);
    }
    var p28 = z0[pi];
    fv.setRelative(p28, p28, mag * ds, pv);
  }
}
function SDB(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SDB[]", n39);
  }
  state.deltaBase = n39;
}
function SDS(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SDS[]", n39);
  }
  state.deltaShift = Math.pow(0.5, n39);
}
function ADD(state) {
  var stack = state.stack;
  var n210 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ADD[]", n210, n1);
  }
  stack.push(n1 + n210);
}
function SUB(state) {
  var stack = state.stack;
  var n210 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SUB[]", n210, n1);
  }
  stack.push(n1 - n210);
}
function DIV(state) {
  var stack = state.stack;
  var n210 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "DIV[]", n210, n1);
  }
  stack.push(n1 * 64 / n210);
}
function MUL(state) {
  var stack = state.stack;
  var n210 = stack.pop();
  var n1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MUL[]", n210, n1);
  }
  stack.push(n1 * n210 / 64);
}
function ABS(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ABS[]", n39);
  }
  stack.push(Math.abs(n39));
}
function NEG(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "NEG[]", n39);
  }
  stack.push(-n39);
}
function FLOOR(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "FLOOR[]", n39);
  }
  stack.push(Math.floor(n39 / 64) * 64);
}
function CEILING(state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "CEILING[]", n39);
  }
  stack.push(Math.ceil(n39 / 64) * 64);
}
function ROUND(dt2, state) {
  var stack = state.stack;
  var n39 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ROUND[]");
  }
  stack.push(state.round(n39 / 64) * 64);
}
function WCVTF(state) {
  var stack = state.stack;
  var v22 = stack.pop();
  var l29 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "WCVTF[]", v22, l29);
  }
  state.cvt[l29] = v22 * state.ppem / state.font.unitsPerEm;
}
function DELTAC123(b20, state) {
  var stack = state.stack;
  var n39 = stack.pop();
  var ppem = state.ppem;
  var base = state.deltaBase + (b20 - 1) * 16;
  var ds = state.deltaShift;
  if (exports.DEBUG) {
    console.log(state.step, "DELTAC[" + b20 + "]", n39, stack);
  }
  for (var i36 = 0; i36 < n39; i36++) {
    var c30 = stack.pop();
    var arg = stack.pop();
    var appem = base + ((arg & 240) >> 4);
    if (appem !== ppem) {
      continue;
    }
    var mag = (arg & 15) - 8;
    if (mag >= 0) {
      mag++;
    }
    var delta = mag * ds;
    if (exports.DEBUG) {
      console.log(state.step, "DELTACFIX", c30, "by", delta);
    }
    state.cvt[c30] += delta;
  }
}
function SROUND(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SROUND[]", n39);
  }
  state.round = roundSuper;
  var period;
  switch (n39 & 192) {
    case 0:
      period = 0.5;
      break;
    case 64:
      period = 1;
      break;
    case 128:
      period = 2;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  state.srPeriod = period;
  switch (n39 & 48) {
    case 0:
      state.srPhase = 0;
      break;
    case 16:
      state.srPhase = 0.25 * period;
      break;
    case 32:
      state.srPhase = 0.5 * period;
      break;
    case 48:
      state.srPhase = 0.75 * period;
      break;
    default:
      throw new Error("invalid SROUND value");
  }
  n39 &= 15;
  if (n39 === 0) {
    state.srThreshold = 0;
  } else {
    state.srThreshold = (n39 / 8 - 0.5) * period;
  }
}
function S45ROUND(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "S45ROUND[]", n39);
  }
  state.round = roundSuper;
  var period;
  switch (n39 & 192) {
    case 0:
      period = Math.sqrt(2) / 2;
      break;
    case 64:
      period = Math.sqrt(2);
      break;
    case 128:
      period = 2 * Math.sqrt(2);
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  state.srPeriod = period;
  switch (n39 & 48) {
    case 0:
      state.srPhase = 0;
      break;
    case 16:
      state.srPhase = 0.25 * period;
      break;
    case 32:
      state.srPhase = 0.5 * period;
      break;
    case 48:
      state.srPhase = 0.75 * period;
      break;
    default:
      throw new Error("invalid S45ROUND value");
  }
  n39 &= 15;
  if (n39 === 0) {
    state.srThreshold = 0;
  } else {
    state.srThreshold = (n39 / 8 - 0.5) * period;
  }
}
function ROFF(state) {
  if (exports.DEBUG) {
    console.log(state.step, "ROFF[]");
  }
  state.round = roundOff;
}
function RUTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RUTG[]");
  }
  state.round = roundUpToGrid;
}
function RDTG(state) {
  if (exports.DEBUG) {
    console.log(state.step, "RDTG[]");
  }
  state.round = roundDownToGrid;
}
function SCANCTRL(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCANCTRL[]", n39);
  }
}
function SDPVTL(a34, state) {
  var stack = state.stack;
  var p2i = stack.pop();
  var p1i = stack.pop();
  var p28 = state.z2[p2i];
  var p1 = state.z1[p1i];
  if (exports.DEBUG) {
    console.log(state.step, "SDPVTL[" + a34 + "]", p2i, p1i);
  }
  var dx;
  var dy;
  if (!a34) {
    dx = p1.x - p28.x;
    dy = p1.y - p28.y;
  } else {
    dx = p28.y - p1.y;
    dy = p1.x - p28.x;
  }
  state.dpv = getUnitVector(dx, dy);
}
function GETINFO(state) {
  var stack = state.stack;
  var sel = stack.pop();
  var r34 = 0;
  if (exports.DEBUG) {
    console.log(state.step, "GETINFO[]", sel);
  }
  if (sel & 1) {
    r34 = 35;
  }
  if (sel & 32) {
    r34 |= 4096;
  }
  stack.push(r34);
}
function ROLL(state) {
  var stack = state.stack;
  var a34 = stack.pop();
  var b20 = stack.pop();
  var c30 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "ROLL[]");
  }
  stack.push(b20);
  stack.push(a34);
  stack.push(c30);
}
function MAX(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MAX[]", e29, e1);
  }
  stack.push(Math.max(e1, e29));
}
function MIN(state) {
  var stack = state.stack;
  var e29 = stack.pop();
  var e1 = stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "MIN[]", e29, e1);
  }
  stack.push(Math.min(e1, e29));
}
function SCANTYPE(state) {
  var n39 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "SCANTYPE[]", n39);
  }
}
function INSTCTRL(state) {
  var s33 = state.stack.pop();
  var v22 = state.stack.pop();
  if (exports.DEBUG) {
    console.log(state.step, "INSTCTRL[]", s33, v22);
  }
  switch (s33) {
    case 1:
      state.inhibitGridFit = !!v22;
      return;
    case 2:
      state.ignoreCvt = !!v22;
      return;
    default:
      throw new Error("invalid INSTCTRL[] selector");
  }
}
function PUSHB(n39, state) {
  var stack = state.stack;
  var prog = state.prog;
  var ip = state.ip;
  if (exports.DEBUG) {
    console.log(state.step, "PUSHB[" + n39 + "]");
  }
  for (var i36 = 0; i36 < n39; i36++) {
    stack.push(prog[++ip]);
  }
  state.ip = ip;
}
function PUSHW(n39, state) {
  var ip = state.ip;
  var prog = state.prog;
  var stack = state.stack;
  if (exports.DEBUG) {
    console.log(state.ip, "PUSHW[" + n39 + "]");
  }
  for (var i36 = 0; i36 < n39; i36++) {
    var w15 = prog[++ip] << 8 | prog[++ip];
    if (w15 & 32768) {
      w15 = -((w15 ^ 65535) + 1);
    }
    stack.push(w15);
  }
  state.ip = ip;
}
function MDRP_MIRP(indirect, setRp0, keepD, ro, dt2, state) {
  var stack = state.stack;
  var cvte = indirect && stack.pop();
  var pi = stack.pop();
  var rp0i = state.rp0;
  var rp = state.z0[rp0i];
  var p28 = state.z1[pi];
  var md = state.minDis;
  var fv = state.fv;
  var pv = state.dpv;
  var od;
  var d24;
  var sign;
  var cv;
  d24 = od = pv.distance(p28, rp, true, true);
  sign = d24 >= 0 ? 1 : -1;
  d24 = Math.abs(d24);
  if (indirect) {
    cv = state.cvt[cvte];
    if (ro && Math.abs(d24 - cv) < state.cvCutIn) {
      d24 = cv;
    }
  }
  if (keepD && d24 < md) {
    d24 = md;
  }
  if (ro) {
    d24 = state.round(d24);
  }
  fv.setRelative(p28, rp, sign * d24, pv);
  fv.touch(p28);
  if (exports.DEBUG) {
    console.log(
      state.step,
      (indirect ? "MIRP[" : "MDRP[") + (setRp0 ? "M" : "m") + (keepD ? ">" : "_") + (ro ? "R" : "_") + (dt2 === 0 ? "Gr" : dt2 === 1 ? "Bl" : dt2 === 2 ? "Wh" : "") + "]",
      indirect ? cvte + "(" + state.cvt[cvte] + "," + cv + ")" : "",
      pi,
      "(d =",
      od,
      "->",
      sign * d24,
      ")"
    );
  }
  state.rp1 = state.rp0;
  state.rp2 = pi;
  if (setRp0) {
    state.rp0 = pi;
  }
}
instructionTable = [
  /* 0x00 */
  SVTCA.bind(void 0, yUnitVector),
  /* 0x01 */
  SVTCA.bind(void 0, xUnitVector),
  /* 0x02 */
  SPVTCA.bind(void 0, yUnitVector),
  /* 0x03 */
  SPVTCA.bind(void 0, xUnitVector),
  /* 0x04 */
  SFVTCA.bind(void 0, yUnitVector),
  /* 0x05 */
  SFVTCA.bind(void 0, xUnitVector),
  /* 0x06 */
  SPVTL.bind(void 0, 0),
  /* 0x07 */
  SPVTL.bind(void 0, 1),
  /* 0x08 */
  SFVTL.bind(void 0, 0),
  /* 0x09 */
  SFVTL.bind(void 0, 1),
  /* 0x0A */
  SPVFS,
  /* 0x0B */
  SFVFS,
  /* 0x0C */
  GPV,
  /* 0x0D */
  GFV,
  /* 0x0E */
  SFVTPV,
  /* 0x0F */
  ISECT,
  /* 0x10 */
  SRP0,
  /* 0x11 */
  SRP1,
  /* 0x12 */
  SRP2,
  /* 0x13 */
  SZP0,
  /* 0x14 */
  SZP1,
  /* 0x15 */
  SZP2,
  /* 0x16 */
  SZPS,
  /* 0x17 */
  SLOOP,
  /* 0x18 */
  RTG,
  /* 0x19 */
  RTHG,
  /* 0x1A */
  SMD,
  /* 0x1B */
  ELSE,
  /* 0x1C */
  JMPR,
  /* 0x1D */
  SCVTCI,
  /* 0x1E */
  void 0,
  // TODO SSWCI
  /* 0x1F */
  void 0,
  // TODO SSW
  /* 0x20 */
  DUP,
  /* 0x21 */
  POP,
  /* 0x22 */
  CLEAR,
  /* 0x23 */
  SWAP,
  /* 0x24 */
  DEPTH,
  /* 0x25 */
  CINDEX,
  /* 0x26 */
  MINDEX,
  /* 0x27 */
  void 0,
  // TODO ALIGNPTS
  /* 0x28 */
  void 0,
  /* 0x29 */
  void 0,
  // TODO UTP
  /* 0x2A */
  LOOPCALL,
  /* 0x2B */
  CALL,
  /* 0x2C */
  FDEF,
  /* 0x2D */
  void 0,
  // ENDF (eaten by FDEF)
  /* 0x2E */
  MDAP.bind(void 0, 0),
  /* 0x2F */
  MDAP.bind(void 0, 1),
  /* 0x30 */
  IUP.bind(void 0, yUnitVector),
  /* 0x31 */
  IUP.bind(void 0, xUnitVector),
  /* 0x32 */
  SHP.bind(void 0, 0),
  /* 0x33 */
  SHP.bind(void 0, 1),
  /* 0x34 */
  SHC.bind(void 0, 0),
  /* 0x35 */
  SHC.bind(void 0, 1),
  /* 0x36 */
  SHZ.bind(void 0, 0),
  /* 0x37 */
  SHZ.bind(void 0, 1),
  /* 0x38 */
  SHPIX,
  /* 0x39 */
  IP,
  /* 0x3A */
  MSIRP.bind(void 0, 0),
  /* 0x3B */
  MSIRP.bind(void 0, 1),
  /* 0x3C */
  ALIGNRP,
  /* 0x3D */
  RTDG,
  /* 0x3E */
  MIAP.bind(void 0, 0),
  /* 0x3F */
  MIAP.bind(void 0, 1),
  /* 0x40 */
  NPUSHB,
  /* 0x41 */
  NPUSHW,
  /* 0x42 */
  WS,
  /* 0x43 */
  RS,
  /* 0x44 */
  WCVTP,
  /* 0x45 */
  RCVT,
  /* 0x46 */
  GC.bind(void 0, 0),
  /* 0x47 */
  GC.bind(void 0, 1),
  /* 0x48 */
  void 0,
  // TODO SCFS
  /* 0x49 */
  MD.bind(void 0, 0),
  /* 0x4A */
  MD.bind(void 0, 1),
  /* 0x4B */
  MPPEM,
  /* 0x4C */
  void 0,
  // TODO MPS
  /* 0x4D */
  FLIPON,
  /* 0x4E */
  void 0,
  // TODO FLIPOFF
  /* 0x4F */
  void 0,
  // TODO DEBUG
  /* 0x50 */
  LT,
  /* 0x51 */
  LTEQ,
  /* 0x52 */
  GT,
  /* 0x53 */
  GTEQ,
  /* 0x54 */
  EQ,
  /* 0x55 */
  NEQ,
  /* 0x56 */
  ODD,
  /* 0x57 */
  EVEN,
  /* 0x58 */
  IF,
  /* 0x59 */
  EIF,
  /* 0x5A */
  AND,
  /* 0x5B */
  OR,
  /* 0x5C */
  NOT,
  /* 0x5D */
  DELTAP123.bind(void 0, 1),
  /* 0x5E */
  SDB,
  /* 0x5F */
  SDS,
  /* 0x60 */
  ADD,
  /* 0x61 */
  SUB,
  /* 0x62 */
  DIV,
  /* 0x63 */
  MUL,
  /* 0x64 */
  ABS,
  /* 0x65 */
  NEG,
  /* 0x66 */
  FLOOR,
  /* 0x67 */
  CEILING,
  /* 0x68 */
  ROUND.bind(void 0, 0),
  /* 0x69 */
  ROUND.bind(void 0, 1),
  /* 0x6A */
  ROUND.bind(void 0, 2),
  /* 0x6B */
  ROUND.bind(void 0, 3),
  /* 0x6C */
  void 0,
  // TODO NROUND[ab]
  /* 0x6D */
  void 0,
  // TODO NROUND[ab]
  /* 0x6E */
  void 0,
  // TODO NROUND[ab]
  /* 0x6F */
  void 0,
  // TODO NROUND[ab]
  /* 0x70 */
  WCVTF,
  /* 0x71 */
  DELTAP123.bind(void 0, 2),
  /* 0x72 */
  DELTAP123.bind(void 0, 3),
  /* 0x73 */
  DELTAC123.bind(void 0, 1),
  /* 0x74 */
  DELTAC123.bind(void 0, 2),
  /* 0x75 */
  DELTAC123.bind(void 0, 3),
  /* 0x76 */
  SROUND,
  /* 0x77 */
  S45ROUND,
  /* 0x78 */
  void 0,
  // TODO JROT[]
  /* 0x79 */
  void 0,
  // TODO JROF[]
  /* 0x7A */
  ROFF,
  /* 0x7B */
  void 0,
  /* 0x7C */
  RUTG,
  /* 0x7D */
  RDTG,
  /* 0x7E */
  POP,
  // actually SANGW, supposed to do only a pop though
  /* 0x7F */
  POP,
  // actually AA, supposed to do only a pop though
  /* 0x80 */
  void 0,
  // TODO FLIPPT
  /* 0x81 */
  void 0,
  // TODO FLIPRGON
  /* 0x82 */
  void 0,
  // TODO FLIPRGOFF
  /* 0x83 */
  void 0,
  /* 0x84 */
  void 0,
  /* 0x85 */
  SCANCTRL,
  /* 0x86 */
  SDPVTL.bind(void 0, 0),
  /* 0x87 */
  SDPVTL.bind(void 0, 1),
  /* 0x88 */
  GETINFO,
  /* 0x89 */
  void 0,
  // TODO IDEF
  /* 0x8A */
  ROLL,
  /* 0x8B */
  MAX,
  /* 0x8C */
  MIN,
  /* 0x8D */
  SCANTYPE,
  /* 0x8E */
  INSTCTRL,
  /* 0x8F */
  void 0,
  /* 0x90 */
  void 0,
  /* 0x91 */
  void 0,
  /* 0x92 */
  void 0,
  /* 0x93 */
  void 0,
  /* 0x94 */
  void 0,
  /* 0x95 */
  void 0,
  /* 0x96 */
  void 0,
  /* 0x97 */
  void 0,
  /* 0x98 */
  void 0,
  /* 0x99 */
  void 0,
  /* 0x9A */
  void 0,
  /* 0x9B */
  void 0,
  /* 0x9C */
  void 0,
  /* 0x9D */
  void 0,
  /* 0x9E */
  void 0,
  /* 0x9F */
  void 0,
  /* 0xA0 */
  void 0,
  /* 0xA1 */
  void 0,
  /* 0xA2 */
  void 0,
  /* 0xA3 */
  void 0,
  /* 0xA4 */
  void 0,
  /* 0xA5 */
  void 0,
  /* 0xA6 */
  void 0,
  /* 0xA7 */
  void 0,
  /* 0xA8 */
  void 0,
  /* 0xA9 */
  void 0,
  /* 0xAA */
  void 0,
  /* 0xAB */
  void 0,
  /* 0xAC */
  void 0,
  /* 0xAD */
  void 0,
  /* 0xAE */
  void 0,
  /* 0xAF */
  void 0,
  /* 0xB0 */
  PUSHB.bind(void 0, 1),
  /* 0xB1 */
  PUSHB.bind(void 0, 2),
  /* 0xB2 */
  PUSHB.bind(void 0, 3),
  /* 0xB3 */
  PUSHB.bind(void 0, 4),
  /* 0xB4 */
  PUSHB.bind(void 0, 5),
  /* 0xB5 */
  PUSHB.bind(void 0, 6),
  /* 0xB6 */
  PUSHB.bind(void 0, 7),
  /* 0xB7 */
  PUSHB.bind(void 0, 8),
  /* 0xB8 */
  PUSHW.bind(void 0, 1),
  /* 0xB9 */
  PUSHW.bind(void 0, 2),
  /* 0xBA */
  PUSHW.bind(void 0, 3),
  /* 0xBB */
  PUSHW.bind(void 0, 4),
  /* 0xBC */
  PUSHW.bind(void 0, 5),
  /* 0xBD */
  PUSHW.bind(void 0, 6),
  /* 0xBE */
  PUSHW.bind(void 0, 7),
  /* 0xBF */
  PUSHW.bind(void 0, 8),
  /* 0xC0 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 0),
  /* 0xC1 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 1),
  /* 0xC2 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 2),
  /* 0xC3 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 0, 3),
  /* 0xC4 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 0),
  /* 0xC5 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 1),
  /* 0xC6 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 2),
  /* 0xC7 */
  MDRP_MIRP.bind(void 0, 0, 0, 0, 1, 3),
  /* 0xC8 */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 0),
  /* 0xC9 */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 1),
  /* 0xCA */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 2),
  /* 0xCB */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 0, 3),
  /* 0xCC */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 0),
  /* 0xCD */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 1),
  /* 0xCE */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 2),
  /* 0xCF */
  MDRP_MIRP.bind(void 0, 0, 0, 1, 1, 3),
  /* 0xD0 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 0),
  /* 0xD1 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 1),
  /* 0xD2 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 2),
  /* 0xD3 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 0, 3),
  /* 0xD4 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 0),
  /* 0xD5 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 1),
  /* 0xD6 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 2),
  /* 0xD7 */
  MDRP_MIRP.bind(void 0, 0, 1, 0, 1, 3),
  /* 0xD8 */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 0),
  /* 0xD9 */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 1),
  /* 0xDA */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 2),
  /* 0xDB */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 0, 3),
  /* 0xDC */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 0),
  /* 0xDD */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 1),
  /* 0xDE */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 2),
  /* 0xDF */
  MDRP_MIRP.bind(void 0, 0, 1, 1, 1, 3),
  /* 0xE0 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 0),
  /* 0xE1 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 1),
  /* 0xE2 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 2),
  /* 0xE3 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 0, 3),
  /* 0xE4 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 0),
  /* 0xE5 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 1),
  /* 0xE6 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 2),
  /* 0xE7 */
  MDRP_MIRP.bind(void 0, 1, 0, 0, 1, 3),
  /* 0xE8 */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 0),
  /* 0xE9 */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 1),
  /* 0xEA */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 2),
  /* 0xEB */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 0, 3),
  /* 0xEC */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 0),
  /* 0xED */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 1),
  /* 0xEE */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 2),
  /* 0xEF */
  MDRP_MIRP.bind(void 0, 1, 0, 1, 1, 3),
  /* 0xF0 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 0),
  /* 0xF1 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 1),
  /* 0xF2 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 2),
  /* 0xF3 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 0, 3),
  /* 0xF4 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 0),
  /* 0xF5 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 1),
  /* 0xF6 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 2),
  /* 0xF7 */
  MDRP_MIRP.bind(void 0, 1, 1, 0, 1, 3),
  /* 0xF8 */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 0),
  /* 0xF9 */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 1),
  /* 0xFA */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 2),
  /* 0xFB */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 0, 3),
  /* 0xFC */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 0),
  /* 0xFD */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 1),
  /* 0xFE */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 2),
  /* 0xFF */
  MDRP_MIRP.bind(void 0, 1, 1, 1, 1, 3)
];
function Token(char) {
  this.char = char;
  this.state = {};
  this.activeState = null;
}
function ContextRange(startIndex, endOffset, contextName) {
  this.contextName = contextName;
  this.startIndex = startIndex;
  this.endOffset = endOffset;
}
function ContextChecker(contextName, checkStart, checkEnd) {
  this.contextName = contextName;
  this.openRange = null;
  this.ranges = [];
  this.checkStart = checkStart;
  this.checkEnd = checkEnd;
}
function ContextParams(context, currentIndex) {
  this.context = context;
  this.index = currentIndex;
  this.length = context.length;
  this.current = context[currentIndex];
  this.backtrack = context.slice(0, currentIndex);
  this.lookahead = context.slice(currentIndex + 1);
}
function Event(eventId) {
  this.eventId = eventId;
  this.subscribers = [];
}
function initializeCoreEvents(events) {
  var this$1 = this;
  var coreEvents = [
    "start",
    "end",
    "next",
    "newToken",
    "contextStart",
    "contextEnd",
    "insertToken",
    "removeToken",
    "removeRange",
    "replaceToken",
    "replaceRange",
    "composeRUD",
    "updateContextsRanges"
  ];
  coreEvents.forEach(function(eventId) {
    Object.defineProperty(this$1.events, eventId, {
      value: new Event(eventId)
    });
  });
  if (!!events) {
    coreEvents.forEach(function(eventId) {
      var event = events[eventId];
      if (typeof event === "function") {
        this$1.events[eventId].subscribe(event);
      }
    });
  }
  var requiresContextUpdate = [
    "insertToken",
    "removeToken",
    "removeRange",
    "replaceToken",
    "replaceRange",
    "composeRUD"
  ];
  requiresContextUpdate.forEach(function(eventId) {
    this$1.events[eventId].subscribe(
      this$1.updateContextsRanges
    );
  });
}
function Tokenizer(events) {
  this.tokens = [];
  this.registeredContexts = {};
  this.contextCheckers = [];
  this.events = {};
  this.registeredModifiers = [];
  initializeCoreEvents.call(this, events);
}
Token.prototype.setState = function(key, value) {
  this.state[key] = value;
  this.activeState = { key, value: this.state[key] };
  return this.activeState;
};
Token.prototype.getState = function(stateId) {
  return this.state[stateId] || null;
};
Tokenizer.prototype.inboundIndex = function(index) {
  return index >= 0 && index < this.tokens.length;
};
Tokenizer.prototype.composeRUD = function(RUDs) {
  var this$1 = this;
  var silent = true;
  var state = RUDs.map(function(RUD) {
    return this$1[RUD[0]].apply(this$1, RUD.slice(1).concat(silent));
  });
  var hasFAILObject = function(obj) {
    return typeof obj === "object" && obj.hasOwnProperty("FAIL");
  };
  if (state.every(hasFAILObject)) {
    return {
      FAIL: "composeRUD: one or more operations hasn't completed successfully",
      report: state.filter(hasFAILObject)
    };
  }
  this.dispatch("composeRUD", [state.filter(function(op) {
    return !hasFAILObject(op);
  })]);
};
Tokenizer.prototype.replaceRange = function(startIndex, offset, tokens, silent) {
  offset = offset !== null ? offset : this.tokens.length;
  var isTokenType = tokens.every(function(token) {
    return token instanceof Token;
  });
  if (!isNaN(startIndex) && this.inboundIndex(startIndex) && isTokenType) {
    var replaced = this.tokens.splice.apply(
      this.tokens,
      [startIndex, offset].concat(tokens)
    );
    if (!silent) {
      this.dispatch("replaceToken", [startIndex, offset, tokens]);
    }
    return [replaced, tokens];
  } else {
    return { FAIL: "replaceRange: invalid tokens or startIndex." };
  }
};
Tokenizer.prototype.replaceToken = function(index, token, silent) {
  if (!isNaN(index) && this.inboundIndex(index) && token instanceof Token) {
    var replaced = this.tokens.splice(index, 1, token);
    if (!silent) {
      this.dispatch("replaceToken", [index, token]);
    }
    return [replaced[0], token];
  } else {
    return { FAIL: "replaceToken: invalid token or index." };
  }
};
Tokenizer.prototype.removeRange = function(startIndex, offset, silent) {
  offset = !isNaN(offset) ? offset : this.tokens.length;
  var tokens = this.tokens.splice(startIndex, offset);
  if (!silent) {
    this.dispatch("removeRange", [tokens, startIndex, offset]);
  }
  return tokens;
};
Tokenizer.prototype.removeToken = function(index, silent) {
  if (!isNaN(index) && this.inboundIndex(index)) {
    var token = this.tokens.splice(index, 1);
    if (!silent) {
      this.dispatch("removeToken", [token, index]);
    }
    return token;
  } else {
    return { FAIL: "removeToken: invalid token index." };
  }
};
Tokenizer.prototype.insertToken = function(tokens, index, silent) {
  var tokenType = tokens.every(
    function(token) {
      return token instanceof Token;
    }
  );
  if (tokenType) {
    this.tokens.splice.apply(
      this.tokens,
      [index, 0].concat(tokens)
    );
    if (!silent) {
      this.dispatch("insertToken", [tokens, index]);
    }
    return tokens;
  } else {
    return { FAIL: "insertToken: invalid token(s)." };
  }
};
Tokenizer.prototype.registerModifier = function(modifierId, condition, modifier) {
  this.events.newToken.subscribe(function(token, contextParams) {
    var conditionParams = [token, contextParams];
    var canApplyModifier = condition === null || condition.apply(this, conditionParams) === true;
    var modifierParams = [token, contextParams];
    if (canApplyModifier) {
      var newStateValue = modifier.apply(this, modifierParams);
      token.setState(modifierId, newStateValue);
    }
  });
  this.registeredModifiers.push(modifierId);
};
Event.prototype.subscribe = function(eventHandler) {
  if (typeof eventHandler === "function") {
    return this.subscribers.push(eventHandler) - 1;
  } else {
    return { FAIL: "invalid '" + this.eventId + "' event handler" };
  }
};
Event.prototype.unsubscribe = function(subsId) {
  this.subscribers.splice(subsId, 1);
};
ContextParams.prototype.setCurrentIndex = function(index) {
  this.index = index;
  this.current = this.context[index];
  this.backtrack = this.context.slice(0, index);
  this.lookahead = this.context.slice(index + 1);
};
ContextParams.prototype.get = function(offset) {
  switch (true) {
    case offset === 0:
      return this.current;
    case (offset < 0 && Math.abs(offset) <= this.backtrack.length):
      return this.backtrack.slice(offset)[0];
    case (offset > 0 && offset <= this.lookahead.length):
      return this.lookahead[offset - 1];
    default:
      return null;
  }
};
Tokenizer.prototype.rangeToText = function(range) {
  if (range instanceof ContextRange) {
    return this.getRangeTokens(range).map(function(token) {
      return token.char;
    }).join("");
  }
};
Tokenizer.prototype.getText = function() {
  return this.tokens.map(function(token) {
    return token.char;
  }).join("");
};
Tokenizer.prototype.getContext = function(contextName) {
  var context = this.registeredContexts[contextName];
  return !!context ? context : null;
};
Tokenizer.prototype.on = function(eventName, eventHandler) {
  var event = this.events[eventName];
  if (!!event) {
    return event.subscribe(eventHandler);
  } else {
    return null;
  }
};
Tokenizer.prototype.dispatch = function(eventName, args) {
  var this$1 = this;
  var event = this.events[eventName];
  if (event instanceof Event) {
    event.subscribers.forEach(function(subscriber) {
      subscriber.apply(this$1, args || []);
    });
  }
};
Tokenizer.prototype.registerContextChecker = function(contextName, contextStartCheck, contextEndCheck) {
  if (!!this.getContext(contextName)) {
    return {
      FAIL: "context name '" + contextName + "' is already registered."
    };
  }
  if (typeof contextStartCheck !== "function") {
    return {
      FAIL: "missing context start check."
    };
  }
  if (typeof contextEndCheck !== "function") {
    return {
      FAIL: "missing context end check."
    };
  }
  var contextCheckers = new ContextChecker(
    contextName,
    contextStartCheck,
    contextEndCheck
  );
  this.registeredContexts[contextName] = contextCheckers;
  this.contextCheckers.push(contextCheckers);
  return contextCheckers;
};
Tokenizer.prototype.getRangeTokens = function(range) {
  var endIndex = range.startIndex + range.endOffset;
  return [].concat(
    this.tokens.slice(range.startIndex, endIndex)
  );
};
Tokenizer.prototype.getContextRanges = function(contextName) {
  var context = this.getContext(contextName);
  if (!!context) {
    return context.ranges;
  } else {
    return { FAIL: "context checker '" + contextName + "' is not registered." };
  }
};
Tokenizer.prototype.resetContextsRanges = function() {
  var registeredContexts = this.registeredContexts;
  for (var contextName in registeredContexts) {
    if (registeredContexts.hasOwnProperty(contextName)) {
      var context = registeredContexts[contextName];
      context.ranges = [];
    }
  }
};
Tokenizer.prototype.updateContextsRanges = function() {
  this.resetContextsRanges();
  var chars = this.tokens.map(function(token) {
    return token.char;
  });
  for (var i36 = 0; i36 < chars.length; i36++) {
    var contextParams = new ContextParams(chars, i36);
    this.runContextCheck(contextParams);
  }
  this.dispatch("updateContextsRanges", [this.registeredContexts]);
};
Tokenizer.prototype.setEndOffset = function(offset, contextName) {
  var startIndex = this.getContext(contextName).openRange.startIndex;
  var range = new ContextRange(startIndex, offset, contextName);
  var ranges = this.getContext(contextName).ranges;
  range.rangeId = contextName + "." + ranges.length;
  ranges.push(range);
  this.getContext(contextName).openRange = null;
  return range;
};
Tokenizer.prototype.runContextCheck = function(contextParams) {
  var this$1 = this;
  var index = contextParams.index;
  this.contextCheckers.forEach(function(contextChecker) {
    var contextName = contextChecker.contextName;
    var openRange = this$1.getContext(contextName).openRange;
    if (!openRange && contextChecker.checkStart(contextParams)) {
      openRange = new ContextRange(index, null, contextName);
      this$1.getContext(contextName).openRange = openRange;
      this$1.dispatch("contextStart", [contextName, index]);
    }
    if (!!openRange && contextChecker.checkEnd(contextParams)) {
      var offset = index - openRange.startIndex + 1;
      var range = this$1.setEndOffset(offset, contextName);
      this$1.dispatch("contextEnd", [contextName, range]);
    }
  });
};
Tokenizer.prototype.tokenize = function(text) {
  this.tokens = [];
  this.resetContextsRanges();
  var chars = Array.from(text);
  this.dispatch("start");
  for (var i36 = 0; i36 < chars.length; i36++) {
    var char = chars[i36];
    var contextParams = new ContextParams(chars, i36);
    this.dispatch("next", [contextParams]);
    this.runContextCheck(contextParams);
    var token = new Token(char);
    this.tokens.push(token);
    this.dispatch("newToken", [token, contextParams]);
  }
  this.dispatch("end", [this.tokens]);
  return this.tokens;
};
function isArabicChar(c30) {
  return /[\u0600-\u065F\u066A-\u06D2\u06FA-\u06FF]/.test(c30);
}
function isIsolatedArabicChar(char) {
  return /[\u0630\u0690\u0621\u0631\u0661\u0671\u0622\u0632\u0672\u0692\u06C2\u0623\u0673\u0693\u06C3\u0624\u0694\u06C4\u0625\u0675\u0695\u06C5\u06E5\u0676\u0696\u06C6\u0627\u0677\u0697\u06C7\u0648\u0688\u0698\u06C8\u0689\u0699\u06C9\u068A\u06CA\u066B\u068B\u06CB\u068C\u068D\u06CD\u06FD\u068E\u06EE\u06FE\u062F\u068F\u06CF\u06EF]/.test(char);
}
function isTashkeelArabicChar(char) {
  return /[\u0600-\u0605\u060C-\u060E\u0610-\u061B\u061E\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/.test(char);
}
function isLatinChar(c30) {
  return /[A-z]/.test(c30);
}
function isWhiteSpace(c30) {
  return /\s/.test(c30);
}
function FeatureQuery(font) {
  this.font = font;
  this.features = {};
}
function SubstitutionAction(action) {
  this.id = action.id;
  this.tag = action.tag;
  this.substitution = action.substitution;
}
function lookupCoverage(glyphIndex, coverage) {
  if (!glyphIndex) {
    return -1;
  }
  switch (coverage.format) {
    case 1:
      return coverage.glyphs.indexOf(glyphIndex);
    case 2:
      var ranges = coverage.ranges;
      for (var i36 = 0; i36 < ranges.length; i36++) {
        var range = ranges[i36];
        if (glyphIndex >= range.start && glyphIndex <= range.end) {
          var offset = glyphIndex - range.start;
          return range.index + offset;
        }
      }
      break;
    default:
      return -1;
  }
  return -1;
}
function singleSubstitutionFormat1(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return glyphIndex + subtable.deltaGlyphId;
}
function singleSubstitutionFormat2(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return subtable.substitute[substituteIndex];
}
function lookupCoverageList(coverageList, contextParams) {
  var lookupList = [];
  for (var i36 = 0; i36 < coverageList.length; i36++) {
    var coverage = coverageList[i36];
    var glyphIndex = contextParams.current;
    glyphIndex = Array.isArray(glyphIndex) ? glyphIndex[0] : glyphIndex;
    var lookupIndex = lookupCoverage(glyphIndex, coverage);
    if (lookupIndex !== -1) {
      lookupList.push(lookupIndex);
    }
  }
  if (lookupList.length !== coverageList.length) {
    return -1;
  }
  return lookupList;
}
function chainingSubstitutionFormat3(contextParams, subtable) {
  var lookupsCount = subtable.inputCoverage.length + subtable.lookaheadCoverage.length + subtable.backtrackCoverage.length;
  if (contextParams.context.length < lookupsCount) {
    return [];
  }
  var inputLookups = lookupCoverageList(
    subtable.inputCoverage,
    contextParams
  );
  if (inputLookups === -1) {
    return [];
  }
  var lookaheadOffset = subtable.inputCoverage.length - 1;
  if (contextParams.lookahead.length < subtable.lookaheadCoverage.length) {
    return [];
  }
  var lookaheadContext = contextParams.lookahead.slice(lookaheadOffset);
  while (lookaheadContext.length && isTashkeelArabicChar(lookaheadContext[0].char)) {
    lookaheadContext.shift();
  }
  var lookaheadParams = new ContextParams(lookaheadContext, 0);
  var lookaheadLookups = lookupCoverageList(
    subtable.lookaheadCoverage,
    lookaheadParams
  );
  var backtrackContext = [].concat(contextParams.backtrack);
  backtrackContext.reverse();
  while (backtrackContext.length && isTashkeelArabicChar(backtrackContext[0].char)) {
    backtrackContext.shift();
  }
  if (backtrackContext.length < subtable.backtrackCoverage.length) {
    return [];
  }
  var backtrackParams = new ContextParams(backtrackContext, 0);
  var backtrackLookups = lookupCoverageList(
    subtable.backtrackCoverage,
    backtrackParams
  );
  var contextRulesMatch = inputLookups.length === subtable.inputCoverage.length && lookaheadLookups.length === subtable.lookaheadCoverage.length && backtrackLookups.length === subtable.backtrackCoverage.length;
  var substitutions = [];
  if (contextRulesMatch) {
    for (var i36 = 0; i36 < subtable.lookupRecords.length; i36++) {
      var lookupRecord = subtable.lookupRecords[i36];
      var lookupListIndex = lookupRecord.lookupListIndex;
      var lookupTable = this.getLookupByIndex(lookupListIndex);
      for (var s33 = 0; s33 < lookupTable.subtables.length; s33++) {
        var subtable$1 = lookupTable.subtables[s33];
        var lookup = this.getLookupMethod(lookupTable, subtable$1);
        var substitutionType = this.getSubstitutionType(lookupTable, subtable$1);
        if (substitutionType === "12") {
          for (var n39 = 0; n39 < inputLookups.length; n39++) {
            var glyphIndex = contextParams.get(n39);
            var substitution = lookup(glyphIndex);
            if (substitution) {
              substitutions.push(substitution);
            }
          }
        }
      }
    }
  }
  return substitutions;
}
function ligatureSubstitutionFormat1(contextParams, subtable) {
  var glyphIndex = contextParams.current;
  var ligSetIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (ligSetIndex === -1) {
    return null;
  }
  var ligature;
  var ligatureSet = subtable.ligatureSets[ligSetIndex];
  for (var s33 = 0; s33 < ligatureSet.length; s33++) {
    ligature = ligatureSet[s33];
    for (var l29 = 0; l29 < ligature.components.length; l29++) {
      var lookaheadItem = contextParams.lookahead[l29];
      var component = ligature.components[l29];
      if (lookaheadItem !== component) {
        break;
      }
      if (l29 === ligature.components.length - 1) {
        return ligature;
      }
    }
  }
  return null;
}
function decompositionSubstitutionFormat1(glyphIndex, subtable) {
  var substituteIndex = lookupCoverage(glyphIndex, subtable.coverage);
  if (substituteIndex === -1) {
    return null;
  }
  return subtable.sequences[substituteIndex];
}
FeatureQuery.prototype.getDefaultScriptFeaturesIndexes = function() {
  var scripts = this.font.tables.gsub.scripts;
  for (var s33 = 0; s33 < scripts.length; s33++) {
    var script = scripts[s33];
    if (script.tag === "DFLT") {
      return script.script.defaultLangSys.featureIndexes;
    }
  }
  return [];
};
FeatureQuery.prototype.getScriptFeaturesIndexes = function(scriptTag) {
  var tables = this.font.tables;
  if (!tables.gsub) {
    return [];
  }
  if (!scriptTag) {
    return this.getDefaultScriptFeaturesIndexes();
  }
  var scripts = this.font.tables.gsub.scripts;
  for (var i36 = 0; i36 < scripts.length; i36++) {
    var script = scripts[i36];
    if (script.tag === scriptTag && script.script.defaultLangSys) {
      return script.script.defaultLangSys.featureIndexes;
    } else {
      var langSysRecords = script.langSysRecords;
      if (!!langSysRecords) {
        for (var j9 = 0; j9 < langSysRecords.length; j9++) {
          var langSysRecord = langSysRecords[j9];
          if (langSysRecord.tag === scriptTag) {
            var langSys = langSysRecord.langSys;
            return langSys.featureIndexes;
          }
        }
      }
    }
  }
  return this.getDefaultScriptFeaturesIndexes();
};
FeatureQuery.prototype.mapTagsToFeatures = function(features, scriptTag) {
  var tags = {};
  for (var i36 = 0; i36 < features.length; i36++) {
    var tag = features[i36].tag;
    var feature = features[i36].feature;
    tags[tag] = feature;
  }
  this.features[scriptTag].tags = tags;
};
FeatureQuery.prototype.getScriptFeatures = function(scriptTag) {
  var features = this.features[scriptTag];
  if (this.features.hasOwnProperty(scriptTag)) {
    return features;
  }
  var featuresIndexes = this.getScriptFeaturesIndexes(scriptTag);
  if (!featuresIndexes) {
    return null;
  }
  var gsub2 = this.font.tables.gsub;
  features = featuresIndexes.map(function(index) {
    return gsub2.features[index];
  });
  this.features[scriptTag] = features;
  this.mapTagsToFeatures(features, scriptTag);
  return features;
};
FeatureQuery.prototype.getSubstitutionType = function(lookupTable, subtable) {
  var lookupType = lookupTable.lookupType.toString();
  var substFormat = subtable.substFormat.toString();
  return lookupType + substFormat;
};
FeatureQuery.prototype.getLookupMethod = function(lookupTable, subtable) {
  var this$1 = this;
  var substitutionType = this.getSubstitutionType(lookupTable, subtable);
  switch (substitutionType) {
    case "11":
      return function(glyphIndex) {
        return singleSubstitutionFormat1.apply(
          this$1,
          [glyphIndex, subtable]
        );
      };
    case "12":
      return function(glyphIndex) {
        return singleSubstitutionFormat2.apply(
          this$1,
          [glyphIndex, subtable]
        );
      };
    case "63":
      return function(contextParams) {
        return chainingSubstitutionFormat3.apply(
          this$1,
          [contextParams, subtable]
        );
      };
    case "41":
      return function(contextParams) {
        return ligatureSubstitutionFormat1.apply(
          this$1,
          [contextParams, subtable]
        );
      };
    case "21":
      return function(glyphIndex) {
        return decompositionSubstitutionFormat1.apply(
          this$1,
          [glyphIndex, subtable]
        );
      };
    default:
      throw new Error(
        "lookupType: " + lookupTable.lookupType + " - substFormat: " + subtable.substFormat + " is not yet supported"
      );
  }
};
FeatureQuery.prototype.lookupFeature = function(query) {
  var contextParams = query.contextParams;
  var currentIndex = contextParams.index;
  var feature = this.getFeature({
    tag: query.tag,
    script: query.script
  });
  if (!feature) {
    return new Error(
      "font '" + this.font.names.fullName.en + "' doesn't support feature '" + query.tag + "' for script '" + query.script + "'."
    );
  }
  var lookups = this.getFeatureLookups(feature);
  var substitutions = [].concat(contextParams.context);
  for (var l29 = 0; l29 < lookups.length; l29++) {
    var lookupTable = lookups[l29];
    var subtables = this.getLookupSubtables(lookupTable);
    for (var s33 = 0; s33 < subtables.length; s33++) {
      var subtable = subtables[s33];
      var substType = this.getSubstitutionType(lookupTable, subtable);
      var lookup = this.getLookupMethod(lookupTable, subtable);
      var substitution = void 0;
      switch (substType) {
        case "11":
          substitution = lookup(contextParams.current);
          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 11,
              tag: query.tag,
              substitution
            }));
          }
          break;
        case "12":
          substitution = lookup(contextParams.current);
          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 12,
              tag: query.tag,
              substitution
            }));
          }
          break;
        case "63":
          substitution = lookup(contextParams);
          if (Array.isArray(substitution) && substitution.length) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 63,
              tag: query.tag,
              substitution
            }));
          }
          break;
        case "41":
          substitution = lookup(contextParams);
          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 41,
              tag: query.tag,
              substitution
            }));
          }
          break;
        case "21":
          substitution = lookup(contextParams.current);
          if (substitution) {
            substitutions.splice(currentIndex, 1, new SubstitutionAction({
              id: 21,
              tag: query.tag,
              substitution
            }));
          }
          break;
      }
      contextParams = new ContextParams(substitutions, currentIndex);
      if (Array.isArray(substitution) && !substitution.length) {
        continue;
      }
      substitution = null;
    }
  }
  return substitutions.length ? substitutions : null;
};
FeatureQuery.prototype.supports = function(query) {
  if (!query.script) {
    return false;
  }
  this.getScriptFeatures(query.script);
  var supportedScript = this.features.hasOwnProperty(query.script);
  if (!query.tag) {
    return supportedScript;
  }
  var supportedFeature = this.features[query.script].some(function(feature) {
    return feature.tag === query.tag;
  });
  return supportedScript && supportedFeature;
};
FeatureQuery.prototype.getLookupSubtables = function(lookupTable) {
  return lookupTable.subtables || null;
};
FeatureQuery.prototype.getLookupByIndex = function(index) {
  var lookups = this.font.tables.gsub.lookups;
  return lookups[index] || null;
};
FeatureQuery.prototype.getFeatureLookups = function(feature) {
  return feature.lookupListIndexes.map(this.getLookupByIndex.bind(this));
};
FeatureQuery.prototype.getFeature = function getFeature(query) {
  if (!this.font) {
    return { FAIL: "No font was found" };
  }
  if (!this.features.hasOwnProperty(query.script)) {
    this.getScriptFeatures(query.script);
  }
  var scriptFeatures = this.features[query.script];
  if (!scriptFeatures) {
    return { FAIL: "No feature for script " + query.script };
  }
  if (!scriptFeatures.tags[query.tag]) {
    return null;
  }
  return this.features[query.script].tags[query.tag];
};
function arabicWordStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? arabic first char
    prevChar === null && isArabicChar(char) || // ? arabic char preceded with a non arabic char
    !isArabicChar(prevChar) && isArabicChar(char)
  );
}
function arabicWordEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  return (
    // ? last arabic char
    nextChar === null || // ? next char is not arabic
    !isArabicChar(nextChar)
  );
}
var arabicWordCheck = {
  startCheck: arabicWordStartCheck,
  endCheck: arabicWordEndCheck
};
function arabicSentenceStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? an arabic char preceded with a non arabic char
    (isArabicChar(char) || isTashkeelArabicChar(char)) && !isArabicChar(prevChar)
  );
}
function arabicSentenceEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  switch (true) {
    case nextChar === null:
      return true;
    case (!isArabicChar(nextChar) && !isTashkeelArabicChar(nextChar)):
      var nextIsWhitespace = isWhiteSpace(nextChar);
      if (!nextIsWhitespace) {
        return true;
      }
      if (nextIsWhitespace) {
        var arabicCharAhead = false;
        arabicCharAhead = contextParams.lookahead.some(
          function(c30) {
            return isArabicChar(c30) || isTashkeelArabicChar(c30);
          }
        );
        if (!arabicCharAhead) {
          return true;
        }
      }
      break;
    default:
      return false;
  }
}
var arabicSentenceCheck = {
  startCheck: arabicSentenceStartCheck,
  endCheck: arabicSentenceEndCheck
};
function singleSubstitutionFormat1$1(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
function singleSubstitutionFormat2$1(action, tokens, index) {
  tokens[index].setState(action.tag, action.substitution);
}
function chainingSubstitutionFormat3$1(action, tokens, index) {
  action.substitution.forEach(function(subst, offset) {
    var token = tokens[index + offset];
    token.setState(action.tag, subst);
  });
}
function ligatureSubstitutionFormat1$1(action, tokens, index) {
  var token = tokens[index];
  token.setState(action.tag, action.substitution.ligGlyph);
  var compsCount = action.substitution.components.length;
  for (var i36 = 0; i36 < compsCount; i36++) {
    token = tokens[index + i36 + 1];
    token.setState("deleted", true);
  }
}
var SUBSTITUTIONS = {
  11: singleSubstitutionFormat1$1,
  12: singleSubstitutionFormat2$1,
  63: chainingSubstitutionFormat3$1,
  41: ligatureSubstitutionFormat1$1
};
function applySubstitution(action, tokens, index) {
  if (action instanceof SubstitutionAction && SUBSTITUTIONS[action.id]) {
    SUBSTITUTIONS[action.id](action, tokens, index);
  }
}
function willConnectPrev(charContextParams) {
  var backtrack = [].concat(charContextParams.backtrack);
  for (var i36 = backtrack.length - 1; i36 >= 0; i36--) {
    var prevChar = backtrack[i36];
    var isolated = isIsolatedArabicChar(prevChar);
    var tashkeel = isTashkeelArabicChar(prevChar);
    if (!isolated && !tashkeel) {
      return true;
    }
    if (isolated) {
      return false;
    }
  }
  return false;
}
function willConnectNext(charContextParams) {
  if (isIsolatedArabicChar(charContextParams.current)) {
    return false;
  }
  for (var i36 = 0; i36 < charContextParams.lookahead.length; i36++) {
    var nextChar = charContextParams.lookahead[i36];
    var tashkeel = isTashkeelArabicChar(nextChar);
    if (!tashkeel) {
      return true;
    }
  }
  return false;
}
function arabicPresentationForms(range) {
  var this$1 = this;
  var script = "arab";
  var tags = this.featuresTags[script];
  var tokens = this.tokenizer.getRangeTokens(range);
  if (tokens.length === 1) {
    return;
  }
  var contextParams = new ContextParams(
    tokens.map(
      function(token) {
        return token.getState("glyphIndex");
      }
    ),
    0
  );
  var charContextParams = new ContextParams(
    tokens.map(
      function(token) {
        return token.char;
      }
    ),
    0
  );
  tokens.forEach(function(token, index) {
    if (isTashkeelArabicChar(token.char)) {
      return;
    }
    contextParams.setCurrentIndex(index);
    charContextParams.setCurrentIndex(index);
    var CONNECT = 0;
    if (willConnectPrev(charContextParams)) {
      CONNECT |= 1;
    }
    if (willConnectNext(charContextParams)) {
      CONNECT |= 2;
    }
    var tag;
    switch (CONNECT) {
      case 1:
        tag = "fina";
        break;
      case 2:
        tag = "init";
        break;
      case 3:
        tag = "medi";
        break;
    }
    if (tags.indexOf(tag) === -1) {
      return;
    }
    var substitutions = this$1.query.lookupFeature({
      tag,
      script,
      contextParams
    });
    if (substitutions instanceof Error) {
      return console.info(substitutions.message);
    }
    substitutions.forEach(function(action, index2) {
      if (action instanceof SubstitutionAction) {
        applySubstitution(action, tokens, index2);
        contextParams.context[index2] = action.substitution;
      }
    });
  });
}
function getContextParams(tokens, index) {
  var context = tokens.map(function(token) {
    return token.activeState.value;
  });
  return new ContextParams(context, index || 0);
}
function arabicRequiredLigatures(range) {
  var this$1 = this;
  var script = "arab";
  var tokens = this.tokenizer.getRangeTokens(range);
  var contextParams = getContextParams(tokens);
  contextParams.context.forEach(function(glyphIndex, index) {
    contextParams.setCurrentIndex(index);
    var substitutions = this$1.query.lookupFeature({
      tag: "rlig",
      script,
      contextParams
    });
    if (substitutions.length) {
      substitutions.forEach(
        function(action) {
          return applySubstitution(action, tokens, index);
        }
      );
      contextParams = getContextParams(tokens);
    }
  });
}
function latinWordStartCheck(contextParams) {
  var char = contextParams.current;
  var prevChar = contextParams.get(-1);
  return (
    // ? latin first char
    prevChar === null && isLatinChar(char) || // ? latin char preceded with a non latin char
    !isLatinChar(prevChar) && isLatinChar(char)
  );
}
function latinWordEndCheck(contextParams) {
  var nextChar = contextParams.get(1);
  return (
    // ? last latin char
    nextChar === null || // ? next char is not latin
    !isLatinChar(nextChar)
  );
}
var latinWordCheck = {
  startCheck: latinWordStartCheck,
  endCheck: latinWordEndCheck
};
function getContextParams$1(tokens, index) {
  var context = tokens.map(function(token) {
    return token.activeState.value;
  });
  return new ContextParams(context, index || 0);
}
function latinLigature(range) {
  var this$1 = this;
  var script = "latn";
  var tokens = this.tokenizer.getRangeTokens(range);
  var contextParams = getContextParams$1(tokens);
  contextParams.context.forEach(function(glyphIndex, index) {
    contextParams.setCurrentIndex(index);
    var substitutions = this$1.query.lookupFeature({
      tag: "liga",
      script,
      contextParams
    });
    if (substitutions.length) {
      substitutions.forEach(
        function(action) {
          return applySubstitution(action, tokens, index);
        }
      );
      contextParams = getContextParams$1(tokens);
    }
  });
}
function Bidi(baseDir) {
  this.baseDir = baseDir || "ltr";
  this.tokenizer = new Tokenizer();
  this.featuresTags = {};
}
Bidi.prototype.setText = function(text) {
  this.text = text;
};
Bidi.prototype.contextChecks = {
  latinWordCheck,
  arabicWordCheck,
  arabicSentenceCheck
};
function registerContextChecker(checkId) {
  var check2 = this.contextChecks[checkId + "Check"];
  return this.tokenizer.registerContextChecker(
    checkId,
    check2.startCheck,
    check2.endCheck
  );
}
function tokenizeText() {
  registerContextChecker.call(this, "latinWord");
  registerContextChecker.call(this, "arabicWord");
  registerContextChecker.call(this, "arabicSentence");
  return this.tokenizer.tokenize(this.text);
}
function reverseArabicSentences() {
  var this$1 = this;
  var ranges = this.tokenizer.getContextRanges("arabicSentence");
  ranges.forEach(function(range) {
    var rangeTokens = this$1.tokenizer.getRangeTokens(range);
    this$1.tokenizer.replaceRange(
      range.startIndex,
      range.endOffset,
      rangeTokens.reverse()
    );
  });
}
Bidi.prototype.registerFeatures = function(script, tags) {
  var this$1 = this;
  var supportedTags = tags.filter(
    function(tag) {
      return this$1.query.supports({ script, tag });
    }
  );
  if (!this.featuresTags.hasOwnProperty(script)) {
    this.featuresTags[script] = supportedTags;
  } else {
    this.featuresTags[script] = this.featuresTags[script].concat(supportedTags);
  }
};
Bidi.prototype.applyFeatures = function(font, features) {
  if (!font) {
    throw new Error(
      "No valid font was provided to apply features"
    );
  }
  if (!this.query) {
    this.query = new FeatureQuery(font);
  }
  for (var f26 = 0; f26 < features.length; f26++) {
    var feature = features[f26];
    if (!this.query.supports({ script: feature.script })) {
      continue;
    }
    this.registerFeatures(feature.script, feature.tags);
  }
};
Bidi.prototype.registerModifier = function(modifierId, condition, modifier) {
  this.tokenizer.registerModifier(modifierId, condition, modifier);
};
function checkGlyphIndexStatus() {
  if (this.tokenizer.registeredModifiers.indexOf("glyphIndex") === -1) {
    throw new Error(
      "glyphIndex modifier is required to apply arabic presentation features."
    );
  }
}
function applyArabicPresentationForms() {
  var this$1 = this;
  var script = "arab";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("arabicWord");
  ranges.forEach(function(range) {
    arabicPresentationForms.call(this$1, range);
  });
}
function applyArabicRequireLigatures() {
  var this$1 = this;
  var script = "arab";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  var tags = this.featuresTags[script];
  if (tags.indexOf("rlig") === -1) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("arabicWord");
  ranges.forEach(function(range) {
    arabicRequiredLigatures.call(this$1, range);
  });
}
function applyLatinLigatures() {
  var this$1 = this;
  var script = "latn";
  if (!this.featuresTags.hasOwnProperty(script)) {
    return;
  }
  var tags = this.featuresTags[script];
  if (tags.indexOf("liga") === -1) {
    return;
  }
  checkGlyphIndexStatus.call(this);
  var ranges = this.tokenizer.getContextRanges("latinWord");
  ranges.forEach(function(range) {
    latinLigature.call(this$1, range);
  });
}
Bidi.prototype.checkContextReady = function(contextId) {
  return !!this.tokenizer.getContext(contextId);
};
Bidi.prototype.applyFeaturesToContexts = function() {
  if (this.checkContextReady("arabicWord")) {
    applyArabicPresentationForms.call(this);
    applyArabicRequireLigatures.call(this);
  }
  if (this.checkContextReady("latinWord")) {
    applyLatinLigatures.call(this);
  }
  if (this.checkContextReady("arabicSentence")) {
    reverseArabicSentences.call(this);
  }
};
Bidi.prototype.processText = function(text) {
  if (!this.text || this.text !== text) {
    this.setText(text);
    tokenizeText.call(this);
    this.applyFeaturesToContexts();
  }
};
Bidi.prototype.getBidiText = function(text) {
  this.processText(text);
  return this.tokenizer.getText();
};
Bidi.prototype.getTextGlyphs = function(text) {
  this.processText(text);
  var indexes = [];
  for (var i36 = 0; i36 < this.tokenizer.tokens.length; i36++) {
    var token = this.tokenizer.tokens[i36];
    if (token.state.deleted) {
      continue;
    }
    var index = token.activeState.value;
    indexes.push(Array.isArray(index) ? index[0] : index);
  }
  return indexes;
};
function Font(options) {
  options = options || {};
  options.tables = options.tables || {};
  if (!options.empty) {
    checkArgument(options.familyName, "When creating a new Font object, familyName is required.");
    checkArgument(options.styleName, "When creating a new Font object, styleName is required.");
    checkArgument(options.unitsPerEm, "When creating a new Font object, unitsPerEm is required.");
    checkArgument(options.ascender, "When creating a new Font object, ascender is required.");
    checkArgument(options.descender <= 0, "When creating a new Font object, negative descender value is required.");
    this.names = {
      fontFamily: { en: options.familyName || " " },
      fontSubfamily: { en: options.styleName || " " },
      fullName: { en: options.fullName || options.familyName + " " + options.styleName },
      // postScriptName may not contain any whitespace
      postScriptName: { en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, "") },
      designer: { en: options.designer || " " },
      designerURL: { en: options.designerURL || " " },
      manufacturer: { en: options.manufacturer || " " },
      manufacturerURL: { en: options.manufacturerURL || " " },
      license: { en: options.license || " " },
      licenseURL: { en: options.licenseURL || " " },
      version: { en: options.version || "Version 0.1" },
      description: { en: options.description || " " },
      copyright: { en: options.copyright || " " },
      trademark: { en: options.trademark || " " }
    };
    this.unitsPerEm = options.unitsPerEm || 1e3;
    this.ascender = options.ascender;
    this.descender = options.descender;
    this.createdTimestamp = options.createdTimestamp;
    this.tables = Object.assign(options.tables, {
      os2: Object.assign({
        usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
        usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
        fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
      }, options.tables.os2)
    });
  }
  this.supported = true;
  this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
  this.encoding = new DefaultEncoding(this);
  this.position = new Position(this);
  this.substitution = new Substitution(this);
  this.tables = this.tables || {};
  this._push = null;
  this._hmtxTableData = {};
  Object.defineProperty(this, "hinting", {
    get: function() {
      if (this._hinting) {
        return this._hinting;
      }
      if (this.outlinesFormat === "truetype") {
        return this._hinting = new Hinting(this);
      }
    }
  });
}
Font.prototype.hasChar = function(c30) {
  return this.encoding.charToGlyphIndex(c30) !== null;
};
Font.prototype.charToGlyphIndex = function(s33) {
  return this.encoding.charToGlyphIndex(s33);
};
Font.prototype.charToGlyph = function(c30) {
  var glyphIndex = this.charToGlyphIndex(c30);
  var glyph = this.glyphs.get(glyphIndex);
  if (!glyph) {
    glyph = this.glyphs.get(0);
  }
  return glyph;
};
Font.prototype.updateFeatures = function(options) {
  return this.defaultRenderOptions.features.map(function(feature) {
    if (feature.script === "latn") {
      return {
        script: "latn",
        tags: feature.tags.filter(function(tag) {
          return options[tag];
        })
      };
    } else {
      return feature;
    }
  });
};
Font.prototype.stringToGlyphs = function(s33, options) {
  var this$1 = this;
  var bidi = new Bidi();
  var charToGlyphIndexMod = function(token) {
    return this$1.charToGlyphIndex(token.char);
  };
  bidi.registerModifier("glyphIndex", null, charToGlyphIndexMod);
  var features = options ? this.updateFeatures(options.features) : this.defaultRenderOptions.features;
  bidi.applyFeatures(this, features);
  var indexes = bidi.getTextGlyphs(s33);
  var length = indexes.length;
  var glyphs = new Array(length);
  var notdef = this.glyphs.get(0);
  for (var i36 = 0; i36 < length; i36 += 1) {
    glyphs[i36] = this.glyphs.get(indexes[i36]) || notdef;
  }
  return glyphs;
};
Font.prototype.nameToGlyphIndex = function(name) {
  return this.glyphNames.nameToGlyphIndex(name);
};
Font.prototype.nameToGlyph = function(name) {
  var glyphIndex = this.nameToGlyphIndex(name);
  var glyph = this.glyphs.get(glyphIndex);
  if (!glyph) {
    glyph = this.glyphs.get(0);
  }
  return glyph;
};
Font.prototype.glyphIndexToName = function(gid) {
  if (!this.glyphNames.glyphIndexToName) {
    return "";
  }
  return this.glyphNames.glyphIndexToName(gid);
};
Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
  leftGlyph = leftGlyph.index || leftGlyph;
  rightGlyph = rightGlyph.index || rightGlyph;
  var gposKerning = this.position.defaultKerningTables;
  if (gposKerning) {
    return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
  }
  return this.kerningPairs[leftGlyph + "," + rightGlyph] || 0;
};
Font.prototype.defaultRenderOptions = {
  kerning: true,
  features: [
    /**
     * these 4 features are required to render Arabic text properly
     * and shouldn't be turned off when rendering arabic text.
     */
    { script: "arab", tags: ["init", "medi", "fina", "rlig"] },
    { script: "latn", tags: ["liga", "rlig"] }
  ]
};
Font.prototype.forEachGlyph = function(text, x19, y22, fontSize, options, callback) {
  x19 = x19 !== void 0 ? x19 : 0;
  y22 = y22 !== void 0 ? y22 : 0;
  fontSize = fontSize !== void 0 ? fontSize : 72;
  options = Object.assign({}, this.defaultRenderOptions, options);
  var fontScale = 1 / this.unitsPerEm * fontSize;
  var glyphs = this.stringToGlyphs(text, options);
  var kerningLookups;
  if (options.kerning) {
    var script = options.script || this.position.getDefaultScriptName();
    kerningLookups = this.position.getKerningTables(script, options.language);
  }
  for (var i36 = 0; i36 < glyphs.length; i36 += 1) {
    var glyph = glyphs[i36];
    callback.call(this, glyph, x19, y22, fontSize, options);
    if (glyph.advanceWidth) {
      x19 += glyph.advanceWidth * fontScale;
    }
    if (options.kerning && i36 < glyphs.length - 1) {
      var kerningValue = kerningLookups ? this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i36 + 1].index) : this.getKerningValue(glyph, glyphs[i36 + 1]);
      x19 += kerningValue * fontScale;
    }
    if (options.letterSpacing) {
      x19 += options.letterSpacing * fontSize;
    } else if (options.tracking) {
      x19 += options.tracking / 1e3 * fontSize;
    }
  }
  return x19;
};
Font.prototype.getPath = function(text, x19, y22, fontSize, options) {
  var fullPath = new Path();
  this.forEachGlyph(text, x19, y22, fontSize, options, function(glyph, gX, gY, gFontSize) {
    var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
    fullPath.extend(glyphPath);
  });
  return fullPath;
};
Font.prototype.getPaths = function(text, x19, y22, fontSize, options) {
  var glyphPaths = [];
  this.forEachGlyph(text, x19, y22, fontSize, options, function(glyph, gX, gY, gFontSize) {
    var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
    glyphPaths.push(glyphPath);
  });
  return glyphPaths;
};
Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
  return this.forEachGlyph(text, 0, 0, fontSize, options, function() {
  });
};
Font.prototype.draw = function(ctx, text, x19, y22, fontSize, options) {
  this.getPath(text, x19, y22, fontSize, options).draw(ctx);
};
Font.prototype.drawPoints = function(ctx, text, x19, y22, fontSize, options) {
  this.forEachGlyph(text, x19, y22, fontSize, options, function(glyph, gX, gY, gFontSize) {
    glyph.drawPoints(ctx, gX, gY, gFontSize);
  });
};
Font.prototype.drawMetrics = function(ctx, text, x19, y22, fontSize, options) {
  this.forEachGlyph(text, x19, y22, fontSize, options, function(glyph, gX, gY, gFontSize) {
    glyph.drawMetrics(ctx, gX, gY, gFontSize);
  });
};
Font.prototype.getEnglishName = function(name) {
  var translations = this.names[name];
  if (translations) {
    return translations.en;
  }
};
Font.prototype.validate = function() {
  var _this = this;
  function assert(predicate, message) {
  }
  function assertNamePresent(name) {
    var englishName = _this.getEnglishName(name);
    assert(englishName && englishName.trim().length > 0);
  }
  assertNamePresent("fontFamily");
  assertNamePresent("weightName");
  assertNamePresent("manufacturer");
  assertNamePresent("copyright");
  assertNamePresent("version");
  assert(this.unitsPerEm > 0);
};
Font.prototype.toTables = function() {
  return sfnt.fontToTable(this);
};
Font.prototype.toBuffer = function() {
  console.warn("Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.");
  return this.toArrayBuffer();
};
Font.prototype.toArrayBuffer = function() {
  var sfntTable = this.toTables();
  var bytes = sfntTable.encode();
  var buffer = new ArrayBuffer(bytes.length);
  var intArray = new Uint8Array(buffer);
  for (var i36 = 0; i36 < bytes.length; i36++) {
    intArray[i36] = bytes[i36];
  }
  return buffer;
};
Font.prototype.download = function(fileName) {
  var familyName = this.getEnglishName("fontFamily");
  var styleName = this.getEnglishName("fontSubfamily");
  fileName = fileName || familyName.replace(/\s/g, "") + "-" + styleName + ".otf";
  var arrayBuffer = this.toArrayBuffer();
  if (isBrowser()) {
    window.URL = window.URL || window.webkitURL;
    if (window.URL) {
      var dataView = new DataView(arrayBuffer);
      var blob = new Blob([dataView], { type: "font/opentype" });
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, false);
      link.dispatchEvent(event);
    } else {
      console.warn("Font file could not be downloaded. Try using a different browser.");
    }
  } else {
    var fs = require_fs();
    var buffer = arrayBufferToNodeBuffer(arrayBuffer);
    fs.writeFileSync(fileName, buffer);
  }
};
Font.prototype.fsSelectionValues = {
  ITALIC: 1,
  //1
  UNDERSCORE: 2,
  //2
  NEGATIVE: 4,
  //4
  OUTLINED: 8,
  //8
  STRIKEOUT: 16,
  //16
  BOLD: 32,
  //32
  REGULAR: 64,
  //64
  USER_TYPO_METRICS: 128,
  //128
  WWS: 256,
  //256
  OBLIQUE: 512
  //512
};
Font.prototype.usWidthClasses = {
  ULTRA_CONDENSED: 1,
  EXTRA_CONDENSED: 2,
  CONDENSED: 3,
  SEMI_CONDENSED: 4,
  MEDIUM: 5,
  SEMI_EXPANDED: 6,
  EXPANDED: 7,
  EXTRA_EXPANDED: 8,
  ULTRA_EXPANDED: 9
};
Font.prototype.usWeightClasses = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900
};
function addName(name, names) {
  var nameString = JSON.stringify(name);
  var nameID = 256;
  for (var nameKey in names) {
    var n39 = parseInt(nameKey);
    if (!n39 || n39 < 256) {
      continue;
    }
    if (JSON.stringify(names[nameKey]) === nameString) {
      return n39;
    }
    if (nameID <= n39) {
      nameID = n39 + 1;
    }
  }
  names[nameID] = name;
  return nameID;
}
function makeFvarAxis(n39, axis, names) {
  var nameID = addName(axis.name, names);
  return [
    { name: "tag_" + n39, type: "TAG", value: axis.tag },
    { name: "minValue_" + n39, type: "FIXED", value: axis.minValue << 16 },
    { name: "defaultValue_" + n39, type: "FIXED", value: axis.defaultValue << 16 },
    { name: "maxValue_" + n39, type: "FIXED", value: axis.maxValue << 16 },
    { name: "flags_" + n39, type: "USHORT", value: 0 },
    { name: "nameID_" + n39, type: "USHORT", value: nameID }
  ];
}
function parseFvarAxis(data, start, names) {
  var axis = {};
  var p28 = new parse.Parser(data, start);
  axis.tag = p28.parseTag();
  axis.minValue = p28.parseFixed();
  axis.defaultValue = p28.parseFixed();
  axis.maxValue = p28.parseFixed();
  p28.skip("uShort", 1);
  axis.name = names[p28.parseUShort()] || {};
  return axis;
}
function makeFvarInstance(n39, inst, axes, names) {
  var nameID = addName(inst.name, names);
  var fields = [
    { name: "nameID_" + n39, type: "USHORT", value: nameID },
    { name: "flags_" + n39, type: "USHORT", value: 0 }
  ];
  for (var i36 = 0; i36 < axes.length; ++i36) {
    var axisTag = axes[i36].tag;
    fields.push({
      name: "axis_" + n39 + " " + axisTag,
      type: "FIXED",
      value: inst.coordinates[axisTag] << 16
    });
  }
  return fields;
}
function parseFvarInstance(data, start, axes, names) {
  var inst = {};
  var p28 = new parse.Parser(data, start);
  inst.name = names[p28.parseUShort()] || {};
  p28.skip("uShort", 1);
  inst.coordinates = {};
  for (var i36 = 0; i36 < axes.length; ++i36) {
    inst.coordinates[axes[i36].tag] = p28.parseFixed();
  }
  return inst;
}
function makeFvarTable(fvar2, names) {
  var result = new table.Table("fvar", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "offsetToData", type: "USHORT", value: 0 },
    { name: "countSizePairs", type: "USHORT", value: 2 },
    { name: "axisCount", type: "USHORT", value: fvar2.axes.length },
    { name: "axisSize", type: "USHORT", value: 20 },
    { name: "instanceCount", type: "USHORT", value: fvar2.instances.length },
    { name: "instanceSize", type: "USHORT", value: 4 + fvar2.axes.length * 4 }
  ]);
  result.offsetToData = result.sizeOf();
  for (var i36 = 0; i36 < fvar2.axes.length; i36++) {
    result.fields = result.fields.concat(makeFvarAxis(i36, fvar2.axes[i36], names));
  }
  for (var j9 = 0; j9 < fvar2.instances.length; j9++) {
    result.fields = result.fields.concat(makeFvarInstance(j9, fvar2.instances[j9], fvar2.axes, names));
  }
  return result;
}
function parseFvarTable(data, start, names) {
  var p28 = new parse.Parser(data, start);
  var tableVersion = p28.parseULong();
  check.argument(tableVersion === 65536, "Unsupported fvar table version.");
  var offsetToData = p28.parseOffset16();
  p28.skip("uShort", 1);
  var axisCount = p28.parseUShort();
  var axisSize = p28.parseUShort();
  var instanceCount = p28.parseUShort();
  var instanceSize = p28.parseUShort();
  var axes = [];
  for (var i36 = 0; i36 < axisCount; i36++) {
    axes.push(parseFvarAxis(data, start + offsetToData + i36 * axisSize, names));
  }
  var instances = [];
  var instanceStart = start + offsetToData + axisCount * axisSize;
  for (var j9 = 0; j9 < instanceCount; j9++) {
    instances.push(parseFvarInstance(data, instanceStart + j9 * instanceSize, axes, names));
  }
  return { axes, instances };
}
var fvar = { make: makeFvarTable, parse: parseFvarTable };
var attachList = function() {
  return {
    coverage: this.parsePointer(Parser.coverage),
    attachPoints: this.parseList(Parser.pointer(Parser.uShortList))
  };
};
var caretValue = function() {
  var format = this.parseUShort();
  check.argument(
    format === 1 || format === 2 || format === 3,
    "Unsupported CaretValue table version."
  );
  if (format === 1) {
    return { coordinate: this.parseShort() };
  } else if (format === 2) {
    return { pointindex: this.parseShort() };
  } else if (format === 3) {
    return { coordinate: this.parseShort() };
  }
};
var ligGlyph = function() {
  return this.parseList(Parser.pointer(caretValue));
};
var ligCaretList = function() {
  return {
    coverage: this.parsePointer(Parser.coverage),
    ligGlyphs: this.parseList(Parser.pointer(ligGlyph))
  };
};
var markGlyphSets = function() {
  this.parseUShort();
  return this.parseList(Parser.pointer(Parser.coverage));
};
function parseGDEFTable(data, start) {
  start = start || 0;
  var p28 = new Parser(data, start);
  var tableVersion = p28.parseVersion(1);
  check.argument(
    tableVersion === 1 || tableVersion === 1.2 || tableVersion === 1.3,
    "Unsupported GDEF table version."
  );
  var gdef2 = {
    version: tableVersion,
    classDef: p28.parsePointer(Parser.classDef),
    attachList: p28.parsePointer(attachList),
    ligCaretList: p28.parsePointer(ligCaretList),
    markAttachClassDef: p28.parsePointer(Parser.classDef)
  };
  if (tableVersion >= 1.2) {
    gdef2.markGlyphSets = p28.parsePointer(markGlyphSets);
  }
  return gdef2;
}
var gdef = { parse: parseGDEFTable };
var subtableParsers$1 = new Array(10);
subtableParsers$1[1] = function parseLookup12() {
  var start = this.offset + this.relativeOffset;
  var posformat = this.parseUShort();
  if (posformat === 1) {
    return {
      posFormat: 1,
      coverage: this.parsePointer(Parser.coverage),
      value: this.parseValueRecord()
    };
  } else if (posformat === 2) {
    return {
      posFormat: 2,
      coverage: this.parsePointer(Parser.coverage),
      values: this.parseValueRecordList()
    };
  }
  check.assert(false, "0x" + start.toString(16) + ": GPOS lookup type 1 format must be 1 or 2.");
};
subtableParsers$1[2] = function parseLookup22() {
  var start = this.offset + this.relativeOffset;
  var posFormat = this.parseUShort();
  check.assert(posFormat === 1 || posFormat === 2, "0x" + start.toString(16) + ": GPOS lookup type 2 format must be 1 or 2.");
  var coverage = this.parsePointer(Parser.coverage);
  var valueFormat1 = this.parseUShort();
  var valueFormat2 = this.parseUShort();
  if (posFormat === 1) {
    return {
      posFormat,
      coverage,
      valueFormat1,
      valueFormat2,
      pairSets: this.parseList(Parser.pointer(Parser.list(function() {
        return {
          // pairValueRecord
          secondGlyph: this.parseUShort(),
          value1: this.parseValueRecord(valueFormat1),
          value2: this.parseValueRecord(valueFormat2)
        };
      })))
    };
  } else if (posFormat === 2) {
    var classDef1 = this.parsePointer(Parser.classDef);
    var classDef2 = this.parsePointer(Parser.classDef);
    var class1Count = this.parseUShort();
    var class2Count = this.parseUShort();
    return {
      // Class Pair Adjustment
      posFormat,
      coverage,
      valueFormat1,
      valueFormat2,
      classDef1,
      classDef2,
      class1Count,
      class2Count,
      classRecords: this.parseList(class1Count, Parser.list(class2Count, function() {
        return {
          value1: this.parseValueRecord(valueFormat1),
          value2: this.parseValueRecord(valueFormat2)
        };
      }))
    };
  }
};
subtableParsers$1[3] = function parseLookup32() {
  return { error: "GPOS Lookup 3 not supported" };
};
subtableParsers$1[4] = function parseLookup42() {
  return { error: "GPOS Lookup 4 not supported" };
};
subtableParsers$1[5] = function parseLookup52() {
  return { error: "GPOS Lookup 5 not supported" };
};
subtableParsers$1[6] = function parseLookup62() {
  return { error: "GPOS Lookup 6 not supported" };
};
subtableParsers$1[7] = function parseLookup72() {
  return { error: "GPOS Lookup 7 not supported" };
};
subtableParsers$1[8] = function parseLookup82() {
  return { error: "GPOS Lookup 8 not supported" };
};
subtableParsers$1[9] = function parseLookup9() {
  return { error: "GPOS Lookup 9 not supported" };
};
function parseGposTable(data, start) {
  start = start || 0;
  var p28 = new Parser(data, start);
  var tableVersion = p28.parseVersion(1);
  check.argument(tableVersion === 1 || tableVersion === 1.1, "Unsupported GPOS table version " + tableVersion);
  if (tableVersion === 1) {
    return {
      version: tableVersion,
      scripts: p28.parseScriptList(),
      features: p28.parseFeatureList(),
      lookups: p28.parseLookupList(subtableParsers$1)
    };
  } else {
    return {
      version: tableVersion,
      scripts: p28.parseScriptList(),
      features: p28.parseFeatureList(),
      lookups: p28.parseLookupList(subtableParsers$1),
      variations: p28.parseFeatureVariationsList()
    };
  }
}
var subtableMakers$1 = new Array(10);
function makeGposTable(gpos2) {
  return new table.Table("GPOS", [
    { name: "version", type: "ULONG", value: 65536 },
    { name: "scripts", type: "TABLE", value: new table.ScriptList(gpos2.scripts) },
    { name: "features", type: "TABLE", value: new table.FeatureList(gpos2.features) },
    { name: "lookups", type: "TABLE", value: new table.LookupList(gpos2.lookups, subtableMakers$1) }
  ]);
}
var gpos = { parse: parseGposTable, make: makeGposTable };
function parseWindowsKernTable(p28) {
  var pairs = {};
  p28.skip("uShort");
  var subtableVersion = p28.parseUShort();
  check.argument(subtableVersion === 0, "Unsupported kern sub-table version.");
  p28.skip("uShort", 2);
  var nPairs = p28.parseUShort();
  p28.skip("uShort", 3);
  for (var i36 = 0; i36 < nPairs; i36 += 1) {
    var leftIndex = p28.parseUShort();
    var rightIndex = p28.parseUShort();
    var value = p28.parseShort();
    pairs[leftIndex + "," + rightIndex] = value;
  }
  return pairs;
}
function parseMacKernTable(p28) {
  var pairs = {};
  p28.skip("uShort");
  var nTables = p28.parseULong();
  if (nTables > 1) {
    console.warn("Only the first kern subtable is supported.");
  }
  p28.skip("uLong");
  var coverage = p28.parseUShort();
  var subtableVersion = coverage & 255;
  p28.skip("uShort");
  if (subtableVersion === 0) {
    var nPairs = p28.parseUShort();
    p28.skip("uShort", 3);
    for (var i36 = 0; i36 < nPairs; i36 += 1) {
      var leftIndex = p28.parseUShort();
      var rightIndex = p28.parseUShort();
      var value = p28.parseShort();
      pairs[leftIndex + "," + rightIndex] = value;
    }
  }
  return pairs;
}
function parseKernTable(data, start) {
  var p28 = new parse.Parser(data, start);
  var tableVersion = p28.parseUShort();
  if (tableVersion === 0) {
    return parseWindowsKernTable(p28);
  } else if (tableVersion === 1) {
    return parseMacKernTable(p28);
  } else {
    throw new Error("Unsupported kern table version (" + tableVersion + ").");
  }
}
var kern = { parse: parseKernTable };
function parseLocaTable(data, start, numGlyphs, shortVersion) {
  var p28 = new parse.Parser(data, start);
  var parseFn = shortVersion ? p28.parseUShort : p28.parseULong;
  var glyphOffsets = [];
  for (var i36 = 0; i36 < numGlyphs + 1; i36 += 1) {
    var glyphOffset = parseFn.call(p28);
    if (shortVersion) {
      glyphOffset *= 2;
    }
    glyphOffsets.push(glyphOffset);
  }
  return glyphOffsets;
}
var loca = { parse: parseLocaTable };
function parseOpenTypeTableEntries(data, numTables) {
  var tableEntries = [];
  var p28 = 12;
  for (var i36 = 0; i36 < numTables; i36 += 1) {
    var tag = parse.getTag(data, p28);
    var checksum = parse.getULong(data, p28 + 4);
    var offset = parse.getULong(data, p28 + 8);
    var length = parse.getULong(data, p28 + 12);
    tableEntries.push({ tag, checksum, offset, length, compression: false });
    p28 += 16;
  }
  return tableEntries;
}
function parseWOFFTableEntries(data, numTables) {
  var tableEntries = [];
  var p28 = 44;
  for (var i36 = 0; i36 < numTables; i36 += 1) {
    var tag = parse.getTag(data, p28);
    var offset = parse.getULong(data, p28 + 4);
    var compLength = parse.getULong(data, p28 + 8);
    var origLength = parse.getULong(data, p28 + 12);
    var compression = void 0;
    if (compLength < origLength) {
      compression = "WOFF";
    } else {
      compression = false;
    }
    tableEntries.push({
      tag,
      offset,
      compression,
      compressedLength: compLength,
      length: origLength
    });
    p28 += 20;
  }
  return tableEntries;
}
function uncompressTable(data, tableEntry) {
  if (tableEntry.compression === "WOFF") {
    var inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
    var outBuffer = new Uint8Array(tableEntry.length);
    tinyInflate(inBuffer, outBuffer);
    if (outBuffer.byteLength !== tableEntry.length) {
      throw new Error("Decompression error: " + tableEntry.tag + " decompressed length doesn't match recorded length");
    }
    var view = new DataView(outBuffer.buffer, 0);
    return { data: view, offset: 0 };
  } else {
    return { data, offset: tableEntry.offset };
  }
}
function parseBuffer(buffer, opt) {
  opt = opt === void 0 || opt === null ? {} : opt;
  var indexToLocFormat;
  var ltagTable;
  var font = new Font({ empty: true });
  var data = new DataView(buffer, 0);
  var numTables;
  var tableEntries = [];
  var signature = parse.getTag(data, 0);
  if (signature === String.fromCharCode(0, 1, 0, 0) || signature === "true" || signature === "typ1") {
    font.outlinesFormat = "truetype";
    numTables = parse.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === "OTTO") {
    font.outlinesFormat = "cff";
    numTables = parse.getUShort(data, 4);
    tableEntries = parseOpenTypeTableEntries(data, numTables);
  } else if (signature === "wOFF") {
    var flavor = parse.getTag(data, 4);
    if (flavor === String.fromCharCode(0, 1, 0, 0)) {
      font.outlinesFormat = "truetype";
    } else if (flavor === "OTTO") {
      font.outlinesFormat = "cff";
    } else {
      throw new Error("Unsupported OpenType flavor " + signature);
    }
    numTables = parse.getUShort(data, 12);
    tableEntries = parseWOFFTableEntries(data, numTables);
  } else {
    throw new Error("Unsupported OpenType signature " + signature);
  }
  var cffTableEntry;
  var fvarTableEntry;
  var glyfTableEntry;
  var gdefTableEntry;
  var gposTableEntry;
  var gsubTableEntry;
  var hmtxTableEntry;
  var kernTableEntry;
  var locaTableEntry;
  var nameTableEntry;
  var metaTableEntry;
  var p28;
  for (var i36 = 0; i36 < numTables; i36 += 1) {
    var tableEntry = tableEntries[i36];
    var table2 = void 0;
    switch (tableEntry.tag) {
      case "cmap":
        table2 = uncompressTable(data, tableEntry);
        font.tables.cmap = cmap.parse(table2.data, table2.offset);
        font.encoding = new CmapEncoding(font.tables.cmap);
        break;
      case "cvt ":
        table2 = uncompressTable(data, tableEntry);
        p28 = new parse.Parser(table2.data, table2.offset);
        font.tables.cvt = p28.parseShortList(tableEntry.length / 2);
        break;
      case "fvar":
        fvarTableEntry = tableEntry;
        break;
      case "fpgm":
        table2 = uncompressTable(data, tableEntry);
        p28 = new parse.Parser(table2.data, table2.offset);
        font.tables.fpgm = p28.parseByteList(tableEntry.length);
        break;
      case "head":
        table2 = uncompressTable(data, tableEntry);
        font.tables.head = head.parse(table2.data, table2.offset);
        font.unitsPerEm = font.tables.head.unitsPerEm;
        indexToLocFormat = font.tables.head.indexToLocFormat;
        break;
      case "hhea":
        table2 = uncompressTable(data, tableEntry);
        font.tables.hhea = hhea.parse(table2.data, table2.offset);
        font.ascender = font.tables.hhea.ascender;
        font.descender = font.tables.hhea.descender;
        font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
        break;
      case "hmtx":
        hmtxTableEntry = tableEntry;
        break;
      case "ltag":
        table2 = uncompressTable(data, tableEntry);
        ltagTable = ltag.parse(table2.data, table2.offset);
        break;
      case "maxp":
        table2 = uncompressTable(data, tableEntry);
        font.tables.maxp = maxp.parse(table2.data, table2.offset);
        font.numGlyphs = font.tables.maxp.numGlyphs;
        break;
      case "name":
        nameTableEntry = tableEntry;
        break;
      case "OS/2":
        table2 = uncompressTable(data, tableEntry);
        font.tables.os2 = os2.parse(table2.data, table2.offset);
        break;
      case "post":
        table2 = uncompressTable(data, tableEntry);
        font.tables.post = post.parse(table2.data, table2.offset);
        font.glyphNames = new GlyphNames(font.tables.post);
        break;
      case "prep":
        table2 = uncompressTable(data, tableEntry);
        p28 = new parse.Parser(table2.data, table2.offset);
        font.tables.prep = p28.parseByteList(tableEntry.length);
        break;
      case "glyf":
        glyfTableEntry = tableEntry;
        break;
      case "loca":
        locaTableEntry = tableEntry;
        break;
      case "CFF ":
        cffTableEntry = tableEntry;
        break;
      case "kern":
        kernTableEntry = tableEntry;
        break;
      case "GDEF":
        gdefTableEntry = tableEntry;
        break;
      case "GPOS":
        gposTableEntry = tableEntry;
        break;
      case "GSUB":
        gsubTableEntry = tableEntry;
        break;
      case "meta":
        metaTableEntry = tableEntry;
        break;
    }
  }
  var nameTable = uncompressTable(data, nameTableEntry);
  font.tables.name = _name.parse(nameTable.data, nameTable.offset, ltagTable);
  font.names = font.tables.name;
  if (glyfTableEntry && locaTableEntry) {
    var shortVersion = indexToLocFormat === 0;
    var locaTable = uncompressTable(data, locaTableEntry);
    var locaOffsets = loca.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
    var glyfTable = uncompressTable(data, glyfTableEntry);
    font.glyphs = glyf.parse(glyfTable.data, glyfTable.offset, locaOffsets, font, opt);
  } else if (cffTableEntry) {
    var cffTable = uncompressTable(data, cffTableEntry);
    cff.parse(cffTable.data, cffTable.offset, font, opt);
  } else {
    throw new Error("Font doesn't contain TrueType or CFF outlines.");
  }
  var hmtxTable = uncompressTable(data, hmtxTableEntry);
  hmtx.parse(font, hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs, opt);
  addGlyphNames(font, opt);
  if (kernTableEntry) {
    var kernTable = uncompressTable(data, kernTableEntry);
    font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
  } else {
    font.kerningPairs = {};
  }
  if (gdefTableEntry) {
    var gdefTable = uncompressTable(data, gdefTableEntry);
    font.tables.gdef = gdef.parse(gdefTable.data, gdefTable.offset);
  }
  if (gposTableEntry) {
    var gposTable = uncompressTable(data, gposTableEntry);
    font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
    font.position.init();
  }
  if (gsubTableEntry) {
    var gsubTable = uncompressTable(data, gsubTableEntry);
    font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
  }
  if (fvarTableEntry) {
    var fvarTable = uncompressTable(data, fvarTableEntry);
    font.tables.fvar = fvar.parse(fvarTable.data, fvarTable.offset, font.names);
  }
  if (metaTableEntry) {
    var metaTable = uncompressTable(data, metaTableEntry);
    font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
    font.metas = font.tables.meta;
  }
  return font;
}
export {
  i35 as bakeFontPipeline,
  f10 as bitmap,
  d22 as bitmapBakerFromCore,
  b4 as bitmapCodec,
  l27 as createBitmapBaker,
  c19 as createFontBaker,
  ue as createFontLibrary,
  g15 as createRasterCodecProgram,
  t30 as createResolvedRasterBakePlan,
  a7 as defineCodecBuffers,
  t28 as defineGlyphConfig,
  e26 as defineGlyphSchema,
  l25 as glyph,
  l2 as id,
  parseBuffer as parseOpenType,
  n37 as resourceLease
};
