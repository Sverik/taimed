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
	
	var block = this._addChild(variable, dna, this.seedBlock, 0);
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
	// traverse in reverse, otherwise removing blocks in _produce will cause problems
	var i = thisPlant.blocks.length;
	while (i--) {
		var b = thisPlant.blocks[i];
		b.dna.rules.forEach(function(r){
			if (r.checkCondition(b)) {
				thisPlant._produce(r, b, newBlocks);
			}
		});
	}
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
Plant.prototype._addChild = function(variable, dna, parent, angle) {
	var group = game.add.group();
	group.debugId = "id" + (++plantIdSeq);
	group.x = 0;
	group.y = -15;
	switch (parent.variable) {
	case Alphabet.X:
	case Alphabet.Y:
	case Alphabet.Z:
		group.y = 0;
		break;
	}
	group.rotation = angle;
//	console.log("in parent.group before:");
//	parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
//	});
	parent.containerGroup.add(group);
//	console.log("in parent.group after:");
//	parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
//	});
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
//	predBlock.parent.containerGroup.forEach(function(group) {
//		console.log(group["debugId"] + ":");
//		console.log(group);
//	});
	// Remove
	predBlock.parent.containerGroup.remove(predBlock.containerGroup);
	this.blocks.splice(this.blocks.indexOf(predBlock), 1);

	// Add new children
//	console.log('production happens');
	// after the loop this will be the last block, it will get the children of predBlock
	var block = null;
	var parentsStack = new Array();
	var parentBlock = predBlock.parent;
	// Keep the rotation of the block that is being replaced.
	var angle = predBlock.containerGroup.rotation;
	for (var i = 0 ; i < rule.production.successor.length ; i++) {
		switch (rule.production.successor[i]) {
		case Alphabet.PUSH:
			parentsStack.push(parentBlock);
			break;
		case Alphabet.POP:
			parentBlock = parentsStack.pop();
			break;
		case Alphabet.LEFT:
			// TODO: the LEFT/RIGHT paradigm does not comply with angles being in the DNA
			angle -= parentBlock.dna.angles[0];
			break;
		case Alphabet.RIGHT:
			// TODO: the LEFT/RIGHT paradigm does not comply with angles being in the DNA
			angle += parentBlock.dna.angles[0];
			break;
		default:
			block = this._addChild(rule.production.successor[i], predBlock.dna, parentBlock, angle);
			angle = 0;
			newBlocks.push(block);
			parentBlock = block;
			break;
		}
	}
	// If angle is not 0 then add it to the children.
	// Move children to new parent
	var toBeMoved = new Array();
	predBlock.containerGroup.iterate("backRefBlockExists", true, Phaser.Group.RETURN_NONE, function(childGroup) {
		toBeMoved.push(childGroup);
	}, this);
	// Group's y depends on the parent block type. If it's invisible then y must be 0, otherwise -15.
	var newY = -15;
	switch (block.variable) {
	case Alphabet.X:
	case Alphabet.Y:
	case Alphabet.Z:
		newY = 0;
		break;
	}
	toBeMoved.forEach(function(childGroup) {
		block.containerGroup.add(childGroup);
		childGroup.y = newY;
		childGroup.backRefBlock.parent = block;
		childGroup.rotation += angle;
	});
	
	// Destroy predBlock
	predBlock.containerGroup.destroy(true);
}

Plant.prototype.getSequence = function() {
	return this.seedBlock.getSequence();
}
