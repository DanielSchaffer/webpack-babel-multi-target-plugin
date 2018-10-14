#!/usr/bin/env bash

for dir in ./examples/*/
do
    dir=${dir%*/}
    pushd examples/${dir##*/}
    npm install
    popd
done
