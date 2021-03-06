// Generated by CoffeeScript 1.4.0
(function() {
  var Precompiler, assert, compileDebug, defaultSettings, fs, inlineRuntime, jsp, mockData, noHelpers, noUglify, outputFile, precompilerTest, pro, setup, setupPrecompiler, setupStubs, teardown, teardownStubs, vows, _ref;

  vows = require('vows');

  assert = require('assert');

  Precompiler = require('../lib/tmpl-precompile').Precompiler;

  _ref = require('./mock/precompiler.mock'), mockData = _ref.mockData, setupStubs = _ref.setupStubs, teardownStubs = _ref.teardownStubs;

  fs = require('fs');

  jsp = require("uglify-js").parser;

  pro = require("uglify-js").uglify;

  setupPrecompiler = function(settings, callback) {
    var p;
    p = new Precompiler(settings, callback);
    return p.compile();
  };

  precompilerTest = vows.describe('tmpl-precompile: Precompiler');

  defaultSettings = {
    "Default settings: Given only the basic required settings, ": {
      topic: function() {
        setupPrecompiler(mockData.defaultSettings, this.callback);
      },
      'It should return no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should be a string': function(err, res) {
        return assert.isString(res);
      },
      'It should contain a group safety wrapper': function(err, res) {
        return assert.include(res, 'defaultSettings=defaultSettings||{}');
      },
      'It should include runtime functions': function(err, res) {
        assert.include(res, 'function attrs');
        return assert.include(res, 'function escape');
      },
      'It should include runtime functions only once': function(err, res) {
        assert.strictEqual(res.match(/function attrs/g).length === 1, true);
        return assert.strictEqual(res.match(/function escape/g).length === 1, true);
      },
      'It should include runtime functions as callable functions': function(err, res) {
        assert.include(res, 'attrs=jade.attrs,escape=jade.escape');
        return assert.include(res, 'jade={attrs:attrs,escape:escape}');
      },
      'It should be minified': function(err, res) {
        return assert.strictEqual(res.split('\n').length, 1);
      }
    }
  };

  noUglify = {
    'No uglify: Given uglify=false, ': {
      topic: function() {
        setupPrecompiler(mockData.noUglify, this.callback);
      },
      'It should return no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should not be minified': function(err, res) {
        return assert.strictEqual(res.split('\n').length > 1, true);
      }
    }
  };

  compileDebug = {
    'Compile Debug: Given compileDebug=true, ': {
      topic: function() {
        setupPrecompiler(mockData.compileDebug, this.callback);
      },
      'It should return no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should contain "rethrow" function': function(err, res) {
        return assert.include(res, 'function rethrow');
      },
      'It should include debug line numbers': function(err, res) {
        return assert.include(res, '__.lineno');
      },
      'It should contain try/catch functions': function(err, res) {
        assert.include(res, 'try');
        return assert.include(res, 'catch');
      }
    }
  };

  inlineRuntime = {
    'Inline Runtime: Given inline=true, ': {
      topic: function() {
        setupPrecompiler(mockData.inlineRuntime, this.callback);
      },
      'It should return no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should not contain global helpers': function(err, res) {
        assert.strictEqual(res.indexOf('attrs=jade.attrs,escape=jade.escape') === -1, true);
        return assert.strictEqual(res.indexOf('jade={attrs:attrs,escape:escape}') === -1, true);
      },
      'It should include runtime functions more than once': function(err, res) {
        assert.strictEqual(res.match(/function attrs/g).length > 1, true);
        return assert.strictEqual(res.match(/function escape/g).length > 1, true);
      }
    }
  };

  noHelpers = {
    'Disable helpers: Given helpers=false, ': {
      topic: function() {
        setupPrecompiler(mockData.noHelpers, this.callback);
      },
      'It should return no errors': function(err, res) {
        return assert.isNull(err);
      },
      'It should not include helpers and runtime functions': function(err, res) {
        assert.strictEqual(res.indexOf('jade={attrs:attrs,escape:escape}') === -1, true);
        assert.strictEqual(res.indexOf('function attrs') === -1, true);
        return assert.strictEqual(res.indexOf('function escape') === -1, true);
      }
    }
  };

  outputFile = {
    'Output file: Given output file location, ': {
      topic: function() {
        setupPrecompiler(mockData.outputFile, this.callback);
      },
      'When opening the output file, ': {
        topic: function(err, buffer) {
          fs.readFile(mockData.outputFile.output, 'utf8', this.callback);
        },
        'It should return no errors': function(err, data) {
          return assert.isNull(err);
        },
        'It should be a string': function(err, res) {
          return assert.isString(res);
        },
        'It should contain a group safety wrapper': function(err, res) {
          return assert.include(res, 'outputFile=outputFile||{}');
        },
        'It should include runtime functions': function(err, res) {
          assert.include(res, 'function attrs');
          return assert.include(res, 'function escape');
        },
        'It should include runtime functions only once': function(err, res) {
          assert.strictEqual(res.match(/function attrs/g).length === 1, true);
          return assert.strictEqual(res.match(/function escape/g).length === 1, true);
        },
        'It should include runtime functions as callable functions': function(err, res) {
          assert.include(res, 'attrs=jade.attrs,escape=jade.escape');
          return assert.include(res, 'jade={attrs:attrs,escape:escape}');
        },
        'It should be minified': function(err, res) {
          return assert.strictEqual(res.split('\n').length, 1);
        }
      }
    }
  };

  setup = {
    '...Setup stubs': {
      topic: function() {
        setupStubs(mockData.outputFile, this.callback);
      },
      'Done setting up': function() {}
    }
  };

  teardown = {
    '...Tear down stubs': {
      topic: function() {
        teardownStubs(mockData.outputFile, this.callback);
      },
      'Done tearing down': function() {}
    }
  };

  precompilerTest.addBatch(setup).addBatch(defaultSettings).addBatch(noUglify).addBatch(compileDebug).addBatch(inlineRuntime).addBatch(noHelpers).addBatch(outputFile).addBatch(teardown)["export"](module);

}).call(this);
