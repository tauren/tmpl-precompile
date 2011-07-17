function attrs(obj){
  var buf = []
    , terse = obj.terse;
  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;
  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];
      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + escape(val.join(' ')) + '"');
      } else {
        buf.push(key + '="' + escape(val) + '"');
      }
    }
  }
  return buf.join(' ');
}
function escape(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
var jade = {
  attrs: attrs,
  escape: escape
};
<<<<<<< .merge_file_NuBKJq
var templates = templates || {};
templates.level1 = templates.level1 || {};
templates.level1.level2 = templates.level1.level2 || {};
templates.level1 = templates.level1 || {};
templates.level1.level2 = templates.level1.level2 || {};
templates.level1.level2.level3 = templates.level1.level2.level3 || {};
templates.layout = function anonymous(locals) {
=======
var NS = NS || {};
NS.templates = NS.templates || {};
NS.templates.level1 = NS.templates.level1 || {};
NS.templates.level1.level2 = NS.templates.level1.level2 || {};
NS.templates.level1.level2.level3 = NS.templates.level1.level2.level3 || {};
NS.templates.layout = function anonymous(locals) {
>>>>>>> .merge_file_rtwbUD
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
<<<<<<< .merge_file_NuBKJq
buf.push('<div');
buf.push(attrs({ 'id':('content') }));
buf.push('>');
buf.push('<h1>');
buf.push('Hello world!');
buf.push('</h1>');
buf.push('</div>');
}
return buf.join("");
};
templates.root = function anonymous(locals) {
=======
buf.push('<!DOCTYPE html>');
buf.push('<html>');
buf.push('<head>');
buf.push('<title>');
buf.push('</title>');
buf.push('</head>');
buf.push('<body>');
buf.push('<h1>');
buf.push('Content goes here');
buf.push('</h1>');
buf.push('<div');
buf.push(attrs({ terse: true, 'id':('container') }));
buf.push('>');
var __val__ = body
buf.push(null == __val__ ? "" : __val__);
buf.push('</div>');
buf.push('</body>');
buf.push('</html>');
}
return buf.join("");
};
NS.templates.root = function anonymous(locals) {
>>>>>>> .merge_file_rtwbUD
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h2>');
buf.push('Hello');
buf.push('</h2>');
buf.push('<p>');
buf.push('World!');
buf.push('</p>');
}
return buf.join("");
};
<<<<<<< .merge_file_NuBKJq
templates.level1.root = function anonymous(locals) {
=======
NS.templates.level1.root = function anonymous(locals) {
>>>>>>> .merge_file_rtwbUD
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h2>');
buf.push('Hello');
buf.push('</h2>');
buf.push('<p>');
buf.push('World!');
buf.push('</p>');
}
return buf.join("");
};
<<<<<<< .merge_file_NuBKJq
templates.level1.level2.root = function anonymous(locals) {
=======
NS.templates.level1.level2.root = function anonymous(locals) {
>>>>>>> .merge_file_rtwbUD
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h2>');
buf.push('Hello');
buf.push('</h2>');
buf.push('<p>');
buf.push('World!');
buf.push('</p>');
}
return buf.join("");
};
<<<<<<< .merge_file_NuBKJq
templates.level1.level2.level3.root = function anonymous(locals) {
=======
NS.templates.level1.level2.level3.root = function anonymous(locals) {
>>>>>>> .merge_file_rtwbUD
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h2>');
buf.push('Hello');
buf.push('</h2>');
buf.push('<p>');
buf.push('World!');
buf.push('</p>');
}
return buf.join("");
};
