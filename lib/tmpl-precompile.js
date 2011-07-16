(function() {
  var buildGroup, checkGroupNamespace, checkTemplateNamespaces, compile, compileTemplate, createNamespaces, cwd, extractFunction, fs, jade, jsp, optimizeOutput, pro, splitNamespace, uglifyOutput, util, version;
  version = [0, 1, 3];
  jade = require('jade');
  fs = require('fs');
  util = require('util');
  jsp = require("uglify-js").parser;
  pro = require("uglify-js").uglify;
  cwd = '';
  /*
  compileTemplate(template, group)
  Description: Runs Jade's compile function 
   
  Params:
    template: Template file name
    group: Template group settings
  */
  compileTemplate = function(template, group) {
    var data, source, templateNamespace;
    console.log("Compiling " + group.namespace + "." + templateNamespace + " from " + (group.source + template));
    templateNamespace = template.replace(/\//g, '.');
    data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8');
    return source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {
      compileDebug: group.compileDebug || false,
      inline: group.inline || false
    }) + ';\n';
  };
  uglifyOutput = function(output) {
    var ast;
    ast = jsp.parse(output);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    return pro.gen_code(ast);
  };
  /*
  splitNamespace(string, namespaces, callback, isGroupNamespace)
  Description: Splits each string and adds it into the 'namespaces' array for later processing
   
  Params:
    string: Namespace name
    namespaces: Array to hold all namespaces
    callback: function to perform after done splitting
    isGroupNamespace: boolean value to determine if the current iteration is for group
  */
  splitNamespace = function(string, namespaces, callback, isGroupNamespace) {
    var arr, i, max, str;
    arr = string.split(/\.|\//);
    if (isGroupNamespace) {
      max = arr.length;
    } else {
      max = arr.length - 1;
    }
    namespaces.push(arr[0]);
    str = arr[0];
    for (i = 1; 1 <= max ? i < max : i > max; 1 <= max ? i++ : i--) {
      str += "." + arr[i];
      namespaces.push(str);
    }
    if (callback != null) {
      return callback(namespaces);
    }
  };
  /*  
  checkGroupNamespace(group, namespaces)
  Description: Checks group namespace if needed to be splitted
  
  Params:
    group: Template group settings
    namespaces: Array to hold all namespaces
  */
  checkGroupNamespace = function(group, namespaces) {
    var callback;
    callback = function(namespaces) {
      return checkTemplateNamespaces(group, namespaces);
    };
    if (group.namespace.indexOf('.') > 0) {
      return splitNamespace(group.namespace, namespaces, callback, true);
    } else {
      namespaces.push(group.namespace);
      return callback(namespaces);
    }
  };
  /*
  checkTemplateNamespaces(group, namespaces)
  Description: Checks template namespaces if needed to be splitted
   
  Params:
    group: Template group settings
    namespaces: Array to hold all namespaces
  */
  checkTemplateNamespaces = function(group, namespaces) {
    var callback, counter, template, _i, _len, _ref, _results;
    counter = 0;
    callback = function(namespaces) {
      counter++;
      if (counter === group.templates.length) {
        if (namespaces.length > 0) {
          return createNamespaces(group, namespaces);
        } else {
          return compile(group, namespaces);
        }
      }
    };
    _ref = group.templates;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      template = _ref[_i];
      _results.push(template.indexOf('/') > 0 ? splitNamespace(template, namespaces, callback) : callback(namespaces));
    }
    return _results;
  };
  /*
  createNamespaces(group, namespaces)
  Description: Prepends required namespace declarations for the browser
  
  Params:
    group: Template group settings
    namespaces: Array to hold all namespaces
  */
  createNamespaces = function(group, namespaces) {
    var g, groupNamespaceLength, nameSpaceBuf, next, t, _ref, _results;
    nameSpaceBuf = '';
    groupNamespaceLength = group.namespace.split('.').length;
    next = function() {
      namespaces = 'var ' + nameSpaceBuf;
      return compile(group, namespaces);
    };
    for (g = 0; 0 <= groupNamespaceLength ? g < groupNamespaceLength : g > groupNamespaceLength; 0 <= groupNamespaceLength ? g++ : g--) {
      nameSpaceBuf += "" + namespaces[g] + " = " + namespaces[g] + " || {};\n";
    }
    if (groupNamespaceLength === namespaces.length) {
      return next();
    } else {
      _results = [];
      for (t = groupNamespaceLength, _ref = namespaces.length; groupNamespaceLength <= _ref ? t < _ref : t > _ref; groupNamespaceLength <= _ref ? t++ : t--) {
        if (namespaces[t] !== namespaces[t + 1]) {
          nameSpaceBuf += "" + group.namespace + "." + namespaces[t] + " = " + group.namespace + "." + namespaces[t] + " || {};\n";
        }
        _results.push(t === namespaces.length - 1 ? next() : void 0);
      }
      return _results;
    }
  };
  extractFunction = function(name, buf) {
    return '';
  };
  optimizeOutput = function(group, buf) {
    var ast;
    if (group.optimize !== false) {
      group.optimize = true;
    }
    if (group.helpers !== false) {
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
    if (group.helpers !== false) {
      if (!group.inline) {
        buf = helpers + buf;
      }
    }
    if (group.uglify !== false) {
      buf = uglifyOutput(buf);
    }
    console.log('Saving ' + (group.uglify ? 'and Uglifying ' : '') + group.output);
    return fs.writeFileSync(cwd + group.output, buf);
  };
  buildGroup = function(group) {
    var namespaces;
    namespaces = [];
    return checkGroupNamespace(group, namespaces);
  };
  /*
  precompile(group, namespaces)
  Description: Main precompile function
  
  Params: 
    settings(object): Settings object for tmpl-precompile. Available options include:
  		"namespace": String(Required), namespace object when including templates to browser
  		"source": String(Required), relative path to source directory
  		"output": String(Required), relative path to output directory
  		"templates": Array(Required), names of templates to be precompiled
      "compileDebug": Boolean(default: false), whether to include debugging for templates
      "uglify": Boolean(default:false), whether to minify JS
      "helpers": Boolean(default: true), whether to include helpers in compiled file
      "inline": Boolean(default: false), whether to include runtime functions inline
      
    dir(string): Main execution directory
  */
  exports.precompile = function(settings, dir) {
    var group, _i, _len, _ref, _results;
    cwd = dir;
    _ref = settings.groups;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      _results.push(buildGroup(group));
    }
    return _results;
  };
}).call(this);
