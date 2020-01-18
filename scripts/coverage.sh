#!/usr/bin/env bash

if [ "$USE_BUIDLER" = true ]; then
  npx buidler coverage --network coverage
else
  npx truffle run coverage --network coverage
fi

cat coverage/lcov.info | coveralls
