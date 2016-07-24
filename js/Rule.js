function Rule(production) {
	this.production = production;
}

var RULE_PROB = 0.05;

Rule.prototype.checkCondition = function(block) {
	if (block.variable != this.production.predecessor) {
		return false;
	}
	return true;
	return Math.random() < RULE_PROB;
}