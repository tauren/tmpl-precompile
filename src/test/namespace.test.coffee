vows = require 'vows'
assert = require 'assert'
namespace = require '../lib/namespace'

# Test Suite
namespaceTest = vows.describe 'tmpl-precompile: Namespace'

# Batches
singleNamespace = 
  "Single namespace: Given a single namespace and two template names":
    topic: ->
      settings = 
        namespace: 'single'
        templates: ['tmpl1', 'tmpl2']
      namespace(settings, @callback)
      return
      
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be an array': (err, res) -> assert.isArray res
    'It should return a main group wrapper': (err, res) ->
      assert.equal res[0], 'var single = single || {};'

longGroupNamespace = 
  "Multi-level group namespace: Given a three level namespace and two template names":
    topic: ->
      settings = 
        namespace: 'group.lvl1.lvl2'
        templates: ['tmpl1', 'tmpl2']
      namespace(settings, @callback)
      return
      
    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be an array': (err, res) -> assert.isArray res
    'It should return a main group wrapper': (err, res) ->
      assert.equal res[0], 'var group = group || {};'
    'And two safety wrappers': (err, res) ->
      assert.equal res[1], 'group.lvl1 = group.lvl1 || {};'
      assert.equal res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};'

longTemplateNames = 
  "Multi-level template namespace: Given a single level namespace and three multi-level template names":
    topic: ->
      settings = 
        namespace: 'group'
        templates: ['lvl1/tmpl1', 'lvl1/lvl2/tmpl2' ,'lvl1/lvl2/lvl3/tmpl3']
      namespace(settings, @callback)
      return

    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be an array': (err, res) -> assert.isArray res
    'It should return a main group wrapper': (err, res) ->
      assert.equal res[0], 'var group = group || {};'
    'And three safety wrappers': (err, res) ->
      assert.equal res[1], 'group.lvl1 = group.lvl1 || {};'
      assert.equal res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};'
      assert.equal res[3], 'group.lvl1.lvl2.lvl3 = group.lvl1.lvl2.lvl3 || {};'

longTemplateAndGroupNames = 
  "Multi-level template and group namespace: Given a three level namespace and three multi-level template names":
    topic: ->
      settings = 
        namespace: 'group.lvl1.lvl2'
        templates: ['lvl3/tmpl1', 'lvl3/lvl4/tmpl2' ,'lvl3/lvl4/lvl5/tmpl3']
      namespace(settings, @callback)
      return

    'It should contain no errors': (err, res) -> assert.isNull err
    'It should be an array': (err, res) -> assert.isArray res
    'It should return a main group wrapper': (err, res) ->
      assert.equal res[0], 'var group = group || {};'
    'And three safety wrappers': (err, res) ->
      assert.equal res[1], 'group.lvl1 = group.lvl1 || {};'
      assert.equal res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};'
      assert.equal res[3], 'group.lvl1.lvl2.lvl3 = group.lvl1.lvl2.lvl3 || {};'
      assert.equal res[4], 'group.lvl1.lvl2.lvl3.lvl4 = group.lvl1.lvl2.lvl3.lvl4 || {};'
      assert.equal res[5], 'group.lvl1.lvl2.lvl3.lvl4.lvl5 = group.lvl1.lvl2.lvl3.lvl4.lvl5 || {};'

noNamespaceError = 
  "No Namespace Error: Given settings without namespace parameter":
    topic: ->
      settings = 
        templates: ['tmpl1', 'tmpl2' ,'tmpl3']
      namespace(settings, @callback)
      return

    'It should return "Error: \'namespace\' is not configured"': (err, res) -> 
      assert.equal err, "Error: 'namespace' is not configured"

noTemplatesError = 
  "No Templates Error: Given settings without templates parameter":
    topic: ->
      settings = 
        namespace: 'group'
      namespace(settings, @callback)
      return

    'It should return "Error: \'templates\' is not configured"': (err, res) -> 
      assert.equal err, "Error: 'templates' is not configured"

# Export batches
namespaceTest
  .addBatch(singleNamespace)
  .addBatch(longGroupNamespace)
  .addBatch(longTemplateNames)
  .addBatch(longTemplateAndGroupNames)
  .addBatch(noNamespaceError)
  .addBatch(noTemplatesError)
  .export(module)