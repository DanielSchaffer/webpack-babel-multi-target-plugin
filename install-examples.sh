#!/usr/bin/env bash

for dir in ./examples/*/
do
    dir=${dir%*/}
    pushd examples/${dir##*/}
    yarn --offline
    popd
done
