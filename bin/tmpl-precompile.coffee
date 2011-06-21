`#!/usr/bin/env node

`
jsonfile = process.ARGV[2] || 'tmpl-precompile.json'
precompile = require('../lib/tmpl-precompile').precompile
fs = require 'fs'

settings = JSON.parse fs.readFileSync jsonfile, 'utf8'
settings.relative = settings.relative || true
cwd = if settings.relative then process.cwd() else ''

precompile(settings,cwd)
