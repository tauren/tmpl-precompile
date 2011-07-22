# tmpl-precompile - Template Precompiler

`tmpl-precompile` will process a group of templates and output a javascript file containing
precompiled functions for all templates in the group. 

A primary use case is to send a javascript file containing precompiled templates to a browser. The
template can then be rendered by simply calling a function. The template compiler does not need to 
be included client-side for the templates to render, as the templates have been converted into pure
javascript functions.

Currently the project supports Jade templates, although it will be enhanced to support other
templating solutions.


## Installation

`tmpl-precompile` can be run from a shell command prompt, although it actually runs within node.js. To install, do:
    
    npm install tmpl-precompile -g
    
**NOTE**: `tmpl-precompile` currently uses the [latest version of `jade` at Github](https://github.com/visionmedia/jade/), which is newer than the one in NPM(0.13). If you wish to use `tmpl-precompile` right now, please checkout the latest version of `jade` to `tmpl-precompile`. To do so, please do:
    
    cd /usr/local/lib/node_modules/tmpl-precompile/node_modules
    rm -rf jade
    git clone https://github.com/visionmedia/jade.git


### Command line

By default, `tmpl-precompile` as a command line tool will look for a settings file named `tmpl-precompile.json` in the current directory. This settings file defines which templates should be precompiled and the output javascript file to save them in. To run, simply go to the directory with the file and type

    tmpl-precompile

It is possible to specify a custom settings file as a command line parameter:

    tmpl-precompile settings.json

### Javascript

If you prefer to use Javascript to execute the `tmpl-precompile`, you can do:

    var tmpl-precompile = require('tmpl-precompile');
    tmpl-precompile.precompile(settings[,dir]);
    
* `settings` is the global settings object as you can see below. `
* `dir`(optional) defaults to the directory of the `module.parent` executing `tmpl-precompile`.

A `Precompiler` object is automatically created by `tmpl-precompile` to handle each template group's compilation. If you wish to use the `Precompiler` object by itself, you can do: 

    var Precompiler = require('tmpl-precompile').Precompiler
    var myTemplates = new Precompiler(groupSettings[, callback])
    myTemplates.compile()

* `groupSettings` is an object containing settings for the individual group of templates, which is the same with `settings.groups` below. 
* `callback`(optional) returns `(err, res)`, where `res` is the compiled template output.

**Note**: You have to specify **at least one output channel**, either through the `output` parameter(see below) or `callback` or else there will be no output for your compilation. If you specify the `output` parameter `Precompiler` will always write the compiled templates to the `output` file specified. `callback` will always return the buffer in `res` to be manipulated in your app if you wish. 

## Settings

The settings file defines one or more groups of templates. Each group of templates will be saved
into a separate output file. Each output can be uglified. File paths can be relative to the current
working directory or to the file system root.

Here is an example settings file:

	{
		"relative": true,
		"groups": [
			{
				"uglify": true,
				"inline": false,
				"debug": false,
				"namespace": "NS.uglified",
				"source": "/templates/",
				"output": "/output/uglified.js",
				"templates": [
					"layout",
					"root"
				]
			},
			{
				"uglify": false,
				"inline": true,
				"compileDebug": true,
				"namespace": "NS.templates",
				"source": "/templates/",
				"output": "/output/templates.js",
				"templates": [
					"layout",
					"root"
				]
			}
		]
	}

The example above will process the following jade templates:

    ./templates/layout.jade
    ./templates/root.jade

These templates will be compiled into javascript functions and saved into the following files:

    ./output/uglified.js
    ./output/templates.js

The functions will have the following names:

    NS.uglified.layout
    NS.uglified.root
    NS.templates.layout
    NS.templates.root

### relative

If true, then the source and output paths are relative to the current working directory. If false, 
then source and output are relative to the file system root.

### groups

This must be an array of objects, even if only one group is specified. Each object represents a
group of template files and the options used to process them.

### uglify

If true, then the output file is uglified before saving. If false, the output is not uglified.

### helpers

If `true`, then the post-processing optimizer will include any redundant helper
functions in the output file. This pertains to Jade templates only. If false, then the helper functions
are not included in the output file. You must make sure the helpers are loaded onto the client-side
using some other method or the templates will fail to run. 

This feature is useful if an app needs to load multiple precompiled template files and you don't want to load the same helper functions over and over. Defaults to `true`.

### inline

For `helpers:true`. If `true`, the compiler will include redundant helper functions in every single compiled template. Highly not recommended for client-side as this will significantly increase file size and bloat. Defaults to `false`.

### debug

`tmpl-precompile`'s own debugging functionality. Not yet implemented. 

### environment

NOT YET IMPLEMENTED. Provide a way to specify various environments, such as 'development', 'staging', or
'production' for presets. 

### source

Specifies the directory that contains `*.jade` template files. This directory is relative to the
current working directory if `relative` is true, otherwise the directory should be a fully
qualified path from the root of the file system.

### output

Specifies the location and filename of the javascript file to create. This javascript file will
contain a function for each template in the group. This file path is relative to the current 
working directory if `relative` is true, otherwise the path should be a fully qualified path 
from the root of the file system.

### templates

This must be an array of strings. Each string represents the name of a template. These strings are
used both as file names and as function names. There must be a `*.jade` file with the name specified 
in each string.

## Development

If you make changes to the `bin/tmpl-precompile.coffee` file, you need to recompile it. Also make sure the script is executable:

    cd bin
    coffee -b -c tmpl-precompile.coffee
    mv tmpl-precompile.coffee tmpl-precompile
    chmod 755 lib/tmpl-precompile.js

A `Cakefile` file is provided in the root directory with functions that will compile the coffee scripts and rename the shell script. To execute `Cakefile`s remember to install `coffee-script` as global node module: `npm install coffee-script -g`.

    cake test                 # Run tests for tmpl-precompile
    cake examples             # Build examples
    cake compile              # Compiles lib and bin files
    cake bin                  # Compiles executable
    cake watch                # Watches all coffeescript files for changes