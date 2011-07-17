vows = require 'vows'
assert = require 'assert'
Precompiler = require('../lib/tmpl-precompile').Precompiler
{mockData, setupStubs, teardownStubs} = require('./mock/precompiler.mock')
fs = require 'fs'

jsp = require("uglify-js").parser
pro = require("uglify-js").uglify

setupPrecompiler = (settings, callback) ->
  p = new Precompiler(settings, callback)
  p.compile()

# Test Suite
precompilerTest = vows.describe 'tmpl-precompile: Precompiler'

# Batches
defaultSettings = 
  "Default settings: Given only the basic required settings, ":
    topic: ->
      setupPrecompiler(mockData.defaultSettings, @callback)
      return
    'It should return no errors': (err, res) -> assert.isNull err
    'It should be a string': (err, res) -> assert.isString res      
    'It should contain a group safety wrapper': (err, res) ->
      assert.include res, 'defaultSettings=defaultSettings||{}'
    'It should include runtime functions': (err, res) ->
      assert.include res, 'function attrs'
      assert.include res, 'function escape'
    'It should include runtime functions only once': (err, res) ->
      assert.strictEqual res.match(/function attrs/g).length is 1, true 
      assert.strictEqual res.match(/function escape/g).length is 1, true
    'It should include runtime functions as callable functions': (err, res) ->
      assert.include res, 'attrs=jade.attrs,escape=jade.escape'
      assert.include res, 'jade={attrs:attrs,escape:escape}'
    'It should be minified': (err, res) ->
      assert.strictEqual res.split('\n').length, 1

noUglify = 
  'No uglify: Given uglify=false, ':
    topic: ->
      setupPrecompiler(mockData.noUglify, @callback)
      return
    'It should return no errors': (err, res) -> assert.isNull err
    'It should not be minified': (err, res) ->
      assert.strictEqual res.split('\n').length > 1, true
      

compileDebug = 
  'Compile Debug: Given compileDebug=true, ':
    topic: ->
      setupPrecompiler(mockData.compileDebug, @callback)
      return
    'It should return no errors': (err, res) -> assert.isNull err
    'It should contain "rethrow" function': (err, res) ->
      assert.include res, 'function rethrow'
    'It should include debug line numbers': (err, res) ->
      assert.include res, '__.lineno'
    'It should contain try/catch functions': (err, res) ->
      assert.include res, 'try'
      assert.include res, 'catch'


inlineRuntime = 
  'Inline Runtime: Given inline=true, ':
    topic: ->
      setupPrecompiler(mockData.inlineRuntime, @callback)
      return
    'It should return no errors': (err, res) -> assert.isNull err
    'It should not contain global helpers': (err, res) ->
      assert.strictEqual res.indexOf('attrs=jade.attrs,escape=jade.escape') is -1, true
      assert.strictEqual res.indexOf('jade={attrs:attrs,escape:escape}') is -1, true
    'It should include runtime functions more than once': (err, res) ->
      assert.strictEqual res.match(/function attrs/g).length > 1, true 
      assert.strictEqual res.match(/function escape/g).length > 1, true

noHelpers = 
  'Disable helpers: Given helpers=false, ':
    topic: ->
      setupPrecompiler(mockData.noHelpers, @callback)
      return
    'It should return no errors': (err, res) -> assert.isNull err
    'It should not include helpers and runtime functions': (err, res) ->
      assert.strictEqual res.indexOf('jade={attrs:attrs,escape:escape}') is -1, true
      assert.strictEqual res.indexOf('function attrs') is -1, true
      assert.strictEqual res.indexOf('function escape') is -1, true

outputFile = 
  'Output file: Given output file location, ':
    topic: ->
      setupPrecompiler(mockData.outputFile, @callback)
      return
    'When opening the output file, ':
      topic: (err, buffer) ->
        fs.readFile(mockData.outputFile.output, 'utf8', @callback)
        return
      'It should return no errors': (err, data) -> assert.isNull err
      'It should be a string': (err, res) -> assert.isString res      
      'It should contain a group safety wrapper': (err, res) ->
        assert.include res, 'outputFile=outputFile||{}'
      'It should include runtime functions': (err, res) ->
        assert.include res, 'function attrs'
        assert.include res, 'function escape'
      'It should include runtime functions only once': (err, res) ->
        assert.strictEqual res.match(/function attrs/g).length is 1, true 
        assert.strictEqual res.match(/function escape/g).length is 1, true
      'It should include runtime functions as callable functions': (err, res) ->
        assert.include res, 'attrs=jade.attrs,escape=jade.escape'
        assert.include res, 'jade={attrs:attrs,escape:escape}'
      'It should be minified': (err, res) ->
        assert.strictEqual res.split('\n').length, 1

setup = 
  '...Setup stubs':
    topic: ->
      setupStubs(mockData.outputFile, @callback)
      return
    'Done setting up': ->

teardown = 
  '...Tear down stubs':
    topic: ->
      teardownStubs(mockData.outputFile, @callback)
      return
    'Done tearing down': ->
  

# Export batches
precompilerTest
  .addBatch(setup)
  .addBatch(defaultSettings)
  .addBatch(noUglify)
  .addBatch(compileDebug)
  .addBatch(inlineRuntime)
  .addBatch(noHelpers)
  .addBatch(outputFile)
  .addBatch(teardown)
  .export(module)