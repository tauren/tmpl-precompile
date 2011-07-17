(function() {
  var Precompiler, assert, defaultSettings, fs, jsp, mockData, noMinify, precompilerTest, pro, setupPrecompiler, setupStubs, teardownStubs, vows, _ref;
  vows = require('vows');
  assert = require('assert');
  Precompiler = require('../lib/tmpl-precompile').Precompiler;
  _ref = require('./mock/precompiler.mock'), mockData = _ref.mockData, setupStubs = _ref.setupStubs, teardownStubs = _ref.teardownStubs;
  fs = require('fs');
  jsp = require("uglify-js").parser;
  pro = require("uglify-js").uglify;
  setupPrecompiler = function(settings, callback) {
    return setupStubs(settings, function(err, res) {
      var p;
      if (err != null) {
        throw err;
      } else {
        p = new Precompiler(settings);
        return p.compile(callback);
      }
    });
  };
  precompilerTest = vows.describe('tmpl-precompile: Precompiler');
  defaultSettings = {
    "Default settings: Given only the basic required settings": {
      topic: function() {
        setupPrecompiler(mockData.defaultSettings, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be a string': function(err, res) {
        return assert.isString(res);
      },
      'It should contain a group safety wrapper': function(err, res) {
        return assert.include(res, 'defaultSettings=defaultSettings||{}');
      },
      'It should contain global helpers': function(err, res) {
        assert.include(res, 'attrs=jade.attrs,escape=jade.escape');
        return assert.include(res, 'var attrs=jade.attrs,escape=jade.escape');
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
  noMinify = {
    'No minify: Given minify: false': {
      topic: function() {
        setupStubs(mockData.noMinify, this.callback);
      },
      'It should contain no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be a string': function(err, res) {
        return assert.isString(res);
      },
      'It should not be minified': function(err, res) {
        return assert.strictEqual(res.split('\n').length > 1, true);
      }
    }
  };
  precompilerTest.addBatch(defaultSettings)["export"](module);
}).call(this);
