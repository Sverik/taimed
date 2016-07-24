var UPDATE_PROB = -0.1;

function Plant(plantsGroup) {
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
	this.seedBlock = new Block(Alphabet.SEED, new DNA(), null, this);
	var seedGroup = game.add.group();
	seedGroup.debugId = "seed";
	seedGroup.x = x;
	seedGroup.y = 550;
	this.plantsGroup.add(seedGroup);
	this.seedBlock.init(seedGroup);
	this.blocks.push(this.seedBlock);
	
	var block = this._addChild(variable, dna, this.seedBlock);
	this.blocks.push(block);
}

Plant.prototype.update = function() {
	if (Math.random() < UPDATE_PROB) {
		this._executeRules();
	}
}

Plant.prototype._executeRules = function() {
	var thisPlant = this;
	var newBlocks = new Array();
	thisPlant.blocks.forEach(function(b){
//		console.log("checking block with sprite " + b.sprite["debugId"]);
		b.dna.rules.forEach(function(r){
			if (r.checkCondition(b)) {
				thisPlant._produce(r, b, newBlocks);
			}
		});
	});
	this.blocks = this.blocks.concat(newBlocks);
//	console.log("new blocks count: " + newBlocks.length);
//	console.log("blocks count: " + this.blocks.length);
}

/**
 * 
 * @param variable {@link #Alphabet}
 * @param dna {@link #DNA}
 * @param parent {@link #Block}
 */
var plantIdSeq = 0;
Plant.prototype._addChild = function(variable, dna, parent) {
	var group = game.add.group();
	group.debugId = "id" + (++plantIdSeq);
	group.x = 0;
	group.y = -20;
	// TODO: for testing only
	group.rotation = Math.sign(0.5 - Math.random()) * dna.angles[0];
//	console.log("in parent.group before:");
	parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
	});
	parent.containerGroup.add(group);
//	console.log("in parent.group after:");
	parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
	});
	var block = new Block(variable, dna, parent, this);
	block.init(group);
	return block;
}

/**
 * 
 * @param rule {@link #Rule}
 * @param predBlock predecessor {@link #Block} block that is being replaced
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
//	console.log("in predBlock(" + predBlock.sprite["debugId"] + ").parent.containerGroup before removal:");
	predBlock.parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
	});
	// Remove
	predBlock.parent.containerGroup.remove(predBlock.containerGroup);
	this.blocks.splice(this.blocks.indexOf(predBlock), 1);

	// Add new children
//	console.log('production happens');
	// after the loop this will be the last block, it will get the children of predBlock
	var block = null;
	var parentBlock = predBlock.parent;
	for (var i = 0 ; i < rule.production.successor.length ; i++) {
		block = this._addChild(rule.production.successor[i], predBlock.dna, parentBlock);
		newBlocks.push(block);
		parentBlock = block;
	}

	// Move children to new parent
	var toBeMoved = new Array();
	predBlock.containerGroup.iterate("backRefBlockExists", true, Phaser.Group.RETURN_NONE, function(childGroup) {
		toBeMoved.push(childGroup);
	}, this);
	toBeMoved.forEach(function(childGroup) {
		block.containerGroup.add(childGroup);
		childGroup.backRefBlock.parent = block;
	});
	
	// Destroy predBlock
	predBlock.containerGroup.destroy(true);
}

Plant.prototype.getSequence = function() {
	return this.seedBlock.getSequence();
}
