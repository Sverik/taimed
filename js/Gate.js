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
    this.targetCount = 0;
    this.operatorOffset = 48;
    this.operatorWidth = 16;
    this.targetStep = this.operatorOffset + this.operatorWidth;
    this.targetYOffset = 14;
    this.operatorYOffset = 22;
    this.valueYOffset = -30;
    this.confettiDelay = 250;
    this.targets = new Array(); // of TargetNodes
    this.notes = new Array();
    this.targetGroup = targetGroup;
    this.afterDestroy = function() {};
}

Gate.prototype.init = function() {
    var nextNonValueXOffset = 0;
    this.targetCount = this.configuration.length;
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
            var notFilledCount = thisGate.targetCount;
            var debugValues = new Array();
            for (var i = 0 ; i < thisGate.targets.length ; i++) {
                var t = thisGate.targets[i];
                if (t.target.filled) {
                    notFilledCount--;
                    var occupiedValue = t.target.res.customValue;
                    debugValues.push(occupiedValue);
                    switch (t.nodeType) {
                        case NodeTypeEnum.VALUE: expectedValue = occupiedValue; break;
                        case NodeTypeEnum.PLUS: sum += occupiedValue; break;
                        case NodeTypeEnum.MINUS: sum -= occupiedValue; break;
                    }
                }
            }
            if (notFilledCount <= 0 && sum == expectedValue) {
                // disable modification
                thisGate.lock();
                // throw confetti
                confetti(thisGate);
                if (expectedValue > 1) {
                    timer.repeat(thisGate.confettiDelay, expectedValue - 1, confetti, this, thisGate);
                }
                var lockdownTime = thisGate.confettiDelay * (expectedValue - 1);
                // increment score
                score += 10;
                scoreText.text = 'Score: ' + score;
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
    // create new Gate
    this.afterDestroy(this);
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