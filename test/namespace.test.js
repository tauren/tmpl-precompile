(function() {
  var assert, events, longGroupNamespace, longTemplateAndGroupNames, longTemplateNames, namespace, namespaceTest, noNamespaceError, noTemplatesError, singleNamespace, vows;
  vows = require('vows');
  assert = require('assert');
  namespace = require('../lib/namespace');
  events = require('events');
  namespaceTest = vows.describe('tmpl-precompile: Namespace');
  singleNamespace = {
    "Single namespace: Given a single namespace and two template names": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'single',
          templates: ['tmpl1', 'tmpl2']
        };
        namespace(settings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be an array': function(err, res) {
        return assert.isArray(res);
      },
      'It should return a main group wrapper': function(err, res) {
        return assert.equal(res[0], 'var single = single || {};');
      }
    }
  };
  longGroupNamespace = {
    "Multi-level group namespace: Given a three level namespace and two template names": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'group.lvl1.lvl2',
          templates: ['tmpl1', 'tmpl2']
        };
        namespace(settings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be an array': function(err, res) {
        return assert.isArray(res);
      },
      'It should return a main group wrapper': function(err, res) {
        return assert.equal(res[0], 'var group = group || {};');
      },
      'And two safety wrappers': function(err, res) {
        assert.equal(res[1], 'group.lvl1 = group.lvl1 || {};');
        return assert.equal(res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};');
      }
    }
  };
  longTemplateNames = {
    "Multi-level template namespace: Given a single level namespace and three multi-level template names": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'group',
          templates: ['lvl1/tmpl1', 'lvl1/lvl2/tmpl2', 'lvl1/lvl2/lvl3/tmpl3']
        };
        namespace(settings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be an array': function(err, res) {
        return assert.isArray(res);
      },
      'It should return a main group wrapper': function(err, res) {
        return assert.equal(res[0], 'var group = group || {};');
      },
      'And three safety wrappers': function(err, res) {
        assert.equal(res[1], 'group.lvl1 = group.lvl1 || {};');
        assert.equal(res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};');
        return assert.equal(res[3], 'group.lvl1.lvl2.lvl3 = group.lvl1.lvl2.lvl3 || {};');
      }
    }
  };
  longTemplateAndGroupNames = {
    "Multi-level template and group namespace: Given a three level namespace and three multi-level template names": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'group.lvl1.lvl2',
          templates: ['lvl3/tmpl1', 'lvl3/lvl4/tmpl2', 'lvl3/lvl4/lvl5/tmpl3']
        };
        namespace(settings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be an array': function(err, res) {
        return assert.isArray(res);
      },
      'It should return a main group wrapper': function(err, res) {
        return assert.equal(res[0], 'var group = group || {};');
      },
      'And three safety wrappers': function(err, res) {
        assert.equal(res[1], 'group.lvl1 = group.lvl1 || {};');
        assert.equal(res[2], 'group.lvl1.lvl2 = group.lvl1.lvl2 || {};');
        assert.equal(res[3], 'group.lvl1.lvl2.lvl3 = group.lvl1.lvl2.lvl3 || {};');
        assert.equal(res[4], 'group.lvl1.lvl2.lvl3.lvl4 = group.lvl1.lvl2.lvl3.lvl4 || {};');
        return assert.equal(res[5], 'group.lvl1.lvl2.lvl3.lvl4.lvl5 = group.lvl1.lvl2.lvl3.lvl4.lvl5 || {};');
      }
    }
  };
  noNamespaceError = {
    "No Namespace Error: Given settings without namespace parameter": {
      topic: function() {
        var settings;
        settings = {
          templates: ['tmpl1', 'tmpl2', 'tmpl3']
        };
        namespace(settings, this.callback);
      },
      'It should return "Error: \'namespace\' is not configured"': function(err, res) {
        return assert.equal(err, "Error: 'namespace' is not configured");
      }
    }
  };
  noTemplatesError = {
    "No Templates Error: Given settings without templates parameter": {
      topic: function() {
        var settings;
        settings = {
          namespace: 'group'
        };
        namespace(settings, this.callback);
      },
      'It should return "Error: \'templates\' is not configured"': function(err, res) {
        return assert.equal(err, "Error: 'templates' is not configured");
      }
    }
  };
  namespaceTest.addBatch(singleNamespace).addBatch(longGroupNamespace).addBatch(longTemplateNames).addBatch(longTemplateAndGroupNames).addBatch(noNamespaceError).addBatch(noTemplatesError)["export"](module);
}).call(this);
