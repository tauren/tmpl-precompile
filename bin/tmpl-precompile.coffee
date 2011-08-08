`#!/usr/bin/env node
`
jsonfile = process.ARGV[2] || 'tmpl-precompile.json'
precompile = require('../lib/tmpl-precompile').precompile
fs = require 'fs'
colors = require '../lib/colors'

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

if settings isnt {}
  settings.args = process.ARGV
  settings.relative = settings.relative || true
  
  # Get relative directory of jsonfile from the directory of execution
  if settings.relative is false
    cwd = ''
  else
    cwd = process.cwd()
  
  # Set correct file directory
  if jsonfile.indexOf '/' > 0
    match = jsonfile.split(/\//)
    jsondir = match[0...match.length-1].join('/')
    cwd += '/' + jsondir

  # Output initialization messages
  console.log  '\n\n' + 'tmpl-precompile'.bold.underline + '\n'
  console.log 'Using configuration file: ' + (cwd + '/' +match[match.length-1]).underline + '\n'
  precompile(settings,cwd)