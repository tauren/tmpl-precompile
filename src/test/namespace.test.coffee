vows = require 'vows'
assert = require 'assert'
namespace = require '../lib/namespace'

# Test Suite
namespaceTest = vows.describe 'tmpl-precompile: Namespace'

# Batches
singleNamespace = 
  "Single namespace: Given a single namespace and two templates":
    topic: ->
      settings = 
        namespace: 'single'
        templates: ['tmpl1', 'tmpl2']
      namespace(settings, this.callback)
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be an array': (err, res) -> assert.isArray res
    'It should return one safety wrapper': (err, res) ->
      assert.isArray res
      assert.equal res[0], 'var single = single || {};'
      
# Export batches
namespaceTest
  .addBatch(singleNamespace)
  .export(module)