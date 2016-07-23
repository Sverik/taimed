function Rule(production) {
	this.production = production;
}

var RULE_PROB = 0.05;

Rule.prototype.checkCondition = function(block) {
	return Math.random() < RULE_PROB;
}