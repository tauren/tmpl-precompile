(function() {
  var Precompiler, extend, extractFunction, fs, globalSettings, jade, jsp, namespace, optimizeOutput, path, pro, util, version, _ref;
  version = [0, 1, 3];
  jade = require('jade');
  fs = require('fs');
  path = require('path');
  util = require('util');
  jsp = require("uglify-js").parser;
  pro = require("uglify-js").uglify;
  namespace = require('./namespace');
  _ref = require('./optimize'), extractFunction = _ref.extractFunction, optimizeOutput = _ref.optimizeOutput;
  extend = require('./helpers').extend;
  globalSettings = {
    relative: true,
    dir: (function() {
      var d;
      if (module.parent.id === '.') {
        return process.cwd();
      } else {
        d = module.parent.id.split('/');
        return d.slice(0, d.length - 1).join('/');
      }
    })()
  };
  /*
  Precompiler(groupSettings)
  Description: Creates a Precompiler instance for executing precompiling work
  
  settings: 
    "uglify": Boolean(default:false), whether to minify JS
  	"namespace": String(Required), namespace object when including templates to browser
  	"source": String(Required), relative path to source directory
  	"output": String(Required), relative path to output directory
  	"templates": Array(Required), names of templates to be precompiled
    "compileDebug": Boolean(default: false), whether to compile Jade debugging
    "inline": Boolean(default: false), whether to inline Jade runtime functions
  */
  Precompiler = (function() {
    function Precompiler(groupSettings, callback) {
      var self;
      this.settings = groupSettings;
      if (this.settings.source) {
        this.settings.source = path.normalize(globalSettings.dir + '/' + this.settings.source);
      }
      if (this.settings.output) {
        this.settings.output = path.normalize(globalSettings.dir + '/' + this.settings.output);
      }
      self = this;
      namespace(this.settings, function(err, res) {
        if (err != null) {
          throw err;
        } else {
          return self.namespaces = res.join('\n') + '\n';
        }
      });
    }
    /*
      compile(group, namespaces)
      Description: Starts compiling the templates and outputs file
    
      Params: 
        group: The 'group' object to process
        namespaces: Buffer string, the result of namespace checking
      */
    Precompiler.prototype.compile = function(callback) {
      var buf, inline, namespaces, output, template, templates, uglify, _i, _len, _ref2, _ref3;
      _ref2 = this.settings, templates = _ref2.templates, namespaces = _ref2.namespaces, inline = _ref2.inline, uglify = _ref2.uglify, output = _ref2.output;
      buf = '';
      _ref3 = this.settings.templates;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        template = _ref3[_i];
        buf += this.compileTemplate(template).toString();
      }
      if (namespaces !== false) {
        buf = this.namespaces + buf;
      }
      if (inline !== true) {
        buf = this.helpers + buf;
      }
      if (uglify !== false) {
        buf = this.uglifyOutput(buf);
      }
      if (callback != null) {
        return callback(null, buf);
      } else {
        console.log('Saving ' + (uglify !== false ? 'and Uglifying ' : '') + output);
        return fs.writeFileSync(this.settings.output, buf);
      }
    };
    /*
      compileTemplate(template, group)
      Description: Runs Jade's compile function 
     
      Params:
        template: Template file name
        group: Template group settings
      */
    Precompiler.prototype.compileTemplate = function(template) {
      var compileDebug, data, inline, source, sourceFile, templateNamespace, _ref2;
      _ref2 = this.settings, source = _ref2.source, namespace = _ref2.namespace, compileDebug = _ref2.compileDebug, inline = _ref2.inline;
      templateNamespace = template.replace(/\//g, '.');
      if (this.settings.verbose) {
        console.log("Compiling " + namespace + "." + templateNamespace + " from " + (source + template));
      }
      sourceFile = source + template + '.jade';
      data = fs.readFileSync(sourceFile, 'utf8');
      return namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {
        compileDebug: compileDebug || false,
        inline: inline || false
      }) + ';\n';
    };
    Precompiler.prototype.helpers = (function() {
      var attrs, escape, helpers;
      attrs = jade.runtime.attrs.toString();
      escape = jade.runtime.escape.toString();
      helpers = "" + attrs + "\n" + escape + "\nvar jade = {\n  attrs: attrs,\n  escape: escape\n}\n";
      return helpers;
    })();
    /*
      uglifyOutput(output)
      Description: Minifies generated JS with uglifyJS
      */
    Precompiler.prototype.uglifyOutput = function(output) {
      var ast;
      ast = jsp.parse(output);
      ast = pro.ast_mangle(ast);
      ast = pro.ast_squeeze(ast);
      return pro.gen_code(ast);
    };
    return Precompiler;
  })();
  /*
  ---Module exports---
  
  precompile(group, namespaces)
  Description: Main precompile function
  
  Params: 
    settings(object): Global settings object for tmpl-precompile
      "verbose": Boolean(default:false), if should output compile info on console
      "relative": Boolean(default:true), if paths to each template is relative to settings file
    dir(string): Main execution directory
  */
  module.exports.precompile = function(settings, dir) {
    var group, groupSettings, groups, _i, _j, _len, _len2, _ref2, _results;
    extend(globalSettings, settings);
    globalSettings.dir = dir;
    groups = [];
    _ref2 = settings.groups;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      groupSettings = _ref2[_i];
      groups.push(new Precompiler(groupSettings));
    }
    _results = [];
    for (_j = 0, _len2 = groups.length; _j < _len2; _j++) {
      group = groups[_j];
      _results.push(group.compile());
    }
    return _results;
  };
  module.exports.Precompiler = Precompiler;
}).call(this);
