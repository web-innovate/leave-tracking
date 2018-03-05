#!/bin/sh

if [ $GOAL = "FE" ]
then
    echo 'Starting FRONTEND'
    cd frontend &&  yarn start
else
    echo 'Starting BACKEND'
    cd backend  && yarn start
fi
