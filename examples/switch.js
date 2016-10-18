'use strict';
const driver = require('..').newStyle();

driver.on(1337, 0);
setTimeout(() => driver.off(1337, 0), 1000);
