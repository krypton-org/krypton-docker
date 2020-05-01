#!/usr/bin/env bash
pwd

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

docker build . --tag krypton-auth

docker network create krypton-auth-net

docker run \
    --detach \
    --name krypton-auth-db \
    --network krypton-auth-net \
    mongo:latest

docker run \
    --detach \
    --name krypton-auth \
    --network krypton-auth-net \
    --env MONGODB_URI="mongodb://krypton-auth-db:27017/users" \
    --publish 5000:5000 \
    -v "$(pwd)/test":/krypton-vol \
    krypton-auth

sleep 3
curl localhost:5000

docker rm -f krypton-auth
docker rm -f krypton-auth-db
docker network rm krypton-auth-net
