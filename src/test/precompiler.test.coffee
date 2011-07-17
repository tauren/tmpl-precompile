vows = require 'vows'
assert = require 'assert'
Precompiler = require('../lib/tmpl-precompile').Precompiler
{mockData, setupStubs, teardownStubs} = require('./mock/precompiler.mock')
fs = require 'fs'

# Test Suite
precompilerTest = vows.describe 'tmpl-precompile: Precompiler'

# Batches
defaultSettings = 
  "Default settings: Given only the basic required settings":
    topic: ->
      self = @
      settings = mockData.defaultSettings
      setupStubs(settings, (err, res) ->
        if err? then console.log err
        else
          precompiler = new Precompiler(settings)
          precompiler.compile(self.callback)
      )
      return
      
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be a string': (err, res) -> assert.isString res      
    'It should contain a group safety wrapper': (err, res) ->
      assert.include res, 'var defaultSettings=defaultSettings||{};'
    'It should contain global helpers': (err, res) ->
      assert.include res, 'var attrs=jade.attrs,escape=jade.escape;'
      assert.include res, 'var jade={attrs:attrs,escape:escape};'
    'It should be minified': (err, res) ->
      assert.strictEqual res.split('\n').length, 1
    
    '..Teardown stubs:-':
      topic: ->
        teardownStubs(mockData.defaultSettings, @callback)
        return
    
      'Done tearing down': ->


# Export batches
precompilerTest
  .addBatch(defaultSettings)
  .export(module)