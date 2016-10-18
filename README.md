# kaku-rpi

Node.js driver for Raspberry Pi to control KlikAanKlikUit (_KaKu_) devices using a 433Mhz transmitter.

The required hardware setup for this module is documented [here](http://shop.ninjablocks.com/blogs/how-to/7506204-adding-433-to-your-raspberry-pi) (we're only using the transmitter module). It consists of a simple, cheap 433Mhz transmitter (like [this one](http://www.dx.com/p/433mhz-wireless-transmitter-module-superregeneration-for-arduino-green-149254)) hooked up to the RaspPi's GPIO pins.

## Attribution

The core of the code is based on [original work](https://bitbucket.org/fuzzillogic/433mhzforarduino/src/0847a6d8a9173abd5abf9cf571a1539f56588c0e/RemoteSwitch/) from [Randy Simons](http://randysimons.nl/).

## Installation

First, make sure that you have a compiler and toolchain installed on your RaspPi.

Then, install the module:
```
$ npm i kaku-rpi
```

This will install the module, and its requirement ([`rpio`](https://github.com/jperkin/node-rpio)). On limited hardware (like a Model A), installation may take a few minutes.

## Usage

```
const kaku = require('kaku-rpi')(PIN, [PERIODUSEC, REPEATS]);

// Switch a device on or off:
kaku.switch(ADDRESS, DEVICE, STATE)

// Shortcuts:
kaku.on(ADDRESS, DEVICE)
kaku.off(ADDRESS, DEVICE)
```

Arguments:

* `PIN`: the GPIO pin that the transmitter is hooked up to. This is the _physical_ pin number, not the GPIO (mapped) number. Referring to the hardware page linked to above, it's using pin 11 (which is BCM GPIO pin number 17, but again, we're using the physical pin number, so 11).
* `PERIODUSEC`: number of microseconds to sleep between high/low transitions. This should be 375 (which is also the default).
* `REPEATS`: number of times to repeat commands. This should be 8 (= the default).
* `ADDRESS/DEVICE`: KaKu works with addresses (`A`, `B`, `C`, …) and devices (`1`, `2`, `3`, …). An outlet is configured to listen on a particular ADDRESS/DEVICE pair.
* `STATE`: whether to switch the outlet on (`1/true`) or off (`0/false`).

## Example

Switching the device C2 on, and a second later, off again:

```
const kaku = require('kaku-rpi')(11);

kaku.on('C', 2);
setTimeout(() => kaku.off('C', 2));
```

