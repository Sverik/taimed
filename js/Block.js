/**
 * @param variable {@link #Alphabet}
 */
function Block(variable, dna, parent) {
	this.dna = dna;
	this.variable = variable;
	this.resources = {};
	this.parent = parent;
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
Block.prototype.init = function(containerGroup) {
	this.containerGroup = containerGroup;
	var bitmap = 'variable_a';
	console.log('variable: ' + this.variable);
	if (this.variable == Alphabet.B) {
		bitmap = 'variable_b';
	}
	this.sprite = this.containerGroup.create(0, 0, bitmap);
	this.sprite.tint = Math.random() * 0xffffff;
	this.sprite.height = 20;
	this.sprite.width = 5;
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 1.0;
}
