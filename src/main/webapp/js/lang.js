//------------------------------------------------------------------------------
//## Object

// NOTE: these do _not_ break for (foo in bar)

/** Object helper functions */
var Objects = {
	/** create an Object from a prototype */
	object: function(obj) {
		function F() {}
		F.prototype = obj;
		return new F();
	},
	/*
	NOTE Object.create(proto [, propertiesObject ])
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
	*/
	
	/** copies an Object's properties into an new Object */
	copyOf: function(obj) {
		var	out	= {};
		for (var key in obj)
				if (obj.hasOwnProperty(key))	
						out[key] = obj[key];
		return out;
	},
	
	/** copies an object's properties into another object */
	copySlots: function(source, target) {
		for (var key in source)
				if (source.hasOwnProperty(key))	
						target[key] = source[key];
	},
	
	/** an object's own property names as an Array */
	ownSlots: function(obj) {
		var	out	= [];
		for (key in obj)
				if (obj.hasOwnProperty(key))
						out.push(obj);
	},
	/*
	NOTE Object.keys(obj)
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
	NOTE Object.getOwnPropertyNames(obj)
	@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
	*/
	
	/** returns an object's slots as an Array of Pairs */
	toPairs: function(obj) {
		var	out	= [];
		for (var key in obj)
				if (obj.hasOwnProperty(key))
						out.push([key, obj[key]]);
		return out;
	},
	
	/** creates an Object from an Array of key/value pairs, the last Pair for a key wins */
	fromPairs: function(pairs) {
		var	out	= {};
		for (var i=0; i<pairs.length; i++) {
			var	pair	= pairs[i];
			out[pair[0]]	= pair[1];
		}
	},
	
	/** returns the value behind every key */
	values: function(obj) {
		var	out	= [];
		for (var key in obj)
				if (obj.hasOwnProperty(key))
						out.push(obj[key]);
		return out;
	}//,
};

//------------------------------------------------------------------------------
//## Array 

// NOTE: these _do_ break for each (foo in someArray)

/*
// NOTE: the Array monad has Array.make as unit, flatMap as bind
// NOTE: flatten = flatMap id
*/

/** can be used to copy a function's arguments into a real Array */
Array.make = function(args) {
	return Array.prototype.slice.apply(args);
};

/** removes an element */
Array.prototype.remove = function(element) {
	var	index	= this.indexOf(element);
	if (index === -1)	return false;
	this.splice(index, 1);
	return true;
};

/** whether this array contains an element */
Array.prototype.contains = function(element) {
	return this.indexOf(element) !== -1;
};

/** two partitions in a 2-element Array, first the partition where the predicate returned true */ 
Array.prototype.partition = function(predicate) {
	var	yes	= [];
	var no	= [];
	for (var i=0; i<this.length; i++) {
		var	item	= this[i];
		(predicate(item) ? yes : no).push(item);
	}
	return [ yes, no ];
};

/** flatten an Array of Arrays into a simple Array */
Array.prototype.flatten = function() {
	var out	= [];
	for (var i=0; i<this.length; i++) {
		out	= out.concat(this[i]);
	}
	return out;
};

/** map every element to an Array and concat the resulting Arrays */
Array.prototype.flatMap = function(func, thisVal) {
	var out	= [];
	for (var i=0; i<this.length; i++) {
		out	= out.concat(func.call(thisVal, this[i], i, this));
	}
	return out;
};

/** returns a reverse copy of this Array */
Array.prototype.reverseClone = function() {
	var	out	= [].concat(this);
	out.reverse();
	return out;
};

/** return a new Array with a separator inserted between every element of the Array */
Array.prototype.infuse = function(separator) {
	var	out	= [];
	for (var i=0; i<this.length; i++) {
		out.push(this[i]);
		out.push(separator);
	}
	out.pop();
	return out;
};

/** optionally insert an element between every two elements and boundaries */
Array.prototype.inject = function(func, thisVal) {
	var out	= [];
	for (var i=0; i<=this.length; i++) {
		var	a	= i > 0				? this[i-1]	: null;
		var b	= i < this.length	? this[i]	: null;
		var	tmp		= func.call(thisVal, a, b);
		if (tmp !== null)	out.push(tmp);
		if (i < this.length)	out.push(this[i]);
	}
	return out;
};
		
/** use a function to extract keys and build an Object */
Array.prototype.indexWith = function(keyFunc) {
	var	out	= {};
	for (var i=0; i<this.length; i++) {
		var	item	= this[i];
		out[keyFunc(item)]	= item;
	}
	return out;
};

//------------------------------------------------------------------------------
//## Function

/** the unary identiy function */
Function.identity = function(x) { return x; }

/** create a constant Function */
Function.constant = function(c) { return function(v) { return c; } }

/** create a Function calling this Function with a fixed this */
Function.prototype.bind = function(thisObject) {
	var self	= this;	// == arguments.callee
	return function() {
		return self.apply(thisObject, arguments);
	};
};
/*
NOTE fun.bind(thisValue [, arg1 [, arg2 [...] ] ])
@see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
*/

/** create a Function calling this Function with fixed first arguments */
Function.prototype.fix = function() {
	var	self	= this;	// == arguments.callee
	var args	= Array.prototype.slice.apply(arguments);
	return function() {
		return self.apply(this, args.concat(Array.prototype.slice.apply(arguments)));
	};
};


/** 
 * call this thunk after some millis.
 * optionally call the given continuation with the result afterwards.
 * returns an object with an cancel method to prevent this thunk from being called.
 * the cancel method returns whether cancellation was successful
 */
Function.prototype.callAfter = function(millis, continuation) {
	var	self	= this;
	var running	= false;
	function execute() { 
		running = true; 
		var	out	= self.call(); 
		if (continuation)	continuation(out);
	}
	var	timer	= window.setTimeout(execute, millis);
	function cancel() {
		 window.clearTimeout(timer) 
		 return !running;
	}
	return {
		cancel: cancel
	}; 
};

//------------------------------------------------------------------------------
//## String

/** remove whitespace from both ends */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
};

/** return text without prefix or null */
String.prototype.scan = function(s) {
	return this.substring(0, s.length) === s
			? this.substring(s.length)
			: null;
};

/** return text without prefix or null */
String.prototype.scanNoCase = function(s) {
	return this.substring(0, s.length).toLowerCase() === s.toLowerCase()
			? this.substring(s.length)
			: null;
};

/** true when the string starts with the pattern */
String.prototype.startsWith = function(s) {
	return this.indexOf(s) === 0;
};

/** true when the string ends in the pattern */
String.prototype.endsWith = function(s) {
	return this.lastIndexOf(s) === this.length - s.length;
};

/** escapes characters to make them usable as a literal in a RegExp */
String.prototype.escapeRE = function() {
	return this.replace(/([{}()|.?*+^$\[\]\\])/g, "\\$1");
};

/** replace ${name} with the name property of the args object */
String.prototype.template = function(args) {
	return this.template2("${", "}", args);
};

/** replace prefix XXX suffix with the name property of the args object */
String.prototype.template2 = function(prefix, suffix, args) {
	// /\$\{([^}]+?)\}/g
	var	re	= new RegExp(prefix.escapeRE() + "([a-zA-Z]+?)" + suffix.escapeRE(), "g");
	return this.replace(re, function($0, $1) { 
		var arg = args[$1]; 
		return arg !== undefined ? arg : $0;
	});
};

//------------------------------------------------------------------------------
//## Number

/** create an array of number from inclusive to exclusive */
Number.range = function(from, to) {
	var	out	= [];
	for (var i=from; i<to; i++)	out.push(i);
	return out;
};
