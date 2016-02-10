/**
 * Sample configuration:
 * [
 *  {
 *      nodeType: NodeTypeEnum.PLUS,
 *      value: 7
 *  },
 *  {
 *      nodeType: NodeTypeEnum.PLUS,
 *  },
 *  {
 *      nodeType: NodeTypeEnum.VALUE,
 *      value: 10
 *  }
 * ]
 */
function Gate(configuration, x, y, targetGroup) {
    this.configuration = configuration;
    this.x = x;
    this.y = y;
    this.operatorOffset = 48;
    this.operatorWidth = 16;
    this.targetStep = this.operatorOffset + this.operatorWidth;
    this.targetYOffset = 14;
    this.operatorYOffset = 22;
    this.valueYOffset = -30;
    this.confettiDelay = 350;
    this.targets = new Array(); // of TargetNodes
    this.notes = new Array();
    this.targetGroup = targetGroup;
    this.value = -1;
}

Gate.prototype.init = function() {
    var nextNonValueXOffset = 0;
    for (var i = 0 ; i < this.configuration.length ; i++) {
        var nodeConf = this.configuration[i];
        // Target coordinates
        var tx = 0;
        var ty = 0;
        // prefix with operator, if needed
        if (nextNonValueXOffset != 0) {
            var operatorString = '';
            switch (nodeConf.nodeType) {
                case NodeTypeEnum.PLUS: operatorString = '+'; break;
                case NodeTypeEnum.MINUS: operatorString = '-'; break;
                case NodeTypeEnum.VALUE: operatorString = '='; break;
            }
            var operator = game.add.text(this.x + nextNonValueXOffset, this.y + this.operatorYOffset, operatorString, { fontSize: '32px', fill: '#000' });
            nextNonValueXOffset += this.operatorWidth;
            this.notes.push(operator);
            notesGroup.addChild(operator);
        }
        tx = this.x + nextNonValueXOffset;
        nextNonValueXOffset += this.operatorOffset;
        ty = this.y + this.targetYOffset;
        
        // Create the target
        var target = new Target(this.targetGroup).init(tx, ty);
        var thisGate = this;
        target.onUpdate = function(res) {
            var expectedValue = 0;
            var sum = 0;
            thisGate.targets.forEach(function(t) {
                var target = t.target;
                if (target.filled) {
                    var occupiedValue = target.res.customValue;
                    console.log("g@" + thisGate.x + "t" + target.sprite.x + " nodeType=" + t.nodeType + ", ov=" + occupiedValue);
                    switch (t.nodeType) {
                        case NodeTypeEnum.VALUE: expectedValue = occupiedValue; break;
                        case NodeTypeEnum.PLUS: sum += occupiedValue; break;
                        case NodeTypeEnum.MINUS: sum -= occupiedValue; break;
                    }
                }
            });
            console.log("g@" + thisGate.x + ", s=" + sum + ", expct=" + expectedValue);
            if (sum == expectedValue) {
                // we know the gate value!
                thisGate.value = expectedValue;
                // disable modification
                thisGate.lock();
                // throw confetti
                confetti(thisGate);
                timer.repeat(thisGate.confettiDelay, expectedValue - 1, confetti, this, thisGate);
                var lockdownTime = thisGate.confettiDelay * (expectedValue - 1);
                // destroy afterwards
                timer.add(lockdownTime, function() {
                    thisGate.destroy();
                }, thisGate);
            }
        };
        this.targets.push(new TargetNode(nodeConf.nodeType, target));
        
        // If value is defined, fill it with a res, and lock it
        if (nodeConf.value !== undefined) {
            var res = createRes(nodeConf.value);
            target.putRes(res);
            target.lock();
        }
    }
    
    return this;
}

Gate.prototype.lock = function() {
    // Lock targets and ress.
    this.targets.forEach(function(t) {
        var target = t.target;
        target.lock();
        if (target.filled && target.res) {
            target.res.input.draggable = false;
        }
    });
    console.log("g@" + this.x + " locked");
}

Gate.prototype.destroy = function() {
    // destroy targets and ress
    this.targets.forEach(function(t) {
        var target = t.target;
        if (target.filled && target.res) {
            target.res.destroy();
        }
        target.destroy();
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

var NodeTypeEnum = {
    VALUE: 1,
    PLUS: 2,
    MINUS: 3,
};

function TargetNode(nodeType, target) {
    this.nodeType = nodeType;
    this.target = target;
}