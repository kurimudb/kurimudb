var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// ../node_modules/milkio/type-safety/index.ts
function typeSafety(value) {
  return {
    type: () => ({ $milkioType: "type-safety", value })
  };
}

// ../node_modules/milkio/node_modules/@southern-aurora/tson/dist/tson.js
var c;
var init_tson = __esm(() => {
  c = {
    rules: {
      stringify: [
        {
          match: (t) => typeof t == "bigint",
          handler: (t) => `t!bigint:${t.toString()}`
        },
        {
          match: (t) => t instanceof Date,
          handler: (t) => `t!Date:${t.toISOString()}`
        },
        {
          match: (t) => t instanceof URL,
          handler: (t) => `t!URL:${t.toString()}`
        },
        {
          match: (t) => t instanceof RegExp,
          handler: (t) => `t!RegExp:${t.toString()}`
        },
        {
          match: (t) => t instanceof Uint8Array,
          handler: (t) => `t!Uint8Array:${new TextDecoder().decode(t)}`
        },
        {
          match: (t) => t instanceof ArrayBuffer,
          handler: (t) => `t!ArrayBuffer:${new TextDecoder().decode(t)}`
        }
      ],
      parse: [
        {
          match: (t) => t.startsWith("t!bigint:"),
          handler: (t) => BigInt(t.slice(9))
        },
        {
          match: (t) => t.startsWith("t!Date:"),
          handler: (t) => new Date(t.slice(7))
        },
        {
          match: (t) => t.startsWith("t!URL:"),
          handler: (t) => new URL(t.slice(6))
        },
        {
          match: (t) => t.startsWith("t!RegExp:"),
          handler: (t) => new RegExp(t.slice(9))
        },
        {
          match: (t) => t.startsWith("t!Uint8Array:"),
          handler: (t) => new TextEncoder().encode(t.slice(13))
        },
        {
          match: (t) => t.startsWith("t!ArrayBuffer:"),
          handler: (t) => new TextEncoder().encode(t.slice(14)).buffer
        }
      ]
    },
    stringify(t) {
      return JSON.stringify(c.encode(t));
    },
    parse(t) {
      return c.decode(JSON.parse(t));
    },
    encode(t) {
      function n(e) {
        if (!e || typeof e != "object" && typeof e != "bigint")
          return e;
        if (e) {
          if (Array.isArray(e)) {
            const s = [];
            for (let i = 0;i < e.length; i++)
              s[i] = n(e[i]);
            return s;
          }
        } else
          return e;
        for (const s of c.rules.stringify)
          if (s.match(e))
            return s.handler(e);
        const r = {};
        for (var a in e)
          r[a] = n(e[a]);
        return r;
      }
      return n(t);
    },
    decode(t) {
      function n(e) {
        if (Array.isArray(e))
          return e.map(n);
        if (typeof e == "object" && e !== null) {
          const r = {};
          for (const a in e)
            e.hasOwnProperty(a) && (r[a] = n(e[a]));
          return r;
        } else if (typeof e == "string") {
          for (const r of c.rules.parse)
            if (r.match(e) === true)
              return r.handler(e);
          return e;
        }
        return e;
      }
      return n(t);
    }
  };
});
// ../node_modules/milkio/config/index.ts
var config = (config2) => {
  return config2;
};

// ../node_modules/milkio/utils/headers-to-json.ts
function headersToJSON(headers) {
  const json = {};
  for (const [key, value] of headers.entries()) {
    json[key] = value;
  }
  return json;
}

// ../node_modules/milkio/execute/index.ts
var __initExecuter = (generated, runtime) => {
  const __execute = async (routeSchema, options) => {
    const executeId = options.createdExecuteId;
    let headers;
    if (!(options.headers instanceof Headers)) {
      headers = new Headers({
        ...options.headers
      });
    } else {
      headers = options.headers;
    }
    if (!("toJSON" in headers))
      headers.toJSON = () => headersToJSON(headers);
    let params;
    if (options.paramsType === "raw") {
      params = options.params;
      if (typeof params === "undefined")
        params = {};
    } else {
      if (options.params === "")
        params = {};
      else {
        try {
          params = c.parse(options.params);
        } catch (error) {
          throw reject("PARAMS_TYPE_NOT_SUPPORTED", { expected: "json" });
        }
        if (typeof params === "undefined")
          params = {};
      }
    }
    if (typeof params !== "object" || Array.isArray(params))
      throw reject("PARAMS_TYPE_NOT_SUPPORTED", { expected: "json" });
    if ("$milkioGenerateParams" in params && params.$milkioGenerateParams === "enable") {
      if (!runtime.develop)
        throw reject("NOT_DEVELOP_MODE", "This feature must be in cookbook to use.");
      delete params.$milkioGenerateParams;
      let paramsRand = routeSchema.randomParams();
      if (paramsRand === undefined || paramsRand === null)
        paramsRand = {};
      params = { ...paramsRand, ...params };
    }
    if (options.mixinContext?.http?.params?.string)
      options.mixinContext.http.params.parsed = params;
    const context = {
      ...options.mixinContext ? options.mixinContext : {},
      develop: runtime.develop,
      path: options.path,
      logger: options.createdLogger,
      executeId: options.createdExecuteId,
      config: runtime.runtime.config,
      call: (module2, options2) => __call(context, module2, options2)
    };
    const results = { value: undefined };
    if (runtime.develop) {
      options.createdLogger.request(`headers - ${c.stringify(headers.toJSON())}`, `
params - ${c.stringify(params)}`);
    }
    const module = await routeSchema.module();
    let meta = module.default?.meta ? module.default?.meta : {};
    if (meta.typeSafety === undefined || meta.typeSafety === true) {
      const validation = routeSchema.validateParams(params);
      if (!validation.success)
        throw reject("PARAMS_TYPE_INCORRECT", { ...validation.errors[0], message: `The value '${validation.errors[0].path}' is '${validation.errors[0].value}', which does not meet '${validation.errors[0].expected}' requirements.` });
    }
    await runtime.emit("milkio:executeBefore", { executeId: options.createdExecuteId, logger: options.createdLogger, path: options.path, meta, context });
    results.value = await module.default.handler(context, params);
    let resultsTypeSafety = false;
    if (results?.value?.$milkioType === "type-safety") {
      resultsTypeSafety = true;
      const validation = routeSchema.validateResults(results.value.value);
      if (!validation.success)
        throw reject("RESULTS_TYPE_INCORRECT", { ...validation.errors[0], message: `The value '${validation.errors[0].path}' is '${validation.errors[0].value}', which does not meet '${validation.errors[0].expected}' requirements.` });
      results.value = results.value.value;
    }
    let emptyResult = false;
    if (results.value === undefined || results.value === null || results.value === "") {
      emptyResult = true;
      results.value = {};
    } else if (Array.isArray(results.value))
      throw reject("FAIL", "The return type of the handler must be an object, which is currently an array.");
    else if (typeof results.value !== "object")
      throw reject("FAIL", "The return type of the handler must be an object, which is currently a primitive type.");
    await runtime.emit("milkio:executeAfter", { executeId: options.createdExecuteId, logger: options.createdLogger, path: options.path, meta, context, results });
    return { executeId, headers, params, results, context, meta, type: module.$milkioType, emptyResult, resultsTypeSafety };
  };
  const __call = async (context, module, params) => {
    const moduleAwaited = await module;
    return await moduleAwaited.default.handler(context, params);
  };
  return {
    __call,
    __execute
  };
};
var init_execute = __esm(() => {
  init_tson();
  init_milkio();
});

// ../node_modules/milkio/events/index.ts
var __initEventManager = () => {
  const handlers = new Map;
  const indexed = new Map;
  const eventManager = {
    on: (key, handler) => {
      handlers.set(handler, key);
      if (indexed.has(key) === false) {
        indexed.set(key, new Set);
      }
      const set = indexed.get(key);
      set.add(handler);
      handlers.set(handler, key);
      return () => {
        handlers.delete(handler);
        set.delete(handler);
      };
    },
    off: (key, handler) => {
      const set = indexed.get(key);
      if (!set)
        return;
      handlers.delete(handler);
      set.delete(handler);
    },
    emit: async (key, value) => {
      const h = indexed.get(key);
      if (h) {
        for (const handler of h) {
          await handler(value);
        }
      }
    }
  };
  return eventManager;
};

// ../node_modules/milkio/node_modules/base64-js/index.js
var require_base64_js = __commonJS((exports) => {
  exports.byteLength = byteLength;
  exports.toByteArray = toByteArray;
  exports.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (i = 0, len = code.length;i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  var i;
  var len;
  revLookup[45] = 62;
  revLookup[95] = 63;
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1)
      validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i2;
    for (i2 = 0;i2 < len2; i2 += 4) {
      tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i2 = start;i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i2 = 0, len22 = len2 - extraBytes;i2 < len22; i2 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
    }
    return parts.join("");
  }
});

// ../node_modules/milkio/node_modules/ieee754/index.js
var require_ieee754 = __commonJS((exports) => {
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (;nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (;nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c2;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c2 = Math.pow(2, -e)) < 1) {
        e--;
        c2 *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c2;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c2 >= 2) {
        e++;
        c2 /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c2 - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (;mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (;eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer[offset + i - d] |= s * 128;
  };
});

// ../node_modules/milkio/node_modules/buffer/index.js
var require_buffer = __commonJS((exports) => {
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  var base64 = require_base64_js();
  var ieee754 = require_ieee754();
  var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer2;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  var K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error("This browser lacks typed array (Uint8Array) support which is required by " + "`buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  }
  function typedArraySupport() {
    try {
      const arr = new Uint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer2.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this))
        return;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer2.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer2.isBuffer(this))
        return;
      return this.byteOffset;
    }
  });
  function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function Buffer2(arg, encodingOrOffset, length) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError('The "string" argument must be of type string. Received type number');
      }
      return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
  }
  Buffer2.poolSize = 8192;
  function from(value, encodingOrOffset, length) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof value);
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === "number") {
      throw new TypeError('The "value" argument must not be of type number. Received type number');
    }
    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) {
      return Buffer2.from(valueOf, encodingOrOffset, length);
    }
    const b = fromObject(value);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
    }
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, " + "or Array-like Object. Received type " + typeof value);
  }
  Buffer2.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
  };
  Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer2, Uint8Array);
  function assertSize(size) {
    if (typeof size !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size < 0) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"');
    }
  }
  function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
      return createBuffer(size);
    }
    if (fill !== undefined) {
      return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
  }
  Buffer2.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
  };
  function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
  }
  Buffer2.allocUnsafe = function(size) {
    return allocUnsafe(size);
  };
  Buffer2.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer2.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);
    const actual = buf.write(string, encoding);
    if (actual !== length) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array) {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0;i < length; i += 1) {
      buf[i] = array[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      const copy = new Uint8Array(arrayView);
      return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === undefined && length === undefined) {
      buf = new Uint8Array(array);
    } else if (length === undefined) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length);
    }
    Object.setPrototypeOf(buf, Buffer2.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer2.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== undefined) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length) {
    if (length >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length | 0;
  }
  function SlowBuffer(length) {
    if (+length != length) {
      length = 0;
    }
    return Buffer2.alloc(+length);
  }
  Buffer2.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer2.prototype;
  };
  Buffer2.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer2.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer2.from(b, b.offset, b.byteLength);
    if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
      throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    }
    if (a === b)
      return 0;
    let x = a.length;
    let y = b.length;
    for (let i = 0, len = Math.min(x, y);i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  Buffer2.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer2.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer2.alloc(0);
    }
    let i;
    if (length === undefined) {
      length = 0;
      for (i = 0;i < list.length; ++i) {
        length += list[i].length;
      }
    }
    const buffer = Buffer2.allocUnsafe(length);
    let pos = 0;
    for (i = 0;i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer.length) {
          if (!Buffer2.isBuffer(buf))
            buf = Buffer2.from(buf);
          buf.copy(buffer, pos);
        } else {
          Uint8Array.prototype.set.call(buffer, buf, pos);
        }
      } else if (!Buffer2.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer, pos);
      }
      pos += buf.length;
    }
    return buffer;
  };
  function byteLength(string, encoding) {
    if (Buffer2.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' + "Received type " + typeof string);
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    let loweredCase = false;
    for (;; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.byteLength = byteLength;
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === undefined || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === undefined || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer2.prototype._isBuffer = true;
  function swap(b, n, m) {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
  }
  Buffer2.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0;i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer2.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0;i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer2.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0;i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer2.prototype.toString = function toString() {
    const length = this.length;
    if (length === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };
  Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
  Buffer2.prototype.equals = function equals(b) {
    if (!Buffer2.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer2.compare(this, b) === 0;
  };
  Buffer2.prototype.inspect = function inspect() {
    let str = "";
    const max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
  }
  Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer2.from(target, target.offset, target.byteLength);
    }
    if (!Buffer2.isBuffer(target)) {
      throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. ' + "Received type " + typeof target);
    }
    if (start === undefined) {
      start = 0;
    }
    if (end === undefined) {
      end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
      thisStart = 0;
    }
    if (thisEnd === undefined) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
      return 0;
    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0;i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
      }
    }
    if (x < y)
      return -1;
    if (y < x)
      return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    if (buffer.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer2.from(val, encoding);
    }
    if (Buffer2.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset;i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset;i >= 0; i--) {
        let found = true;
        for (let j = 0;j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }
    const strLen = string.length;
    if (length > strLen / 2) {
      length = strLen / 2;
    }
    let i;
    for (i = 0;i < length; ++i) {
      const parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed))
        return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }
  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }
  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }
  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }
  Buffer2.prototype.write = function write(string, offset, length, encoding) {
    if (offset === undefined) {
      encoding = "utf8";
      length = this.length;
      offset = 0;
    } else if (length === undefined && typeof offset === "string") {
      encoding = offset;
      length = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length)) {
        length = length >>> 0;
        if (encoding === undefined)
          encoding = "utf8";
      } else {
        encoding = length;
        length = undefined;
      }
    } else {
      throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    }
    const remaining = this.length - offset;
    if (length === undefined || length > remaining)
      length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    let loweredCase = false;
    for (;; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length);
        case "base64":
          return base64Write(this, string, offset, length);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer2.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  var MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start;i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start;i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    let out = "";
    for (let i = start;i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = "";
    for (let i = 0;i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer2.prototype.slice = function slice(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer2.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength2 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength2, this.length);
    }
    let val = this[offset + --byteLength2];
    let mul = 1;
    while (byteLength2 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength2] * mul;
    }
    return val;
  };
  Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  });
  Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
  });
  Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength2 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength2);
    return val;
  };
  Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength2, this.length);
    let i = byteLength2;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength2);
    return val;
  };
  Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === undefined || last === undefined) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };
  Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };
  Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };
  Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer2.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
      checkInt(this, value, offset, byteLength2, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 255;
    while (++i < byteLength2 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength2;
  };
  Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength2 = byteLength2 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
      checkInt(this, value, offset, byteLength2, maxBytes, 0);
    }
    let i = byteLength2 - 1;
    let mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength2;
  };
  Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function wrtBigUInt64LE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    hi = hi >> 8;
    buf[offset++] = hi;
    return offset;
  }
  function wrtBigUInt64BE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi;
    hi = hi >> 8;
    buf[offset + 2] = hi;
    hi = hi >> 8;
    buf[offset + 1] = hi;
    hi = hi >> 8;
    buf[offset] = hi;
    return offset + 8;
  }
  Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength2 - 1);
      checkInt(this, value, offset, byteLength2, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength2 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength2;
  };
  Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength2 - 1);
      checkInt(this, value, offset, byteLength2, limit - 1, -limit);
    }
    let i = byteLength2 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength2;
  };
  Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
      value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0)
      value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 340282346638528860000000000000000000000, -340282346638528860000000000000000000000);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer2.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    }
    return len;
  };
  Buffer2.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== undefined && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code = val.charCodeAt(0);
        if (encoding === "utf8" && code < 128 || encoding === "latin1") {
          val = code;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val)
      val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start;i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0;i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  var errors = {};
  function E(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  E("ERR_BUFFER_OUT_OF_BOUNDS", function(name) {
    if (name) {
      return `${name} is outside of buffer bounds`;
    }
    return "Attempt to access memory outside buffer bounds";
  }, RangeError);
  E("ERR_INVALID_ARG_TYPE", function(name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
  }, TypeError);
  E("ERR_OUT_OF_RANGE", function(str, range, input) {
    let msg = `The value of "${str}" is out of range.`;
    let received = input;
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === "bigint") {
      received = String(input);
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received);
      }
      received += "n";
    }
    msg += ` It must be ${range}. Received ${received}`;
    return msg;
  }, RangeError);
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (;i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength2) {
    validateNumber(offset, "offset");
    if (buf[offset] === undefined || buf[offset + byteLength2] === undefined) {
      boundsError(offset, buf.length - (byteLength2 + 1));
    }
  }
  function checkIntBI(value, min, max, buf, offset, byteLength2) {
    if (value > max || value < min) {
      const n = typeof min === "bigint" ? "n" : "";
      let range;
      if (byteLength2 > 3) {
        if (min === 0 || min === BigInt(0)) {
          range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
        } else {
          range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ` + `${(byteLength2 + 1) * 8 - 1}${n}`;
        }
      } else {
        range = `>= ${min}${n} and <= ${max}${n}`;
      }
      throw new errors.ERR_OUT_OF_RANGE("value", range, value);
    }
    checkBounds(buf, offset, byteLength2);
  }
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length, type) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS;
    }
    throw new errors.ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
  }
  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for (let i = 0;i < length; ++i) {
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0;i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c2, hi, lo;
    const byteArray = [];
    for (let i = 0;i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c2 = str.charCodeAt(i);
      hi = c2 >> 8;
      lo = c2 % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length) {
    let i;
    for (i = 0;i < length; ++i) {
      if (i + offset >= dst.length || i >= src.length)
        break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  var hexSliceLookupTable = function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0;i < 16; ++i) {
      const i16 = i * 16;
      for (let j = 0;j < 16; ++j) {
        table[i16 + j] = alphabet[i] + alphabet[j];
      }
    }
    return table;
  }();
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
});

// ../node_modules/milkio/node_modules/xxh3-ts/xxh3.js
var require_xxh3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.XXH3_128 = undefined;
  if (!globalThis.Buffer) {
    globalThis.Buffer = require_buffer().Buffer;
  }
  var n = (n2) => BigInt(n2);
  var PRIME64_1 = n("0x9E3779B185EBCA87");
  var PRIME64_2 = n("0xC2B2AE3D27D4EB4F");
  var PRIME64_3 = n("0x165667B19E3779F9");
  var PRIME64_4 = n("0x85EBCA77C2B2AE63");
  var PRIME64_5 = n("0x27D4EB2F165667C5");
  var kkey = Buffer.from("b8fe6c3923a44bbe7c01812cf721ad1cded46de9839097db7240a4a4b7b3671fcb79e64eccc0e578825ad07dccff7221b8084674f743248ee03590e6813a264c3c2852bb91c300cb88d0658b1b532ea371644897a20df94e3819ef46a9deacd8a8fa763fe39c343ff9dcbbc7c70b4f1d8a51e04bcdb45931c89f7ec9d9787364eac5ac8334d3ebc3c581a0fffa1363eb170ddd51b7f0da49d316552629d4689e2b16be587d47a1fc8ff8b8d17ad031ce45cb3a8f95160428afd7fbcabb4b407e", "hex");
  var mask64 = (n(1) << n(64)) - n(1);
  var mask32 = (n(1) << n(32)) - n(1);
  var STRIPE_LEN = 64;
  var KEYSET_DEFAULT_SIZE = 48;
  var STRIPE_ELTS = STRIPE_LEN / 4;
  var ACC_NB = STRIPE_LEN / 8;
  var _U64 = 8;
  var _U32 = 4;
  function getView(buf, offset = 0) {
    return Buffer.from(buf.buffer, buf.byteOffset + offset, buf.length - offset);
  }
  var XXH_mult32to64 = (a, b) => (a & mask32) * (b & mask32) & mask64;
  var assert = (a) => {
    if (!a)
      throw new Error("Assert failed");
  };
  function XXH3_accumulate_512(acc, data, key) {
    for (let i = 0;i < ACC_NB; i++) {
      const left = 2 * i;
      const right = 2 * i + 1;
      const dataLeft = n(data.readUInt32LE(left * 4));
      const dataRight = n(data.readUInt32LE(right * 4));
      acc[i] += XXH_mult32to64(dataLeft + n(key.readUInt32LE(left * 4)), dataRight + n(key.readUInt32LE(right * 4)));
      acc[i] += dataLeft + (dataRight << n(32));
    }
  }
  function XXH3_accumulate(acc, data, key, nbStripes) {
    for (let n2 = 0, k = 0;n2 < nbStripes; n2++) {
      XXH3_accumulate_512(acc, getView(data, n2 * STRIPE_LEN), getView(key, k));
      k += 2;
    }
  }
  function XXH3_scrambleAcc(acc, key) {
    for (let i = 0;i < ACC_NB; i++) {
      const left = 2 * i;
      const right = 2 * i + 1;
      acc[i] ^= acc[i] >> n(47);
      const p1 = XXH_mult32to64(acc[i] & n("0xFFFFFFFF"), n(key.readUInt32LE(left)));
      const p2 = XXH_mult32to64(acc[i] >> n(32), n(key.readUInt32LE(right)));
      acc[i] = p1 ^ p2;
    }
  }
  function XXH3_mix2Accs(acc, key) {
    return XXH3_mul128(acc.readBigUInt64LE(0) ^ key.readBigUInt64LE(0), acc.readBigUInt64LE(_U64) ^ key.readBigUInt64LE(_U64));
  }
  function XXH3_mergeAccs(acc, key, start) {
    let result64 = start;
    result64 += XXH3_mix2Accs(getView(acc, 0 * _U64), getView(key, 0 * _U32));
    result64 += XXH3_mix2Accs(getView(acc, 2 * _U64), getView(key, 4 * _U32));
    result64 += XXH3_mix2Accs(getView(acc, 4 * _U64), getView(key, 8 * _U32));
    result64 += XXH3_mix2Accs(getView(acc, 6 * _U64), getView(key, 16 * _U32));
    return XXH3_avalanche(result64);
  }
  var NB_KEYS = (KEYSET_DEFAULT_SIZE - STRIPE_ELTS) / 2 | 0;
  function XXH3_hashLong(acc, data) {
    const block_len = STRIPE_LEN * NB_KEYS;
    const nb_blocks = data.length / block_len | 0;
    for (let n2 = 0;n2 < nb_blocks; n2++) {
      XXH3_accumulate(acc, getView(data, n2 * block_len), kkey, NB_KEYS);
      XXH3_scrambleAcc(acc, getView(kkey, 4 * (KEYSET_DEFAULT_SIZE - STRIPE_ELTS)));
    }
    assert(data.length > STRIPE_LEN);
    {
      const nbStripes = data.length % block_len / STRIPE_LEN | 0;
      assert(nbStripes < NB_KEYS);
      XXH3_accumulate(acc, getView(data, nb_blocks * block_len), kkey, nbStripes);
      if (data.length & STRIPE_LEN - 1) {
        const p = getView(data, data.length - STRIPE_LEN);
        XXH3_accumulate_512(acc, p, getView(kkey, nbStripes * 2));
      }
    }
  }
  function XXH3_hashLong_128b(data, seed) {
    const acc = new BigUint64Array([seed, PRIME64_1, PRIME64_2, PRIME64_3, PRIME64_4, PRIME64_5, -seed, n(0)]);
    const accbuf = Buffer.from(acc.buffer);
    assert(data.length > 128);
    XXH3_hashLong(acc, data);
    assert(acc.length * 8 == 64);
    {
      const low64 = XXH3_mergeAccs(accbuf, kkey, n(data.length) * PRIME64_1);
      const high64 = XXH3_mergeAccs(accbuf, getView(kkey, 16), n(data.length + 1) * PRIME64_2);
      return high64 << n(64) | low64;
    }
  }
  function XXH3_mul128(a, b) {
    const lll = a * b;
    return lll + (lll >> n(64)) & mask64;
  }
  function XXH3_mix16B(data, key) {
    return XXH3_mix2Accs(data, key);
  }
  function XXH3_avalanche(h64) {
    h64 ^= h64 >> n(29);
    h64 *= PRIME64_3;
    h64 &= mask64;
    h64 ^= h64 >> n(32);
    return h64;
  }
  function XXH3_len_1to3_128b(data, key32, seed) {
    const len = data.byteLength;
    assert(len > 0 && len <= 3);
    {
      const c1 = data[0];
      const c2 = data[len >> 1];
      const c3 = data[len - 1];
      const l1 = n(c1 + (c2 << 8));
      const l2 = n(len + (c3 << 2));
      const ll11 = XXH_mult32to64(l1 + seed + n(key32.readUInt32LE(0 * _U32)), l2 + n(key32.readUInt32LE(1 * _U32)));
      const ll12 = XXH_mult32to64(l1 + n(key32.readUInt32LE(2 * _U32)), l2 - seed + n(key32.readUInt32LE(3 * _U32)));
      return XXH3_avalanche(ll11 & mask64) << n(64) | XXH3_avalanche(ll12 & mask64);
    }
  }
  function XXH3_len_4to8_128b(data, key32, seed) {
    const len = data.byteLength;
    assert(len >= 4 && len <= 8);
    {
      let acc1 = PRIME64_1 * (n(len) + seed);
      let acc2 = PRIME64_2 * (n(len) - seed);
      const l1 = data.readUInt32LE(0);
      const l2 = data.readUInt32LE(len - 4);
      acc1 += XXH_mult32to64(n(l1 + key32.readUInt32LE(0 * _U32)), n(l2 + key32.readUInt32LE(1 * _U32)));
      acc2 += XXH_mult32to64(n(l1 - key32.readUInt32LE(2 * _U32)), n(l2 + key32.readUInt32LE(3 * _U32)));
      return XXH3_avalanche(acc1 & mask64) << n(64) | XXH3_avalanche(acc2 & mask64);
    }
  }
  function XXH3_len_9to16_128b(data, key64, seed) {
    const len = data.byteLength;
    assert(len >= 9 && len <= 16);
    {
      let acc1 = PRIME64_1 * (n(len) + seed) & mask64;
      let acc2 = PRIME64_2 * (n(len) - seed) & mask64;
      const ll1 = data.readBigUInt64LE();
      const ll2 = data.readBigUInt64LE(len - 8);
      acc1 += XXH3_mul128(ll1 + key64.readBigUInt64LE(0 * _U64), ll2 + key64.readBigUInt64LE(1 * _U64));
      acc2 += XXH3_mul128(ll1 + key64.readBigUInt64LE(2 * _U64), ll2 + key64.readBigUInt64LE(3 * _U64));
      return XXH3_avalanche(acc1 & mask64) << n(64) | XXH3_avalanche(acc2 & mask64);
    }
  }
  function XXH3_len_0to16_128b(data, seed) {
    const len = data.byteLength;
    assert(len <= 16);
    {
      if (len > 8)
        return XXH3_len_9to16_128b(data, kkey, seed);
      if (len >= 4)
        return XXH3_len_4to8_128b(data, kkey, seed);
      if (len > 0)
        return XXH3_len_1to3_128b(data, kkey, seed);
      return seed << n(64) | seed;
    }
  }
  function XXH3_128(data, seed = n(0)) {
    const len = data.length;
    if (len <= 16)
      return XXH3_len_0to16_128b(data, seed);
    let acc1 = PRIME64_1 * (n(len) + seed);
    let acc2 = n(0);
    if (len > 32) {
      if (len > 64) {
        if (len > 96) {
          if (len > 128) {
            return XXH3_hashLong_128b(data, seed);
          }
          acc1 += XXH3_mix16B(getView(data, 48), getView(kkey, 96));
          acc2 += XXH3_mix16B(getView(data, len - 64), getView(kkey, 112));
        }
        acc1 += XXH3_mix16B(getView(data, 32), getView(kkey, 64));
        acc2 += XXH3_mix16B(getView(data, len - 48), getView(kkey, 80));
      }
      acc1 += XXH3_mix16B(getView(data, 16), getView(kkey, 32));
      acc2 += XXH3_mix16B(getView(data, len - 32), getView(kkey, 48));
    }
    acc1 += XXH3_mix16B(getView(data, 0), getView(kkey, 0));
    acc2 += XXH3_mix16B(getView(data, len - 16), getView(kkey, 16));
    const part1 = acc1 + acc2 & mask64;
    const part2 = acc1 * PRIME64_3 + acc2 * PRIME64_4 + (n(len) - seed) * PRIME64_2 & mask64;
    return XXH3_avalanche(part1) << n(64) | XXH3_avalanche(part2);
  }
  exports.XXH3_128 = XXH3_128;
});

// ../node_modules/milkio/node_modules/xxh3-ts/xxh64.js
var require_xxh64 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.XXH64 = undefined;
  if (!globalThis.Buffer) {
    globalThis.Buffer = require_buffer().Buffer;
  }
  var n = (n2) => BigInt(n2);
  var PRIME64_1 = n("11400714785074694791");
  var PRIME64_2 = n("14029467366897019727");
  var PRIME64_3 = n("1609587929392839161");
  var PRIME64_4 = n("9650029242287828579");
  var PRIME64_5 = n("2870177450012600261");
  var mask64 = (n(1) << n(64)) - n(1);
  function getView(buf, offset = 0) {
    return Buffer.from(buf.buffer, buf.byteOffset + offset, buf.length - offset);
  }
  function Rotl64(a, b) {
    return a << b | a >> n(64) - b & mask64;
  }
  function round(acc, lane) {
    acc = acc + lane * PRIME64_2 & mask64;
    acc = Rotl64(acc, n(31)) & mask64;
    return acc * PRIME64_1 & mask64;
  }
  function XH64_mergeAccumulator(acc, accN) {
    acc = acc ^ round(n(0), accN);
    acc = acc * PRIME64_1 & mask64;
    return acc + PRIME64_4 & mask64;
  }
  function XH64_convergeAccumulator(accs) {
    let acc = Rotl64(accs[0], n(1)) + Rotl64(accs[1], n(7)) + Rotl64(accs[2], n(12)) + Rotl64(accs[3], n(18));
    acc = XH64_mergeAccumulator(acc, accs[0]);
    acc = XH64_mergeAccumulator(acc, accs[1]);
    acc = XH64_mergeAccumulator(acc, accs[2]);
    acc = XH64_mergeAccumulator(acc, accs[3]);
    return acc;
  }
  function XH64_accumulateRemainder(data, acc) {
    let offset = 0;
    while (data.byteLength - offset >= 8) {
      let lane = data.readBigUInt64LE(offset);
      acc = acc ^ round(n(0), lane);
      acc = Rotl64(acc, n(27)) * PRIME64_1;
      acc = acc + PRIME64_4 & mask64;
      offset += 8;
    }
    if (data.byteLength - offset >= 4) {
      let lane = BigInt(data.readUInt32LE(offset));
      acc = (acc ^ lane * PRIME64_1) & mask64;
      acc = Rotl64(acc, n(23)) * PRIME64_2 & mask64;
      acc = acc + PRIME64_3 & mask64;
      offset += 4;
    }
    while (data.byteLength - offset >= 1) {
      let lane = BigInt(data.readUInt8(offset));
      acc = (acc ^ lane * PRIME64_5) & mask64;
      acc = Rotl64(acc, n(11)) * PRIME64_1 & mask64;
      offset += 1;
    }
    return acc;
  }
  function XH64_accumulate(data, accs) {
    const fullStripes = Math.floor(data.byteLength / 32);
    for (let i = 0;i < fullStripes; i++) {
      for (let j = 0;j < 4; j++) {
        let lane = data.readBigUInt64LE(i * 32 + j * 8);
        accs[j] = round(accs[j], lane);
      }
    }
    let acc = XH64_convergeAccumulator(accs);
    acc += BigInt(data.byteLength);
    if (fullStripes != data.byteLength / 32) {
      acc = XH64_accumulateRemainder(getView(data, fullStripes * 32), acc);
    }
    return XH64_mix(acc);
  }
  function XH64_mix(acc) {
    acc = acc ^ acc >> n(33);
    acc = acc * PRIME64_2 & mask64;
    acc = acc ^ acc >> n(29);
    acc = acc * PRIME64_3 & mask64;
    acc = acc ^ acc >> n(32);
    return acc;
  }
  function XXH64_small(data, seed) {
    let acc = seed + PRIME64_5 & mask64;
    acc = XH64_accumulateRemainder(data, acc);
    return XH64_mix(acc);
  }
  function XXH64(data, seed = n(0)) {
    if (data.byteLength < 32)
      return XXH64_small(data, seed);
    const acc = new BigUint64Array([
      seed + PRIME64_1 + PRIME64_2,
      seed + PRIME64_2,
      seed,
      seed - PRIME64_1
    ]);
    return XH64_accumulate(data, acc);
  }
  exports.XXH64 = XXH64;
});

// ../node_modules/milkio/node_modules/xxh3-ts/index.js
var require_xxh3_ts = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(require_xxh3(), exports);
  __exportStar(require_xxh64(), exports);
});

// ../node_modules/milkio/node_modules/milkid/index.ts
function defineIdGenerator(options) {
  const textEncoder = new TextEncoder;
  const randLength = (options.length ?? 24) + 1 - (options.timestamp ? 7 : 0) - (options.fingerprint ? 5 : 0);
  let maxRandCharacter = "";
  for (let i = 0;i < randLength; i++)
    maxRandCharacter += "z";
  const maxRandDecimal = characterToDecimal(maxRandCharacter);
  return {
    createId(fingerprint) {
      if (options.fingerprint && !fingerprint)
        throw new Error("fingerprint is required");
      const now = Date.now();
      let id = "";
      if (options.timestamp) {
        id += decimalToCharacter(BigInt(now - (options.magicNumber ?? 733882188971)));
        if (id.length > 7)
          id = id.slice(-7);
      }
      if (options.fingerprint) {
        if (options.hyphen)
          id += "-";
        if (Buffer.isBuffer(fingerprint)) {
          id += decimalToCharacter(BigInt(import_xxh3_ts.XXH64(fingerprint).toString(10))).slice(2, 7);
        } else if (typeof fingerprint === "string") {
          id += decimalToCharacter(BigInt(import_xxh3_ts.XXH64(Buffer.from(textEncoder.encode(fingerprint))).toString(10))).slice(2, 7);
        }
      }
      if (randLength > 1) {
        if (options.hyphen)
          id += "-";
        let decimal;
        if (options.sequential !== false) {
          if (lastTime !== now) {
            lastTime = now;
            decimal = random(maxRandDecimal);
            lastDecimal = decimal;
          } else {
            lastDecimal = lastDecimal + 1n;
            decimal = lastDecimal;
          }
          console.log(lastTime !== now, decimal);
        } else {
          decimal = random(maxRandDecimal);
        }
        id += decimalToCharacter(decimal).padStart(randLength, "0").slice(1, randLength + 1);
      }
      return id;
    }
  };
}
function decimalToCharacter(decimal) {
  let result = "";
  while (decimal > 0) {
    if (decimal <= 62n) {
      result = ENCODING_FIRST_CHAR[Number(decimal % 52n)] + result;
      decimal = decimal / 52n;
    } else {
      result = ENCODING[Number(decimal % 62n)] + result;
      decimal = decimal / 62n;
    }
  }
  return result || "0";
}
function characterToDecimal(character) {
  let decimal = 0n;
  const base = BigInt(ENCODING.length);
  for (let i = 0;i < character.length; i++) {
    const charIndex = ENCODING.indexOf(character[i]);
    decimal = decimal * base + BigInt(charIndex);
  }
  return decimal;
}
function random(limit) {
  if (limit <= 0n)
    throw new Error("Limit must be larger than 0");
  let width = 0n;
  for (let n = limit;n > 0n; width++) {
    n >>= 64n;
  }
  const max = 1n << width * 64n;
  const buf = new BigUint64Array(Number(width));
  const min = max - max % limit;
  let sample = 0n;
  do {
    const arrayBuffer = crypto.getRandomValues(new Uint8Array(buf.length * 8));
    const view = new DataView(arrayBuffer.buffer);
    sample = 0n;
    for (let i = 0;i < buf.length; i++) {
      sample = sample << 64n | BigInt(view.getBigUint64(i * 8));
    }
  } while (sample >= min);
  return sample % limit;
}
var import_xxh3_ts, ENCODING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", ENCODING_FIRST_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", lastTime = 0, lastDecimal = 0n;
var init_milkid = __esm(() => {
  import_xxh3_ts = __toESM(require_xxh3_ts(), 1);
});

// ../node_modules/milkio/utils/create-id.ts
var idGenerator, createId;
var init_create_id = __esm(() => {
  init_milkid();
  idGenerator = defineIdGenerator({
    length: 32,
    hyphen: false,
    fingerprint: false,
    timestamp: true,
    sequential: false
  });
  createId = idGenerator.createId;
});

// ../node_modules/milkio/execute/execute-id-generator.ts
var defineDefaultExecuteIdGenerator = () => {
  return createId;
};
var init_execute_id_generator = __esm(() => {
  init_create_id();
});

// ../node_modules/milkio/world/index.ts
var createWorld = async (generated, configSchema, options) => {
  const executeId = options.executeId ?? defineDefaultExecuteIdGenerator();
  const config2 = await configSchema.get();
  const runtime = {
    request: new Map,
    config: config2
  };
  const eventManager = __initEventManager();
  const _ = {
    ...options,
    executeId,
    runtime,
    on: eventManager.on,
    off: eventManager.off,
    emit: eventManager.emit
  };
  const executer = __initExecuter(generated, _);
  const commander = __initCommander(generated, _);
  const listener = __initListener(generated, _, executer);
  const world = {
    _,
    on: eventManager.on,
    off: eventManager.off,
    emit: eventManager.emit,
    commander,
    listener,
    config: config2
  };
  runtime.app = world;
  if (Array.isArray(options.bootstraps)) {
    for (const bootstrap of options.bootstraps) {
      await bootstrap(world);
    }
  }
  return world;
};
var init_world = __esm(() => {
  init_milkio();
  init_execute_id_generator();
});

// ../node_modules/milkio/command/index.ts
var __initCommander = (generated, runtime) => {
  const commander = async (argv, options) => {
    const params = {
      path: "index",
      commands: [],
      options: {}
    };
    for (const v of argv.slice(3)) {
      if (v.startsWith("--") && v.includes("=")) {
        const vSplited = v.split("=");
        params.options[vSplited[0].slice(2)] = vSplited.slice(1, vSplited.length).join("=");
      } else if (v.startsWith("--")) {
        params.options[v.slice(2)] = "1";
      } else if (v.startsWith("-") && v.includes("=")) {
        const vSplited = v.split("=");
        params.options[vSplited[0].slice(1)] = vSplited.slice(1, vSplited.length).join("=");
      } else if (v.startsWith("-")) {
        params.options[v.slice(1)] = "1";
      } else {
        params.commands.push(v);
      }
    }
    if (argv.length === 2)
      params.path = `index`;
    else
      params.path = `${argv[2] ?? "index"}`;
    if (!(params.path in generated.commandSchema.commands)) {
      if (options?.onNotFound)
        return await options.onNotFound();
      console.log(`\x1B[44m UwU \x1B[0m \x1B[2mCommand not found:\x1B[0m \x1B[32m${params.path}\x1B[0m`);
      return;
    }
    return await generated.commandSchema.commands[params.path].module.handler(params.commands, params.options);
  };
  return commander;
};

// ../node_modules/milkio/action/index.ts
var action = (init) => {
  const action2 = init;
  action2.$milkioType = "action";
  if (action2.meta === undefined)
    action2.meta = {};
  return action2;
};

// ../node_modules/milkio/stream/index.ts
var stream = (init) => {
  const stream2 = init;
  stream2.$milkioType = "stream";
  if (stream2.meta === undefined)
    stream2.meta = {};
  return stream2;
};

// ../node_modules/milkio/node_modules/date-fns/constants.js
var daysInYear = 365.2425, maxTime, minTime, millisecondsInWeek = 604800000, millisecondsInDay = 86400000, secondsInHour = 3600, secondsInDay, secondsInWeek, secondsInYear, secondsInMonth, secondsInQuarter, constructFromSymbol;
var init_constants = __esm(() => {
  maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;
  minTime = -maxTime;
  secondsInDay = secondsInHour * 24;
  secondsInWeek = secondsInDay * 7;
  secondsInYear = secondsInDay * daysInYear;
  secondsInMonth = secondsInYear / 12;
  secondsInQuarter = secondsInMonth * 3;
  constructFromSymbol = Symbol.for("constructDateFrom");
});

// ../node_modules/milkio/node_modules/date-fns/constructFrom.js
function constructFrom(date, value) {
  if (typeof date === "function")
    return date(value);
  if (date && typeof date === "object" && constructFromSymbol in date)
    return date[constructFromSymbol](value);
  if (date instanceof Date)
    return new date.constructor(value);
  return new Date(value);
}
var init_constructFrom = __esm(() => {
  init_constants();
});

// ../node_modules/milkio/node_modules/date-fns/toDate.js
function toDate(argument, context) {
  return constructFrom(context || argument, argument);
}
var init_toDate = __esm(() => {
  init_constructFrom();
});

// ../node_modules/milkio/node_modules/date-fns/addDays.js
var init_addDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addMonths.js
var init_addMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/add.js
var init_add = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSaturday.js
var init_isSaturday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSunday.js
var init_isSunday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isWeekend.js
var init_isWeekend = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addBusinessDays.js
var init_addBusinessDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addMilliseconds.js
var init_addMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addHours.js
var init_addHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/_lib/defaultOptions.js
function getDefaultOptions() {
  return defaultOptions;
}
var defaultOptions;
var init_defaultOptions = __esm(() => {
  defaultOptions = {};
});

// ../node_modules/milkio/node_modules/date-fns/startOfWeek.js
function startOfWeek(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const _date = toDate(date, options?.in);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfWeek = __esm(() => {
  init_defaultOptions();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/startOfISOWeek.js
function startOfISOWeek(date, options) {
  return startOfWeek(date, { ...options, weekStartsOn: 1 });
}
var init_startOfISOWeek = __esm(() => {
  init_startOfWeek();
});

// ../node_modules/milkio/node_modules/date-fns/getISOWeekYear.js
function getISOWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = constructFrom(_date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = constructFrom(_date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}
var init_getISOWeekYear = __esm(() => {
  init_constructFrom();
  init_startOfISOWeek();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.js
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
var init_getTimezoneOffsetInMilliseconds = __esm(() => {
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/_lib/normalizeDates.js
function normalizeDates(context, ...dates) {
  const normalize = constructFrom.bind(null, context || dates.find((date) => typeof date === "object"));
  return dates.map(normalize);
}
var init_normalizeDates = __esm(() => {
  init_constructFrom();
});

// ../node_modules/milkio/node_modules/date-fns/startOfDay.js
function startOfDay(date, options) {
  const _date = toDate(date, options?.in);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
var init_startOfDay = __esm(() => {
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarDays.js
function differenceInCalendarDays(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(options?.in, laterDate, earlierDate);
  const laterStartOfDay = startOfDay(laterDate_);
  const earlierStartOfDay = startOfDay(earlierDate_);
  const laterTimestamp = +laterStartOfDay - getTimezoneOffsetInMilliseconds(laterStartOfDay);
  const earlierTimestamp = +earlierStartOfDay - getTimezoneOffsetInMilliseconds(earlierStartOfDay);
  return Math.round((laterTimestamp - earlierTimestamp) / millisecondsInDay);
}
var init_differenceInCalendarDays = __esm(() => {
  init_getTimezoneOffsetInMilliseconds();
  init_normalizeDates();
  init_constants();
  init_startOfDay();
});

// ../node_modules/milkio/node_modules/date-fns/startOfISOWeekYear.js
function startOfISOWeekYear(date, options) {
  const year = getISOWeekYear(date, options);
  const fourthOfJanuary = constructFrom(options?.in || date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return startOfISOWeek(fourthOfJanuary);
}
var init_startOfISOWeekYear = __esm(() => {
  init_constructFrom();
  init_getISOWeekYear();
  init_startOfISOWeek();
});

// ../node_modules/milkio/node_modules/date-fns/setISOWeekYear.js
var init_setISOWeekYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addISOWeekYears.js
var init_addISOWeekYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addMinutes.js
var init_addMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addQuarters.js
var init_addQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addSeconds.js
var init_addSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addWeeks.js
var init_addWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/addYears.js
var init_addYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/areIntervalsOverlapping.js
var init_areIntervalsOverlapping = () => {
};

// ../node_modules/milkio/node_modules/date-fns/max.js
var init_max = () => {
};

// ../node_modules/milkio/node_modules/date-fns/min.js
var init_min = () => {
};

// ../node_modules/milkio/node_modules/date-fns/clamp.js
var init_clamp = () => {
};

// ../node_modules/milkio/node_modules/date-fns/closestIndexTo.js
var init_closestIndexTo = () => {
};

// ../node_modules/milkio/node_modules/date-fns/closestTo.js
var init_closestTo = () => {
};

// ../node_modules/milkio/node_modules/date-fns/compareAsc.js
var init_compareAsc = () => {
};

// ../node_modules/milkio/node_modules/date-fns/compareDesc.js
var init_compareDesc = () => {
};

// ../node_modules/milkio/node_modules/date-fns/constructNow.js
var init_constructNow = () => {
};

// ../node_modules/milkio/node_modules/date-fns/daysToWeeks.js
var init_daysToWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameDay.js
var init_isSameDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isDate.js
function isDate(value) {
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}
var init_isDate = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isValid.js
function isValid(date) {
  return !(!isDate(date) && typeof date !== "number" || isNaN(+toDate(date)));
}
var init_isValid = __esm(() => {
  init_isDate();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/differenceInBusinessDays.js
var init_differenceInBusinessDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarISOWeekYears.js
var init_differenceInCalendarISOWeekYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarISOWeeks.js
var init_differenceInCalendarISOWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarMonths.js
var init_differenceInCalendarMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getQuarter.js
var init_getQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarQuarters.js
var init_differenceInCalendarQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarWeeks.js
var init_differenceInCalendarWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInCalendarYears.js
var init_differenceInCalendarYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInDays.js
var init_differenceInDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInHours.js
var init_differenceInHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subISOWeekYears.js
var init_subISOWeekYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInISOWeekYears.js
var init_differenceInISOWeekYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInMilliseconds.js
var init_differenceInMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInMinutes.js
var init_differenceInMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfDay.js
var init_endOfDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfMonth.js
var init_endOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isLastDayOfMonth.js
var init_isLastDayOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInMonths.js
var init_differenceInMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInQuarters.js
var init_differenceInQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInSeconds.js
var init_differenceInSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInWeeks.js
var init_differenceInWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/differenceInYears.js
var init_differenceInYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachDayOfInterval.js
var init_eachDayOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachHourOfInterval.js
var init_eachHourOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachMinuteOfInterval.js
var init_eachMinuteOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachMonthOfInterval.js
var init_eachMonthOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfQuarter.js
var init_startOfQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachQuarterOfInterval.js
var init_eachQuarterOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachWeekOfInterval.js
var init_eachWeekOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachWeekendOfInterval.js
var init_eachWeekendOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfMonth.js
var init_startOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachWeekendOfMonth.js
var init_eachWeekendOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfYear.js
var init_endOfYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfYear.js
function startOfYear(date, options) {
  const date_ = toDate(date, options?.in);
  date_.setFullYear(date_.getFullYear(), 0, 1);
  date_.setHours(0, 0, 0, 0);
  return date_;
}
var init_startOfYear = __esm(() => {
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/eachWeekendOfYear.js
var init_eachWeekendOfYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/eachYearOfInterval.js
var init_eachYearOfInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfDecade.js
var init_endOfDecade = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfHour.js
var init_endOfHour = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfWeek.js
var init_endOfWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfISOWeek.js
var init_endOfISOWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfISOWeekYear.js
var init_endOfISOWeekYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfMinute.js
var init_endOfMinute = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfQuarter.js
var init_endOfQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfSecond.js
var init_endOfSecond = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfToday.js
var init_endOfToday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfTomorrow.js
var init_endOfTomorrow = () => {
};

// ../node_modules/milkio/node_modules/date-fns/endOfYesterday.js
var init_endOfYesterday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var formatDistanceLocale, formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
var init_formatDistance = __esm(() => {
  formatDistanceLocale = {
    lessThanXSeconds: {
      one: "less than a second",
      other: "less than {{count}} seconds"
    },
    xSeconds: {
      one: "1 second",
      other: "{{count}} seconds"
    },
    halfAMinute: "half a minute",
    lessThanXMinutes: {
      one: "less than a minute",
      other: "less than {{count}} minutes"
    },
    xMinutes: {
      one: "1 minute",
      other: "{{count}} minutes"
    },
    aboutXHours: {
      one: "about 1 hour",
      other: "about {{count}} hours"
    },
    xHours: {
      one: "1 hour",
      other: "{{count}} hours"
    },
    xDays: {
      one: "1 day",
      other: "{{count}} days"
    },
    aboutXWeeks: {
      one: "about 1 week",
      other: "about {{count}} weeks"
    },
    xWeeks: {
      one: "1 week",
      other: "{{count}} weeks"
    },
    aboutXMonths: {
      one: "about 1 month",
      other: "about {{count}} months"
    },
    xMonths: {
      one: "1 month",
      other: "{{count}} months"
    },
    aboutXYears: {
      one: "about 1 year",
      other: "about {{count}} years"
    },
    xYears: {
      one: "1 year",
      other: "{{count}} years"
    },
    overXYears: {
      one: "over 1 year",
      other: "over {{count}} years"
    },
    almostXYears: {
      one: "almost 1 year",
      other: "almost {{count}} years"
    }
  };
});

// ../node_modules/milkio/node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

// ../node_modules/milkio/node_modules/date-fns/locale/en-US/_lib/formatLong.js
var dateFormats, timeFormats, dateTimeFormats, formatLong;
var init_formatLong = __esm(() => {
  dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy"
  };
  timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a"
  };
  dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}"
  };
  formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full"
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full"
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full"
    })
  };
});

// ../node_modules/milkio/node_modules/date-fns/locale/en-US/_lib/formatRelative.js
var formatRelativeLocale, formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
var init_formatRelative = __esm(() => {
  formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P"
  };
});

// ../node_modules/milkio/node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = options?.context ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = options?.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = options?.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}

// ../node_modules/milkio/node_modules/date-fns/locale/en-US/_lib/localize.js
var eraValues, quarterValues, monthValues, dayValues, dayPeriodValues, formattingDayPeriodValues, ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
}, localize;
var init_localize = __esm(() => {
  eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"]
  };
  quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
  };
  monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  };
  dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  };
  dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night"
    }
  };
  formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night"
    }
  };
  localize = {
    ordinalNumber,
    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: "wide"
    }),
    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: "wide",
      argumentCallback: (quarter) => quarter - 1
    }),
    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: "wide"
    }),
    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: "wide"
    }),
    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: "wide",
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: "wide"
    })
  };
});

// ../node_modules/milkio/node_modules/date-fns/locale/_lib/buildMatchFn.js
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : findKey(parsePatterns, (pattern) => pattern.test(matchedString));
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return;
}
function findIndex(array, predicate) {
  for (let key = 0;key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return;
}

// ../node_modules/milkio/node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult)
      return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult)
      return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}

// ../node_modules/milkio/node_modules/date-fns/locale/en-US/_lib/match.js
var matchOrdinalNumberPattern, parseOrdinalNumberPattern, matchEraPatterns, parseEraPatterns, matchQuarterPatterns, parseQuarterPatterns, matchMonthPatterns, parseMonthPatterns, matchDayPatterns, parseDayPatterns, matchDayPeriodPatterns, parseDayPeriodPatterns, match;
var init_match = __esm(() => {
  matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  parseOrdinalNumberPattern = /\d+/i;
  matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };
  matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };
  matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i
    ]
  };
  matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };
  matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };
  match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: (value) => parseInt(value, 10)
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any"
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: (index) => index + 1
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any"
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any"
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any"
    })
  };
});

// ../node_modules/milkio/node_modules/date-fns/locale/en-US.js
var enUS;
var init_en_US = __esm(() => {
  init_formatDistance();
  init_formatLong();
  init_formatRelative();
  init_localize();
  init_match();
  enUS = {
    code: "en-US",
    formatDistance,
    formatLong,
    formatRelative,
    localize,
    match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1
    }
  };
});

// ../node_modules/milkio/node_modules/date-fns/_lib/defaultLocale.js
var init_defaultLocale = __esm(() => {
  init_en_US();
});

// ../node_modules/milkio/node_modules/date-fns/getDayOfYear.js
function getDayOfYear(date, options) {
  const _date = toDate(date, options?.in);
  const diff = differenceInCalendarDays(_date, startOfYear(_date));
  const dayOfYear = diff + 1;
  return dayOfYear;
}
var init_getDayOfYear = __esm(() => {
  init_differenceInCalendarDays();
  init_startOfYear();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/getISOWeek.js
function getISOWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfISOWeek(_date) - +startOfISOWeekYear(_date);
  return Math.round(diff / millisecondsInWeek) + 1;
}
var init_getISOWeek = __esm(() => {
  init_constants();
  init_startOfISOWeek();
  init_startOfISOWeekYear();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/getWeekYear.js
function getWeekYear(date, options) {
  const _date = toDate(date, options?.in);
  const year = _date.getFullYear();
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const firstWeekOfNextYear = constructFrom(options?.in || date, 0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  const firstWeekOfThisYear = constructFrom(options?.in || date, 0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (+_date >= +startOfNextYear) {
    return year + 1;
  } else if (+_date >= +startOfThisYear) {
    return year;
  } else {
    return year - 1;
  }
}
var init_getWeekYear = __esm(() => {
  init_defaultOptions();
  init_constructFrom();
  init_startOfWeek();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/startOfWeekYear.js
function startOfWeekYear(date, options) {
  const defaultOptions2 = getDefaultOptions();
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const year = getWeekYear(date, options);
  const firstWeek = constructFrom(options?.in || date, 0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  const _date = startOfWeek(firstWeek, options);
  return _date;
}
var init_startOfWeekYear = __esm(() => {
  init_defaultOptions();
  init_constructFrom();
  init_getWeekYear();
  init_startOfWeek();
});

// ../node_modules/milkio/node_modules/date-fns/getWeek.js
function getWeek(date, options) {
  const _date = toDate(date, options?.in);
  const diff = +startOfWeek(_date, options) - +startOfWeekYear(_date, options);
  return Math.round(diff / millisecondsInWeek) + 1;
}
var init_getWeek = __esm(() => {
  init_constants();
  init_startOfWeek();
  init_startOfWeekYear();
  init_toDate();
});

// ../node_modules/milkio/node_modules/date-fns/_lib/addLeadingZeros.js
function addLeadingZeros(number, targetLength) {
  const sign = number < 0 ? "-" : "";
  const output = Math.abs(number).toString().padStart(targetLength, "0");
  return sign + output;
}

// ../node_modules/milkio/node_modules/date-fns/_lib/format/lightFormatters.js
var lightFormatters;
var init_lightFormatters = __esm(() => {
  lightFormatters = {
    y(date, token) {
      const signedYear = date.getFullYear();
      const year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
    },
    M(date, token) {
      const month = date.getMonth();
      return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
    },
    d(date, token) {
      return addLeadingZeros(date.getDate(), token.length);
    },
    a(date, token) {
      const dayPeriodEnumValue = date.getHours() / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return dayPeriodEnumValue.toUpperCase();
        case "aaa":
          return dayPeriodEnumValue;
        case "aaaaa":
          return dayPeriodEnumValue[0];
        case "aaaa":
        default:
          return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
      }
    },
    h(date, token) {
      return addLeadingZeros(date.getHours() % 12 || 12, token.length);
    },
    H(date, token) {
      return addLeadingZeros(date.getHours(), token.length);
    },
    m(date, token) {
      return addLeadingZeros(date.getMinutes(), token.length);
    },
    s(date, token) {
      return addLeadingZeros(date.getSeconds(), token.length);
    },
    S(date, token) {
      const numberOfDigits = token.length;
      const milliseconds = date.getMilliseconds();
      const fractionalSeconds = Math.trunc(milliseconds * Math.pow(10, numberOfDigits - 3));
      return addLeadingZeros(fractionalSeconds, token.length);
    }
  };
});

// ../node_modules/milkio/node_modules/date-fns/_lib/format/formatters.js
function formatTimezoneShort(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = Math.trunc(absOffset / 60);
  const minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, delimiter) {
  if (offset % 60 === 0) {
    const sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, delimiter);
}
function formatTimezone(offset, delimiter = "") {
  const sign = offset > 0 ? "-" : "+";
  const absOffset = Math.abs(offset);
  const hours = addLeadingZeros(Math.trunc(absOffset / 60), 2);
  const minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
var dayPeriodEnum, formatters;
var init_formatters = __esm(() => {
  init_getDayOfYear();
  init_getISOWeek();
  init_getISOWeekYear();
  init_getWeek();
  init_getWeekYear();
  init_lightFormatters();
  dayPeriodEnum = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  };
  formatters = {
    G: function(date, token, localize2) {
      const era = date.getFullYear() > 0 ? 1 : 0;
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return localize2.era(era, { width: "abbreviated" });
        case "GGGGG":
          return localize2.era(era, { width: "narrow" });
        case "GGGG":
        default:
          return localize2.era(era, { width: "wide" });
      }
    },
    y: function(date, token, localize2) {
      if (token === "yo") {
        const signedYear = date.getFullYear();
        const year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize2.ordinalNumber(year, { unit: "year" });
      }
      return lightFormatters.y(date, token);
    },
    Y: function(date, token, localize2, options) {
      const signedWeekYear = getWeekYear(date, options);
      const weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
      if (token === "YY") {
        const twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2);
      }
      if (token === "Yo") {
        return localize2.ordinalNumber(weekYear, { unit: "year" });
      }
      return addLeadingZeros(weekYear, token.length);
    },
    R: function(date, token) {
      const isoWeekYear = getISOWeekYear(date);
      return addLeadingZeros(isoWeekYear, token.length);
    },
    u: function(date, token) {
      const year = date.getFullYear();
      return addLeadingZeros(year, token.length);
    },
    Q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "Q":
          return String(quarter);
        case "QQ":
          return addLeadingZeros(quarter, 2);
        case "Qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "QQQ":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "formatting"
          });
        case "QQQQQ":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    q: function(date, token, localize2) {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      switch (token) {
        case "q":
          return String(quarter);
        case "qq":
          return addLeadingZeros(quarter, 2);
        case "qo":
          return localize2.ordinalNumber(quarter, { unit: "quarter" });
        case "qqq":
          return localize2.quarter(quarter, {
            width: "abbreviated",
            context: "standalone"
          });
        case "qqqqq":
          return localize2.quarter(quarter, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return localize2.quarter(quarter, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    M: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "M":
        case "MM":
          return lightFormatters.M(date, token);
        case "Mo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "MMM":
          return localize2.month(month, {
            width: "abbreviated",
            context: "formatting"
          });
        case "MMMMM":
          return localize2.month(month, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return localize2.month(month, { width: "wide", context: "formatting" });
      }
    },
    L: function(date, token, localize2) {
      const month = date.getMonth();
      switch (token) {
        case "L":
          return String(month + 1);
        case "LL":
          return addLeadingZeros(month + 1, 2);
        case "Lo":
          return localize2.ordinalNumber(month + 1, { unit: "month" });
        case "LLL":
          return localize2.month(month, {
            width: "abbreviated",
            context: "standalone"
          });
        case "LLLLL":
          return localize2.month(month, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return localize2.month(month, { width: "wide", context: "standalone" });
      }
    },
    w: function(date, token, localize2, options) {
      const week = getWeek(date, options);
      if (token === "wo") {
        return localize2.ordinalNumber(week, { unit: "week" });
      }
      return addLeadingZeros(week, token.length);
    },
    I: function(date, token, localize2) {
      const isoWeek = getISOWeek(date);
      if (token === "Io") {
        return localize2.ordinalNumber(isoWeek, { unit: "week" });
      }
      return addLeadingZeros(isoWeek, token.length);
    },
    d: function(date, token, localize2) {
      if (token === "do") {
        return localize2.ordinalNumber(date.getDate(), { unit: "date" });
      }
      return lightFormatters.d(date, token);
    },
    D: function(date, token, localize2) {
      const dayOfYear = getDayOfYear(date);
      if (token === "Do") {
        return localize2.ordinalNumber(dayOfYear, { unit: "dayOfYear" });
      }
      return addLeadingZeros(dayOfYear, token.length);
    },
    E: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "EEEEE":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "EEEE":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    e: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "e":
          return String(localDayOfWeek);
        case "ee":
          return addLeadingZeros(localDayOfWeek, 2);
        case "eo":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "eee":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "eeeee":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "eeee":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    c: function(date, token, localize2, options) {
      const dayOfWeek = date.getDay();
      const localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        case "c":
          return String(localDayOfWeek);
        case "cc":
          return addLeadingZeros(localDayOfWeek, token.length);
        case "co":
          return localize2.ordinalNumber(localDayOfWeek, { unit: "day" });
        case "ccc":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "standalone"
          });
        case "ccccc":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "standalone"
          });
        case "cccc":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "standalone"
          });
      }
    },
    i: function(date, token, localize2) {
      const dayOfWeek = date.getDay();
      const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        case "i":
          return String(isoDayOfWeek);
        case "ii":
          return addLeadingZeros(isoDayOfWeek, token.length);
        case "io":
          return localize2.ordinalNumber(isoDayOfWeek, { unit: "day" });
        case "iii":
          return localize2.day(dayOfWeek, {
            width: "abbreviated",
            context: "formatting"
          });
        case "iiiii":
          return localize2.day(dayOfWeek, {
            width: "narrow",
            context: "formatting"
          });
        case "iiiiii":
          return localize2.day(dayOfWeek, {
            width: "short",
            context: "formatting"
          });
        case "iiii":
        default:
          return localize2.day(dayOfWeek, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    a: function(date, token, localize2) {
      const hours = date.getHours();
      const dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      switch (token) {
        case "a":
        case "aa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "aaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "aaaaa":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    b: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
      }
      switch (token) {
        case "b":
        case "bb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "bbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          }).toLowerCase();
        case "bbbbb":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    B: function(date, token, localize2) {
      const hours = date.getHours();
      let dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "abbreviated",
            context: "formatting"
          });
        case "BBBBB":
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return localize2.dayPeriod(dayPeriodEnumValue, {
            width: "wide",
            context: "formatting"
          });
      }
    },
    h: function(date, token, localize2) {
      if (token === "ho") {
        let hours = date.getHours() % 12;
        if (hours === 0)
          hours = 12;
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return lightFormatters.h(date, token);
    },
    H: function(date, token, localize2) {
      if (token === "Ho") {
        return localize2.ordinalNumber(date.getHours(), { unit: "hour" });
      }
      return lightFormatters.H(date, token);
    },
    K: function(date, token, localize2) {
      const hours = date.getHours() % 12;
      if (token === "Ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    k: function(date, token, localize2) {
      let hours = date.getHours();
      if (hours === 0)
        hours = 24;
      if (token === "ko") {
        return localize2.ordinalNumber(hours, { unit: "hour" });
      }
      return addLeadingZeros(hours, token.length);
    },
    m: function(date, token, localize2) {
      if (token === "mo") {
        return localize2.ordinalNumber(date.getMinutes(), { unit: "minute" });
      }
      return lightFormatters.m(date, token);
    },
    s: function(date, token, localize2) {
      if (token === "so") {
        return localize2.ordinalNumber(date.getSeconds(), { unit: "second" });
      }
      return lightFormatters.s(date, token);
    },
    S: function(date, token) {
      return lightFormatters.S(date, token);
    },
    X: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      if (timezoneOffset === 0) {
        return "Z";
      }
      switch (token) {
        case "X":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "XXXX":
        case "XX":
          return formatTimezone(timezoneOffset);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    x: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "x":
          return formatTimezoneWithOptionalMinutes(timezoneOffset);
        case "xxxx":
        case "xx":
          return formatTimezone(timezoneOffset);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(timezoneOffset, ":");
      }
    },
    O: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    z: function(date, token, _localize) {
      const timezoneOffset = date.getTimezoneOffset();
      switch (token) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(timezoneOffset, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(timezoneOffset, ":");
      }
    },
    t: function(date, token, _localize) {
      const timestamp = Math.trunc(+date / 1000);
      return addLeadingZeros(timestamp, token.length);
    },
    T: function(date, token, _localize) {
      return addLeadingZeros(+date, token.length);
    }
  };
});

// ../node_modules/milkio/node_modules/date-fns/_lib/format/longFormatters.js
var dateLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "P":
      return formatLong2.date({ width: "short" });
    case "PP":
      return formatLong2.date({ width: "medium" });
    case "PPP":
      return formatLong2.date({ width: "long" });
    case "PPPP":
    default:
      return formatLong2.date({ width: "full" });
  }
}, timeLongFormatter = (pattern, formatLong2) => {
  switch (pattern) {
    case "p":
      return formatLong2.time({ width: "short" });
    case "pp":
      return formatLong2.time({ width: "medium" });
    case "ppp":
      return formatLong2.time({ width: "long" });
    case "pppp":
    default:
      return formatLong2.time({ width: "full" });
  }
}, dateTimeLongFormatter = (pattern, formatLong2) => {
  const matchResult = pattern.match(/(P+)(p+)?/) || [];
  const datePattern = matchResult[1];
  const timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  let dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({ width: "short" });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({ width: "medium" });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({ width: "full" });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
}, longFormatters;
var init_longFormatters = __esm(() => {
  longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };
});

// ../node_modules/milkio/node_modules/date-fns/_lib/protectedTokens.js
function isProtectedDayOfYearToken(token) {
  return dayOfYearTokenRE.test(token);
}
function isProtectedWeekYearToken(token) {
  return weekYearTokenRE.test(token);
}
function warnOrThrowProtectedError(token, format, input) {
  const _message = message(token, format, input);
  console.warn(_message);
  if (throwTokens.includes(token))
    throw new RangeError(_message);
}
function message(token, format, input) {
  const subject = token[0] === "Y" ? "years" : "days of the month";
  return `Use \`${token.toLowerCase()}\` instead of \`${token}\` (in \`${format}\`) for formatting ${subject} to the input \`${input}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
var dayOfYearTokenRE, weekYearTokenRE, throwTokens;
var init_protectedTokens = __esm(() => {
  dayOfYearTokenRE = /^D+$/;
  weekYearTokenRE = /^Y+$/;
  throwTokens = ["D", "DD", "YY", "YYYY"];
});

// ../node_modules/milkio/node_modules/date-fns/format.js
function format(date, formatStr, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = options?.locale ?? defaultOptions2.locale ?? enUS;
  const firstWeekContainsDate = options?.firstWeekContainsDate ?? options?.locale?.options?.firstWeekContainsDate ?? defaultOptions2.firstWeekContainsDate ?? defaultOptions2.locale?.options?.firstWeekContainsDate ?? 1;
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions2.weekStartsOn ?? defaultOptions2.locale?.options?.weekStartsOn ?? 0;
  const originalDate = toDate(date, options?.in);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  let parts = formatStr.match(longFormattingTokensRegExp).map((substring) => {
    const firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      const longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map((substring) => {
    if (substring === "''") {
      return { isToken: false, value: "'" };
    }
    const firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return { isToken: false, value: cleanEscapedString(substring) };
    }
    if (formatters[firstCharacter]) {
      return { isToken: true, value: substring };
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return { isToken: false, value: substring };
  });
  if (locale.localize.preprocessor) {
    parts = locale.localize.preprocessor(originalDate, parts);
  }
  const formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale
  };
  return parts.map((part) => {
    if (!part.isToken)
      return part.value;
    const token = part.value;
    if (!options?.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token) || !options?.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      warnOrThrowProtectedError(token, formatStr, String(date));
    }
    const formatter = formatters[token[0]];
    return formatter(originalDate, token, locale.localize, formatterOptions);
  }).join("");
}
function cleanEscapedString(input) {
  const matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}
var formattingTokensRegExp, longFormattingTokensRegExp, escapedStringRegExp, doubleQuoteRegExp, unescapedLatinCharacterRegExp;
var init_format = __esm(() => {
  init_defaultLocale();
  init_defaultOptions();
  init_formatters();
  init_longFormatters();
  init_protectedTokens();
  init_isValid();
  init_toDate();
  formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
  longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
  escapedStringRegExp = /^'([^]*?)'?$/;
  doubleQuoteRegExp = /''/g;
  unescapedLatinCharacterRegExp = /[a-zA-Z]/;
});

// ../node_modules/milkio/node_modules/date-fns/formatDistance.js
var init_formatDistance2 = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatDistanceStrict.js
var init_formatDistanceStrict = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatDistanceToNow.js
var init_formatDistanceToNow = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatDistanceToNowStrict.js
var init_formatDistanceToNowStrict = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatDuration.js
var init_formatDuration = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatISO.js
var init_formatISO = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatISO9075.js
var init_formatISO9075 = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatISODuration.js
var init_formatISODuration = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatRFC3339.js
var init_formatRFC3339 = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatRFC7231.js
var init_formatRFC7231 = () => {
};

// ../node_modules/milkio/node_modules/date-fns/formatRelative.js
var init_formatRelative2 = () => {
};

// ../node_modules/milkio/node_modules/date-fns/fromUnixTime.js
var init_fromUnixTime = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDate.js
var init_getDate = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDay.js
var init_getDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDaysInMonth.js
var init_getDaysInMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isLeapYear.js
var init_isLeapYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDaysInYear.js
var init_getDaysInYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDecade.js
var init_getDecade = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getDefaultOptions.js
var init_getDefaultOptions = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getHours.js
var init_getHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getISODay.js
var init_getISODay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getISOWeeksInYear.js
var init_getISOWeeksInYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getMilliseconds.js
var init_getMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getMinutes.js
var init_getMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getMonth.js
var init_getMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getOverlappingDaysInIntervals.js
var init_getOverlappingDaysInIntervals = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getSeconds.js
var init_getSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getTime.js
var init_getTime = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getUnixTime.js
var init_getUnixTime = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getWeekOfMonth.js
var init_getWeekOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfMonth.js
var init_lastDayOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getWeeksInMonth.js
var init_getWeeksInMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/getYear.js
var init_getYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/hoursToMilliseconds.js
var init_hoursToMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/hoursToMinutes.js
var init_hoursToMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/hoursToSeconds.js
var init_hoursToSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/interval.js
var init_interval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/intervalToDuration.js
var init_intervalToDuration = () => {
};

// ../node_modules/milkio/node_modules/date-fns/intlFormat.js
var init_intlFormat = () => {
};

// ../node_modules/milkio/node_modules/date-fns/intlFormatDistance.js
var init_intlFormatDistance = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isAfter.js
var init_isAfter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isBefore.js
var init_isBefore = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isEqual.js
var init_isEqual = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isExists.js
var init_isExists = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isFirstDayOfMonth.js
var init_isFirstDayOfMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isFriday.js
var init_isFriday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isFuture.js
var init_isFuture = () => {
};

// ../node_modules/milkio/node_modules/date-fns/transpose.js
var init_transpose = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setWeek.js
var init_setWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setISOWeek.js
var init_setISOWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setDay.js
var init_setDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setISODay.js
var init_setISODay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/parse.js
var init_parse = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isMatch.js
var init_isMatch = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isMonday.js
var init_isMonday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isPast.js
var init_isPast = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfHour.js
var init_startOfHour = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameHour.js
var init_isSameHour = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameWeek.js
var init_isSameWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameISOWeek.js
var init_isSameISOWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameISOWeekYear.js
var init_isSameISOWeekYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfMinute.js
var init_startOfMinute = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameMinute.js
var init_isSameMinute = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameMonth.js
var init_isSameMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameQuarter.js
var init_isSameQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfSecond.js
var init_startOfSecond = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameSecond.js
var init_isSameSecond = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isSameYear.js
var init_isSameYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisHour.js
var init_isThisHour = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisISOWeek.js
var init_isThisISOWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisMinute.js
var init_isThisMinute = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisMonth.js
var init_isThisMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisQuarter.js
var init_isThisQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisSecond.js
var init_isThisSecond = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisWeek.js
var init_isThisWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThisYear.js
var init_isThisYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isThursday.js
var init_isThursday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isToday.js
var init_isToday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isTomorrow.js
var init_isTomorrow = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isTuesday.js
var init_isTuesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isWednesday.js
var init_isWednesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isWithinInterval.js
var init_isWithinInterval = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subDays.js
var init_subDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/isYesterday.js
var init_isYesterday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfDecade.js
var init_lastDayOfDecade = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfWeek.js
var init_lastDayOfWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfISOWeek.js
var init_lastDayOfISOWeek = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfISOWeekYear.js
var init_lastDayOfISOWeekYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfQuarter.js
var init_lastDayOfQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lastDayOfYear.js
var init_lastDayOfYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/lightFormat.js
var init_lightFormat = () => {
};

// ../node_modules/milkio/node_modules/date-fns/milliseconds.js
var init_milliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/millisecondsToHours.js
var init_millisecondsToHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/millisecondsToMinutes.js
var init_millisecondsToMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/millisecondsToSeconds.js
var init_millisecondsToSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/minutesToHours.js
var init_minutesToHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/minutesToMilliseconds.js
var init_minutesToMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/minutesToSeconds.js
var init_minutesToSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/monthsToQuarters.js
var init_monthsToQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/monthsToYears.js
var init_monthsToYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextDay.js
var init_nextDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextFriday.js
var init_nextFriday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextMonday.js
var init_nextMonday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextSaturday.js
var init_nextSaturday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextSunday.js
var init_nextSunday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextThursday.js
var init_nextThursday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextTuesday.js
var init_nextTuesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/nextWednesday.js
var init_nextWednesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/parseISO.js
var init_parseISO = () => {
};

// ../node_modules/milkio/node_modules/date-fns/parseJSON.js
var init_parseJSON = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousDay.js
var init_previousDay = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousFriday.js
var init_previousFriday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousMonday.js
var init_previousMonday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousSaturday.js
var init_previousSaturday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousSunday.js
var init_previousSunday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousThursday.js
var init_previousThursday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousTuesday.js
var init_previousTuesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/previousWednesday.js
var init_previousWednesday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/quartersToMonths.js
var init_quartersToMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/quartersToYears.js
var init_quartersToYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/roundToNearestHours.js
var init_roundToNearestHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/roundToNearestMinutes.js
var init_roundToNearestMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/secondsToHours.js
var init_secondsToHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/secondsToMilliseconds.js
var init_secondsToMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/secondsToMinutes.js
var init_secondsToMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setMonth.js
var init_setMonth = () => {
};

// ../node_modules/milkio/node_modules/date-fns/set.js
var init_set = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setDate.js
var init_setDate = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setDayOfYear.js
var init_setDayOfYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setDefaultOptions.js
var init_setDefaultOptions = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setHours.js
var init_setHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setMilliseconds.js
var init_setMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setMinutes.js
var init_setMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setQuarter.js
var init_setQuarter = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setSeconds.js
var init_setSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setWeekYear.js
var init_setWeekYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/setYear.js
var init_setYear = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfDecade.js
var init_startOfDecade = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfToday.js
var init_startOfToday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfTomorrow.js
var init_startOfTomorrow = () => {
};

// ../node_modules/milkio/node_modules/date-fns/startOfYesterday.js
var init_startOfYesterday = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subMonths.js
var init_subMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/sub.js
var init_sub = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subBusinessDays.js
var init_subBusinessDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subHours.js
var init_subHours = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subMilliseconds.js
var init_subMilliseconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subMinutes.js
var init_subMinutes = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subQuarters.js
var init_subQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subSeconds.js
var init_subSeconds = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subWeeks.js
var init_subWeeks = () => {
};

// ../node_modules/milkio/node_modules/date-fns/subYears.js
var init_subYears = () => {
};

// ../node_modules/milkio/node_modules/date-fns/weeksToDays.js
var init_weeksToDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/yearsToDays.js
var init_yearsToDays = () => {
};

// ../node_modules/milkio/node_modules/date-fns/yearsToMonths.js
var init_yearsToMonths = () => {
};

// ../node_modules/milkio/node_modules/date-fns/yearsToQuarters.js
var init_yearsToQuarters = () => {
};

// ../node_modules/milkio/node_modules/date-fns/index.js
var init_date_fns = __esm(() => {
  init_add();
  init_addBusinessDays();
  init_addDays();
  init_addHours();
  init_addISOWeekYears();
  init_addMilliseconds();
  init_addMinutes();
  init_addMonths();
  init_addQuarters();
  init_addSeconds();
  init_addWeeks();
  init_addYears();
  init_areIntervalsOverlapping();
  init_clamp();
  init_closestIndexTo();
  init_closestTo();
  init_compareAsc();
  init_compareDesc();
  init_constructFrom();
  init_constructNow();
  init_daysToWeeks();
  init_differenceInBusinessDays();
  init_differenceInCalendarDays();
  init_differenceInCalendarISOWeekYears();
  init_differenceInCalendarISOWeeks();
  init_differenceInCalendarMonths();
  init_differenceInCalendarQuarters();
  init_differenceInCalendarWeeks();
  init_differenceInCalendarYears();
  init_differenceInDays();
  init_differenceInHours();
  init_differenceInISOWeekYears();
  init_differenceInMilliseconds();
  init_differenceInMinutes();
  init_differenceInMonths();
  init_differenceInQuarters();
  init_differenceInSeconds();
  init_differenceInWeeks();
  init_differenceInYears();
  init_eachDayOfInterval();
  init_eachHourOfInterval();
  init_eachMinuteOfInterval();
  init_eachMonthOfInterval();
  init_eachQuarterOfInterval();
  init_eachWeekOfInterval();
  init_eachWeekendOfInterval();
  init_eachWeekendOfMonth();
  init_eachWeekendOfYear();
  init_eachYearOfInterval();
  init_endOfDay();
  init_endOfDecade();
  init_endOfHour();
  init_endOfISOWeek();
  init_endOfISOWeekYear();
  init_endOfMinute();
  init_endOfMonth();
  init_endOfQuarter();
  init_endOfSecond();
  init_endOfToday();
  init_endOfTomorrow();
  init_endOfWeek();
  init_endOfYear();
  init_endOfYesterday();
  init_format();
  init_formatDistance2();
  init_formatDistanceStrict();
  init_formatDistanceToNow();
  init_formatDistanceToNowStrict();
  init_formatDuration();
  init_formatISO();
  init_formatISO9075();
  init_formatISODuration();
  init_formatRFC3339();
  init_formatRFC7231();
  init_formatRelative2();
  init_fromUnixTime();
  init_getDate();
  init_getDay();
  init_getDayOfYear();
  init_getDaysInMonth();
  init_getDaysInYear();
  init_getDecade();
  init_getDefaultOptions();
  init_getHours();
  init_getISODay();
  init_getISOWeek();
  init_getISOWeekYear();
  init_getISOWeeksInYear();
  init_getMilliseconds();
  init_getMinutes();
  init_getMonth();
  init_getOverlappingDaysInIntervals();
  init_getQuarter();
  init_getSeconds();
  init_getTime();
  init_getUnixTime();
  init_getWeek();
  init_getWeekOfMonth();
  init_getWeekYear();
  init_getWeeksInMonth();
  init_getYear();
  init_hoursToMilliseconds();
  init_hoursToMinutes();
  init_hoursToSeconds();
  init_interval();
  init_intervalToDuration();
  init_intlFormat();
  init_intlFormatDistance();
  init_isAfter();
  init_isBefore();
  init_isDate();
  init_isEqual();
  init_isExists();
  init_isFirstDayOfMonth();
  init_isFriday();
  init_isFuture();
  init_isLastDayOfMonth();
  init_isLeapYear();
  init_isMatch();
  init_isMonday();
  init_isPast();
  init_isSameDay();
  init_isSameHour();
  init_isSameISOWeek();
  init_isSameISOWeekYear();
  init_isSameMinute();
  init_isSameMonth();
  init_isSameQuarter();
  init_isSameSecond();
  init_isSameWeek();
  init_isSameYear();
  init_isSaturday();
  init_isSunday();
  init_isThisHour();
  init_isThisISOWeek();
  init_isThisMinute();
  init_isThisMonth();
  init_isThisQuarter();
  init_isThisSecond();
  init_isThisWeek();
  init_isThisYear();
  init_isThursday();
  init_isToday();
  init_isTomorrow();
  init_isTuesday();
  init_isValid();
  init_isWednesday();
  init_isWeekend();
  init_isWithinInterval();
  init_isYesterday();
  init_lastDayOfDecade();
  init_lastDayOfISOWeek();
  init_lastDayOfISOWeekYear();
  init_lastDayOfMonth();
  init_lastDayOfQuarter();
  init_lastDayOfWeek();
  init_lastDayOfYear();
  init_lightFormat();
  init_max();
  init_milliseconds();
  init_millisecondsToHours();
  init_millisecondsToMinutes();
  init_millisecondsToSeconds();
  init_min();
  init_minutesToHours();
  init_minutesToMilliseconds();
  init_minutesToSeconds();
  init_monthsToQuarters();
  init_monthsToYears();
  init_nextDay();
  init_nextFriday();
  init_nextMonday();
  init_nextSaturday();
  init_nextSunday();
  init_nextThursday();
  init_nextTuesday();
  init_nextWednesday();
  init_parse();
  init_parseISO();
  init_parseJSON();
  init_previousDay();
  init_previousFriday();
  init_previousMonday();
  init_previousSaturday();
  init_previousSunday();
  init_previousThursday();
  init_previousTuesday();
  init_previousWednesday();
  init_quartersToMonths();
  init_quartersToYears();
  init_roundToNearestHours();
  init_roundToNearestMinutes();
  init_secondsToHours();
  init_secondsToMilliseconds();
  init_secondsToMinutes();
  init_set();
  init_setDate();
  init_setDay();
  init_setDayOfYear();
  init_setDefaultOptions();
  init_setHours();
  init_setISODay();
  init_setISOWeek();
  init_setISOWeekYear();
  init_setMilliseconds();
  init_setMinutes();
  init_setMonth();
  init_setQuarter();
  init_setSeconds();
  init_setWeek();
  init_setWeekYear();
  init_setYear();
  init_startOfDay();
  init_startOfDecade();
  init_startOfHour();
  init_startOfISOWeek();
  init_startOfISOWeekYear();
  init_startOfMinute();
  init_startOfMonth();
  init_startOfQuarter();
  init_startOfSecond();
  init_startOfToday();
  init_startOfTomorrow();
  init_startOfWeek();
  init_startOfWeekYear();
  init_startOfYear();
  init_startOfYesterday();
  init_sub();
  init_subBusinessDays();
  init_subDays();
  init_subHours();
  init_subISOWeekYears();
  init_subMilliseconds();
  init_subMinutes();
  init_subMonths();
  init_subQuarters();
  init_subSeconds();
  init_subWeeks();
  init_subYears();
  init_toDate();
  init_transpose();
  init_weeksToDays();
  init_yearsToDays();
  init_yearsToMonths();
  init_yearsToQuarters();
});

// ../node_modules/milkio/utils/send-cookbook-event.ts
var sendCookbookEvent = async (runtime, event) => {
  try {
    const response = await fetch(`http://localhost:${runtime.cookbook.cookbookPort}/$action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: c.stringify(event)
    });
    if (!response.ok) {
      console.log("[COOKBOOK]", await response.text());
      console.log("[COOKBOOK]", "Is Cookbook closed? There is an abnormality in the communication with Cookbook.");
    }
  } catch (error) {
    console.log("[COOKBOOK]", error);
    console.log("[COOKBOOK]", "Is Cookbook closed? There is an abnormality in the communication with Cookbook.");
  }
};
var init_send_cookbook_event = __esm(() => {
  init_tson();
});

// ../node_modules/milkio/logger/index.ts
var createLogger = (runtime, path, executeId) => {
  const logger = {};
  logger._ = {
    logs: new Array,
    tags: new Map,
    submit: (context) => {
      if (!runtime.onLoggerSubmitting)
        return;
      return runtime.onLoggerSubmitting(context, logger._.logs, logger._.tags);
    }
  };
  const __tagPush = (key, value) => {
    logger._.tags.set(key, value);
  };
  const __logPush = (log) => {
    const inserting = runtime.onLoggerInserting ? runtime.onLoggerInserting : (log2) => {
      log2 = [...log2];
      log2[0] = `
${log2[0]}`;
      console.log(...log2);
      return true;
    };
    if (!inserting(log))
      return log;
    logger._.logs.push([...log]);
    if (runtime.develop) {
      sendCookbookEvent(runtime, {
        type: "milkio@logger",
        log
      });
    }
    return log;
  };
  logger.setTag = (key, value) => __tagPush(key, value);
  logger.setLog = (...log) => __logPush(log);
  const getNow = () => `${format(new Date, "(yyyy-MM-dd hh:mm:ss)")}`;
  logger.debug = (description, ...params) => __logPush(["[DEBUG]", path, executeId, getNow(), `
${description}`, ...params]);
  logger.info = (description, ...params) => __logPush(["[INFO]", path, executeId, getNow(), `
${description}`, ...params]);
  logger.warn = (description, ...params) => __logPush(["[WARN]", path, executeId, getNow(), `
${description}`, ...params]);
  logger.error = (description, ...params) => __logPush(["[ERROR]", path, executeId, getNow(), `
${description}`, ...params]);
  logger.request = (description, ...params) => __logPush(["[REQUEST]", path, executeId, getNow(), `
${description}`, ...params]);
  logger.response = (description, ...params) => __logPush(["[RESPONSE]", path, executeId, getNow(), `
${description}`, ...params]);
  return logger;
};
var init_logger = __esm(() => {
  init_date_fns();
  init_send_cookbook_event();
});
// ../node_modules/milkio/listener/index.ts
var __initListener = (generated, runtime, executer) => {
  const port = runtime.port;
  const fetch2 = async (options) => {
    if (options.request.method === "OPTIONS") {
      return new Response(undefined, {
        headers: {
          "Access-Control-Allow-Methods": runtime.cors?.corsAllowMethods ?? "*",
          "Access-Control-Allow-Origin": runtime.cors?.corsAllowOrigin ?? "*",
          "Access-Control-Allow-Headers": runtime.cors?.corsAllowHeaders ?? "*"
        }
      });
    }
    if (options.request.url.endsWith("/generate_204")) {
      return new Response("", {
        status: 204,
        headers: {
          "Access-Control-Allow-Methods": runtime.cors?.corsAllowMethods ?? "*",
          "Access-Control-Allow-Origin": runtime.cors?.corsAllowOrigin ?? "*",
          "Access-Control-Allow-Headers": runtime.cors?.corsAllowHeaders ?? "*",
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; time=" + Date.now()
        }
      });
    }
    const url = new URL(options.request.url);
    let pathArray = url.pathname.substring(1).split("/");
    if (runtime.ignorePathLevel !== undefined && runtime.ignorePathLevel !== 0)
      pathArray = pathArray.slice(runtime.ignorePathLevel);
    const pathString = `/${pathArray.join("/")}`;
    const executeId = runtime?.executeId ? await runtime.executeId(options.request) : createId();
    console.log("executeId", await runtime.executeId(options.request), createId());
    const logger = createLogger(runtime, pathString, executeId);
    runtime.runtime.request.set(executeId, { logger });
    const response = {
      body: "",
      status: 200,
      headers: {
        "Access-Control-Allow-Methods": runtime.cors?.corsAllowMethods ?? "*",
        "Access-Control-Allow-Origin": runtime.cors?.corsAllowOrigin ?? "*",
        "Access-Control-Allow-Headers": runtime.cors?.corsAllowHeaders ?? "*",
        "Cache-Control": "no-store",
        "Content-Type": "application/json"
      }
    };
    try {
      const http = await (async () => {
        const ip = runtime.realIp ? runtime.realIp(options.request) : "::1";
        const params = {
          string: await options.request.text(),
          parsed: undefined
        };
        return {
          url,
          ip,
          path: { string: pathString, array: pathArray },
          params,
          request: options.request,
          response
        };
      })();
      await runtime.emit("milkio:httpRequest", { executeId, logger, path: http.path.string, http });
      if (!runtime.develop && (http.path.string.includes("__") || http.path.string.startsWith("/$call/"))) {
        await runtime.emit("milkio:httpNotFound", { executeId, logger, path: http.path.string, http });
        throw reject("NOT_FOUND", { path: http.path.string });
      }
      if (!options.request.headers.get("Accept")?.startsWith("text/event-stream")) {
        const routeSchema = generated.routeSchema[http.path.string];
        if (routeSchema === undefined) {
          await runtime.emit("milkio:httpNotFound", { executeId, logger, path: http.path.string, http });
          throw reject("NOT_FOUND", { path: http.path.string });
        }
        if (routeSchema.type !== "action")
          throw reject("UNACCEPTABLE", { expected: "stream", message: `Not acceptable, the Accept in the request header should be "text/event-stream". If you are using the "@milkio/stargate" package, please add \`type: "stream"\` to the execute options.` });
        const executed = await executer.__execute(routeSchema, {
          createdExecuteId: executeId,
          createdLogger: logger,
          path: http.path.string,
          headers: options.request.headers,
          mixinContext: { http },
          params: http.params.string,
          paramsType: "string"
        });
        if (response.body === "" && executed.results.value !== undefined) {
          if (executed.emptyResult) {
            response.body = `{"data":{},"executeId":"${executeId}","success":true}`;
          } else if (executed.resultsTypeSafety) {
            response.body = `{"data":${routeSchema.resultsToJSON(executed.results.value)},"executeId":"${executeId}","success":true}`;
          } else {
            response.body = `{"data":${c.stringify(executed.results.value)},"executeId":"${executeId}","success":true}`;
          }
        }
        await runtime.emit("milkio:httpResponse", { executeId, logger, path: http.path.string, http, context: executed.context });
        runtime.runtime.request.delete(executeId);
        return new Response(response.body, response);
      } else {
        const routeSchema = generated.routeSchema[http.path.string];
        if (routeSchema === undefined)
          throw reject("NOT_FOUND", { path: http.path.string });
        if (routeSchema.type !== "stream")
          throw reject("UNACCEPTABLE", { expected: "stream", message: `Not acceptable, the Accept in the request header should be "application/json". If you are using the "@milkio/stargate" package, please remove \`type: "stream"\` to the execute options.` });
        const executed = await executer.__execute(routeSchema, {
          createdExecuteId: executeId,
          createdLogger: logger,
          path: http.path.string,
          headers: options.request.headers,
          mixinContext: { http },
          params: http.params.string,
          paramsType: "string"
        });
        let stream2;
        let control;
        if (typeof Bun !== "undefined") {
          stream2 = new ReadableStream({
            type: "direct",
            async pull(controller) {
              control = controller;
              try {
                controller.write(`data:@${JSON.stringify({ success: true, data: undefined, executeId })}

`);
                for await (const value of executed.results.value) {
                  if (!options.request.signal.aborted) {
                    const result = JSON.stringify([null, c.encode(value)]);
                    controller.write(`data:${result}

`);
                  } else {
                    executed.results.value.return(undefined);
                    controller.close();
                  }
                }
              } catch (error) {
                const exception = exceptionHandler(executeId, logger, error);
                const result = {};
                result[exception.code] = exception.reject;
                controller.write(`data:${JSON.stringify([c.encode(result), null])}

`);
              }
              await new Promise((resolve) => setTimeout(resolve, 0));
              controller.close();
            },
            cancel() {
              control.close();
            }
          });
        } else {
          stream2 = new ReadableStream({
            async pull(controller) {
              control = controller;
              try {
                controller.enqueue(`data:@${JSON.stringify({ success: true, data: undefined, executeId })}

`);
                for await (const value of executed.results.value) {
                  if (!options.request.signal.aborted) {
                    const result = JSON.stringify([null, c.encode(value)]);
                    controller.enqueue(`data:${result}

`);
                  } else {
                    executed.results.value.return(undefined);
                    controller.close();
                  }
                }
              } catch (error) {
                const exception = exceptionHandler(executeId, logger, error);
                const result = {};
                result[exception.code] = exception.reject;
                controller.enqueue(`data:${JSON.stringify([c.encode(result), null])}

`);
              }
              await new Promise((resolve) => setTimeout(resolve, 0));
              controller.close();
            },
            cancel() {
              control.close();
            }
          });
        }
        response.body = stream2;
        response.headers["Content-Type"] = "text/event-stream";
        response.headers["Cache-Control"] = "no-cache";
        await runtime.emit("milkio:httpResponse", { executeId, logger, path: http.path.string, http, context: executed.context });
        runtime.runtime.request.delete(executeId);
        return new Response(response.body, response);
      }
    } catch (error) {
      const results = {
        value: exceptionHandler(executeId, logger, error)
      };
      if (results.value !== undefined)
        response.body = c.stringify(results.value);
      runtime.runtime.request.delete(executeId);
      return new Response(response.body, response);
    }
  };
  return {
    port,
    fetch: fetch2
  };
};
var init_listener = __esm(() => {
  init_tson();
  init_milkio();
  init_create_id();
});

// ../node_modules/milkio/exception/index.ts
function reject(code, data) {
  const error = { $milkioReject: true, code, data };
  Error.captureStackTrace(error);
  return error;
}
function exceptionHandler(executeId, logger, error) {
  const name = error?.code ?? error?.name ?? error?.constructor?.name ?? "Unnamed Exception";
  if (error?.$milkioReject === true && error?.code === "NOT_FOUND") {
    logger.info(name, error?.data?.path ?? "Unknown path");
  } else {
    try {
      const stack = error?.$milkioReject ? (error?.stack ?? "").split(`
`).slice(2).join(`
`) : error?.stack ?? "";
      logger.error(name, `
${c.stringify(error?.data)}`, `
${stack}
`);
    } catch (_) {
      logger.error(name, `
${error?.toString()}`, `
${error?.stack}
`);
    }
  }
  let result;
  if (error?.$milkioReject === true)
    result = { success: false, code: error.code, reject: error.data, executeId };
  else
    result = { success: false, code: "INTERNAL_SERVER_ERROR", reject: undefined, executeId };
  return result;
}
var init_exception = __esm(() => {
  init_tson();
});

// ../node_modules/milkio/index.ts
var init_milkio = __esm(() => {
  init_tson();
  init_execute();
  init_world();
  init_logger();
  init_listener();
  init_exception();
});

// ../../../node_modules/ret/lib/types.js
var require_types = __commonJS((exports, module) => {
  module.exports = {
    ROOT: 0,
    GROUP: 1,
    POSITION: 2,
    SET: 3,
    RANGE: 4,
    REPETITION: 5,
    REFERENCE: 6,
    CHAR: 7
  };
});

// ../../../node_modules/ret/lib/sets.js
var require_sets = __commonJS((exports) => {
  var types2 = require_types();
  var INTS = () => [{ type: types2.RANGE, from: 48, to: 57 }];
  var WORDS = () => {
    return [
      { type: types2.CHAR, value: 95 },
      { type: types2.RANGE, from: 97, to: 122 },
      { type: types2.RANGE, from: 65, to: 90 }
    ].concat(INTS());
  };
  var WHITESPACE = () => {
    return [
      { type: types2.CHAR, value: 9 },
      { type: types2.CHAR, value: 10 },
      { type: types2.CHAR, value: 11 },
      { type: types2.CHAR, value: 12 },
      { type: types2.CHAR, value: 13 },
      { type: types2.CHAR, value: 32 },
      { type: types2.CHAR, value: 160 },
      { type: types2.CHAR, value: 5760 },
      { type: types2.RANGE, from: 8192, to: 8202 },
      { type: types2.CHAR, value: 8232 },
      { type: types2.CHAR, value: 8233 },
      { type: types2.CHAR, value: 8239 },
      { type: types2.CHAR, value: 8287 },
      { type: types2.CHAR, value: 12288 },
      { type: types2.CHAR, value: 65279 }
    ];
  };
  var NOTANYCHAR = () => {
    return [
      { type: types2.CHAR, value: 10 },
      { type: types2.CHAR, value: 13 },
      { type: types2.CHAR, value: 8232 },
      { type: types2.CHAR, value: 8233 }
    ];
  };
  exports.words = () => ({ type: types2.SET, set: WORDS(), not: false });
  exports.notWords = () => ({ type: types2.SET, set: WORDS(), not: true });
  exports.ints = () => ({ type: types2.SET, set: INTS(), not: false });
  exports.notInts = () => ({ type: types2.SET, set: INTS(), not: true });
  exports.whitespace = () => ({ type: types2.SET, set: WHITESPACE(), not: false });
  exports.notWhitespace = () => ({ type: types2.SET, set: WHITESPACE(), not: true });
  exports.anyChar = () => ({ type: types2.SET, set: NOTANYCHAR(), not: true });
});

// ../../../node_modules/ret/lib/util.js
var require_util = __commonJS((exports) => {
  var types2 = require_types();
  var sets = require_sets();
  var CTRL = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?";
  var SLSH = { "0": 0, t: 9, n: 10, v: 11, f: 12, r: 13 };
  exports.strToChars = function(str) {
    var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
    str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
      if (lbs) {
        return s;
      }
      var code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : c8 ? parseInt(c8, 8) : dctrl ? CTRL.indexOf(dctrl) : SLSH[eslsh];
      var c2 = String.fromCharCode(code);
      if (/[[\]{}^$.|?*+()]/.test(c2)) {
        c2 = "\\" + c2;
      }
      return c2;
    });
    return str;
  };
  exports.tokenizeClass = (str, regexpStr) => {
    var tokens = [];
    var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
    var rs, c2;
    while ((rs = regexp.exec(str)) != null) {
      if (rs[1]) {
        tokens.push(sets.words());
      } else if (rs[2]) {
        tokens.push(sets.ints());
      } else if (rs[3]) {
        tokens.push(sets.whitespace());
      } else if (rs[4]) {
        tokens.push(sets.notWords());
      } else if (rs[5]) {
        tokens.push(sets.notInts());
      } else if (rs[6]) {
        tokens.push(sets.notWhitespace());
      } else if (rs[7]) {
        tokens.push({
          type: types2.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: rs[10].charCodeAt(0)
        });
      } else if (c2 = rs[12]) {
        tokens.push({
          type: types2.CHAR,
          value: c2.charCodeAt(0)
        });
      } else {
        return [tokens, regexp.lastIndex];
      }
    }
    exports.error(regexpStr, "Unterminated character class");
  };
  exports.error = (regexp, msg) => {
    throw new SyntaxError("Invalid regular expression: /" + regexp + "/: " + msg);
  };
});

// ../../../node_modules/ret/lib/positions.js
var require_positions = __commonJS((exports) => {
  var types2 = require_types();
  exports.wordBoundary = () => ({ type: types2.POSITION, value: "b" });
  exports.nonWordBoundary = () => ({ type: types2.POSITION, value: "B" });
  exports.begin = () => ({ type: types2.POSITION, value: "^" });
  exports.end = () => ({ type: types2.POSITION, value: "$" });
});

// ../../../node_modules/ret/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var util = require_util();
  var types2 = require_types();
  var sets = require_sets();
  var positions = require_positions();
  module.exports = (regexpStr) => {
    var i = 0, l, c2, start = { type: types2.ROOT, stack: [] }, lastGroup = start, last = start.stack, groupStack = [];
    var repeatErr = (i2) => {
      util.error(regexpStr, `Nothing to repeat at column ${i2 - 1}`);
    };
    var str = util.strToChars(regexpStr);
    l = str.length;
    while (i < l) {
      c2 = str[i++];
      switch (c2) {
        case "\\":
          c2 = str[i++];
          switch (c2) {
            case "b":
              last.push(positions.wordBoundary());
              break;
            case "B":
              last.push(positions.nonWordBoundary());
              break;
            case "w":
              last.push(sets.words());
              break;
            case "W":
              last.push(sets.notWords());
              break;
            case "d":
              last.push(sets.ints());
              break;
            case "D":
              last.push(sets.notInts());
              break;
            case "s":
              last.push(sets.whitespace());
              break;
            case "S":
              last.push(sets.notWhitespace());
              break;
            default:
              if (/\d/.test(c2)) {
                last.push({ type: types2.REFERENCE, value: parseInt(c2, 10) });
              } else {
                last.push({ type: types2.CHAR, value: c2.charCodeAt(0) });
              }
          }
          break;
        case "^":
          last.push(positions.begin());
          break;
        case "$":
          last.push(positions.end());
          break;
        case "[":
          var not;
          if (str[i] === "^") {
            not = true;
            i++;
          } else {
            not = false;
          }
          var classTokens = util.tokenizeClass(str.slice(i), regexpStr);
          i += classTokens[1];
          last.push({
            type: types2.SET,
            set: classTokens[0],
            not
          });
          break;
        case ".":
          last.push(sets.anyChar());
          break;
        case "(":
          var group = {
            type: types2.GROUP,
            stack: [],
            remember: true
          };
          c2 = str[i];
          if (c2 === "?") {
            c2 = str[i + 1];
            i += 2;
            if (c2 === "=") {
              group.followedBy = true;
            } else if (c2 === "!") {
              group.notFollowedBy = true;
            } else if (c2 !== ":") {
              util.error(regexpStr, `Invalid group, character '${c2}'` + ` after '?' at column ${i - 1}`);
            }
            group.remember = false;
          }
          last.push(group);
          groupStack.push(lastGroup);
          lastGroup = group;
          last = group.stack;
          break;
        case ")":
          if (groupStack.length === 0) {
            util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
          }
          lastGroup = groupStack.pop();
          last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
          break;
        case "|":
          if (!lastGroup.options) {
            lastGroup.options = [lastGroup.stack];
            delete lastGroup.stack;
          }
          var stack = [];
          lastGroup.options.push(stack);
          last = stack;
          break;
        case "{":
          var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min2, max2;
          if (rs !== null) {
            if (last.length === 0) {
              repeatErr(i);
            }
            min2 = parseInt(rs[1], 10);
            max2 = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min2;
            i += rs[0].length;
            last.push({
              type: types2.REPETITION,
              min: min2,
              max: max2,
              value: last.pop()
            });
          } else {
            last.push({
              type: types2.CHAR,
              value: 123
            });
          }
          break;
        case "?":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types2.REPETITION,
            min: 0,
            max: 1,
            value: last.pop()
          });
          break;
        case "+":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types2.REPETITION,
            min: 1,
            max: Infinity,
            value: last.pop()
          });
          break;
        case "*":
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types2.REPETITION,
            min: 0,
            max: Infinity,
            value: last.pop()
          });
          break;
        default:
          last.push({
            type: types2.CHAR,
            value: c2.charCodeAt(0)
          });
      }
    }
    if (groupStack.length !== 0) {
      util.error(regexpStr, "Unterminated group");
    }
    return start;
  };
  module.exports.types = types2;
});

// ../../../node_modules/drange/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  class SubRange {
    constructor(low, high) {
      this.low = low;
      this.high = high;
      this.length = 1 + high - low;
    }
    overlaps(range) {
      return !(this.high < range.low || this.low > range.high);
    }
    touches(range) {
      return !(this.high + 1 < range.low || this.low - 1 > range.high);
    }
    add(range) {
      return new SubRange(Math.min(this.low, range.low), Math.max(this.high, range.high));
    }
    subtract(range) {
      if (range.low <= this.low && range.high >= this.high) {
        return [];
      } else if (range.low > this.low && range.high < this.high) {
        return [
          new SubRange(this.low, range.low - 1),
          new SubRange(range.high + 1, this.high)
        ];
      } else if (range.low <= this.low) {
        return [new SubRange(range.high + 1, this.high)];
      } else {
        return [new SubRange(this.low, range.low - 1)];
      }
    }
    toString() {
      return this.low == this.high ? this.low.toString() : this.low + "-" + this.high;
    }
  }

  class DRange {
    constructor(a, b) {
      this.ranges = [];
      this.length = 0;
      if (a != null)
        this.add(a, b);
    }
    _update_length() {
      this.length = this.ranges.reduce((previous, range) => {
        return previous + range.length;
      }, 0);
    }
    add(a, b) {
      var _add = (subrange) => {
        var i = 0;
        while (i < this.ranges.length && !subrange.touches(this.ranges[i])) {
          i++;
        }
        var newRanges = this.ranges.slice(0, i);
        while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
          subrange = subrange.add(this.ranges[i]);
          i++;
        }
        newRanges.push(subrange);
        this.ranges = newRanges.concat(this.ranges.slice(i));
        this._update_length();
      };
      if (a instanceof DRange) {
        a.ranges.forEach(_add);
      } else {
        if (b == null)
          b = a;
        _add(new SubRange(a, b));
      }
      return this;
    }
    subtract(a, b) {
      var _subtract = (subrange) => {
        var i = 0;
        while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
          i++;
        }
        var newRanges = this.ranges.slice(0, i);
        while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
          newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
          i++;
        }
        this.ranges = newRanges.concat(this.ranges.slice(i));
        this._update_length();
      };
      if (a instanceof DRange) {
        a.ranges.forEach(_subtract);
      } else {
        if (b == null)
          b = a;
        _subtract(new SubRange(a, b));
      }
      return this;
    }
    intersect(a, b) {
      var newRanges = [];
      var _intersect = (subrange) => {
        var i = 0;
        while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
          i++;
        }
        while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
          var low = Math.max(this.ranges[i].low, subrange.low);
          var high = Math.min(this.ranges[i].high, subrange.high);
          newRanges.push(new SubRange(low, high));
          i++;
        }
      };
      if (a instanceof DRange) {
        a.ranges.forEach(_intersect);
      } else {
        if (b == null)
          b = a;
        _intersect(new SubRange(a, b));
      }
      this.ranges = newRanges;
      this._update_length();
      return this;
    }
    index(index) {
      var i = 0;
      while (i < this.ranges.length && this.ranges[i].length <= index) {
        index -= this.ranges[i].length;
        i++;
      }
      return this.ranges[i].low + index;
    }
    toString() {
      return "[ " + this.ranges.join(", ") + " ]";
    }
    clone() {
      return new DRange(this);
    }
    numbers() {
      return this.ranges.reduce((result, subrange) => {
        var i = subrange.low;
        while (i <= subrange.high) {
          result.push(i);
          i++;
        }
        return result;
      }, []);
    }
    subranges() {
      return this.ranges.map((subrange) => ({
        low: subrange.low,
        high: subrange.high,
        length: 1 + subrange.high - subrange.low
      }));
    }
  }
  module.exports = DRange;
});

// ../../../node_modules/randexp/lib/randexp.js
var require_randexp = __commonJS((exports, module) => {
  var ret = require_lib();
  var DRange = require_lib2();
  var types2 = ret.types;
  module.exports = class RandExp {
    constructor(regexp, m) {
      this._setDefaults(regexp);
      if (regexp instanceof RegExp) {
        this.ignoreCase = regexp.ignoreCase;
        this.multiline = regexp.multiline;
        regexp = regexp.source;
      } else if (typeof regexp === "string") {
        this.ignoreCase = m && m.indexOf("i") !== -1;
        this.multiline = m && m.indexOf("m") !== -1;
      } else {
        throw new Error("Expected a regexp or string");
      }
      this.tokens = ret(regexp);
    }
    _setDefaults(regexp) {
      this.max = regexp.max != null ? regexp.max : RandExp.prototype.max != null ? RandExp.prototype.max : 100;
      this.defaultRange = regexp.defaultRange ? regexp.defaultRange : this.defaultRange.clone();
      if (regexp.randInt) {
        this.randInt = regexp.randInt;
      }
    }
    gen() {
      return this._gen(this.tokens, []);
    }
    _gen(token, groups) {
      var stack, str, n, i, l;
      switch (token.type) {
        case types2.ROOT:
        case types2.GROUP:
          if (token.followedBy || token.notFollowedBy) {
            return "";
          }
          if (token.remember && token.groupNumber === undefined) {
            token.groupNumber = groups.push(null) - 1;
          }
          stack = token.options ? this._randSelect(token.options) : token.stack;
          str = "";
          for (i = 0, l = stack.length;i < l; i++) {
            str += this._gen(stack[i], groups);
          }
          if (token.remember) {
            groups[token.groupNumber] = str;
          }
          return str;
        case types2.POSITION:
          return "";
        case types2.SET:
          var expandedSet = this._expand(token);
          if (!expandedSet.length) {
            return "";
          }
          return String.fromCharCode(this._randSelect(expandedSet));
        case types2.REPETITION:
          n = this.randInt(token.min, token.max === Infinity ? token.min + this.max : token.max);
          str = "";
          for (i = 0;i < n; i++) {
            str += this._gen(token.value, groups);
          }
          return str;
        case types2.REFERENCE:
          return groups[token.value - 1] || "";
        case types2.CHAR:
          var code = this.ignoreCase && this._randBool() ? this._toOtherCase(token.value) : token.value;
          return String.fromCharCode(code);
      }
    }
    _toOtherCase(code) {
      return code + (97 <= code && code <= 122 ? -32 : 65 <= code && code <= 90 ? 32 : 0);
    }
    _randBool() {
      return !this.randInt(0, 1);
    }
    _randSelect(arr) {
      if (arr instanceof DRange) {
        return arr.index(this.randInt(0, arr.length - 1));
      }
      return arr[this.randInt(0, arr.length - 1)];
    }
    _expand(token) {
      if (token.type === ret.types.CHAR) {
        return new DRange(token.value);
      } else if (token.type === ret.types.RANGE) {
        return new DRange(token.from, token.to);
      } else {
        let drange = new DRange;
        for (let i = 0;i < token.set.length; i++) {
          let subrange = this._expand(token.set[i]);
          drange.add(subrange);
          if (this.ignoreCase) {
            for (let j = 0;j < subrange.length; j++) {
              let code = subrange.index(j);
              let otherCaseCode = this._toOtherCase(code);
              if (code !== otherCaseCode) {
                drange.add(otherCaseCode);
              }
            }
          }
        }
        if (token.not) {
          return this.defaultRange.clone().subtract(drange);
        } else {
          return this.defaultRange.clone().intersect(drange);
        }
      }
    }
    randInt(a, b) {
      return a + Math.floor(Math.random() * (1 + b - a));
    }
    get defaultRange() {
      return this._range = this._range || new DRange(32, 126);
    }
    set defaultRange(range) {
      this._range = range;
    }
    static randexp(regexp, m) {
      var randexp;
      if (typeof regexp === "string") {
        regexp = new RegExp(regexp, m);
      }
      if (regexp._randexp === undefined) {
        randexp = new RandExp(regexp, m);
        regexp._randexp = randexp;
      } else {
        randexp = regexp._randexp;
        randexp._setDefaults(regexp);
      }
      return randexp.gen();
    }
    static sugar() {
      RegExp.prototype.gen = function() {
        return RandExp.randexp(this);
      };
    }
  };
});

// ../../../node_modules/typia/lib/utils/RandomGenerator/RandomGenerator.js
var require_RandomGenerator = __commonJS((exports) => {
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.relativeJsonPointer = exports.jsonPointer = exports.duration = exports.time = exports.date = exports.datetime = exports.url = exports.uriTemplate = exports.uriReference = exports.uri = exports.ipv6 = exports.ipv4 = exports.iriReference = exports.iri = exports.idnHostname = exports.idnEmail = exports.hostname = exports.email = exports.uuid = exports.regex = exports.password = exports.byte = exports.pattern = exports.length = exports.pick = exports.array = exports.string = exports.number = exports.bigint = exports.integer = exports.boolean = undefined;
  var randexp_1 = __importDefault(require_randexp());
  var ALPHABETS = "abcdefghijklmnopqrstuvwxyz";
  var boolean = function() {
    return Math.random() < 0.5;
  };
  exports.boolean = boolean;
  var integer = function(min2, max2) {
    min2 !== null && min2 !== undefined || (min2 = 0);
    max2 !== null && max2 !== undefined || (max2 = 100);
    return Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  };
  exports.integer = integer;
  var bigint = function(min2, max2) {
    return BigInt((0, exports.integer)(Number(min2 !== null && min2 !== undefined ? min2 : BigInt(0)), Number(max2 !== null && max2 !== undefined ? max2 : BigInt(100))));
  };
  exports.bigint = bigint;
  var number = function(min2, max2) {
    min2 !== null && min2 !== undefined || (min2 = 0);
    max2 !== null && max2 !== undefined || (max2 = 100);
    return Math.random() * (max2 - min2) + min2;
  };
  exports.number = number;
  var string = function(length2) {
    return new Array(length2 !== null && length2 !== undefined ? length2 : (0, exports.integer)(5, 10)).fill(0).map(function() {
      return ALPHABETS[(0, exports.integer)(0, ALPHABETS.length - 1)];
    }).join("");
  };
  exports.string = string;
  var array = function(closure, count, unique) {
    count !== null && count !== undefined || (count = (0, exports.length)());
    unique !== null && unique !== undefined || (unique = false);
    if (unique === false)
      return new Array(count !== null && count !== undefined ? count : (0, exports.length)()).fill(0).map(function(_e, index) {
        return closure(index);
      });
    else {
      var set2 = new Set;
      while (set2.size < count)
        set2.add(closure(set2.size));
      return Array.from(set2);
    }
  };
  exports.array = array;
  var pick = function(array2) {
    return array2[(0, exports.integer)(0, array2.length - 1)];
  };
  exports.pick = pick;
  var length = function() {
    return (0, exports.integer)(0, 3);
  };
  exports.length = length;
  var pattern = function(regex2) {
    var r = new randexp_1.default(regex2);
    for (var i = 0;i < 10; ++i) {
      var str = r.gen();
      if (regex2.test(str))
        return str;
    }
    return r.gen();
  };
  exports.pattern = pattern;
  var byte = function() {
    return "vt7ekz4lIoNTTS9sDQYdWKharxIFAR54+z/umIxSgUM=";
  };
  exports.byte = byte;
  var password = function() {
    return (0, exports.string)((0, exports.integer)(4, 16));
  };
  exports.password = password;
  var regex = function() {
    return "/^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$/";
  };
  exports.regex = regex;
  var uuid = function() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
      var r = Math.random() * 16 | 0;
      var v = c2 === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  };
  exports.uuid = uuid;
  var email = function() {
    return "".concat((0, exports.string)(10), "@").concat((0, exports.string)(10), ".").concat((0, exports.string)(3));
  };
  exports.email = email;
  var hostname = function() {
    return "".concat((0, exports.string)(10), ".").concat((0, exports.string)(3));
  };
  exports.hostname = hostname;
  var idnEmail = function() {
    return (0, exports.email)();
  };
  exports.idnEmail = idnEmail;
  var idnHostname = function() {
    return (0, exports.hostname)();
  };
  exports.idnHostname = idnHostname;
  var iri = function() {
    return (0, exports.url)();
  };
  exports.iri = iri;
  var iriReference = function() {
    return (0, exports.url)();
  };
  exports.iriReference = iriReference;
  var ipv4 = function() {
    return (0, exports.array)(function() {
      return (0, exports.integer)(0, 255);
    }, 4).join(".");
  };
  exports.ipv4 = ipv4;
  var ipv6 = function() {
    return (0, exports.array)(function() {
      return (0, exports.integer)(0, 65535).toString(16);
    }, 8).join(":");
  };
  exports.ipv6 = ipv6;
  var uri = function() {
    return (0, exports.url)();
  };
  exports.uri = uri;
  var uriReference = function() {
    return (0, exports.url)();
  };
  exports.uriReference = uriReference;
  var uriTemplate = function() {
    return (0, exports.url)();
  };
  exports.uriTemplate = uriTemplate;
  var url = function() {
    return "https://".concat((0, exports.string)(10), ".").concat((0, exports.string)(3));
  };
  exports.url = url;
  var datetime = function(min2, max2) {
    return new Date((0, exports.number)(min2 !== null && min2 !== undefined ? min2 : Date.now() - 30 * DAY, max2 !== null && max2 !== undefined ? max2 : Date.now() + 7 * DAY)).toISOString();
  };
  exports.datetime = datetime;
  var date = function(min2, max2) {
    return new Date((0, exports.number)(min2 !== null && min2 !== undefined ? min2 : 0, max2 !== null && max2 !== undefined ? max2 : Date.now() * 2)).toISOString().substring(0, 10);
  };
  exports.date = date;
  var time = function() {
    return new Date((0, exports.number)(0, DAY)).toISOString().substring(11);
  };
  exports.time = time;
  var duration = function() {
    var period = durate([
      ["Y", (0, exports.integer)(0, 100)],
      ["M", (0, exports.integer)(0, 12)],
      ["D", (0, exports.integer)(0, 31)]
    ]);
    var time2 = durate([
      ["H", (0, exports.integer)(0, 24)],
      ["M", (0, exports.integer)(0, 60)],
      ["S", (0, exports.integer)(0, 60)]
    ]);
    if (period.length + time2.length === 0)
      return "PT0S";
    return "P".concat(period).concat(time2.length ? "T" : "").concat(time2);
  };
  exports.duration = duration;
  var jsonPointer = function() {
    return "/components/schemas/".concat((0, exports.string)(10));
  };
  exports.jsonPointer = jsonPointer;
  var relativeJsonPointer = function() {
    return "".concat((0, exports.integer)(0, 10), "#");
  };
  exports.relativeJsonPointer = relativeJsonPointer;
  var DAY = 86400000;
  var durate = function(elements) {
    return elements.filter(function(_a) {
      var _b = __read(_a, 2), _unit = _b[0], value = _b[1];
      return value !== 0;
    }).map(function(_a) {
      var _b = __read(_a, 2), unit = _b[0], value = _b[1];
      return "".concat(value).concat(unit);
    }).join("");
  };
});

// ../../../node_modules/typia/lib/utils/RandomGenerator/index.js
var require_RandomGenerator2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.RandomGenerator = undefined;
  exports.RandomGenerator = __importStar(require_RandomGenerator());
});

// ../../../node_modules/typia/lib/functional/$every.js
var require_$every = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$every = undefined;
  var $every = function(array, pred) {
    var error = null;
    for (var i = 0;i < array.length; ++i)
      if ((error = pred(array[i], i)) !== null)
        return error;
    return null;
  };
  exports.$every = $every;
});

// ../../../node_modules/typia/lib/TypeGuardError.js
var require_TypeGuardError = __commonJS((exports) => {
  var __extends = exports && exports.__extends || function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
    };
  }();
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TypeGuardError = undefined;
  var TypeGuardError = function(_super) {
    __extends(TypeGuardError2, _super);
    function TypeGuardError2(props) {
      var _newTarget = this.constructor;
      var _this = _super.call(this, props.message || "Error on ".concat(props.method, "(): invalid type").concat(props.path ? " on ".concat(props.path) : "", ", expect to be ").concat(props.expected)) || this;
      var proto = _newTarget.prototype;
      if (Object.setPrototypeOf)
        Object.setPrototypeOf(_this, proto);
      else
        _this.__proto__ = proto;
      _this.method = props.method;
      _this.path = props.path;
      _this.expected = props.expected;
      _this.value = props.value;
      return _this;
    }
    return TypeGuardError2;
  }(Error);
  exports.TypeGuardError = TypeGuardError;
});

// ../../../node_modules/typia/lib/functional/$guard.js
var require_$guard = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$guard = undefined;
  var TypeGuardError_1 = require_TypeGuardError();
  var $guard = function(method) {
    return function(exceptionable, props, factory) {
      if (exceptionable === true)
        throw (factory !== null && factory !== undefined ? factory : function(props2) {
          return new TypeGuardError_1.TypeGuardError(props2);
        })({
          method,
          path: props.path,
          expected: props.expected,
          value: props.value
        });
      return false;
    };
  };
  exports.$guard = $guard;
});

// ../../../node_modules/typia/lib/functional/$join.js
var require_$join = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$join = undefined;
  var $join = function(str) {
    return variable(str) ? ".".concat(str) : "[".concat(JSON.stringify(str), "]");
  };
  exports.$join = $join;
  var variable = function(str) {
    return reserved(str) === false && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(str);
  };
  var reserved = function(str) {
    return RESERVED.has(str);
  };
  var RESERVED = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
  ]);
});

// ../../../node_modules/typia/lib/functional/$report.js
var require_$report = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$report = undefined;
  var $report = function(array) {
    var reportable = function(path) {
      if (array.length === 0)
        return true;
      var last = array[array.length - 1].path;
      return path.length > last.length || last.substring(0, path.length) !== path;
    };
    return function(exceptable, error) {
      if (exceptable && reportable(error.path))
        array.push(error);
      return false;
    };
  };
  exports.$report = $report;
});

// ../../../node_modules/typia/lib/functional/$is_between.js
var require_$is_between = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$is_between = undefined;
  var $is_between = function(value, minimum, maximum) {
    return minimum <= value && value <= maximum;
  };
  exports.$is_between = $is_between;
});

// ../../../node_modules/typia/lib/functional/$stoll.js
var require_$stoll = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$is_bigint_string = undefined;
  var $is_bigint_string = function(str) {
    try {
      BigInt(str);
      return true;
    } catch (_a) {
      return false;
    }
  };
  exports.$is_bigint_string = $is_bigint_string;
});

// ../../../node_modules/typia/lib/functional/is.js
var require_is = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.is = undefined;
  var _is_between_1 = require_$is_between();
  var _stoll_1 = require_$stoll();
  var is = function() {
    return {
      is_between: _is_between_1.$is_between,
      is_bigint_string: _stoll_1.$is_bigint_string
    };
  };
  exports.is = is;
});

// ../../../node_modules/typia/lib/functional/Namespace/functional.js
var require_functional = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.functionalAssert = undefined;
  var TypeGuardError_1 = require_TypeGuardError();
  var functionalAssert = function() {
    return {
      errorFactory: function(p) {
        return new TypeGuardError_1.TypeGuardError(p);
      }
    };
  };
  exports.functionalAssert = functionalAssert;
});

// ../../../node_modules/typia/lib/functional/$number.js
var require_$number = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$number = undefined;
  var TypeGuardError_1 = require_TypeGuardError();
  var $number = function(value) {
    if (isFinite(value) === false)
      throw new TypeGuardError_1.TypeGuardError({
        method: "typia.json.stringify",
        expected: "number",
        value,
        message: "Error on typia.json.stringify(): infinite or not a number."
      });
    return value;
  };
  exports.$number = $number;
});

// ../../../node_modules/typia/lib/functional/$rest.js
var require_$rest = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$rest = undefined;
  var $rest = function(str) {
    return str.length === 2 ? "" : "," + str.substring(1, str.length - 1);
  };
  exports.$rest = $rest;
});

// ../../../node_modules/typia/lib/functional/$string.js
var require_$string = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$string = undefined;
  var $string = function(str) {
    var len = str.length;
    var result = "";
    var last = -1;
    var point = 255;
    for (var i = 0;i < len; i++) {
      point = str.charCodeAt(i);
      if (point < 32) {
        return JSON.stringify(str);
      }
      if (point >= 55296 && point <= 57343) {
        return JSON.stringify(str);
      }
      if (point === 34 || point === 92) {
        last === -1 && (last = 0);
        result += str.slice(last, i) + "\\";
        last = i;
      }
    }
    return last === -1 && '"' + str + '"' || '"' + result + str.slice(last) + '"';
  };
  exports.$string = $string;
});

// ../../../node_modules/typia/lib/functional/$tail.js
var require_$tail = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$tail = undefined;
  var $tail = function(str) {
    return str[str.length - 1] === "," ? str.substring(0, str.length - 1) : str;
  };
  exports.$tail = $tail;
});

// ../../../node_modules/typia/lib/functional/$throws.js
var require_$throws = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$throws = undefined;
  var TypeGuardError_1 = require_TypeGuardError();
  var $throws = function(method) {
    return function(props) {
      throw new TypeGuardError_1.TypeGuardError(__assign(__assign({}, props), { method: "typia.".concat(method) }));
    };
  };
  exports.$throws = $throws;
});

// ../../../node_modules/typia/lib/functional/Namespace/json.js
var require_json = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.stringify = undefined;
  var _number_1 = require_$number();
  var _rest_1 = require_$rest();
  var _string_1 = require_$string();
  var _tail_1 = require_$tail();
  var _throws_1 = require_$throws();
  var is_1 = require_is();
  var stringify = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { number: _number_1.$number, string: _string_1.$string, tail: _tail_1.$tail, rest: _rest_1.$rest, throws: (0, _throws_1.$throws)("json.".concat(method)) });
  };
  exports.stringify = stringify;
});

// ../../../node_modules/typia/lib/functional/$FormDataReader/$FormDataReader.js
var require_$FormDataReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.file = exports.blob = exports.array = exports.string = exports.bigint = exports.number = exports.boolean = undefined;
  var boolean = function(input) {
    return input instanceof File ? input : input === null ? undefined : input === "null" ? null : input.length === 0 ? true : input === "true" || input === "1" ? true : input === "false" || input === "0" ? false : input;
  };
  exports.boolean = boolean;
  var number = function(input) {
    return input instanceof File ? input : (input === null || input === undefined ? undefined : input.length) ? input === "null" ? null : toNumber(input) : undefined;
  };
  exports.number = number;
  var bigint = function(input) {
    return input instanceof File ? input : (input === null || input === undefined ? undefined : input.length) ? input === "null" ? null : toBigint(input) : undefined;
  };
  exports.bigint = bigint;
  var string = function(input) {
    return input instanceof File ? input : input === null ? undefined : input === "null" ? null : input;
  };
  exports.string = string;
  var array = function(input, alternative) {
    return input.length ? input : alternative;
  };
  exports.array = array;
  var blob = function(input) {
    return input instanceof Blob ? input : input === null ? undefined : input === "null" ? null : input;
  };
  exports.blob = blob;
  var file = function(input) {
    return input instanceof File ? input : input === null ? undefined : input === "null" ? null : input;
  };
  exports.file = file;
  var toNumber = function(str) {
    var value = Number(str);
    return isNaN(value) ? str : value;
  };
  var toBigint = function(str) {
    try {
      return BigInt(str);
    } catch (_a) {
      return str;
    }
  };
});

// ../../../node_modules/typia/lib/functional/$FormDataReader/index.js
var require_$FormDataReader2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$FormDataReader = undefined;
  exports.$FormDataReader = __importStar(require_$FormDataReader());
});

// ../../../node_modules/typia/lib/functional/$HeadersReader/$HeadersReader.js
var require_$HeadersReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.string = exports.number = exports.bigint = exports.boolean = undefined;
  var boolean = function(value) {
    return value !== undefined ? value === "true" ? true : value === "false" ? false : value : undefined;
  };
  exports.boolean = boolean;
  var bigint = function(value) {
    return value !== undefined ? toBigint(value) : undefined;
  };
  exports.bigint = bigint;
  var number = function(value) {
    return value !== undefined ? toNumber(value) : undefined;
  };
  exports.number = number;
  var string = function(value) {
    return value;
  };
  exports.string = string;
  var toBigint = function(str) {
    try {
      return BigInt(str);
    } catch (_a) {
      return str;
    }
  };
  var toNumber = function(str) {
    var value = Number(str);
    return isNaN(value) ? str : value;
  };
});

// ../../../node_modules/typia/lib/functional/$HeadersReader/index.js
var require_$HeadersReader2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$HeadersReader = undefined;
  exports.$HeadersReader = __importStar(require_$HeadersReader());
});

// ../../../node_modules/typia/lib/functional/$ParameterReader/$ParameterReader.js
var require_$ParameterReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.string = exports.number = exports.bigint = exports.boolean = undefined;
  var boolean = function(value) {
    return value !== "null" ? value === "true" || value === "1" ? true : value === "false" || value === "0" ? false : value : null;
  };
  exports.boolean = boolean;
  var bigint = function(value) {
    return value !== "null" ? toBigint(value) : null;
  };
  exports.bigint = bigint;
  var number = function(value) {
    return value !== "null" ? toNumber(value) : null;
  };
  exports.number = number;
  var string = function(value) {
    return value !== "null" ? value : null;
  };
  exports.string = string;
  var toNumber = function(str) {
    var value = Number(str);
    return isNaN(value) ? str : value;
  };
  var toBigint = function(str) {
    try {
      return BigInt(str);
    } catch (_a) {
      return str;
    }
  };
});

// ../../../node_modules/typia/lib/functional/$ParameterReader/index.js
var require_$ParameterReader2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$ParameterReader = undefined;
  exports.$ParameterReader = __importStar(require_$ParameterReader());
});

// ../../../node_modules/typia/lib/functional/$QueryReader/$QueryReader.js
var require_$QueryReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.array = exports.params = exports.string = exports.bigint = exports.number = exports.boolean = undefined;
  var boolean = function(str) {
    return str === null ? undefined : str === "null" ? null : str.length === 0 ? true : str === "true" || str === "1" ? true : str === "false" || str === "0" ? false : str;
  };
  exports.boolean = boolean;
  var number = function(str) {
    return (str === null || str === undefined ? undefined : str.length) ? str === "null" ? null : toNumber(str) : undefined;
  };
  exports.number = number;
  var bigint = function(str) {
    return (str === null || str === undefined ? undefined : str.length) ? str === "null" ? null : toBigint(str) : undefined;
  };
  exports.bigint = bigint;
  var string = function(str) {
    return str === null ? undefined : str === "null" ? null : str;
  };
  exports.string = string;
  var params = function(input) {
    if (typeof input === "string") {
      var index = input.indexOf("?");
      input = index === -1 ? "" : input.substring(index + 1);
      return new URLSearchParams(input);
    }
    return input;
  };
  exports.params = params;
  var array = function(input, alternative) {
    return input.length ? input : alternative;
  };
  exports.array = array;
  var toNumber = function(str) {
    var value = Number(str);
    return isNaN(value) ? str : value;
  };
  var toBigint = function(str) {
    try {
      return BigInt(str);
    } catch (_a) {
      return str;
    }
  };
});

// ../../../node_modules/typia/lib/functional/$QueryReader/index.js
var require_$QueryReader2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$QueryReader = undefined;
  exports.$QueryReader = __importStar(require_$QueryReader());
});

// ../../../node_modules/typia/lib/functional/Namespace/http.js
var require_http = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.query = exports.parameter = exports.headers = exports.formData = undefined;
  var _FormDataReader_1 = require_$FormDataReader2();
  var _HeadersReader_1 = require_$HeadersReader2();
  var _ParameterReader_1 = require_$ParameterReader2();
  var _QueryReader_1 = require_$QueryReader2();
  var formData = function() {
    return _FormDataReader_1.$FormDataReader;
  };
  exports.formData = formData;
  var headers = function() {
    return _HeadersReader_1.$HeadersReader;
  };
  exports.headers = headers;
  var parameter = function() {
    return _ParameterReader_1.$ParameterReader;
  };
  exports.parameter = parameter;
  var query = function() {
    return _QueryReader_1.$QueryReader;
  };
  exports.query = query;
});

// ../../../node_modules/typia/lib/utils/StringUtil/StringUtil.js
var require_StringUtil = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.escapeDuplicate = exports.capitalize = undefined;
  var capitalize = function(str) {
    return str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
  };
  exports.capitalize = capitalize;
  var escapeDuplicate = function(keep) {
    return function(change) {
      return keep.includes(change) ? (0, exports.escapeDuplicate)(keep)("_".concat(change)) : change;
    };
  };
  exports.escapeDuplicate = escapeDuplicate;
});

// ../../../node_modules/typia/lib/utils/StringUtil/index.js
var require_StringUtil2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.StringUtil = undefined;
  exports.StringUtil = __importStar(require_StringUtil());
});

// ../../../node_modules/typia/lib/utils/NamingConvention/NamingConvention.js
var require_NamingConvention = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.pascal = exports.camel = undefined;
  exports.snake = snake;
  var StringUtil_1 = require_StringUtil2();
  function snake(str) {
    if (str.length === 0)
      return str;
    var prefix = "";
    for (var i = 0;i < str.length; i++) {
      if (str[i] === "_")
        prefix += "_";
      else
        break;
    }
    if (prefix.length !== 0)
      str = str.substring(prefix.length);
    var out = function(s) {
      return "".concat(prefix).concat(s);
    };
    var items = str.split("_");
    if (items.length > 1)
      return out(items.map(function(s) {
        return s.toLowerCase();
      }).join("_"));
    var indexes = [];
    for (var i = 0;i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (65 <= code && code <= 90)
        indexes.push(i);
    }
    for (var i = indexes.length - 1;i > 0; --i) {
      var now = indexes[i];
      var prev = indexes[i - 1];
      if (now - prev === 1)
        indexes.splice(i, 1);
    }
    if (indexes.length !== 0 && indexes[0] === 0)
      indexes.splice(0, 1);
    if (indexes.length === 0)
      return str.toLowerCase();
    var ret = "";
    for (var i = 0;i < indexes.length; i++) {
      var first = i === 0 ? 0 : indexes[i - 1];
      var last = indexes[i];
      ret += str.substring(first, last).toLowerCase();
      ret += "_";
    }
    ret += str.substring(indexes[indexes.length - 1]).toLowerCase();
    return out(ret);
  }
  var camel = function(str) {
    return unsnake({
      plain: function(str2) {
        return str2.length ? str2 === str2.toUpperCase() ? str2.toLocaleLowerCase() : "".concat(str2[0].toLowerCase()).concat(str2.substring(1)) : str2;
      },
      snake: function(str2, i) {
        return i === 0 ? str2.toLowerCase() : StringUtil_1.StringUtil.capitalize(str2.toLowerCase());
      }
    })(str);
  };
  exports.camel = camel;
  var pascal = function(str) {
    return unsnake({
      plain: function(str2) {
        return str2.length ? "".concat(str2[0].toUpperCase()).concat(str2.substring(1)) : str2;
      },
      snake: StringUtil_1.StringUtil.capitalize
    })(str);
  };
  exports.pascal = pascal;
  var unsnake = function(props) {
    return function(str) {
      var prefix = "";
      for (var i = 0;i < str.length; i++) {
        if (str[i] === "_")
          prefix += "_";
        else
          break;
      }
      if (prefix.length !== 0)
        str = str.substring(prefix.length);
      var out = function(s) {
        return "".concat(prefix).concat(s);
      };
      if (str.length === 0)
        return out("");
      var items = str.split("_").filter(function(s) {
        return s.length !== 0;
      });
      return items.length === 0 ? out("") : items.length === 1 ? out(props.plain(items[0])) : out(items.map(props.snake).join(""));
    };
  };
});

// ../../../node_modules/typia/lib/utils/NamingConvention/index.js
var require_NamingConvention2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.NamingConvention = undefined;
  exports.NamingConvention = __importStar(require_NamingConvention());
});

// ../../../node_modules/typia/lib/functional/$convention.js
var require_$convention = __commonJS((exports) => {
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$convention = undefined;
  var $convention = function(rename) {
    var main = function(input) {
      if (typeof input === "object")
        if (input === null)
          return null;
        else if (Array.isArray(input))
          return input.map(main);
        else if (input instanceof Boolean || input instanceof BigInt || input instanceof Number || input instanceof String)
          return input.valueOf();
        else if (input instanceof Date)
          return new Date(input);
        else if (input instanceof Uint8Array || input instanceof Uint8ClampedArray || input instanceof Uint16Array || input instanceof Uint32Array || input instanceof BigUint64Array || input instanceof Int8Array || input instanceof Int16Array || input instanceof Int32Array || input instanceof BigInt64Array || input instanceof Float32Array || input instanceof Float64Array || input instanceof DataView)
          return input;
        else
          return object(input);
      return input;
    };
    var object = function(input) {
      return Object.fromEntries(Object.entries(input).map(function(_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        return [rename(key), main(value)];
      }));
    };
    return main;
  };
  exports.$convention = $convention;
});

// ../../../node_modules/typia/lib/functional/Namespace/notations.js
var require_notations = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.snake = exports.pascal = exports.camel = undefined;
  var NamingConvention_1 = require_NamingConvention2();
  var _convention_1 = require_$convention();
  var _throws_1 = require_$throws();
  var is_1 = require_is();
  var camel = function(method) {
    return __assign(__assign({}, base(method)), { any: (0, _convention_1.$convention)(NamingConvention_1.NamingConvention.camel) });
  };
  exports.camel = camel;
  var pascal = function(method) {
    return __assign(__assign({}, base(method)), { any: (0, _convention_1.$convention)(NamingConvention_1.NamingConvention.pascal) });
  };
  exports.pascal = pascal;
  var snake = function(method) {
    return __assign(__assign({}, base(method)), { any: (0, _convention_1.$convention)(NamingConvention_1.NamingConvention.snake) });
  };
  exports.snake = snake;
  var base = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { throws: (0, _throws_1.$throws)("notations.".concat(method)) });
  };
});

// ../../../node_modules/typia/lib/functional/$clone.js
var require_$clone = __commonJS((exports) => {
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar;i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$clone = undefined;
  var $clone = function(value) {
    return $cloneMain(value);
  };
  exports.$clone = $clone;
  var $cloneMain = function(value) {
    if (value === undefined)
      return;
    else if (typeof value === "object")
      if (value === null)
        return null;
      else if (Array.isArray(value))
        return value.map($cloneMain);
      else if (value instanceof Date)
        return new Date(value);
      else if (value instanceof Uint8Array)
        return new Uint8Array(value);
      else if (value instanceof Uint8ClampedArray)
        return new Uint8ClampedArray(value);
      else if (value instanceof Uint16Array)
        return new Uint16Array(value);
      else if (value instanceof Uint32Array)
        return new Uint32Array(value);
      else if (value instanceof BigUint64Array)
        return new BigUint64Array(value);
      else if (value instanceof Int8Array)
        return new Int8Array(value);
      else if (value instanceof Int16Array)
        return new Int16Array(value);
      else if (value instanceof Int32Array)
        return new Int32Array(value);
      else if (value instanceof BigInt64Array)
        return new BigInt64Array(value);
      else if (value instanceof Float32Array)
        return new Float32Array(value);
      else if (value instanceof Float64Array)
        return new Float64Array(value);
      else if (value instanceof ArrayBuffer)
        return value.slice(0);
      else if (value instanceof SharedArrayBuffer)
        return value.slice(0);
      else if (value instanceof DataView)
        return new DataView(value.buffer.slice(0));
      else if (typeof File !== "undefined" && value instanceof File)
        return new File([value], value.name, { type: value.type });
      else if (typeof Blob !== "undefined" && value instanceof Blob)
        return new Blob([value], { type: value.type });
      else if (value instanceof Set)
        return new Set(__spreadArray([], __read(value), false).map($cloneMain));
      else if (value instanceof Map)
        return new Map(__spreadArray([], __read(value), false).map(function(_a) {
          var _b = __read(_a, 2), k = _b[0], v = _b[1];
          return [$cloneMain(k), $cloneMain(v)];
        }));
      else if (value instanceof WeakSet || value instanceof WeakMap)
        throw new Error("WeakSet and WeakMap are not supported");
      else if (value.valueOf() !== value)
        return $cloneMain(value.valueOf());
      else
        return Object.fromEntries(Object.entries(value).map(function(_a) {
          var _b = __read(_a, 2), k = _b[0], v = _b[1];
          return [k, $cloneMain(v)];
        }).filter(function(_a) {
          var _b = __read(_a, 2), v = _b[1];
          return v !== undefined;
        }));
    else if (typeof value === "function")
      return;
    return value;
  };
});

// ../../../node_modules/typia/lib/functional/$any.js
var require_$any = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$any = undefined;
  var _clone_1 = require_$clone();
  var $any = function(val) {
    return (0, _clone_1.$clone)(val);
  };
  exports.$any = $any;
});

// ../../../node_modules/typia/lib/functional/Namespace/misc.js
var require_misc = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.prune = exports.clone = undefined;
  var _any_1 = require_$any();
  var _throws_1 = require_$throws();
  var is_1 = require_is();
  var clone = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { throws: (0, _throws_1.$throws)("misc.".concat(method)), any: _any_1.$any });
  };
  exports.clone = clone;
  var prune = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { throws: (0, _throws_1.$throws)("misc.".concat(method)) });
  };
  exports.prune = prune;
});

// ../../../node_modules/typia/lib/utils/Singleton.js
var require_Singleton = __commonJS((exports) => {
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar;i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Singleton = undefined;
  var Singleton = function() {
    function Singleton2(closure) {
      this.closure_ = closure;
      this.value_ = NOT_MOUNTED_YET;
    }
    Singleton2.prototype.get = function() {
      var args = [];
      for (var _i = 0;_i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this.value_ === NOT_MOUNTED_YET)
        this.value_ = this.closure_.apply(this, __spreadArray([], __read(args), false));
      return this.value_;
    };
    return Singleton2;
  }();
  exports.Singleton = Singleton;
  var NOT_MOUNTED_YET = {};
});

// ../../../node_modules/typia/lib/functional/$ProtobufReader.js
var require_$ProtobufReader = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$ProtobufReader = undefined;
  var Singleton_1 = require_Singleton();
  var $ProtobufReader = function() {
    function $ProtobufReader2(buf) {
      this.buf = buf;
      this.ptr = 0;
      this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
    }
    $ProtobufReader2.prototype.index = function() {
      return this.ptr;
    };
    $ProtobufReader2.prototype.size = function() {
      return this.buf.length;
    };
    $ProtobufReader2.prototype.uint32 = function() {
      return this.varint32();
    };
    $ProtobufReader2.prototype.int32 = function() {
      return this.varint32();
    };
    $ProtobufReader2.prototype.sint32 = function() {
      var value = this.varint32();
      return value >>> 1 ^ -(value & 1);
    };
    $ProtobufReader2.prototype.uint64 = function() {
      return this.varint64();
    };
    $ProtobufReader2.prototype.int64 = function() {
      return this.varint64();
    };
    $ProtobufReader2.prototype.sint64 = function() {
      var value = this.varint64();
      return value >> BigInt(1) ^ -(value & BigInt(1));
    };
    $ProtobufReader2.prototype.bool = function() {
      return this.varint32() !== 0;
    };
    $ProtobufReader2.prototype.float = function() {
      var value = this.view.getFloat32(this.ptr, true);
      this.ptr += 4;
      return value;
    };
    $ProtobufReader2.prototype.double = function() {
      var value = this.view.getFloat64(this.ptr, true);
      this.ptr += 8;
      return value;
    };
    $ProtobufReader2.prototype.bytes = function() {
      var length = this.uint32();
      var from = this.ptr;
      this.ptr += length;
      return this.buf.subarray(from, from + length);
    };
    $ProtobufReader2.prototype.string = function() {
      return utf8.get().decode(this.bytes());
    };
    $ProtobufReader2.prototype.skip = function(length) {
      if (length === 0)
        while (this.u8() & 128)
          ;
      else {
        if (this.index() + length > this.size())
          throw new Error("Error on typia.protobuf.decode(): buffer overflow.");
        this.ptr += length;
      }
    };
    $ProtobufReader2.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip(0);
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4)
            this.skipType(wireType);
          break;
        case 5:
          this.skip(4);
          break;
        default:
          throw new Error("Invalid wire type ".concat(wireType, " at offset ").concat(this.ptr, "."));
      }
    };
    $ProtobufReader2.prototype.varint32 = function() {
      var loaded;
      var value;
      value = (loaded = this.u8()) & 127;
      if (loaded < 128)
        return value;
      value |= ((loaded = this.u8()) & 127) << 7;
      if (loaded < 128)
        return value;
      value |= ((loaded = this.u8()) & 127) << 14;
      if (loaded < 128)
        return value;
      value |= ((loaded = this.u8()) & 127) << 21;
      if (loaded < 128)
        return value;
      value |= ((loaded = this.u8()) & 15) << 28;
      if (loaded < 128)
        return value;
      if (this.u8() < 128)
        return value;
      if (this.u8() < 128)
        return value;
      if (this.u8() < 128)
        return value;
      if (this.u8() < 128)
        return value;
      if (this.u8() < 128)
        return value;
      return value;
    };
    $ProtobufReader2.prototype.varint64 = function() {
      var loaded;
      var value;
      value = (loaded = this.u8n()) & BigInt(127);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(7);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(14);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(21);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(28);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(35);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(42);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(49);
      if (loaded < BigInt(128))
        return value;
      value |= ((loaded = this.u8n()) & BigInt(127)) << BigInt(56);
      if (loaded < BigInt(128))
        return value;
      value |= (this.u8n() & BigInt(1)) << BigInt(63);
      return BigInt.asIntN(64, value);
    };
    $ProtobufReader2.prototype.u8 = function() {
      return this.view.getUint8(this.ptr++);
    };
    $ProtobufReader2.prototype.u8n = function() {
      return BigInt(this.u8());
    };
    return $ProtobufReader2;
  }();
  exports.$ProtobufReader = $ProtobufReader;
  var utf8 = /* @__PURE__ */ new Singleton_1.Singleton(function() {
    return new TextDecoder("utf-8");
  });
});

// ../../../node_modules/typia/lib/functional/$strlen.js
var require_$strlen = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$strlen = undefined;
  var $strlen = function(str) {
    return new Blob([str]).size;
  };
  exports.$strlen = $strlen;
});

// ../../../node_modules/typia/lib/functional/$ProtobufSizer.js
var require_$ProtobufSizer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$ProtobufSizer = undefined;
  var _strlen_1 = require_$strlen();
  var $ProtobufSizer = function() {
    function $ProtobufSizer2(length) {
      if (length === undefined) {
        length = 0;
      }
      this.len = length;
      this.pos = [];
      this.varlen = [];
      this.varlenidx = [];
    }
    $ProtobufSizer2.prototype.bool = function() {
      this.len += 1;
    };
    $ProtobufSizer2.prototype.int32 = function(value) {
      if (value < 0) {
        this.len += 10;
      } else {
        this.varint32(value);
      }
    };
    $ProtobufSizer2.prototype.sint32 = function(value) {
      this.varint32(value << 1 ^ value >> 31);
    };
    $ProtobufSizer2.prototype.uint32 = function(value) {
      this.varint32(value);
    };
    $ProtobufSizer2.prototype.int64 = function(value) {
      this.varint64(typeof value === "number" ? BigInt(value) : value);
    };
    $ProtobufSizer2.prototype.sint64 = function(value) {
      if (typeof value === "number")
        value = BigInt(value);
      this.varint64(value << BigInt(1) ^ value >> BigInt(63));
    };
    $ProtobufSizer2.prototype.uint64 = function(value) {
      this.varint64(typeof value === "number" ? BigInt(value) : value);
    };
    $ProtobufSizer2.prototype.float = function(_value) {
      this.len += 4;
    };
    $ProtobufSizer2.prototype.double = function(_value) {
      this.len += 8;
    };
    $ProtobufSizer2.prototype.bytes = function(value) {
      this.uint32(value.byteLength);
      this.len += value.byteLength;
    };
    $ProtobufSizer2.prototype.string = function(value) {
      var len = (0, _strlen_1.$strlen)(value);
      this.varlen.push(len);
      this.uint32(len);
      this.len += len;
    };
    $ProtobufSizer2.prototype.fork = function() {
      this.pos.push(this.len);
      this.varlenidx.push(this.varlen.length);
      this.varlen.push(0);
    };
    $ProtobufSizer2.prototype.ldelim = function() {
      if (!(this.pos.length && this.varlenidx.length))
        throw new Error("Error on typia.protobuf.encode(): missing fork() before ldelim() call.");
      var endPos = this.len;
      var startPos = this.pos.pop();
      var idx = this.varlenidx.pop();
      var len = endPos - startPos;
      this.varlen[idx] = len;
      this.uint32(len);
    };
    $ProtobufSizer2.prototype.reset = function() {
      this.len = 0;
      this.pos.length = 0;
      this.varlen.length = 0;
      this.varlenidx.length = 0;
    };
    $ProtobufSizer2.prototype.varint32 = function(value) {
      this.len += value < 0 ? 10 : value < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5;
    };
    $ProtobufSizer2.prototype.varint64 = function(val) {
      val = BigInt.asUintN(64, val);
      while (val > BigInt(127)) {
        ++this.len;
        val = val >> BigInt(7);
      }
      ++this.len;
    };
    return $ProtobufSizer2;
  }();
  exports.$ProtobufSizer = $ProtobufSizer;
});

// ../../../node_modules/typia/lib/functional/$ProtobufWriter.js
var require_$ProtobufWriter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.$ProtobufWriter = undefined;
  var Singleton_1 = require_Singleton();
  var $ProtobufWriter = function() {
    function $ProtobufWriter2(sizer) {
      this.sizer = sizer;
      this.buf = new Uint8Array(sizer.len);
      this.view = new DataView(this.buf.buffer);
      this.ptr = 0;
      this.varlenidx = 0;
    }
    $ProtobufWriter2.prototype.buffer = function() {
      return this.buf;
    };
    $ProtobufWriter2.prototype.bool = function(value) {
      this.byte(value ? 1 : 0);
    };
    $ProtobufWriter2.prototype.byte = function(value) {
      this.buf[this.ptr++] = value & 255;
    };
    $ProtobufWriter2.prototype.int32 = function(value) {
      if (value < 0)
        this.int64(value);
      else
        this.variant32(value >>> 0);
    };
    $ProtobufWriter2.prototype.sint32 = function(value) {
      this.variant32(value << 1 ^ value >> 31);
    };
    $ProtobufWriter2.prototype.uint32 = function(value) {
      this.variant32(value);
    };
    $ProtobufWriter2.prototype.sint64 = function(value) {
      value = BigInt(value);
      this.variant64(value << BigInt(1) ^ value >> BigInt(63));
    };
    $ProtobufWriter2.prototype.int64 = function(value) {
      this.variant64(BigInt(value));
    };
    $ProtobufWriter2.prototype.uint64 = function(value) {
      this.variant64(BigInt(value));
    };
    $ProtobufWriter2.prototype.float = function(val) {
      this.view.setFloat32(this.ptr, val, true);
      this.ptr += 4;
    };
    $ProtobufWriter2.prototype.double = function(val) {
      this.view.setFloat64(this.ptr, val, true);
      this.ptr += 8;
    };
    $ProtobufWriter2.prototype.bytes = function(value) {
      this.uint32(value.byteLength);
      for (var i = 0;i < value.byteLength; i++)
        this.buf[this.ptr++] = value[i];
    };
    $ProtobufWriter2.prototype.string = function(value) {
      var len = this.varlen();
      this.uint32(len);
      var binary = utf8.get().encode(value);
      for (var i = 0;i < binary.byteLength; i++)
        this.buf[this.ptr++] = binary[i];
    };
    $ProtobufWriter2.prototype.fork = function() {
      this.uint32(this.varlen());
    };
    $ProtobufWriter2.prototype.ldelim = function() {
    };
    $ProtobufWriter2.prototype.finish = function() {
      return this.buf;
    };
    $ProtobufWriter2.prototype.reset = function() {
      this.buf = new Uint8Array(this.sizer.len);
      this.view = new DataView(this.buf.buffer);
      this.ptr = 0;
      this.varlenidx = 0;
    };
    $ProtobufWriter2.prototype.variant32 = function(val) {
      while (val > 127) {
        this.buf[this.ptr++] = val & 127 | 128;
        val = val >>> 7;
      }
      this.buf[this.ptr++] = val;
    };
    $ProtobufWriter2.prototype.variant64 = function(val) {
      val = BigInt.asUintN(64, val);
      while (val > BigInt(127)) {
        this.buf[this.ptr++] = Number(val & BigInt(127) | BigInt(128));
        val = val >> BigInt(7);
      }
      this.buf[this.ptr++] = Number(val);
    };
    $ProtobufWriter2.prototype.varlen = function() {
      return this.varlenidx >= this.sizer.varlen.length ? 0 : this.sizer.varlen[this.varlenidx++];
    };
    return $ProtobufWriter2;
  }();
  exports.$ProtobufWriter = $ProtobufWriter;
  var utf8 = /* @__PURE__ */ new Singleton_1.Singleton(function() {
    return new TextEncoder;
  });
});

// ../../../node_modules/typia/lib/functional/Namespace/protobuf.js
var require_protobuf = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.encode = exports.decode = undefined;
  var _ProtobufReader_1 = require_$ProtobufReader();
  var _ProtobufSizer_1 = require_$ProtobufSizer();
  var _ProtobufWriter_1 = require_$ProtobufWriter();
  var _strlen_1 = require_$strlen();
  var _throws_1 = require_$throws();
  var is_1 = require_is();
  var decode = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { Reader: _ProtobufReader_1.$ProtobufReader, throws: (0, _throws_1.$throws)("protobuf.".concat(method)) });
  };
  exports.decode = decode;
  var encode = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { Sizer: _ProtobufSizer_1.$ProtobufSizer, Writer: _ProtobufWriter_1.$ProtobufWriter, strlen: _strlen_1.$strlen, throws: (0, _throws_1.$throws)(method) });
  };
  exports.encode = encode;
});

// ../../../node_modules/@samchon/openapi/lib/utils/LlmTypeChecker.js
var require_LlmTypeChecker = __commonJS((exports) => {
  var __values = exports && exports.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LlmTypeChecker = undefined;
  var LlmTypeChecker;
  (function(LlmTypeChecker2) {
    LlmTypeChecker2.visit = function(schema, callback) {
      var e_1, _a;
      var _b;
      callback(schema);
      if (LlmTypeChecker2.isOneOf(schema))
        schema.oneOf.forEach(function(s2) {
          return LlmTypeChecker2.visit(s2, callback);
        });
      else if (LlmTypeChecker2.isObject(schema)) {
        try {
          for (var _c = __values(Object.entries((_b = schema.properties) !== null && _b !== undefined ? _b : {})), _d = _c.next();!_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), _ = _e[0], s = _e[1];
            LlmTypeChecker2.visit(s, callback);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null)
          LlmTypeChecker2.visit(schema.additionalProperties, callback);
      } else if (LlmTypeChecker2.isArray(schema))
        LlmTypeChecker2.visit(schema.items, callback);
    };
    LlmTypeChecker2.isOneOf = function(schema) {
      return schema.oneOf !== undefined;
    };
    LlmTypeChecker2.isObject = function(schema) {
      return schema.type === "object";
    };
    LlmTypeChecker2.isArray = function(schema) {
      return schema.type === "array";
    };
    LlmTypeChecker2.isBoolean = function(schema) {
      return schema.type === "boolean";
    };
    LlmTypeChecker2.isInteger = function(schema) {
      return schema.type === "integer";
    };
    LlmTypeChecker2.isNumber = function(schema) {
      return schema.type === "number";
    };
    LlmTypeChecker2.isString = function(schema) {
      return schema.type === "string";
    };
    LlmTypeChecker2.isNullOnly = function(schema) {
      return schema.type === "null";
    };
    LlmTypeChecker2.isNullable = function(schema) {
      return !LlmTypeChecker2.isUnknown(schema) && (LlmTypeChecker2.isNullOnly(schema) || (LlmTypeChecker2.isOneOf(schema) ? schema.oneOf.some(LlmTypeChecker2.isNullable) : schema.nullable === true));
    };
    LlmTypeChecker2.isUnknown = function(schema) {
      return !LlmTypeChecker2.isOneOf(schema) && schema.type === undefined;
    };
  })(LlmTypeChecker || (exports.LlmTypeChecker = LlmTypeChecker = {}));
});

// ../../../node_modules/@samchon/openapi/lib/utils/LlmSchemaSeparator.js
var require_LlmSchemaSeparator = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __read = exports && exports.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === undefined || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"]))
          m.call(i);
      } finally {
        if (e)
          throw e.error;
      }
    }
    return ar;
  };
  var __values = exports && exports.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.LlmSchemaSeparator = undefined;
  var LlmTypeChecker_1 = require_LlmTypeChecker();
  var LlmSchemaSeparator;
  (function(LlmSchemaSeparator2) {
    LlmSchemaSeparator2.parameters = function(props) {
      var indexes = props.parameters.map(LlmSchemaSeparator2.schema(props.predicator));
      return {
        llm: indexes.map(function(_a, index) {
          var _b = __read(_a, 1), llm = _b[0];
          return {
            index,
            schema: llm
          };
        }).filter(function(_a) {
          var schema = _a.schema;
          return schema !== null;
        }),
        human: indexes.map(function(_a, index) {
          var _b = __read(_a, 2), human = _b[1];
          return {
            index,
            schema: human
          };
        }).filter(function(_a) {
          var schema = _a.schema;
          return schema !== null;
        })
      };
    };
    LlmSchemaSeparator2.schema = function(predicator) {
      return function(input) {
        if (predicator(input) === true)
          return [null, input];
        else if (LlmTypeChecker_1.LlmTypeChecker.isUnknown(input) || LlmTypeChecker_1.LlmTypeChecker.isOneOf(input))
          return [input, null];
        else if (LlmTypeChecker_1.LlmTypeChecker.isObject(input))
          return separateObject(predicator)(input);
        else if (LlmTypeChecker_1.LlmTypeChecker.isArray(input))
          return separateArray(predicator)(input);
        return [input, null];
      };
    };
    var separateArray = function(predicator) {
      return function(input) {
        var _a = __read(LlmSchemaSeparator2.schema(predicator)(input.items), 2), x = _a[0], y = _a[1];
        return [
          x !== null ? __assign(__assign({}, input), { items: x }) : null,
          y !== null ? __assign(__assign({}, input), { items: y }) : null
        ];
      };
    };
    var separateObject = function(predicator) {
      return function(input) {
        var e_1, _a;
        var _b, _c;
        if (!!input.additionalProperties || Object.keys((_b = input.properties) !== null && _b !== undefined ? _b : {}).length === 0)
          return [input, null];
        var llm = __assign(__assign({}, input), { properties: {} });
        var human = __assign(__assign({}, input), { properties: {} });
        try {
          for (var _d = __values(Object.entries((_c = input.properties) !== null && _c !== undefined ? _c : {})), _e = _d.next();!_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), key = _f[0], value = _f[1];
            var _g = __read(LlmSchemaSeparator2.schema(predicator)(value), 2), x = _g[0], y = _g[1];
            if (x !== null)
              llm.properties[key] = x;
            if (y !== null)
              human.properties[key] = y;
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_e && !_e.done && (_a = _d.return))
              _a.call(_d);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
        return [
          Object.keys(llm.properties).length === 0 ? null : shrinkRequired(llm),
          Object.keys(human.properties).length === 0 ? null : shrinkRequired(human)
        ];
      };
    };
    var shrinkRequired = function(input) {
      if (input.required !== undefined)
        input.required = input.required.filter(function(key) {
          var _a;
          return ((_a = input.properties) === null || _a === undefined ? undefined : _a[key]) !== undefined;
        });
      return input;
    };
  })(LlmSchemaSeparator || (exports.LlmSchemaSeparator = LlmSchemaSeparator = {}));
});

// ../../../node_modules/typia/lib/functional/Namespace/llm.js
var require_llm = __commonJS((exports) => {
  var __values = exports && exports.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m)
      return m.call(o);
    if (o && typeof o.length === "number")
      return {
        next: function() {
          if (o && i >= o.length)
            o = undefined;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.application = undefined;
  var LlmSchemaSeparator_1 = require_LlmSchemaSeparator();
  var application = function() {
    return {
      finalize: function(app, options) {
        var e_1, _a;
        var _b;
        app.options = {
          separate: (_b = options === null || options === undefined ? undefined : options.separate) !== null && _b !== undefined ? _b : null
        };
        if (app.options.separate === null)
          return;
        try {
          for (var _c = __values(app.functions), _d = _c.next();!_d.done; _d = _c.next()) {
            var func = _d.value;
            func.separated = LlmSchemaSeparator_1.LlmSchemaSeparator.parameters({
              parameters: func.parameters,
              predicator: app.options.separate
            });
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return))
              _a.call(_c);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      }
    };
  };
  exports.application = application;
});

// ../../../node_modules/typia/lib/functional/Namespace/index.js
var require_Namespace = __commonJS((exports) => {
  var __assign = exports && exports.__assign || function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length;i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.random = exports.validate = exports.assert = exports.is = exports.llm = exports.protobuf = exports.misc = exports.notations = exports.http = exports.json = exports.functional = undefined;
  var RandomGenerator_1 = require_RandomGenerator2();
  var _every_1 = require_$every();
  var _guard_1 = require_$guard();
  var _join_1 = require_$join();
  var _report_1 = require_$report();
  var TypeGuardError_1 = require_TypeGuardError();
  var is_1 = require_is();
  Object.defineProperty(exports, "is", { enumerable: true, get: function() {
    return is_1.is;
  } });
  exports.functional = __importStar(require_functional());
  exports.json = __importStar(require_json());
  exports.http = __importStar(require_http());
  exports.notations = __importStar(require_notations());
  exports.misc = __importStar(require_misc());
  exports.protobuf = __importStar(require_protobuf());
  exports.llm = __importStar(require_llm());
  var assert = function(method) {
    return __assign(__assign({}, (0, is_1.is)()), { join: _join_1.$join, every: _every_1.$every, guard: (0, _guard_1.$guard)("typia.".concat(method)), predicate: function(matched, exceptionable, closure) {
      if (matched === false && exceptionable === true)
        throw new TypeGuardError_1.TypeGuardError(__assign(__assign({}, closure()), { method: "typia.".concat(method) }));
      return matched;
    } });
  };
  exports.assert = assert;
  var validate = function() {
    return __assign(__assign({}, (0, is_1.is)()), { join: _join_1.$join, report: _report_1.$report, predicate: function(res) {
      return function(matched, exceptionable, closure) {
        if (matched === false && exceptionable === true)
          (function() {
            res.success && (res.success = false);
            var errorList = res.errors;
            var error = closure();
            if (errorList.length) {
              var last = errorList[errorList.length - 1].path;
              if (last.length >= error.path.length && last.substring(0, error.path.length) === error.path)
                return;
            }
            errorList.push(error);
            return;
          })();
        return matched;
      };
    } });
  };
  exports.validate = validate;
  var random2 = function() {
    return {
      generator: RandomGenerator_1.RandomGenerator,
      pick: RandomGenerator_1.RandomGenerator.pick
    };
  };
  exports.random = random2;
});

// ../../../node_modules/typia/lib/functional.js
var require_functional2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.validateEqualsReturn = exports.validateEqualsParameters = exports.validateEqualsFunction = exports.validateReturn = exports.validateParameters = exports.validateFunction = exports.equalsReturn = exports.equalsParameters = exports.equalsFunction = exports.isReturn = exports.isParameters = exports.isFunction = exports.assertEqualsReturn = exports.assertEqualsParameters = exports.assertEqualsFunction = exports.assertReturn = exports.assertParameters = exports.assertFunction = undefined;
  var Namespace = __importStar(require_Namespace());
  function assertFunction() {
    halt("assertFunction");
  }
  var assertFunctionPure = /* @__PURE__ */ Object.assign(assertFunction, /* @__PURE__ */ Namespace.assert("functional.assertFunction"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertFunction = assertFunctionPure;
  var assertParametersPure = /* @__PURE__ */ Object.assign(assertFunction, /* @__PURE__ */ Namespace.assert("functional.assertFunction"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertParameters = assertParametersPure;
  function assertReturn() {
    halt("assertReturn");
  }
  var assertReturnPure = /* @__PURE__ */ Object.assign(assertReturn, /* @__PURE__ */ Namespace.assert("functional.assertReturn"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertReturn = assertReturnPure;
  function assertEqualsFunction() {
    halt("assertEqualsFunction");
  }
  var assertEqualsFunctionPure = /* @__PURE__ */ Object.assign(assertEqualsFunction, /* @__PURE__ */ Namespace.assert("functional.assertEqualsFunction"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertEqualsFunction = assertEqualsFunctionPure;
  function assertEqualsParameters() {
    halt("assertEqualsParameters");
  }
  var assertEqualsParametersPure = /* @__PURE__ */ Object.assign(assertEqualsParameters, /* @__PURE__ */ Namespace.assert("functional.assertEqualsParameters"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertEqualsParameters = assertEqualsParametersPure;
  function assertEqualsReturn() {
    halt("assertEqualsReturn");
  }
  var assertEqualsReturnPure = /* @__PURE__ */ Object.assign(assertEqualsReturn, /* @__PURE__ */ Namespace.assert("functional.assertEqualsReturn"), /* @__PURE__ */ Namespace.functional.functionalAssert());
  exports.assertEqualsReturn = assertEqualsReturnPure;
  function isFunction() {
    halt("isFunction");
  }
  var isFunctionPure = /* @__PURE__ */ Object.assign(isFunction, /* @__PURE__ */ Namespace.is());
  exports.isFunction = isFunctionPure;
  function isParameters() {
    halt("isParameters");
  }
  var isParametersPure = /* @__PURE__ */ Object.assign(isParameters, /* @__PURE__ */ Namespace.is());
  exports.isParameters = isParametersPure;
  function isReturn() {
    halt("isReturn");
  }
  var isReturnPure = /* @__PURE__ */ Object.assign(isReturn, /* @__PURE__ */ Namespace.is());
  exports.isReturn = isReturnPure;
  function equalsFunction() {
    halt("equalsFunction");
  }
  var equalsFunctionPure = /* @__PURE__ */ Object.assign(equalsFunction, /* @__PURE__ */ Namespace.is());
  exports.equalsFunction = equalsFunctionPure;
  function equalsParameters() {
    halt("equalsParameters");
  }
  var equalsParametersPure = /* @__PURE__ */ Object.assign(equalsParameters, /* @__PURE__ */ Namespace.is());
  exports.equalsParameters = equalsParametersPure;
  function equalsReturn() {
    halt("equalsReturn");
  }
  var equalsReturnPure = /* @__PURE__ */ Object.assign(equalsReturn, /* @__PURE__ */ Namespace.is());
  exports.equalsReturn = equalsReturnPure;
  function validateFunction() {
    halt("validateFunction");
  }
  var validateFunctionPure = /* @__PURE__ */ Object.assign(validateFunction, /* @__PURE__ */ Namespace.validate());
  exports.validateFunction = validateFunctionPure;
  function validateParameters() {
    halt("validateReturn");
  }
  var validateParametersPure = /* @__PURE__ */ Object.assign(validateParameters, /* @__PURE__ */ Namespace.validate());
  exports.validateParameters = validateParametersPure;
  function validateReturn() {
    halt("validateReturn");
  }
  var validateReturnPure = /* @__PURE__ */ Object.assign(validateReturn, /* @__PURE__ */ Namespace.validate());
  exports.validateReturn = validateReturnPure;
  function validateEqualsFunction() {
    halt("validateEqualsFunction");
  }
  var validateEqualsFunctionPure = /* @__PURE__ */ Object.assign(validateEqualsFunction, /* @__PURE__ */ Namespace.validate());
  exports.validateEqualsFunction = validateEqualsFunctionPure;
  function validateEqualsParameters() {
    halt("validateEqualsParameters");
  }
  var validateEqualsParametersPure = /* @__PURE__ */ Object.assign(validateEqualsParameters, /* @__PURE__ */ Namespace.validate());
  exports.validateEqualsParameters = validateEqualsParametersPure;
  function validateEqualsReturn() {
    halt("validateEqualsReturn");
  }
  var validateEqualsReturnPure = /* @__PURE__ */ Object.assign(validateEqualsReturn, /* @__PURE__ */ Namespace.validate());
  exports.validateEqualsReturn = validateEqualsReturnPure;
  function halt(name) {
    throw new Error("Error on typia.functional.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/http.js
var require_http2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createParameter = exports.createValidateHeaders = exports.createIsHeaders = exports.createAssertHeaders = exports.createHeaders = exports.createValidateQuery = exports.createIsQuery = exports.createAssertQuery = exports.createQuery = exports.createValidateFormData = exports.createIsFormData = exports.createAssertFormData = exports.createFormData = exports.parameter = exports.validateHeaders = exports.isHeaders = exports.assertHeaders = exports.headers = exports.validateQuery = exports.isQuery = exports.assertQuery = exports.query = exports.validateFormData = exports.isFormData = exports.assertFormData = exports.formData = undefined;
  var Namespace = __importStar(require_Namespace());
  function formData() {
    halt("formData");
  }
  var formDataPure = /* @__PURE__ */ Object.assign(formData, /* @__PURE__ */ Namespace.http.formData());
  exports.formData = formDataPure;
  function assertFormData() {
    halt("assertFormData");
  }
  var assertFormDataPure = /* @__PURE__ */ Object.assign(assertFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.assert("http.assertFormData"));
  exports.assertFormData = assertFormDataPure;
  function isFormData() {
    halt("isFormData");
  }
  var isFormDataPure = /* @__PURE__ */ Object.assign(isFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.is());
  exports.isFormData = isFormDataPure;
  function validateFormData() {
    halt("validateFormData");
  }
  var validateFormDataPure = /* @__PURE__ */ Object.assign(validateFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.validate());
  exports.validateFormData = validateFormDataPure;
  function query() {
    halt("query");
  }
  var queryPure = /* @__PURE__ */ Object.assign(query, /* @__PURE__ */ Namespace.http.query());
  exports.query = queryPure;
  function assertQuery() {
    halt("assertQuery");
  }
  var assertQueryPure = /* @__PURE__ */ Object.assign(assertQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.assert("http.assertQuery"));
  exports.assertQuery = assertQueryPure;
  function isQuery() {
    halt("isQuery");
  }
  var isQueryPure = /* @__PURE__ */ Object.assign(isQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.is());
  exports.isQuery = isQueryPure;
  function validateQuery() {
    halt("validateQuery");
  }
  var validateQueryPure = /* @__PURE__ */ Object.assign(validateQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.validate());
  exports.validateQuery = validateQueryPure;
  function headers() {
    halt("headers");
  }
  var headersPure = /* @__PURE__ */ Object.assign(headers, /* @__PURE__ */ Namespace.http.headers());
  exports.headers = headersPure;
  function assertHeaders() {
    halt("assertHeaders");
  }
  var assertHeadersPure = /* @__PURE__ */ Object.assign(assertHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.assert("http.assertHeaders"));
  exports.assertHeaders = assertHeadersPure;
  function isHeaders() {
    halt("isHeaders");
  }
  var isHeadersPure = /* @__PURE__ */ Object.assign(isHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.is());
  exports.isHeaders = isHeadersPure;
  function validateHeaders() {
    halt("validateHeaders");
  }
  var validateHeadersPure = /* @__PURE__ */ Object.assign(validateHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.validate());
  exports.validateHeaders = validateHeadersPure;
  function parameter() {
    halt("parameter");
  }
  var parameterPure = /* @__PURE__ */ Object.assign(parameter, /* @__PURE__ */ Namespace.http.parameter(), /* @__PURE__ */ Namespace.assert("http.parameter"));
  exports.parameter = parameterPure;
  function createFormData() {
    halt("createFormData");
  }
  var createFormDataPure = /* @__PURE__ */ Object.assign(createFormData, /* @__PURE__ */ Namespace.http.formData());
  exports.createFormData = createFormDataPure;
  function createAssertFormData() {
    halt("createAssertFormData");
  }
  var createAssertFormDataPure = /* @__PURE__ */ Object.assign(createAssertFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.assert("http.createAssertFormData"));
  exports.createAssertFormData = createAssertFormDataPure;
  function createIsFormData() {
    halt("createIsFormData");
  }
  var createIsFormDataPure = /* @__PURE__ */ Object.assign(createIsFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.is());
  exports.createIsFormData = createIsFormDataPure;
  function createValidateFormData() {
    halt("createValidateFormData");
  }
  var createValidateFormDataPure = /* @__PURE__ */ Object.assign(createValidateFormData, /* @__PURE__ */ Namespace.http.formData(), /* @__PURE__ */ Namespace.validate());
  exports.createValidateFormData = createValidateFormDataPure;
  function createQuery() {
    halt("createQuery");
  }
  var createQueryPure = /* @__PURE__ */ Object.assign(createQuery, /* @__PURE__ */ Namespace.http.query());
  exports.createQuery = createQueryPure;
  function createAssertQuery() {
    halt("createAssertQuery");
  }
  var createAssertQueryPure = /* @__PURE__ */ Object.assign(createAssertQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.assert("http.createAssertQuery"));
  exports.createAssertQuery = createAssertQueryPure;
  function createIsQuery() {
    halt("createIsQuery");
  }
  var createIsQueryPure = /* @__PURE__ */ Object.assign(createIsQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.is());
  exports.createIsQuery = createIsQueryPure;
  function createValidateQuery() {
    halt("createValidateQuery");
  }
  var createValidateQueryPure = /* @__PURE__ */ Object.assign(createValidateQuery, /* @__PURE__ */ Namespace.http.query(), /* @__PURE__ */ Namespace.validate());
  exports.createValidateQuery = createValidateQueryPure;
  function createHeaders() {
    halt("createHeaders");
  }
  var createHeadersPure = /* @__PURE__ */ Object.assign(createHeaders, /* @__PURE__ */ Namespace.http.headers());
  exports.createHeaders = createHeadersPure;
  function createAssertHeaders() {
    halt("createAssertHeaders");
  }
  var createAssertHeadersPure = /* @__PURE__ */ Object.assign(createAssertHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.assert("http.createAssertHeaders"));
  exports.createAssertHeaders = createAssertHeadersPure;
  function createIsHeaders() {
    halt("createIsHeaders");
  }
  var createIsHeadersPure = /* @__PURE__ */ Object.assign(createIsHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.is());
  exports.createIsHeaders = createIsHeadersPure;
  function createValidateHeaders() {
    halt("createValidateHeaders");
  }
  var createValidateHeadersPure = /* @__PURE__ */ Object.assign(createValidateHeaders, /* @__PURE__ */ Namespace.http.headers(), /* @__PURE__ */ Namespace.validate());
  exports.createValidateHeaders = createValidateHeadersPure;
  function createParameter() {
    halt("createParameter");
  }
  var createParameterPure = /* @__PURE__ */ Object.assign(createParameter, /* @__PURE__ */ Namespace.http.parameter(), /* @__PURE__ */ Namespace.assert("http.createParameter"));
  exports.createParameter = createParameterPure;
  function halt(name) {
    throw new Error("Error on typia.http.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/llm.js
var require_llm2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.application = undefined;
  exports.schema = schema;
  var Namespace = __importStar(require_Namespace());
  function application() {
    halt("application");
  }
  var applicationPure = /* @__PURE__ */ Object.assign(application, /* @__PURE__ */ Namespace.llm.application());
  exports.application = applicationPure;
  function schema() {
    halt("schema");
  }
  function halt(name) {
    throw new Error("Error on typia.llm.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/json.js
var require_json2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createValidateStringify = exports.createIsStringify = exports.createAssertStringify = exports.createStringify = exports.createValidateParse = exports.createAssertParse = exports.createIsParse = exports.validateStringify = exports.isStringify = exports.assertStringify = exports.stringify = exports.validateParse = exports.isParse = exports.assertParse = undefined;
  exports.application = application;
  var Namespace = __importStar(require_Namespace());
  function application() {
    halt("application");
  }
  function assertParse() {
    halt("assertParse");
  }
  var assertParsePure = /* @__PURE__ */ Object.assign(assertParse, /* @__PURE__ */ Namespace.assert("json.assertParse"));
  exports.assertParse = assertParsePure;
  function isParse() {
    halt("isParse");
  }
  var isParsePure = /* @__PURE__ */ Object.assign(isParse, /* @__PURE__ */ Namespace.is());
  exports.isParse = isParsePure;
  function validateParse() {
    halt("validateParse");
  }
  var validateParsePure = /* @__PURE__ */ Object.assign(validateParse, /* @__PURE__ */ Namespace.validate());
  exports.validateParse = validateParsePure;
  function stringify() {
    halt("stringify");
  }
  var stringifyPure = /* @__PURE__ */ Object.assign(stringify, /* @__PURE__ */ Namespace.json.stringify("stringify"));
  exports.stringify = stringifyPure;
  function assertStringify() {
    halt("assertStringify");
  }
  var assertStringifyPure = /* @__PURE__ */ Object.assign(assertStringify, /* @__PURE__ */ Namespace.assert("json.assertStringify"), /* @__PURE__ */ Namespace.json.stringify("assertStringify"));
  exports.assertStringify = assertStringifyPure;
  function isStringify() {
    halt("isStringify");
  }
  var isStringifyPure = /* @__PURE__ */ Object.assign(isStringify, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.json.stringify("isStringify"));
  exports.isStringify = isStringifyPure;
  function validateStringify() {
    halt("validateStringify");
  }
  var validateStringifyPure = /* @__PURE__ */ Object.assign(validateStringify, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.json.stringify("validateStringify"));
  exports.validateStringify = validateStringifyPure;
  function createIsParse() {
    halt("createIsParse");
  }
  var createIsParsePure = /* @__PURE__ */ Object.assign(createIsParse, isParsePure);
  exports.createIsParse = createIsParsePure;
  function createAssertParse() {
    halt("createAssertParse");
  }
  var createAssertParsePure = /* @__PURE__ */ Object.assign(createAssertParse, assertParsePure);
  exports.createAssertParse = createAssertParsePure;
  function createValidateParse() {
    halt("createValidateParse");
  }
  var createValidateParsePure = /* @__PURE__ */ Object.assign(createValidateParse, validateParsePure);
  exports.createValidateParse = createValidateParsePure;
  function createStringify() {
    halt("createStringify");
  }
  var createStringifyPure = /* @__PURE__ */ Object.assign(createStringify, stringifyPure);
  exports.createStringify = createStringifyPure;
  function createAssertStringify() {
    halt("createAssertStringify");
  }
  var createAssertStringifyPure = /* @__PURE__ */ Object.assign(createAssertStringify, assertStringifyPure);
  exports.createAssertStringify = createAssertStringifyPure;
  function createIsStringify() {
    halt("createIsStringify");
  }
  var createIsStringifyPure = /* @__PURE__ */ Object.assign(createIsStringify, isStringifyPure);
  exports.createIsStringify = createIsStringifyPure;
  function createValidateStringify() {
    halt("createValidateStringify");
  }
  var createValidateStringifyPure = /* @__PURE__ */ Object.assign(createValidateStringify, validateStringifyPure);
  exports.createValidateStringify = createValidateStringifyPure;
  function halt(name) {
    throw new Error("Error on typia.json.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/misc.js
var require_misc2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createValidatePrune = exports.createIsPrune = exports.createAssertPrune = exports.createPrune = exports.createValidateClone = exports.createIsClone = exports.createAssertClone = exports.createClone = exports.validatePrune = exports.isPrune = exports.assertPrune = exports.prune = exports.validateClone = exports.isClone = exports.assertClone = exports.clone = undefined;
  exports.literals = literals;
  var Namespace = __importStar(require_Namespace());
  function literals() {
    halt("literals");
  }
  function clone() {
    halt("clone");
  }
  var clonePure = /* @__PURE__ */ Object.assign(clone, /* @__PURE__ */ Namespace.misc.clone("clone"));
  exports.clone = clonePure;
  function assertClone() {
    halt("assertClone");
  }
  var assertClonePure = /* @__PURE__ */ Object.assign(assertClone, /* @__PURE__ */ Namespace.assert("misc.assertClone"), /* @__PURE__ */ Namespace.misc.clone("assertClone"));
  exports.assertClone = assertClonePure;
  function isClone() {
    halt("isClone");
  }
  var isClonePure = /* @__PURE__ */ Object.assign(isClone, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.misc.clone("isClone"));
  exports.isClone = isClonePure;
  function validateClone() {
    halt("validateClone");
  }
  var validateClonePure = /* @__PURE__ */ Object.assign(validateClone, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.misc.clone("validateClone"));
  exports.validateClone = validateClonePure;
  function prune() {
    halt("prune");
  }
  var prunePure = /* @__PURE__ */ Object.assign(prune, /* @__PURE__ */ Namespace.misc.prune("prune"));
  exports.prune = prunePure;
  function assertPrune() {
    halt("assertPrune");
  }
  var assertPrunePure = /* @__PURE__ */ Object.assign(assertPrune, /* @__PURE__ */ Namespace.assert("misc.assertPrune"), /* @__PURE__ */ Namespace.misc.prune("assertPrune"));
  exports.assertPrune = assertPrunePure;
  function isPrune() {
    halt("isPrune");
  }
  var isPrunePure = /* @__PURE__ */ Object.assign(isPrune, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.misc.prune("isPrune"));
  exports.isPrune = isPrunePure;
  function validatePrune() {
    halt("validatePrune");
  }
  var validatePrunePure = /* @__PURE__ */ Object.assign(validatePrune, /* @__PURE__ */ Namespace.misc.prune("validatePrune"), /* @__PURE__ */ Namespace.validate());
  exports.validatePrune = validatePrunePure;
  function createClone() {
    halt("createClone");
  }
  var createClonePure = /* @__PURE__ */ Object.assign(createClone, clonePure);
  exports.createClone = createClonePure;
  function createAssertClone() {
    halt("createAssertClone");
  }
  var createAssertClonePure = /* @__PURE__ */ Object.assign(createAssertClone, assertClonePure);
  exports.createAssertClone = createAssertClonePure;
  function createIsClone() {
    halt("createIsClone");
  }
  var createIsClonePure = /* @__PURE__ */ Object.assign(createIsClone, isClonePure);
  exports.createIsClone = createIsClonePure;
  function createValidateClone() {
    halt("createValidateClone");
  }
  var createValidateClonePure = /* @__PURE__ */ Object.assign(createValidateClone, validateClonePure);
  exports.createValidateClone = createValidateClonePure;
  function createPrune() {
    halt("createPrune");
  }
  var createPrunePure = /* @__PURE__ */ Object.assign(createPrune, prunePure);
  exports.createPrune = createPrunePure;
  function createAssertPrune() {
    halt("createAssertPrune");
  }
  var createAssertPrunePure = /* @__PURE__ */ Object.assign(createAssertPrune, assertPrunePure);
  exports.createAssertPrune = createAssertPrunePure;
  function createIsPrune() {
    halt("createIsPrune");
  }
  var createIsPrunePure = /* @__PURE__ */ Object.assign(createIsPrune, isPrunePure);
  exports.createIsPrune = createIsPrunePure;
  function createValidatePrune() {
    halt("createValidatePrune");
  }
  var createValidatePrunePure = /* @__PURE__ */ Object.assign(createValidatePrune, validatePrunePure);
  exports.createValidatePrune = createValidatePrunePure;
  function halt(name) {
    throw new Error("Error on typia.misc.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/notations.js
var require_notations2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createValidateSnake = exports.createIsSnake = exports.createAssertSnake = exports.createSnake = exports.createValidatePascal = exports.createIsPascal = exports.createAssertPascal = exports.createPascal = exports.createValidateCamel = exports.createIsCamel = exports.createAssertCamel = exports.createCamel = exports.validateSnake = exports.isSnake = exports.assertSnake = exports.snake = exports.validatePascal = exports.isPascal = exports.assertPascal = exports.pascal = exports.validateCamel = exports.isCamel = exports.assertCamel = exports.camel = undefined;
  var Namespace = __importStar(require_Namespace());
  function camel() {
    return halt("camel");
  }
  var camelPure = /* @__PURE__ */ Object.assign(camel, /* @__PURE__ */ Namespace.notations.camel("camel"));
  exports.camel = camelPure;
  function assertCamel() {
    return halt("assertCamel");
  }
  var assertCamelPure = /* @__PURE__ */ Object.assign(assertCamel, /* @__PURE__ */ Namespace.notations.camel("assertCamel"), /* @__PURE__ */ Namespace.assert("notations.assertCamel"));
  exports.assertCamel = assertCamelPure;
  function isCamel() {
    return halt("isCamel");
  }
  var isCamelPure = /* @__PURE__ */ Object.assign(isCamel, /* @__PURE__ */ Namespace.notations.camel("isCamel"), /* @__PURE__ */ Namespace.is());
  exports.isCamel = isCamelPure;
  function validateCamel() {
    return halt("validateCamel");
  }
  var validateCamelPure = /* @__PURE__ */ Object.assign(validateCamel, /* @__PURE__ */ Namespace.notations.camel("validateCamel"), /* @__PURE__ */ Namespace.validate());
  exports.validateCamel = validateCamelPure;
  function pascal() {
    return halt("pascal");
  }
  var pascalPure = /* @__PURE__ */ Object.assign(pascal, /* @__PURE__ */ Namespace.notations.pascal("pascal"));
  exports.pascal = pascalPure;
  function assertPascal() {
    return halt("assertPascal");
  }
  var assertPascalPure = /* @__PURE__ */ Object.assign(assertPascal, /* @__PURE__ */ Namespace.notations.pascal("assertPascal"), /* @__PURE__ */ Namespace.assert("notations.assertPascal"));
  exports.assertPascal = assertPascalPure;
  function isPascal() {
    return halt("isPascal");
  }
  var isPascalPure = /* @__PURE__ */ Object.assign(isPascal, /* @__PURE__ */ Namespace.notations.pascal("isPascal"), /* @__PURE__ */ Namespace.is());
  exports.isPascal = isPascalPure;
  function validatePascal() {
    return halt("validatePascal");
  }
  var validatePascalPure = /* @__PURE__ */ Object.assign(validatePascal, /* @__PURE__ */ Namespace.notations.pascal("validatePascal"), /* @__PURE__ */ Namespace.validate());
  exports.validatePascal = validatePascalPure;
  function snake() {
    return halt("snake");
  }
  var snakePure = /* @__PURE__ */ Object.assign(snake, /* @__PURE__ */ Namespace.notations.snake("snake"));
  exports.snake = snakePure;
  function assertSnake() {
    return halt("assertSnake");
  }
  var assertSnakePure = /* @__PURE__ */ Object.assign(assertSnake, /* @__PURE__ */ Namespace.notations.snake("assertSnake"), /* @__PURE__ */ Namespace.assert("notations.assertSnake"));
  exports.assertSnake = assertSnakePure;
  function isSnake() {
    return halt("isSnake");
  }
  var isSnakePure = /* @__PURE__ */ Object.assign(isSnake, /* @__PURE__ */ Namespace.notations.snake("isSnake"), /* @__PURE__ */ Namespace.is());
  exports.isSnake = isSnakePure;
  function validateSnake() {
    return halt("validateSnake");
  }
  var validateSnakePure = /* @__PURE__ */ Object.assign(validateSnake, /* @__PURE__ */ Namespace.notations.snake("validateSnake"), /* @__PURE__ */ Namespace.validate());
  exports.validateSnake = validateSnakePure;
  function createCamel() {
    halt("createCamel");
  }
  var createCamelPure = /* @__PURE__ */ Object.assign(createCamel, /* @__PURE__ */ Namespace.notations.camel("createCamel"));
  exports.createCamel = createCamelPure;
  function createAssertCamel() {
    halt("createAssertCamel");
  }
  var createAssertCamelPure = /* @__PURE__ */ Object.assign(createAssertCamel, /* @__PURE__ */ Namespace.notations.camel("createAssertCamel"), /* @__PURE__ */ Namespace.assert("notations.createAssertCamel"));
  exports.createAssertCamel = createAssertCamelPure;
  function createIsCamel() {
    halt("createIsCamel");
  }
  var createIsCamelPure = /* @__PURE__ */ Object.assign(createIsCamel, /* @__PURE__ */ Namespace.notations.camel("createIsCamel"), /* @__PURE__ */ Namespace.is());
  exports.createIsCamel = createIsCamelPure;
  function createValidateCamel() {
    halt("createValidateCamel");
  }
  var createValidateCamelPure = /* @__PURE__ */ Object.assign(createValidateCamel, /* @__PURE__ */ Namespace.notations.camel("createValidateCamel"), /* @__PURE__ */ Namespace.validate());
  exports.createValidateCamel = createValidateCamelPure;
  function createPascal() {
    halt("createPascal");
  }
  var createPascalPure = /* @__PURE__ */ Object.assign(createPascal, /* @__PURE__ */ Namespace.notations.pascal("createPascal"));
  exports.createPascal = createPascalPure;
  function createAssertPascal() {
    halt("createAssertPascal");
  }
  var createAssertPascalPure = /* @__PURE__ */ Object.assign(createAssertPascal, /* @__PURE__ */ Namespace.notations.pascal("createAssertPascal"), /* @__PURE__ */ Namespace.assert("notations.createAssertPascal"));
  exports.createAssertPascal = createAssertPascalPure;
  function createIsPascal() {
    halt("createIsPascal");
  }
  var createIsPascalPure = /* @__PURE__ */ Object.assign(createIsPascal, /* @__PURE__ */ Namespace.notations.pascal("createIsPascal"), /* @__PURE__ */ Namespace.is());
  exports.createIsPascal = createIsPascalPure;
  function createValidatePascal() {
    halt("createValidatePascal");
  }
  var createValidatePascalPure = /* @__PURE__ */ Object.assign(createValidatePascal, /* @__PURE__ */ Namespace.notations.pascal("createValidatePascal"), /* @__PURE__ */ Namespace.validate());
  exports.createValidatePascal = createValidatePascalPure;
  function createSnake() {
    halt("createSnake");
  }
  var createSnakePure = /* @__PURE__ */ Object.assign(createSnake, /* @__PURE__ */ Namespace.notations.snake("createSnake"));
  exports.createSnake = createSnakePure;
  function createAssertSnake() {
    halt("createAssertSnake");
  }
  var createAssertSnakePure = /* @__PURE__ */ Object.assign(createAssertSnake, /* @__PURE__ */ Namespace.notations.snake("createAssertSnake"), /* @__PURE__ */ Namespace.assert("notations.createAssertSnake"));
  exports.createAssertSnake = createAssertSnakePure;
  function createIsSnake() {
    halt("createIsSnake");
  }
  var createIsSnakePure = /* @__PURE__ */ Object.assign(createIsSnake, /* @__PURE__ */ Namespace.notations.snake("createIsSnake"), /* @__PURE__ */ Namespace.is());
  exports.createIsSnake = createIsSnakePure;
  function createValidateSnake() {
    halt("createValidateSnake");
  }
  var createValidateSnakePure = /* @__PURE__ */ Object.assign(createValidateSnake, /* @__PURE__ */ Namespace.notations.snake("createValidateSnake"), /* @__PURE__ */ Namespace.validate());
  exports.createValidateSnake = createValidateSnakePure;
  function halt(name) {
    throw new Error("Error on typia.notations.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/protobuf.js
var require_protobuf2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createValidateEncode = exports.createAssertEncode = exports.createIsEncode = exports.createEncode = exports.createValidateDecode = exports.createAssertDecode = exports.createIsDecode = exports.createDecode = exports.validateEncode = exports.isEncode = exports.assertEncode = exports.encode = exports.validateDecode = exports.isDecode = exports.assertDecode = exports.decode = undefined;
  exports.message = message2;
  var Namespace = __importStar(require_Namespace());
  function message2() {
    halt("message");
  }
  function decode() {
    halt("decode");
  }
  var decodePure = /* @__PURE__ */ Object.assign(decode, /* @__PURE__ */ Namespace.protobuf.decode("decode"));
  exports.decode = decodePure;
  function assertDecode() {
    halt("assertDecode");
  }
  var assertDecodePure = /* @__PURE__ */ Object.assign(assertDecode, /* @__PURE__ */ Namespace.assert("protobuf.assertDecode"), /* @__PURE__ */ Namespace.protobuf.decode("assertDecode"));
  exports.assertDecode = assertDecodePure;
  function isDecode() {
    halt("isDecode");
  }
  var isDecodePure = /* @__PURE__ */ Object.assign(isDecode, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.protobuf.decode("isDecode"));
  exports.isDecode = isDecodePure;
  function validateDecode() {
    halt("validateDecode");
  }
  var validateDecodePure = /* @__PURE__ */ Object.assign(validateDecode, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.protobuf.decode("validateDecode"));
  exports.validateDecode = validateDecodePure;
  function encode() {
    halt("encode");
  }
  var encodePure = /* @__PURE__ */ Object.assign(encode, /* @__PURE__ */ Namespace.protobuf.encode("encode"));
  exports.encode = encodePure;
  function assertEncode() {
    halt("assertEncode");
  }
  var assertEncodePure = /* @__PURE__ */ Object.assign(assertEncode, /* @__PURE__ */ Namespace.assert("protobuf.assertEncode"), /* @__PURE__ */ Namespace.protobuf.encode("assertEncode"));
  exports.assertEncode = assertEncodePure;
  function isEncode() {
    halt("isEncode");
  }
  var isEncodePure = /* @__PURE__ */ Object.assign(isEncode, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.protobuf.encode("isEncode"));
  exports.isEncode = isEncodePure;
  function validateEncode() {
    halt("validateEncode");
  }
  var validateEncodePure = /* @__PURE__ */ Object.assign(validateEncode, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.protobuf.encode("validateEncode"));
  exports.validateEncode = validateEncodePure;
  function createDecode() {
    halt("createDecode");
  }
  var createDecodePure = /* @__PURE__ */ Object.assign(createDecode, /* @__PURE__ */ Namespace.protobuf.decode("createDecode"));
  exports.createDecode = createDecodePure;
  function createIsDecode() {
    halt("createIsDecode");
  }
  var createIsDecodePure = /* @__PURE__ */ Object.assign(createIsDecode, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.protobuf.decode("createIsDecode"));
  exports.createIsDecode = createIsDecodePure;
  function createAssertDecode() {
    halt("createAssertDecode");
  }
  var createAssertDecodePure = /* @__PURE__ */ Object.assign(createAssertDecode, /* @__PURE__ */ Namespace.assert("protobuf.createAssertDecode"), /* @__PURE__ */ Namespace.protobuf.decode("createAssertDecode"));
  exports.createAssertDecode = createAssertDecodePure;
  function createValidateDecode() {
    halt("createValidateDecode");
  }
  var createValidateDecodePure = /* @__PURE__ */ Object.assign(createValidateDecode, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.protobuf.decode("createValidateDecode"));
  exports.createValidateDecode = createValidateDecodePure;
  function createEncode() {
    halt("createEncode");
  }
  var createEncodePure = /* @__PURE__ */ Object.assign(createEncode, /* @__PURE__ */ Namespace.protobuf.encode("createEncode"));
  exports.createEncode = createEncodePure;
  function createIsEncode() {
    halt("createIsEncode");
  }
  var createIsEncodePure = /* @__PURE__ */ Object.assign(createIsEncode, /* @__PURE__ */ Namespace.is(), /* @__PURE__ */ Namespace.protobuf.encode("createIsEncode"));
  exports.createIsEncode = createIsEncodePure;
  function createAssertEncode() {
    halt("createAssertEncode");
  }
  var createAssertEncodePure = /* @__PURE__ */ Object.assign(createAssertEncode, /* @__PURE__ */ Namespace.assert("protobuf.createAssertEncode"), /* @__PURE__ */ Namespace.protobuf.encode("createAssertEncode"));
  exports.createAssertEncode = createAssertEncodePure;
  function createValidateEncode() {
    halt("createValidateEncode");
  }
  var createValidateEncodePure = /* @__PURE__ */ Object.assign(createValidateEncode, /* @__PURE__ */ Namespace.validate(), /* @__PURE__ */ Namespace.protobuf.encode("createValidateEncode"));
  exports.createValidateEncode = createValidateEncodePure;
  function halt(name) {
    throw new Error("Error on typia.protobuf.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/reflect.js
var require_reflect = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.metadata = undefined;
  exports.name = name;
  function metadata() {
    halt("metadata");
  }
  var metadataPure = /* @__PURE__ */ Object.assign(metadata, { from: function(input) {
    return input;
  } });
  exports.metadata = metadataPure;
  function name() {
    halt("name");
  }
  function halt(name2) {
    throw new Error("Error on typia.reflect.".concat(name2, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/tags/Constant.js
var require_Constant = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/ContentMediaType.js
var require_ContentMediaType = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Default.js
var require_Default = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Example.js
var require_Example = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Examples.js
var require_Examples = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/ExclusiveMaximum.js
var require_ExclusiveMaximum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/ExclusiveMinimum.js
var require_ExclusiveMinimum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Format.js
var require_Format = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/JsonSchemaPlugin.js
var require_JsonSchemaPlugin = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Maximum.js
var require_Maximum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/MaxItems.js
var require_MaxItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/MaxLength.js
var require_MaxLength = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Minimum.js
var require_Minimum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/MinItems.js
var require_MinItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/MinLength.js
var require_MinLength = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/MultipleOf.js
var require_MultipleOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Pattern.js
var require_Pattern = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/TagBase.js
var require_TagBase = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/Type.js
var require_Type = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/UniqueItems.js
var require_UniqueItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/tags/index.js
var require_tags = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(require_Constant(), exports);
  __exportStar(require_ContentMediaType(), exports);
  __exportStar(require_Default(), exports);
  __exportStar(require_Example(), exports);
  __exportStar(require_Examples(), exports);
  __exportStar(require_ExclusiveMaximum(), exports);
  __exportStar(require_ExclusiveMinimum(), exports);
  __exportStar(require_Format(), exports);
  __exportStar(require_JsonSchemaPlugin(), exports);
  __exportStar(require_Maximum(), exports);
  __exportStar(require_MaxItems(), exports);
  __exportStar(require_MaxLength(), exports);
  __exportStar(require_Minimum(), exports);
  __exportStar(require_MinItems(), exports);
  __exportStar(require_MinLength(), exports);
  __exportStar(require_MultipleOf(), exports);
  __exportStar(require_Pattern(), exports);
  __exportStar(require_TagBase(), exports);
  __exportStar(require_Type(), exports);
  __exportStar(require_UniqueItems(), exports);
});

// ../../../node_modules/typia/lib/schemas/metadata/IJsDocTagInfo.js
var require_IJsDocTagInfo = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/schemas/json/IJsonApplication.js
var require_IJsonApplication = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/AssertionGuard.js
var require_AssertionGuard = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/IRandomGenerator.js
var require_IRandomGenerator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/IValidation.js
var require_IValidation = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/Primitive.js
var require_Primitive = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/Resolved.js
var require_Resolved = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/CamelCase.js
var require_CamelCase = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/PascalCase.js
var require_PascalCase = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/SnakeCase.js
var require_SnakeCase = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
});

// ../../../node_modules/typia/lib/module.js
var require_module = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createRandom = exports.createValidateEquals = exports.createEquals = exports.createAssertGuardEquals = exports.createAssertEquals = exports.createValidate = exports.createIs = exports.createAssertGuard = exports.createAssert = exports.random = exports.validateEquals = exports.equals = exports.assertGuardEquals = exports.assertEquals = exports.validate = exports.is = exports.assertGuard = exports.assert = exports.tags = exports.reflect = exports.protobuf = exports.notations = exports.misc = exports.json = exports.llm = exports.http = exports.functional = undefined;
  var Namespace = __importStar(require_Namespace());
  exports.functional = __importStar(require_functional2());
  exports.http = __importStar(require_http2());
  exports.llm = __importStar(require_llm2());
  exports.json = __importStar(require_json2());
  exports.misc = __importStar(require_misc2());
  exports.notations = __importStar(require_notations2());
  exports.protobuf = __importStar(require_protobuf2());
  exports.reflect = __importStar(require_reflect());
  exports.tags = __importStar(require_tags());
  __exportStar(require_IJsDocTagInfo(), exports);
  __exportStar(require_IJsonApplication(), exports);
  __exportStar(require_AssertionGuard(), exports);
  __exportStar(require_IRandomGenerator(), exports);
  __exportStar(require_IValidation(), exports);
  __exportStar(require_TypeGuardError(), exports);
  __exportStar(require_Primitive(), exports);
  __exportStar(require_Resolved(), exports);
  __exportStar(require_CamelCase(), exports);
  __exportStar(require_PascalCase(), exports);
  __exportStar(require_SnakeCase(), exports);
  function assert() {
    halt("assert");
  }
  var assertPure = /* @__PURE__ */ Object.assign(assert, /* @__PURE__ */ Namespace.assert("assert"));
  exports.assert = assertPure;
  function assertGuard() {
    halt("assertGuard");
  }
  var assertGuardPure = /* @__PURE__ */ Object.assign(assertGuard, /* @__PURE__ */ Namespace.assert("assertGuard"));
  exports.assertGuard = assertGuardPure;
  function is() {
    halt("is");
  }
  var isPure = /* @__PURE__ */ Object.assign(is, /* @__PURE__ */ Namespace.assert("is"));
  exports.is = isPure;
  function validate() {
    halt("validate");
  }
  var validatePure = /* @__PURE__ */ Object.assign(validate, /* @__PURE__ */ Namespace.validate());
  exports.validate = validatePure;
  function assertEquals() {
    halt("assertEquals");
  }
  var assertEqualsPure = /* @__PURE__ */ Object.assign(assertEquals, /* @__PURE__ */ Namespace.assert("assertEquals"));
  exports.assertEquals = assertEqualsPure;
  function assertGuardEquals() {
    halt("assertGuardEquals");
  }
  var assertGuardEqualsPure = /* @__PURE__ */ Object.assign(assertGuardEquals, /* @__PURE__ */ Namespace.assert("assertGuardEquals"));
  exports.assertGuardEquals = assertGuardEqualsPure;
  function equals() {
    halt("equals");
  }
  var equalsPure = /* @__PURE__ */ Object.assign(equals, /* @__PURE__ */ Namespace.is());
  exports.equals = equalsPure;
  function validateEquals() {
    halt("validateEquals");
  }
  var validateEqualsPure = /* @__PURE__ */ Object.assign(validateEquals, /* @__PURE__ */ Namespace.validate());
  exports.validateEquals = validateEqualsPure;
  function random2() {
    halt("random");
  }
  var randomPure = /* @__PURE__ */ Object.assign(random2, /* @__PURE__ */ Namespace.random());
  exports.random = randomPure;
  function createAssert() {
    halt("createAssert");
  }
  var createAssertPure = /* @__PURE__ */ Object.assign(createAssert, assertPure);
  exports.createAssert = createAssertPure;
  function createAssertGuard() {
    halt("createAssertGuard");
  }
  var createAssertGuardPure = /* @__PURE__ */ Object.assign(createAssertGuard, assertGuardPure);
  exports.createAssertGuard = createAssertGuardPure;
  function createIs() {
    halt("createIs");
  }
  var createIsPure = /* @__PURE__ */ Object.assign(createIs, isPure);
  exports.createIs = createIsPure;
  function createValidate() {
    halt("createValidate");
  }
  var createValidatePure = /* @__PURE__ */ Object.assign(createValidate, validatePure);
  exports.createValidate = createValidatePure;
  function createAssertEquals() {
    halt("createAssertEquals");
  }
  var createAssertEqualsPure = /* @__PURE__ */ Object.assign(createAssertEquals, assertEqualsPure);
  exports.createAssertEquals = createAssertEqualsPure;
  function createAssertGuardEquals() {
    halt("createAssertGuardEquals");
  }
  var createAssertGuardEqualsPure = /* @__PURE__ */ Object.assign(createAssertGuardEquals, assertGuardEqualsPure);
  exports.createAssertGuardEquals = createAssertGuardEqualsPure;
  function createEquals() {
    halt("createEquals");
  }
  var createEqualsPure = /* @__PURE__ */ Object.assign(createEquals, equalsPure);
  exports.createEquals = createEqualsPure;
  function createValidateEquals() {
    halt("createValidateEquals");
  }
  var createValidateEqualsPure = /* @__PURE__ */ Object.assign(createValidateEquals, validateEqualsPure);
  exports.createValidateEquals = createValidateEqualsPure;
  function createRandom() {
    halt("createRandom");
  }
  var createRandomPure = /* @__PURE__ */ Object.assign(createRandom, randomPure);
  exports.createRandom = createRandomPure;
  function halt(name) {
    throw new Error("Error on typia.".concat(name, "(): no transform has been configured. Read and follow https://typia.io/docs/setup please."));
  }
});

// ../../../node_modules/typia/lib/index.js
var require_lib3 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var typia = __importStar(require_module());
  exports.default = typia;
  __exportStar(require_module(), exports);
});

// ../call/calc.action.ts
var exports_calc_action = {};
__export(exports_calc_action, {
  default: () => calc_action_default
});
var calc_action_default;
var init_calc_action = __esm(() => {
  init_milkio();
  calc_action_default = action({
    async handler(context2, params) {
      const count = Number(params.a) + params.b;
      context2.logger.info("count", count);
      return { count };
    }
  });
});

// ../app/context.action.ts
var exports_context_action = {};
__export(exports_context_action, {
  default: () => context_action_default
});
var context_action_default;
var init_context_action = __esm(() => {
  init_milkio();
  context_action_default = action({
    async handler(context2, params) {
      if (!context2.executeId)
        throw reject("FAIL", "Context is not 'executeId'");
      if (!context2.http)
        throw reject("FAIL", "Context is not 'http'");
      if (!context2.logger)
        throw reject("FAIL", "Context is not 'logger'");
      if (!context2.path)
        throw reject("FAIL", "Context is not 'path'");
      if (context2.say() !== "hello world")
        throw reject("FAIL", "Context is not 'say'");
      return {
        success: "fail"
      };
    }
  });
});

// ../app/child-call.action.ts
var exports_child_call_action = {};
__export(exports_child_call_action, {
  default: () => child_call_action_default
});
var child_call_action_default;
var init_child_call_action = __esm(() => {
  init_milkio();
  child_call_action_default = action({
    async handler(context2, params) {
      const result = await context2.call(Promise.resolve().then(() => (init_calc_action(), exports_calc_action)), {
        a: params.a,
        b: params.b,
        throw: params.throw
      });
      return result;
    }
  });
});

// ../app/stream-hello-world.stream.ts
var exports_stream_hello_world_stream = {};
__export(exports_stream_hello_world_stream, {
  default: () => stream_hello_world_stream_default
});
var stream_hello_world_stream_default;
var init_stream_hello_world_stream = __esm(() => {
  init_milkio();
  stream_hello_world_stream_default = stream({
    async* handler(context2, params) {
      let count = Number(params.a);
      for (let index = 0;index < params.b; index++) {
        if (params.sleep)
          await new Promise((resolve) => setTimeout(resolve, params.sleep));
        count = count * Number(params.a);
        context2.logger.info("count", count);
        yield count;
      }
    }
  });
});

// ../app/action-return-null.action.ts
var exports_action_return_null_action = {};
__export(exports_action_return_null_action, {
  default: () => action_return_null_action_default
});
var action_return_null_action_default;
var init_action_return_null_action = __esm(() => {
  init_milkio();
  action_return_null_action_default = action({
    async handler(context2, params) {
      return;
    }
  });
});

// ../app/action-hello-world.action.ts
var exports_action_hello_world_action = {};
__export(exports_action_hello_world_action, {
  default: () => action_hello_world_action_default
});
var action_hello_world_action_default;
var init_action_hello_world_action = __esm(() => {
  init_milkio();
  action_hello_world_action_default = action({
    meta: {
      typeSafety: false
    },
    async handler(context2, params) {
      console.log("1111", context2.executeId);
      const results = {
        count: 2 + params.b,
        say: "hello world"
      };
      if (params.throw)
        throw reject("FAIL", "Reject this request");
      return typeSafety(results).type();
    }
  });
});

// ../app/config.action.ts
var exports_config_action = {};
__export(exports_config_action, {
  default: () => config_action_default
});
var config_action_default;
var init_config_action = __esm(() => {
  init_milkio();
  config_action_default = action({
    async handler(context2, params) {
      context2.logger.info("hello world", context2.config);
      return {
        ...context2.config
      };
    }
  });
});

// ../app/index.action.ts
var exports_index_action = {};
__export(exports_index_action, {
  default: () => index_action_default
});
var index_action_default;
var init_index_action = __esm(() => {
  init_milkio();
  index_action_default = action({
    async handler(context2, params) {
      const count = Number(params.a) + params.b;
      context2.logger.info("count", count);
      return { count };
    }
  });
});

// ../index.ts
init_milkio();

// ../.milkio/generated/routes/call__calc/2jqw0hodkelhc.ts
var import_typia = __toESM(require_lib3(), 1);

// ../../../node_modules/@southern-aurora/tson/dist/tson.js
var c2 = {
  rules: {
    stringify: [
      {
        match: (t) => typeof t == "bigint",
        handler: (t) => `t!bigint:${t.toString()}`
      },
      {
        match: (t) => t instanceof Date,
        handler: (t) => `t!Date:${t.toISOString()}`
      },
      {
        match: (t) => t instanceof URL,
        handler: (t) => `t!URL:${t.toString()}`
      },
      {
        match: (t) => t instanceof RegExp,
        handler: (t) => `t!RegExp:${t.toString()}`
      },
      {
        match: (t) => t instanceof Uint8Array,
        handler: (t) => `t!Uint8Array:${new TextDecoder().decode(t)}`
      },
      {
        match: (t) => t instanceof ArrayBuffer,
        handler: (t) => `t!ArrayBuffer:${new TextDecoder().decode(t)}`
      }
    ],
    parse: [
      {
        match: (t) => t.startsWith("t!bigint:"),
        handler: (t) => BigInt(t.slice(9))
      },
      {
        match: (t) => t.startsWith("t!Date:"),
        handler: (t) => new Date(t.slice(7))
      },
      {
        match: (t) => t.startsWith("t!URL:"),
        handler: (t) => new URL(t.slice(6))
      },
      {
        match: (t) => t.startsWith("t!RegExp:"),
        handler: (t) => new RegExp(t.slice(9))
      },
      {
        match: (t) => t.startsWith("t!Uint8Array:"),
        handler: (t) => new TextEncoder().encode(t.slice(13))
      },
      {
        match: (t) => t.startsWith("t!ArrayBuffer:"),
        handler: (t) => new TextEncoder().encode(t.slice(14)).buffer
      }
    ]
  },
  stringify(t) {
    return JSON.stringify(c2.encode(t));
  },
  parse(t) {
    return c2.decode(JSON.parse(t));
  },
  encode(t) {
    function n(e) {
      if (!e || typeof e != "object" && typeof e != "bigint")
        return e;
      if (e) {
        if (Array.isArray(e)) {
          const s = [];
          for (let i = 0;i < e.length; i++)
            s[i] = n(e[i]);
          return s;
        }
      } else
        return e;
      for (const s of c2.rules.stringify)
        if (s.match(e))
          return s.handler(e);
      const r = {};
      for (var a in e)
        r[a] = n(e[a]);
      return r;
    }
    return n(t);
  },
  decode(t) {
    function n(e) {
      if (Array.isArray(e))
        return e.map(n);
      if (typeof e == "object" && e !== null) {
        const r = {};
        for (const a in e)
          e.hasOwnProperty(a) && (r[a] = n(e[a]));
        return r;
      } else if (typeof e == "string") {
        for (const r of c2.rules.parse)
          if (r.match(e) === true)
            return r.handler(e);
        return e;
      }
      return e;
    }
    return n(t);
  }
};

// ../.milkio/generated/routes/call__calc/2jqw0hodkelhc.ts
var _2jqw0hodkelhc_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_calc_action(), exports_calc_action)), validateParams: (params) => (() => {
  const $io0 = (input) => typeof input.a === "string" && typeof input.b === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.a === "string" || $report(_exceptionable, {
    path: _path + ".a",
    expected: "string",
    value: input.a
  }), typeof input.b === "number" || $report(_exceptionable, {
    path: _path + ".b",
    expected: "number",
    value: input.b
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "a" || key === "b")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $generator = import_typia.default.random.generator;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    a: (_generator?.customs ?? $generator.customs)?.string?.([]) ?? (_generator?.string ?? $generator.string)(),
    b: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100)
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => typeof input.count === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.count === "number" || $report(_exceptionable, {
    path: _path + ".count",
    expected: "number",
    value: input.count
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "count")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $so0 = (input) => `{"count":${input.count}}`;
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__context/2vjsmunl3efd2.ts
var import_typia2 = __toESM(require_lib3(), 1);
var _2vjsmunl3efd2_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_context_action(), exports_context_action)), validateParams: (params) => (() => {
  const $io0 = (input) => true;
  const $vo0 = (input, _path, _exceptionable = true) => true;
  const $po0 = (input) => {
    for (const key of Object.keys(input))
      delete input[key];
  };
  const __is = (input) => typeof input === "object" && input !== null && Array.isArray(input) === false && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia2.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null && Array.isArray(input2) === false || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $ro0 = (_recursive = false, _depth = 0) => {
  };
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => typeof input.success === "string";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.success === "string" || $report(_exceptionable, {
    path: _path + ".success",
    expected: "string",
    value: input.success
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "success")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia2.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $string = import_typia2.default.json.stringify.string;
  const $so0 = (input) => `{"success":${$string(input.success)}}`;
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__child_call/2ejladtmgg0m0.ts
var import_typia3 = __toESM(require_lib3(), 1);
var _2ejladtmgg0m0_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_child_call_action(), exports_child_call_action)), validateParams: (params) => (() => {
  const $io0 = (input) => typeof input.a === "string" && typeof input.b === "number" && (input["throw"] === undefined || typeof input["throw"] === "boolean");
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.a === "string" || $report(_exceptionable, {
    path: _path + ".a",
    expected: "string",
    value: input.a
  }), typeof input.b === "number" || $report(_exceptionable, {
    path: _path + ".b",
    expected: "number",
    value: input.b
  }), input["throw"] === undefined || typeof input["throw"] === "boolean" || $report(_exceptionable, {
    path: _path + '["throw"]',
    expected: "(boolean | undefined)",
    value: input["throw"]
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "a" || key === "b" || key === "throw")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia3.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $generator = import_typia3.default.random.generator;
  const $pick = import_typia3.default.random.pick;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    a: (_generator?.customs ?? $generator.customs)?.string?.([]) ?? (_generator?.string ?? $generator.string)(),
    b: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100),
    throw: $pick([
      () => {
        return;
      },
      () => (_generator?.boolean ?? $generator.boolean)()
    ])()
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => typeof input.count === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.count === "number" || $report(_exceptionable, {
    path: _path + ".count",
    expected: "number",
    value: input.count
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "count")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia3.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $so0 = (input) => `{"count":${input.count}}`;
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__stream_hello_world/texacc8jsze6.ts
var import_typia4 = __toESM(require_lib3(), 1);
var texacc8jsze6_default = { type: "stream", types: undefined, module: () => Promise.resolve().then(() => (init_stream_hello_world_stream(), exports_stream_hello_world_stream)), validateParams: (params) => (() => {
  const $io0 = (input) => typeof input.a === "string" && typeof input.b === "number" && typeof input.sleep === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.a === "string" || $report(_exceptionable, {
    path: _path + ".a",
    expected: "string",
    value: input.a
  }), typeof input.b === "number" || $report(_exceptionable, {
    path: _path + ".b",
    expected: "number",
    value: input.b
  }), typeof input.sleep === "number" || $report(_exceptionable, {
    path: _path + ".sleep",
    expected: "number",
    value: input.sleep
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "a" || key === "b" || key === "sleep")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia4.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $generator = import_typia4.default.random.generator;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    a: (_generator?.customs ?? $generator.customs)?.string?.([]) ?? (_generator?.string ?? $generator.string)(),
    b: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100),
    sleep: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100)
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => true;
  const $vo0 = (input, _path, _exceptionable = true) => true;
  const $po0 = (input) => {
    for (const key of Object.keys(input))
      delete input[key];
  };
  const __is = (input) => typeof input === "object" && input !== null && Array.isArray(input) === false && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia4.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null && Array.isArray(input2) === false || $report(true, {
        path: _path + "",
        expected: "AsyncGenerator<number, void, any>",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "AsyncGenerator<number, void, any>",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $so0 = (input) => "{}";
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__action_return_null/1w7aen1649cj.ts
var import_typia5 = __toESM(require_lib3(), 1);
var _1w7aen1649cj_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_action_return_null_action(), exports_action_return_null_action)), validateParams: (params) => (() => {
  const $io0 = (input) => true;
  const $vo0 = (input, _path, _exceptionable = true) => true;
  const $po0 = (input) => {
    for (const key of Object.keys(input))
      delete input[key];
  };
  const __is = (input) => typeof input === "object" && input !== null && Array.isArray(input) === false && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia5.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null && Array.isArray(input2) === false || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $ro0 = (_recursive = false, _depth = 0) => {
  };
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const __is = (input) => input !== null && input === undefined;
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia5.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (input2 !== null || $report(true, {
        path: _path + "",
        expected: "undefined",
        value: input2
      })) && (input2 === undefined || $report(true, {
        path: _path + "",
        expected: "undefined",
        value: input2
      })))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  return (input) => {
    return;
  };
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__action_hello_world/2qkcp0mkfvu8w.ts
var import_typia6 = __toESM(require_lib3(), 1);
var _2qkcp0mkfvu8w_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_action_hello_world_action(), exports_action_hello_world_action)), validateParams: (params) => (() => {
  const $io0 = (input) => typeof input.a === "string" && typeof input.b === "number" && (input["throw"] === undefined || typeof input["throw"] === "boolean");
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.a === "string" || $report(_exceptionable, {
    path: _path + ".a",
    expected: "string",
    value: input.a
  }), typeof input.b === "number" || $report(_exceptionable, {
    path: _path + ".b",
    expected: "number",
    value: input.b
  }), input["throw"] === undefined || typeof input["throw"] === "boolean" || $report(_exceptionable, {
    path: _path + '["throw"]',
    expected: "(boolean | undefined)",
    value: input["throw"]
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "a" || key === "b" || key === "throw")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia6.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $generator = import_typia6.default.random.generator;
  const $pick = import_typia6.default.random.pick;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    a: (_generator?.customs ?? $generator.customs)?.string?.([]) ?? (_generator?.string ?? $generator.string)(),
    b: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100),
    throw: $pick([
      () => {
        return;
      },
      () => (_generator?.boolean ?? $generator.boolean)()
    ])()
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => typeof input.count === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.count === "number" || $report(_exceptionable, {
    path: _path + ".count",
    expected: "number",
    value: input.count
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "count")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia6.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $so0 = (input) => `{"count":${input.count}}`;
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__config/o82htez2bvgl.ts
var import_typia7 = __toESM(require_lib3(), 1);
var o82htez2bvgl_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_config_action(), exports_config_action)), validateParams: (params) => (() => {
  const $io0 = (input) => true;
  const $vo0 = (input, _path, _exceptionable = true) => true;
  const $po0 = (input) => {
    for (const key of Object.keys(input))
      delete input[key];
  };
  const __is = (input) => typeof input === "object" && input !== null && Array.isArray(input) === false && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia7.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null && Array.isArray(input2) === false || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $ro0 = (_recursive = false, _depth = 0) => {
  };
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const __is = (input) => true;
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia7.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => true)(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  return (input) => input !== undefined ? JSON.stringify(input) : undefined;
})()(c2.encode(results)) };

// ../.milkio/generated/routes/app__index/22oeqhrraam6f.ts
var import_typia8 = __toESM(require_lib3(), 1);
var _22oeqhrraam6f_default = { type: "action", types: undefined, module: () => Promise.resolve().then(() => (init_index_action(), exports_index_action)), validateParams: (params) => (() => {
  const $io0 = (input) => typeof input.a === "string" && typeof input.b === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.a === "string" || $report(_exceptionable, {
    path: _path + ".a",
    expected: "string",
    value: input.a
  }), typeof input.b === "number" || $report(_exceptionable, {
    path: _path + ".b",
    expected: "number",
    value: input.b
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "a" || key === "b")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia8.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__type",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(params), randomParams: () => (() => {
  const $generator = import_typia8.default.random.generator;
  const $ro0 = (_recursive = false, _depth = 0) => ({
    a: (_generator?.customs ?? $generator.customs)?.string?.([]) ?? (_generator?.string ?? $generator.string)(),
    b: (_generator?.customs ?? $generator.customs)?.number?.([]) ?? (_generator?.number ?? $generator.number)(0, 100)
  });
  let _generator;
  return (generator) => {
    _generator = generator;
    return $ro0();
  };
})()(), validateResults: (results) => (() => {
  const $io0 = (input) => typeof input.count === "number";
  const $vo0 = (input, _path, _exceptionable = true) => [typeof input.count === "number" || $report(_exceptionable, {
    path: _path + ".count",
    expected: "number",
    value: input.count
  })].every((flag) => flag);
  const $po0 = (input) => {
    for (const key of Object.keys(input)) {
      if (key === "count")
        continue;
      delete input[key];
    }
  };
  const __is = (input) => typeof input === "object" && input !== null && $io0(input);
  let errors;
  let $report;
  const __validate = (input) => {
    if (__is(input) === false) {
      errors = [];
      $report = import_typia8.default.misc.validatePrune.report(errors);
      ((input2, _path, _exceptionable = true) => (typeof input2 === "object" && input2 !== null || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      })) && $vo0(input2, _path + "", true) || $report(true, {
        path: _path + "",
        expected: "__object",
        value: input2
      }))(input, "$input", true);
      const success = errors.length === 0;
      return {
        success,
        errors,
        data: success ? input : undefined
      };
    }
    return {
      success: true,
      errors: [],
      data: input
    };
  };
  const __prune = (input) => {
    if (typeof input === "object" && input !== null)
      $po0(input);
  };
  return (input) => {
    const result = __validate(input);
    if (result.success)
      __prune(input);
    return result;
  };
})()(results), resultsToJSON: (results) => (() => {
  const $so0 = (input) => `{"count":${input.count}}`;
  return (input) => $so0(input);
})()(c2.encode(results)) };

// ../.milkio/route-schema.ts
var route_schema_default = {
  "/$call/calc": _2jqw0hodkelhc_default,
  "/context": _2vjsmunl3efd2_default,
  "/child-call": _2ejladtmgg0m0_default,
  "/stream-hello-world": texacc8jsze6_default,
  "/action-return-null": _1w7aen1649cj_default,
  "/action-hello-world": _2qkcp0mkfvu8w_default,
  "/config": o82htez2bvgl_default,
  "/": _22oeqhrraam6f_default
};

// ../.milkio/command-schema.ts
var command_schema_default = {
  commands: {},
  len: 1
};

// ../.milkio/index.ts
var generated = {
  rejectCode: undefined,
  routeSchema: route_schema_default,
  commandSchema: command_schema_default
};

// ../config/development.config.ts
init_milkio();
var development_config_default = config((mode) => ({
  foo: mode,
  bar: 1e4
}));

// ../.milkio/config-schema.ts
var mode = "development";
var configSchema = { get: async () => {
  return {
    ...await development_config_default(mode)
  };
} };

// ../index.ts
async function bootstrap() {
  const world2 = await createWorld(generated, configSchema, {
    port: 9000,
    cookbook: { cookbookPort: 8000 },
    develop: true,
    argv: []
  });
  world2.on("milkio:executeBefore", async (event) => {
    if (!event.context)
      throw reject("FAIL", "Event is not 'context'");
    if (!event.executeId)
      throw reject("FAIL", "Event is not 'executeId'");
    if (!event.logger)
      throw reject("FAIL", "Event is not 'logger'");
    if (!event.path)
      throw reject("FAIL", "Event is not 'path'");
    event.context.say = () => "hello world";
  });
  world2.on("milkio:executeAfter", async (event) => {
    if (!event.context)
      throw reject("FAIL", "Event is not 'context'");
    if (!event.executeId)
      throw reject("FAIL", "Event is not 'executeId'");
    if (!event.logger)
      throw reject("FAIL", "Event is not 'logger'");
    if (!event.path)
      throw reject("FAIL", "Event is not 'path'");
    if (!event.results)
      throw reject("FAIL", "Event is not'results'");
    if (event.context.path === "/context")
      event.results.value = { success: "success" };
  });
  world2.on("milkio:httpRequest", async (event) => {
    if (!event.executeId)
      throw reject("FAIL", "Event is not 'executeId'");
    if (!event.logger)
      throw reject("FAIL", "Event is not 'logger'");
    if (!event.path)
      throw reject("FAIL", "Event is not 'path'");
    if (!event.http)
      throw reject("FAIL", "Event is not 'http'");
  });
  world2.on("milkio:httpResponse", async (event) => {
    if (!event.executeId)
      throw reject("FAIL", "Event is not 'executeId'");
    if (!event.logger)
      throw reject("FAIL", "Event is not 'logger'");
    if (!event.path)
      throw reject("FAIL", "Event is not 'path'");
    if (!event.http)
      throw reject("FAIL", "Event is not 'http'");
    if (!event.context)
      throw reject("FAIL", "Event is not 'context'");
  });
  return world2;
}

// [[default]].ts
var world2 = bootstrap();
async function onRequest(context2) {
  console.log("onRequest", (await world2).listener.fetch({
    request: context2.request,
    env: process.env,
    envMode: process.env.MILKIO_DEVELOP === "ENABLE" ? "development" : "production"
  }));
  return new Response("hello:" + context2.request.url, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "x-edgefunctions-test": "Welcome to use Pages Functions."
    }
  });
}
export {
  onRequest
};
