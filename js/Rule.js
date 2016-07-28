function Rule(production) {
	this.production = production;
}

var RULE_PROB = 1;

Rule.prototype.checkCondition = function(block) {
	if (block.variable != this.production.predecessor.variable) {
		return false;
	}
//	return true;
	return Math.random() < RULE_PROB;
}