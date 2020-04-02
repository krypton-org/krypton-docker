# krypton-docker

[![Docker Image CI](https://github.com/krypton-org/krypton-docker/workflows/Docker%20Image%20CI/badge.svg)](https://github.com/krypton-org/krypton-docker/actions)
[![Docker Build Status](https://img.shields.io/docker/build/kryptonorg/krypton-auth)](https://hub.docker.com/repository/docker/kryptonorg/krypton-auth/general)

## Quick Start

### Docker Compose

Compose files for various use cases are available in the `compose` folder.
For example to run the `simple.yml` file:
```bash
docker-compose -f compose/simple.yml up
curl localhost:5000
# {"errors":[{"message":"Must provide query string.","type":"BadRequestError"}]}
```

### Docker

Example setup with a single Krypton Authentication instance:

```bash
docker network create krypton-auth-net

docker run \
    --detach \
    --name krypton-auth-db \
    --network krypton-auth-net \
    mongo

docker run \
    --detach \
    --name krypton-auth \
    --network krypton-auth-net \
    --env MONGODB_URI="mongodb://krypton-auth-db:27017/users" \
    --publish 5000:5000 \
    kryptonorg/krypton-auth
```

Test the service:

```bash
curl localhost:5000
# {"errors":[{"message":"Must provide query string.","type":"BadRequestError"}]}
```

To cleanup:

```bash
docker rm -f krypton-auth
docker rm -f krypton-auth-db
docker network rm krypton-auth-net
```

### Configuration

To specify the configuration, bind a local directory to `/krypton-vol`:

```bash
docker run -d -e "MONGODB_URI=..." -p 5000:5000 -v /my/dir:/krypton-vol kryptonorg/krypton-auth
```

**TODO: Document configuration file format.**

### Environement Variables

Name           | Default            | Description
---------------|--------------------|------------
MONGODB_URI    | -                  | MongoDB URI (`mongodb://host:port/collection`)
ALLOWED_ORIGINS| - (all by default) | A space separated list of URLs allowed for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (`http://example1.com http://example2.com`)

### Build

```bash
git clone git@github.com:krypton-org/krypton-docker.git
cd krypton-docker
docker build -t kryptonorg/krypton-auth .
```

An automated build is setup on Docker Hub with the following rules:
- Branch `master` → `kryptonorg/krypton-auth:latest`
- Tag `/^[0-9.]+$/` → `kryptonorg/krypton-auth:{sourceref}` (e.g. `1.2.0` → `kryptonorg/krypton-auth:1.2.0`)

