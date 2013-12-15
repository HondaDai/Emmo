/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, anchoredLink, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, browserSupportsTurbolinks, cacheCurrentPage, cacheSize, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, installClickHandlerLast, installDocumentReadyPageEventTriggers, installHistoryChangeHandler, installJqueryAjaxSuccessPageUpdateTrigger, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, pageChangePrevented, pagesCached, popCookie, processResponse, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberReferer, removeHash, removeHashForIE10compatiblity, removeNoscriptTags, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  pageCache = {};

  cacheSize = 10;

  currentState = null;

  loadedAssets = null;

  referer = null;

  createDocument = null;

  xhr = null;

  fetchReplacement = function(url) {
    rememberReferer();
    cacheCurrentPage();
    triggerEvent('page:fetch', {
      url: url
    });
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', removeHashForIE10compatiblity(url), true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (doc = processResponse()) {
        reflectNewUrl(url);
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl();
        resetScrollPosition();
        return triggerEvent('page:load');
      } else {
        return document.location.href = url;
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(cachedPage) {
    cacheCurrentPage();
    if (xhr != null) {
      xhr.abort();
    }
    changePage(cachedPage.title, cachedPage.body);
    recallScrollPosition(cachedPage);
    return triggerEvent('page:restore');
  };

  cacheCurrentPage = function() {
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(cacheSize);
  };

  pagesCached = function(size) {
    if (size == null) {
      size = cacheSize;
    }
    if (/^[\d]+$/.test(size)) {
      return cacheSize = parseInt(size);
    }
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    triggerEvent('page:change');
    return triggerEvent('page:update');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref, _ref1;
    scripts = Array.prototype.slice.call(document.body.querySelectorAll('script:not([data-turbolinks-eval="false"])'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref = script.type) === '' || _ref === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref1 = script.attributes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        attr = _ref1[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== referer) {
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function() {
    var location, preservedHash;
    if (location = xhr.getResponseHeader('X-XHR-Redirected-To')) {
      preservedHash = removeHash(location) === location ? document.location.hash : '';
      return window.history.replaceState(currentState, '', location + preservedHash);
    }
  };

  rememberReferer = function() {
    return referer = document.location.href;
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    if (document.location.hash) {
      return document.location.href = document.location.href;
    } else {
      return window.scrollTo(0, 0);
    }
  };

  removeHashForIE10compatiblity = function(url) {
    return removeHash(url);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  popCookie = function(name) {
    var value, _ref;
    value = ((_ref = document.cookie.match(new RegExp(name + "=(\\w+)"))) != null ? _ref[1].toUpperCase() : void 0) || '';
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/';
    return value;
  };

  triggerEvent = function(name, data) {
    var event;
    event = document.createEvent('Events');
    if (data) {
      event.data = data;
    }
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  pageChangePrevented = function() {
    return !triggerEvent('page:before-change');
  };

  processResponse = function() {
    var assetsChanged, clientOrServerError, doc, extractTrackAssets, intersection, validContent;
    clientOrServerError = function() {
      var _ref;
      return (400 <= (_ref = xhr.status) && _ref < 600);
    };
    validContent = function() {
      return xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
    };
    extractTrackAssets = function(doc) {
      var node, _i, _len, _ref, _results;
      _ref = doc.head.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
          _results.push(node.getAttribute('src') || node.getAttribute('href'));
        }
      }
      return _results;
    };
    assetsChanged = function(doc) {
      var fetchedAssets;
      loadedAssets || (loadedAssets = extractTrackAssets(document));
      fetchedAssets = extractTrackAssets(doc);
      return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
    };
    intersection = function(a, b) {
      var value, _i, _len, _ref, _results;
      if (a.length > b.length) {
        _ref = [b, a], a = _ref[0], b = _ref[1];
      }
      _results = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        value = a[_i];
        if (__indexOf.call(b, value) >= 0) {
          _results.push(value);
        }
      }
      return _results;
    };
    if (!clientOrServerError() && validContent()) {
      doc = createDocument(xhr.responseText);
      if (doc && !assetsChanged(doc)) {
        return doc;
      }
    }
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref = testDoc.body) != null ? _ref.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        if (!pageChangePrevented()) {
          visit(link.href);
        }
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  installDocumentReadyPageEventTriggers = function() {
    return document.addEventListener('DOMContentLoaded', (function() {
      triggerEvent('page:change');
      return triggerEvent('page:update');
    }), true);
  };

  installJqueryAjaxSuccessPageUpdateTrigger = function() {
    if (typeof jQuery !== 'undefined') {
      return jQuery(document).on('ajaxSuccess', function(event, xhr, settings) {
        if (!jQuery.trim(xhr.responseText)) {
          return;
        }
        return triggerEvent('page:update');
      });
    }
  };

  installHistoryChangeHandler = function(event) {
    var cachedPage, _ref;
    if ((_ref = event.state) != null ? _ref.turbolinks : void 0) {
      if (cachedPage = pageCache[event.state.position]) {
        return fetchHistory(cachedPage);
      } else {
        return visit(event.target.location.href);
      }
    }
  };

  initializeTurbolinks = function() {
    rememberCurrentUrl();
    rememberCurrentState();
    createDocument = browserCompatibleDocumentParser();
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', installHistoryChangeHandler, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = (_ref = popCookie('request_method')) === 'GET' || _ref === '';

  browserSupportsTurbolinks = browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe;

  installDocumentReadyPageEventTriggers();

  installJqueryAjaxSuccessPageUpdateTrigger();

  if (browserSupportsTurbolinks) {
    visit = fetchReplacement;
    initializeTurbolinks();
  } else {
    visit = function(url) {
      return document.location.href = url;
    };
  }

  this.Turbolinks = {
    visit: visit,
    pagesCached: pagesCached,
    supported: browserSupportsTurbolinks
  };

}).call(this);
/** # Semantic UI
* Version: 0.10.1
* http://github.com/jlukic/semantic-ui
*
*
* Copyright 2013 Contributors
* Released under the MIT license
* http://opensource.org/licenses/MIT
*
* Release Date: 12/06/2013
*/

!function(a,b,c,d){a.fn.accordion=function(b){var c,e=a(this),f=(new Date).getTime(),g=[],h=arguments[0],i="string"==typeof h,j=[].slice.call(arguments,1);return e.each(function(){var k,l=a.isPlainObject(b)?a.extend(!0,{},a.fn.accordion.settings,b):a.extend({},a.fn.accordion.settings),m=l.className,n=l.namespace,o=l.selector,p=l.error,q="."+n,r="module-"+n,s=e.selector||"",t=a(this),u=t.find(o.title),v=t.find(o.content),w=this,x=t.data(r);k={initialize:function(){k.debug("Initializing accordion with bound events",t),u.on("click"+q,k.event.click),k.instantiate()},instantiate:function(){x=k,t.data(r,k)},destroy:function(){k.debug("Destroying previous accordion for",t),t.removeData(r),u.off(q)},event:{click:function(){k.verbose("Title clicked",this);var b=a(this),c=u.index(b);k.toggle(c)},resetStyle:function(){k.verbose("Resetting styles on element",this),a(this).attr("style","").removeAttr("style").children().attr("style","").removeAttr("style")}},toggle:function(a){k.debug("Toggling content content at index",a);var b=u.eq(a),c=b.next(v),d=c.is(":visible");d?l.collapsible?k.close(a):k.debug("Cannot close accordion content collapsing is disabled"):k.open(a)},open:function(b){var c=u.eq(b),d=c.next(v),e=c.siblings(o.title).filter("."+m.active),f=e.next(u),g=e.size()>0;d.is(":animated")||(k.debug("Opening accordion content",c),l.exclusive&&g&&(e.removeClass(m.active),f.stop().children().animate({opacity:0},l.duration,k.event.resetStyle).end().slideUp(l.duration,l.easing,function(){f.removeClass(m.active).attr("style","").removeAttr("style").children().attr("style","").removeAttr("style")})),c.addClass(m.active),d.stop().children().attr("style","").removeAttr("style").end().slideDown(l.duration,l.easing,function(){d.addClass(m.active).attr("style","").removeAttr("style"),a.proxy(l.onOpen,d)(),a.proxy(l.onChange,d)()}))},close:function(b){var c=u.eq(b),d=c.next(v);k.debug("Closing accordion content",d),c.removeClass(m.active),d.removeClass(m.active).show().stop().children().animate({opacity:0},l.duration,k.event.resetStyle).end().slideUp(l.duration,l.easing,function(){d.attr("style","").removeAttr("style"),a.proxy(l.onClose,d)(),a.proxy(l.onChange,d)()})},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,l,b);else{if(c===d)return l[b];l[b]=c}},internal:function(b,c){return k.debug("Changing internal",b,c),c===d?k[b]:(a.isPlainObject(b)?a.extend(!0,k,b):k[b]=c,void 0)},debug:function(){l.debug&&(l.performance?k.performance.log(arguments):(k.debug=Function.prototype.bind.call(console.info,console,l.name+":"),k.debug.apply(console,arguments)))},verbose:function(){l.verbose&&l.debug&&(l.performance?k.performance.log(arguments):(k.verbose=Function.prototype.bind.call(console.info,console,l.name+":"),k.verbose.apply(console,arguments)))},error:function(){k.error=Function.prototype.bind.call(console.error,console,l.name+":"),k.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;l.performance&&(b=(new Date).getTime(),d=f||b,c=b-d,f=b,g.push({Element:w,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(k.performance.timer),k.performance.timer=setTimeout(k.performance.display,100)},display:function(){var b=l.name+":",c=0;f=!1,clearTimeout(k.performance.timer),a.each(g,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",s&&(b+=" '"+s+"'"),(console.group!==d||console.table!==d)&&g.length>0&&(console.groupCollapsed(b),console.table?console.table(g):a.each(g,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),g=[]}},invoke:function(b,e,f){var g,h,i;return e=e||j,f=w||f,"string"==typeof b&&x!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(x[f])&&c!=g)x=x[f];else{if(x[f]!==d)return h=x[f],!1;if(!a.isPlainObject(x[e])||c==g)return x[e]!==d?(h=x[e],!1):(k.error(p.method,b),!1);x=x[e]}})),a.isFunction(h)?i=h.apply(f,e):h!==d&&(i=h),a.isArray(c)?c.push(i):c!==d?c=[c,i]:i!==d&&(c=i),h}},i?(x===d&&k.initialize(),k.invoke(h)):(x!==d&&k.destroy(),k.initialize())}),c!==d?c:this},a.fn.accordion.settings={name:"Accordion",namespace:"accordion",debug:!0,verbose:!0,performance:!0,exclusive:!0,collapsible:!0,duration:500,easing:"easeInOutQuint",onOpen:function(){},onClose:function(){},onChange:function(){},error:{method:"The method you called is not defined"},className:{active:"active"},selector:{title:".title",content:".content"}},a.extend(a.easing,{easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c}})}(jQuery,window,document),function(a,b,c,d){a.api=a.fn.api=function(c){var e,f,g=a.extend(!0,{},a.api.settings,c),h="function"!=typeof this?this:a("<div/>"),i=g.stateContext?a(g.stateContext):a(h),j="object"==typeof this?a(h):i,k=this,l=(new Date).getTime(),m=[],n=j.selector||"",o=g.namespace+"-module",p=g.className,q=g.metadata,r=g.error,s=j.data(o),t=arguments[0],u=s!==d&&"string"==typeof t,v=[].slice.call(arguments,1);return e={initialize:function(){var c,f,h,k,l,m,n=(new Date).getTime(),o={},s={};return g.serializeForm&&a(this).toJSON()!==d&&(o=e.get.formData(),e.debug("Adding form data to API Request",o),a.extend(!0,g.data,o)),c=a.proxy(g.beforeSend,j)(g),c===d||c?(k=e.get.url(e.get.templateURL()))?(h=a.Deferred().always(function(){g.stateContext&&i.removeClass(p.loading),a.proxy(g.complete,j)()}).done(function(b){e.debug("API request successful"),"json"==g.dataType?b.error!==d?a.proxy(g.failure,i)(b.error,g,j):a.isArray(b.errors)?a.proxy(g.failure,i)(b.errors[0],g,j):a.proxy(g.success,i)(b,g,j):a.proxy(g.success,i)(b,g,j)}).fail(function(b,c,f){var h,j=g.error[c]!==d?g.error[c]:f;if(b!==d)if(b.readyState!==d&&4==b.readyState){if(200!=b.status&&f!==d&&""!==f)e.error(k.statusMessage+f);else if("error"==c&&"json"==g.dataType)try{h=a.parseJSON(b.responseText),h&&h.error!==d&&(j=h.error)}catch(k){e.error(k.JSONParse)}i.removeClass(p.loading).addClass(p.error),g.errorLength>0&&setTimeout(function(){i.removeClass(p.error)},g.errorLength),e.debug("API Request error:",j),a.proxy(g.failure,i)(j,g,this)}else e.debug("Request Aborted (Most likely caused by page change)")}),a.extend(!0,s,g,{success:function(){},failure:function(){},complete:function(){},type:g.method||g.type,data:l,url:k,beforeSend:g.beforeXHR}),g.stateContext&&i.addClass(p.loading),g.progress&&(e.verbose("Adding progress events"),a.extend(!0,s,{xhr:function(){var c=new b.XMLHttpRequest;return c.upload.addEventListener("progress",function(b){var c;b.lengthComputable&&(c=Math.round(b.loaded/b.total*1e4)/100+"%",a.proxy(g.progress,i)(c,b))},!1),c.addEventListener("progress",function(b){var c;b.lengthComputable&&(c=Math.round(b.loaded/b.total*1e4)/100+"%",a.proxy(g.progress,i)(c,b))},!1),c}})),e.verbose("Creating AJAX request with settings: ",s),m=a.ajax(s).always(function(){f=g.loadingLength-((new Date).getTime()-n),g.loadingDelay=0>f?0:f}).done(function(a){var b=this;setTimeout(function(){h.resolveWith(b,[a])},g.loadingDelay)}).fail(function(a,b,c){var d=this;"abort"!=b?setTimeout(function(){h.rejectWith(d,[a,b,c])},g.loadingDelay):i.removeClass(p.error).removeClass(p.loading)}),g.stateContext&&j.data(q.promise,h).data(q.xhr,m),void 0):(e.error(r.missingURL),e.reset(),void 0):(e.error(r.beforeSend),e.reset(),void 0)},get:{formData:function(){return j.closest("form").toJSON()},templateURL:function(){var a,b=j.data(g.metadata.action)||g.action||!1;return b&&(e.debug("Creating url for: ",b),g.api[b]!==d?a=g.api[b]:e.error(r.missingAction)),g.url&&(a=g.url,e.debug("Getting url",a)),a},url:function(b,c){var f;return b&&(f=b.match(g.regExpTemplate),c=c||g.urlData,f&&(e.debug("Looking for URL variables",f),a.each(f,function(g,h){var i=h.substr(2,h.length-3),k=a.isPlainObject(c)&&c[i]!==d?c[i]:j.data(i)!==d?j.data(i):c[i];if(e.verbose("Looking for variable",i,j,j.data(i),c[i]),k===!1)e.debug("Removing variable from URL",f),b=b.replace("/"+h,"");else{if(k===d||!k)return e.error(r.missingParameter+i),b=!1,!1;b=b.replace(h,k)}}))),b}},reset:function(){j.data(q.promise,!1).data(q.xhr,!1),i.removeClass(p.error).removeClass(p.loading)},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,g,b);else{if(c===d)return g[b];g[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,e,b);else{if(c===d)return e[b];e[b]=c}},debug:function(){g.debug&&(g.performance?e.performance.log(arguments):(e.debug=Function.prototype.bind.call(console.info,console,g.name+":"),e.debug.apply(console,arguments)))},verbose:function(){g.verbose&&g.debug&&(g.performance?e.performance.log(arguments):(e.verbose=Function.prototype.bind.call(console.info,console,g.name+":"),e.verbose.apply(console,arguments)))},error:function(){e.error=Function.prototype.bind.call(console.error,console,g.name+":"),e.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;g.performance&&(b=(new Date).getTime(),d=l||b,c=b-d,l=b,m.push({Element:k,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(e.performance.timer),e.performance.timer=setTimeout(e.performance.display,100)},display:function(){var b=g.name+":",c=0;l=!1,clearTimeout(e.performance.timer),a.each(m,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",n&&(b+=" '"+n+"'"),(console.group!==d||console.table!==d)&&m.length>0&&(console.groupCollapsed(b),console.table?console.table(m):a.each(m,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),m=[]}},invoke:function(b,c,g){var h,i,j;return c=c||v,g=k||g,"string"==typeof b&&s!==d&&(b=b.split(/[\. ]/),h=b.length-1,a.each(b,function(c,f){var g=c!=h?f+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(s[f])&&c!=h)s=s[f];else{if(!a.isPlainObject(s[g])||c==h)return s[f]!==d?(i=s[f],!1):s[g]!==d?(i=s[g],!1):(e.error(r.method,b),!1);s=s[g]}})),a.isFunction(i)?j=i.apply(g,c):i!==d&&(j=i),a.isArray(f)?f.push(j):f!==d?f=[f,j]:j!==d&&(f=j),i}},u?(s===d&&e.initialize(),e.invoke(t)):(s!==d&&e.destroy(),e.initialize()),f!==d?f:this},a.fn.apiButton=function(b){return a(this).each(function(){var c,d=a(this),e=a(this).selector||"",f=a.isFunction(b)?a.extend(!0,{},a.api.settings,a.fn.apiButton.settings,{stateContext:this,success:b}):a.extend(!0,{},a.api.settings,a.fn.apiButton.settings,{stateContext:this},b);c={initialize:function(){f.context&&""!==e?a(f.context).on(e,"click."+f.namespace,c.click):d.on("click."+f.namespace,c.click)},click:function(){f.filter&&0!==a(this).filter(f.filter).size()||a.proxy(a.api,this)(f)}},c.initialize()}),this},a.api.settings={name:"API",namespace:"api",debug:!0,verbose:!0,performance:!0,api:{},beforeSend:function(a){return a},beforeXHR:function(){},success:function(){},complete:function(){},failure:function(){},progress:!1,error:{missingAction:"API action used but no url was defined",missingURL:"URL not specified for the API action",missingParameter:"Missing an essential URL parameter: ",timeout:"Your request timed out",error:"There was an error with your request",parseError:"There was an error parsing your request",JSONParse:"JSON could not be parsed during error handling",statusMessage:"Server gave an error: ",beforeSend:"The before send function has aborted the request",exitConditions:"API Request Aborted. Exit conditions met"},className:{loading:"loading",error:"error"},metadata:{action:"action",promise:"promise",xhr:"xhr"},regExpTemplate:/\{\$([A-z]+)\}/g,action:!1,url:!1,urlData:!1,serializeForm:!1,stateContext:!1,method:"get",data:{},dataType:"json",cache:!0,loadingLength:200,errorLength:2e3},a.fn.apiButton.settings={filter:".disabled, .loading",context:!1,stateContext:!1}}(jQuery,window,document),function(a,b,c,d){a.fn.colorize=function(b){var c=a.extend(!0,{},a.fn.colorize.settings,b),e=arguments||!1;return a(this).each(function(b){var f,g,h,i,j,k,l,m,n=a(this),o=a("<canvas />")[0],p=a("<canvas />")[0],q=a("<canvas />")[0],r=new Image,s=c.colors,t=(c.paths,c.namespace),u=c.error,v=n.data("module-"+t);return m={checkPreconditions:function(){return m.debug("Checking pre-conditions"),!a.isPlainObject(s)||a.isEmptyObject(s)?(m.error(u.undefinedColors),!1):!0},async:function(a){c.async?setTimeout(a,0):a()},getMetadata:function(){m.debug("Grabbing metadata"),i=n.data("image")||c.image||d,j=n.data("name")||c.name||b,k=c.width||n.width(),l=c.height||n.height(),(0===k||0===l)&&m.error(u.undefinedSize)},initialize:function(){m.debug("Initializing with colors",s),m.checkPreconditions()&&m.async(function(){m.getMetadata(),m.canvas.create(),m.draw.image(function(){m.draw.colors(),m.canvas.merge()}),n.data("module-"+t,m)})},redraw:function(){m.debug("Redrawing image"),m.async(function(){m.canvas.clear(),m.draw.colors(),m.canvas.merge()})},change:{color:function(a,b){return m.debug("Changing color",a),s[a]===d?(m.error(u.missingColor),!1):(s[a]=b,m.redraw(),void 0)}},canvas:{create:function(){m.debug("Creating canvases"),o.width=k,o.height=l,p.width=k,p.height=l,q.width=k,q.height=l,f=o.getContext("2d"),g=p.getContext("2d"),h=q.getContext("2d"),n.append(o),f=n.children("canvas")[0].getContext("2d")},clear:function(){m.debug("Clearing canvas"),h.fillStyle="#FFFFFF",h.fillRect(0,0,k,l)},merge:function(){return a.isFunction(f.blendOnto)?(f.putImageData(g.getImageData(0,0,k,l),0,0),h.blendOnto(f,"multiply"),void 0):(m.error(u.missingPlugin),void 0)}},draw:{image:function(a){m.debug("Drawing image"),a=a||function(){},i?(r.src=i,r.onload=function(){g.drawImage(r,0,0),a()}):(m.error(u.noImage),a())},colors:function(){m.debug("Drawing color overlays",s),a.each(s,function(a,b){c.onDraw(h,j,a,b)})}},debug:function(a,b){c.debug&&(b!==d?console.info(c.name+": "+a,b):console.info(c.name+": "+a))},error:function(a){console.warn(c.name+": "+a)},invoke:function(b,e,f){var g;return f=f||Array.prototype.slice.call(arguments,2),"string"==typeof b&&v!==d&&(b=b.split("."),a.each(b,function(b,d){return a.isPlainObject(v[d])?(v=v[d],!0):a.isFunction(v[d])?(g=v[d],!0):(m.error(c.error.method),!1)})),a.isFunction(g)?g.apply(e,f):!1}},v!==d&&e?("invoke"==e[0]&&(e=Array.prototype.slice.call(e,1)),m.invoke(e[0],this,Array.prototype.slice.call(e,1))):(m.initialize(),void 0)}),this},a.fn.colorize.settings={name:"Image Colorizer",debug:!0,namespace:"colorize",onDraw:function(){},async:!0,colors:{},metadata:{image:"image",name:"name"},error:{noImage:"No tracing image specified",undefinedColors:"No default colors specified.",missingColor:"Attempted to change color that does not exist",missingPlugin:"Blend onto plug-in must be included",undefinedHeight:"The width or height of image canvas could not be automatically determined. Please specify a height."}}}(jQuery,window,document),function(a,b,c,d){a.fn.form=function(b,e){var f,g=a(this),h=a.extend(!0,{},a.fn.form.settings,e),i=a.extend({},a.fn.form.settings.defaults,b),j=h.namespace,k=h.metadata,l=h.selector,m=h.className,n=h.error,o="."+j,p="module-"+j,q=g.selector||"",r=(new Date).getTime(),s=[],t=arguments[0],u="string"==typeof t,v=[].slice.call(arguments,1);return g.each(function(){var b,e=a(this),j=a(this).find(l.field),w=a(this).find(l.group),x=a(this).find(l.message),y=(a(this).find(l.prompt),a(this).find(l.submit)),z=[],A=this,B=e.data(p);b={initialize:function(){b.verbose("Initializing form validation",e,i,h),h.keyboardShortcuts&&j.on("keydown"+o,b.event.field.keydown),e.on("submit"+o,b.validate.form),j.on("blur"+o,b.event.field.blur),y.on("click"+o,b.submit),j.on(b.get.changeEvent()+o,b.event.field.change),b.instantiate()},instantiate:function(){b.verbose("Storing instance of module",b),B=b,e.data(p,b)},destroy:function(){b.verbose("Destroying previous module",B),e.off(o).removeData(p)},refresh:function(){b.verbose("Refreshing selector cache"),j=e.find(l.field)},submit:function(){b.verbose("Submitting form",e),e.submit()},event:{field:{keydown:function(c){var d=a(this),e=c.which,f={enter:13,escape:27};return e==f.escape&&(b.verbose("Escape key pressed blurring field"),d.blur()),!c.ctrlKey&&e==f.enter&&d.is(l.input)?(b.debug("Enter key pressed, submitting form"),y.addClass(m.down),d.one("keyup"+o,b.event.field.keyup),c.preventDefault(),!1):void 0},keyup:function(){b.verbose("Doing keyboard shortcut form submit"),y.removeClass(m.down),b.submit()},blur:function(){var c=a(this),d=c.closest(w);d.hasClass(m.error)?(b.debug("Revalidating field",c,b.get.validation(c)),b.validate.field(b.get.validation(c))):("blur"==h.on||"change"==h.on)&&b.validate.field(b.get.validation(c))},change:function(){var c=a(this),d=c.closest(w);("change"==h.on||d.hasClass(m.error)&&h.revalidate)&&(clearTimeout(b.timer),b.timer=setTimeout(function(){b.debug("Revalidating field",c,b.get.validation(c)),b.validate.field(b.get.validation(c))},h.delay))}}},get:{changeEvent:function(){return c.createElement("input").oninput!==d?"input":c.createElement("input").onpropertychange!==d?"propertychange":"keyup"},field:function(c){return b.verbose("Finding field with identifier",c),j.filter("#"+c).size()>0?j.filter("#"+c):j.filter('[name="'+c+'"]').size()>0?j.filter('[name="'+c+'"]'):j.filter("[data-"+k.validate+'="'+c+'"]').size()>0?j.filter("[data-"+k.validate+'="'+c+'"]'):a("<input/>")},validation:function(c){var d;return a.each(i,function(a,e){b.get.field(e.identifier).get(0)==c.get(0)&&(d=e)}),d||!1}},has:{field:function(a){return b.verbose("Checking for existence of a field with identifier",a),j.filter("#"+a).size()>0?!0:j.filter('[name="'+a+'"]').size()>0?!0:j.filter("[data-"+k.validate+'="'+a+'"]').size()>0?!0:!1}},add:{prompt:function(c,f){var g=b.get.field(c.identifier),i=g.closest(w),j=i.find(l.prompt),k=0!==j.size();b.verbose("Adding inline error",c),i.addClass(m.error),h.inline&&(k||(j=h.templates.prompt(f),j.appendTo(i)),j.html(f[0]),k||(h.transition&&a.fn.transition!==d&&e.transition("is supported")?(b.verbose("Displaying error with css transition",h.transition),j.transition(h.transition+" in",h.duration)):(b.verbose("Displaying error with fallback javascript animation"),j.fadeIn(h.duration))))},errors:function(a){b.debug("Adding form error messages",a),x.html(h.templates.error(a))}},remove:{prompt:function(c){var f=b.get.field(c.identifier),g=f.closest(w),i=g.find(l.prompt);g.removeClass(m.error),h.inline&&i.is(":visible")&&(b.verbose("Removing prompt for field",c),h.transition&&a.fn.transition!==d&&e.transition("is supported")?i.transition(h.transition+" out",h.duration,function(){i.remove()}):i.fadeOut(h.duration,function(){i.remove()}))}},validate:{form:function(c){var d=!0;return z=[],a.each(i,function(a,c){b.validate.field(c)||(d=!1)}),d?(b.debug("Form has no validation errors, submitting"),e.removeClass(m.error).addClass(m.success),a.proxy(h.onSuccess,this)(c),void 0):(b.debug("Form has errors"),e.addClass(m.error),h.inline||b.add.errors(z),a.proxy(h.onFailure,this)(z))},field:function(c){var e=b.get.field(c.identifier),f=!0,g=[];return c.rules!==d&&a.each(c.rules,function(a,d){b.has.field(c.identifier)&&!b.validate.rule(c,d)&&(b.debug("Field is invalid",c.identifier,d.type),g.push(d.prompt),f=!1)}),f?(b.remove.prompt(c,g),a.proxy(h.onValid,e)(),!0):(z=z.concat(g),b.add.prompt(c,g),a.proxy(h.onInvalid,e)(g),!1)},rule:function(c,f){var g,i,j=b.get.field(c.identifier),k=f.type,l=j.val()+"",m=/\[(.*?)\]/i,n=m.exec(k),o=!0;return n!==d&&null!==n?(g=""+n[1],i=k.replace(n[0],""),o=a.proxy(h.rules[i],e)(l,g)):o=a.proxy(h.rules[k],j)(l),o}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,h,b);else{if(c===d)return h[b];h[b]=c}},internal:function(c,e){if(a.isPlainObject(c))a.extend(!0,b,c);else{if(e===d)return b[c];b[c]=e}},debug:function(){h.debug&&(h.performance?b.performance.log(arguments):(b.debug=Function.prototype.bind.call(console.info,console,h.name+":"),b.debug.apply(console,arguments)))},verbose:function(){h.verbose&&h.debug&&(h.performance?b.performance.log(arguments):(b.verbose=Function.prototype.bind.call(console.info,console,h.name+":"),b.verbose.apply(console,arguments)))},error:function(){b.error=Function.prototype.bind.call(console.error,console,h.name+":"),b.error.apply(console,arguments)},performance:{log:function(a){var c,d,e;h.performance&&(c=(new Date).getTime(),e=r||c,d=c-e,r=c,s.push({Element:A,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":d})),clearTimeout(b.performance.timer),b.performance.timer=setTimeout(b.performance.display,100)},display:function(){var c=h.name+":",e=0;r=!1,clearTimeout(b.performance.timer),a.each(s,function(a,b){e+=b["Execution Time"]}),c+=" "+e+"ms",q&&(c+=" '"+q+"'"),g.size()>1&&(c+=" ("+g.size()+")"),(console.group!==d||console.table!==d)&&s.length>0&&(console.groupCollapsed(c),console.table?console.table(s):a.each(s,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(c,e,g){var h,i,j;return e=e||v,g=A||g,"string"==typeof c&&B!==d&&(c=c.split(/[\. ]/),h=c.length-1,a.each(c,function(e,f){var g=e!=h?f+c[e+1].charAt(0).toUpperCase()+c[e+1].slice(1):c;if(a.isPlainObject(B[g])&&e!=h)B=B[g];else{if(B[g]!==d)return i=B[g],!1;if(!a.isPlainObject(B[f])||e==h)return B[f]!==d?(i=B[f],!1):(b.error(n.method,c),!1);B=B[f]}})),a.isFunction(i)?j=i.apply(g,e):i!==d&&(j=i),a.isArray(f)?f.push(j):f!==d?f=[f,j]:j!==d&&(f=j),i}},u?(B===d&&b.initialize(),b.invoke(t)):(B!==d&&b.destroy(),b.initialize())}),f!==d?f:this},a.fn.form.settings={name:"Form",namespace:"form",debug:!0,verbose:!0,performance:!0,keyboardShortcuts:!0,on:"submit",inline:!1,delay:200,revalidate:!0,transition:"scale",duration:150,onValid:function(){},onInvalid:function(){},onSuccess:function(){return!0},onFailure:function(){return!1},metadata:{validate:"validate"},selector:{message:".error.message",field:"input, textarea, select",group:".field",input:"input",prompt:".prompt",submit:".submit"},className:{error:"error",success:"success",down:"down",label:"ui label prompt"},error:{method:"The method you called is not defined."},templates:{error:function(b){var c='<ul class="list">';return a.each(b,function(a,b){c+="<li>"+b+"</li>"}),c+="</ul>",a(c)},prompt:function(b){return a("<div/>").addClass("ui red pointing prompt label").html(b[0])}},rules:{checked:function(){return a(this).filter(":checked").size()>0},empty:function(a){return!(a===d||""===a)},email:function(a){var b=new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?","i");return b.test(a)},length:function(a,b){return a!==d?a.length>=b:!1},not:function(a,b){return a!=b},contains:function(a,b){return b=b.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&"),-1!==a.search(b)},is:function(a,b){return a==b},maxLength:function(a,b){return a!==d?a.length<=b:!1},match:function(b,c){var e,f=a(this);return f.find("#"+c).size()>0?e=f.find("#"+c).val():f.find("[name="+c+"]").size()>0?e=f.find("[name="+c+"]").val():f.find('[data-validate="'+c+'"]').size()>0&&(e=f.find('[data-validate="'+c+'"]').val()),e!==d?b.toString()==e.toString():!1},url:function(a){var b=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;return b.test(a)}}}}(jQuery,window,document),function(a,b,c,d){a.fn.state=function(b){var c,e=a(this),f=a.extend(!0,{},a.fn.state.settings,b),g=e.selector||"",h=(new Date).getTime(),i=[],j=arguments[0],k="string"==typeof j,l=[].slice.call(arguments,1),m=f.error,n=f.metadata,o=f.className,p=f.namespace,q=f.states,r=f.text,s="."+p,t=p+"-module";return e.each(function(){var p,u=a(this),v=this,w=u.data(t);p={initialize:function(){p.verbose("Initializing module"),f.automatic&&p.add.defaults(),f.context&&""!==g?(p.allows("hover")&&a(v,f.context).on(g,"mouseenter"+s,p.enable.hover).on(g,"mouseleave"+s,p.disable.hover),p.allows("down")&&a(v,f.context).on(g,"mousedown"+s,p.enable.down).on(g,"mouseup"+s,p.disable.down),p.allows("focus")&&a(v,f.context).on(g,"focus"+s,p.enable.focus).on(g,"blur"+s,p.disable.focus),a(f.context).on(g,"mouseenter"+s,p.change.text).on(g,"mouseleave"+s,p.reset.text).on(g,"click"+s,p.toggle.state)):(p.allows("hover")&&u.on("mouseenter"+s,p.enable.hover).on("mouseleave"+s,p.disable.hover),p.allows("down")&&u.on("mousedown"+s,p.enable.down).on("mouseup"+s,p.disable.down),p.allows("focus")&&u.on("focus"+s,p.enable.focus).on("blur"+s,p.disable.focus),u.on("mouseenter"+s,p.change.text).on("mouseleave"+s,p.reset.text).on("click"+s,p.toggle.state)),p.instantiate()},instantiate:function(){p.verbose("Storing instance of module",p),w=p,u.data(t,p)},destroy:function(){p.verbose("Destroying previous module",w),u.off(s).removeData(t)},refresh:function(){p.verbose("Refreshing selector cache"),u=a(v)},add:{defaults:function(){var c=b&&a.isPlainObject(b.states)?b.states:{};a.each(f.defaults,function(b,e){p.is[b]!==d&&p.is[b]()&&(p.verbose("Adding default states",b,v),a.extend(f.states,e,c))})}},is:{active:function(){return u.hasClass(o.active)},loading:function(){return u.hasClass(o.loading)},inactive:function(){return!u.hasClass(o.active)},enabled:function(){return!u.is(f.filter.active)},disabled:function(){return u.is(f.filter.active)},textEnabled:function(){return!u.is(f.filter.text)},button:function(){return u.is(".button:not(a, .submit)")},input:function(){return u.is("input")}},allow:function(a){p.debug("Now allowing state",a),q[a]=!0},disallow:function(a){p.debug("No longer allowing",a),q[a]=!1},allows:function(a){return q[a]||!1},enable:{state:function(a){p.allows(a)&&u.addClass(o[a])},focus:function(){u.addClass(o.focus)},hover:function(){u.addClass(o.hover)},down:function(){u.addClass(o.down)}},disable:{state:function(a){p.allows(a)&&u.removeClass(o[a])},focus:function(){u.removeClass(o.focus)},hover:function(){u.removeClass(o.hover)},down:function(){u.removeClass(o.down)}},toggle:{state:function(){var a=u.data(n.promise);p.allows("active")&&p.is.enabled()&&(p.refresh(),a!==d?p.listenTo(a):p.change.state())}},listenTo:function(b){p.debug("API request detected, waiting for state signal",b),b?(r.loading&&p.update.text(r.loading),a.when(b).then(function(){"resolved"==b.state()?(p.debug("API request succeeded"),f.activateTest=function(){return!0},f.deactivateTest=function(){return!0}):(p.debug("API request failed"),f.activateTest=function(){return!1},f.deactivateTest=function(){return!1}),p.change.state()})):(f.activateTest=function(){return!1},f.deactivateTest=function(){return!1})},change:{state:function(){p.debug("Determining state change direction"),p.is.inactive()?p.activate():p.deactivate(),f.sync&&p.sync(),a.proxy(f.onChange,v)()},text:function(){p.is.textEnabled()&&(p.is.active()?r.hover?(p.verbose("Changing text to hover text",r.hover),p.update.text(r.hover)):r.disable&&(p.verbose("Changing text to disable text",r.disable),p.update.text(r.disable)):r.hover?(p.verbose("Changing text to hover text",r.disable),p.update.text(r.hover)):r.enable&&(p.verbose("Changing text to enable text",r.enable),p.update.text(r.enable)))}},activate:function(){a.proxy(f.activateTest,v)()&&(p.debug("Setting state to active"),u.addClass(o.active),p.update.text(r.active)),a.proxy(f.onActivate,v)()},deactivate:function(){a.proxy(f.deactivateTest,v)()&&(p.debug("Setting state to inactive"),u.removeClass(o.active),p.update.text(r.inactive)),a.proxy(f.onDeactivate,v)()},sync:function(){p.verbose("Syncing other buttons to current state"),p.is.active()?e.not(u).state("activate"):e.not(u).state("deactivate")},get:{text:function(){return f.selector.text?u.find(f.selector.text).text():u.html()},textFor:function(a){return r[a]||!1}},flash:{text:function(a,b){var c=p.get.text();p.debug("Flashing text message",a,b),a=a||f.text.flash,b=b||f.flashDuration,p.update.text(a),setTimeout(function(){p.update.text(c)},b)}},reset:{text:function(){var a=r.active||u.data(n.storedText),b=r.inactive||u.data(n.storedText);p.is.textEnabled()&&(p.is.active()&&a?(p.verbose("Resetting active text",a),p.update.text(a)):b&&(p.verbose("Resetting inactive text",a),p.update.text(b)))}},update:{text:function(a){var b=p.get.text();a&&a!==b?(p.debug("Updating text",a),f.selector.text?u.data(n.storedText,a).find(f.selector.text).text(a):u.data(n.storedText,a).html(a)):p.debug("Text is already sane, ignoring update",a)}},setting:function(b,c){return p.debug("Changing setting",b,c),c===d?f[b]:(a.isPlainObject(b)?a.extend(!0,f,b):f[b]=c,void 0)},internal:function(b,c){return p.debug("Changing internal",b,c),c===d?p[b]:(a.isPlainObject(b)?a.extend(!0,p,b):p[b]=c,void 0)},debug:function(){f.debug&&(f.performance?p.performance.log(arguments):(p.debug=Function.prototype.bind.call(console.info,console,f.name+":"),p.debug.apply(console,arguments)))},verbose:function(){f.verbose&&f.debug&&(f.performance?p.performance.log(arguments):(p.verbose=Function.prototype.bind.call(console.info,console,f.name+":"),p.verbose.apply(console,arguments)))},error:function(){p.error=Function.prototype.bind.call(console.error,console,f.name+":"),p.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;f.performance&&(b=(new Date).getTime(),d=h||b,c=b-d,h=b,i.push({Element:v,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(p.performance.timer),p.performance.timer=setTimeout(p.performance.display,100)},display:function(){var b=f.name+":",c=0;h=!1,clearTimeout(p.performance.timer),a.each(i,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",g&&(b+=" '"+g+"'"),e.size()>1&&(b+=" ("+e.size()+")"),(console.group!==d||console.table!==d)&&i.length>0&&(console.groupCollapsed(b),console.table?console.table(i):a.each(i,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),i=[]}},invoke:function(b,e,f){var g,h,i;return e=e||l,f=v||f,"string"==typeof b&&w!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(w[f])&&c!=g)w=w[f];else{if(w[f]!==d)return h=w[f],!1;if(!a.isPlainObject(w[e])||c==g)return w[e]!==d?(h=w[e],!1):(p.error(m.method,b),!1);w=w[e]}})),a.isFunction(h)?i=h.apply(f,e):h!==d&&(i=h),a.isArray(c)?c.push(i):c!==d?c=[c,i]:i!==d&&(c=i),h}},k?(w===d&&p.initialize(),p.invoke(j)):(w!==d&&p.destroy(),p.initialize())}),c!==d?c:this},a.fn.state.settings={name:"State",debug:!0,verbose:!0,namespace:"state",performance:!0,onActivate:function(){},onDeactivate:function(){},onChange:function(){},activateTest:function(){return!0},deactivateTest:function(){return!0},automatic:!0,sync:!1,flashDuration:3e3,filter:{text:".loading, .disabled",active:".disabled"},context:!1,error:{method:"The method you called is not defined."},metadata:{promise:"promise",storedText:"stored-text"},className:{focus:"focus",hover:"hover",down:"down",active:"active",loading:"loading"},selector:{text:!1},defaults:{input:{hover:!0,focus:!0,down:!0,loading:!1,active:!1},button:{hover:!0,focus:!1,down:!0,active:!0,loading:!0}},states:{hover:!0,focus:!0,down:!0,loading:!1,active:!1},text:{flash:!1,hover:!1,active:!1,inactive:!1,enable:!1,disable:!1}}}(jQuery,window,document),function(a,b,c,d){a.fn.chatroom=function(b){var c,e=a(this),f=e.selector||"",g=(new Date).getTime(),h=[],i=arguments[0],j="string"==typeof i,k=[].slice.call(arguments,1);return a(this).each(function(){var c,e,l,m,n,o,p,q=a.extend(!0,{},a.fn.chatroom.settings,b),r=q.className,s=q.namespace,t=q.selector,u=q.error,v=a(this),w=v.find(t.expandButton),x=v.find(t.userListButton),y=v.find(t.userList),z=(v.find(t.room),v.find(t.userCount)),A=v.find(t.log),B=(v.find(t.message),v.find(t.messageInput)),C=v.find(t.messageButton),D=v.data("module"),E=this,F="",G={};p={width:{log:A.width(),userList:y.outerWidth()},initialize:function(){return Pusher===d&&p.error(u.pusher),q.key===d||q.channelName===d?(p.error(u.key),!1):q.endpoint.message||q.endpoint.authentication?(o=new Pusher(q.key),Pusher.channel_auth_endpoint=q.endpoint.authentication,c=o.subscribe(q.channelName),c.bind("pusher:subscription_succeeded",p.user.list.create),c.bind("pusher:subscription_error",p.error),c.bind("pusher:member_added",p.user.joined),c.bind("pusher:member_removed",p.user.left),c.bind("update_messages",p.message.receive),a.each(q.customEvents,function(a,b){c.bind(a,b)}),x.on("click."+s,p.event.toggleUserList),w.on("click."+s,p.event.toggleExpand),B.on("keydown."+s,p.event.input.keydown).on("keyup."+s,p.event.input.keyup),C.on("mouseenter."+s,p.event.hover).on("mouseleave."+s,p.event.hover).on("click."+s,p.event.submit),A.animate({scrollTop:A.prop("scrollHeight")},400),v.data("module",p).addClass(r.loading),void 0):(p.error(u.endpoint),!1)
},refresh:function(){x.removeClass(r.active),p.width={log:A.width(),userList:y.outerWidth()},x.hasClass(r.active)&&p.user.list.hide(),v.data("module",p)},user:{updateCount:function(){q.userCount&&(G=v.data("users"),m=0,a.each(G,function(){m++}),z.html(q.templates.userCount(m)))},joined:function(b){G=v.data("users"),"anonymous"!=b.id&&G[b.id]===d&&(G[b.id]=b.info,q.randomColor&&b.info.color===d&&(b.info.color=q.templates.color(b.id)),F=q.templates.userList(b.info),b.info.isAdmin?a(F).prependTo(y):a(F).appendTo(y),q.partingMessages&&(A.append(q.templates.joined(b.info)),p.message.scroll.test()),p.user.updateCount())},left:function(a){G=v.data("users"),a!==d&&"anonymous"!==a.id&&(delete G[a.id],v.data("users",G),y.find("[data-id="+a.id+"]").remove(),q.partingMessages&&(A.append(q.templates.left(a.info)),p.message.scroll.test()),p.user.updateCount())},list:{create:function(b){G={},b.each(function(a){"anonymous"!==a.id&&"undefined"!==a.id&&(q.randomColor&&a.info.color===d&&(a.info.color=q.templates.color(a.id)),F=a.info.isAdmin?q.templates.userList(a.info)+F:F+q.templates.userList(a.info),G[a.id]=a.info)}),v.data("users",G).data("user",G[b.me.id]).removeClass(r.loading),y.html(F),p.user.updateCount(),a.proxy(q.onJoin,y.children())()},show:function(){A.animate({width:p.width.log-p.width.userList},{duration:q.speed,easing:q.easing,complete:p.message.scroll.move})},hide:function(){A.stop().animate({width:p.width.log},{duration:q.speed,easing:q.easing,complete:p.message.scroll.move})}}},message:{scroll:{test:function(){n=A.prop("scrollHeight")-A.height(),Math.abs(A.scrollTop()-n)<q.scrollArea&&p.message.scroll.move()},move:function(){n=A.prop("scrollHeight")-A.height(),A.scrollTop(n)}},send:function(b){p.utils.emptyString(b)||a.api({url:q.endpoint.message,method:"POST",data:{message:{content:b,timestamp:(new Date).getTime()}}})},receive:function(a){l=a.data,G=v.data("users"),e=v.data("user"),G[l.userID]!==d&&(e===d||e.id!=l.userID)&&(l.user=G[l.userID],p.message.display(l))},display:function(b){A.append(q.templates.message(b)),p.message.scroll.test(),a.proxy(q.onMessage,A.children().last())()}},expand:function(){v.addClass(r.expand),a.proxy(q.onExpand,v)(),p.refresh()},contract:function(){v.removeClass(r.expand),a.proxy(q.onContract,v)(),p.refresh()},event:{input:{keydown:function(a){13==a.which&&C.addClass(r.down)},keyup:function(a){13==a.which&&(C.removeClass(r.down),p.event.submit())}},submit:function(){var a=B.val(),b=v.data("user");b===d||p.utils.emptyString(a)||(p.message.send(a),p.message.display({user:b,text:a}),p.message.scroll.move(),B.val(""))},toggleExpand:function(){v.hasClass(r.expand)?(w.removeClass(r.active),p.contract()):(w.addClass(r.active),p.expand())},toggleUserList:function(){A.is(":animated")||(x.hasClass(r.active)?(x.removeClass("active"),p.user.list.hide()):(x.addClass(r.active),p.user.list.show()))}},utils:{emptyString:function(a){return"string"==typeof a?-1==a.search(/\S/):!1}},setting:function(b,c){return c===d?q[b]:(a.isPlainObject(b)?a.extend(!0,q,b):q[b]=c,void 0)},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,p,b);else{if(c===d)return p[b];p[b]=c}},debug:function(){q.debug&&(q.performance?p.performance.log(arguments):(p.debug=Function.prototype.bind.call(console.info,console,q.name+":"),p.debug.apply(console,arguments)))},verbose:function(){q.verbose&&q.debug&&(q.performance?p.performance.log(arguments):(p.verbose=Function.prototype.bind.call(console.info,console,q.name+":"),p.verbose.apply(console,arguments)))},error:function(){p.error=Function.prototype.bind.call(console.error,console,q.name+":"),p.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;q.performance&&(b=(new Date).getTime(),d=g||b,c=b-d,g=b,h.push({Element:E,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(p.performance.timer),p.performance.timer=setTimeout(p.performance.display,100)},display:function(){var b=q.name+":",c=0;g=!1,clearTimeout(p.performance.timer),a.each(h,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",f&&(b+=" '"+f+"'"),(console.group!==d||console.table!==d)&&h.length>0&&(console.groupCollapsed(b),console.table?console.table(h):a.each(h,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),h=[]}},invoke:function(b,c,e){var f,g;return c=c||k,e=E||e,"string"==typeof b&&D!==d&&(b=b.split(/[\. ]/),f=b.length-1,a.each(b,function(c,e){a.isPlainObject(D[e])&&c!=f?D=D[e]:D[e]!==d?g=D[e]:p.error(u.method,b)})),a.isFunction(g)?g.apply(e,c):g||!1}},j?(D===d&&p.initialize(),p.invoke(i)):(D!==d&&p.destroy(),p.initialize())}),c?c:this},a.fn.chatroom.settings={name:"Chat",debug:!1,namespace:"chat",channel:"present-chat",onJoin:function(){},onMessage:function(){},onExpand:function(){},onContract:function(){},customEvents:{},partingMessages:!1,userCount:!0,randomColor:!0,speed:300,easing:"easeOutQuint",scrollArea:9999,endpoint:{message:!1,authentication:!1},error:{method:"The method you called is not defined",endpoint:"Please define a message and authentication endpoint.",key:"You must specify a pusher key and channel.",pusher:"You must include the Pusher library."},className:{expand:"expand",active:"active",hover:"hover",down:"down",loading:"loading"},selector:{userCount:".actions .message",userListButton:".actions .list.button",expandButton:".actions .expand.button",room:".room",userList:".room .list",log:".room .log",message:".room .log .message",author:".room log .message .author",messageInput:".talk input",messageButton:".talk .send.button"},templates:{userCount:function(a){return a+" users in chat"},color:function(){var a=["#000000","#333333","#666666","#999999","#CC9999","#CC6666","#CC3333","#993333","#663333","#CC6633","#CC9966","#CC9933","#999966","#CCCC66","#99CC66","#669933","#669966","#33A3CC","#336633","#33CCCC","#339999","#336666","#336699","#6666CC","#9966CC","#333399","#663366","#996699","#993366","#CC6699"];return a[Math.floor(Math.random()*a.length)]},message:function(a){var b="";return a.user.isAdmin?(a.user.color="#55356A",b+='<div class="admin message">',b+='<span class="quirky ui flag team"></span>'):b+='<div class="message">',b+="<p>",b+=a.user.color!==d?'<span class="author" style="color: '+a.user.color+';">'+a.user.name+"</span>: ":'<span class="author">'+a.user.name+"</span>: ",b+=""+a.text+" </p></div>"},joined:function(a){return typeof a.name!==d?'<div class="status">'+a.name+" has joined the chat.</div>":!1},left:function(a){return typeof a.name!==d?'<div class="status">'+a.name+" has left the chat.</div>":!1},userList:function(a){var b="";return a.isAdmin&&(a.color="#55356A"),b+='<div class="user" data-id="'+a.id+'"> <div class="image">   <img src="'+a.avatarURL+'"> </div>',b+=a.color!==d?' <p><a href="/users/'+a.id+'" target="_blank" style="color: '+a.color+';">'+a.name+"</a></p>":' <p><a href="/users/'+a.id+'" target="_blank">'+a.name+"</a></p>",b+="</div>"}}}}(jQuery,window,document),function(a,b,c,d){a.fn.checkbox=function(b){var c,e=a(this),f=e.selector||"",g=(new Date).getTime(),h=[],i=arguments[0],j="string"==typeof i,k=[].slice.call(arguments,1);return e.each(function(){var e,l=a.extend(!0,{},a.fn.checkbox.settings,b),m=l.className,n=l.namespace,o=l.error,p="."+n,q="module-"+n,r=a(this),s=a(this).next(l.selector.label).first(),t=a(this).find(l.selector.input),u=r.selector||"",v=r.data(q),w=this;e={initialize:function(){e.verbose("Initializing checkbox",l),l.context&&""!==u?(e.verbose("Adding delegated events"),a(w,l.context).on(u,"click"+p,e.toggle).on(u+" + "+l.selector.label,"click"+p,e.toggle)):(r.on("click"+p,e.toggle).data(q,e),s.on("click"+p,e.toggle)),e.instantiate()},instantiate:function(){e.verbose("Storing instance of module",e),v=e,r.data(q,e)},destroy:function(){e.verbose("Destroying previous module"),r.off(p).removeData(q)},is:{radio:function(){return r.hasClass(m.radio)},enabled:function(){return t.prop("checked")!==d&&t.prop("checked")},disabled:function(){return!e.is.enabled()}},can:{disable:function(){return"boolean"==typeof l.required?l.required:!e.is.radio()}},enable:function(){e.debug("Enabling checkbox",t),t.prop("checked",!0),a.proxy(l.onChange,t.get())(),a.proxy(l.onEnable,t.get())()},disable:function(){e.debug("Disabling checkbox"),t.prop("checked",!1),a.proxy(l.onChange,t.get())(),a.proxy(l.onDisable,t.get())()},toggle:function(){e.verbose("Determining new checkbox state"),e.is.disabled()?e.enable():e.is.enabled()&&e.can.disable()&&e.disable()},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,l,b);else{if(c===d)return l[b];l[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,e,b);else{if(c===d)return e[b];e[b]=c}},debug:function(){l.debug&&(l.performance?e.performance.log(arguments):(e.debug=Function.prototype.bind.call(console.info,console,l.name+":"),e.debug.apply(console,arguments)))},verbose:function(){l.verbose&&l.debug&&(l.performance?e.performance.log(arguments):(e.verbose=Function.prototype.bind.call(console.info,console,l.name+":"),e.verbose.apply(console,arguments)))},error:function(){e.error=Function.prototype.bind.call(console.error,console,l.name+":"),e.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;l.performance&&(b=(new Date).getTime(),d=g||b,c=b-d,g=b,h.push({Element:w,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(e.performance.timer),e.performance.timer=setTimeout(e.performance.display,100)},display:function(){var b=l.name+":",c=0;g=!1,clearTimeout(e.performance.timer),a.each(h,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",f&&(b+=" '"+f+"'"),(console.group!==d||console.table!==d)&&h.length>0&&(console.groupCollapsed(b),console.table?console.table(h):a.each(h,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),h=[]}},invoke:function(b,f,g){var h,i,j;return f=f||k,g=w||g,"string"==typeof b&&v!==d&&(b=b.split(/[\. ]/),h=b.length-1,a.each(b,function(c,f){var g=c!=h?f+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(v[g])&&c!=h)v=v[g];else{if(v[g]!==d)return i=v[g],!1;if(!a.isPlainObject(v[f])||c==h)return v[f]!==d?(i=v[f],!1):(e.error(o.method,b),!1);v=v[f]}})),a.isFunction(i)?j=i.apply(g,f):i!==d&&(j=i),a.isArray(c)?c.push(j):c!==d?c=[c,j]:j!==d&&(c=j),i}},j?(v===d&&e.initialize(),e.invoke(i)):(v!==d&&e.destroy(),e.initialize())}),c!==d?c:this},a.fn.checkbox.settings={name:"Checkbox",namespace:"checkbox",verbose:!0,debug:!0,performance:!0,context:!1,required:"auto",onChange:function(){},onEnable:function(){},onDisable:function(){},error:{method:"The method you called is not defined."},selector:{input:"input[type=checkbox], input[type=radio]",label:"label"},className:{radio:"radio"}}}(jQuery,window,document),function(a,b,c,d){a.fn.dimmer=function(b){var e,f=a(this),g=(new Date).getTime(),h=[],i=arguments[0],j="string"==typeof i,k=[].slice.call(arguments,1);return f.each(function(){var l,m,n,o=a.isPlainObject(b)?a.extend(!0,{},a.fn.dimmer.settings,b):a.extend({},a.fn.dimmer.settings),p=o.selector,q=o.namespace,r=o.className,s=o.error,t="."+q,u="module-"+q,v=f.selector||"",w="ontouchstart"in c.documentElement?"touchstart":"click",x=a(this),y=this,z=x.data(u);n={preinitialize:function(){n.is.dimmer()?(m=x.parent(),l=x):(m=x,l=n.has.dimmer()?m.children(p.dimmer).first():n.create())},initialize:function(){n.debug("Initializing dimmer",o),"hover"==o.on?m.on("mouseenter"+t,n.show).on("mouseleave"+t,n.hide):"click"==o.on&&m.on(w+t,n.toggle),n.is.page()&&(n.debug("Setting as a page dimmer",m),n.set.pageDimmer()),o.closable&&(n.verbose("Adding dimmer close event",l),l.on(w+t,n.event.click)),n.set.dimmable(),n.instantiate()},instantiate:function(){n.verbose("Storing instance of module",n),z=n,x.data(u,z)},destroy:function(){n.verbose("Destroying previous module",l),x.removeData(u),m.off(t),l.off(t)},event:{click:function(b){n.verbose("Determining if event occured on dimmer",b),(0===l.find(b.target).size()||a(b.target).is(p.content))&&(n.hide(),b.stopImmediatePropagation())}},addContent:function(b){var c=a(b).detach();n.debug("Add content to dimmer",c),c.parent()[0]!==l[0]&&l.append(c)},create:function(){return a(o.template.dimmer()).appendTo(m)},animate:{show:function(b){b=a.isFunction(b)?b:function(){},n.set.dimmed(),o.useCSS&&a.fn.transition!==d&&x.transition("is supported")?l.transition({animation:o.transition+" in",queue:!0,duration:n.get.duration(),complete:function(){n.set.active(),b()}}):(n.verbose("Showing dimmer animation with javascript"),l.stop().css({opacity:0,width:"100%",height:"100%"}).fadeTo(n.get.duration(),1,function(){l.removeAttr("style"),n.set.active(),b()}))},hide:function(b){b=a.isFunction(b)?b:function(){},o.useCSS&&a.fn.transition!==d&&x.transition("is supported")?(n.verbose("Hiding dimmer with css"),l.transition({animation:o.transition+" out",duration:n.get.duration(),queue:!0,complete:function(){n.remove.dimmed(),n.remove.active(),b()}})):(n.verbose("Hiding dimmer with javascript"),l.stop().fadeOut(n.get.duration(),function(){l.removeAttr("style"),n.remove.dimmed(),n.remove.active(),b()}))}},get:{dimmer:function(){return l},duration:function(){return"object"==typeof o.duration?n.is.active()?o.duration.hide:o.duration.show:o.duration}},has:{dimmer:function(){return x.children(p.dimmer).size()>0}},is:{active:function(){return l.hasClass(r.active)},animating:function(){return l.is(":animated")||l.hasClass(r.transition)},dimmer:function(){return x.is(p.dimmer)},dimmable:function(){return x.is(p.dimmable)},dimmed:function(){return m.hasClass(r.dimmed)},disabled:function(){return m.hasClass(r.disabled)},enabled:function(){return!n.is.disabled()},page:function(){return m.is("body")},pageDimmer:function(){return l.hasClass(r.pageDimmer)}},can:{show:function(){return!l.hasClass(r.disabled)}},set:{active:function(){n.set.dimmed(),l.removeClass(r.transition).addClass(r.active)},dimmable:function(){m.addClass(r.dimmable)},dimmed:function(){m.addClass(r.dimmed)},pageDimmer:function(){l.addClass(r.pageDimmer)},disabled:function(){l.addClass(r.disabled)}},remove:{active:function(){l.removeClass(r.transition).removeClass(r.active)},dimmed:function(){m.removeClass(r.dimmed)},disabled:function(){l.removeClass(r.disabled)}},show:function(b){b=a.isFunction(b)?b:function(){},n.debug("Showing dimmer",l,o),!n.is.active()&&n.is.enabled()?(n.animate.show(b),a.proxy(o.onShow,y)(),a.proxy(o.onChange,y)()):n.debug("Dimmer is already shown or disabled")},hide:function(b){b=a.isFunction(b)?b:function(){},n.is.active()||n.is.animating()?(n.debug("Hiding dimmer",l),n.animate.hide(b),a.proxy(o.onHide,y)(),a.proxy(o.onChange,y)()):n.debug("Dimmer is not visible")},toggle:function(){n.verbose("Toggling dimmer visibility",l),n.is.dimmed()?n.hide():n.show()},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,o,b);else{if(c===d)return o[b];o[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,n,b);else{if(c===d)return n[b];n[b]=c}},debug:function(){o.debug&&(o.performance?n.performance.log(arguments):(n.debug=Function.prototype.bind.call(console.info,console,o.name+":"),n.debug.apply(console,arguments)))},verbose:function(){o.verbose&&o.debug&&(o.performance?n.performance.log(arguments):(n.verbose=Function.prototype.bind.call(console.info,console,o.name+":"),n.verbose.apply(console,arguments)))},error:function(){n.error=Function.prototype.bind.call(console.error,console,o.name+":"),n.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;o.performance&&(b=(new Date).getTime(),d=g||b,c=b-d,g=b,h.push({Element:y,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(n.performance.timer),n.performance.timer=setTimeout(n.performance.display,100)},display:function(){var b=o.name+":",c=0;g=!1,clearTimeout(n.performance.timer),a.each(h,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",v&&(b+=" '"+v+"'"),f.size()>1&&(b+=" ("+f.size()+")"),(console.group!==d||console.table!==d)&&h.length>0&&(console.groupCollapsed(b),console.table?console.table(h):a.each(h,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),h=[]}},invoke:function(b,c,f){var g,h,i;return c=c||k,f=y||f,"string"==typeof b&&z!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(z[f])&&c!=g)z=z[f];else{if(!a.isPlainObject(z[e])||c==g)return z[e]!==d?(h=z[e],!1):z[f]!==d?(h=z[f],!1):(n.error(s.method,b),!1);z=z[e]}})),a.isFunction(h)?i=h.apply(f,c):h!==d&&(i=h),a.isArray(e)?e.push(i):e!==d?e=[e,i]:i!==d&&(e=i),h}},n.preinitialize(),j?(z===d&&n.initialize(),n.invoke(i)):(z!==d&&n.destroy(),n.initialize())}),e!==d?e:this},a.fn.dimmer.settings={name:"Dimmer",namespace:"dimmer",debug:!0,verbose:!0,performance:!0,transition:"fade",useCSS:!0,on:!1,closable:!0,duration:{show:500,hide:500},onChange:function(){},onShow:function(){},onHide:function(){},error:{method:"The method you called is not defined."},selector:{dimmable:".ui.dimmable",dimmer:".ui.dimmer",content:".ui.dimmer > .content, .ui.dimmer > .content > .center"},template:{dimmer:function(){return a("<div />").attr("class","ui dimmer")}},className:{active:"active",dimmable:"ui dimmable",dimmed:"dimmed",disabled:"disabled",pageDimmer:"page",hide:"hide",show:"show",transition:"transition"}}}(jQuery,window,document),function(a,b,c,d){a.fn.dropdown=function(b){var e,f=a(this),g=a(c),h=f.selector||"",i="ontouchstart"in c.documentElement,j=(new Date).getTime(),k=[],l=arguments[0],m="string"==typeof l,n=[].slice.call(arguments,1);return f.each(function(){var c,o=a.isPlainObject(b)?a.extend(!0,{},a.fn.dropdown.settings,b):a.extend({},a.fn.dropdown.settings),p=o.className,q=o.metadata,r=o.namespace,s=o.selector,t=o.error,u="."+r,v="module-"+r,w=a(this),x=w.find(s.item),y=w.find(s.text),z=w.find(s.input),A=w.children(s.menu),B=this,C=w.data(v);c={initialize:function(){c.debug("Initializing dropdown",o),c.set.selected(),i&&c.bind.touchEvents(),c.bind.mouseEvents(),c.instantiate()},instantiate:function(){c.verbose("Storing instance of dropdown",c),C=c,w.data(v,c)},destroy:function(){c.verbose("Destroying previous dropdown for",w),x.off(u),w.off(u).removeData(v)},bind:{touchEvents:function(){c.debug("Touch device detected binding touch events"),w.on("touchstart"+u,c.event.test.toggle),x.on("touchstart"+u,c.event.item.mouseenter).on("touchstart"+u,c.event.item.click)},mouseEvents:function(){c.verbose("Mouse detected binding mouse events"),"click"==o.on?w.on("click"+u,c.event.test.toggle):"hover"==o.on?w.on("mouseenter"+u,c.delay.show).on("mouseleave"+u,c.delay.hide):w.on(o.on+u,c.toggle),x.on("mouseenter"+u,c.event.item.mouseenter).on("mouseleave"+u,c.event.item.mouseleave).on("click"+u,c.event.item.click)},intent:function(){c.verbose("Binding hide intent event to document"),i&&g.on("touchstart"+u,c.event.test.touch).on("touchmove"+u,c.event.test.touch),g.on("click"+u,c.event.test.hide)}},unbind:{intent:function(){c.verbose("Removing hide intent event from document"),i&&g.off("touchstart"+u),g.off("click"+u)}},event:{test:{toggle:function(a){c.determine.intent(a,c.toggle)&&a.preventDefault()},touch:function(a){c.determine.intent(a,function(){"touchstart"==a.type?c.timer=setTimeout(c.hide,o.delay.touch):"touchmove"==a.type&&clearTimeout(c.timer)}),a.stopPropagation()},hide:function(a){c.determine.intent(a,c.hide)}},item:{mouseenter:function(b){var d=a(this).find(s.menu),e=a(this).siblings(s.item).children(s.menu);d.size()>0&&(clearTimeout(c.itemTimer),c.itemTimer=setTimeout(function(){c.animate.hide(!1,e),c.verbose("Showing sub-menu",d),c.animate.show(!1,d)},2*o.delay.show),b.preventDefault())},mouseleave:function(){var b=a(this).find(s.menu);b.size()>0&&(clearTimeout(c.itemTimer),c.itemTimer=setTimeout(function(){c.verbose("Hiding sub-menu",b),c.animate.hide(!1,b)},o.delay.hide))},click:function(){var b=a(this),e=b.data(q.text)!==d?b.data(q.text):b.text(),f=b.data(q.value)!==d?b.data(q.value):e.toLowerCase();0===b.find(s.menu).size()&&(c.determine.selectAction(e,f),a.proxy(o.onChange,B)(f,e))}},resetStyle:function(){a(this).removeAttr("style")}},determine:{selectAction:function(b,d){c.verbose("Determining action",o.action),a.isFunction(c.action[o.action])?(c.verbose("Triggering preset action",o.action,b,d),c.action[o.action](b,d)):a.isFunction(o.action)?(c.verbose("Triggering user action",o.action,b,d),o.action(b,d)):c.error(t.action,o.action)},intent:function(b,d){return c.debug("Determining whether event occurred in dropdown",b.target),d=d||function(){},0===a(b.target).closest(A).size()?(c.verbose("Triggering event",d),d(),!0):(c.verbose("Event occurred in dropdown, canceling callback"),!1)}},action:{nothing:function(){},hide:function(){c.hide()},activate:function(a,b){b=b!==d?b:a,c.set.selected(b),c.set.value(b),c.hide()},auto:function(a,b){b=b!==d?b:a,c.set.selected(b),c.set.value(b),c.hide()},changeText:function(a,b){b=b!==d?b:a,c.set.selected(b),c.hide()},updateForm:function(a,b){b=b!==d?b:a,c.set.selected(b),c.set.value(b),c.hide()}},get:{text:function(){return y.text()},value:function(){return z.size()>0?z.val():w.data(q.value)},item:function(b){var e;return b=b!==d?b:c.get.value()!==d?c.get.value():c.get.text(),b!==d?x.each(function(){var c=a(this),f=c.data(q.text)!==d?c.data(q.text):c.text(),g=c.data(q.value)!==d?c.data(q.value):f.toLowerCase();return g==b||f==b?(e=a(this),!1):void 0}):b=c.get.text(),e||!1}},set:{text:function(a){c.debug("Changing text",a,y),y.removeClass(p.placeholder),y.text(a)},value:function(a){c.debug("Adding selected value to hidden input",a,z),z.size()>0?z.val(a):w.data(q.value,a)},active:function(){w.addClass(p.active)},visible:function(){w.addClass(p.visible)},selected:function(a){var b,e=c.get.item(a);e&&(c.debug("Setting selected menu item to",e),b=e.data(q.text)!==d?e.data(q.text):e.text(),x.removeClass(p.active),e.addClass(p.active),c.set.text(b))}},remove:{active:function(){w.removeClass(p.active)},visible:function(){w.removeClass(p.visible)}},is:{selection:function(){return w.hasClass(p.selection)},animated:function(a){return a?a.is(":animated")||a.transition("is animating"):A.is(":animated")||A.transition("is animating")},visible:function(a){return a?a.is(":visible"):A.is(":visible")},hidden:function(a){return a?a.is(":not(:visible)"):A.is(":not(:visible)")}},can:{click:function(){return i||"click"==o.on},show:function(){return!w.hasClass(p.disabled)}},animate:{show:function(b,e){var f=e||A;b=b||function(){},c.is.hidden(f)&&(c.verbose("Doing menu show animation",f),"none"==o.transition?b():a.fn.transition!==d&&w.transition("is supported")?f.transition({animation:o.transition+" in",duration:o.duration,complete:b,queue:!1}):"slide down"==o.transition?f.hide().clearQueue().children().clearQueue().css("opacity",0).delay(50).animate({opacity:1},o.duration,"easeOutQuad",c.event.resetStyle).end().slideDown(100,"easeOutQuad",function(){a.proxy(c.event.resetStyle,this)(),b()}):"fade"==o.transition?f.hide().clearQueue().fadeIn(o.duration,function(){a.proxy(c.event.resetStyle,this)(),b()}):c.error(t.transition,o.transition))},hide:function(b,e){var f=e||A;b=b||function(){},c.is.visible(f)&&(c.verbose("Doing menu hide animation",f),a.fn.transition!==d&&w.transition("is supported")?f.transition({animation:o.transition+" out",duration:o.duration,complete:b,queue:!1}):"none"==o.transition?b():"slide down"==o.transition?f.show().clearQueue().children().clearQueue().css("opacity",1).animate({opacity:0},100,"easeOutQuad",c.event.resetStyle).end().delay(50).slideUp(100,"easeOutQuad",function(){a.proxy(c.event.resetStyle,this)(),b()}):"fade"==o.transition?f.show().clearQueue().fadeOut(150,function(){a.proxy(c.event.resetStyle,this)(),b()}):c.error(t.transition))}},show:function(){c.debug("Checking if dropdown can show"),c.is.hidden()&&(c.hideOthers(),c.set.active(),c.animate.show(function(){c.can.click()&&c.bind.intent(),c.set.visible()}),a.proxy(o.onShow,B)())},hide:function(){!c.is.animated()&&c.is.visible()&&(c.debug("Hiding dropdown"),c.can.click()&&c.unbind.intent(),c.remove.active(),c.animate.hide(c.remove.visible),a.proxy(o.onHide,B)())},delay:{show:function(){c.verbose("Delaying show event to ensure user intent"),clearTimeout(c.timer),c.timer=setTimeout(c.show,o.delay.show)},hide:function(){c.verbose("Delaying hide event to ensure user intent"),clearTimeout(c.timer),c.timer=setTimeout(c.hide,o.delay.hide)}},hideOthers:function(){c.verbose("Finding other dropdowns to hide"),f.not(w).has(s.menu+":visible").dropdown("hide")},toggle:function(){c.verbose("Toggling menu visibility"),c.is.hidden()?c.show():c.hide()},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,o,b);else{if(c===d)return o[b];o[b]=c}},internal:function(b,e){if(a.isPlainObject(b))a.extend(!0,c,b);else{if(e===d)return c[b];c[b]=e}},debug:function(){o.debug&&(o.performance?c.performance.log(arguments):(c.debug=Function.prototype.bind.call(console.info,console,o.name+":"),c.debug.apply(console,arguments)))},verbose:function(){o.verbose&&o.debug&&(o.performance?c.performance.log(arguments):(c.verbose=Function.prototype.bind.call(console.info,console,o.name+":"),c.verbose.apply(console,arguments)))},error:function(){c.error=Function.prototype.bind.call(console.error,console,o.name+":"),c.error.apply(console,arguments)},performance:{log:function(a){var b,d,e;o.performance&&(b=(new Date).getTime(),e=j||b,d=b-e,j=b,k.push({Element:B,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":d})),clearTimeout(c.performance.timer),c.performance.timer=setTimeout(c.performance.display,100)},display:function(){var b=o.name+":",e=0;j=!1,clearTimeout(c.performance.timer),a.each(k,function(a,b){e+=b["Execution Time"]}),b+=" "+e+"ms",h&&(b+=" '"+h+"'"),(console.group!==d||console.table!==d)&&k.length>0&&(console.groupCollapsed(b),console.table?console.table(k):a.each(k,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),k=[]}},invoke:function(b,f,g){var h,i,j;return f=f||n,g=B||g,"string"==typeof b&&C!==d&&(b=b.split(/[\. ]/),h=b.length-1,a.each(b,function(e,f){var g=e!=h?f+b[e+1].charAt(0).toUpperCase()+b[e+1].slice(1):b;if(a.isPlainObject(C[g])&&e!=h)C=C[g];else{if(C[g]!==d)return i=C[g],!1;if(!a.isPlainObject(C[f])||e==h)return C[f]!==d?(i=C[f],!1):(c.error(t.method,b),!1);C=C[f]}})),a.isFunction(i)?j=i.apply(g,f):i!==d&&(j=i),a.isArray(e)?e.push(j):e!==d?e=[e,j]:j!==d&&(e=j),i}},m?(C===d&&c.initialize(),c.invoke(l)):(C!==d&&c.destroy(),c.initialize())}),e?e:this},a.fn.dropdown.settings={name:"Dropdown",namespace:"dropdown",verbose:!0,debug:!0,performance:!0,on:"click",action:"activate",delay:{show:200,hide:300,touch:50},transition:"slide down",duration:250,onChange:function(){},onShow:function(){},onHide:function(){},error:{action:"You called a dropdown action that was not defined",method:"The method you called is not defined.",transition:"The requested transition was not found"},metadata:{text:"text",value:"value"},selector:{menu:".menu",item:".menu > .item",text:"> .text",input:'> input[type="hidden"]'},className:{active:"active",placeholder:"default",disabled:"disabled",visible:"visible",selection:"selection"}}}(jQuery,window,document),function(a,b,c,d){a.fn.modal=function(e){var f,g=a(this),h=a(b),i=a(c),j=(new Date).getTime(),k=[],l=arguments[0],m="string"==typeof l,n=[].slice.call(arguments,1);return g.each(function(){var o,p,q,r,s,t,u=a.isPlainObject(e)?a.extend(!0,{},a.fn.modal.settings,e):a.extend({},a.fn.modal.settings),v=u.selector,w=u.className,x=u.namespace,y=u.error,z="."+x,A="module-"+x,B=g.selector||"",C=a(this),D=a(u.context),E=C.find(v.close),F=this,G=C.data(A);t={initialize:function(){return t.verbose("Initializing dimmer",D),typeof a.fn.dimmer===d?(t.error(y.dimmer),void 0):(r=D.dimmer({closable:!1,useCSS:t.is.modernBrowser(),show:.9*u.duration,hide:1.1*u.duration}).dimmer("add content",C),s=r.dimmer("get dimmer"),p=C.siblings(v.modal),o=p.add(C),t.verbose("Attaching close events",E),E.on("click"+z,t.event.close),h.on("resize"+z,function(){t.event.debounce(t.refresh,50)}),t.instantiate(),void 0)},instantiate:function(){t.verbose("Storing instance of modal"),G=t,C.data(A,G)},destroy:function(){t.verbose("Destroying previous modal"),C.removeData(A).off(z),E.off(z),D.dimmer("destroy")},refresh:function(){t.remove.scrolling(),t.cacheSizes(),t.set.type(),t.set.position()},attachEvents:function(b,c){var d=a(b);c=a.isFunction(t[c])?t[c]:t.toggle,d.size()>0?(t.debug("Attaching modal events to element",b,c),d.off(z).on("click"+z,c)):t.error(y.notFound)},event:{close:function(){t.verbose("Closing element pressed"),a(this).is(v.approve)?a.proxy(u.onApprove,F)()!==!1?t.hide():t.verbose("Approve callback returned false cancelling hide"):a(this).is(v.deny)?a.proxy(u.onDeny,F)()!==!1?t.hide():t.verbose("Deny callback returned false cancelling hide"):t.hide()},click:function(b){0===a(b.target).closest(v.modal).size()&&(t.debug("Dimmer clicked, hiding all modals"),t.hideAll(),b.stopImmediatePropagation())},debounce:function(a,b){clearTimeout(t.timer),t.timer=setTimeout(a,b)},keyboard:function(a){var b=a.which,c=27;b==c&&(u.closable?(t.debug("Escape key pressed hiding modal"),t.hide()):t.debug("Escape key pressed, but closable is set to false"),a.preventDefault())},resize:function(){r.dimmer("is active")&&t.refresh()}},toggle:function(){t.is.active()?t.hide():t.show()},show:function(b){b=a.isFunction(b)?b:function(){},t.showDimmer(),t.showModal(b)},showModal:function(b){b=a.isFunction(b)?b:function(){},t.is.active()?t.debug("Modal is already visible"):(t.cacheSizes(),t.set.position(),t.set.type(),p.filter(":visible").size()>0?(t.debug("Other modals visible, queueing show animation"),t.hideOthers(t.showModal)):(u.transition&&a.fn.transition!==d&&C.transition("is supported")?(t.debug("Showing modal with css animations"),C.transition(u.transition+" in",u.duration,function(){t.set.active(),b()})):(t.debug("Showing modal with javascript"),C.fadeIn(u.duration,u.easing,function(){t.set.active(),b()})),a.proxy(u.onShow,F)()))},showDimmer:function(){r.dimmer("is active")?t.debug("Dimmer already visible"):(t.debug("Showing dimmer"),r.dimmer("show"))},hide:function(b){b=a.isFunction(b)?b:function(){},t.hideDimmer(),t.hideModal(b)},hideDimmer:function(){r.dimmer("is active")?(t.debug("Hiding dimmer"),u.closable&&s.off("click"+z),r.dimmer("hide")):t.debug("Dimmer is not visible cannot hide")},hideModal:function(b){b=a.isFunction(b)?b:function(){},t.is.active()&&(t.debug("Hiding modal"),t.remove.keyboardShortcuts(),u.transition&&a.fn.transition!==d&&C.transition("is supported")?C.transition(u.transition+" out",u.duration,function(){t.remove.active(),t.restore.focus(),b()}):C.fadeOut(u.duration,u.easing,function(){t.remove.active(),t.restore.focus(),b()}),a.proxy(u.onHide,F)())},hideAll:function(b){b=a.isFunction(b)?b:function(){},o.is(":visible")&&(t.debug("Hiding all visible modals"),t.hideDimmer(),o.filter(":visible").modal("hide modal",b))},hideOthers:function(b){b=a.isFunction(b)?b:function(){},p.is(":visible")&&(t.debug("Hiding other modals"),p.filter(":visible").modal("hide modal",b))},add:{keyboardShortcuts:function(){t.verbose("Adding keyboard shortcuts"),i.on("keyup"+z,t.event.keyboard)}},save:{focus:function(){q=a(c.activeElement).blur()}},restore:{focus:function(){q&&q.size()>0&&q.focus()}},remove:{active:function(){C.removeClass(w.active)},keyboardShortcuts:function(){t.verbose("Removing keyboard shortcuts"),i.off("keyup"+z)},scrolling:function(){r.removeClass(w.scrolling),C.removeClass(w.scrolling)}},cacheSizes:function(){t.cache={height:C.outerHeight()+u.offset,contextHeight:"body"==u.context?a(b).height():r.height()},t.debug("Caching modal and container sizes",t.cache)},can:{fit:function(){return t.cache.height<t.cache.contextHeight}},is:{active:function(){return C.hasClass(w.active)},modernBrowser:function(){return"Microsoft Internet Explorer"!==navigator.appName}},set:{active:function(){t.add.keyboardShortcuts(),t.save.focus(),C.addClass(w.active),u.closable&&s.off("click"+z).on("click"+z,t.event.click)},scrolling:function(){r.addClass(w.scrolling),C.addClass(w.scrolling)
},type:function(){t.can.fit()?(t.verbose("Modal fits on screen"),t.remove.scrolling()):(t.verbose("Modal cannot fit on screen setting to scrolling"),t.set.scrolling())},position:function(){t.verbose("Centering modal on page",t.cache,t.cache.height/2),t.can.fit()?C.css({top:"",marginTop:-(t.cache.height/2)}):C.css({marginTop:"1em",top:i.scrollTop()})}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,u,b);else{if(c===d)return u[b];u[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,t,b);else{if(c===d)return t[b];t[b]=c}},debug:function(){u.debug&&(u.performance?t.performance.log(arguments):(t.debug=Function.prototype.bind.call(console.info,console,u.name+":"),t.debug.apply(console,arguments)))},verbose:function(){u.verbose&&u.debug&&(u.performance?t.performance.log(arguments):(t.verbose=Function.prototype.bind.call(console.info,console,u.name+":"),t.verbose.apply(console,arguments)))},error:function(){t.error=Function.prototype.bind.call(console.error,console,u.name+":"),t.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;u.performance&&(b=(new Date).getTime(),d=j||b,c=b-d,j=b,k.push({Element:F,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(t.performance.timer),t.performance.timer=setTimeout(t.performance.display,100)},display:function(){var b=u.name+":",c=0;j=!1,clearTimeout(t.performance.timer),a.each(k,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",B&&(b+=" '"+B+"'"),(console.group!==d||console.table!==d)&&k.length>0&&(console.groupCollapsed(b),console.table?console.table(k):a.each(k,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),k=[]}},invoke:function(b,c,e){var g,h,i;return c=c||n,e=F||e,"string"==typeof b&&G!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(G[f])&&c!=g)G=G[f];else{if(G[f]!==d)return h=G[f],!1;if(!a.isPlainObject(G[e])||c==g)return G[e]!==d?(h=G[e],!1):(t.error(y.method,b),!1);G=G[e]}})),a.isFunction(h)?i=h.apply(e,c):h!==d&&(i=h),a.isArray(f)?f.push(i):f!==d?f=[f,i]:i!==d&&(f=i),h}},m?(G===d&&t.initialize(),t.invoke(l)):(G!==d&&t.destroy(),t.initialize())}),f!==d?f:this},a.fn.modal.settings={name:"Modal",namespace:"modal",debug:!0,verbose:!0,performance:!0,closable:!0,context:"body",duration:500,easing:"easeOutExpo",offset:0,transition:"scale",onShow:function(){},onHide:function(){},onApprove:function(){return!0},onDeny:function(){return!0},selector:{close:".close, .actions .button",approve:".actions .positive, .actions .approve",deny:".actions .negative, .actions .cancel",modal:".ui.modal"},error:{dimmer:"UI Dimmer, a required component is not included in this page",method:"The method you called is not defined."},className:{active:"active",scrolling:"scrolling"}}}(jQuery,window,document),function(a,b,c,d){a.fn.nag=function(c){var e,f=a(this),g=f.selector||"",h=(new Date).getTime(),i=[],j=arguments[0],k="string"==typeof j,l=[].slice.call(arguments,1);return a(this).each(function(){var m,n,o,p,q,r,s,t,u,v=a.extend(!0,{},a.fn.nag.settings,c),w=v.className,x=v.selector,y=v.error,z=v.namespace,A="."+z,B=z+"-module",C=a(this),D=C.find(x.close),E=a(v.context),F=this,G=C.data(B),H=b.requestAnimationFrame||b.mozRequestAnimationFrame||b.webkitRequestAnimationFrame||b.msRequestAnimationFrame||function(a){setTimeout(a,0)};u={initialize:function(){u.verbose("Initializing element"),m=C.offset(),n=C.outerHeight(),o=E.outerWidth(),p=E.outerHeight(),q=E.offset(),C.data(B,u),D.on("click"+A,u.dismiss),v.context==b&&"fixed"==v.position&&C.addClass(w.fixed),v.sticky&&(u.verbose("Adding scroll events"),"absolute"==v.position?E.on("scroll"+A,u.event.scroll).on("resize"+A,u.event.scroll):a(b).on("scroll"+A,u.event.scroll).on("resize"+A,u.event.scroll),a.proxy(u.event.scroll,this)()),v.displayTime>0&&setTimeout(u.hide,v.displayTime),u.should.show()?C.is(":visible")||u.show():u.hide()},destroy:function(){u.verbose("Destroying instance"),C.removeData(B).off(A),v.sticky&&E.off(A)},refresh:function(){u.debug("Refreshing cached calculations"),m=C.offset(),n=C.outerHeight(),o=E.outerWidth(),p=E.outerHeight(),q=E.offset()},show:function(){u.debug("Showing nag",v.animation.show),"fade"==v.animation.show?C.fadeIn(v.duration,v.easing):C.slideDown(v.duration,v.easing)},hide:function(){u.debug("Showing nag",v.animation.hide),"fade"==v.animation.show?C.fadeIn(v.duration,v.easing):C.slideUp(v.duration,v.easing)},onHide:function(){u.debug("Removing nag",v.animation.hide),C.remove(),v.onHide&&v.onHide()},stick:function(){if(u.refresh(),"fixed"==v.position){var c=a(b).prop("pageYOffset")||a(b).scrollTop(),d=C.hasClass(w.bottom)?q.top+(p-n)-c:q.top-c;C.css({position:"fixed",top:d,left:q.left,width:o-v.scrollBarWidth})}else C.css({top:s})},unStick:function(){C.css({top:""})},dismiss:function(a){v.storageMethod&&u.storage.set(v.storedKey,v.storedValue),u.hide(),a.stopImmediatePropagation(),a.preventDefault()},should:{show:function(){return v.persist?(u.debug("Persistent nag is set, can show nag"),!0):u.storage.get(v.storedKey)!=v.storedValue?(u.debug("Stored value is not set, can show nag",u.storage.get(v.storedKey)),!0):(u.debug("Stored value is set, cannot show nag",u.storage.get(v.storedKey)),!1)},stick:function(){return r=E.prop("pageYOffset")||E.scrollTop(),s=C.hasClass(w.bottom)?p-C.outerHeight()+r:r,s>m.top?!0:"fixed"==v.position?!0:!1}},storage:{set:function(c,e){u.debug("Setting stored value",c,e,v.storageMethod),"local"==v.storageMethod&&b.store!==d?b.store.set(c,e):a.cookie!==d?a.cookie(c,e):u.error(y.noStorage)},get:function(c){return u.debug("Getting stored value",c,v.storageMethod),"local"==v.storageMethod&&b.store!==d?b.store.get(c):a.cookie!==d?a.cookie(c):(u.error(y.noStorage),void 0)}},event:{scroll:function(){t!==d&&clearTimeout(t),t=setTimeout(function(){u.should.stick()?H(u.stick):u.unStick()},v.lag)}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,v,b);else{if(c===d)return v[b];v[b]=c}},internal:function(b,c){return u.debug("Changing internal",b,c),c===d?u[b]:(a.isPlainObject(b)?a.extend(!0,u,b):u[b]=c,void 0)},debug:function(){v.debug&&(v.performance?u.performance.log(arguments):(u.debug=Function.prototype.bind.call(console.info,console,v.name+":"),u.debug.apply(console,arguments)))},verbose:function(){v.verbose&&v.debug&&(v.performance?u.performance.log(arguments):(u.verbose=Function.prototype.bind.call(console.info,console,v.name+":"),u.verbose.apply(console,arguments)))},error:function(){u.error=Function.prototype.bind.call(console.error,console,v.name+":"),u.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;v.performance&&(b=(new Date).getTime(),d=h||b,c=b-d,h=b,i.push({Element:F,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(u.performance.timer),u.performance.timer=setTimeout(u.performance.display,100)},display:function(){var b=v.name+":",c=0;h=!1,clearTimeout(u.performance.timer),a.each(i,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",g&&(b+=" '"+g+"'"),f.size()>1&&(b+=" ("+f.size()+")"),(console.group!==d||console.table!==d)&&i.length>0&&(console.groupCollapsed(b),console.table?console.table(i):a.each(i,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),i=[]}},invoke:function(b,c,f){var g,h,i;return c=c||l,f=F||f,"string"==typeof b&&G!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(G[f])&&c!=g)G=G[f];else{if(G[f]!==d)return h=G[f],!1;if(!a.isPlainObject(G[e])||c==g)return G[e]!==d?(h=G[e],!1):(u.error(y.method,b),!1);G=G[e]}})),a.isFunction(h)?i=h.apply(f,c):h!==d&&(i=h),a.isArray(e)?e.push(i):e!==d?e=[e,i]:i!==d&&(e=i),h}},k?(G===d&&u.initialize(),u.invoke(j)):(G!==d&&u.destroy(),u.initialize())}),e!==d?e:this},a.fn.nag.settings={name:"Nag",verbose:!0,debug:!0,performance:!0,namespace:"Nag",persist:!1,displayTime:0,animation:{show:"slide",hide:"slide"},position:"fixed",scrollBarWidth:18,storageMethod:"cookie",storedKey:"nag",storedValue:"dismiss",sticky:!1,lag:0,context:b,error:{noStorage:"Neither $.cookie or store is defined. A storage solution is required for storing state",method:"The method you called is not defined."},className:{bottom:"bottom",fixed:"fixed"},selector:{close:".icon.close"},speed:500,easing:"easeOutQuad",onHide:function(){}}}(jQuery,window,document),function(a,b,c,d){a.fn.popup=function(e){var f,g=a(this),h=a(c),i=g.selector||"",j=(new Date).getTime(),k=[],l=arguments[0],m="string"==typeof l,n=[].slice.call(arguments,1);return g.each(function(){var c,g=a.isPlainObject(e)?a.extend(!0,{},a.fn.popup.settings,e):a.extend({},a.fn.popup.settings),o=g.selector,p=g.className,q=g.error,r=g.metadata,s=g.namespace,t="."+g.namespace,u="module-"+s,v=a(this),w=a(g.context),x=g.target?a(g.target):v,y=a(b),z=g.inline?x.offsetParent():y,A=g.inline?x.next(g.selector.popup):y.children(g.selector.popup).last(),B=0,C=this,D=v.data(u);c={initialize:function(){c.debug("Initializing module",v),"click"==g.on?v.on("click",c.toggle):v.on(c.get.startEvent()+t,c.event.start).on(c.get.endEvent()+t,c.event.end),g.target&&c.debug("Target set to element",x),y.on("resize"+t,c.event.resize),c.instantiate()},instantiate:function(){c.verbose("Storing instance of module",c),D=c,v.data(u,D)},refresh:function(){g.inline?(A=x.next(o.popup),z=x.offsetParent()):A=y.children(o.popup).last()},destroy:function(){c.debug("Destroying previous module"),y.off(t),A.remove(),v.off(t).removeData(u)},event:{start:function(){c.timer=setTimeout(function(){c.is.hidden()&&c.show()},g.delay)},end:function(){clearTimeout(c.timer),c.is.visible()&&c.hide()},resize:function(){c.is.visible()&&c.set.position()}},create:function(){c.debug("Creating pop-up html");var b=v.data(r.html)||g.html,d=v.data(r.variation)||g.variation,e=v.data(r.title)||g.title,f=v.data(r.content)||v.attr("title")||g.content;b||f||e?(b||(b=g.template({title:e,content:f})),A=a("<div/>").addClass(p.popup).addClass(d).html(b),g.inline?(c.verbose("Inserting popup element inline",A),A.insertAfter(v)):(c.verbose("Appending popup element to body",A),A.appendTo(w)),a.proxy(g.onCreate,A)()):c.error(q.content)},toggle:function(){c.debug("Toggling pop-up"),c.is.hidden()?(c.hideAll(),c.show()):c.hide()},show:function(a){a=a||function(){},c.debug("Showing pop-up",g.transition),g.preserve||c.refresh(),c.exists()||c.create(),c.set.position(),c.animate.show(a)},hide:function(a){a=a||function(){},v.removeClass(p.visible),c.unbind.close(),c.is.visible()&&c.animate.hide(a)},hideAll:function(){a(o.popup).filter(":visible").popup("hide")},hideGracefully:function(b){0===a(b.target).closest(o.popup).size()&&c.hide()},exists:function(){return g.inline?0!==A.size():A.parent(w).size()},remove:function(){c.debug("Removing popup"),A.remove()},animate:{show:function(b){b=b||function(){},v.addClass(p.visible),g.transition&&a.fn.transition!==d&&v.transition("is supported")?A.transition(g.transition+" in",g.duration,function(){c.bind.close(),a.proxy(b,C)()}):A.stop().fadeIn(g.duration,g.easing,function(){c.bind.close(),a.proxy(b,C)()}),a.proxy(g.onShow,C)()},hide:function(b){b=b||function(){},c.debug("Hiding pop-up"),g.transition&&a.fn.transition!==d&&v.transition("is supported")?A.transition(g.transition+" out",g.duration,function(){c.reset(),b()}):A.stop().fadeOut(g.duration,g.easing,function(){c.reset(),b()}),a.proxy(g.onHide,C)()}},get:{startEvent:function(){return"hover"==g.on?"mouseenter":"focus"==g.on?"focus":void 0},endEvent:function(){return"hover"==g.on?"mouseleave":"focus"==g.on?"blur":void 0},offstagePosition:function(){var d={top:a(b).scrollTop(),bottom:a(b).scrollTop()+a(b).height(),left:0,right:a(b).width()},e={width:A.width(),height:A.outerHeight(),position:A.offset()},f={},g=[];return e.position&&(f={top:e.position.top<d.top,bottom:e.position.top+e.height>d.bottom,right:e.position.left+e.width>d.right,left:e.position.left<d.left}),c.verbose("Checking if outside viewable area",e.position),a.each(f,function(a,b){b&&g.push(a)}),g.length>0?g.join(" "):!1},nextPosition:function(a){switch(a){case"top left":a="bottom left";break;case"bottom left":a="top right";break;case"top right":a="bottom right";break;case"bottom right":a="top center";break;case"top center":a="bottom center";break;case"bottom center":a="right center";break;case"right center":a="left center";break;case"left center":a="top center"}return a}},set:{position:function(d,e){var f,h,i=(a(b).width(),a(b).height(),x.outerWidth()),j=x.outerHeight(),k=A.width(),l=A.outerHeight(),m=z.outerWidth(),n=z.outerHeight(),o=g.distanceAway,s=g.inline?x.position():x.offset();switch(d=d||v.data(r.position)||g.position,e=e||v.data(r.offset)||g.offset,g.inline&&("left center"==d||"right center"==d?(e+=parseInt(b.getComputedStyle(C).getPropertyValue("margin-top"),10),o+=-parseInt(b.getComputedStyle(C).getPropertyValue("margin-left"),10)):(e+=parseInt(b.getComputedStyle(C).getPropertyValue("margin-left"),10),o+=parseInt(b.getComputedStyle(C).getPropertyValue("margin-top"),10))),c.debug("Calculating offset for position",d),d){case"top left":f={bottom:n-s.top+o,right:m-s.left-e,top:"auto",left:"auto"};break;case"top center":f={bottom:n-s.top+o,left:s.left+i/2-k/2+e,top:"auto",right:"auto"};break;case"top right":f={top:"auto",bottom:n-s.top+o,left:s.left+i+e,right:"auto"};break;case"left center":f={top:s.top+j/2-l/2+e,right:m-s.left+o,left:"auto",bottom:"auto"};break;case"right center":f={top:s.top+j/2-l/2+e,left:s.left+i+o,bottom:"auto",right:"auto"};break;case"bottom left":f={top:s.top+j+o,right:m-s.left-e,left:"auto",bottom:"auto"};break;case"bottom center":f={top:s.top+j+o,left:s.left+i/2-k/2+e,bottom:"auto",right:"auto"};break;case"bottom right":f={top:s.top+j+o,left:s.left+i+e,bottom:"auto",right:"auto"}}return A.css(f).removeClass(p.position).addClass(d).addClass(p.loading),h=c.get.offstagePosition(),h?(c.debug("Element is outside boundaries",h),B<g.maxSearchDepth?(d=c.get.nextPosition(d),B++,c.debug("Trying new position",d),c.set.position(d)):(c.error(q.recursion),B=0,c.reset(),!1)):(c.debug("Position is on stage",d),B=0,!0)}},bind:{close:function(){"click"==g.on&&g.closable&&(c.verbose("Binding popup close event to document"),h.on("click"+t,c.hideGracefully))}},unbind:{close:function(){"click"==g.on&&g.closable&&(c.verbose("Removing close event from document"),h.off("click"+t))}},is:{visible:function(){return A.is(":visible")},hidden:function(){return!c.is.visible()}},reset:function(){A.attr("style","").removeAttr("style"),g.preserve||c.remove()},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,g,b);else{if(c===d)return g[b];g[b]=c}},internal:function(b,e){if(a.isPlainObject(b))a.extend(!0,c,b);else{if(e===d)return c[b];c[b]=e}},debug:function(){g.debug&&(g.performance?c.performance.log(arguments):(c.debug=Function.prototype.bind.call(console.info,console,g.name+":"),c.debug.apply(console,arguments)))},verbose:function(){g.verbose&&g.debug&&(g.performance?c.performance.log(arguments):(c.verbose=Function.prototype.bind.call(console.info,console,g.name+":"),c.verbose.apply(console,arguments)))},error:function(){c.error=Function.prototype.bind.call(console.error,console,g.name+":"),c.error.apply(console,arguments)},performance:{log:function(a){var b,d,e;g.performance&&(b=(new Date).getTime(),e=j||b,d=b-e,j=b,k.push({Element:C,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":d})),clearTimeout(c.performance.timer),c.performance.timer=setTimeout(c.performance.display,100)},display:function(){var b=g.name+":",e=0;j=!1,clearTimeout(c.performance.timer),a.each(k,function(a,b){e+=b["Execution Time"]}),b+=" "+e+"ms",i&&(b+=" '"+i+"'"),(console.group!==d||console.table!==d)&&k.length>0&&(console.groupCollapsed(b),console.table?console.table(k):a.each(k,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),k=[]}},invoke:function(b,e,g){var h,i,j;return e=e||n,g=C||g,"string"==typeof b&&D!==d&&(b=b.split(/[\. ]/),h=b.length-1,a.each(b,function(e,f){var g=e!=h?f+b[e+1].charAt(0).toUpperCase()+b[e+1].slice(1):b;if(a.isPlainObject(D[f])&&e!=h)D=D[f];else{if(!a.isPlainObject(D[g])||e==h)return D[f]!==d?(i=D[f],!1):D[g]!==d?(i=D[g],!1):(c.error(q.method,b),!1);D=D[g]}})),a.isFunction(i)?j=i.apply(g,e):i!==d&&(j=i),a.isArray(f)?f.push(j):f!==d?f=[f,j]:j!==d&&(f=j),i}},m?(D===d&&c.initialize(),c.invoke(l)):(D!==d&&c.destroy(),c.initialize())}),f!==d?f:this},a.fn.popup.settings={name:"Popup",debug:!0,verbose:!0,performance:!0,namespace:"popup",onCreate:function(){},onShow:function(){},onHide:function(){},variation:"",content:!1,html:!1,title:!1,on:"hover",target:!1,closable:!0,context:"body",position:"top center",delay:150,inline:!1,preserve:!1,duration:250,easing:"easeOutQuint",transition:"scale",distanceAway:0,offset:0,maxSearchDepth:10,error:{content:"Your popup has no content specified",method:"The method you called is not defined.",recursion:"Popup attempted to reposition element to fit, but could not find an adequate position."},metadata:{content:"content",html:"html",offset:"offset",position:"position",title:"title",variation:"variation"},className:{loading:"loading",popup:"ui popup",position:"top left center bottom right",visible:"visible"},selector:{popup:".ui.popup"},template:function(a){var b="";return typeof a!==d&&(typeof a.title!==d&&a.title&&(b+='<div class="header">'+a.title+'</div class="header">'),typeof a.content!==d&&a.content&&(b+='<div class="content">'+a.content+"</div>")),b}}}(jQuery,window,document),function(a,b,c,d){a.fn.rating=function(b){var c,e=a(this),f=e.selector||"",g=(new Date).getTime(),h=[],i=arguments[0],j="string"==typeof i,k=[].slice.call(arguments,1);return e.each(function(){var l,m=a.isPlainObject(b)?a.extend(!0,{},a.fn.rating.settings,b):a.extend({},a.fn.rating.settings),n=m.namespace,o=m.className,p=m.metadata,q=m.selector,r=m.error,s="."+n,t="module-"+n,u=this,v=a(this).data(t),w=a(this),x=w.find(q.icon);l={initialize:function(){l.verbose("Initializing rating module",m),m.interactive?l.enable():l.disable(),m.initialRating&&(l.debug("Setting initial rating"),l.setRating(m.initialRating)),w.data(p.rating)&&(l.debug("Rating found in metadata"),l.setRating(w.data(p.rating))),l.instantiate()},instantiate:function(){l.verbose("Instantiating module",m),v=l,w.data(t,l)},destroy:function(){l.verbose("Destroying previous instance",v),w.removeData(t),x.off(s)},event:{mouseenter:function(){var b=a(this);b.nextAll().removeClass(o.hover),w.addClass(o.hover),b.addClass(o.hover).prevAll().addClass(o.hover)},mouseleave:function(){w.removeClass(o.hover),x.removeClass(o.hover)},click:function(){var b=a(this),c=l.getRating(),d=x.index(b)+1;m.clearable&&c==d?l.clearRating():l.setRating(d)}},clearRating:function(){l.debug("Clearing current rating"),l.setRating(0)},getRating:function(){var a=x.filter("."+o.active).size();return l.verbose("Current rating retrieved",a),a},enable:function(){l.debug("Setting rating to interactive mode"),x.on("mouseenter"+s,l.event.mouseenter).on("mouseleave"+s,l.event.mouseleave).on("click"+s,l.event.click),w.removeClass(o.disabled)},disable:function(){l.debug("Setting rating to read-only mode"),x.off(s),w.addClass(o.disabled)},setRating:function(b){var c=b-1>=0?b-1:0,d=x.eq(c);w.removeClass(o.hover),x.removeClass(o.hover).removeClass(o.active),b>0&&(l.verbose("Setting current rating to",b),d.addClass(o.active).prevAll().addClass(o.active)),a.proxy(m.onRate,u)(b)},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,m,b);else{if(c===d)return m[b];m[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,l,b);else{if(c===d)return l[b];l[b]=c}},debug:function(){m.debug&&(m.performance?l.performance.log(arguments):(l.debug=Function.prototype.bind.call(console.info,console,m.name+":"),l.debug.apply(console,arguments)))},verbose:function(){m.verbose&&m.debug&&(m.performance?l.performance.log(arguments):(l.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),l.verbose.apply(console,arguments)))},error:function(){l.error=Function.prototype.bind.call(console.error,console,m.name+":"),l.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;m.performance&&(b=(new Date).getTime(),d=g||b,c=b-d,g=b,h.push({Element:u,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(l.performance.timer),l.performance.timer=setTimeout(l.performance.display,100)},display:function(){var b=m.name+":",c=0;g=!1,clearTimeout(l.performance.timer),a.each(h,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",f&&(b+=" '"+f+"'"),e.size()>1&&(b+=" ("+e.size()+")"),(console.group!==d||console.table!==d)&&h.length>0&&(console.groupCollapsed(b),console.table?console.table(h):a.each(h,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),h=[]}},invoke:function(b,e,f){var g,h,i;return e=e||k,f=u||f,"string"==typeof b&&v!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(v[f])&&c!=g)v=v[f];else{if(v[f]!==d)return h=v[f],!1;if(!a.isPlainObject(v[e])||c==g)return v[e]!==d?(h=v[e],!1):(l.error(r.method,b),!1);v=v[e]}})),a.isFunction(h)?i=h.apply(f,e):h!==d&&(i=h),a.isArray(c)?c.push(i):c!==d?c=[c,i]:i!==d&&(c=i),h}},j?(v===d&&l.initialize(),l.invoke(i)):(v!==d&&l.destroy(),l.initialize())}),c!==d?c:this},a.fn.rating.settings={name:"Rating",namespace:"rating",verbose:!0,debug:!0,performance:!0,initialRating:0,interactive:!0,clearable:!1,onRate:function(){},error:{method:"The method you called is not defined"},metadata:{rating:"rating"},className:{active:"active",disabled:"disabled",hover:"hover",loading:"loading"},selector:{icon:".icon"}}}(jQuery,window,document),function(a,b,c,d){a.fn.search=function(c,e){var f,g=a(this),h=g.selector||"",i=(new Date).getTime(),j=[],k=arguments[0],l="string"==typeof k,m=[].slice.call(arguments,1);return a(this).each(function(){var n,o=a.extend(!0,{},a.fn.search.settings,e),p=o.className,q=o.selector,r=o.error,s=o.namespace,t="."+s,u=s+"-module",v=a(this),w=v.find(q.prompt),x=v.find(q.searchButton),y=v.find(q.results),z=(v.find(q.result),v.find(q.category),this),A=v.data(u);n={initialize:function(){n.verbose("Initializing module");var a=w[0],b=a.oninput!==d?"input":a.onpropertychange!==d?"propertychange":"keyup";w.on("focus"+t,n.event.focus).on("blur"+t,n.event.blur).on("keydown"+t,n.handleKeyboard),o.automatic&&w.on(b+t,n.search.throttle),x.on("click"+t,n.search.query),y.on("click"+t,q.result,n.results.select),n.instantiate()},instantiate:function(){n.verbose("Storing instance of module",n),A=n,v.data(u,n)},destroy:function(){n.verbose("Destroying instance"),v.removeData(u)},event:{focus:function(){v.addClass(p.focus),n.results.show()},blur:function(){n.search.cancel(),v.removeClass(p.focus),n.results.hide()}},handleKeyboard:function(b){var c,d=v.find(q.result),e=v.find(q.category),f=b.which,g={backspace:8,enter:13,escape:27,upArrow:38,downArrow:40},h=p.active,i=d.index(d.filter("."+h)),j=d.size();if(f==g.escape&&(n.verbose("Escape key pressed, blurring search field"),w.trigger("blur")),y.filter(":visible").size()>0)if(f==g.enter){if(n.verbose("Enter key pressed, selecting active result"),d.filter("."+h).exists())return a.proxy(n.results.select,d.filter("."+h))(),b.preventDefault(),!1}else f==g.upArrow?(n.verbose("Up key pressed, changing active result"),c=0>i-1?i:i-1,e.removeClass(h),d.removeClass(h).eq(c).addClass(h).closest(e).addClass(h),b.preventDefault()):f==g.downArrow&&(n.verbose("Down key pressed, changing active result"),c=i+1>=j?i:i+1,e.removeClass(h),d.removeClass(h).eq(c).addClass(h).closest(e).addClass(h),b.preventDefault());else f==g.enter&&(n.verbose("Enter key pressed, executing query"),n.search.query(),x.addClass(p.down),w.one("keyup",function(){x.removeClass(p.down)}))},search:{cancel:function(){var a=v.data("xhr")||!1;a&&"resolved"!=a.state()&&(n.debug("Cancelling last search"),a.abort())},throttle:function(){var a=w.val(),b=a.length;clearTimeout(n.timer),b>=o.minCharacters?n.timer=setTimeout(n.search.query,o.searchThrottle):n.results.hide()},query:function(){var b=w.val(),d=n.search.cache.read(b);d?(n.debug("Reading result for '"+b+"' from cache"),n.results.add(d)):(n.debug("Querying for '"+b+"'"),"object"==typeof c?n.search.local(b):n.search.remote(b),a.proxy(o.onSearchQuery,v)(b))},local:function(b){var d,e=[],f=[],g=a.isArray(o.searchFields)?o.searchFields:[o.searchFields],h=new RegExp("(?:s|^)"+b,"i"),i=new RegExp(b,"i");v.addClass(p.loading),a.each(g,function(b,d){a.each(c,function(b,c){"string"==typeof c[d]&&-1==a.inArray(c,e)&&-1==a.inArray(c,f)&&(h.test(c[d])?e.push(c):i.test(c[d])&&f.push(c))})}),d=n.results.generate({results:a.merge(e,f)}),v.removeClass(p.loading),n.search.cache.write(b,d),n.results.add(d)},remote:function(b){var d,e={stateContext:v,url:c,urlData:{query:b},success:function(a){d=n.results.generate(a),n.search.cache.write(b,d),n.results.add(d)},failure:n.error};n.search.cancel(),n.debug("Executing search"),a.extend(!0,e,o.apiSettings),a.api(e)},cache:{read:function(a){var b=v.data("cache");return o.cache&&"object"==typeof b&&b[a]!==d?b[a]:!1},write:function(a,b){var c=v.data("cache")!==d?v.data("cache"):{};c[a]=b,v.data("cache",c)}}},results:{generate:function(b){n.debug("Generating html from response",b);var c=o.templates[o.type],d="";return a.isPlainObject(b.results)&&!a.isEmptyObject(b.results)||a.isArray(b.results)&&b.results.length>0?(o.maxResults>0&&(b.results=a.makeArray(b.results).slice(0,o.maxResults)),b.results.length>0&&(a.isFunction(c)?d=c(b):n.error(r.noTemplate,!1))):d=n.message(r.noResults,"empty"),a.proxy(o.onResults,v)(b),d},add:function(b){("default"==o.onResultsAdd||"default"==a.proxy(o.onResultsAdd,y)(b))&&y.html(b),n.results.show()},show:function(){0===y.filter(":visible").size()&&w.filter(":focus").size()>0&&""!==y.html()&&(y.stop().fadeIn(200),a.proxy(o.onResultsOpen,y)())},hide:function(){y.filter(":visible").size()>0&&(y.stop().fadeOut(200),a.proxy(o.onResultsClose,y)())},select:function(c){n.debug("Search result selected");var d=a(this),e=d.find(".title"),f=e.html();if("default"==o.onSelect||"default"==a.proxy(o.onSelect,this)(c)){var g=d.find("a[href]").eq(0),h=g.attr("href")||!1,i=g.attr("target")||!1;n.results.hide(),w.val(f),h&&("_blank"==i||c.ctrlKey?b.open(h):b.location.href=h)}}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,o,b);else{if(c===d)return o[b];o[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,n,b);else{if(c===d)return n[b];n[b]=c}},debug:function(){o.debug&&(o.performance?n.performance.log(arguments):(n.debug=Function.prototype.bind.call(console.info,console,o.name+":"),n.debug.apply(console,arguments)))},verbose:function(){o.verbose&&o.debug&&(o.performance?n.performance.log(arguments):(n.verbose=Function.prototype.bind.call(console.info,console,o.name+":"),n.verbose.apply(console,arguments)))},error:function(){n.error=Function.prototype.bind.call(console.error,console,o.name+":"),n.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;o.performance&&(b=(new Date).getTime(),d=i||b,c=b-d,i=b,j.push({Element:z,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(n.performance.timer),n.performance.timer=setTimeout(n.performance.display,100)},display:function(){var b=o.name+":",c=0;i=!1,clearTimeout(n.performance.timer),a.each(j,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",h&&(b+=" '"+h+"'"),g.size()>1&&(b+=" ("+g.size()+")"),(console.group!==d||console.table!==d)&&j.length>0&&(console.groupCollapsed(b),console.table?console.table(j):a.each(j,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),j=[]}},invoke:function(b,c,e){var g,h,i;return c=c||m,e=z||e,"string"==typeof b&&A!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(A[f])&&c!=g)A=A[f];else{if(A[f]!==d)return h=A[f],!1;if(!a.isPlainObject(A[e])||c==g)return A[e]!==d?(h=A[e],!1):(n.error(r.method,b),!1);A=A[e]}})),a.isFunction(h)?i=h.apply(e,c):h!==d&&(i=h),a.isArray(f)?f.push(i):f!==d?f=[f,i]:i!==d&&(f=i),h}},l?(A===d&&n.initialize(),n.invoke(k)):(A!==d&&n.destroy(),n.initialize())}),f!==d?f:this},a.fn.search.settings={name:"Search Module",namespace:"search",debug:!0,verbose:!0,performance:!0,onSelect:"default",onResultsAdd:"default",onSearchQuery:function(){},onResults:function(){},onResultsOpen:function(){},onResultsClose:function(){},automatic:"true",type:"simple",minCharacters:3,searchThrottle:300,maxResults:7,cache:!0,searchFields:["title","description"],apiSettings:{},className:{active:"active",down:"down",focus:"focus",empty:"empty",loading:"loading"},error:{noResults:"Your search returned no results",logging:"Error in debug logging, exiting.",noTemplate:"A valid template name was not specified.",serverError:"There was an issue with querying the server.",method:"The method you called is not defined."},selector:{prompt:".prompt",searchButton:".search.button",results:".results",category:".category",result:".result"},templates:{message:function(a,b){var c="";return a!==d&&b!==d&&(c+='<div class="message '+b+'">',c+="empty"==b?'<div class="header">No Results</div class="header"><div class="description">'+a+'</div class="description">':' <div class="description">'+a+"</div>",c+="</div>"),c},categories:function(b){var c="";return b.results!==d?(a.each(b.results,function(b,e){e.results!==d&&e.results.length>0&&(c+='<div class="category"><div class="name">'+e.name+"</div>",a.each(e.results,function(a,b){c+='<div class="result">',c+='<a href="'+b.url+'"></a>',b.image!==d&&(c+='<div class="image"> <img src="'+b.image+'"></div>'),c+='<div class="info">',b.price!==d&&(c+='<div class="price">'+b.price+"</div>"),b.title!==d&&(c+='<div class="title">'+b.title+"</div>"),b.description!==d&&(c+='<div class="description">'+b.description+"</div>"),c+="</div></div>"}),c+="</div>")}),b.resultPage&&(c+='<a href="'+b.resultPage.url+'" class="all">'+b.resultPage.text+"</a>"),c):!1},simple:function(b){var c="";return b.results!==d?(a.each(b.results,function(a,b){c+='<a class="result" href="'+b.url+'">',b.image!==d&&(c+='<div class="image"> <img src="'+b.image+'"></div>'),c+='<div class="info">',b.price!==d&&(c+='<div class="price">'+b.price+"</div>"),b.title!==d&&(c+='<div class="title">'+b.title+"</div>"),b.description!==d&&(c+='<div class="description">'+b.description+"</div>"),c+="</div></a>"}),b.resultPage&&(c+='<a href="'+b.resultPage.url+'" class="all">'+b.resultPage.text+"</a>"),c):!1}}}}(jQuery,window,document),function(a,b,c,d){a.fn.shape=function(b){var e,f=a(this),g=a("body"),h=(new Date).getTime(),i=[],j=arguments[0],k="string"==typeof j,l=[].slice.call(arguments,1);return f.each(function(){var m,n,o,p=f.selector||"",q=a.extend(!0,{},a.fn.shape.settings,b),r=q.namespace,s=q.selector,t=q.error,u=q.className,v="."+r,w="module-"+r,x=a(this),y=x.find(s.sides),z=x.find(s.side),A=!1,B=this,C=x.data(w);o={initialize:function(){o.verbose("Initializing module for",B),o.set.defaultSide(),o.instantiate()},instantiate:function(){o.verbose("Storing instance of module",o),C=o,x.data(w,C)},destroy:function(){o.verbose("Destroying previous module for",B),x.removeData(w).off(v)},refresh:function(){o.verbose("Refreshing selector cache for",B),x=a(B),y=a(this).find(s.shape),z=a(this).find(s.side)},repaint:function(){o.verbose("Forcing repaint event");{var a=y.get(0)||c.createElement("div");a.offsetWidth}},animate:function(b,c){o.verbose("Animating box with properties",b),c=c||function(a){o.verbose("Executing animation callback"),a!==d&&a.stopPropagation(),o.reset(),o.set.active()},a.proxy(q.beforeChange,n[0])(),o.get.transitionEvent()?(o.verbose("Starting CSS animation"),x.addClass(u.animating),o.repaint(),x.addClass(u.animating),m.addClass(u.hidden),y.css(b).one(o.get.transitionEvent(),c),o.set.duration(q.duration)):c()},queue:function(a){o.debug("Queueing animation of",a),y.one(o.get.transitionEvent(),function(){o.debug("Executing queued animation"),setTimeout(function(){x.shape(a)
},0)})},reset:function(){o.verbose("Animating states reset"),x.removeClass(u.animating).attr("style","").removeAttr("style"),y.attr("style","").removeAttr("style"),z.attr("style","").removeAttr("style").removeClass(u.hidden),n.removeClass(u.animating).attr("style","").removeAttr("style")},is:{animating:function(){return x.hasClass(u.animating)}},set:{defaultSide:function(){m=x.find("."+q.className.active),n=m.next(s.side).size()>0?m.next(s.side):x.find(s.side).first(),A=!1,o.verbose("Active side set to",m),o.verbose("Next side set to",n)},duration:function(a){a=a||q.duration,a="number"==typeof a?a+"ms":a,o.verbose("Setting animation duration",a),y.add(z).css({"-webkit-transition-duration":a,"-moz-transition-duration":a,"-ms-transition-duration":a,"-o-transition-duration":a,"transition-duration":a})},stageSize:function(){var a=x.clone().addClass(u.loading),b=a.find("."+q.className.active),c=A?a.find(A):b.next(s.side).size()>0?b.next(s.side):a.find(s.side).first(),d={};b.removeClass(u.active),c.addClass(u.active),a.prependTo(g),d={width:c.outerWidth(),height:c.outerHeight()},a.remove(),x.css(d),o.verbose("Resizing stage to fit new content",d)},nextSide:function(a){A=a,n=x.find(a),0===n.size()&&o.error(t.side),o.verbose("Next side manually set to",n)},active:function(){o.verbose("Setting new side to active",n),z.removeClass(u.active),n.addClass(u.active),a.proxy(q.onChange,n[0])(),o.set.defaultSide()}},flip:{up:function(){o.debug("Flipping up",n),o.is.animating()?o.queue("flip up"):(o.set.stageSize(),o.stage.above(),o.animate(o.get.transform.up()))},down:function(){o.debug("Flipping down",n),o.is.animating()?o.queue("flip down"):(o.set.stageSize(),o.stage.below(),o.animate(o.get.transform.down()))},left:function(){o.debug("Flipping left",n),o.is.animating()?o.queue("flip left"):(o.set.stageSize(),o.stage.left(),o.animate(o.get.transform.left()))},right:function(){o.debug("Flipping right",n),o.is.animating()?o.queue("flip right"):(o.set.stageSize(),o.stage.right(),o.animate(o.get.transform.right()))},over:function(){o.debug("Flipping over",n),o.is.animating()?o.queue("flip over"):(o.set.stageSize(),o.stage.behind(),o.animate(o.get.transform.over()))},back:function(){o.debug("Flipping back",n),o.is.animating()?o.queue("flip back"):(o.set.stageSize(),o.stage.behind(),o.animate(o.get.transform.back()))}},get:{transform:{up:function(){var a={y:-((m.outerHeight()-n.outerHeight())/2),z:-(m.outerHeight()/2)};return{transform:"translateY("+a.y+"px) translateZ("+a.z+"px) rotateX(-90deg)"}},down:function(){var a={y:-((m.outerHeight()-n.outerHeight())/2),z:-(m.outerHeight()/2)};return{transform:"translateY("+a.y+"px) translateZ("+a.z+"px) rotateX(90deg)"}},left:function(){var a={x:-((m.outerWidth()-n.outerWidth())/2),z:-(m.outerWidth()/2)};return{transform:"translateX("+a.x+"px) translateZ("+a.z+"px) rotateY(90deg)"}},right:function(){var a={x:-((m.outerWidth()-n.outerWidth())/2),z:-(m.outerWidth()/2)};return{transform:"translateX("+a.x+"px) translateZ("+a.z+"px) rotateY(-90deg)"}},over:function(){var a={x:-((m.outerWidth()-n.outerWidth())/2)};return{transform:"translateX("+a.x+"px) rotateY(180deg)"}},back:function(){var a={x:-((m.outerWidth()-n.outerWidth())/2)};return{transform:"translateX("+a.x+"px) rotateY(-180deg)"}}},transitionEvent:function(){var a,b=c.createElement("element"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(a in e)if(b.style[a]!==d)return e[a]},nextSide:function(){return m.next(s.side).size()>0?m.next(s.side):x.find(s.side).first()}},stage:{above:function(){var a={origin:(m.outerHeight()-n.outerHeight())/2,depth:{active:n.outerHeight()/2,next:m.outerHeight()/2}};o.verbose("Setting the initial animation position as above",n,a),m.css({transform:"rotateY(0deg) translateZ("+a.depth.active+"px)"}),n.addClass(u.animating).css({display:"block",top:a.origin+"px",transform:"rotateX(90deg) translateZ("+a.depth.next+"px)"})},below:function(){var a={origin:(m.outerHeight()-n.outerHeight())/2,depth:{active:n.outerHeight()/2,next:m.outerHeight()/2}};o.verbose("Setting the initial animation position as below",n,a),m.css({transform:"rotateY(0deg) translateZ("+a.depth.active+"px)"}),n.addClass(u.animating).css({display:"block",top:a.origin+"px",transform:"rotateX(-90deg) translateZ("+a.depth.next+"px)"})},left:function(){var a={origin:(m.outerWidth()-n.outerWidth())/2,depth:{active:n.outerWidth()/2,next:m.outerWidth()/2}};o.verbose("Setting the initial animation position as left",n,a),m.css({transform:"rotateY(0deg) translateZ("+a.depth.active+"px)"}),n.addClass(u.animating).css({display:"block",left:a.origin+"px",transform:"rotateY(-90deg) translateZ("+a.depth.next+"px)"})},right:function(){var a={origin:(m.outerWidth()-n.outerWidth())/2,depth:{active:n.outerWidth()/2,next:m.outerWidth()/2}};o.verbose("Setting the initial animation position as left",n,a),m.css({transform:"rotateY(0deg) translateZ("+a.depth.active+"px)"}),n.addClass(u.animating).css({display:"block",left:a.origin+"px",transform:"rotateY(90deg) translateZ("+a.depth.next+"px)"})},behind:function(){var a={origin:(m.outerWidth()-n.outerWidth())/2,depth:{active:n.outerWidth()/2,next:m.outerWidth()/2}};o.verbose("Setting the initial animation position as behind",n,a),m.css({transform:"rotateY(0deg)"}),n.addClass(u.animating).css({display:"block",left:a.origin+"px",transform:"rotateY(-180deg)"})}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,q,b);else{if(c===d)return q[b];q[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,o,b);else{if(c===d)return o[b];o[b]=c}},debug:function(){q.debug&&(q.performance?o.performance.log(arguments):(o.debug=Function.prototype.bind.call(console.info,console,q.name+":"),o.debug.apply(console,arguments)))},verbose:function(){q.verbose&&q.debug&&(q.performance?o.performance.log(arguments):(o.verbose=Function.prototype.bind.call(console.info,console,q.name+":"),o.verbose.apply(console,arguments)))},error:function(){o.error=Function.prototype.bind.call(console.error,console,q.name+":"),o.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;q.performance&&(b=(new Date).getTime(),d=h||b,c=b-d,h=b,i.push({Element:B,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(o.performance.timer),o.performance.timer=setTimeout(o.performance.display,100)},display:function(){var b=q.name+":",c=0;h=!1,clearTimeout(o.performance.timer),a.each(i,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",p&&(b+=" '"+p+"'"),f.size()>1&&(b+=" ("+f.size()+")"),(console.group!==d||console.table!==d)&&i.length>0&&(console.groupCollapsed(b),console.table?console.table(i):a.each(i,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),i=[]}},invoke:function(b,c,f){var g,h,i;return c=c||l,f=B||f,"string"==typeof b&&C!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(C[f])&&c!=g)C=C[f];else{if(C[f]!==d)return h=C[f],!1;if(!a.isPlainObject(C[e])||c==g)return C[e]!==d?(h=C[e],!1):(o.error(t.method,b),!1);C=C[e]}})),a.isFunction(h)?i=h.apply(f,c):h!==d&&(i=h),a.isArray(e)?e.push(i):e!==d?e=[e,i]:i!==d&&(e=i),h}},k?(C===d&&o.initialize(),o.invoke(j)):(C!==d&&o.destroy(),o.initialize())}),e!==d?e:this},a.fn.shape.settings={name:"Shape",debug:!0,verbose:!0,performance:!0,namespace:"shape",beforeChange:function(){},onChange:function(){},duration:700,error:{side:"You tried to switch to a side that does not exist.",method:"The method you called is not defined"},className:{animating:"animating",hidden:"hidden",loading:"loading",active:"active"},selector:{sides:".sides",side:".side"}}}(jQuery,window,document),function(a,b,c,d){a.fn.sidebar=function(b){var e,f=a(this),g=a("body"),h=a("head"),i=f.selector||"",j=(new Date).getTime(),k=[],l=arguments[0],m="string"==typeof l,n=[].slice.call(arguments,1);return f.each(function(){var o,p=a.isPlainObject(b)?a.extend(!0,{},a.fn.sidebar.settings,b):a.extend({},a.fn.sidebar.settings),q=p.selector,r=p.className,s=p.namespace,t=p.error,u="."+s,v="module-"+s,w=a(this),x=a("style[title="+s+"]"),y=this,z=w.data(v);o={initialize:function(){o.debug("Initializing sidebar",w),o.instantiate()},instantiate:function(){o.verbose("Storing instance of module",o),z=o,w.data(v,o)},destroy:function(){o.verbose("Destroying previous module for",w),w.off(u).removeData(v)},refresh:function(){o.verbose("Refreshing selector cache"),x=a("style[title="+s+"]")},attachEvents:function(b,c){var d=a(b);c=a.isFunction(o[c])?o[c]:o.toggle,d.size()>0?(o.debug("Attaching sidebar events to element",b,c),d.off(u).on("click"+u,c)):o.error(t.notFound)},show:function(b){b=a.isFunction(b)?b:function(){},o.debug("Showing sidebar",b),o.is.closed()?(p.overlay||(p.exclusive&&o.hideAll(),o.pushPage()),o.set.active(),b(),a.proxy(p.onChange,y)(),a.proxy(p.onShow,y)()):o.debug("Sidebar is already visible")},hide:function(b){b=a.isFunction(b)?b:function(){},o.debug("Hiding sidebar",b),o.is.open()&&(p.overlay||(o.pullPage(),o.remove.pushed()),o.remove.active(),b(),a.proxy(p.onChange,y)(),a.proxy(p.onHide,y)())},hideAll:function(){a(q.sidebar).filter(":visible").sidebar("hide")},toggle:function(){o.is.closed()?o.show():o.hide()},pushPage:function(){var a=o.get.direction(),b=o.is.vertical()?w.outerHeight():w.outerWidth();p.useCSS?(o.debug("Using CSS to animate body"),o.add.bodyCSS(a,b),o.set.pushed()):o.animatePage(a,b,o.set.pushed)},pullPage:function(){var a=o.get.direction();p.useCSS?(o.debug("Resetting body position css"),o.remove.bodyCSS()):(o.debug("Resetting body position using javascript"),o.animatePage(a,0)),o.remove.pushed()},animatePage:function(a,b){var c={};c["padding-"+a]=b,o.debug("Using javascript to animate body",c),g.animate(c,p.duration,o.set.pushed)},add:{bodyCSS:function(a,b){var c;a!==r.bottom&&(c='<style title="'+s+'">body.pushed {  margin-'+a+": "+b+"px !important;}</style>"),h.append(c),o.debug("Adding body css to head",x)}},remove:{bodyCSS:function(){o.debug("Removing body css styles",x),o.refresh(),x.remove()},active:function(){w.removeClass(r.active)},pushed:function(){o.verbose("Removing body push state",o.get.direction()),g.removeClass(r[o.get.direction()]).removeClass(r.pushed)}},set:{active:function(){w.addClass(r.active)},pushed:function(){o.verbose("Adding body push state",o.get.direction()),g.addClass(r[o.get.direction()]).addClass(r.pushed)}},get:{direction:function(){return w.hasClass(r.top)?r.top:w.hasClass(r.right)?r.right:w.hasClass(r.bottom)?r.bottom:r.left},transitionEvent:function(){var a,b=c.createElement("element"),e={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(a in e)if(b.style[a]!==d)return e[a]}},is:{open:function(){return w.is(":animated")||w.hasClass(r.active)},closed:function(){return!o.is.open()},vertical:function(){return w.hasClass(r.top)}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,p,b);else{if(c===d)return p[b];p[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,o,b);else{if(c===d)return o[b];o[b]=c}},debug:function(){p.debug&&(p.performance?o.performance.log(arguments):(o.debug=Function.prototype.bind.call(console.info,console,p.name+":"),o.debug.apply(console,arguments)))},verbose:function(){p.verbose&&p.debug&&(p.performance?o.performance.log(arguments):(o.verbose=Function.prototype.bind.call(console.info,console,p.name+":"),o.verbose.apply(console,arguments)))},error:function(){o.error=Function.prototype.bind.call(console.error,console,p.name+":"),o.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;p.performance&&(b=(new Date).getTime(),d=j||b,c=b-d,j=b,k.push({Element:y,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(o.performance.timer),o.performance.timer=setTimeout(o.performance.display,100)},display:function(){var b=p.name+":",c=0;j=!1,clearTimeout(o.performance.timer),a.each(k,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",i&&(b+=" '"+i+"'"),f.size()>1&&(b+=" ("+f.size()+")"),(console.group!==d||console.table!==d)&&k.length>0&&(console.groupCollapsed(b),console.table?console.table(k):a.each(k,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),k=[]}},invoke:function(b,c,f){var g,h,i;return c=c||n,f=y||f,"string"==typeof b&&z!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(z[f])&&c!=g)z=z[f];else{if(z[f]!==d)return h=z[f],!1;if(!a.isPlainObject(z[e])||c==g)return z[e]!==d?(h=z[e],!1):(o.error(t.method,b),!1);z=z[e]}})),a.isFunction(h)?i=h.apply(f,c):h!==d&&(i=h),a.isArray(e)?e.push(i):e!==d?e=[e,i]:i!==d&&(e=i),h}},m?(z===d&&o.initialize(),o.invoke(l)):(z!==d&&o.destroy(),o.initialize())}),e!==d?e:this},a.fn.sidebar.settings={name:"Sidebar",namespace:"sidebar",verbose:!0,debug:!0,performance:!0,useCSS:!0,exclusive:!0,overlay:!1,duration:300,onChange:function(){},onShow:function(){},onHide:function(){},className:{active:"active",pushed:"pushed",top:"top",left:"left",right:"right",bottom:"bottom"},selector:{sidebar:".ui.sidebar"},error:{method:"The method you called is not defined.",notFound:"There were no elements that matched the specified selector"}}}(jQuery,window,document),function(a,b,c,d){a.fn.tab=function(c){var e,f,g,h,i,j=a.extend(!0,{},a.fn.tab.settings,c),k=a(this),l=a(j.context).find(j.selector.tabs),m=k.selector||"",n={},o=!0,p=0,q=this,r=(new Date).getTime(),s=[],t=j.className,u=j.metadata,v=j.error,w="."+j.namespace,x="module-"+j.namespace,y=k.data(x),z=arguments[0],A=y!==d&&"string"==typeof z,B=[].slice.call(arguments,1);return h={initialize:function(){if(h.debug("Initializing Tabs",k),j.auto&&(h.verbose("Setting up automatic tab retrieval from server"),j.apiSettings={url:j.path+"/{$tab}"}),j.history){if(h.debug("Initializing page state"),a.address===d)return h.error(v.state),!1;if("html5"==j.historyType){if(h.debug("Using HTML5 to manage state"),j.path===!1)return h.error(v.path),!1;a.address.history(!0).state(j.path)}a.address.unbind("change").bind("change",h.event.history.change)}a.isWindow(q)||(h.debug("Attaching tab activation events to element",k),k.on("click"+w,h.event.click)),h.instantiate()},instantiate:function(){h.verbose("Storing instance of module",h),k.data(x,h)},destroy:function(){h.debug("Destroying tabs",k),k.removeData(x).off(w)},event:{click:function(b){var c=a(this).data(u.tab);c!==d?(j.history?(h.verbose("Updating page state",b),a.address.value(c)):(h.verbose("Changing tab without state management",b),h.changeTab(c)),b.preventDefault()):h.debug("No tab specified")},history:{change:function(b){var c=b.pathNames.join("/")||h.get.initialPath(),e=j.templates.determineTitle(c)||!1;h.debug("History change event",c,b),g=b,c!==d&&h.changeTab(c),e&&a.address.title(e)}}},refresh:function(){e&&(h.debug("Refreshing tab",e),h.changeTab(e))},cache:{read:function(a){return a!==d?n[a]:!1},add:function(a,b){a=a||e,h.debug("Adding cached content for",a),n[a]=b},remove:function(a){a=a||e,h.debug("Removing cached content for",a),delete n[a]}},set:{state:function(b){a.address.value(b)}},changeTab:function(c){var d=b.history&&b.history.pushState,i=d&&j.ignoreFirstLoad&&o,k=j.auto||a.isPlainObject(j.apiSettings),l=k&&!i?h.utilities.pathToArray(c):h.get.defaultPathArray(c);c=h.utilities.arrayToPath(l),h.deactivate.all(),a.each(l,function(b,d){var m,n,p,q=l.slice(0,b+1),r=h.utilities.arrayToPath(q),s=h.is.tab(r),t=b+1==l.length,u=h.get.tabElement(r);return h.verbose("Looking for tab",d),s?(h.verbose("Tab was found",d),e=r,f=h.utilities.filterArray(l,q),t?p=!0:(m=l.slice(0,b+2),n=h.utilities.arrayToPath(m),p=!h.is.tab(n),p&&h.verbose("Tab parameters found",m)),p&&k?(i?(h.debug("Ignoring remote content on first tab load",r),o=!1,h.cache.add(c,u.html()),h.activate.all(r),a.proxy(j.onTabInit,u)(r,f,g),a.proxy(j.onTabLoad,u)(r,f,g)):(h.activate.navigation(r),h.content.fetch(r,c)),!1):(h.debug("Opened local tab",r),h.activate.all(r),h.cache.read(r)||(h.cache.add(r,!0),h.debug("First time tab loaded calling tab init"),a.proxy(j.onTabInit,u)(r,f,g)),a.proxy(j.onTabLoad,u)(r,f,g),void 0)):(h.error(v.missingTab,d),!1)})},content:{fetch:function(b,c){var i,k,l=h.get.tabElement(b),m={dataType:"html",stateContext:l,success:function(d){h.cache.add(c,d),h.content.update(b,d),b==e?(h.debug("Content loaded",b),h.activate.tab(b)):h.debug("Content loaded in background",b),a.proxy(j.onTabInit,l)(b,f,g),a.proxy(j.onTabLoad,l)(b,f,g)},urlData:{tab:c}},n=l.data(u.promise)||!1,o=n&&"pending"===n.state();c=c||b,k=h.cache.read(c),j.cache&&k?(h.debug("Showing existing content",c),h.content.update(b,k),h.activate.tab(b),a.proxy(j.onTabLoad,l)(b,f,g)):o?(h.debug("Content is already loading",c),l.addClass(t.loading)):a.api!==d?(console.log(j.apiSettings),i=a.extend(!0,{headers:{"X-Remote":!0}},j.apiSettings,m),h.debug("Retrieving remote content",c,i),a.api(i)):h.error(v.api)},update:function(a,b){h.debug("Updating html for",a);var c=h.get.tabElement(a);c.html(b)}},activate:{all:function(a){h.activate.tab(a),h.activate.navigation(a)},tab:function(a){var b=h.get.tabElement(a);h.verbose("Showing tab content for",b),b.addClass(t.active)},navigation:function(a){var b=h.get.navElement(a);h.verbose("Activating tab navigation for",b,a),b.addClass(t.active)}},deactivate:{all:function(){h.deactivate.navigation(),h.deactivate.tabs()},navigation:function(){k.removeClass(t.active)},tabs:function(){l.removeClass(t.active+" "+t.loading)}},is:{tab:function(a){return a!==d?h.get.tabElement(a).size()>0:!1}},get:{initialPath:function(){return k.eq(0).data(u.tab)||l.eq(0).data(u.tab)},path:function(){return a.address.value()},defaultPathArray:function(a){return h.utilities.pathToArray(h.get.defaultPath(a))},defaultPath:function(a){var b=k.filter("[data-"+u.tab+'^="'+a+'/"]').eq(0),c=b.data(u.tab)||!1;if(c){if(h.debug("Found default tab",c),p<j.maxDepth)return p++,h.get.defaultPath(c);h.error(v.recursion)}else h.debug("No default tabs found for",a,l);return p=0,a},navElement:function(a){return a=a||e,k.filter("[data-"+u.tab+'="'+a+'"]')},tabElement:function(a){var b,c,d,f;return a=a||e,d=h.utilities.pathToArray(a),f=h.utilities.last(d),b=l.filter("[data-"+u.tab+'="'+f+'"]'),c=l.filter("[data-"+u.tab+'="'+a+'"]'),b.size()>0?b:c},tab:function(){return e}},utilities:{filterArray:function(b,c){return a.grep(b,function(b){return-1==a.inArray(b,c)})},last:function(b){return a.isArray(b)?b[b.length-1]:!1},pathToArray:function(a){return a===d&&(a=e),"string"==typeof a?a.split("/"):[a]},arrayToPath:function(b){return a.isArray(b)?b.join("/"):!1}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,j,b);else{if(c===d)return j[b];j[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,h,b);else{if(c===d)return h[b];h[b]=c}},debug:function(){j.debug&&(j.performance?h.performance.log(arguments):(h.debug=Function.prototype.bind.call(console.info,console,j.name+":"),h.debug.apply(console,arguments)))},verbose:function(){j.verbose&&j.debug&&(j.performance?h.performance.log(arguments):(h.verbose=Function.prototype.bind.call(console.info,console,j.name+":"),h.verbose.apply(console,arguments)))},error:function(){h.error=Function.prototype.bind.call(console.error,console,j.name+":"),h.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;j.performance&&(b=(new Date).getTime(),d=r||b,c=b-d,r=b,s.push({Element:q,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(h.performance.timer),h.performance.timer=setTimeout(h.performance.display,100)},display:function(){var b=j.name+":",c=0;r=!1,clearTimeout(h.performance.timer),a.each(s,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",m&&(b+=" '"+m+"'"),(console.group!==d||console.table!==d)&&s.length>0&&(console.groupCollapsed(b),console.table?console.table(s):a.each(s,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),s=[]}},invoke:function(b,c,e){var f,g,j;return c=c||B,e=q||e,"string"==typeof b&&y!==d&&(b=b.split(/[\. ]/),f=b.length-1,a.each(b,function(c,e){var i=c!=f?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(y[e])&&c!=f)y=y[e];else{if(!a.isPlainObject(y[i])||c==f)return y[e]!==d?(g=y[e],!1):y[i]!==d?(g=y[i],!1):(h.error(v.method,b),!1);y=y[i]}})),a.isFunction(g)?j=g.apply(e,c):g!==d&&(j=g),a.isArray(i)?i.push(j):i!==d?i=[i,j]:j!==d&&(i=j),g}},A?(y===d&&h.initialize(),h.invoke(z)):(y!==d&&h.destroy(),h.initialize()),i!==d?i:this},a.tab=function(c){a(b).tab(c)},a.fn.tab.settings={name:"Tab",verbose:!0,debug:!0,performance:!0,namespace:"tab",onTabInit:function(){},onTabLoad:function(){},templates:{determineTitle:function(){}},auto:!1,history:!0,historyType:"hash",path:!1,context:"body",maxDepth:25,ignoreFirstLoad:!1,alwaysRefresh:!1,cache:!0,apiSettings:!1,error:{api:"You attempted to load content without API module",method:"The method you called is not defined",missingTab:"Tab cannot be found",noContent:"The tab you specified is missing a content url.",path:"History enabled, but no path was specified",recursion:"Max recursive depth reached",state:"The state library has not been initialized"},metadata:{tab:"tab",loaded:"loaded",promise:"promise"},className:{loading:"loading",active:"active"},selector:{tabs:".ui.tab"}}}(jQuery,window,document),function(a,b,c,d){a.fn.transition=function(){{var e,f=a(this),g=f.selector||"",h=(new Date).getTime(),i=[],j=arguments,k=j[0],l=[].slice.call(arguments,1),m="string"==typeof k;b.requestAnimationFrame||b.mozRequestAnimationFrame||b.webkitRequestAnimationFrame||b.msRequestAnimationFrame||function(a){setTimeout(a,0)}}return f.each(function(){var b,n,o,p,q,r,s,t,u,v,w=a(this),x=this;v={initialize:function(){b=v.get.settings.apply(x,j),v.verbose("Converted arguments into settings object",b),o=b.error,p=b.className,t=b.namespace,q=b.metadata,u="module-"+t,r=v.get.animationEvent(),s=v.get.animationName(),n=w.data(u),n===d&&v.instantiate(),m&&(m=v.invoke(k)),m===!1&&v.animate()},instantiate:function(){v.verbose("Storing instance of module",v),n=v,w.data(u,n)},destroy:function(){v.verbose("Destroying previous module for",x),w.removeData(u)},animate:function(a){return b=a||b,v.is.supported()?(v.debug("Preparing animation",b.animation),v.is.animating()?(b.queue&&v.queue(b.animation),!1):(v.save.conditions(),v.set.duration(b.duration),v.set.animating(),v.repaint(),w.addClass(p.transition).addClass(b.animation).one(r,v.complete),!v.has.direction()&&v.can.transition()&&v.set.direction(),v.has.transitionAvailable()?(v.show(),v.debug("Starting tween",b.animation,w.attr("class")),void 0):(v.restore.conditions(),v.error(o.noAnimation),!1))):(v.error(o.support),!1)},queue:function(a){v.debug("Queueing animation of",a),n.queuing=!0,w.one(r,function(){n.queuing=!1,v.animate.apply(this,b)})},complete:function(){v.verbose("CSS animation complete",b.animation),v.is.looping()||(w.hasClass(p.outward)?(v.restore.conditions(),v.hide(),a.proxy(b.onHide,this)()):w.hasClass(p.inward)?(v.restore.conditions(),v.show(),a.proxy(b.onShow,this)()):v.restore.conditions(),v.remove.animating()),a.proxy(b.complete,this)()},repaint:function(a){v.verbose("Forcing repaint event"),a=x.offsetWidth},has:{direction:function(a){return a=a||b.animation,w.hasClass(p.inward)||w.hasClass(p.outward)?!0:void 0},transitionAvailable:function(){return"none"!==w.css(s)?(v.debug("CSS definition found"),!0):(v.debug("Unable to find css definition"),!1)}},set:{animating:function(){w.addClass(p.animating)},direction:function(){w.is(":visible")?(v.debug("Automatically determining the direction of animation","Outward"),w.addClass(p.outward).removeClass(p.inward)):(v.debug("Automatically determining the direction of animation","Inward"),w.addClass(p.inward).removeClass(p.outward))},looping:function(){v.debug("Transition set to loop"),w.addClass(p.looping)},duration:function(a){a=a||b.duration,a="number"==typeof a?a+"ms":a,v.verbose("Setting animation duration",a),w.css({"-webkit-animation-duration":a,"-moz-animation-duration":a,"-ms-animation-duration":a,"-o-animation-duration":a,"animation-duration":a})}},save:{conditions:function(){v.cache={className:w.attr("class"),style:w.attr("style")},v.verbose("Saving original attributes",v.cache)}},restore:{conditions:function(){return typeof v.cache===d?(v.error(o.cache),!1):(v.cache.className?w.attr("class",v.cache.className):w.removeAttr("class"),v.cache.style?w.attr("style",v.cache.style):w.removeAttr("style"),v.is.looping()&&v.remove.looping(),v.verbose("Restoring original attributes",v.cache),void 0)}},remove:{animating:function(){w.removeClass(p.animating)},looping:function(){v.debug("Transitions are no longer looping"),w.removeClass(p.looping),v.repaint()}},get:{settings:function(b,c,d){return a.isPlainObject(b)?a.extend(!0,{},a.fn.transition.settings,b):"function"==typeof d?a.extend(!0,{},a.fn.transition.settings,{animation:b,complete:d,duration:c}):"string"==typeof c||"number"==typeof c?a.extend(!0,{},a.fn.transition.settings,{animation:b,duration:c}):"object"==typeof c?a.extend(!0,{},a.fn.transition.settings,c,{animation:b}):"function"==typeof c?a.extend(!0,{},a.fn.transition.settings,{animation:b,complete:c}):a.extend(!0,{},a.fn.transition.settings,{animation:b})},animationName:function(){var a,b=c.createElement("div"),e={animation:"animationName",OAnimation:"oAnimationName",MozAnimation:"mozAnimationName",WebkitAnimation:"webkitAnimationName"};for(a in e)if(b.style[a]!==d)return v.verbose("Determined animation vendor name property",e[a]),e[a];return!1},animationEvent:function(){var a,b=c.createElement("div"),e={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"mozAnimationEnd",WebkitAnimation:"webkitAnimationEnd"};for(a in e)if(b.style[a]!==d)return v.verbose("Determined animation vendor end event",e[a]),e[a];return!1}},can:{transition:function(){var b=a("<div>").addClass(w.attr("class")).appendTo(a("body")),c=b.css(s),d=b.addClass(p.inward).css(s);return c!=d?(v.debug("In/out transitions exist"),b.remove(),!0):(v.debug("Static animation found"),b.remove(),!1)}},is:{animating:function(){return w.hasClass(p.animating)},looping:function(){return w.hasClass(p.looping)},visible:function(){return w.is(":visible")},supported:function(){return s!==!1&&r!==!1}},hide:function(){v.verbose("Hiding element"),w.removeClass(p.visible).addClass(p.transition).addClass(p.hidden),v.repaint()},show:function(){v.verbose("Showing element"),w.removeClass(p.hidden).addClass(p.transition).addClass(p.visible),v.repaint()},start:function(){v.verbose("Starting animation"),w.removeClass(p.disabled)},stop:function(){v.debug("Stopping animation"),w.addClass(p.disabled)},toggle:function(){v.debug("Toggling play status"),w.toggleClass(p.disabled)},setting:function(c,e){if(a.isPlainObject(c))a.extend(!0,b,c);else{if(e===d)return b[c];b[c]=e}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,v,b);else{if(c===d)return v[b];v[b]=c}},debug:function(){b.debug&&(b.performance?v.performance.log(arguments):(v.debug=Function.prototype.bind.call(console.info,console,b.name+":"),v.debug.apply(console,arguments)))},verbose:function(){b.verbose&&b.debug&&(b.performance?v.performance.log(arguments):(v.verbose=Function.prototype.bind.call(console.info,console,b.name+":"),v.verbose.apply(console,arguments)))},error:function(){v.error=Function.prototype.bind.call(console.error,console,b.name+":"),v.error.apply(console,arguments)},performance:{log:function(a){var c,d,e;b.performance&&(c=(new Date).getTime(),e=h||c,d=c-e,h=c,i.push({Element:x,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":d})),clearTimeout(v.performance.timer),v.performance.timer=setTimeout(v.performance.display,100)},display:function(){var c=b.name+":",e=0;h=!1,clearTimeout(v.performance.timer),a.each(i,function(a,b){e+=b["Execution Time"]}),c+=" "+e+"ms",g&&(c+=" '"+g+"'"),f.size()>1&&(c+=" ("+f.size()+")"),(console.group!==d||console.table!==d)&&i.length>0&&(console.groupCollapsed(c),console.table?console.table(i):a.each(i,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),i=[]}},invoke:function(b,c,f){var g,h,i;return c=c||l,f=x||f,"string"==typeof b&&n!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(n[f])&&c!=g)n=n[f];else{if(n[f]!==d)return h=n[f],!1;if(!a.isPlainObject(n[e])||c==g)return n[e]!==d?(h=n[e],!1):!1;n=n[e]}})),a.isFunction(h)?i=h.apply(f,c):h!==d&&(i=h),a.isArray(e)?e.push(i):e!==d?e=[e,i]:i!==d&&(e=i),h||!1}},v.initialize()}),e!==d?e:this},a.fn.transition.settings={name:"Transition",debug:!1,verbose:!0,performance:!0,namespace:"transition",complete:function(){},onShow:function(){},onHide:function(){},animation:"fade",duration:"700ms",queue:!0,className:{animating:"animating",disabled:"disabled",hidden:"hidden",inward:"in",loading:"loading",looping:"looping",outward:"out",transition:"ui transition",visible:"visible"},error:{noAnimation:"There is no css animation matching the one you specified.",method:"The method you called is not defined",support:"This browser does not support CSS animations"}}}(jQuery,window,document),function(a,b,c,d){a.fn.video=function(b){var c,e=a(this),f=e.selector||"",g=(new Date).getTime(),h=[],i=arguments[0],j="string"==typeof i,k=[].slice.call(arguments,1);return e.each(function(){var l,m=a.isPlainObject(b)?a.extend(!0,{},a.fn.video.settings,b):a.extend({},a.fn.video.settings),n=m.selector,o=m.className,p=m.error,q=m.metadata,r=m.namespace,s="."+r,t="module-"+r,u=a(this),v=u.find(n.placeholder),w=u.find(n.playButton),x=u.find(n.embed),y=this,z=u.data(t);l={initialize:function(){l.debug("Initializing video"),v.on("click"+s,l.play),w.on("click"+s,l.play),l.instantiate()},instantiate:function(){l.verbose("Storing instance of module",l),z=l,u.data(t,l)},destroy:function(){l.verbose("Destroying previous instance of video"),u.removeData(t).off(s),v.off(s),w.off(s)},change:function(a,b,c){l.debug("Changing video to ",a,b,c),u.data(q.source,a).data(q.id,b).data(q.url,c),m.onChange()},reset:function(){l.debug("Clearing video embed and showing placeholder"),u.removeClass(o.active),x.html(" "),v.show(),m.onReset()},play:function(){l.debug("Playing video");var a=u.data(q.source)||!1,b=u.data(q.url)||!1,c=u.data(q.id)||!1;x.html(l.generate.html(a,c,b)),u.addClass(o.active),m.onPlay()},generate:{html:function(a,b,c){l.debug("Generating embed html");var d,e="auto"==m.width?u.width():m.width,f="auto"==m.height?u.height():m.height;return a&&b?"vimeo"==a?d='<iframe src="http://player.vimeo.com/video/'+b+"?="+l.generate.url(a)+'" width="'+e+'" height="'+f+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>':"youtube"==a&&(d='<iframe src="http://www.youtube.com/embed/'+b+"?="+l.generate.url(a)+'" width="'+e+'" height="'+f+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'):c?d='<iframe src="'+c+'" width="'+e+'" height="'+f+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>':l.error(p.noVideo),d},url:function(a){var b=m.api?1:0,c=m.autoplay?1:0,d=m.hd?1:0,e=m.showUI?1:0,f=m.showUI?0:1,g="";return"vimeo"==a&&(g="api="+b+"&amp;title="+e+"&amp;byline="+e+"&amp;portrait="+e+"&amp;autoplay="+c,m.color&&(g+="&amp;color="+m.color)),"ustream"==a?(g="autoplay="+c,m.color&&(g+="&amp;color="+m.color)):"youtube"==a&&(g="enablejsapi="+b+"&amp;autoplay="+c+"&amp;autohide="+f+"&amp;hq="+d+"&amp;modestbranding=1",m.color&&(g+="&amp;color="+m.color)),g}},setting:function(b,c){if(a.isPlainObject(b))a.extend(!0,m,b);else{if(c===d)return m[b];m[b]=c}},internal:function(b,c){if(a.isPlainObject(b))a.extend(!0,l,b);else{if(c===d)return l[b];l[b]=c}},debug:function(){m.debug&&(m.performance?l.performance.log(arguments):(l.debug=Function.prototype.bind.call(console.info,console,m.name+":"),l.debug.apply(console,arguments)))
},verbose:function(){m.verbose&&m.debug&&(m.performance?l.performance.log(arguments):(l.verbose=Function.prototype.bind.call(console.info,console,m.name+":"),l.verbose.apply(console,arguments)))},error:function(){l.error=Function.prototype.bind.call(console.error,console,m.name+":"),l.error.apply(console,arguments)},performance:{log:function(a){var b,c,d;m.performance&&(b=(new Date).getTime(),d=g||b,c=b-d,g=b,h.push({Element:y,Name:a[0],Arguments:[].slice.call(a,1)||"","Execution Time":c})),clearTimeout(l.performance.timer),l.performance.timer=setTimeout(l.performance.display,100)},display:function(){var b=m.name+":",c=0;g=!1,clearTimeout(l.performance.timer),a.each(h,function(a,b){c+=b["Execution Time"]}),b+=" "+c+"ms",f&&(b+=" '"+f+"'"),e.size()>1&&(b+=" ("+e.size()+")"),(console.group!==d||console.table!==d)&&h.length>0&&(console.groupCollapsed(b),console.table?console.table(h):a.each(h,function(a,b){console.log(b.Name+": "+b["Execution Time"]+"ms")}),console.groupEnd()),h=[]}},invoke:function(b,e,f){var g,h,i;return e=e||k,f=y||f,"string"==typeof b&&z!==d&&(b=b.split(/[\. ]/),g=b.length-1,a.each(b,function(c,e){var f=c!=g?e+b[c+1].charAt(0).toUpperCase()+b[c+1].slice(1):b;if(a.isPlainObject(z[f])&&c!=g)z=z[f];else{if(z[f]!==d)return h=z[f],!1;if(!a.isPlainObject(z[e])||c==g)return z[e]!==d?(h=z[e],!1):(l.error(p.method,b),!1);z=z[e]}})),a.isFunction(h)?i=h.apply(f,e):h!==d&&(i=h),a.isArray(c)?c.push(i):c!==d?c=[c,i]:i!==d&&(c=i),h}},j?(z===d&&l.initialize(),l.invoke(i)):(z!==d&&l.destroy(),l.initialize())}),c!==d?c:this},a.fn.video.settings={name:"Video",namespace:"video",debug:!0,verbose:!0,performance:!0,metadata:{source:"source",id:"id",url:"url"},onPlay:function(){},onReset:function(){},onChange:function(){},onPause:function(){},onStop:function(){},width:"auto",height:"auto",autoplay:!1,color:"#442359",hd:!0,showUI:!1,api:!0,error:{noVideo:"No video specified",method:"The method you called is not defined"},className:{active:"active"},selector:{embed:".embed",placeholder:".placeholder",playButton:".play"}}}(jQuery,window,document);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//







$(function(){

  $('.emmo-popup').popup({
    transition: 'vertical flip',
    position: 'right center',
    variation: 'inverted'
  });

});
