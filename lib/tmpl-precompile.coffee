version = [0,1,0]

fs = require 'fs'
jade = require 'jade'
jsp = require("uglify-js").parser
pro = require("uglify-js").uglify
cwd = ''

compileTemplate = (template, group) ->
	console.log 'Compiling '+ group.namespace + '.' + template + ' from ' + 
		group.source + template + '.jade'
	data = fs.readFileSync cwd + group.source + template + '.jade', 'utf8'
	source = group.namespace + '.' + template + ' = ' + jade.compile(data) + ';'

uglifyOutput = (output) ->
	ast = jsp.parse output  # parse code and get the initial AST
	ast = pro.ast_mangle ast # get a new AST with mangled names
	ast = pro.ast_squeeze ast # get an AST with compression optimizations
	pro.gen_code ast # compressed code here
 
buildGroup = (group) ->
	buf = ''
	for template in group.templates
		buf += compileTemplate(template, group).toString() 
	if group.uglify
		console.log 'Saving and Uglifying '+ group.output
		buf = uglifyOutput buf 
	else
		console.log 'Saving '+ group.output
	fs.writeFileSync cwd + group.output, buf

exports.precompile = (settings,dir) ->
	console.log(settings)
	cwd = dir
	for group in settings.groups
		buildGroup group
