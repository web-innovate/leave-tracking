#!/bin/sh

if [ $GOAL = "FE" ]
then
    echo 'Starting FRONTEND'
    cd frontend && npm start
else
    echo 'Starting BACKEND'
    cd backend && npm run build && node dist/index.js
fi
