(function() {
  var Precompiler, assert, defaultSettings, fs, mockData, precompilerTest, setupStubs, teardownStubs, vows, _ref;
  vows = require('vows');
  assert = require('assert');
  Precompiler = require('../lib/tmpl-precompile').Precompiler;
  _ref = require('./mock/precompiler.mock'), mockData = _ref.mockData, setupStubs = _ref.setupStubs, teardownStubs = _ref.teardownStubs;
  fs = require('fs');
  precompilerTest = vows.describe('tmpl-precompile: Precompiler');
  defaultSettings = {
    "Default settings: Given only the basic required settings": {
      topic: function() {
        var self, settings;
        self = this;
        settings = mockData.defaultSettings;
        setupStubs(settings, function(err, res) {
          var precompiler;
          if (err != null) {
            return console.log(err);
          } else {
            precompiler = new Precompiler(settings);
            return precompiler.compile(self.callback);
          }
        });
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be a string': function(err, res) {
        return assert.isString(res);
      },
      'It should contain a group safety wrapper': function(err, res) {
        return assert.include(res, 'var defaultSettings=defaultSettings||{};');
      },
      'It should contain global helpers': function(err, res) {
        assert.include(res, 'var attrs=jade.attrs,escape=jade.escape;');
        return assert.include(res, 'var jade={attrs:attrs,escape:escape};');
      },
      'It should be minified': function(err, res) {
        return assert.strictEqual(res.split('\n').length, 1);
      },
      '..Teardown stubs:-': {
        topic: function() {
          teardownStubs(mockData.defaultSettings, this.callback);
        },
        'Done tearing down': function() {}
      }
    }
  };
  precompilerTest.addBatch(defaultSettings)["export"](module);
}).call(this);
