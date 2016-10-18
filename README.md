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
const Driver = require('kaku-rpi');

// Choose between old-style and new-style devices.
let driver = Driver.oldStyle(PIN);
let driver = Driver.newStyle(PIN);

// Switch a device on or off:
driver.switch(ADDRESS, DEVICE, STATE)

// Shortcuts:
driver.on(ADDRESS, DEVICE)
driver.off(ADDRESS, DEVICE)

// New-style only: dim a device;
driver.dim(ADDRESS, DEVICE, LEVEL)
```

Arguments:

* `PIN`: the GPIO pin that the transmitter is hooked up to. This is the _physical_ pin number, not the GPIO (mapped) number. Referring to the hardware page linked to above, it's using pin 11 (which is BCM GPIO pin number 17, but again, we're using the physical pin number, so 11).
* `PERIODUSEC`: number of microseconds to sleep between high/low transitions. This should be 375 (which is also the default).
* `REPEATS`: number of times to repeat commands. This should be 8 (= the default).
* `ADDRESS/DEVICE`: KaKu works with addresses (`A`, `B`, `C`, … for old-style devices, and a number for new-style devices) and devices (`1`, `2`, `3`, …). An device is configured to listen on a particular ADDRESS/DEVICE pair.
* `STATE`: whether to switch the outlet on (`1/true`) or off (`0/false`).
* `LEVEL`: set dim level (0 = min, 15 = max).

## New-style addressing

New-style devices are self-learning: you put them in learning mode, send an _ON_ command from your remote, and the device will learn its address and device number.

To find out which address your remote is sending, you'll need a 433Mhz receiver, hardware to connect it to, and software to read the code. I've used [this Arduino sketch](https://bitbucket.org/fuzzillogic/433mhzforarduino/src/0847a6d8a9173abd5abf9cf571a1539f56588c0e/NewRemoteSwitch/examples/ShowReceivedCode/ShowReceivedCode.ino) (and the library that contains it) to find out the code my remote is sending.

Alternatively, you can also put your device in learning mode and send an _ON_ command with this library, using any address code you like. Most devices can be paired with multiple remotes, so you can use both your regular remote and the Raspberry Pi simultaneously.
