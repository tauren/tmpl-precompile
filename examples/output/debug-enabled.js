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
var debugEnabled = debugEnabled || {};
debugEnabled.layout = function anonymous(locals) {
var __ = { lineno: 1, input: "!!! 5\nhtml\n\thead\n\t\ttitle\n\tbody\n\t\th1 Content goes here\n\t\t#container!= body\n", filename: undefined };
var rethrow = jade.rethrow;
try {
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
__.lineno = 1;
__.lineno = 1;
buf.push('<!DOCTYPE html>');
__.lineno = 3;
buf.push('<html>');
__.lineno = undefined;
__.lineno = 4;
buf.push('<head>');
__.lineno = undefined;
__.lineno = 5;
buf.push('<title>');
__.lineno = undefined;
buf.push('</title>');
buf.push('</head>');
__.lineno = 6;
buf.push('<body>');
__.lineno = undefined;
__.lineno = 6;
buf.push('<h1>');
buf.push('Content goes here');
__.lineno = undefined;
buf.push('</h1>');
__.lineno = 7;
buf.push('<div');
buf.push(attrs({ terse: true, 'id':('container') }));
buf.push('>');
var __val__ = body
buf.push(null == __val__ ? "" : __val__);
__.lineno = undefined;
buf.push('</div>');
buf.push('</body>');
buf.push('</html>');
}
return buf.join("");
} catch (err) {
  rethrow(err, __.input, __.filename, __.lineno);
}
};
debugEnabled.root = function anonymous(locals) {
var __ = { lineno: 1, input: "h2 Hello\np World!", filename: undefined };
var rethrow = jade.rethrow;
try {
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
__.lineno = 1;
__.lineno = 1;
buf.push('<h2>');
buf.push('Hello');
__.lineno = undefined;
buf.push('</h2>');
__.lineno = 2;
buf.push('<p>');
buf.push('World!');
__.lineno = undefined;
buf.push('</p>');
}
return buf.join("");
} catch (err) {
  rethrow(err, __.input, __.filename, __.lineno);
}
};
