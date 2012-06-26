{spawn, exec} = require 'child_process'
util = require 'util'

printOutput = (process) ->
  process.stdout.on 'data', (data) -> util.print data
  process.stderr.on 'data', (data) -> util.print data

task 'test', 'Run execution tests for tmpl-precompile', ->
  test = exec 'vows test/*.test.js'
  printOutput(test)

task 'examples', 'Build examples', ->
  examples = exec 'bin/tmpl-precompile examples/tmpl-precompile.json'
  printOutput(examples)

task 'compile', 'Compiles lib and bin files', ->
  tasks = exec '''
    echo "Compiling files in lib"
    coffee -o ./ -c src/
    
    echo "Compiling files in bin"
    coffee -b -o bin/ -c bin/ 

    echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
    cp bin/tmpl-precompile.js bin/tmpl-precompile
  '''
  printOutput(tasks)
 
task 'bin', 'Compiles executable', ->
  tasks = exec '''
    echo "Compiling files in bin"
    coffee -b -o bin/ -c bin/*.coffee 

    echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
    cp bin/tmpl-precompile.js bin/tmpl-precompile
  '''
  printOutput(tasks)
  
task 'watch', 'Watches all coffeescript files for changes', ->
  coffee = exec 'coffee -wc -o ./ src/'
  printOutput(coffee)
