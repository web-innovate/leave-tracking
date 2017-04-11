#!/bin/sh

if [ $GOAL = "FE" ]
then
    echo 'Starting FRONTEND'
    cd frontend && ./node_modules/aurelia-cli/bin/aurelia-cli.js build --env dev && node server.js
else
    echo 'Starting BACKEND'
    cd backend && npm start
fi
