'use strict';

var worker = new Worker(require('../worker/main.js'));
var PlayNote = require('./playNote');

var callbacks = {};
var callbacksCounter = 0;

function obj2buf (obj) {
  var str = JSON.stringify(obj);
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function addCallback (callback) {
  callbacksCounter++;
  callbacks[callbacksCounter] = callback;
  return callbacksCounter;
}

function parseWorkerMessage (event) {
  var data = JSON.parse(event.data);
  if (data.callName === 'emitNote') {
    PlayNote.apply(null, data.payload);
    return;
  }
  if (typeof callbacks[data.callbackId] === 'function') { callbacks[data.callbackId].call(null, data.payload); }
  delete callbacks[data.callbackId];
}

function compileCall (callName, payload, callback) {
  var callbackId = addCallback(callback);
  return {
    callbackId: callbackId,
    payload: payload,
    callName: callName
  };
}

function bufferCall () {
  var data = compileCall.apply(null, arguments);
  var buffer = obj2buf(data);
  worker.postMessage(buffer, [buffer]);
}

function stringCall () {
  var data = compileCall.apply(null, arguments);
  worker.postMessage(JSON.stringify(data));
}

// actual calls below

function init (callback) {
  stringCall('init', {}, callback);
}

function startPlayback (callback) {
  stringCall('start', {}, callback);
}

function stopPlayback (callback) {
  stringCall('stop', {}, callback);
}

function setTrack (track, callback) {
  bufferCall('setTrack', {
    track: track
  }, callback);
}

function setNoteVolume (patternId, beatId, lineId, noteId, volume, callback) {
  stringCall('setNoteVolume', {
    patternId: patternId,
    beatId: beatId,
    lineId: lineId,
    noteId: noteId,
    volume: volume
  }, callback);
}

function setTrackTempo (tempo, callback) {
  stringCall('setTrackTempo', {
    tempo: tempo
  }, callback);
}

function setPatternCustomTempo (tempo, patternId, callback) {
  stringCall('setPatternCustomTempo', {
    tempo: tempo,
    patternId: patternId
  }, callback);
}

function releasePatternCustomTempo (patternId, callback) {
  stringCall('releasePatternCustomTempo', {
    patternId: patternId
  }, callback);
}

worker.addEventListener('message', parseWorkerMessage);

module.exports = {
  init: init,
  setTrack: setTrack,
  startPlayback: startPlayback,
  stopPlayback: stopPlayback,
  setNoteVolume: setNoteVolume,
  setTrackTempo: setTrackTempo,
  setPatternCustomTempo: setPatternCustomTempo,
  releasePatternCustomTempo: releasePatternCustomTempo
};
