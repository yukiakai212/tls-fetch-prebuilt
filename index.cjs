'use strict';
const { loadBinding } = require('@node-rs/helper');
const path = require('path');
const packageData = require('./package.json');

module.exports = loadBinding(path.join(__dirname, packageData.releaseBinary), packageData.napi.name, packageData.name);