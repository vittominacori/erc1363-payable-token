#!/usr/bin/env bash

npx truffle run coverage --network coverage

cat coverage/lcov.info | coveralls
