var very = very || {};
very.long = very.long || {};
very.long.namespace = very.long.namespace || {};
very.long.namespace.level1 = very.long.namespace.level1 || {};
very.long.namespace.level1.level2 = very.long.namespace.level1.level2 || {};
very.long.namespace.level1.level2.level3 = very.long.namespace.level1.level2.level3 || {};
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
very.long.namespace.layout = function anonymous(locals) {
var attrs = jade.attrs, escape = jade.escape;
var buf = [];
with (locals || {}) {
var interp;
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
very.long.namespace.root = function anonymous(locals) {
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
very.long.namespace.level1.root = function anonymous(locals) {
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
very.long.namespace.level1.level2.root = function anonymous(locals) {
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
very.long.namespace.level1.level2.level3.root = function anonymous(locals) {
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
