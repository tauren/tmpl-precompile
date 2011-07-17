{spawn, exec} = require 'child_process'
sys = require 'sys'

printOutput = (process) ->
  process.stdout.on 'data', (data) -> sys.print data
  process.stderr.on 'data', (data) -> sys.print data

task 'test', 'Run execution tests for tmpl-precompile', ->
  test = exec 'vows test/*.test.js'
  printOutput(test)

<<<<<<< .merge_file_gH0PcL
task 'compile', 'Compiles lib and bin files', ->
  tasks = exec '''
    echo "Compiling files in $BASEDIR/lib"
    coffee -o lib/ -c lib/
    
    echo "Compiling files in $BASEDIR/bin"
    coffee -b -o bin/ -c bin/ 

    echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
    cp bin/tmpl-precompile.js bin/tmpl-precompile
  '''
  printOutput(tasks)
  
task 'bin', 'Compiles executable', ->
=======
task 'examples', 'Build examples', ->
  examples = exec 'bin/tmpl-precompile examples/tmpl-precompile.json'
  printOutput(examples)

task 'compile', 'Compiles project', ->
>>>>>>> .merge_file_62BrSf
  tasks = exec '''
    echo "Compiling files in $BASEDIR/bin"
    coffee -b -o bin/ -c bin/ 

    echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
    cp bin/tmpl-precompile.js bin/tmpl-precompile
  '''
  
  printOutput(tasks)
  
task 'watch', 'Watches all coffeescript files for changes', ->
  coffee = exec 'coffee -wc -o ./ src/'
  printOutput(coffee)
