/*
 * Ported from Randy Simons http://randysimons.nl/ NewRemoteSwitch library v1.0.0 (20121229)
 * by Job Wind <job@monkeystation.nl>
 * rewrite by Robert Klep <robert@klep.name>
 */

'use strict';
const debug = require('debug')('kaku-rpi');
const rpio  = require('rpio');
const HIGH  = rpio.HIGH;
const LOW   = rpio.LOW;

class KlikAanKlikUitNew {

  constructor(pin, periodusec, repeats, pulsewidth) {
    this.pin        = pin        || 11;
    this.periodusec = periodusec || 260;
    this.repeats    = repeats    || 7;
    this.pulsewidth = pulsewidth || 5;

    debug('ctor(pin = %s, periodusec = %s, repeats = %s, pulse width = %s)',
           this.pin, this.periodusec, this.repeats, this.pulsewidth);

    debug('opening pin %s for output', this.pin);
    rpio.open(pin, rpio.OUTPUT, LOW);
  }

  on(address, unit) {
    this.transmit(address, unit, true);
  }

  off(address, unit) {
    this.transmit(address, unit, false);
  }

  dim(address, unit, level) {
    this.transmit(address, unit, 'dim', level);
  }

  groupOn(address) {
    this.group(address, true);
  }

  groupOff(address) {
    this.group(address, false);
  }

  group(address, on) {
    this.transmit(address, 0, on, true);
  }

  transmit(address, unit, value, group) {
    let dimming = value === 'dim';

    // Build data packet.
    let packet = '';

    // 26-bit address
    packet += encode(address, 26);
    
    // Handle dimming command.
    if (dimming) {
      packet += '02';
    } else {
      packet += String(Number(!!group));
      packet += String(Number(!!value));
    }

    // 4-bit unit number.
    packet += encode(unit, 4);

    // Add dim-level if we're dimming.
    if (dimming) {
      packet += encode(group, 4);
    }

    debug('sending packet of length %s: %s', packet.length, packet);

    let pin        = this.pin;
    let periodusec = this.periodusec;
    let pulsewidth = this.pulsewidth;
    for (let i = 0; i < this.repeats; i++) {
      this.sendStartPulse();
      packet.split('').forEach(bit => {
        switch(bit) {
          case '0':
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec);
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec * pulsewidth);
            break;
          case '1':
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec * pulsewidth);
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec);
            break;
          case '2':
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec);
            rpio.write(pin, HIGH);
            rpio.usleep(periodusec);
            rpio.write(pin, LOW);
            rpio.usleep(periodusec);
            break;
        }
      });
      this.sendStopPulse();
    }
  }

  sendStartPulse() {
    rpio.write(this.pin, HIGH);
    rpio.usleep(this.periodusec);
    rpio.write(this.pin, LOW);
    rpio.usleep(this.periodusec * 10 + (this.periodusec >> 1)); // Actually 10.5T insteat of 10.44T. Close enough.
  }

  sendStopPulse() {
    rpio.write(this.pin, HIGH);
    rpio.usleep(this.periodusec);
    rpio.write(this.pin, LOW);
    rpio.usleep(this.periodusec * 40);
  }
}

function encode(value, len) {
  let n = value.toString(2);
  return new Array(len + 1).join('0').substr(n.length) + n;
}

module.exports = KlikAanKlikUitNew;
