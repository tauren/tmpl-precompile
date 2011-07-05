#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR

echo "Compiling files in $BASEDIR/lib"
coffee -b -o lib/ -c lib/

echo "Compiling files in $BASEDIR/bin"
coffee -b -o bin/ -c bin/ 

echo "Copying bin/tmpl-precompile.js to bin/tmpl-precompile"
cp bin/tmpl-precompile.js bin/tmpl-precompile
