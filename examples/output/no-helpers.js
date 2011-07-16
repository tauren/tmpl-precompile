var noHelpers = noHelpers || {};
noHelpers.layout = function anonymous(locals) {
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
noHelpers.root = function anonymous(locals) {
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
