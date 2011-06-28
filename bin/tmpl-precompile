#!/usr/bin/env node

;var cwd, fs, jsonfile, precompile, settings;
jsonfile = process.ARGV[2] || 'tmpl-precompile.json';
precompile = require('../lib/tmpl-precompile').precompile;
fs = require('fs');
settings = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
settings.relative = settings.relative || true;
cwd = settings.relative ? process.cwd() : '';
console.log('Using configuration file: ' + process.cwd() + '/' + jsonfile);
precompile(settings, cwd);