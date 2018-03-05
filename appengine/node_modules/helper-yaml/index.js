/*!
 * helper-yaml <https://github.com/jonschlinkert/helper-yaml>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var jsyaml = require('./js-yaml');

function yaml(str, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('helper-yaml async expects a callback.');
  }
  if (typeof str !== 'string') {
    return cb(new TypeError('helper-yaml async expects str to be a string.'));
  }
  opts = opts || {};
  try {
    return cb(null, jsyaml.load(str, opts));
  } catch(err) {
    cb(err);
  }
}

function yamlSync(str, opts) {
  if (typeof str !== 'string') {
    throw new TypeError('helper-yaml sync expects str to be a string.');
  }

  var args = [].slice.call(arguments);
  var last = args[args.length - 1];
  if (typeof last === 'object' && last.hasOwnProperty('hash') && last.hasOwnProperty('data')) {
    args.pop();
  }

  try {
    return jsyaml.load.apply(jsyaml, args);
  } catch(err) {
    console.log(err);
    return;
  }
}

/**
 * Expose `yaml`
 */

module.exports = yaml;

/**
 * Expose `yaml.sync`
 */

module.exports.sync = yamlSync;
