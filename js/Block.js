/**
 * @param variable {@link #Alphabet}
 */
function Block(variable, dna, parent, plant) {
	this.dna = dna;
	this.variable = variable;
	this.resources = {};
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
	console.log('variable: ' + this.variable);
	if (this.variable == Alphabet.B) {
		bitmap = 'variable_b';
	}
	this.sprite = this.containerGroup.create(0, 0, bitmap);
	this.sprite.debugId = "id" + (++blockIdSeq);
	this.sprite.inputEnabled = true;
	this.sprite.input.useHandCursor = true;
//	this.sprite.tint = Math.random() * 0xffffff;
	this.sprite.height = 20;
	this.sprite.width = 5;
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 1.0;
	
	var thisBlock = this;
	
	// TODO: DEBUGGING
	this.sprite.events.onInputUp.add(function(obj, pointer) {
		if (pointer.button == 0) {
			console.log("producing");
			console.log(thisBlock.containerGroup["debugId"]);
			thisBlock.plant._produce(thisBlock.dna.rules[0], thisBlock, thisBlock.plant.blocks);
			console.log(thisBlock.plant.blocks.length);
		} else {
			console.log("adding");
			thisBlock.plant._addChild(Alphabet.B, thisBlock.dna, thisBlock);
		}
	});
}
