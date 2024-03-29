(() => {
  'use strict';
  var e = {};
  (() => {
    e.d = (r, t) => {
      for (var n in t) {
        if (e.o(t, n) && !e.o(r, n)) {
          Object.defineProperty(r, n, { enumerable: true, get: t[n] });
        }
      }
    };
  })();
  (() => {
    e.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r);
  })();
  (() => {
    e.r = (e) => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(e, '__esModule', { value: true });
    };
  })();
  if (typeof e !== 'undefined') e.ab = __dirname + '/';
  var r = {};
  e.r(r);
  e.d(r, {
    Chalk: () => Chalk,
    backgroundColorNames: () => l,
    backgroundColors: () => l,
    chalkStderr: () => F,
    colorNames: () => i,
    colors: () => i,
    default: () => I,
    foregroundColorNames: () => s,
    foregroundColors: () => s,
    modifierNames: () => o,
    modifiers: () => o,
    supportsColor: () => m,
    supportsColorStderr: () => O,
  });
  const t = 10;
  const wrapAnsi16 =
    (e = 0) =>
    (r) =>
      `[${r + e}m`;
  const wrapAnsi256 =
    (e = 0) =>
    (r) =>
      `[${38 + e};5;${r}m`;
  const wrapAnsi16m =
    (e = 0) =>
    (r, t, n) =>
      `[${38 + e};2;${r};${t};${n}m`;
  const n = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      gray: [90, 39],
      grey: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39],
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49],
    },
  };
  const o = Object.keys(n.modifier);
  const s = Object.keys(n.color);
  const l = Object.keys(n.bgColor);
  const i = [...s, ...l];
  function assembleStyles() {
    const e = new Map();
    for (const [r, t] of Object.entries(n)) {
      for (const [r, o] of Object.entries(t)) {
        n[r] = { open: `[${o[0]}m`, close: `[${o[1]}m` };
        t[r] = n[r];
        e.set(o[0], o[1]);
      }
      Object.defineProperty(n, r, { value: t, enumerable: false });
    }
    Object.defineProperty(n, 'codes', { value: e, enumerable: false });
    n.color.close = '[39m';
    n.bgColor.close = '[49m';
    n.color.ansi = wrapAnsi16();
    n.color.ansi256 = wrapAnsi256();
    n.color.ansi16m = wrapAnsi16m();
    n.bgColor.ansi = wrapAnsi16(t);
    n.bgColor.ansi256 = wrapAnsi256(t);
    n.bgColor.ansi16m = wrapAnsi16m(t);
    Object.defineProperties(n, {
      rgbToAnsi256: {
        value(e, r, t) {
          if (e === r && r === t) {
            if (e < 8) {
              return 16;
            }
            if (e > 248) {
              return 231;
            }
            return Math.round(((e - 8) / 247) * 24) + 232;
          }
          return 16 + 36 * Math.round((e / 255) * 5) + 6 * Math.round((r / 255) * 5) + Math.round((t / 255) * 5);
        },
        enumerable: false,
      },
      hexToRgb: {
        value(e) {
          const r = /[a-f\d]{6}|[a-f\d]{3}/i.exec(e.toString(16));
          if (!r) {
            return [0, 0, 0];
          }
          let [t] = r;
          if (t.length === 3) {
            t = [...t].map((e) => e + e).join('');
          }
          const n = Number.parseInt(t, 16);
          return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        },
        enumerable: false,
      },
      hexToAnsi256: { value: (e) => n.rgbToAnsi256(...n.hexToRgb(e)), enumerable: false },
      ansi256ToAnsi: {
        value(e) {
          if (e < 8) {
            return 30 + e;
          }
          if (e < 16) {
            return 90 + (e - 8);
          }
          let r;
          let t;
          let n;
          if (e >= 232) {
            r = ((e - 232) * 10 + 8) / 255;
            t = r;
            n = r;
          } else {
            e -= 16;
            const o = e % 36;
            r = Math.floor(e / 36) / 5;
            t = Math.floor(o / 6) / 5;
            n = (o % 6) / 5;
          }
          const o = Math.max(r, t, n) * 2;
          if (o === 0) {
            return 30;
          }
          let s = 30 + ((Math.round(n) << 2) | (Math.round(t) << 1) | Math.round(r));
          if (o === 2) {
            s += 60;
          }
          return s;
        },
        enumerable: false,
      },
      rgbToAnsi: { value: (e, r, t) => n.ansi256ToAnsi(n.rgbToAnsi256(e, r, t)), enumerable: false },
      hexToAnsi: { value: (e) => n.ansi256ToAnsi(n.hexToAnsi256(e)), enumerable: false },
    });
    return n;
  }
  const a = assembleStyles();
  const c = a;
  const u = require('node:process');
  const f = require('node:os');
  const g = require('node:tty');
  function hasFlag(e, r = globalThis.Deno ? globalThis.Deno.args : u.argv) {
    const t = e.startsWith('-') ? '' : e.length === 1 ? '-' : '--';
    const n = r.indexOf(t + e);
    const o = r.indexOf('--');
    return n !== -1 && (o === -1 || n < o);
  }
  const { env: h } = u;
  let b;
  if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never')) {
    b = 0;
  } else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always')) {
    b = 1;
  }
  function envForceColor() {
    if ('FORCE_COLOR' in h) {
      if (h.FORCE_COLOR === 'true') {
        return 1;
      }
      if (h.FORCE_COLOR === 'false') {
        return 0;
      }
      return h.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(h.FORCE_COLOR, 10), 3);
    }
  }
  function translateLevel(e) {
    if (e === 0) {
      return false;
    }
    return { level: e, hasBasic: true, has256: e >= 2, has16m: e >= 3 };
  }
  function _supportsColor(e, { streamIsTTY: r, sniffFlags: t = true } = {}) {
    const n = envForceColor();
    if (n !== undefined) {
      b = n;
    }
    const o = t ? b : n;
    if (o === 0) {
      return 0;
    }
    if (t) {
      if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
        return 3;
      }
      if (hasFlag('color=256')) {
        return 2;
      }
    }
    if ('TF_BUILD' in h && 'AGENT_NAME' in h) {
      return 1;
    }
    if (e && !r && o === undefined) {
      return 0;
    }
    const s = o || 0;
    if (h.TERM === 'dumb') {
      return s;
    }
    if (u.platform === 'win32') {
      const e = f.release().split('.');
      if (Number(e[0]) >= 10 && Number(e[2]) >= 10586) {
        return Number(e[2]) >= 14931 ? 3 : 2;
      }
      return 1;
    }
    if ('CI' in h) {
      if ('GITHUB_ACTIONS' in h) {
        return 3;
      }
      if (
        ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some((e) => e in h) ||
        h.CI_NAME === 'codeship'
      ) {
        return 1;
      }
      return s;
    }
    if ('TEAMCITY_VERSION' in h) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(h.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (h.COLORTERM === 'truecolor') {
      return 3;
    }
    if (h.TERM === 'xterm-kitty') {
      return 3;
    }
    if ('TERM_PROGRAM' in h) {
      const e = Number.parseInt((h.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
      switch (h.TERM_PROGRAM) {
        case 'iTerm.app': {
          return e >= 3 ? 3 : 2;
        }
        case 'Apple_Terminal': {
          return 2;
        }
      }
    }
    if (/-256(color)?$/i.test(h.TERM)) {
      return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(h.TERM)) {
      return 1;
    }
    if ('COLORTERM' in h) {
      return 1;
    }
    return s;
  }
  function createSupportsColor(e, r = {}) {
    const t = _supportsColor(e, { streamIsTTY: e && e.isTTY, ...r });
    return translateLevel(t);
  }
  const d = {
    stdout: createSupportsColor({ isTTY: g.isatty(1) }),
    stderr: createSupportsColor({ isTTY: g.isatty(2) }),
  };
  const p = d;
  function stringReplaceAll(e, r, t) {
    let n = e.indexOf(r);
    if (n === -1) {
      return e;
    }
    const o = r.length;
    let s = 0;
    let l = '';
    do {
      l += e.slice(s, n) + r + t;
      s = n + o;
      n = e.indexOf(r, s);
    } while (n !== -1);
    l += e.slice(s);
    return l;
  }
  function stringEncaseCRLFWithFirstIndex(e, r, t, n) {
    let o = 0;
    let s = '';
    do {
      const l = e[n - 1] === '\r';
      s += e.slice(o, l ? n - 1 : n) + r + (l ? '\r\n' : '\n') + t;
      o = n + 1;
      n = e.indexOf('\n', o);
    } while (n !== -1);
    s += e.slice(o);
    return s;
  }
  const { stdout: m, stderr: O } = p;
  const C = Symbol('GENERATOR');
  const T = Symbol('STYLER');
  const v = Symbol('IS_EMPTY');
  const R = ['ansi', 'ansi', 'ansi256', 'ansi16m'];
  const y = Object.create(null);
  const applyOptions = (e, r = {}) => {
    if (r.level && !(Number.isInteger(r.level) && r.level >= 0 && r.level <= 3)) {
      throw new Error('The `level` option should be an integer from 0 to 3');
    }
    const t = m ? m.level : 0;
    e.level = r.level === undefined ? t : r.level;
  };
  class Chalk {
    constructor(e) {
      return chalkFactory(e);
    }
  }
  const chalkFactory = (e) => {
    const chalk = (...e) => e.join(' ');
    applyOptions(chalk, e);
    Object.setPrototypeOf(chalk, createChalk.prototype);
    return chalk;
  };
  function createChalk(e) {
    return chalkFactory(e);
  }
  Object.setPrototypeOf(createChalk.prototype, Function.prototype);
  for (const [e, r] of Object.entries(c)) {
    y[e] = {
      get() {
        const t = createBuilder(this, createStyler(r.open, r.close, this[T]), this[v]);
        Object.defineProperty(this, e, { value: t });
        return t;
      },
    };
  }
  y.visible = {
    get() {
      const e = createBuilder(this, this[T], true);
      Object.defineProperty(this, 'visible', { value: e });
      return e;
    },
  };
  const getModelAnsi = (e, r, t, ...n) => {
    if (e === 'rgb') {
      if (r === 'ansi16m') {
        return c[t].ansi16m(...n);
      }
      if (r === 'ansi256') {
        return c[t].ansi256(c.rgbToAnsi256(...n));
      }
      return c[t].ansi(c.rgbToAnsi(...n));
    }
    if (e === 'hex') {
      return getModelAnsi('rgb', r, t, ...c.hexToRgb(...n));
    }
    return c[t][e](...n);
  };
  const A = ['rgb', 'hex', 'ansi256'];
  for (const e of A) {
    y[e] = {
      get() {
        const { level: r } = this;
        return function (...t) {
          const n = createStyler(getModelAnsi(e, R[r], 'color', ...t), c.color.close, this[T]);
          return createBuilder(this, n, this[v]);
        };
      },
    };
    const r = 'bg' + e[0].toUpperCase() + e.slice(1);
    y[r] = {
      get() {
        const { level: r } = this;
        return function (...t) {
          const n = createStyler(getModelAnsi(e, R[r], 'bgColor', ...t), c.bgColor.close, this[T]);
          return createBuilder(this, n, this[v]);
        };
      },
    };
  }
  const E = Object.defineProperties(() => {}, {
    ...y,
    level: {
      enumerable: true,
      get() {
        return this[C].level;
      },
      set(e) {
        this[C].level = e;
      },
    },
  });
  const createStyler = (e, r, t) => {
    let n;
    let o;
    if (t === undefined) {
      n = e;
      o = r;
    } else {
      n = t.openAll + e;
      o = r + t.closeAll;
    }
    return { open: e, close: r, openAll: n, closeAll: o, parent: t };
  };
  const createBuilder = (e, r, t) => {
    const builder = (...e) => applyStyle(builder, e.length === 1 ? '' + e[0] : e.join(' '));
    Object.setPrototypeOf(builder, E);
    builder[C] = e;
    builder[T] = r;
    builder[v] = t;
    return builder;
  };
  const applyStyle = (e, r) => {
    if (e.level <= 0 || !r) {
      return e[v] ? '' : r;
    }
    let t = e[T];
    if (t === undefined) {
      return r;
    }
    const { openAll: n, closeAll: o } = t;
    if (r.includes('')) {
      while (t !== undefined) {
        r = stringReplaceAll(r, t.close, t.open);
        t = t.parent;
      }
    }
    const s = r.indexOf('\n');
    if (s !== -1) {
      r = stringEncaseCRLFWithFirstIndex(r, o, n, s);
    }
    return n + r + o;
  };
  Object.defineProperties(createChalk.prototype, y);
  const M = createChalk();
  const F = createChalk({ level: O ? O.level : 0 });
  const I = M;
  module.exports = r;
})();
