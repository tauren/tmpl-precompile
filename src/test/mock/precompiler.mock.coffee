async = require 'async'
fs = require 'fs'

mockData = 
  defaultSettings:
    namespace: 'defaultSettings'
    templates: ['tmpl1', 'tmpl2']
    source: 'stubs/templates/'
    output: 'stubs/output/templates.js'


tmpl1 = 'p Hello!'
tmpl2 = 'p World!'

# Helper to setup stubs
setupStubs = (settings, callback) ->
  {source} = settings

  async.parallel({
    writeTmpl1: (callback) -> fs.writeFile(__dirname + '/../' + source + '/'+'tmpl1.jade', tmpl1, 'utf8', callback)
    writeTmpl2: (callback) -> fs.writeFile(__dirname + '/../' + source + '/'+'tmpl2.jade', tmpl2, 'utf8', callback)    
  }, (err) ->
    if err? then console.log(err)
    else callback(null)
  )

# Helper to teardown stubs
teardownStubs = (settings, callback) ->
  {source} = settings
  
  async.parallel([
    ((callback) -> fs.unlink(__dirname + '/../' + source + '/' + 'tmpl1.jade', callback))
    ((callback) -> fs.unlink(__dirname + '/../' + source + '/' + 'tmpl2.jade', callback))
  ], (err) ->
    if err? then throw err
    else callback(null)
  )

module.exports = 
  mockData : mockData
  setupStubs: setupStubs
  teardownStubs: teardownStubs