/**
 * @param variable {@link #Alphabet}
 */
function Block(variable, dna, parent, plant) {
	this.dna = dna;
	this.variable = variable;
	this.resources = new Resources();
	this.parent = parent;
	this.plant = plant;
	this.containerGroup = null;
	this.sprite = null;
}

var blockIdSeq = 1000;
/**
 * 
 * @param plant
 * @param containerGroup Phaser.Group
 * @param x
 * @param y
 */
Block.prototype.init = function(containerGroup) {
	this.containerGroup = containerGroup;
	this.containerGroup.backRefBlockExists = true;
	this.containerGroup.backRefBlock = this;
	var bitmap = 'variable_a';
//	console.log('variable: ' + this.variable);
	if (this.variable == Alphabet.B) {
		bitmap = 'variable_b';
	}
	this.sprite = this.containerGroup.create(0, 0, bitmap);
	this.sprite.debugId = "id" + (blockIdSeq++);
	this.sprite.inputEnabled = true;
	this.sprite.input.useHandCursor = true;
	this.sprite.height = 15;
	this.sprite.width = 5;
	switch (this.variable) {
	case Alphabet.X:
	case Alphabet.Y:
	case Alphabet.Z:
//		this.sprite.tint = 0x000000;
		this.sprite.height = 0;
		this.sprite.width = 0;
		break;
	}
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 1.0;
	
	// TODO: DEBUGGING
	var thisBlock = this;
	
	// TODO: DEBUGGING
	this.sprite.events.onInputUp.add(function(obj, pointer) {
		if (pointer.button == 0) {
//			console.log("producing");
//			console.log(thisBlock.containerGroup["debugId"]);
			thisBlock.dna.rules.forEach(function(rule){
				if (rule.production.predecessor.variable == thisBlock.variable) {
					thisBlock.plant._produce(rule, thisBlock, thisBlock.plant.blocks);
				}
			});
//			console.log(thisBlock.plant.blocks.length);
		} else {
//			console.log("adding");
			var block = thisBlock.plant._addChild(Alphabet.B, thisBlock.dna, thisBlock, (Math.random() - 0.5) * Math.PI);
			thisBlock.plant.blocks.push(block);
		}
	});
	
	// TODO: DEBUGGING
	this.sprite.events.onInputOver.add(function(obj) {
		var y = 0;
		var step = 15;
		game.debug.text("group : " + thisBlock.containerGroup["debugId"], 250, y+=step);
		game.debug.text("sprite: " + thisBlock.sprite["debugId"], 250, y+=step);
		game.debug.text("groupR: " + thisBlock.containerGroup.rotation, 250, y+=step);
		if (thisBlock.parent != null) {
			game.debug.text("parent: " + thisBlock.parent.containerGroup["debugId"], 250, y+=step);
		}
	});
}

Block.prototype.getSequence = function() {
	var mySubSeq = (this.variable == Alphabet.SEED ? "" : Alphabet.name(this.variable));
	var branching = false;
	if (this.containerGroup.countLiving() > 2) {
		branching = true;
	}
	this.containerGroup.iterate("backRefBlockExists", true, Phaser.Group.RETURN_NONE, function(childGroup) {
		if (branching) {
			mySubSeq += "[";
		}
		var angle = childGroup["backRefBlock"].dna.angles[0];
		var rotString = "";
		var sign = "+";
		if (childGroup.rotation < 0) {
			sign = "-";
		}
		var rot = Math.abs(childGroup.rotation);
		while (rot > 0) {
			rotString += sign;
			rot -= angle;
		}
		mySubSeq += rotString + childGroup["backRefBlock"].getSequence();
		if (branching) {
			mySubSeq += "]";
		}
	}, this);
	return mySubSeq;
}
