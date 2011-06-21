var buildGroup, compileTemplate, cwd, fs, jade, jsp, pro, uglifyOutput, version;
version = [0, 1, 0];
fs = require('fs');
jade = require('jade');
jsp = require("uglify-js").parser;
pro = require("uglify-js").uglify;
cwd = '';
compileTemplate = function(template, group) {
  var data, source;
  console.log('Compiling ' + group.namespace + '.' + template + ' from ' + group.source + template + '.jade');
  data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8');
  return source = group.namespace + '.' + template + ' = ' + jade.compile(data) + ';';
};
uglifyOutput = function(output) {
  var ast;
  ast = jsp.parse(output);
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  return pro.gen_code(ast);
};
buildGroup = function(group) {
  var buf, template, _i, _len, _ref;
  buf = '';
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