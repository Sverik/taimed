function Rule(production) {
	this.production = production;
}

Rule.prototype.checkCondition = function(block) {
	return Math.random() < 0.05;
}