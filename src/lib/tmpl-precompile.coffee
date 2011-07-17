version = [0,1,3]

jade = require 'jade'
fs = require 'fs'
util = require 'util'
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify
cwd = ''
namespace = require('./namespace')

###
compileTemplate(template, group)
Description: Runs Jade's compile function 
 
Params:
  template: Template file name
  group: Template group settings
###

compileTemplate = (template, group) ->
  templateNamespace = template.replace(/\//g, '.') # Replaces '/' with '.'
  
  console.log "Compiling #{group.namespace}.#{templateNamespace} from #{group.source+template}"
  
  data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8')
  source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {compileDebug: group.compileDebug || false, inline: group.inline || false}) + ';\n'

###
uglifyOutput(output)
Description: Minifies generated JS with uglifyJS
###

uglifyOutput = (output) ->
	ast = jsp.parse output  # parse code and get the initial AST
	ast = pro.ast_mangle ast # get a new AST with mangled names
	ast = pro.ast_squeeze ast # get an AST with compression optimizations
	pro.gen_code ast # compressed code here

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


###
compile(group, namespaces)
Description: Starts compiling the templates and outputs file

Params: 
  group: The 'group' object to process
  namespaces: Buffer string, the result of namespace checking
###

compile = (group, namespaces) ->
  # Get Jade helpers
  attrs = jade.runtime.attrs.toString()
  escape = jade.runtime.escape.toString()
  helpers = """
    #{attrs}
    #{escape}
    var jade = {
      attrs: attrs,
      escape: escape
    };\n
  """
  
  buf = namespaces || ''
  for template in group.templates
	  buf += optimizeOutput group, compileTemplate(template, group).toString()

  if group.inline isnt true
    buf = helpers + buf;
  
  buf = uglifyOutput buf if group.uglify
  
  console.log 'Saving ' + (if group.uglify then 'and Uglifying ' else '' ) + group.output
  fs.writeFileSync cwd + group.output, buf

###
precompile(group, namespaces)
Description: Main precompile function

Params: 
  settings(object): Settings object for tmpl-precompile. Available options include:
    "uglify": Boolean(default:false), whether to minify JS
		"namespace": String(Required), namespace object when including templates to browser
		"source": String(Required), relative path to source directory
		"output": String(Required), relative path to output directory
		"templates": Array(Required), names of templates to be precompiled
    "compileDebug": Boolean(default: false), whether to compile Jade debugging
    "inline": Boolean(default: false), whether to inline Jade runtime functions
    
  dir(string): Main execution directory
###

exports.precompile = (settings,dir) ->
	cwd = dir
	for group in settings.groups
		namespace(group, (err, res) ->
      if err? then console.log err
      else 
        namespaces = res.join('\n') + '\n'
        compile(group, namespaces)
    )