function Target(targetGroup, isDispenser) {
    this.sprite = null;
    this.res = null;
    this.filled = false;
    this.locked = false;
    this.isDispenser = isDispenser;
    this.targetGroup = targetGroup;
}

Target.prototype.init = function(x, y) {
    this.sprite = this.targetGroup.create(x, y, 'asukoht');
    this.sprite.body.immovable = true;
    this.sprite.target = this;
    return this;
}

Target.prototype.onUpdate = function(){
}

Target.prototype.lock = function(){
    this.locked = true;
    if (this.res) {
        var thisRes = this.res;
        thisRes.frame = 1;
        thisRes.input.disableDrag();
        thisRes.input.useHandCursor = false;
        this.res.events.onInputOut.add(function() {
            thisRes.input.useHandCursor = false;
        });
    }
}

Target.prototype.destroy = function(){
    this.sprite.destroy();
}

Target.prototype.putRes = function(res){
    res.x = this.sprite.x;
    res.y = this.sprite.y;
    // set old target empty, if it existed
    var oldTarget = null;
    if (res.atTarget) {
        oldTarget = res.atTarget;
        oldTarget.filled = false;
        oldTarget.res = null;
    }
    // connect to new target
    res.atTarget = this;
    // mark it as filled
    this.filled = true;
    this.res = res;
    // call updates on this and old target
    this.onUpdate(res);
    if (oldTarget != null) {
        oldTarget.onUpdate(null);
    }
}

Target.prototype.getWidth = function() {
	return this.sprite.width;
}
