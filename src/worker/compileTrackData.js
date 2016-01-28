
function sumArrays (arrays, size) {
  var output = new Float32Array(size);

  for (var i = 0; i < output.length; i++) {
    for (var j = 0; j < arrays.length; j++) {
      output[i] += arrays[j][i] || 0;
    }
  }

  return output;
}

function mergeArrays (arrA, arrB, offset) {
  var outputLength = arrA.length + arrB.length - offset;
  var output = new Float32Array(outputLength);

  var subArrA = arrA.subarray(0, arrA.length - offset);

  var mergeA = arrA.subarray(arrA.length - offset);
  var mergeB = arrB.subarray(0, offset);

  var subArrMerge = sumArrays([mergeA, mergeB], offset);
  var subArrB = arrB.subarray(offset);

  output.set(subArrA);
  output.set(subArrMerge, arrA.length - offset);
  output.set(subArrB, arrA.length);

  return output;
}

function noteReducer (lineOutput, note) {

  var offset = note.soundDuration > note.duration
    ? (note.soundDuration - note.duration) * 48
    : 0;

  for (var i = 0; i < lineOutput.channels.length; i++) {
    lineOutput.channels[i] = mergeArrays(lineOutput.channels[i], note.buffer[i], lineOutput.offset);
  }

  lineOutput.offset = offset;

  return lineOutput;
}

function lineReducer (beatOutput, line) {

  var defaultLineData = {
    offset: 0,
    channels: [
      new Float32Array(0),
      new Float32Array(0)
    ]
  };
  var lineData = line.notes.reduce(noteReducer, defaultLineData);

  for (var i = 0; i < beatOutput.channels.length; i++) {
    beatOutput.channels[i] = sumArrays([beatOutput.channels[i], lineData.channels[i]], beatOutput.size);
  }

  return beatOutput;
}

function beatReducer (patternOutput, beat) {

  var beatRealDuration = Math.max(beat.soundDuration, beat.duration);

  var defaultBeatData = {
    size: beatRealDuration * 48,
    channels: [
      new Float32Array(0),
      new Float32Array(0)
    ]
  };

  var beatData = beat.lines.reduce(lineReducer, defaultBeatData);

  for (var i = 0; i < patternOutput.channels.length; i++) {
    patternOutput.channels[i] = mergeArrays(patternOutput.channels[i], beatData.channels[i], patternOutput.offset);
  }


  patternOutput.offset = (beat.soundDuration - beat.duration) * 48;

  return patternOutput;
}

function patternReducer (trackOutput, pattern) {

  var defaultPatternData = {
    offset: 0,
    channels: [
      new Float32Array(0),
      new Float32Array(0)
    ]
  };

  var patternData = pattern.beats.reduce(beatReducer, defaultPatternData);

  for (var i = 0; i < trackOutput.channels.length; i++) {
    trackOutput.channels[i] = mergeArrays(trackOutput.channels[i], patternData.channels[i], trackOutput.offset);
  }

  trackOutput.offset = (pattern.soundDuration - pattern.duration) * 48;

  return trackOutput;
}

function compileTrack (trackObj) {

  var defaultTrackData = {
    offset: 0,
    channels: [
      new Float32Array(0),
      new Float32Array(0)
    ]
  };

  var trackChannels = trackObj.patterns.reduce(patternReducer, defaultTrackData);

  return trackChannels;
}

self.compileTrack = compileTrack;
