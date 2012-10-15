async = require 'async'

###
Namespacer(settings, callback)
Description: Creates a Namespacer instance for processing namespace data

settings:
  "namespace": String(Required), namespace object when including templates to browser
  "templates": Array(Required), names of templates to be precompiled
callback: (err, res) ->
###

class Namespacer
  
  ###
  constructor
  Description: Bind settings to object
  ###
  
  constructor: (settings, callback) ->
    
    if settings.namespace? then @groupNamespace = settings.namespace
    else callback('Error: \'namespace\' is not configured')
    
    if settings.templates? then @templates = settings.templates
    else callback('Error: \'templates\' is not configured')
    
    if settings.skiproot? then @skiproot = settings.skiproot

    if @groupNamespace? and @templates?
      @callback = callback
      @namespaces = []
      @result = []
      @init()

  init: ->
    self = @
    
    async.auto({
      checkGroupNamespace: (callback) -> self.checkGroupNamespace(callback)
      checkTemplateNamespaces: (callback) -> self.checkTemplateNamespaces(callback)
      createNamespaces: ['checkGroupNamespace', 'checkTemplateNamespaces', (callback) ->
        self.createNamespaces(callback)
      ]
    }, (err) ->
      if err? then self.callback(err)
      else
        self.callback(null, self.result)
    )
    
  ###  
  checkGroupNamespace
  Description: Checks group namespace if needed to be splitted
  ###

  checkGroupNamespace : (callback) ->
    self = @
    
    # Checks if needed to split namespace
    if @groupNamespace.indexOf('.') > 0
      self.splitNamespace(self.groupNamespace, true)
      callback(null)
    else
      @namespaces.push(@groupNamespace)
      callback(null)
  
  ###
  checkTemplateNamespaces
  Description: Checks template namespaces if needed to be splitted
  ###

  checkTemplateNamespaces : (callback) ->
    self = @
    counter = 0
    
    next = ->
      counter++
      if counter is self.templates.length
        arr = []
        for i in [0...self.namespaces.length]
          unless arr.indexOf(self.namespaces[i]) > 0
            arr.push(self.namespaces[i])
          if i is self.namespaces.length-1
            self.namespaces = arr
            callback(null)
          
    for templateName in self.templates
      if templateName.indexOf('/') > 0
        self.splitNamespace(templateName)
        next()
      else next()
  

  ###
  createNamespaces
  Description: Prepends required namespace declarations for the browser
  ###

  createNamespaces : (callback) ->
    self = @

    next = ->
      if not self.skiproot
        self.result[0] = 'var ' + self.result[0]
      callback(null)

    # Get the maximum index for group namespaces in the namespaces array
    groupNamespaceLength = (@groupNamespace).split('.').length  
  
    # Appends the group namespace declarations
    for g in [0...groupNamespaceLength]
      if g > 0 or not @skiproot 
        self.result.push "window.#{@namespaces[g]} = window.#{@namespaces[g]} || {};"
    
    if groupNamespaceLength is @namespaces.length
      next()
    else 
      for t in [groupNamespaceLength...@namespaces.length]
        self.result.push "#{@groupNamespace}.#{@namespaces[t]} = #{@groupNamespace}.#{@namespaces[t]} || {};"
        if t is @namespaces.length-1
          next()
          
  ###
  splitNamespace(name, isGroupNamespace)
  Description: Helper, splits each string and adds it into the 'namespaces' array for later processing

  Params:
    name: Namespace name
    isGroupNamespace: boolean value to determine if the current iteration is for group
  ###

  splitNamespace: (name, isGroupNamespace) ->
    arr = name.split(/\.|\//) # Split template into array

    # Determine the maximum depth to compile
    if isGroupNamespace then max = arr.length else max = arr.length - 1

    @namespaces.push arr[0] # Push base namespace

    str = arr[0] # Set base namespace

    for i in [1...max]
      str += ".#{arr[i]}" # Appends additional levels of namespacing
      @namespaces.push str

module.exports = (settings, callback) ->
  new Namespacer(settings, callback)