# krypton-docker

### Build

```bash
# Pull the image from Docker Hub
docker pull krypton-org/krypton-auth

# Or build the image locally
git clone git@github.com:krypton-org/krypton-docker.git
cd krypton-docker
docker build -t krypton-org/krypton-auth .
```

### Run

Example setup with a single auth service instance:

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
    --env MONGODB_URI="mongodb://krypton-auth-db:27017/users"
    --publish 5000:5000 \
    krypton-auth

curl localhost:5000
# {"notifications":[{"type":"success","message":"Welcome to GraphQL Auth Service - version 1.1.0"}]}

# Cleanup
docker rm -f krypton-auth
docker rm -f krypton-auth-db
docker network rm krypton-auth-net
```

### Configuration

To specify the configuration, bind a local directory to `/krypton-vol`:

```bash
docker run -d -e "MONGODB_URI=..." -p 5000:5000 -v /my/dir:/krypton-vol krypton-auth
```

**TODO: Document configuration file format.**

### Environement Variables

Name           | Default   | Description
---------------|-----------|------------
MONGODB_URI    | -         | MongoDB URI (`mongodb://host:port/collection`)

