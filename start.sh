#!/bin/sh

if [ $GOAL = "FE" ]
then
    echo 'Starting FRONTEND'
    cd frontend && yarn install && yarn start
else
    echo 'Starting BACKEND'
    cd backend && yarn install && yarn start
fi
