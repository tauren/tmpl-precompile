vows = require 'vows'
assert = require 'assert'
Precompiler = require('../lib/tmpl-precompile').Precompiler
{mockData, setupStubs, teardownStubs} = require('./mock/precompiler.mock')
fs = require 'fs'

jsp = require("uglify-js").parser
pro = require("uglify-js").uglify

setupPrecompiler = (settings, callback) ->
  setupStubs(settings, (err, res) ->
    if err? then throw err
    else
      p = new Precompiler(settings)
      p.compile(callback)
  )

# Test Suite
precompilerTest = vows.describe 'tmpl-precompile: Precompiler'

# Batches
defaultSettings = 
  "Default settings: Given only the basic required settings":
    topic: ->
      setupPrecompiler(mockData.defaultSettings, @callback)
      return
      
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be a string': (err, res) -> assert.isString res      
    'It should contain a group safety wrapper': (err, res) ->
      assert.include res, 'defaultSettings=defaultSettings||{}'
    'It should contain global helpers': (err, res) ->
      assert.include res, 'attrs=jade.attrs,escape=jade.escape'
      assert.include res, 'var attrs=jade.attrs,escape=jade.escape'
    'It should be minified': (err, res) ->
      assert.strictEqual res.split('\n').length, 1
    '..Teardown stubs:-':
      topic: ->
        teardownStubs(mockData.defaultSettings, @callback)
        return
    
      'Done tearing down': ->

noMinify = 
  'No minify: Given minify: false':
    topic: ->
      setupStubs(mockData.noMinify, @callback)
      return
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be a string': (err, res) -> assert.isString res
    'It should not be minified': (err, res) ->
      assert.strictEqual res.split('\n').length > 1, true
      
# Export batches
precompilerTest
  .addBatch(defaultSettings)
  .export(module)