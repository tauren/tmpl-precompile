version = [0,1,0]

jade = require('jade')
fs = require 'fs'
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify
cwd = ''

compileTemplate = (template, group) ->
  templateNamespace = template.replace(/\//g, '.') # Replaces '/' with '.'
  data = fs.readFileSync(cwd + group.source + template + '.jade', 'utf8')
  source = group.namespace + '.' + templateNamespace + ' = ' + jade.compile(data) + ';\n'
  console.log "Compiling #{group.namespace}.#{templateNamespace} from #{group.source+template}"	
  source
  
uglifyOutput = (output) ->
	ast = jsp.parse output  # parse code and get the initial AST
	ast = pro.ast_mangle ast # get a new AST with mangled names
	ast = pro.ast_squeeze ast # get an AST with compression optimizations
	pro.gen_code ast # compressed code here


# splitNamespace(string, namespaces, callback, isGroupNamespace)
# Description: Splits each string and adds it into the 'namespaces' array for later processing
# 
# string: Namespace name
# namespaces: Array to hold all namespaces
# callback: function to perform after done splitting
# isGroupNamespace: boolean value to determine if the current iteration is for group

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
  
  

# checkGroupNamespace(group, namespaces)
# Description: Checks group namespace if needed to be splitted
# 
# group: The 'group' object to process
# namespaces: Array to hold all namespaces
checkGroupNamespace = (group, namespaces) ->
  callback = (namespaces) ->
    checkTemplateNamespaces(group, namespaces)
  
  if group.namespace.indexOf('.') > 0 # Checks if needed to split namespace
    splitNamespace(group.namespace, namespaces, callback, true)
  else
    namespaces.push(group.namespace)
    callback(namespaces)



# checkTemplateNamespaces(group, namespaces)
# Description: Checks template namespaces if needed to be splitted
# 
# group: The 'group' object to process
# namespaces: Array to hold all namespaces
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



# createNamespaces(group, namespaces)
# Description: Prepends required namespace declarations for the browser
# 
# group: The 'group' object to process
# namespaces: Array to hold all namespaces
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



# compile(group, namespaces)
# Description: Starts compiling the templates and outputs file
# 
# group: The 'group' object to process
# namespaces: Buffer string, the result of namespace checking
compile = (group, namespaces) ->
  buf = namespaces || '' # Prepends namespaces declarations
  for template in group.templates
	  buf += compileTemplate(template, group).toString()
  buf = uglifyOutput buf if group.uglify
  console.log 'Saving '+ group.output
  fs.writeFileSync cwd + group.output, buf

buildGroup = (group) ->
  namespaces = []
  checkGroupNamespace(group, namespaces)

exports.precompile = (settings,dir) ->
	cwd = dir
	for group in settings.groups
		buildGroup group