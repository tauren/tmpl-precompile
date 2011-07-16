{spawn, exec} = require 'child_process'
sys = require 'sys'

printOutput = (process) ->
  process.stdout.on 'data', (data) -> sys.print data
  process.stderr.on 'data', (data) -> sys.print data

task 'watch', 'Watches all coffeescript files for changes', ->
  coffee = exec 'coffee -wc -o ./ src/'
  printOutput(coffee)

task 'test', 'Run execution tests for tmpl-precompile', ->
  test = exec 'bin/tmpl-precompile examples/tmpl-precompile.json'
  printOutput(test)

task 'compile', 'Compiles project', ->
  tasks = exec '''
    echo "Compiling files in $BASEDIR/bin"
    coffee -b -o bin/ -c bin/ 

    echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
    cp bin/tmpl-precompile.js bin/tmpl-precompile
  '''
  printOutput(tasks)