jsp = require("uglify-js").parser

extractFunction = (name, buf) ->
  # TODO: Implement

  # Find named function in buf

  # Extact named function

  # Remove named function from buf

  # Return extracted function

  # Just return empty string for now
  ''

optimizeOutput = (group, buf) ->
  # Default setting for optimize is true
  group.optimize = true unless group.optimize = false
  # Default setting for helpers is true
  group.helpers = true unless group.helpers = false

  # TODO: Only parse buffer once, regardless if we are optimizing and/or uglifying
  ast = jsp.parse buf  # parse code and get the initial AST
  if group.debug
    # View the AST
    console.log util.inspect( ast, false, 10)

  # TODO: Uncomment the following and make it work
  # Need to update it to use the uglify AST

  # # Post-process jade's compiled templates to remove redundant and debug code
  # if group.optimize

  #   # Prepare output array
  #   out = []

  #   # Create a closure
  #   out.push 'function(){\n'

  #   # Extract functions from compiled script, buf is modified to remove functions
  #   oldRethrow = extractFunction("rethrow",buf);
  #   attr = extractFunction("attr",buf);
  #   escape = extractFunction("escape",buf);

  #   # Redefine and simplify rethrow function
  #   rethrow = 'function rethrow=function(e){e.message="Optimized template. See https://github.com/tauren/tmpl-precompile\n\n"+e.message;throw e;};';

  #   # Check if we should include jade's helper functions in the output file
  #   if group.helpers
  #     out.push rethrow
  #     out.push attr
  #     out.push escape

  #   out.push buf
  #   out.push '}();\n'

  #   buf = out.join ''

  # Return buf
  buf

module.exports = 
  extractFunction: extractFunction
  optimizeOutput: optimizeOutput