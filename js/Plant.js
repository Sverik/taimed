function Plant(game, plantsGroup) {
	this.game = game;
	this.blocks = new Array();
	this.plantsGroup = plantsGroup;
	this.seedBlock = null;
}

/**
 * 
 * @param dna {@link #DNA}
 * @param variable {@link #Alphabet}
 * @param x float, position
 */
Plant.prototype.init = function(dna, variable, x) {
	this.seedBlock = new Block(Alphabet.SEED, new DNA(), null);
	var seedGroup = this.game.add.group();
	seedGroup.x = x;
	seedGroup.y = 550;
	this.plantsGroup.add(seedGroup);
	this.seedBlock.init(seedGroup);
	this.blocks.push(this.seedBlock);
	
	var block = this._addChild(variable, dna, this.seedBlock);
	this.blocks.push(block);
}

Plant.prototype.update = function() {
	var thisPlant = this;
	if (Math.random() < 0.1) {
		var newBlocks = new Array();
		thisPlant.blocks.forEach(function(b){
			b.dna.rules.forEach(function(r){
				if (r.checkCondition(b)) {
					thisPlant._produce(r, b, newBlocks);
				}
			});
		});
		this.blocks = this.blocks.concat(newBlocks);
		console.log("blocks count: " + this.blocks.length);
	}
}

/**
 * 
 * @param variable {@link #Alphabet}
 * @param dna {@link #DNA}
 * @param parent {@link #Block}
 */
Plant.prototype._addChild = function(variable, dna, parent) {
	var group = this.game.add.group();
	group.x = 0;
	group.y = -20;
	// TODO: for testing only
	group.rotation = Math.PI / 4.5;
	parent.containerGroup.add(group);
	var block = new Block(variable, dna, parent);
	block.init(group);
	return block;
}

/**
 * 
 * @param rule {@link #Rule}
 * @param predBlock predecessor {@link #Block}
 * @param newBlocks Array of new Block/s that are created
 */
Plant.prototype._produce = function(rule, predBlock, newBlocks) {
	/*
	 * Remove predBlock from predBlock.parent.
	 * Apply production rule.
	 * Figure out, what should be the new position of the child groups.
	 * Rotate and translate child groups accordingly.
	 * Move all children of predBlock to the last successor.
	 */
	console.log('production happens');
	var block = this._addChild(rule.production.successor[0], predBlock.dna, predBlock);
	newBlocks.push(block);
}
