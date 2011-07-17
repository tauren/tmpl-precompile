(function() {
  var compile, compileTemplate, cwd, extractFunction, fs, jade, jsp, namespace, optimizeOutput, pro, uglifyOutput, util, version;
  version = [0, 1, 3];
  jade = require('jade');
  fs = require('fs');
  util = require('util');
  jsp = require("uglify-js").parser;
  pro = require("uglify-js").uglify;
  cwd = '';
  namespace = require('./namespace');
  /*
  compileTemplate(template, group)
  Description: Runs Jade's compile function 
   
  Params:
    template: Template file name
    group: Template group settings
  */
  compileTemplate = function(template, group) {
    var data, source, templateNamespace;
    templateNamespace = template.replace(/\//g, '.');
    console.log("Compiling " + group.namespace + "." + templateNamespace + " from " + (group.source + template));
    data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8');
    return source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {
      compileDebug: group.compileDebug || false,
      inline: group.inline || false
    }) + ';\n';
  };
  /*
  uglifyOutput(output)
  Description: Minifies generated JS with uglifyJS
  */
  uglifyOutput = function(output) {
    var ast;
    ast = jsp.parse(output);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    return pro.gen_code(ast);
  };
  extractFunction = function(name, buf) {
    return '';
  };
  optimizeOutput = function(group, buf) {
    var ast;
    if (!(group.optimize = false)) {
      group.optimize = true;
    }
    if (!(group.helpers = false)) {
      group.helpers = true;
    }
    ast = jsp.parse(buf);
    if (group.debug) {
      console.log(util.inspect(ast, false, 10));
    }
    return buf;
  };
  /*
  compile(group, namespaces)
  Description: Starts compiling the templates and outputs file
  
  Params: 
    group: The 'group' object to process
    namespaces: Buffer string, the result of namespace checking
  */
  compile = function(group, namespaces) {
    var attrs, buf, escape, helpers, template, _i, _len, _ref;
    attrs = jade.runtime.attrs.toString();
    escape = jade.runtime.escape.toString();
    helpers = "" + attrs + "\n" + escape + "\nvar jade = {\n  attrs: attrs,\n  escape: escape\n};\n";
    buf = namespaces || '';
    _ref = group.templates;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      template = _ref[_i];
      buf += optimizeOutput(group, compileTemplate(template, group).toString());
    }
    if (group.inline !== true) {
      buf = helpers + buf;
    }
    if (group.uglify) {
      buf = uglifyOutput(buf);
    }
    console.log('Saving ' + (group.uglify ? 'and Uglifying ' : '') + group.output);
    return fs.writeFileSync(cwd + group.output, buf);
  };
  /*
  precompile(group, namespaces)
  Description: Main precompile function
  
  Params: 
    settings(object): Settings object for tmpl-precompile. Available options include:
      "uglify": Boolean(default:false), whether to minify JS
  		"namespace": String(Required), namespace object when including templates to browser
  		"source": String(Required), relative path to source directory
  		"output": String(Required), relative path to output directory
  		"templates": Array(Required), names of templates to be precompiled
      "compileDebug": Boolean(default: false), whether to compile Jade debugging
      "inline": Boolean(default: false), whether to inline Jade runtime functions
      
    dir(string): Main execution directory
  */
  exports.precompile = function(settings, dir) {
    var group, _i, _len, _ref, _results;
    cwd = dir;
    _ref = settings.groups;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      _results.push(namespace(group, function(err, res) {
        var namespaces;
        if (err != null) {
          return console.log(err);
        } else {
          namespaces = res.join('\n') + '\n';
          return compile(group, namespaces);
        }
      }));
    }
    return _results;
  };
}).call(this);
