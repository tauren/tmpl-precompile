`#!/usr/bin/env node
`
jsonfile = process.ARGV[process.ARGV.length-1] || 'tmpl-precompile.json'
precompile = require('../lib/tmpl-precompile').precompile
fs = require 'fs'

settings = JSON.parse fs.readFileSync jsonfile, 'utf8'
settings.args = process.ARGV
settings.relative = settings.relative || true

# Get relative directory of jsonfile from the directory of execution
if settings.relative is false
  cwd = ''
else if jsonfile.indexOf '/' > 0
  match = jsonfile.split(/\//)
  jsondir = match[0...match.length-1].join('/')
  cwd = process.cwd() + '/' + jsondir
else
  cwd = process.cwd()

console.log 'Using configuration file: ' + cwd + '/' + jsonfile
precompile(settings,cwd)