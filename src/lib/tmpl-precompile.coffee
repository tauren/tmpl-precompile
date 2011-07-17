version = [0,1,3]

jade = require 'jade'
fs = require 'fs'
path = require 'path'
util = require 'util'
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify
sys = require 'sys'

# Module requires
Namespacer = require './namespace'
{extractFunction, optimizeOutput} = require './optimize'
{extend} = require './helpers'

# Global settings
globalSettings = {
  relative: true
  dir: (->
    if module.parent.id is '.'
      process.cwd()
    else
      d = module.parent.id.split('/')
      d[0...d.length-1].join('/')
  )()
}

###
Precompiler(groupSettings)
Description: Creates a Precompiler instance for executing precompiling work

settings: 
  "uglify": Boolean(default:false), whether to minify JS
	"namespace": String(Required), namespace object when including templates to browser
	"source": String(Required), relative path to source directory
	"output": String, relative path to output directory
	"templates": Array(Required), names of templates to be precompiled
  "compileDebug": Boolean(default: false), whether to compile Jade debugging
  "inline": Boolean(default: false), whether to inline Jade runtime functions

function callback(err, res) {}
(Optional) For Javascript API. If specified "res" will be the String of compiled templates 
of this group.

Note: Either one or both of "callback"/"output" must be present, or there will be no output
channel and the module will throw an error. 
###

class Precompiler
  constructor: (groupSettings, callback) ->
    @settings = groupSettings
    @callback = callback
    
    if @settings.source
      @settings.source = path.normalize(globalSettings.dir + '/' + @settings.source)
    else
      throw 'ERR: No source directory defined for ' + groupSettings.namespace
      
    if @settings.output
      @settings.output = path.normalize(globalSettings.dir + '/' + @settings.output)
    else
      unless @callback?
        throw 'ERR: No callback or output directory defined for ' + groupSettings.namespace
      
    self = @
    
    Namespacer(@settings, (err, res) ->
      if err? then throw err
      else 
        self.namespaces = res.join('\n') + '\n'
    )
    
  ###
  compile(group, namespaces)
  Description: Starts compiling the templates and outputs file

  Params: 
    group: The 'group' object to process
    namespaces: Buffer string, the result of namespace checking
  ###

  compile : ->
    {templates, namespaces, inline, helpers, uglify, output} = @settings
    buf = []
    
    buf.push @namespaces if namespaces isnt false
    
    buf.push @helpers() if helpers isnt false and inline isnt true
      
    for template in @settings.templates
  	  #buf += optimizeOutput @settings, @compileTemplate(template).toString()
  	  buf.push @compileTemplate(template).toString()
    
    buf = buf.join("")
    
    buf = @uglifyOutput buf if uglify isnt false
    
    if @callback? then @callback(null, buf)
    
    if output?
      console.log 'Saving ' + (if uglify isnt false then 'and Uglifying ' else '' ) + output
      fs.writeFileSync @settings.output, buf

  ###
  compileTemplate(template, group)
  Description: Runs Jade's compile function 
 
  Params:
    template: Template file name
    group: Template group settings
  ###

  compileTemplate : (template) ->
    {source, namespace, compileDebug, inline} = @settings
    
    templateNamespace = template.replace(/\//g, '.') # Replaces '/' with '.'
  
    if @settings.verbose
      console.log "Compiling #{namespace}.#{templateNamespace} from #{source+template}"
    
    sourceFile = source + template + '.jade'
    data = fs.readFileSync(sourceFile, 'utf8')
    
    namespace + '.' + templateNamespace + ' = ' + jade.compile(data, {compileDebug: compileDebug || false, inline: inline || false}) + ';\n'
    

  helpers: ->
    # Get Jade helpers
    attrs = jade.runtime.attrs.toString()
    escape = jade.runtime.escape.toString()
    rethrow = jade.runtime.rethrow.toString()
    
    if @settings.compileDebug
      obj = """
        var jade = {
          attrs: attrs,
          escape: escape,
          rethrow: rethrow
        };\n
      """
      [attrs, escape, rethrow, obj].join('\n')
    else
      obj = """
        var jade = {
          attrs: attrs,
          escape: escape
        };\n
      """
      [attrs, escape, obj].join('\n')
      
  ###
  uglifyOutput(output)
  Description: Minifies generated JS with uglifyJS
  ###

  uglifyOutput : (output) ->
  	ast = jsp.parse output  # parse code and get the initial AST
  	ast = pro.ast_mangle ast # get a new AST with mangled names
  	ast = pro.ast_squeeze ast # get an AST with compression optimizations
  	pro.gen_code ast # compressed code here

###
---Module exports---

precompile(group, namespaces)
Description: Main precompile function

Params: 
  settings(object): Global settings object for tmpl-precompile
    "verbose": Boolean(default:false), if should output compile info on console
    "relative": Boolean(default:true), if paths to each template is relative to settings file
  dir(string): Main execution directory
###

module.exports.precompile = (settings,dir) ->
	extend(globalSettings, settings)
	globalSettings.dir = dir
	
	groups = []
	
	for groupSettings in settings.groups
	  groups.push new Precompiler(groupSettings)
  
  for group in groups
    group.compile()
    
module.exports.Precompiler = Precompiler