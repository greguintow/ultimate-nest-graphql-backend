#!/bin/bash

cd /home/node/app

yarn db:deploy
dumb-init node dist/main.js
