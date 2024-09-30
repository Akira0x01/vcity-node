#!/bin/bash

set -e

mkdir .vcity
chown -R $USER:$USER .vcity

docker-compose up -d