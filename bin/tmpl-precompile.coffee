`#!/usr/bin/env node
`
jsonfile = process.ARGV[2] || 'tmpl-precompile.json'
precompile = require('../lib/tmpl-precompile').precompile
fs = require 'fs'

settings = {}

try
  settings = JSON.parse fs.readFileSync jsonfile, 'utf8'
catch err
  throw """
    
    ERR:tmpl-precompile: No configuration file found in this directory.
    Current dir: #{process.cwd()}
    For more information, please visit: https://github.com/tauren/tmpl-precompile
    #{err}
  """

# TODO: Simplify by using require('path')
if settings isnt {}
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
    cwd = process.cwd() + jsonfile

  console.log 'Using configuration file: ' + cwd + '/' + jsonfile
  precompile(settings,cwd)