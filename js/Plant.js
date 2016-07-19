function Plant(game, plantsGroup) {
	this.game = game;
	this.blocks = new Array();
	this.plantsGroup = plantsGroup;
	this.myGroup = null;
}

/**
 * 
 * @param dna {@link #DNA}
 * @param blockType {@link #BlockType}
 * @param x float, position
 */
Plant.prototype.init = function(dna, blockType, x) {
	var block = new Block(blockType, dna);
	this.myGroup = this.game.add.group();
	this.plantsGroup.add(this.myGroup);
	this.myGroup.x = x;
	this.myGroup.y = 550;
	block.init(this, this.myGroup, 0, 0);
	this.blocks.push(block);
}

Plant.prototype.update = function() {
	if (Math.random() < 0.1) {
		var newBlocks = new Array();
		this.blocks.forEach(function(b){
			b.dna.rules.forEach(function(r){
				if (r.checkCondition(b)) {
					console.log('happens');
					var childGroup = this.game.add.group();
					b.containerGroup.add( childGroup );
					childGroup.x = 0;
					childGroup.y = -20;
					var block = new Block( b.blockType, b.dna );
					block.init(this, childGroup, 0, 0);
					newBlocks.push(block);
				}
			});
		});
		this.blocks = this.blocks.concat(newBlocks);
		console.log("blocks count: " + this.blocks.length);
	}
}