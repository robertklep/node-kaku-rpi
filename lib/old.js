'use strict';
const rpio = require('rpio');

class KlikAanKlikUitOld {

  constructor(pin, periodusec, repeats) {
    this.pin        = pin        || 11;
    this.periodusec = periodusec || 375;
    this.repeats    = repeats    || 8;

    rpio.open(pin, rpio.OUTPUT, rpio.LOW);
  }

  getTelegram(_address, _device, on) {
    let trits   = [];
    let address = _address.charCodeAt(0) - 65;
    let device  = _device - 1;

    for (let i = 0; i < 4; i++) {
      trits[i] = (address & 1 ) ? 2 : 0;
      address >>= 1;

      trits[i + 4] = (device & 1) ? 2 : 0;
      device >>= 1;
    }
    trits[8] = 0;
    trits[9] = 2;
    trits[10] = 2;
    trits[11] = on ? 2 : 0;

    return trits;
  }

  on(address, device) {
    this.switch(address, device, true);
  }

  off(address, device) {
    this.switch(address, device, false);
  }

  switch(address, device, on) {
    let trits      = this.getTelegram(address, device, on);
    let pin        = this.pin;
    let periodusec = this.periodusec;

    for (let j = 0; j < this.repeats; j++) {
      for (let i = 0; i < 12; i++) {
        let code = trits[i];
        switch (code) {
          case 0:
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec * 3);
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec * 3);
              break;
          case 1:
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec * 3);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec);
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec * 3);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec);
              break;
          case 2:
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec * 3);
              rpio.write(pin, rpio.HIGH);
              rpio.usleep(periodusec * 3);
              rpio.write(pin, rpio.LOW);
              rpio.usleep(periodusec);
              break;
        }
      }
      rpio.write(pin, rpio.HIGH);
      rpio.usleep(periodusec);
      rpio.write(pin, rpio.LOW);
      rpio.usleep(periodusec * 31);
    }
  }

}

module.exports = KlikAanKlikUitOld;
