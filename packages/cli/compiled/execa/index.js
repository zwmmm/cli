(() => {
  var e = {
    859: (e, t, n) => {
      'use strict';
      const r = n(81);
      const o = n(69);
      const i = n(775);
      function spawn(e, t, n) {
        const s = o(e, t, n);
        const a = r.spawn(s.command, s.args, s.options);
        i.hookChildProcess(a, s);
        return a;
      }
      function spawnSync(e, t, n) {
        const s = o(e, t, n);
        const a = r.spawnSync(s.command, s.args, s.options);
        a.error = a.error || i.verifyENOENTSync(a.status, s);
        return a;
      }
      e.exports = spawn;
      e.exports.spawn = spawn;
      e.exports.sync = spawnSync;
      e.exports._parse = o;
      e.exports._enoent = i;
    },
    775: (e) => {
      'use strict';
      const t = process.platform === 'win32';
      function notFoundError(e, t) {
        return Object.assign(new Error(`${t} ${e.command} ENOENT`), {
          code: 'ENOENT',
          errno: 'ENOENT',
          syscall: `${t} ${e.command}`,
          path: e.command,
          spawnargs: e.args,
        });
      }
      function hookChildProcess(e, n) {
        if (!t) {
          return;
        }
        const r = e.emit;
        e.emit = function (t, o) {
          if (t === 'exit') {
            const t = verifyENOENT(o, n, 'spawn');
            if (t) {
              return r.call(e, 'error', t);
            }
          }
          return r.apply(e, arguments);
        };
      }
      function verifyENOENT(e, n) {
        if (t && e === 1 && !n.file) {
          return notFoundError(n.original, 'spawn');
        }
        return null;
      }
      function verifyENOENTSync(e, n) {
        if (t && e === 1 && !n.file) {
          return notFoundError(n.original, 'spawnSync');
        }
        return null;
      }
      e.exports = {
        hookChildProcess: hookChildProcess,
        verifyENOENT: verifyENOENT,
        verifyENOENTSync: verifyENOENTSync,
        notFoundError: notFoundError,
      };
    },
    69: (e, t, n) => {
      'use strict';
      const r = n(17);
      const o = n(841);
      const i = n(445);
      const s = n(574);
      const a = process.platform === 'win32';
      const c = /\.(?:com|exe)$/i;
      const u = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
      function detectShebang(e) {
        e.file = o(e);
        const t = e.file && s(e.file);
        if (t) {
          e.args.unshift(e.file);
          e.command = t;
          return o(e);
        }
        return e.file;
      }
      function parseNonShell(e) {
        if (!a) {
          return e;
        }
        const t = detectShebang(e);
        const n = !c.test(t);
        if (e.options.forceShell || n) {
          const n = u.test(t);
          e.command = r.normalize(e.command);
          e.command = i.command(e.command);
          e.args = e.args.map((e) => i.argument(e, n));
          const o = [e.command].concat(e.args).join(' ');
          e.args = ['/d', '/s', '/c', `"${o}"`];
          e.command = process.env.comspec || 'cmd.exe';
          e.options.windowsVerbatimArguments = true;
        }
        return e;
      }
      function parse(e, t, n) {
        if (t && !Array.isArray(t)) {
          n = t;
          t = null;
        }
        t = t ? t.slice(0) : [];
        n = Object.assign({}, n);
        const r = { command: e, args: t, options: n, file: undefined, original: { command: e, args: t } };
        return n.shell ? r : parseNonShell(r);
      }
      e.exports = parse;
    },
    445: (e) => {
      'use strict';
      const t = /([()\][%!^"`<>&|;, *?])/g;
      function escapeCommand(e) {
        e = e.replace(t, '^$1');
        return e;
      }
      function escapeArgument(e, n) {
        e = `${e}`;
        e = e.replace(/(\\*)"/g, '$1$1\\"');
        e = e.replace(/(\\*)$/, '$1$1');
        e = `"${e}"`;
        e = e.replace(t, '^$1');
        if (n) {
          e = e.replace(t, '^$1');
        }
        return e;
      }
      e.exports.command = escapeCommand;
      e.exports.argument = escapeArgument;
    },
    574: (e, t, n) => {
      'use strict';
      const r = n(147);
      const o = n(382);
      function readShebang(e) {
        const t = 150;
        const n = Buffer.alloc(t);
        let i;
        try {
          i = r.openSync(e, 'r');
          r.readSync(i, n, 0, t, 0);
          r.closeSync(i);
        } catch (e) {}
        return o(n.toString());
      }
      e.exports = readShebang;
    },
    841: (e, t, n) => {
      'use strict';
      const r = n(17);
      const o = n(189);
      const i = n(851);
      function resolveCommandAttempt(e, t) {
        const n = e.options.env || process.env;
        const s = process.cwd();
        const a = e.options.cwd != null;
        const c = a && process.chdir !== undefined && !process.chdir.disabled;
        if (c) {
          try {
            process.chdir(e.options.cwd);
          } catch (e) {}
        }
        let u;
        try {
          u = o.sync(e.command, { path: n[i({ env: n })], pathExt: t ? r.delimiter : undefined });
        } catch (e) {
        } finally {
          if (c) {
            process.chdir(s);
          }
        }
        if (u) {
          u = r.resolve(a ? e.options.cwd : '', u);
        }
        return u;
      }
      function resolveCommand(e) {
        return resolveCommandAttempt(e) || resolveCommandAttempt(e, true);
      }
      e.exports = resolveCommand;
    },
    162: (e, t, n) => {
      'use strict';
      const { PassThrough: r } = n(781);
      e.exports = (e) => {
        e = { ...e };
        const { array: t } = e;
        let { encoding: n } = e;
        const o = n === 'buffer';
        let i = false;
        if (t) {
          i = !(n || o);
        } else {
          n = n || 'utf8';
        }
        if (o) {
          n = null;
        }
        const s = new r({ objectMode: i });
        if (n) {
          s.setEncoding(n);
        }
        let a = 0;
        const c = [];
        s.on('data', (e) => {
          c.push(e);
          if (i) {
            a = c.length;
          } else {
            a += e.length;
          }
        });
        s.getBufferedValue = () => {
          if (t) {
            return c;
          }
          return o ? Buffer.concat(c, a) : c.join('');
        };
        s.getBufferedLength = () => a;
        return s;
      };
    },
    49: (e, t, n) => {
      'use strict';
      const { constants: r } = n(300);
      const o = n(781);
      const { promisify: i } = n(837);
      const s = n(162);
      const a = i(o.pipeline);
      class MaxBufferError extends Error {
        constructor() {
          super('maxBuffer exceeded');
          this.name = 'MaxBufferError';
        }
      }
      async function getStream(e, t) {
        if (!e) {
          throw new Error('Expected a stream');
        }
        t = { maxBuffer: Infinity, ...t };
        const { maxBuffer: n } = t;
        const o = s(t);
        await new Promise((t, i) => {
          const rejectPromise = (e) => {
            if (e && o.getBufferedLength() <= r.MAX_LENGTH) {
              e.bufferedData = o.getBufferedValue();
            }
            i(e);
          };
          (async () => {
            try {
              await a(e, o);
              t();
            } catch (e) {
              rejectPromise(e);
            }
          })();
          o.on('data', () => {
            if (o.getBufferedLength() > n) {
              rejectPromise(new MaxBufferError());
            }
          });
        });
        return o.getBufferedValue();
      }
      e.exports = getStream;
      e.exports.buffer = (e, t) => getStream(e, { ...t, encoding: 'buffer' });
      e.exports.array = (e, t) => getStream(e, { ...t, array: true });
      e.exports.MaxBufferError = MaxBufferError;
    },
    555: (e, t, n) => {
      var r = n(147);
      var o;
      if (process.platform === 'win32' || global.TESTING_WINDOWS) {
        o = n(367);
      } else {
        o = n(10);
      }
      e.exports = isexe;
      isexe.sync = sync;
      function isexe(e, t, n) {
        if (typeof t === 'function') {
          n = t;
          t = {};
        }
        if (!n) {
          if (typeof Promise !== 'function') {
            throw new TypeError('callback not provided');
          }
          return new Promise(function (n, r) {
            isexe(e, t || {}, function (e, t) {
              if (e) {
                r(e);
              } else {
                n(t);
              }
            });
          });
        }
        o(e, t || {}, function (e, r) {
          if (e) {
            if (e.code === 'EACCES' || (t && t.ignoreErrors)) {
              e = null;
              r = false;
            }
          }
          n(e, r);
        });
      }
      function sync(e, t) {
        try {
          return o.sync(e, t || {});
        } catch (e) {
          if ((t && t.ignoreErrors) || e.code === 'EACCES') {
            return false;
          } else {
            throw e;
          }
        }
      }
    },
    10: (e, t, n) => {
      e.exports = isexe;
      isexe.sync = sync;
      var r = n(147);
      function isexe(e, t, n) {
        r.stat(e, function (e, r) {
          n(e, e ? false : checkStat(r, t));
        });
      }
      function sync(e, t) {
        return checkStat(r.statSync(e), t);
      }
      function checkStat(e, t) {
        return e.isFile() && checkMode(e, t);
      }
      function checkMode(e, t) {
        var n = e.mode;
        var r = e.uid;
        var o = e.gid;
        var i = t.uid !== undefined ? t.uid : process.getuid && process.getuid();
        var s = t.gid !== undefined ? t.gid : process.getgid && process.getgid();
        var a = parseInt('100', 8);
        var c = parseInt('010', 8);
        var u = parseInt('001', 8);
        var d = a | c;
        var f = n & u || (n & c && o === s) || (n & a && r === i) || (n & d && i === 0);
        return f;
      }
    },
    367: (e, t, n) => {
      e.exports = isexe;
      isexe.sync = sync;
      var r = n(147);
      function checkPathExt(e, t) {
        var n = t.pathExt !== undefined ? t.pathExt : process.env.PATHEXT;
        if (!n) {
          return true;
        }
        n = n.split(';');
        if (n.indexOf('') !== -1) {
          return true;
        }
        for (var r = 0; r < n.length; r++) {
          var o = n[r].toLowerCase();
          if (o && e.substr(-o.length).toLowerCase() === o) {
            return true;
          }
        }
        return false;
      }
      function checkStat(e, t, n) {
        if (!e.isSymbolicLink() && !e.isFile()) {
          return false;
        }
        return checkPathExt(t, n);
      }
      function isexe(e, t, n) {
        r.stat(e, function (r, o) {
          n(r, r ? false : checkStat(o, e, t));
        });
      }
      function sync(e, t) {
        return checkStat(r.statSync(e), e, t);
      }
    },
    237: (e, t, n) => {
      'use strict';
      const { PassThrough: r } = n(781);
      e.exports = function () {
        var e = [];
        var t = new r({ objectMode: true });
        t.setMaxListeners(0);
        t.add = add;
        t.isEmpty = isEmpty;
        t.on('unpipe', remove);
        Array.prototype.slice.call(arguments).forEach(add);
        return t;
        function add(n) {
          if (Array.isArray(n)) {
            n.forEach(add);
            return this;
          }
          e.push(n);
          n.once('end', remove.bind(null, n));
          n.once('error', t.emit.bind(t, 'error'));
          n.pipe(t, { end: false });
          return this;
        }
        function isEmpty() {
          return e.length == 0;
        }
        function remove(n) {
          e = e.filter(function (e) {
            return e !== n;
          });
          if (!e.length && t.readable) {
            t.end();
          }
        }
      };
    },
    851: (e) => {
      'use strict';
      const pathKey = (e = {}) => {
        const t = e.env || process.env;
        const n = e.platform || process.platform;
        if (n !== 'win32') {
          return 'PATH';
        }
        return (
          Object.keys(t)
            .reverse()
            .find((e) => e.toUpperCase() === 'PATH') || 'Path'
        );
      };
      e.exports = pathKey;
      e.exports['default'] = pathKey;
    },
    382: (e, t, n) => {
      'use strict';
      const r = n(11);
      e.exports = (e = '') => {
        const t = e.match(r);
        if (!t) {
          return null;
        }
        const [n, o] = t[0].replace(/#! ?/, '').split(' ');
        const i = n.split('/').pop();
        if (i === 'env') {
          return o;
        }
        return o ? `${i} ${o}` : i;
      };
    },
    11: (e) => {
      'use strict';
      e.exports = /^#!(.*)/;
    },
    289: (e, t, n) => {
      var r = global.process;
      const processOk = function (e) {
        return (
          e &&
          typeof e === 'object' &&
          typeof e.removeListener === 'function' &&
          typeof e.emit === 'function' &&
          typeof e.reallyExit === 'function' &&
          typeof e.listeners === 'function' &&
          typeof e.kill === 'function' &&
          typeof e.pid === 'number' &&
          typeof e.on === 'function'
        );
      };
      if (!processOk(r)) {
        e.exports = function () {
          return function () {};
        };
      } else {
        var o = n(491);
        var i = n(789);
        var s = /^win/i.test(r.platform);
        var a = n(361);
        if (typeof a !== 'function') {
          a = a.EventEmitter;
        }
        var c;
        if (r.__signal_exit_emitter__) {
          c = r.__signal_exit_emitter__;
        } else {
          c = r.__signal_exit_emitter__ = new a();
          c.count = 0;
          c.emitted = {};
        }
        if (!c.infinite) {
          c.setMaxListeners(Infinity);
          c.infinite = true;
        }
        e.exports = function (e, t) {
          if (!processOk(global.process)) {
            return function () {};
          }
          o.equal(typeof e, 'function', 'a callback must be provided for exit handler');
          if (l === false) {
            p();
          }
          var n = 'exit';
          if (t && t.alwaysLast) {
            n = 'afterexit';
          }
          var remove = function () {
            c.removeListener(n, e);
            if (c.listeners('exit').length === 0 && c.listeners('afterexit').length === 0) {
              u();
            }
          };
          c.on(n, e);
          return remove;
        };
        var u = function unload() {
          if (!l || !processOk(global.process)) {
            return;
          }
          l = false;
          i.forEach(function (e) {
            try {
              r.removeListener(e, f[e]);
            } catch (e) {}
          });
          r.emit = g;
          r.reallyExit = m;
          c.count -= 1;
        };
        e.exports.unload = u;
        var d = function emit(e, t, n) {
          if (c.emitted[e]) {
            return;
          }
          c.emitted[e] = true;
          c.emit(e, t, n);
        };
        var f = {};
        i.forEach(function (e) {
          f[e] = function listener() {
            if (!processOk(global.process)) {
              return;
            }
            var t = r.listeners(e);
            if (t.length === c.count) {
              u();
              d('exit', null, e);
              d('afterexit', null, e);
              if (s && e === 'SIGHUP') {
                e = 'SIGINT';
              }
              r.kill(r.pid, e);
            }
          };
        });
        e.exports.signals = function () {
          return i;
        };
        var l = false;
        var p = function load() {
          if (l || !processOk(global.process)) {
            return;
          }
          l = true;
          c.count += 1;
          i = i.filter(function (e) {
            try {
              r.on(e, f[e]);
              return true;
            } catch (e) {
              return false;
            }
          });
          r.emit = y;
          r.reallyExit = h;
        };
        e.exports.load = p;
        var m = r.reallyExit;
        var h = function processReallyExit(e) {
          if (!processOk(global.process)) {
            return;
          }
          r.exitCode = e || 0;
          d('exit', r.exitCode, null);
          d('afterexit', r.exitCode, null);
          m.call(r, r.exitCode);
        };
        var g = r.emit;
        var y = function processEmit(e, t) {
          if (e === 'exit' && processOk(global.process)) {
            if (t !== undefined) {
              r.exitCode = t;
            }
            var n = g.apply(this, arguments);
            d('exit', r.exitCode, null);
            d('afterexit', r.exitCode, null);
            return n;
          } else {
            return g.apply(this, arguments);
          }
        };
      }
    },
    789: (e) => {
      e.exports = ['SIGABRT', 'SIGALRM', 'SIGHUP', 'SIGINT', 'SIGTERM'];
      if (process.platform !== 'win32') {
        e.exports.push('SIGVTALRM', 'SIGXCPU', 'SIGXFSZ', 'SIGUSR2', 'SIGTRAP', 'SIGSYS', 'SIGQUIT', 'SIGIOT');
      }
      if (process.platform === 'linux') {
        e.exports.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT', 'SIGUNUSED');
      }
    },
    189: (e, t, n) => {
      const r = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';
      const o = n(17);
      const i = r ? ';' : ':';
      const s = n(555);
      const getNotFoundError = (e) => Object.assign(new Error(`not found: ${e}`), { code: 'ENOENT' });
      const getPathInfo = (e, t) => {
        const n = t.colon || i;
        const o =
          e.match(/\//) || (r && e.match(/\\/))
            ? ['']
            : [...(r ? [process.cwd()] : []), ...(t.path || process.env.PATH || '').split(n)];
        const s = r ? t.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM' : '';
        const a = r ? s.split(n) : [''];
        if (r) {
          if (e.indexOf('.') !== -1 && a[0] !== '') a.unshift('');
        }
        return { pathEnv: o, pathExt: a, pathExtExe: s };
      };
      const which = (e, t, n) => {
        if (typeof t === 'function') {
          n = t;
          t = {};
        }
        if (!t) t = {};
        const { pathEnv: r, pathExt: i, pathExtExe: a } = getPathInfo(e, t);
        const c = [];
        const step = (n) =>
          new Promise((i, s) => {
            if (n === r.length) return t.all && c.length ? i(c) : s(getNotFoundError(e));
            const a = r[n];
            const u = /^".*"$/.test(a) ? a.slice(1, -1) : a;
            const d = o.join(u, e);
            const f = !u && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + d : d;
            i(subStep(f, n, 0));
          });
        const subStep = (e, n, r) =>
          new Promise((o, u) => {
            if (r === i.length) return o(step(n + 1));
            const d = i[r];
            s(e + d, { pathExt: a }, (i, s) => {
              if (!i && s) {
                if (t.all) c.push(e + d);
                else return o(e + d);
              }
              return o(subStep(e, n, r + 1));
            });
          });
        return n ? step(0).then((e) => n(null, e), n) : step(0);
      };
      const whichSync = (e, t) => {
        t = t || {};
        const { pathEnv: n, pathExt: r, pathExtExe: i } = getPathInfo(e, t);
        const a = [];
        for (let c = 0; c < n.length; c++) {
          const u = n[c];
          const d = /^".*"$/.test(u) ? u.slice(1, -1) : u;
          const f = o.join(d, e);
          const l = !d && /^\.[\\\/]/.test(e) ? e.slice(0, 2) + f : f;
          for (let e = 0; e < r.length; e++) {
            const n = l + r[e];
            try {
              const e = s.sync(n, { pathExt: i });
              if (e) {
                if (t.all) a.push(n);
                else return n;
              }
            } catch (e) {}
          }
        }
        if (t.all && a.length) return a;
        if (t.nothrow) return null;
        throw getNotFoundError(e);
      };
      e.exports = which;
      which.sync = whichSync;
    },
    491: (e) => {
      'use strict';
      e.exports = require('assert');
    },
    300: (e) => {
      'use strict';
      e.exports = require('buffer');
    },
    81: (e) => {
      'use strict';
      e.exports = require('child_process');
    },
    361: (e) => {
      'use strict';
      e.exports = require('events');
    },
    147: (e) => {
      'use strict';
      e.exports = require('fs');
    },
    17: (e) => {
      'use strict';
      e.exports = require('path');
    },
    781: (e) => {
      'use strict';
      e.exports = require('stream');
    },
    837: (e) => {
      'use strict';
      e.exports = require('util');
    },
  };
  var t = {};
  function __nccwpck_require__(n) {
    var r = t[n];
    if (r !== undefined) {
      return r.exports;
    }
    var o = (t[n] = { exports: {} });
    var i = true;
    try {
      e[n](o, o.exports, __nccwpck_require__);
      i = false;
    } finally {
      if (i) delete t[n];
    }
    return o.exports;
  }
  (() => {
    __nccwpck_require__.d = (e, t) => {
      for (var n in t) {
        if (__nccwpck_require__.o(t, n) && !__nccwpck_require__.o(e, n)) {
          Object.defineProperty(e, n, { enumerable: true, get: t[n] });
        }
      }
    };
  })();
  (() => {
    __nccwpck_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  })();
  (() => {
    __nccwpck_require__.r = (e) => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' });
      }
      Object.defineProperty(e, '__esModule', { value: true });
    };
  })();
  if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + '/';
  var n = {};
  (() => {
    'use strict';
    __nccwpck_require__.r(n);
    __nccwpck_require__.d(n, {
      $: () => k,
      execa: () => execa,
      execaCommand: () => execaCommand,
      execaCommandSync: () => execaCommandSync,
      execaNode: () => execaNode,
      execaSync: () => execaSync,
    });
    const e = require('node:buffer');
    const t = require('node:path');
    const r = require('node:child_process');
    const o = require('node:process');
    var i = __nccwpck_require__(859);
    function stripFinalNewline(e) {
      const t = typeof e === 'string' ? '\n' : '\n'.charCodeAt();
      const n = typeof e === 'string' ? '\r' : '\r'.charCodeAt();
      if (e[e.length - 1] === t) {
        e = e.slice(0, -1);
      }
      if (e[e.length - 1] === n) {
        e = e.slice(0, -1);
      }
      return e;
    }
    const s = require('node:url');
    function pathKey(e = {}) {
      const { env: t = process.env, platform: n = process.platform } = e;
      if (n !== 'win32') {
        return 'PATH';
      }
      return (
        Object.keys(t)
          .reverse()
          .find((e) => e.toUpperCase() === 'PATH') || 'Path'
      );
    }
    function npmRunPath(e = {}) {
      const { cwd: n = o.cwd(), path: r = o.env[pathKey()], execPath: i = o.execPath } = e;
      let a;
      const c = n instanceof URL ? s.fileURLToPath(n) : n;
      let u = t.resolve(c);
      const d = [];
      while (a !== u) {
        d.push(t.join(u, 'node_modules/.bin'));
        a = u;
        u = t.resolve(u, '..');
      }
      d.push(t.resolve(c, i, '..'));
      return [...d, r].join(t.delimiter);
    }
    function npmRunPathEnv({ env: e = o.env, ...t } = {}) {
      e = { ...e };
      const n = pathKey({ env: e });
      t.path = e[n];
      e[n] = npmRunPath(t);
      return e;
    }
    const copyProperty = (e, t, n, r) => {
      if (n === 'length' || n === 'prototype') {
        return;
      }
      if (n === 'arguments' || n === 'caller') {
        return;
      }
      const o = Object.getOwnPropertyDescriptor(e, n);
      const i = Object.getOwnPropertyDescriptor(t, n);
      if (!canCopyProperty(o, i) && r) {
        return;
      }
      Object.defineProperty(e, n, i);
    };
    const canCopyProperty = function (e, t) {
      return (
        e === undefined ||
        e.configurable ||
        (e.writable === t.writable &&
          e.enumerable === t.enumerable &&
          e.configurable === t.configurable &&
          (e.writable || e.value === t.value))
      );
    };
    const changePrototype = (e, t) => {
      const n = Object.getPrototypeOf(t);
      if (n === Object.getPrototypeOf(e)) {
        return;
      }
      Object.setPrototypeOf(e, n);
    };
    const wrappedToString = (e, t) => `/* Wrapped ${e}*/\n${t}`;
    const a = Object.getOwnPropertyDescriptor(Function.prototype, 'toString');
    const c = Object.getOwnPropertyDescriptor(Function.prototype.toString, 'name');
    const changeToString = (e, t, n) => {
      const r = n === '' ? '' : `with ${n.trim()}() `;
      const o = wrappedToString.bind(null, r, t.toString());
      Object.defineProperty(o, 'name', c);
      Object.defineProperty(e, 'toString', { ...a, value: o });
    };
    function mimicFunction(e, t, { ignoreNonConfigurable: n = false } = {}) {
      const { name: r } = e;
      for (const r of Reflect.ownKeys(t)) {
        copyProperty(e, t, r, n);
      }
      changePrototype(e, t);
      changeToString(e, t, r);
      return e;
    }
    const u = new WeakMap();
    const onetime = (e, t = {}) => {
      if (typeof e !== 'function') {
        throw new TypeError('Expected a function');
      }
      let n;
      let r = 0;
      const o = e.displayName || e.name || '<anonymous>';
      const onetime = function (...i) {
        u.set(onetime, ++r);
        if (r === 1) {
          n = e.apply(this, i);
          e = null;
        } else if (t.throw === true) {
          throw new Error(`Function \`${o}\` can only be called once`);
        }
        return n;
      };
      mimicFunction(onetime, e);
      u.set(onetime, r);
      return onetime;
    };
    onetime.callCount = (e) => {
      if (!u.has(e)) {
        throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);
      }
      return u.get(e);
    };
    const d = onetime;
    const f = require('node:os');
    const getRealtimeSignals = () => {
      const e = p - l + 1;
      return Array.from({ length: e }, getRealtimeSignal);
    };
    const getRealtimeSignal = (e, t) => ({
      name: `SIGRT${t + 1}`,
      number: l + t,
      action: 'terminate',
      description: 'Application-specific signal (realtime)',
      standard: 'posix',
    });
    const l = 34;
    const p = 64;
    const m = [
      { name: 'SIGHUP', number: 1, action: 'terminate', description: 'Terminal closed', standard: 'posix' },
      {
        name: 'SIGINT',
        number: 2,
        action: 'terminate',
        description: 'User interruption with CTRL-C',
        standard: 'ansi',
      },
      { name: 'SIGQUIT', number: 3, action: 'core', description: 'User interruption with CTRL-\\', standard: 'posix' },
      { name: 'SIGILL', number: 4, action: 'core', description: 'Invalid machine instruction', standard: 'ansi' },
      { name: 'SIGTRAP', number: 5, action: 'core', description: 'Debugger breakpoint', standard: 'posix' },
      { name: 'SIGABRT', number: 6, action: 'core', description: 'Aborted', standard: 'ansi' },
      { name: 'SIGIOT', number: 6, action: 'core', description: 'Aborted', standard: 'bsd' },
      {
        name: 'SIGBUS',
        number: 7,
        action: 'core',
        description: 'Bus error due to misaligned, non-existing address or paging error',
        standard: 'bsd',
      },
      {
        name: 'SIGEMT',
        number: 7,
        action: 'terminate',
        description: 'Command should be emulated but is not implemented',
        standard: 'other',
      },
      { name: 'SIGFPE', number: 8, action: 'core', description: 'Floating point arithmetic error', standard: 'ansi' },
      {
        name: 'SIGKILL',
        number: 9,
        action: 'terminate',
        description: 'Forced termination',
        standard: 'posix',
        forced: true,
      },
      {
        name: 'SIGUSR1',
        number: 10,
        action: 'terminate',
        description: 'Application-specific signal',
        standard: 'posix',
      },
      { name: 'SIGSEGV', number: 11, action: 'core', description: 'Segmentation fault', standard: 'ansi' },
      {
        name: 'SIGUSR2',
        number: 12,
        action: 'terminate',
        description: 'Application-specific signal',
        standard: 'posix',
      },
      { name: 'SIGPIPE', number: 13, action: 'terminate', description: 'Broken pipe or socket', standard: 'posix' },
      { name: 'SIGALRM', number: 14, action: 'terminate', description: 'Timeout or timer', standard: 'posix' },
      { name: 'SIGTERM', number: 15, action: 'terminate', description: 'Termination', standard: 'ansi' },
      {
        name: 'SIGSTKFLT',
        number: 16,
        action: 'terminate',
        description: 'Stack is empty or overflowed',
        standard: 'other',
      },
      {
        name: 'SIGCHLD',
        number: 17,
        action: 'ignore',
        description: 'Child process terminated, paused or unpaused',
        standard: 'posix',
      },
      {
        name: 'SIGCLD',
        number: 17,
        action: 'ignore',
        description: 'Child process terminated, paused or unpaused',
        standard: 'other',
      },
      { name: 'SIGCONT', number: 18, action: 'unpause', description: 'Unpaused', standard: 'posix', forced: true },
      { name: 'SIGSTOP', number: 19, action: 'pause', description: 'Paused', standard: 'posix', forced: true },
      {
        name: 'SIGTSTP',
        number: 20,
        action: 'pause',
        description: 'Paused using CTRL-Z or "suspend"',
        standard: 'posix',
      },
      {
        name: 'SIGTTIN',
        number: 21,
        action: 'pause',
        description: 'Background process cannot read terminal input',
        standard: 'posix',
      },
      {
        name: 'SIGBREAK',
        number: 21,
        action: 'terminate',
        description: 'User interruption with CTRL-BREAK',
        standard: 'other',
      },
      {
        name: 'SIGTTOU',
        number: 22,
        action: 'pause',
        description: 'Background process cannot write to terminal output',
        standard: 'posix',
      },
      {
        name: 'SIGURG',
        number: 23,
        action: 'ignore',
        description: 'Socket received out-of-band data',
        standard: 'bsd',
      },
      { name: 'SIGXCPU', number: 24, action: 'core', description: 'Process timed out', standard: 'bsd' },
      { name: 'SIGXFSZ', number: 25, action: 'core', description: 'File too big', standard: 'bsd' },
      { name: 'SIGVTALRM', number: 26, action: 'terminate', description: 'Timeout or timer', standard: 'bsd' },
      { name: 'SIGPROF', number: 27, action: 'terminate', description: 'Timeout or timer', standard: 'bsd' },
      { name: 'SIGWINCH', number: 28, action: 'ignore', description: 'Terminal window size changed', standard: 'bsd' },
      { name: 'SIGIO', number: 29, action: 'terminate', description: 'I/O is available', standard: 'other' },
      { name: 'SIGPOLL', number: 29, action: 'terminate', description: 'Watched event', standard: 'other' },
      {
        name: 'SIGINFO',
        number: 29,
        action: 'ignore',
        description: 'Request for process information',
        standard: 'other',
      },
      {
        name: 'SIGPWR',
        number: 30,
        action: 'terminate',
        description: 'Device running out of power',
        standard: 'systemv',
      },
      { name: 'SIGSYS', number: 31, action: 'core', description: 'Invalid system call', standard: 'other' },
      { name: 'SIGUNUSED', number: 31, action: 'terminate', description: 'Invalid system call', standard: 'other' },
    ];
    const getSignals = () => {
      const e = getRealtimeSignals();
      const t = [...m, ...e].map(normalizeSignal);
      return t;
    };
    const normalizeSignal = ({ name: e, number: t, description: n, action: r, forced: o = false, standard: i }) => {
      const {
        signals: { [e]: s },
      } = f.constants;
      const a = s !== undefined;
      const c = a ? s : t;
      return { name: e, number: c, description: n, supported: a, action: r, forced: o, standard: i };
    };
    const getSignalsByName = () => {
      const e = getSignals();
      return Object.fromEntries(e.map(getSignalByName));
    };
    const getSignalByName = ({
      name: e,
      number: t,
      description: n,
      supported: r,
      action: o,
      forced: i,
      standard: s,
    }) => [e, { name: e, number: t, description: n, supported: r, action: o, forced: i, standard: s }];
    const h = getSignalsByName();
    const getSignalsByNumber = () => {
      const e = getSignals();
      const t = p + 1;
      const n = Array.from({ length: t }, (t, n) => getSignalByNumber(n, e));
      return Object.assign({}, ...n);
    };
    const getSignalByNumber = (e, t) => {
      const n = findSignalByNumber(e, t);
      if (n === undefined) {
        return {};
      }
      const { name: r, description: o, supported: i, action: s, forced: a, standard: c } = n;
      return { [e]: { name: r, number: e, description: o, supported: i, action: s, forced: a, standard: c } };
    };
    const findSignalByNumber = (e, t) => {
      const n = t.find(({ name: t }) => f.constants.signals[t] === e);
      if (n !== undefined) {
        return n;
      }
      return t.find((t) => t.number === e);
    };
    const g = getSignalsByNumber();
    const getErrorPrefix = ({
      timedOut: e,
      timeout: t,
      errorCode: n,
      signal: r,
      signalDescription: o,
      exitCode: i,
      isCanceled: s,
    }) => {
      if (e) {
        return `timed out after ${t} milliseconds`;
      }
      if (s) {
        return 'was canceled';
      }
      if (n !== undefined) {
        return `failed with ${n}`;
      }
      if (r !== undefined) {
        return `was killed with ${r} (${o})`;
      }
      if (i !== undefined) {
        return `failed with exit code ${i}`;
      }
      return 'failed';
    };
    const makeError = ({
      stdout: e,
      stderr: t,
      all: n,
      error: r,
      signal: o,
      exitCode: i,
      command: s,
      escapedCommand: a,
      timedOut: c,
      isCanceled: u,
      killed: d,
      parsed: {
        options: { timeout: f },
      },
    }) => {
      i = i === null ? undefined : i;
      o = o === null ? undefined : o;
      const l = o === undefined ? undefined : h[o].description;
      const p = r && r.code;
      const m = getErrorPrefix({
        timedOut: c,
        timeout: f,
        errorCode: p,
        signal: o,
        signalDescription: l,
        exitCode: i,
        isCanceled: u,
      });
      const g = `Command ${m}: ${s}`;
      const y = Object.prototype.toString.call(r) === '[object Error]';
      const b = y ? `${g}\n${r.message}` : g;
      const x = [b, t, e].filter(Boolean).join('\n');
      if (y) {
        r.originalMessage = r.message;
        r.message = x;
      } else {
        r = new Error(x);
      }
      r.shortMessage = b;
      r.command = s;
      r.escapedCommand = a;
      r.exitCode = i;
      r.signal = o;
      r.signalDescription = l;
      r.stdout = e;
      r.stderr = t;
      if (n !== undefined) {
        r.all = n;
      }
      if ('bufferedData' in r) {
        delete r.bufferedData;
      }
      r.failed = true;
      r.timedOut = Boolean(c);
      r.isCanceled = u;
      r.killed = d && !c;
      return r;
    };
    const y = ['stdin', 'stdout', 'stderr'];
    const hasAlias = (e) => y.some((t) => e[t] !== undefined);
    const normalizeStdio = (e) => {
      if (!e) {
        return;
      }
      const { stdio: t } = e;
      if (t === undefined) {
        return y.map((t) => e[t]);
      }
      if (hasAlias(e)) {
        throw new Error(
          `It's not possible to provide \`stdio\` in combination with one of ${y.map((e) => `\`${e}\``).join(', ')}`,
        );
      }
      if (typeof t === 'string') {
        return t;
      }
      if (!Array.isArray(t)) {
        throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);
      }
      const n = Math.max(t.length, y.length);
      return Array.from({ length: n }, (e, n) => t[n]);
    };
    const normalizeStdioNode = (e) => {
      const t = normalizeStdio(e);
      if (t === 'ipc') {
        return 'ipc';
      }
      if (t === undefined || typeof t === 'string') {
        return [t, t, t, 'ipc'];
      }
      if (t.includes('ipc')) {
        return t;
      }
      return [...t, 'ipc'];
    };
    var b = __nccwpck_require__(289);
    const x = 1e3 * 5;
    const spawnedKill = (e, t = 'SIGTERM', n = {}) => {
      const r = e(t);
      setKillTimeout(e, t, n, r);
      return r;
    };
    const setKillTimeout = (e, t, n, r) => {
      if (!shouldForceKill(t, n, r)) {
        return;
      }
      const o = getForceKillAfterTimeout(n);
      const i = setTimeout(() => {
        e('SIGKILL');
      }, o);
      if (i.unref) {
        i.unref();
      }
    };
    const shouldForceKill = (e, { forceKillAfterTimeout: t }, n) => isSigterm(e) && t !== false && n;
    const isSigterm = (e) =>
      e === f.constants.signals.SIGTERM || (typeof e === 'string' && e.toUpperCase() === 'SIGTERM');
    const getForceKillAfterTimeout = ({ forceKillAfterTimeout: e = true }) => {
      if (e === true) {
        return x;
      }
      if (!Number.isFinite(e) || e < 0) {
        throw new TypeError(
          `Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`,
        );
      }
      return e;
    };
    const spawnedCancel = (e, t) => {
      const n = e.kill();
      if (n) {
        t.isCanceled = true;
      }
    };
    const timeoutKill = (e, t, n) => {
      e.kill(t);
      n(Object.assign(new Error('Timed out'), { timedOut: true, signal: t }));
    };
    const setupTimeout = (e, { timeout: t, killSignal: n = 'SIGTERM' }, r) => {
      if (t === 0 || t === undefined) {
        return r;
      }
      let o;
      const i = new Promise((r, i) => {
        o = setTimeout(() => {
          timeoutKill(e, n, i);
        }, t);
      });
      const s = r.finally(() => {
        clearTimeout(o);
      });
      return Promise.race([i, s]);
    };
    const validateTimeout = ({ timeout: e }) => {
      if (e !== undefined && (!Number.isFinite(e) || e < 0)) {
        throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);
      }
    };
    const setExitHandler = async (e, { cleanup: t, detached: n }, r) => {
      if (!t || n) {
        return r;
      }
      const o = b(() => {
        e.kill();
      });
      return r.finally(() => {
        o();
      });
    };
    const S = require('node:fs');
    function isStream(e) {
      return e !== null && typeof e === 'object' && typeof e.pipe === 'function';
    }
    function isWritableStream(e) {
      return (
        isStream(e) && e.writable !== false && typeof e._write === 'function' && typeof e._writableState === 'object'
      );
    }
    function isReadableStream(e) {
      return (
        isStream(e) && e.readable !== false && typeof e._read === 'function' && typeof e._readableState === 'object'
      );
    }
    function isDuplexStream(e) {
      return isWritableStream(e) && isReadableStream(e);
    }
    function isTransformStream(e) {
      return isDuplexStream(e) && typeof e._transform === 'function';
    }
    const isExecaChildProcess = (e) => e instanceof r.ChildProcess && typeof e.then === 'function';
    const pipeToTarget = (e, t, n) => {
      if (typeof n === 'string') {
        e[t].pipe((0, S.createWriteStream)(n));
        return e;
      }
      if (isWritableStream(n)) {
        e[t].pipe(n);
        return e;
      }
      if (!isExecaChildProcess(n)) {
        throw new TypeError('The second argument must be a string, a stream or an Execa child process.');
      }
      if (!isWritableStream(n.stdin)) {
        throw new TypeError("The target child process's stdin must be available.");
      }
      e[t].pipe(n.stdin);
      return n;
    };
    const addPipeMethods = (e) => {
      if (e.stdout !== null) {
        e.pipeStdout = pipeToTarget.bind(undefined, e, 'stdout');
      }
      if (e.stderr !== null) {
        e.pipeStderr = pipeToTarget.bind(undefined, e, 'stderr');
      }
      if (e.all !== undefined) {
        e.pipeAll = pipeToTarget.bind(undefined, e, 'all');
      }
    };
    var w = __nccwpck_require__(49);
    var E = __nccwpck_require__(237);
    const validateInputOptions = (e) => {
      if (e !== undefined) {
        throw new TypeError('The `input` and `inputFile` options cannot be both set.');
      }
    };
    const getInputSync = ({ input: e, inputFile: t }) => {
      if (typeof t !== 'string') {
        return e;
      }
      validateInputOptions(e);
      return (0, S.readFileSync)(t);
    };
    const handleInputSync = (e) => {
      const t = getInputSync(e);
      if (isStream(t)) {
        throw new TypeError('The `input` option cannot be a stream in sync mode');
      }
      return t;
    };
    const getInput = ({ input: e, inputFile: t }) => {
      if (typeof t !== 'string') {
        return e;
      }
      validateInputOptions(e);
      return (0, S.createReadStream)(t);
    };
    const handleInput = (e, t) => {
      const n = getInput(t);
      if (n === undefined) {
        return;
      }
      if (isStream(n)) {
        n.pipe(e.stdin);
      } else {
        e.stdin.end(n);
      }
    };
    const makeAllStream = (e, { all: t }) => {
      if (!t || (!e.stdout && !e.stderr)) {
        return;
      }
      const n = E();
      if (e.stdout) {
        n.add(e.stdout);
      }
      if (e.stderr) {
        n.add(e.stderr);
      }
      return n;
    };
    const getBufferedData = async (e, t) => {
      if (!e || t === undefined) {
        return;
      }
      e.destroy();
      try {
        return await t;
      } catch (e) {
        return e.bufferedData;
      }
    };
    const getStreamPromise = (e, { encoding: t, buffer: n, maxBuffer: r }) => {
      if (!e || !n) {
        return;
      }
      if (t) {
        return w(e, { encoding: t, maxBuffer: r });
      }
      return w.buffer(e, { maxBuffer: r });
    };
    const getSpawnedResult = async ({ stdout: e, stderr: t, all: n }, { encoding: r, buffer: o, maxBuffer: i }, s) => {
      const a = getStreamPromise(e, { encoding: r, buffer: o, maxBuffer: i });
      const c = getStreamPromise(t, { encoding: r, buffer: o, maxBuffer: i });
      const u = getStreamPromise(n, { encoding: r, buffer: o, maxBuffer: i * 2 });
      try {
        return await Promise.all([s, a, c, u]);
      } catch (r) {
        return Promise.all([
          { error: r, signal: r.signal, timedOut: r.timedOut },
          getBufferedData(e, a),
          getBufferedData(t, c),
          getBufferedData(n, u),
        ]);
      }
    };
    const v = (async () => {})().constructor.prototype;
    const _ = ['then', 'catch', 'finally'].map((e) => [e, Reflect.getOwnPropertyDescriptor(v, e)]);
    const mergePromise = (e, t) => {
      for (const [n, r] of _) {
        const o = typeof t === 'function' ? (...e) => Reflect.apply(r.value, t(), e) : r.value.bind(t);
        Reflect.defineProperty(e, n, { ...r, value: o });
      }
    };
    const getSpawnedPromise = (e) =>
      new Promise((t, n) => {
        e.on('exit', (e, n) => {
          t({ exitCode: e, signal: n });
        });
        e.on('error', (e) => {
          n(e);
        });
        if (e.stdin) {
          e.stdin.on('error', (e) => {
            n(e);
          });
        }
      });
    const normalizeArgs = (e, t = []) => {
      if (!Array.isArray(t)) {
        return [e];
      }
      return [e, ...t];
    };
    const T = /^[\w.-]+$/;
    const I = /"/g;
    const escapeArg = (e) => {
      if (typeof e !== 'string' || T.test(e)) {
        return e;
      }
      return `"${e.replace(I, '\\"')}"`;
    };
    const joinCommand = (e, t) => normalizeArgs(e, t).join(' ');
    const getEscapedCommand = (e, t) =>
      normalizeArgs(e, t)
        .map((e) => escapeArg(e))
        .join(' ');
    const C = / +/g;
    const parseCommand = (e) => {
      const t = [];
      for (const n of e.trim().split(C)) {
        const e = t[t.length - 1];
        if (e && e.endsWith('\\')) {
          t[t.length - 1] = `${e.slice(0, -1)} ${n}`;
        } else {
          t.push(n);
        }
      }
      return t;
    };
    const parseExpression = (t) => {
      const n = typeof t;
      if (n === 'string') {
        return t;
      }
      if (n === 'number') {
        return String(t);
      }
      if (n === 'object' && t !== null && !(t instanceof r.ChildProcess) && 'stdout' in t) {
        const n = typeof t.stdout;
        if (n === 'string') {
          return t.stdout;
        }
        if (e.Buffer.isBuffer(t.stdout)) {
          return t.stdout.toString();
        }
        throw new TypeError(`Unexpected "${n}" stdout in template expression`);
      }
      throw new TypeError(`Unexpected "${n}" in template expression`);
    };
    const concatTokens = (e, t, n) =>
      n || e.length === 0 || t.length === 0
        ? [...e, ...t]
        : [...e.slice(0, -1), `${e[e.length - 1]}${t[0]}`, ...t.slice(1)];
    const parseTemplate = ({ templates: e, expressions: t, tokens: n, index: r, template: o }) => {
      const i = o ?? e.raw[r];
      const s = i.split(C).filter(Boolean);
      const a = concatTokens(n, s, i.startsWith(' '));
      if (r === t.length) {
        return a;
      }
      const c = t[r];
      const u = Array.isArray(c) ? c.map((e) => parseExpression(e)) : [parseExpression(c)];
      return concatTokens(a, u, i.endsWith(' '));
    };
    const parseTemplates = (e, t) => {
      let n = [];
      for (const [r, o] of e.entries()) {
        n = parseTemplate({ templates: e, expressions: t, tokens: n, index: r, template: o });
      }
      return n;
    };
    const P = require('node:util');
    const O = (0, P.debuglog)('execa').enabled;
    const padField = (e, t) => String(e).padStart(t, '0');
    const getTimestamp = () => {
      const e = new Date();
      return `${padField(e.getHours(), 2)}:${padField(e.getMinutes(), 2)}:${padField(e.getSeconds(), 2)}.${padField(
        e.getMilliseconds(),
        3,
      )}`;
    };
    const logCommand = (e, { verbose: t }) => {
      if (!t) {
        return;
      }
      o.stderr.write(`[${getTimestamp()}] ${e}\n`);
    };
    const G = 1e3 * 1e3 * 100;
    const getEnv = ({ env: e, extendEnv: t, preferLocal: n, localDir: r, execPath: i }) => {
      const s = t ? { ...o.env, ...e } : e;
      if (n) {
        return npmRunPathEnv({ env: s, cwd: r, execPath: i });
      }
      return s;
    };
    const handleArguments = (e, n, r = {}) => {
      const s = i._parse(e, n, r);
      e = s.command;
      n = s.args;
      r = s.options;
      r = {
        maxBuffer: G,
        buffer: true,
        stripFinalNewline: true,
        extendEnv: true,
        preferLocal: false,
        localDir: r.cwd || o.cwd(),
        execPath: o.execPath,
        encoding: 'utf8',
        reject: true,
        cleanup: true,
        all: false,
        windowsHide: true,
        verbose: O,
        ...r,
      };
      r.env = getEnv(r);
      r.stdio = normalizeStdio(r);
      if (o.platform === 'win32' && t.basename(e, '.exe') === 'cmd') {
        n.unshift('/q');
      }
      return { file: e, args: n, options: r, parsed: s };
    };
    const handleOutput = (t, n, r) => {
      if (typeof n !== 'string' && !e.Buffer.isBuffer(n)) {
        return r === undefined ? undefined : '';
      }
      if (t.stripFinalNewline) {
        return stripFinalNewline(n);
      }
      return n;
    };
    function execa(e, t, n) {
      const o = handleArguments(e, t, n);
      const i = joinCommand(e, t);
      const s = getEscapedCommand(e, t);
      logCommand(s, o.options);
      validateTimeout(o.options);
      let a;
      try {
        a = r.spawn(o.file, o.args, o.options);
      } catch (e) {
        const t = new r.ChildProcess();
        const n = Promise.reject(
          makeError({
            error: e,
            stdout: '',
            stderr: '',
            all: '',
            command: i,
            escapedCommand: s,
            parsed: o,
            timedOut: false,
            isCanceled: false,
            killed: false,
          }),
        );
        mergePromise(t, n);
        return t;
      }
      const c = getSpawnedPromise(a);
      const u = setupTimeout(a, o.options, c);
      const f = setExitHandler(a, o.options, u);
      const l = { isCanceled: false };
      a.kill = spawnedKill.bind(null, a.kill.bind(a));
      a.cancel = spawnedCancel.bind(null, a, l);
      const handlePromise = async () => {
        const [{ error: e, exitCode: t, signal: n, timedOut: r }, c, u, d] = await getSpawnedResult(a, o.options, f);
        const p = handleOutput(o.options, c);
        const m = handleOutput(o.options, u);
        const h = handleOutput(o.options, d);
        if (e || t !== 0 || n !== null) {
          const c = makeError({
            error: e,
            exitCode: t,
            signal: n,
            stdout: p,
            stderr: m,
            all: h,
            command: i,
            escapedCommand: s,
            parsed: o,
            timedOut: r,
            isCanceled: l.isCanceled || (o.options.signal ? o.options.signal.aborted : false),
            killed: a.killed,
          });
          if (!o.options.reject) {
            return c;
          }
          throw c;
        }
        return {
          command: i,
          escapedCommand: s,
          exitCode: 0,
          stdout: p,
          stderr: m,
          all: h,
          failed: false,
          timedOut: false,
          isCanceled: false,
          killed: false,
        };
      };
      const p = d(handlePromise);
      handleInput(a, o.options);
      a.all = makeAllStream(a, o.options);
      addPipeMethods(a);
      mergePromise(a, p);
      return a;
    }
    function execaSync(e, t, n) {
      const o = handleArguments(e, t, n);
      const i = joinCommand(e, t);
      const s = getEscapedCommand(e, t);
      logCommand(s, o.options);
      const a = handleInputSync(o.options);
      let c;
      try {
        c = r.spawnSync(o.file, o.args, { ...o.options, input: a });
      } catch (e) {
        throw makeError({
          error: e,
          stdout: '',
          stderr: '',
          all: '',
          command: i,
          escapedCommand: s,
          parsed: o,
          timedOut: false,
          isCanceled: false,
          killed: false,
        });
      }
      const u = handleOutput(o.options, c.stdout, c.error);
      const d = handleOutput(o.options, c.stderr, c.error);
      if (c.error || c.status !== 0 || c.signal !== null) {
        const e = makeError({
          stdout: u,
          stderr: d,
          error: c.error,
          signal: c.signal,
          exitCode: c.status,
          command: i,
          escapedCommand: s,
          parsed: o,
          timedOut: c.error && c.error.code === 'ETIMEDOUT',
          isCanceled: false,
          killed: c.signal !== null,
        });
        if (!o.options.reject) {
          return e;
        }
        throw e;
      }
      return {
        command: i,
        escapedCommand: s,
        exitCode: 0,
        stdout: u,
        stderr: d,
        failed: false,
        timedOut: false,
        isCanceled: false,
        killed: false,
      };
    }
    const normalizeScriptStdin = ({ input: e, inputFile: t, stdio: n }) =>
      e === undefined && t === undefined && n === undefined ? { stdin: 'inherit' } : {};
    const normalizeScriptOptions = (e = {}) => ({ preferLocal: true, ...normalizeScriptStdin(e), ...e });
    function create$(e) {
      function $(t, ...n) {
        if (!Array.isArray(t)) {
          return create$({ ...e, ...t });
        }
        const [r, ...o] = parseTemplates(t, n);
        return execa(r, o, normalizeScriptOptions(e));
      }
      $.sync = (t, ...n) => {
        if (!Array.isArray(t)) {
          throw new TypeError('Please use $(options).sync`command` instead of $.sync(options)`command`.');
        }
        const [r, ...o] = parseTemplates(t, n);
        return execaSync(r, o, normalizeScriptOptions(e));
      };
      return $;
    }
    const k = create$();
    function execaCommand(e, t) {
      const [n, ...r] = parseCommand(e);
      return execa(n, r, t);
    }
    function execaCommandSync(e, t) {
      const [n, ...r] = parseCommand(e);
      return execaSync(n, r, t);
    }
    function execaNode(e, t, n = {}) {
      if (t && !Array.isArray(t) && typeof t === 'object') {
        n = t;
        t = [];
      }
      const r = normalizeStdioNode(n);
      const i = o.execArgv.filter((e) => !e.startsWith('--inspect'));
      const { nodePath: s = o.execPath, nodeOptions: a = i } = n;
      return execa(s, [...a, e, ...(Array.isArray(t) ? t : [])], {
        ...n,
        stdin: undefined,
        stdout: undefined,
        stderr: undefined,
        stdio: r,
        shell: false,
      });
    }
  })();
  module.exports = n;
})();
