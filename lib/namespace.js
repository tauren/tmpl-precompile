(function() {
  /*
  splitNamespace(string, namespaces, callback, isGroupNamespace)
  Description: Splits each string and adds it into the 'namespaces' array for later processing
   
  Params:
    string: Namespace name
    namespaces: Array to hold all namespaces
    callback: function to perform after done splitting
    isGroupNamespace: boolean value to determine if the current iteration is for group
  */  var checkGroupNamespace, checkTemplateNamespaces, createNamespaces, splitNamespace;
  splitNamespace = function(string, namespaces, next, isGroupNamespace) {
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
    if (next != null) {
      return next(namespaces);
    }
  };
  /*  
  checkGroupNamespace(group, namespaces)
  Description: Checks group namespace if needed to be splitted
  
  Params:
    group: Template group settings
    namespaces: Array to hold all namespaces
  */
  checkGroupNamespace = function(group, namespaces, callback) {
    var next;
    next = function(namespaces) {
      return checkTemplateNamespaces(group, namespaces, callback);
    };
    if (group.namespace.indexOf('.') > 0) {
      return splitNamespace(group.namespace, namespaces, next, true);
    } else {
      namespaces.push(group.namespace);
      return next(namespaces);
    }
  };
  /*
  checkTemplateNamespaces(group, namespaces)
  Description: Checks template namespaces if needed to be splitted
   
  Params:
    group: Template group settings
    namespaces: Array to hold all namespaces
  */
  checkTemplateNamespaces = function(group, namespaces, callback) {
    var counter, next, template, _i, _len, _ref, _results;
    counter = 0;
    next = function(namespaces) {
      counter++;
      if (counter === group.templates.length) {
        if (namespaces.length > 0) {
          return createNamespaces(group, namespaces, callback);
        } else {
          return callback(null, group, namespaces);
        }
      }
    };
    _ref = group.templates;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      template = _ref[_i];
      _results.push(template.indexOf('/') > 0 ? splitNamespace(template, namespaces, callback) : next(namespaces));
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
  createNamespaces = function(group, namespaces, callback) {
    var g, groupNamespaceLength, nameSpaceBuf, next, t, _ref, _results;
    nameSpaceBuf = '';
    groupNamespaceLength = group.namespace.split('.').length;
    next = function() {
      namespaces = 'var ' + nameSpaceBuf;
      return callback(null, group, namespaces);
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
  exports.get = function(group, callback) {
    var namespaces;
    namespaces = [];
    return checkGroupNamespace(group, namespaces, callback);
  };
}).call(this);
