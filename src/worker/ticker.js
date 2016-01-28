var _ticker;

function initTicker () { //eslint-disable-line no-unused-vars
  var intervalId;
  var startTime;
  var currentTime;
  var currentTrack;
  var inProgress = false;

  function schedule() {
    currentTime = timing.current();

    currentTime -= startTime;
    var timeToDrop = currentTrack.check(currentTime);

    if (timeToDrop) {
      startTime = timing.current();
    }
  }

  function stop() {
    if (!inProgress) { return; }

    clearInterval(intervalId);
    currentTrack.stop();
    currentTrack.isPlaying = false;
    inProgress = false;
    console.profileEnd('track');
  }

  function start (track) {
    if (inProgress) { return; }

    console.profile('track');
    currentTrack = track;
    currentTrack.isPlaying = true;
    inProgress = true;
    startTime = timing.current();
    intervalId = setInterval(schedule, 0);
  }
  if (!_ticker) {
    _ticker = {
      start: start,
      stop: stop
    };
  }

  return _ticker;
}
