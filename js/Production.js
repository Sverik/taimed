function Production(predecessor, successor) {
	this.predecessor = predecessor;
	this.successor = successor;
}

var Alphabet = Object.freeze({
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
	// Constants
	SEED : 30, // Special first point of plant, this is a parent block that's guaranteed to exist.
	LEFT : 40,
	RIGHT : 41,
	PUSH : 50,
	POP : 51,
});
