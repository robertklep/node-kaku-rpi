'use strict';
const driver = require('..').newStyle();

// Turn light off initially.
driver.off(1337, 0);

// Run through all 15 dim levels, changing the level once every second.
let level = 0;
let iv = setInterval(() => {
  console.log('Setting dim level to', level);
  driver.dim(1337, 0, level);
  if (level++ >= 15) {
    clearInterval(iv);
  }
}, 1000);
