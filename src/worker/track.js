
function findPattern (patternId, pattern) {
  return pattern.id === patternId;
}

function Track (trackData) {
  for (var key in trackData) {
    this[key] = trackData[key];
  }

  this.patternIndex = 0;

  for (var i = 0; i < this.patterns.length; i++) {
    var patternData = this.patterns[i];
    this.patterns[i] = new Pattern(patternData);

  }

  return this;
}

Track.prototype.releaseCustomTempo = function (patternId) {
  this.getPattern(patternId).releaseCustomTempo(this.tempo);
};

Track.prototype.setCustomTempo = function (tempo, patternId) {
  this.getPattern(patternId).setCustomTempo(tempo);
};

Track.prototype.setTempo = function(tempo) {
  this.tempo = tempo;
  for (var i = 0; i < this.patterns.length; i++) {
    if (this.patterns[i].tempoIsCustom === false) {
      this.patterns[i].setGeneralTempo(tempo);
    }
  }
};

Track.prototype.advancePattern = function() {
  this.patternIndex++;
  if (this.patternIndex === this.patterns.length) {
    this.patternIndex = 0;
  }
};

Track.prototype.check = function (currentTime) {
  var currentPattern = this.patterns[this.patternIndex];

  currentPattern.start();

  var checkResult = currentPattern.check(currentTime);

  if (checkResult.isStopped) {
    this.advancePattern();
  }

  return checkResult.timeToDrop;
};

Track.prototype.getPattern = function(patternId) {
  return this.patterns.find(findPattern.bind(this, patternId));
};

Track.prototype.stop = function() {
  if (!this.isPlaying) {
    return;
  }

  this.isPlaying = true;
  this.patternIndex = 0;
  for (var i = 0, il = this.patterns.length; i < il; i++) {
    this.patterns[i].stop();
  }
};
