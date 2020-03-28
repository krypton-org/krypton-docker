# krypton-docker

```bash
docker run -it -p 27017:27017 mongo
git clone git@github.com:krypton-org/krypton-docker.git
cd krypton-docker
docker build --tag krypton-auth .
docker run -it -d --entrypoint mongod --hostname MONGODB --name=MONGODB --net=bridge -p 27017:27017 -p 4000:80 mongo
docker run -it -d -v /usr/share/krypton:/krypton-vol -e  --net container:MONGODB krypton-auth
# Open a browser at localhost:4000 Krypton Authentication is set
```