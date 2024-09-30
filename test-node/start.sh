#!/bin/bash

set -e

if [ ! -d .vcity ]; then
    mkdir .vcity
    chown 1000:1000 .vcity
fi

docker-compose up -d