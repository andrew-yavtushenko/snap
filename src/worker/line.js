function Line (lineData) {
  for (var key in lineData) {
    this[key] = lineData[key];
  }

  for (var i = 0; i < lineData.notes.length; i++) {
    this.notes[i] = lineData.notes[i];
  }
  this._rhythmIndex = 0;
}

Line.prototype.setNoteVolume = function(noteIdx, volume) {
  this.notes[noteIdx].volume = volume;
};

Line.prototype.start = function() {
  this._noteTime = 0;
  this._isStopped = false;
};

Line.prototype.stop = function() {
  this._noteTime = 0;
  this._rhythmIndex = 0;
  this._isStopped = true;
};

Line.prototype._scheduleNextNote = function (tempo) {

  if (this._rhythmIndex === this.notes.length) {
    this.stop();
  }

  this._noteDuration = timing.note(this.notes[this._rhythmIndex].value, tempo);
  this._noteTime += this._noteDuration;

  this._rhythmIndex++;
};

Line.prototype.check = function (currentTime, props) {
  if (this._noteTime <= currentTime + this._threshold) {
    var currentNoteIndex = this._rhythmIndex;
    this._scheduleNextNote(props.tempo);
    if (!this._isStopped) {
      emitNote(this.notes[currentNoteIndex].bufferIdx, this.notes[currentNoteIndex].volume, props.patternId, props.beatId, props.lineId, currentNoteIndex, this._noteDuration);
    }
  }
  return this._isStopped;
};

