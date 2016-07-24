function Production(predecessor, successor) {
	this.predecessor = predecessor;
	if ( ! Array.isArray(successor)) {
		throw "Successor must be an array!";
	}
	this.successor = successor;
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
