/**
 * @param predecessor BlockState
 * @param successor Array of BlockState/s
 */
function Production(predecessor, successor) {
	this.predecessor = predecessor;
	if ( ! Array.isArray(successor)) {
		throw "Successor must be an array!";
	}
	this.successor = successor;
}

function BlockState(variable, resources) {
	this.variable = variable;
	this.resources = resources;
}

function Resources(k, l, m) {
	this.k = k;
	this.l = l;
	this.m = m;
}

var Alphabet = Object.freeze({
	fromString : function(s) {
		var ret = new Array();
		for (var i = 0, len = s.length; i < len; i++) {
			var symbol = null;
			if (this.hasOwnProperty(s[i])) {
				symbol = this[s[i]];
			} else if (s[i] == "-") {
				symbol = Alphabet.LEFT;
			} else if (s[i] == "+") {
				symbol = Alphabet.RIGHT;
			} else if (s[i] == "[") {
				symbol = Alphabet.PUSH;
			} else if (s[i] == "]") {
				symbol = Alphabet.POP;
			}
			
			if (symbol != null) {
				ret.push(symbol);
			} else {
				console.log("unknown symbol '" + s[i] + "'");
			}
		}
		return ret;
	},
	name : function(v) {
		for (var k in this) {
			if (this.hasOwnProperty(k) && this[k] == v) {
				return k;
			}
		}
		return undefined;
	},
	// TODO: for easy generation of BlockState arrays
	debugBlockStateArray : function(variables, resource) {
		var ret = new Array();
		for (var i = 0 ; i < variables.length ; i++) {
			ret.push(new BlockState(variables[i], new Resources(resource.k, resource.l, resource.m)));
		}
		return ret;
	},
	// Variables
	A : 0,
	B : 1,
	X : 23,
	Y : 24,
	Z : 25,
	// Constants
	SEED : 30, // Special first point of plant, this is a parent block that's guaranteed to exist.
	LEFT : 40,
	RIGHT : 41,
	PUSH : 50,
	POP : 51,
});
