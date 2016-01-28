var ab2obj = function(buffer) {
  var str = '';
  var bytes = new Uint16Array(buffer);
  for (var i = 0, buffLen = (bytes.byteLength / 2); i < buffLen; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return JSON.parse(str);
};

function parseMessage (event) {
  var data;
  if (typeof event.data === 'object') {
    data = ab2obj(event.data);
  } else {
    data = JSON.parse(event.data);
  }
  var payload = Player[data.callName](data.payload);

  var response = JSON.stringify({
    callName: data.callName,
    callbackId: data.callbackId,
    payload: payload
  });


  self.postMessage(response);
}

self.addEventListener('message', parseMessage);
