#!/usr/bin/env node
;var cwd, fs, jsondir, jsonfile, match, precompile, settings;
jsonfile = process.ARGV[process.ARGV.length - 1] || 'tmpl-precompile.json';
precompile = require('../lib/tmpl-precompile').precompile;
fs = require('fs');
settings = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
settings.args = process.ARGV;
settings.relative = settings.relative || true;
if (settings.relative === false) {
  cwd = '';
} else if (jsonfile.indexOf('/' > 0)) {
  match = jsonfile.split(/\//);
  jsondir = match.slice(0, match.length - 1).join('/');
  cwd = process.cwd() + '/' + jsondir;
} else {
  cwd = process.cwd();
}
console.log('Using configuration file: ' + cwd + '/' + jsonfile);
precompile(settings, cwd);