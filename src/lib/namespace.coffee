###
splitNamespace(string, namespaces, callback, isGroupNamespace)
Description: Splits each string and adds it into the 'namespaces' array for later processing
 
Params:
  string: Namespace name
  namespaces: Array to hold all namespaces
  callback: function to perform after done splitting
  isGroupNamespace: boolean value to determine if the current iteration is for group
###

splitNamespace = (string, namespaces, next, isGroupNamespace) ->
  arr = string.split(/\.|\//) # Split template into array

  # Determine the maximum depth to compile
  if isGroupNamespace then max = arr.length else max = arr.length - 1

  namespaces.push arr[0] # Push base namespace
  
  str = arr[0] # Set base namespace
  
  for i in [1...max]
    str += ".#{arr[i]}" # Appends additional levels of namespacing
    namespaces.push str

  if next? then next(namespaces) # Return namespaces array

###  
checkGroupNamespace(group, namespaces)
Description: Checks group namespace if needed to be splitted

Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

checkGroupNamespace = (group, namespaces, callback) ->
  next = (namespaces) ->
    checkTemplateNamespaces(group, namespaces, callback)
  
  if group.namespace.indexOf('.') > 0 # Checks if needed to split namespace
    splitNamespace(group.namespace, namespaces, next, true)
  else
    namespaces.push(group.namespace)
    next(namespaces)


###
checkTemplateNamespaces(group, namespaces)
Description: Checks template namespaces if needed to be splitted
 
Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

checkTemplateNamespaces = (group, namespaces, callback) ->
  counter = 0
  
  next = (namespaces) ->
    counter++ # Counter to determine when iteration is done
    if counter is group.templates.length
      if namespaces.length > 0 then createNamespaces(group, namespaces, callback) 
      else callback(null, group, namespaces)
  
  # Iterate through the templates
  for template in group.templates
    if template.indexOf('/') > 0  # Checks if needed to split namespace
      splitNamespace(template, namespaces, callback)
    else next(namespaces)


###
createNamespaces(group, namespaces)
Description: Prepends required namespace declarations for the browser

Params:
  group: Template group settings
  namespaces: Array to hold all namespaces
###

createNamespaces = (group, namespaces, callback) ->
  nameSpaceBuf = ''
  
  # Get the maximum index for group namespaces in the namespaces array
  groupNamespaceLength = (group.namespace).split('.').length  
  
  # Next action
  next = ->
    namespaces = 'var ' + nameSpaceBuf # Converts the array object into a string to pass to compile()
    callback(null, group, namespaces)
  
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
        
exports.get = (group, callback) ->
  namespaces = []
  checkGroupNamespace(group, namespaces, callback)
