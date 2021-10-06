#!/bin/bash

yarn config set cache-folder /usr/src/app/.docker/.yarn-cache --global

cd /usr/src/app
if [ ! -f '.env' ]; then
  cp .env.example .env
fi

yarn
yarn prisma:migrate:init
yarn dev
