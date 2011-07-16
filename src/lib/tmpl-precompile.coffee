version = [0,1,3]

jade = require 'jade'
fs = require 'fs'
util = require 'util'
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify
cwd = ''

###
compileTemplate(template, group)
Description: Runs Jade's compile function 
 
Params:
  template: Template file name
  group: Template group settings
###

compileTemplate = (template, group) ->
  console.log "Compiling #{group.namespace}.#{templateNamespace} from #{group.source+template}" 
  templateNamespace = template.replace(/\//g, '.') # Replaces '/' with '.'
  data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8')
  source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {compileDebug: group.compileDebug || false, inline: group.inline || false}) + ';\n'
  
  
uglifyOutput = (output) ->
	ast = jsp.parse output  # parse code and get the initial AST
	ast = pro.ast_mangle ast # get a new AST with mangled names
	ast = pro.ast_squeeze ast # get an AST with compression optimizations
	pro.gen_code ast # compressed code here


###
splitNamespace(string, namespaces, callback, isGroupNamespace)
Description: Splits each string and adds it into the 'namespaces' array for later processing
 
Params:
  string: Namespace name
  namespaces: Array to hold all namespaces
  callback: function to perform after done splitting
  isGroupNamespace: boolean value to determine if the current iteration is for group
###

splitNamespace = (string, namespaces, callback, isGroupNamespace) ->
  arr = string.split(/\.|\//) # Split template into array
  
  # Determine the maximum depth to compile
  if isGroupNamespace then max = arr.length else max = arr.length - 1

  namespaces.push arr[0] # Push base namespace
  
  str = arr[0] # Set base namespace
  
  for i in [1...max]
    str += ".#{arr[i]}" # Appends additional levels of namespacing
    namespaces.push str

  if callback? then callback(namespaces) # Return namespaces array

###  
checkGroupNamespace(group, namespaces)
Description: Checks group namespace if needed to be splitted

Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

checkGroupNamespace = (group, namespaces) ->
  callback = (namespaces) ->
    checkTemplateNamespaces(group, namespaces)
  
  if group.namespace.indexOf('.') > 0 # Checks if needed to split namespace
    splitNamespace(group.namespace, namespaces, callback, true)
  else
    namespaces.push(group.namespace)
    callback(namespaces)


###
checkTemplateNamespaces(group, namespaces)
Description: Checks template namespaces if needed to be splitted
 
Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

checkTemplateNamespaces = (group, namespaces) ->
  counter = 0
  callback = (namespaces) ->
    counter++ # Counter to determine when iteration is done
    if counter is group.templates.length
      if namespaces.length > 0 then createNamespaces(group, namespaces) 
      else compile(group, namespaces)
  
  # Iterate through the templates
  for template in group.templates
    if template.indexOf('/') > 0  # Checks if needed to split namespace
      splitNamespace(template, namespaces, callback)
    else callback(namespaces)


###
createNamespaces(group, namespaces)
Description: Prepends required namespace declarations for the browser

Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

createNamespaces = (group, namespaces) ->
  nameSpaceBuf = ''
  
  # Get the maximum index for group namespaces in the namespaces array
  groupNamespaceLength = (group.namespace).split('.').length  
  
  # Callback
  next = ->
    namespaces = nameSpaceBuf # Converts the array object into a string to pass to compile()
    compile(group, namespaces)
  
  # Appends the group namespace declarations
  for g in [0...groupNamespaceLength]
    nameSpaceBuf += "#{namespaces[g]} = #{namespaces[g]} || {};\n"
    
  # Appends the template namespace declarations
  if groupNamespaceLength is namespaces.length
    next()
  else 
    for t in [groupNamespaceLength...namespaces.length]
      if namespaces[t] isnt namespaces[t+1] # Check to remove duplicates
        nameSpaceBuf += "#{group.namespace}.#{namespaces[t]} = #{group.namespace}.#{namespaces[t]} || {};\n"
      if t is namespaces.length-1
        next()


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
  group.optimize = true unless group.optimize is false
  # Default setting for helpers is true
  group.helpers = true unless group.helpers is false

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
  
  # Add namespacing
  buf = namespaces || ''
  for template in group.templates
	  buf += optimizeOutput group, compileTemplate(template, group).toString()

  # Add helpers
  if group.helpers isnt false
    unless group.inline
      buf = helpers + buf;
  
  # Minify file
  buf = uglifyOutput buf unless group.uglify is false
  
  # Write files
  console.log 'Saving ' + (if group.uglify then 'and Uglifying ' else '' ) + group.output
  fs.writeFileSync cwd + group.output, buf

buildGroup = (group) ->
  namespaces = []
  checkGroupNamespace(group, namespaces)

###
precompile(group, namespaces)
Description: Main precompile function

Params: 
  settings(object): Settings object for tmpl-precompile. Available options include:
		"namespace": String(Required), namespace object when including templates to browser
		"source": String(Required), relative path to source directory
		"output": String(Required), relative path to output directory
		"templates": Array(Required), names of templates to be precompiled
    "compileDebug": Boolean(default: false), whether to include debugging for templates
    "uglify": Boolean(default:false), whether to minify JS
    "helpers": Boolean(default: true), whether to include helpers in compiled file
    "inline": Boolean(default: false), whether to include runtime functions inline
    
  dir(string): Main execution directory
###

exports.precompile = (settings,dir) ->
	cwd = dir
	for group in settings.groups
		buildGroup group