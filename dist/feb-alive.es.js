function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = {
    version: '2.6.5'
  };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;

  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };

    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };

    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }

  return function ()
  /* ...args */
  {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', {
    get: function () {
      return 7;
    }
  }).a != 7;
});

var document = _global.document; // typeof document.createElement is 'object' in old IE

var is = _isObject(document) && _isObject(document.createElement);

var _domCreate = function (it) {
  return is ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', {
    get: function () {
      return 7;
    }
  }).a != 7;
});

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string

var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;
var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) {
    /* empty */
  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};
var _objectDp = {
  f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;

var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;

  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && _has(exports, key)) continue; // export native or passed

    out = own ? target[key] : source[key]; // prevent global pollution for namespaces

    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global) // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();

            case 1:
              return new C(a);

            case 2:
              return new C(a, b);
          }

          return new C(a, b, c);
        }

        return C.apply(this, arguments);
      };

      F[PROTOTYPE] = C[PROTOTYPE];
      return F; // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out; // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%

    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out; // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%

      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
}; // type bitmap


$export.F = 1; // forced

$export.G = 2; // global

$export.S = 4; // static

$export.P = 8; // proto

$export.B = 16; // bind

$export.W = 32; // wrap

$export.U = 64; // safe

$export.R = 128; // real proto method for `library`

var _export = $export;

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// eslint-disable-next-line no-prototype-builtins

var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;

var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

var min = Math.min;

var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// true  -> Array#includes

var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value; // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare

    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++]; // eslint-disable-next-line no-self-compare

      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    }
    return !IS_INCLUDES && -1;
  };
};

var _library = true;

var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});
  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode: 'pure',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
});

var id = 0;
var px = Math.random();

var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;

  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key); // Don't enum bug & hidden keys


  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }

  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;
var _objectGops = {
  f: f$1
};

var f$2 = {}.propertyIsEnumerable;
var _objectPie = {
  f: f$2
};

var _toObject = function (it) {
  return Object(_defined(it));
};

var $assign = Object.assign; // should work with symbols and should have deterministic property order (V8 bug)

var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {}; // eslint-disable-next-line no-undef

  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;

  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;

    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  }

  return T;
} : $assign;

_export(_export.S + _export.F, 'Object', {
  assign: _objectAssign
});

var assign = _core.Object.assign;

var assign$1 = assign;

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;

  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);

  return O;
};

var document$1 = _global.document;

var _html = document$1 && document$1.documentElement;

var IE_PROTO$1 = _sharedKey('IE_PROTO');

var Empty = function () {
  /* empty */
};

var PROTOTYPE$1 = 'prototype'; // Create object with fake `null` prototype: use iframe Object with cleared prototype

var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);

  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;

  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];

  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;

  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null; // add "__proto__" for Object.getPrototypeOf polyfill

    result[IE_PROTO$1] = O;
  } else result = createDict();

  return Properties === undefined ? result : _objectDps(result, Properties);
};

_export(_export.S, 'Object', {
  create: _objectCreate
});

var $Object = _core.Object;

var create = function create(P, D) {
  return $Object.create(P, D);
};

var create$1 = create;

_export(_export.S + _export.F * !_descriptors, 'Object', {
  defineProperty: _objectDp.f
});

var $Object$1 = _core.Object;

var defineProperty = function defineProperty(it, key, desc) {
  return $Object$1.defineProperty(it, key, desc);
};

var defineProperty$1 = defineProperty;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    defineProperty$1(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defineProperty$2 = _defineProperty;

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space = '[' + _stringWs + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = _fails(function () {
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
}; // 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim


var trim = exporter.trim = function (string, TYPE) {
  string = String(_defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

var $parseInt = _global.parseInt;
var $trim = _stringTrim.trim;
var hex = /^[-+]?0[xX]/;

var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, radix >>> 0 || (hex.test(string) ? 16 : 10));
} : $parseInt;

_export(_export.G + _export.F * (parseInt != _parseInt), {
  parseInt: _parseInt
});

var _parseInt$1 = _core.parseInt;

var _parseInt$2 = _parseInt$1;

/**
 * 记录浏览操作历史栈
 * record history stack
 */
var inBrowser = typeof window !== 'undefined';
var routes = [];

if (inBrowser) {
  window.debug_routes = routes;
}

/**
 * 记录页面缓存
 * record page cache
 */
var inBrowser$1 = typeof window !== 'undefined';

var cache = create$1(null);

if (inBrowser$1) {
  window.debug_cache = cache;
}

var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () {
    fn(1);
  }), 'Object', exp);
};

_objectSap('keys', function () {
  return function keys(it) {
    return _objectKeys(_toObject(it));
  };
});

var keys = _core.Object.keys;

var keys$1 = keys;

// false -> String#codePointAt

var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _redefine = _hide;

var _iterators = {};

var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');
  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
});

var def = _objectDp.f;
var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
    configurable: true,
    value: tag
  });
};

var IteratorPrototype = {}; // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()

_hide(IteratorPrototype, _wks('iterator'), function () {
  return this;
});

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, {
    next: _propertyDesc(1, next)
  });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];

  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }

  return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`

var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () {
  return this;
};

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);

  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];

    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };

      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }

    return function entries() {
      return new Constructor(this, kind);
    };
  };

  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype; // Fix native

  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));

    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true); // fix for some old engines
    }
  } // fix Array#{values, @@iterator}.name in V8 / FF


  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;

    $default = function values() {
      return $native.call(this);
    };
  } // Define iterator


  if ((FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  } // Plug for library


  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;

  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }

  return methods;
};

var $at = _stringAt(true); // 21.1.3.27 String.prototype[@@iterator]()

_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target

  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return {
    value: undefined,
    done: true
  };
  point = $at(O, index);
  this._i += point.length;
  return {
    value: point,
    done: false
  };
});

var _iterStep = function (done, value) {
  return {
    value: value,
    done: !!done
  };
};

// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()


var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target

  this._i = 0; // next index

  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;

  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }

  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values'); // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)

_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');
var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' + 'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' + 'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' + 'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' + 'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$3 = _wks;
var _wksExt = {
  f: f$3
};

var iterator = _wksExt.f('iterator');

var iterator$1 = iterator;

var _meta = createCommonjsModule(function (module) {
  var META = _uid('meta');
  var setDesc = _objectDp.f;
  var id = 0;

  var isExtensible = Object.isExtensible || function () {
    return true;
  };

  var FREEZE = !_fails(function () {
    return isExtensible(Object.preventExtensions({}));
  });

  var setMeta = function (it) {
    setDesc(it, META, {
      value: {
        i: 'O' + ++id,
        // object ID
        w: {} // weak collections IDs

      }
    });
  };

  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;

    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F'; // not necessary to add metadata

      if (!create) return 'E'; // add missing metadata

      setMeta(it); // return object ID
    }

    return it[META].i;
  };

  var getWeak = function (it, create) {
    if (!_has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true; // not necessary to add metadata

      if (!create) return false; // add missing metadata

      setMeta(it); // return hash weak collections IDs
    }

    return it[META].w;
  }; // add metadata on freeze-family methods calling


  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
    return it;
  };

  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
});
var _meta_1 = _meta.KEY;
var _meta_2 = _meta.NEED;
var _meta_3 = _meta.fastKey;
var _meta_4 = _meta.getWeak;
var _meta_5 = _meta.onFreeze;

var defineProperty$3 = _objectDp.f;

var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$3($Symbol, name, {
    value: _wksExt.f(name)
  });
};

var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;

  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;

    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  }

  return result;
};

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
  f: f$4
};

var gOPN = _objectGopn.f;
var toString$1 = {}.toString;
var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
};

var _objectGopnExt = {
  f: f$5
};

var gOPD = Object.getOwnPropertyDescriptor;
var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD(O, P);
  } catch (e) {
    /* empty */
  }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};
var _objectGopd = {
  f: f$6
};

var META = _meta.KEY;
var gOPD$1 = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN$1 = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;

var _stringify = $JSON && $JSON.stringify;

var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject; // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173

var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild; // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687

var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () {
      return dP$1(this, 'a', {
        value: 7
      }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD$1(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);

  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);

  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, {
        enumerable: _propertyDesc(0, false)
      });
    }

    return setSymbolDesc(it, key, D);
  }

  return dP$1(it, key, D);
};

var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;

  while (l > i) $defineProperty(it, key = keys[i++], P[key]);

  return it;
};

var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};

var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD$1(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};

var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN$1(_toIobject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }

  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;

  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  }

  return result;
}; // 19.4.1.1 Symbol([description])


if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);

    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };

    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, {
      configurable: true,
      set: $set
    });
    return wrap(tag);
  };

  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });
  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, {
  Symbol: $Symbol
});

for (var es6Symbols = // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) _wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');

    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () {
    setter = true;
  },
  useSimple: function () {
    setter = false;
  }
});
_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
}); // 24.3.2 JSON.stringify(value [, replacer [, space]])

$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol(); // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols

  return _stringify([S]) != '[null]' || _stringify({
    a: S
  }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;

    while (arguments.length > i) args.push(arguments[i++]);

    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined

    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
}); // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)

$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf); // 19.4.3.5 Symbol.prototype[@@toStringTag]

_setToStringTag($Symbol, 'Symbol'); // 20.2.1.9 Math[@@toStringTag]

_setToStringTag(Math, 'Math', true); // 24.3.3 JSON[@@toStringTag]

_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol = _core.Symbol;

var symbol$1 = symbol;

var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) {
    if (typeof symbol$1 === "function" && typeof iterator$1 === "symbol") {
      _typeof2 = function _typeof2(obj) {
        return typeof obj;
      };
    } else {
      _typeof2 = function _typeof2(obj) {
        return obj && typeof symbol$1 === "function" && obj.constructor === symbol$1 && obj !== symbol$1.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof2(obj);
  }

  function _typeof(obj) {
    if (typeof symbol$1 === "function" && _typeof2(iterator$1) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof symbol$1 === "function" && obj.constructor === symbol$1 && obj !== symbol$1.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
});

_export(_export.S, 'Array', {
  isArray: _isArray
});

var isArray = _core.Array.isArray;

var isArray$1 = isArray;

function _arrayWithHoles(arr) {
  if (isArray$1(arr)) return arr;
}

var arrayWithHoles = _arrayWithHoles;

var TAG$1 = _wks('toStringTag'); // ES3 wrong here

var ARG = _cof(function () {
  return arguments;
}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) {
    /* empty */
  }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T // builtinTag case
  : ARG ? _cof(O) // ES3 arguments fallback
  : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$1 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1] || it['@@iterator'] || _iterators[_classof(it)];
};

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator = core_getIterator;

var getIterator$1 = getIterator;

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = getIterator$1(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

var iterableToArrayLimit = _iterableToArrayLimit;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}

var slicedToArray = _slicedToArray;

var inBrowser$2 = typeof window !== 'undefined';
var _toString = Object.prototype.toString; // 判断是否支持HTML5 history

var supportsPushState = inBrowser$2 && function () {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }

  return window.history && 'pushState' in window.history;
}();
var supportHistoryState = function () {
  if (!supportsPushState) {
    return false;
  } // 测试写操作


  history.replaceState(assign$1({
    _debug: 'ok'
  }, history.state), null);

  if (!history.state) {
    return false;
  } else {
    var originState = assign$1({}, history.state);

    delete originState._debug;
    history.replaceState(originState, null);
    return true;
  }
}();
/**
 * 生成页面主键
 */

function genKey() {
  var t = 'xxxxxxxx';
  return t.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
/**
 * 检测路由匹配
 * @param {Array/String/RegExp} pattern 路由主键数组/字符串/正则表达式
 * @param {String} name 路由主键
 */

function matches(pattern, name) {
  if (isArray$1(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (pattern instanceof RegExp) {
    return pattern.test(name);
  }

  return false;
}
/**
 * 获取当前url路径
 * @param {String} base | 基础路径
 * @param {String} mode | 路由模式
 */

function getLocation(base, mode) {
  var path = window.location.pathname;

  if (mode === 'hash') {
    return window.location.hash.replace(/^#\//, '');
  }

  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }

  return (path || '/') + window.location.search + window.location.hash;
}
/**
 * 删除数组中匹配元素
 * @param {Array} arr 数组
 * @param {String} item 需要删除的元素
 */

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
/**
 * 获取缓存组件实例
 * @param {Object} cache 缓存
 * @param {string} key 主键
 */

function getCacheVnode(cache, key) {
  if (typeof key === 'string' || typeof key === 'number') {
    return getCacheVnode(cache, cache[key]);
  }

  return key;
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function deepClone(val) {
  if (isPlainObject(val)) {
    var res = {};

    for (var key in val) {
      res[key] = deepClone(val[key]);
    }

    return res;
  } else if (isArray$1(val)) {
    return val.slice();
  } else {
    return val;
  }
}
function defineRouteMeta(routes) {
  routes.forEach(function (route) {
    var meta = deepClone(route.meta);

    if (isPlainObject(route.meta)) {
      defineProperty$1(route.meta, '_default', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: meta
      });
    }

    if (route.children) {
      defineRouteMeta(route.children);
    }
  });
}

function parsePath(path) {
  var hash = '';
  var query = '';
  var hashIndex = path.indexOf('#');

  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');

  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    pathStr: path,
    queryStr: query,
    hashStr: hash
  };
}

var genLocation = function genLocation(url) {
  var query = create$1(null);

  var _parsePath = parsePath(url),
      pathStr = _parsePath.pathStr,
      queryStr = _parsePath.queryStr,
      hashStr = _parsePath.hashStr;

  if (queryStr) {
    queryStr.split('&').forEach(function (kv) {
      var _kv$split = kv.split('='),
          _kv$split2 = slicedToArray(_kv$split, 2),
          key = _kv$split2[0],
          val = _kv$split2[1];

      query[key] = decodeURIComponent(val);
    });
  }

  return {
    path: pathStr,
    query: query,
    hash: hashStr
  };
};

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (_typeof_1(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

var stringifyQuery = function stringifyQuery(query) {
  var str = '';

  keys$1(query).forEach(function (key, index) {
    var val = query[key];

    if (index !== 0) {
      str += '&';
    }

    str += key + '=' + encodeURIComponent(stringifyPrimitive(val));
  });

  return str;
}; // 解析url


var parseUrl = function parseUrl(url) {
  if (typeof url === 'string') {
    url = {
      path: url,
      query: create$1(null)
    };
  } // path可能自带参数


  var _url = url,
      path = _url.path,
      query = _url.query;
  var location = genLocation(path);

  var newQuery = assign$1({}, location.query, query);

  var queryStr = stringifyQuery(newQuery);
  queryStr = queryStr ? '?' + queryStr : '';
  return location.path + queryStr + location.hash;
};

var FebAlive = (function (keyName, maxPage) {
  return {
    name: 'feb-alive',
    abstract: true,
    methods: {
      cacheClear: function cacheClear(key) {
        // Fix: replace情况下 key未变化，导致实例未被销毁
        var vnode = this.cache[key];
        vnode && vnode.componentInstance && vnode.componentInstance.$destroy();

        if (maxPage && this.keys.length > _parseInt$2(maxPage)) {
          var oldKey = this.keys[0];
          var oldVnode = this.cache[oldKey];
          oldVnode && oldVnode.componentInstance && oldVnode.componentInstance.$destroy();
          remove(this.keys, oldKey);
          delete this.cache[oldKey];
        }

        for (var _key in this.cache) {
          if (!matches(routes, _key)) {
            var _vnode = this.cache[_key];
            _vnode && _vnode.componentInstance && _vnode.componentInstance.$destroy();
            remove(this.keys, _key);
            delete this.cache[_key];
          }
        }
      }
    },
    created: function created() {
      this.cache = create$1(null);
      this.keys = [];
    },
    // 当路由变化时候，会触发feb-alive的$fourceUpdate
    render: function render() {
      // 取到router-view的vnode
      var vnode = this.$slots.default ? this.$slots.default[0] : null;
      var disableCache = this.$route.meta.disableCache; // 如果不支持html5 history 写操作则不做缓存处理

      if (!supportHistoryState) {
        return vnode;
      } // 尝试写入key


      if (!history.state || !history.state[keyName]) {
        var state = defineProperty$2({}, keyName, genKey());

        var path = getLocation();
        history.replaceState(state, null, path);
      } // 有些浏览器不支持往state中写入数据


      if (!history.state) {
        return vnode;
      } // 指定不使用缓存
      // if (disableCache) {
      //   return vnode
      // }
      // 核心逻辑


      if (vnode) {
        var cache$1 = this.cache,
            keys = this.keys;
        var key = history.state[keyName];
        var _this$$router$febReco = this.$router.febRecord,
            from = _this$$router$febReco.from,
            to = _this$$router$febReco.to;
        var parent = this.$parent;
        var depth = 0;
        var cacheVnode = null;
        vnode && (vnode.data.febAlive = true);

        while (parent && parent._routerRoot !== parent) {
          if (parent.$vnode && parent.$vnode.data.febAlive) {
            depth++;
          }

          parent = parent.$parent;
        } // 记录缓存及其所在层级


        cache[depth] = cache$1; // 底层路由才进行cache判断

        if (disableCache && to.matched.length === depth + 1) {
          return vnode;
        }
        /**
         * 内层feb-alive实例会被保存，防止从/home/a 跳转到 /other的时候内层feb-alive执行render时候，多生成一个实例
         * 例如 /home/a backTo /other
         */


        if (to.matched.length < depth + 1) {
          return null;
        }

        vnode.key = "__febAlive-".concat(key, "-").concat(vnode.tag);

        if (from.matched[depth] === to.matched[depth] && depth !== to.matched.length - 1) {
          /**
           * 1.嵌套路由跳转中的父级路由
           * 2./home/a --> /home/b
           * 3.针对home组件，无需主动设置componentInstance
           * 4./home/a --> /home/b 时，home组件不应该重新实例化。直接进行key设置复用即可
           * 5.父路由通过key进行复用
           */
          cache$1[key] = cache$1[key] || this.keys[this.keys.length - 1];
          cacheVnode = getCacheVnode(cache$1, cache$1[key]);

          if (cacheVnode) {
            vnode.key = cacheVnode.key;
            remove(keys, key);
            keys.push(key);
          } else {
            this.cacheClear(key);
            cache$1[key] = vnode;
            keys.push(key);
          }
        } else {
          /**
           * 1.嵌套路由跳转 && 子路由
           * 2.正常跳转 && 动态路由跳转
           * 3./a --> /b
           * 4./page/1 --> /page/2
           */
          cacheVnode = getCacheVnode(cache$1, key); // 只有相同的vnode才允许复用组件实例，否则虽然实例复用了，但是在patch的最后阶段，会将复用的dom删除

          if (cacheVnode && vnode.tag === cacheVnode.tag) {
            vnode.key = cacheVnode.key;
            vnode.componentInstance = cacheVnode.componentInstance;
            remove(keys, key);
            keys.push(key);
          } else {
            this.cacheClear(key);
            cache$1[key] = vnode;
            keys.push(key);
          }
        }

        vnode.data.keepAlive = true;
      }

      return vnode;
    },
    destroyed: function destroyed() {
      for (var key in this.cache) {
        var vnode = this.cache[key];
        vnode && vnode.componentInstance.$destroy();
      }

      this.keys = [];
      this.cache = {};
    }
  };
});

var FebAliveSSR = (function () {
  return {
    name: 'feb-alive',
    abstract: true,
    render: function render() {
      var vnode = this.$slots.default ? this.$slots.default[0] : null;
      return vnode;
    }
  };
});

var nav = (function (bus, keyName) {
  var forward = function forward(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1] || null;
    to.name = name;
    routes$1.push(name);
    bus.$emit('forward', to, from);
  };

  var back = function back(count, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1];
    to.name = routes$1[routes$1.length - 1 - count];
    routes$1.splice(routes.length - count, count);
    bus.$emit('back', to, from);
  };

  var replace = function replace(name, toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    from.name = routes$1[routes$1.length - 1] || null;
    to.name = name;
    routes$1.splice(routes.length - 1, 1, name);
    bus.$emit('replace', to, from);
  };

  var refresh = function refresh(toRoute, fromRoute) {
    var to = {
      route: toRoute
    };
    var from = {
      route: fromRoute
    };
    var routes$1 = routes;
    to.name = from.name = routes$1[routes$1.length - 1];
    bus.$emit('refresh', to, from);
  };

  var reset = function reset() {
    routes.splice(0, routes.length);
    bus.$emit('reset');
  };

  var record = function record(toRoute, fromRoute, replaceFlag) {
    if (!history.state) {
      return;
    }
    /**
     * 1. 当使用默认的history.key时，如果route配置中没有设置scrollBehavior，那么首次取到的就是空值
     * 2. 其他情况下首次都为空，需要主动设置，否则在cacheClear时，会把首次渲染的页面缓存删除
     */


    var name = history.state[keyName];

    if (!name) {
      // 首次渲染进入当前逻辑
      var key = genKey();

      var state = defineProperty$2({}, keyName, key);

      var path = getLocation();
      history.replaceState(state, null, path);
      name = key;
    }

    if (replaceFlag) {
      replace(name, toRoute, fromRoute);
    } else {
      var toIndex = routes.lastIndexOf(name);

      if (toIndex === -1) {
        forward(name, toRoute, fromRoute);
      } else if (toIndex === routes.length - 1) {
        refresh(toRoute, fromRoute);
      } else {
        back(routes.length - 1 - toIndex, toRoute, fromRoute);
      }
    }
  };

  return {
    record: record,
    reset: reset
  };
});

var metaMap = create$1(null);

var hasReset = false;
var index = {
  install: function install(Vue) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        router = _ref.router,
        _ref$keyName = _ref.keyName,
        keyName = _ref$keyName === void 0 ? 'key' : _ref$keyName,
        _ref$isServer = _ref.isServer,
        isServer = _ref$isServer === void 0 ? false : _ref$isServer,
        _ref$maxPage = _ref.maxPage,
        maxPage = _ref$maxPage === void 0 ? 10 : _ref$maxPage,
        beforeLocationChange = _ref.beforeLocationChange;

    if (isServer) {
      Vue.component('feb-alive', FebAliveSSR());
      return;
    }

    Vue.component('feb-alive', FebAlive(keyName, maxPage));

    if (!router) {
      console.warn('need options: router');
      return;
    }

    window.debug_metaMap = metaMap;
    var routes$1 = router.options.routes; // 记录路由初始meta
    // record default route.meta

    defineRouteMeta(routes$1);
    var bus = new Vue();
    var navigator = nav(bus, keyName);
    var replace = router.replace;
    var lastKey = '';
    var replaceFlag = false;

    router.replace = function () {
      replaceFlag = true;
      replace.apply(this, arguments);
    };

    var ensureURL = router.history.ensureURL;

    router.history.ensureURL = function () {
      ensureURL.apply(this, arguments); // 恢复meta缓存
      // recover to.meta

      var from = router.febRecord.from;
      var to = router.febRecord.to;
      Vue.location.recoverMeta(from, to);
      navigator.record(to, from, replaceFlag);
      replaceFlag = false;
    };

    router.beforeEach(function (to, from, next) {
      // 重置meta
      // reset to.meta
      assign$1(to.meta, to.meta._default);

      router.febRecord = {
        to: to,
        from: from,
        replaceFlag: replaceFlag
      };
      next();
    }); // 浏览器端持有
    // only in browser

    Vue.location = Vue.prototype.$location = {
      to: function to(url) {
        var native = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);
          url = url.replace(new RegExp("^".concat(location.origin)), '');
          var matchRoute = router.match(url);
          var matched = matchRoute.matched;

          if (!matched.length || matched[0].path === '*' || native) {
            window.location.href = url;
            return;
          }

          if (!beforeLocationChange) {
            router.push({
              path: url
            });
            return;
          }

          beforeLocationChange(route, function (state) {
            if (state === false) {
              window.location.href = url;
            } else {
              router.push({
                path: url
              });
            }
          });
        } catch (err) {
          console.log(err);
        }
      },
      replace: function replace(url) {
        var native = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        try {
          if (!url) {
            console.warn('FEB-ALIVE: 跳转链接不能为空');
            return;
          }

          url = parseUrl(url);
          url = url.replace(new RegExp("^".concat(location.origin)), '');
          var matchRoute = router.match(url);
          var matched = matchRoute.matched;

          if (!matched.length || matched[0].path === '*' || native) {
            window.location.replace(url);
            return;
          }

          if (!beforeLocationChange) {
            router.replace({
              path: url
            });
            return;
          }

          beforeLocationChange(route, function (state) {
            if (state === false) {
              window.location.replace(url);
            } else {
              router.replace({
                path: url
              });
            }
          });
        } catch (err) {
          console.error(err);
        }
      },
      go: function go(n) {
        router.go(n);
      },
      back: function back() {
        router.back();
      },
      forward: function forward() {
        router.forward();
      },
      // 恢复缓存，确保在导航切换后执行
      // recover cache after url has change
      recoverMeta: function recoverMeta(from, to) {
        var isSamePage = from.path === to.path;
        var fromMeta = from.meta;
        var toMeta = to.meta;
        var key = history.state[keyName];
        var isReplace = router.febRecord.replaceFlag; // 缓存上一页面meta配置
        // cache last page's meta

        if (!fromMeta.disableCache && lastKey) {
          metaMap[lastKey] = deepClone(fromMeta);
        }

        lastKey = key; // 匹配meta缓存
        // apply matched meta cache

        toMeta.fromCache = false;

        if (!isReplace || isReplace && isSamePage) {
          if (metaMap[key]) {
            assign$1(toMeta, metaMap[key]);

            toMeta.fromCache = true;
          }
        }

        return toMeta;
      },
      getRoutes: function getRoutes() {
        return routes.slice();
      },
      getCache: function getCache() {
        return cache;
      },
      getKey: function getKey() {
        return history.state && history.state[keyName];
      },
      cleanRoutes: function cleanRoutes() {
        return navigator.reset();
      },
      on: function on(event, callback) {
        bus.$on(event, callback);
      },
      once: function once(event, callback) {
        bus.$once(event, callback);
      },
      off: function off(event, callback) {
        bus.$off(event, callback);
      }
    };
  },
  resetHistory: function resetHistory() {
    if (typeof history !== 'undefined' && !hasReset) {
      var nativeHistoryReplaceState = history.replaceState.bind(history);

      history.replaceState = function (state, title, path) {
        nativeHistoryReplaceState(assign$1({}, history.state, state), title, path);
      };

      hasReset = true;
    }
  }
};

export default index;
