/*
 * Ported from Randy Simons http://randysimons.nl/ NewRemoteSwitch library v1.0.0 (20121229)
 * by Job Wind <job@monkeystation.nl>
 * minor changes by Robert Klep <robert@klep.name>
 */

'use strict';
const rpio = require('rpio');

class KlikAanKlikUitNew {

  constructor(pin, periodusec, repeats) {
    this.pin        = pin        || 11;
    this.periodusec = periodusec || 260;
    this.repeats    = repeats    || 3;

    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  }

  on(address, unit) {
    this.switch(address, unit, true);
  }

  off(address, unit) {
    this.switch(address, unit, false);
  }

  switch(address, unit, switchOn, isGroup) {
    for (let i = this.repeats; i >= 0; i--) {
      this.sendStartPulse();
      this.sendAddress(address);
      this.sendBit(isGroup === true);
      this.sendBit(switchOn);
      this.sendUnit(unit);
      this.sendStopPulse();
    }
  }

  group(address, switchOn) {
    this.switch(address, 0, switchOn, true);
  }

  dim(address, unit, dimLevel) {
    for (let i = this.repeats; i >= 0; i--) {
      this.sendStartPulse();
      this.sendAddress(address);
      this.sendBit(false);

      // Switch type 'dim'
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec);

      this.sendUnit(unit);

      for (let j = 3; j >= 0; j--) {
        this.sendBit(dimLevel & 1 << j);
      }

      this.sendStopPulse();
    }
  }

  sendStartPulse() {
    rpio.write(this.pin, rpio.HIGH);
    rpio.usleep(this.periodusec);
    rpio.write(this.pin, rpio.LOW);
    rpio.usleep(this.periodusec * 10 + (this.periodusec >> 1)); // Actually 10.5T insteat of 10.44T. Close enough.
  }

  sendAddress(address) {
    for (let i = 25; i >= 0; i--) {
      this.sendBit((address >> i) & 1);
    }
  }

  sendUnit(unit) {
    for (let i = 3; i >= 0; i--) {
      this.sendBit(unit & 1 << i);
    }
  }

  sendStopPulse() {
    rpio.write(this.pin, rpio.HIGH);
    rpio.usleep(this.periodusec);
    rpio.write(this.pin, rpio.LOW);
    rpio.usleep(this.periodusec * 40);
  }

  sendBit(isBitOne) {
    if (isBitOne) {
      // Send '1'
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec * 5);
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec);
    } else {
      // Send '0'
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.HIGH);
      rpio.usleep(this.periodusec);
      rpio.write(this.pin, rpio.LOW);
      rpio.usleep(this.periodusec * 5);
    }
  }
}

module.exports = KlikAanKlikUitNew;
