(function() {
  var assert, namespace, namespaceTest, singleNamespace, vows;
  vows = require('vows');
  assert = require('assert');
  namespace = require('../lib/namespace');
  namespaceTest = vows.describe('tmpl-precompile: Namespace');
  singleNamespace = {
    "Single namespace: Given a single namespace and two templates": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'single',
          templates: ['tmpl1', 'tmpl2']
        };
        return namespace(settings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be an array': function(err, res) {
        return assert.isArray(res);
      },
      'It should return one safety wrapper': function(err, res) {
        assert.isArray(res);
        return assert.equal(res[0], 'var single = single || {};');
      }
    }
  };
  namespaceTest.addBatch(singleNamespace)["export"](module);
}).call(this);
