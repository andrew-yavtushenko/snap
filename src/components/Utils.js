Array.prototype.move = function (oldIndex, newIndex) {
  if (newIndex >= this.length) {
    var k = newIndex - this.length;
    while ((k--) + 1) {
      this.push(undefined);
    }
  }
  this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
  return this; // for testing purposes
};

function getParameterByName (searchString, name) {
  var regex, results;

  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  results = regex.exec(searchString);

  if (!results) {
    return '';
  }
  return decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function buildLineNotes (pattern, bufferIdx, subDivision) {
  var arrLength = Math.ceil(pattern.beat * subDivision / pattern.noteValue);

  var arr = new Array(0);

  for (var i = 0; i < arrLength; i++) {
    arr.push(i);
  }

  var notes = arr.map(function (num, key) {
    var correctNote;
    if (pattern.beat * subDivision % pattern.noteValue !== 0 &&
        ++key * subDivision > Math.floor(pattern.beat * subDivision / pattern.noteValue) * subDivision) {
      correctNote = pattern.availableSubDivisions.find(function (availableSubDivision) {
        if (availableSubDivision === subDivision * 2) {
          return availableSubDivision;
        }
      });
    } else {
      correctNote = subDivision;
    }
    return {
      value: correctNote,
      volume: 0,
      bufferIdx: bufferIdx,
      isCurrent: false
    };
  });
  return notes;
}

function clone (obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  var temp = new obj.constructor(obj);
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = clone(obj[key]);
    }
  }
  return temp;
}


module.exports = {
  buildLineNotes: buildLineNotes,
  clone: clone,
  getParameterByName: getParameterByName
};
