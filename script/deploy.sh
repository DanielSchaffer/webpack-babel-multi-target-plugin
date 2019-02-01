#!/usr/bin/env bash

echo npm version $(node -e "console.log(require('./package.json').version.split('-')[0])")
