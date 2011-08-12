(function() {
  var Namespacer, async;
  async = require('async');
  /*
  Namespacer(settings, callback)
  Description: Creates a Namespacer instance for processing namespace data
  
  settings:
    "namespace": String(Required), namespace object when including templates to browser
    "templates": Array(Required), names of templates to be precompiled
  callback: (err, res) ->
  */
  Namespacer = (function() {
    /*
      constructor
      Description: Bind settings to object
      */    function Namespacer(settings, callback) {
      if (settings.namespace != null) {
        this.groupNamespace = settings.namespace;
      } else {
        callback('Error: \'namespace\' is not configured');
      }
      if (settings.templates != null) {
        this.templates = settings.templates;
      } else {
        callback('Error: \'templates\' is not configured');
      }
      if (settings.skiproot != null) {
        this.skiproot = settings.skiproot;
      }
      if ((this.groupNamespace != null) && (this.templates != null)) {
        this.callback = callback;
        this.namespaces = [];
        this.result = [];
        this.init();
      }
    }
    Namespacer.prototype.init = function() {
      var self;
      self = this;
      return async.auto({
        checkGroupNamespace: function(callback) {
          return self.checkGroupNamespace(callback);
        },
        checkTemplateNamespaces: function(callback) {
          return self.checkTemplateNamespaces(callback);
        },
        createNamespaces: [
          'checkGroupNamespace', 'checkTemplateNamespaces', function(callback) {
            return self.createNamespaces(callback);
          }
        ]
      }, function(err) {
        if (err != null) {
          return self.callback(err);
        } else {
          return self.callback(null, self.result);
        }
      });
    };
    /*  
    checkGroupNamespace
    Description: Checks group namespace if needed to be splitted
    */
    Namespacer.prototype.checkGroupNamespace = function(callback) {
      var self;
      self = this;
      if (this.groupNamespace.indexOf('.') > 0) {
        self.splitNamespace(self.groupNamespace, true);
        return callback(null);
      } else {
        this.namespaces.push(this.groupNamespace);
        return callback(null);
      }
    };
    /*
      checkTemplateNamespaces
      Description: Checks template namespaces if needed to be splitted
      */
    Namespacer.prototype.checkTemplateNamespaces = function(callback) {
      var counter, next, self, templateName, _i, _len, _ref, _results;
      self = this;
      counter = 0;
      next = function() {
        var arr, i, _ref, _results;
        counter++;
        if (counter === self.templates.length) {
          arr = [];
          _results = [];
          for (i = 0, _ref = self.namespaces.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
            if (!(arr.indexOf(self.namespaces[i]) > 0)) {
              arr.push(self.namespaces[i]);
            }
            _results.push(i === self.namespaces.length - 1 ? (self.namespaces = arr, callback(null)) : void 0);
          }
          return _results;
        }
      };
      _ref = self.templates;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        templateName = _ref[_i];
        _results.push(templateName.indexOf('/') > 0 ? (self.splitNamespace(templateName), next()) : next());
      }
      return _results;
    };
    /*
      createNamespaces
      Description: Prepends required namespace declarations for the browser
      */
    Namespacer.prototype.createNamespaces = function(callback) {
      var g, groupNamespaceLength, next, self, t, _ref, _results;
      self = this;
      next = function() {
        if (!self.skiproot) {
          self.result[0] = 'var ' + self.result[0];
        }
        return callback(null);
      };
      groupNamespaceLength = this.groupNamespace.split('.').length;
      for (g = 0; 0 <= groupNamespaceLength ? g < groupNamespaceLength : g > groupNamespaceLength; 0 <= groupNamespaceLength ? g++ : g--) {
        if (g > 0 || !this.skiproot) {
          self.result.push("" + this.namespaces[g] + " = " + this.namespaces[g] + " || {};");
        }
      }
      if (groupNamespaceLength === this.namespaces.length) {
        return next();
      } else {
        _results = [];
        for (t = groupNamespaceLength, _ref = this.namespaces.length; groupNamespaceLength <= _ref ? t < _ref : t > _ref; groupNamespaceLength <= _ref ? t++ : t--) {
          self.result.push("" + this.groupNamespace + "." + this.namespaces[t] + " = " + this.groupNamespace + "." + this.namespaces[t] + " || {};");
          _results.push(t === this.namespaces.length - 1 ? next() : void 0);
        }
        return _results;
      }
    };
    /*
      splitNamespace(name, isGroupNamespace)
      Description: Helper, splits each string and adds it into the 'namespaces' array for later processing
    
      Params:
        name: Namespace name
        isGroupNamespace: boolean value to determine if the current iteration is for group
      */
    Namespacer.prototype.splitNamespace = function(name, isGroupNamespace) {
      var arr, i, max, str, _results;
      arr = name.split(/\.|\//);
      if (isGroupNamespace) {
        max = arr.length;
      } else {
        max = arr.length - 1;
      }
      this.namespaces.push(arr[0]);
      str = arr[0];
      _results = [];
      for (i = 1; 1 <= max ? i < max : i > max; 1 <= max ? i++ : i--) {
        str += "." + arr[i];
        _results.push(this.namespaces.push(str));
      }
      return _results;
    };
    return Namespacer;
  })();
  module.exports = function(settings, callback) {
    return new Namespacer(settings, callback);
  };
}).call(this);
