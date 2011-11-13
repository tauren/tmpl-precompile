#!/usr/bin/env node
;
var colors, cwd, fs, jsondir, jsonfile, match, precompile, settings;
jsonfile = process.argv[2] || 'tmpl-precompile.json';
precompile = require('../lib/tmpl-precompile').precompile;
fs = require('fs');
colors = require('../lib/colors');
settings = {};
try {
  settings = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
} catch (err) {
  throw "ERR:tmpl-precompile: No configuration file found in this directory.\nCurrent dir: " + (process.cwd()) + "\nFor more information, please visit: https://github.com/tauren/tmpl-precompile\n" + err;
}
if (settings !== {}) {
  settings.args = process.argv;
  settings.relative = settings.relative || true;
  if (settings.relative === false) {
    cwd = '';
  } else {
    cwd = process.cwd();
  }
  if (jsonfile.indexOf('/' > 0)) {
    match = jsonfile.split(/\//);
    jsondir = match.slice(0, match.length - 1).join('/');
    cwd += '/' + jsondir;
  }
  console.log('\n\n' + 'tmpl-precompile'.bold.underline + '\n');
  console.log('Using configuration file: ' + (cwd + '/' + match[match.length - 1]).underline + '\n');
  precompile(settings, cwd);
}