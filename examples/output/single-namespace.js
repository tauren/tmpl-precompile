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
singleNamespace = singleNamespace || {};
singleNamespace.layout = function anonymous(locals) {
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
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
singleNamespace.root = function anonymous(locals) {
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
