function findBeat (beatId, beat) {
  return beat.id === beatId;
}


function Pattern (properties) {

  for (var key in properties) {
    this[key] = properties[key];
  }

  for (var i = 0; i < this.beats.length; i++) {
    var beatData = this.beats[i];
    this.beats[i] = new Beat(beatData);
  }

  this.beatsIndex = 0;
  this.loopIndex = 0;
  this.isStopped = true;
}

Pattern.prototype.getBeat = function(beatId) {
  return this.beats.find(findBeat.bind(this, beatId));
};

Pattern.prototype.start = function () {
  if (this.isStopped === false) { return; }
  this.isStopped = false;
};

Pattern.prototype.stop = function () {
  this.isStopped = true;
  this.loopIndex = 0;
  this.beatsIndex = 0;
};

Pattern.prototype.advanceBeat = function() {
  this.beatsIndex++;
  if (this.beatsIndex === this.beats.length) {
    this.advancePattern();
    this.beatsIndex = 0;
  }
};

Pattern.prototype.advancePattern = function () {
  this.loopIndex++;
  if (this.loopIndex === this.counter) {
    this.stop();
  }
};

Pattern.prototype.releaseCustomTempo = function (tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].releaseCustomTempo(tempo);
  }
};

Pattern.prototype.setCustomTempo = function (tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setCustomTempo(tempo);
  }
};

Pattern.prototype.setGeneralTempo = function(tempo) {

  if (this.tempoIsCustom) {
    return false;
  }

  this.tempo = tempo;
  for (var i = 0; i < this.beats.length; i++) {
    this.beats[i].setGeneralTempo(tempo);
  }
};

Pattern.prototype.check = function (currentTime) {
  var currentBeat = this.beats[this.beatsIndex];

  currentBeat.start();

  currentBeat.check(currentTime, this.id);

  if (currentBeat.isStopped) {
    this.advanceBeat();
  }

  return {
    isStopped: this.isStopped,
    timeToDrop: currentBeat.isStopped
  };
};

