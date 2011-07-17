<<<<<<< .merge_file_KQIzvh
function escape(a){return String(a).replace(/&(?!\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function attrs(a){var b=[],c=a.terse;delete a.terse;var d=Object.keys(a),e=d.length;if(e){b.push("");for(var f=0;f<e;++f){var g=d[f],h=a[g];"boolean"==typeof h||null==h?h&&(c?b.push(g):b.push(g+'="'+g+'"')):"class"==g&&Array.isArray(h)?b.push(g+'="'+escape(h.join(" "))+'"'):b.push(g+'="'+escape(h)+'"')}}return b.join(" ")}var jade={attrs:attrs,escape:escape},uglified=uglified||{};uglified.level1=uglified.level1||{},uglified.level1.level2=uglified.level1.level2||{},uglified.level1=uglified.level1||{},uglified.level1.level2=uglified.level1.level2||{},uglified.level1.level2.level3=uglified.level1.level2.level3||{},uglified.layout=function(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<div"),buf.push(attrs({id:"content"})),buf.push(">"),buf.push("<h1>"),buf.push("Hello world!"),buf.push("</h1>"),buf.push("</div>")}return buf.join("")},uglified.root=function(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<h2>"),buf.push("Hello"),buf.push("</h2>"),buf.push("<p>"),buf.push("World!"),buf.push("</p>")}return buf.join("")},uglified.level1.root=function(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<h2>"),buf.push("Hello"),buf.push("</h2>"),buf.push("<p>"),buf.push("World!"),buf.push("</p>")}return buf.join("")},uglified.level1.level2.root=function(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<h2>"),buf.push("Hello"),buf.push("</h2>"),buf.push("<p>"),buf.push("World!"),buf.push("</p>")}return buf.join("")},uglified.level1.level2.level3.root=function(locals){var attrs=jade.attrs,escape=jade.escape,buf=[];with(locals||{}){var interp;buf.push("<h2>"),buf.push("Hello"),buf.push("</h2>"),buf.push("<p>"),buf.push("World!"),buf.push("</p>")}return buf.join("")}
=======
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
var NS = NS || {};
NS.uglified = NS.uglified || {};
NS.uglified.level1 = NS.uglified.level1 || {};
NS.uglified.level1.level2 = NS.uglified.level1.level2 || {};
NS.uglified.level1.level2.level3 = NS.uglified.level1.level2.level3 || {};
NS.uglified.layout = function anonymous(locals) {
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
NS.uglified.root = function anonymous(locals) {
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
NS.uglified.level1.root = function anonymous(locals) {
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
NS.uglified.level1.level2.root = function anonymous(locals) {
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
NS.uglified.level1.level2.level3.root = function anonymous(locals) {
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
>>>>>>> .merge_file_HR8Hs6
