function Block(blockType, dna) {
	this.dna = dna;
	this.blockType = blockType;
	this.resources = {};
	this.plant = null;
	this.containerGroup = null;
	this.sprite = null;
}

/**
 * 
 * @param plant
 * @param containerGroup Phaser.Group
 * @param x
 * @param y
 */
Block.prototype.init = function(plant, containerGroup, x, y) {
	this.plant = plant;
	this.containerGroup = containerGroup;
	this.sprite = this.containerGroup.create(x, y, 'ground');
	this.sprite.tint = Math.random() * 0xffffff;
	this.sprite.height = 20;
	this.sprite.width = 5;
}
