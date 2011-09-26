(function() {
  /*
  extend(main, sub)
  Description: Extends properties of sub object to main object
  */
  var extend;
  extend = function(main, sub) {
    var prop;
    for (prop in sub) {
      if (sub[prop] != null) {
        main[prop] = sub[prop];
      }
    }
    return main;
  };
  module.exports = {
    extend: extend
  };
}).call(this);
