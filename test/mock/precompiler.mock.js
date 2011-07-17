(function() {
  var async, fs, mockData, setupStubs, teardownStubs, tmpl1, tmpl2;
  async = require('async');
  fs = require('fs');
  mockData = {
    defaultSettings: {
      namespace: 'defaultSettings',
      templates: ['tmpl1', 'tmpl2'],
      source: 'stubs/templates/',
      output: 'stubs/output/templates.js'
    }
  };
  tmpl1 = 'p Hello!';
  tmpl2 = 'p World!';
  setupStubs = function(settings, callback) {
    var source;
    source = settings.source;
    return async.parallel({
      writeTmpl1: function(callback) {
        return fs.writeFile(__dirname + '/../' + source + '/' + 'tmpl1.jade', tmpl1, 'utf8', callback);
      },
      writeTmpl2: function(callback) {
        return fs.writeFile(__dirname + '/../' + source + '/' + 'tmpl2.jade', tmpl2, 'utf8', callback);
      }
    }, function(err) {
      if (err != null) {
        return console.log(err);
      } else {
        return callback(null);
      }
    });
  };
  teardownStubs = function(settings, callback) {
    var source;
    source = settings.source;
    return async.parallel([
      (function(callback) {
        return fs.unlink(__dirname + '/../' + source + '/' + 'tmpl1.jade', callback);
      }), (function(callback) {
        return fs.unlink(__dirname + '/../' + source + '/' + 'tmpl2.jade', callback);
      })
    ], function(err) {
      if (err != null) {
        throw err;
      } else {
        return callback(null);
      }
    });
  };
  module.exports = {
    mockData: mockData,
    setupStubs: setupStubs,
    teardownStubs: teardownStubs
  };
}).call(this);
