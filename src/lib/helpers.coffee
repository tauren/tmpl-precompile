###
extend(main, sub)
Description: Extends properties of sub object to main object
###

extend = (main, sub) ->
  for prop of sub
    main[prop] = sub[prop] if sub[prop]?
  main
  
  
module.exports = 
  extend: extend