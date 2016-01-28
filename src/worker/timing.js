var performance = self.performance;

var time = performance ? performance : Date;

function getNow () {
  return time.now() | 0;
}

var timing = { //eslint-disable-line no-unused-vars
  startTime: getNow(),
  note: function (noteValue, tempo) {
    return (60 / tempo * 4000 / noteValue) | 0;
  },
  current: function (){
    return getNow() - this.startTime;
  }
};
