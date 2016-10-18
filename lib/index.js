'use strict';

function KlikAanKlikUit(newStyle, pin, periodusec, repeats) {
  let Driver  = newStyle ? require('./new-style') : require('./old-style');
  return new Driver(pin || 11, periodusec, repeats);
}

module.exports = {
  newStyle : KlikAanKlikUit.bind(null, true),
  oldStyle : KlikAanKlikUit.bind(null, false)
};
