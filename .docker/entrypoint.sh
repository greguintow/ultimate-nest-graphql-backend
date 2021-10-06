#!/bin/bash

cd /usr/src/app

yarn db:deploy
yarn start:prod
