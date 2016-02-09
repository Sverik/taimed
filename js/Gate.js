function Gate(value, x, y, targetGroup) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.operatorOffset = 48;
    this.operatorWidth = 16;
    this.targetStep = this.operatorOffset + this.operatorWidth;
    this.targetYOffset = 14;
    this.operatorYOffset = 22;
    this.valueYOffset = 0;
    this.confettiDelay = 350;
    this.targets = new Array();
    this.inputCount = 0;
    this.notes = new Array();
    this.targetGroup = targetGroup;
}

Gate.prototype.init = function(inputCount) {
    this.inputCount = inputCount;
    var valueText = game.add.text(this.x + (inputCount * this.targetStep - this.operatorWidth) / 2, this.y + this.valueYOffset, '' + this.value + ' =', { fontSize: '32px', fill: '#000' });
    valueText.anchor.set(0.5);
    this.notes.push(valueText);
    notes.addChild(valueText);
    for (var i = 0 ; i < inputCount ; i++) {
        var target = new Target(this.targetGroup).init(this.x + i * this.targetStep, this.y + this.targetYOffset);
        if (i < inputCount - 1) {
            // Add a + sign
            var operator = game.add.text(this.x + i * this.targetStep + this.operatorOffset, this.y + this.operatorYOffset, '+', { fontSize: '32px', fill: '#000' });
            this.notes.push(operator);
            notes.addChild(operator);
        }
        var thisGate = this;
        target.onUpdate = function(res) {
            var sum = 0;
            thisGate.targets.forEach(function(t) {
                if (t.filled) {
                    sum += t.res.customValue;
                }
            });
            console.log("g@" + thisGate.x + ", s=" + sum);
            if (sum == thisGate.value) {
                // disable modification
                thisGate.lock();
                // throw confetti
                confetti(thisGate);
                timer.repeat(thisGate.confettiDelay, thisGate.value - 1, confetti, this, thisGate);
                var lockdownTime = thisGate.confettiDelay * (thisGate.value - 1);
                // destroy afterwards
                timer.add(lockdownTime, function() {
                    thisGate.destroy();
                }, thisGate);
            }
        };
        this.targets.push(target);
    }
    return this;
}

Gate.prototype.lock = function() {
    // Lock targets and ress.
    this.targets.forEach(function(t) {
        t.lock();
        if (t.filled && t.res) {
            t.res.input.draggable = false;
        }
    });
    console.log("g@" + this.x + " locked");
}

Gate.prototype.destroy = function() {
    // destroy targets and ress
    this.targets.forEach(function(t) {
        if (t.filled && t.res) {
            t.res.destroy();
        }
        t.destroy();
    });
    // destroy text components
    this.notes.forEach(function(n) {
        n.destroy();
    });
    // increment score
    score += 10;
    scoreText.text = 'Score: ' + score;
    // create new Gate
    new Gate(Math.floor(Math.random() * 6) + 5, this.x, this.y, this.targetGroup).init((Math.random() > 0.5 ? 2 : 3));
}
