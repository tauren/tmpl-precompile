(function() {
  var buildGroup, checkGroupNamespace, checkTemplateNamespaces, compile, compileTemplate, createNamespaces, cwd, fs, jade, jsp, pro, splitNamespace, uglifyOutput, version;
  version = [0, 1, 0];
  jade = require('jade');
  fs = require('fs');
  jsp = require("uglify-js").parser;
  pro = require("uglify-js").uglify;
  cwd = '';
  compileTemplate = function(template, group) {
    var data, source, templateNamespace;
    templateNamespace = template.replace(/\//g, '.');
    data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8');
    source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data) + ';\n';
    console.log("Compiling " + group.namespace + "." + templateNamespace + " from " + (group.source + template));
    return source;
  };
  uglifyOutput = function(output) {
    var ast;
    ast = jsp.parse(output);
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    return pro.gen_code(ast);
  };
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
  createNamespaces = function(group, namespaces) {
    var g, groupNamespaceLength, nameSpaceBuf, next, t, _ref, _results;
    nameSpaceBuf = '';
    groupNamespaceLength = group.namespace.split('.').length;
    next = function() {
      namespaces = nameSpaceBuf;
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
  compile = function(group, namespaces) {
    var buf, template, _i, _len, _ref;
    buf = namespaces || '';
    _ref = group.templates;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      template = _ref[_i];
      buf += compileTemplate(template, group).toString();
    }
    if (group.uglify) {
      buf = uglifyOutput(buf);
    }
    console.log('Saving ' + group.output);
    return fs.writeFileSync(cwd + group.output, buf);
  };
  buildGroup = function(group) {
    var namespaces;
    namespaces = [];
    return checkGroupNamespace(group, namespaces);
  };
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
