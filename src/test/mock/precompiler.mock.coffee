async = require 'async'
fs = require 'fs'
path = require 'path'

mockData = 
  defaultSettings:
    namespace: 'defaultSettings'
    templates: ['tmpl1', 'tmpl2']
    source: 'stubs/templates/'
    output: 'stubs/output/templates.js'
  noMinify:
    namespace: 'noMinify'
    templates: ['tmpl1', 'tmpl2']
    source: 'stubs/templates/'
    output: 'stubs/output/templates.js'
    minify: false

tmpl1 = 'p Hello world!'
tmpl2 = 'p Good day!'

# Helper to setup stubs
setupStubs = (settings, callback) ->
  {source} = settings

  async.parallel({
    writeTmpl1: (callback) -> fs.writeFile(path.normalize(__dirname + '/../' + source + '/'+'tmpl1.jade'), tmpl1, 'utf8', callback)
    writeTmpl2: (callback) -> fs.writeFile(path.normalize(__dirname + '/../' + source + '/'+'tmpl2.jade'), tmpl2, 'utf8', callback)    
  }, (err) ->
    if err? then console.log(err)
    else callback(null)
  )

# Helper to teardown stubs
teardownStubs = (settings, callback) ->
  {source} = settings
  
  async.parallel([
    ((callback) -> fs.unlink(path.normalize(source + '/' + 'tmpl1.jade'), callback))
    ((callback) -> fs.unlink(path.normalize(source + '/' + 'tmpl2.jade'), callback))
  ], (err) ->
    if err? then throw err
    else callback(null)
  )

module.exports = 
  mockData : mockData
  setupStubs: setupStubs
  teardownStubs: teardownStubs