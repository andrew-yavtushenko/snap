function Beat (beatData) {

  for (var key in beatData) {
    this[key] = beatData[key];
  }

  for (var i = 0; i < this.lines.length; i++) {
    this.lines[i] = new Line(this.lines[i]);
  }
  return this;
}

Beat.prototype.releaseCustomTempo = function(tempo) {
  this.tempoIsCustom = false;
  this.tempo = tempo;
};

Beat.prototype.setCustomTempo = function(tempo) {
  this.tempoIsCustom = true;
  this.tempo = tempo;
};

Beat.prototype.setGeneralTempo = function(tempo) {
  if (!this.tempoIsCustom) {
    this.tempo = tempo;
  }
};

Beat.prototype.check = function(currentTime, patternId) {

  var props = {
    tempo: this.tempo,
    patternId: patternId,
    beatId: this.id,
    lineId: 0
  };

  var result = this.lines[0].check(currentTime, props);
  if (result) {
    this.stop();
  } else {
    for (var i = 1, il = this.lines.length; i < il; i++) {
      props.lineId = i;
      this.lines[i].check(currentTime, props);
    }
  }
  return this.isStopped;
};

Beat.prototype.start = function() {
  if (this.isStopped) {
    this.isStopped = false;
    for (var i = 0, il = this.lines.length; i < il; i++) {
      this.lines[i].start();
    }
  }
};

Beat.prototype.stop = function() {
  this.isStopped = true;
  for (var i = 0, il = this.lines.length; i < il; i++) {
    this.lines[i].stop();
  }
};
Beat.prototype.clone = function (full) {
  var clone = new this.constructor(this);
  clone.id = full ? uuid.create().hex : this.id;

  for (var i = 0; i < this.lines.length; i++) {
    var line = this.lines[i];
    clone.addLine(line.bufferIdx, line.subDivision);
    for (var j = 0; j < line.notes.length; j++) {
      var str = JSON.stringify(line.notes[j]);
      clone.lines[i].notes[j] = JSON.parse(str);
    }
  }
  return clone;
};
