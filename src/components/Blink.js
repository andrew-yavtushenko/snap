'use strict';

function blink (patternId, beatId, lineId, noteId, duration) {
  var event = new CustomEvent('blink', {
    'detail': {
      patternId: patternId,
      beatId: beatId,
      lineId: lineId,
      noteId: noteId,
      duration: duration
    }
  });

  window.dispatchEvent(event);
}

module.exports = blink;
