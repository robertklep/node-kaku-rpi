'use strict';
const debug = require('debug')('kaku-rpi');
const rpio  = require('rpio');

function KlikAanKlikUit(pin, periodusec, repeats, pulsewidth) {
  pin = pin || 11;

  // Open pin for output.
  debug('opening pin %s for output', pin);
  rpio.open(pin, rpio.OUTPUT, rpio.LOW);

  // Create drivers.
  let oldStyle = new (require('./old-style'))(pin, periodusec, repeats, pulsewidth);
  let newStyle = new (require('./new-style'))(pin, periodusec, repeats, pulsewidth);

  // Wrap driver methods.
  let methods = {};
  [ 'on', 'off', 'switch', 'dim', 'groupOn', 'groupOff', 'transmit' ].forEach(method => {
    methods[method] = function(address) {
      // Determine driver based on addressing.
      let driver = typeof address === 'number' ? newStyle : oldStyle;
      if (! driver[method]) {
        throw Error(`method '${ method }' not supported by driver`);
      }
      return driver[method].apply(driver, arguments);
    };
  });
  return methods;
}

module.exports = KlikAanKlikUit;
