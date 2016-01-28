function emitNote (bufferIdx, gain, patternId, beatId, lineId, noteId, duration) { //eslint-disable-line no-unused-vars

  if (gain > 0) {
    var data = JSON.stringify({
      callName: 'emitNote',
      payload: [bufferIdx, gain, patternId, beatId, lineId, noteId, duration]
    });
    postMessage(data);
  }
}
