# kaku-rpi

Node.js driver for Raspberry Pi to control KlikAanKlikUit (_KaKu_) devices using a 433Mhz transmitter.

The required hardware setup for this module is documented [here](https://domoticproject.com/controlling-433-mhz-remote-raspberry-pi/) (we're only using the transmitter module). It consists of a simple, cheap 433Mhz transmitter (like [this one](http://www.dx.com/p/433mhz-wireless-transmitter-module-superregeneration-for-arduino-green-149254)) hooked up to the RaspPi's GPIO pins.

**DISCLAIMER**: this module is not in any way endorsed by, or related to, COCO International B.V. or Trust International B.V.

## Attribution

The core of the code is based on [original work](https://bitbucket.org/fuzzillogic/433mhzforarduino/src/0847a6d8a9173abd5abf9cf571a1539f56588c0e/RemoteSwitch/) from [Randy Simons](http://randysimons.nl/).

Big thanks to [Job Wind](https://github.com/Monkeystation/) for implementing the new style code.

## Installation

First, make sure that you have a compiler and toolchain installed on your RaspPi.

Then, install the module:
```
$ npm i kaku-rpi
```

This will install the module, and its requirement ([`rpio`](https://github.com/jperkin/node-rpio)). On limited hardware (like a Model A), installation may take a few minutes.

## Usage

Note: the driver can address both old-style and new-style devices. How to talk to a device is determined by the `ADDRESS` argument for each command: if it's numerical, it's considered to address a new-style device. Otherwise, it's considered to address an old-style device.

```
const KlikAanKlikUit = require('kaku-rpi');

// Instanciate driver.
let kaku = KlikAanKlikUit([PIN, PERIODUSEC, REPEATS, PULSEWIDTH]);

// Switch a device on or off:
kaku.transmit(ADDRESS, DEVICE, STATE)

// Shortcuts:
kaku.on(ADDRESS, DEVICE)
kaku.off(ADDRESS, DEVICE)

// New-style only:
kaku.dim(ADDRESS, DEVICE, LEVEL) // dim a device
kaku.group(ADDRESS, STATE)       // turn a group on or off
kaku.groupOn(ADDRESS)            // turn a group on
kaku.groupOff(ADDRESS)           // turn a group off
```

Arguments:

* `PIN`: the GPIO pin that the transmitter is hooked up to. This is the _physical_ pin number, not the GPIO (mapped) number. By default this module assumes that the transmitter is connected to pin 11 (which is BCM GPIO pin number 17, but again, we're using the physical pin number, so 11).
* `PERIODUSEC`: number of microseconds to sleep between high/low transitions (default: 375 for old-style, 260 for new-style).
* `REPEATS`: number of times to repeat commands (default: 7 for both styles).
* `PULSEWIDTH`: pulse width (default: 5, only used by new-style driver for now).
* `ADDRESS/DEVICE`: KaKu works with addresses (`A`, `B`, `C`, … for old-style devices, and a number for new-style devices) and devices (`1`, `2`, `3`, …). An device is configured to listen on a particular ADDRESS/DEVICE pair.
* `STATE`: whether to switch the device on (`1/true`) or off (`0/false`).
* `LEVEL`: set dim level (0 = min, 15 = max).

**NB**: `PERIODUSEC`, `REPEATS` and `PULSEWIDTH` are different for old- and new-style. The respective drivers use sensible defaults, but if you set them they get used for both drivers, which basically makes the instance usable for only one type (old or new, but not both). In that case, if you want to control both types of devices, create an instance for each type.

## New-style addressing

New-style devices are self-learning: you put them in learning mode, send an _ON_ command from your remote, and the device will learn its address and device number.

To find out which address your remote is sending, you'll need a 433Mhz receiver, hardware to connect it to, and software to read the code. I've used [this Arduino sketch](https://bitbucket.org/fuzzillogic/433mhzforarduino/src/0847a6d8a9173abd5abf9cf571a1539f56588c0e/NewRemoteSwitch/examples/ShowReceivedCode/ShowReceivedCode.ino) (and the library that contains it) to find out the code my remote is sending.

Alternatively, you can also put your device in learning mode and send an _ON_ command with this library, using any address code you like. Most devices can be paired with multiple remotes, so you can use both your regular remote and the Raspberry Pi simultaneously.
