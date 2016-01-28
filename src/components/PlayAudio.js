module.exports = function () {

  var _snd = false;

  function playAudio(src) {
    if (!_snd)
      _snd = new Audio();
    else
      $(_snd).empty();

    for (var i = 0; i < src.length; i++) {
      var source = document.createElement('source');
      source.type = src[i].type;
      source.src = src[i].src;
      _snd.appendChild(source);
    }

    _snd.load(); // Needed on safari / idevice
    _snd.play();
  };

  var playAudio = function () {
    var src = [
      { src: "/path/to/audio.wav", type: "audio/vnd.wave" },
      { src: "/path/to/audio.ogg", type: "application/ogg; codecs=vorbis" },
      { src: "/path/to/audio.mp3", type: "audio/mpeg" }
    ];
    playAudio(src);
  };

  return {
    playAudio: playAudio,
    // more play functions here
  };
};
