FROM node:12-alpine

# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
# > By default, the Docker Node image includes a non-root node user
# > that you can use to avoid running your application container as root.
# > We will therefore use the node user’s home directory as the working directory
# > for our application and set them as our user inside the container.
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app

RUN mkdir /krypton-vol && \
    chown -R node:node /krypton-vol

USER node
WORKDIR /home/node/app

COPY --chown=node:node . .
RUN npm install && \
    npm run build && \
    npm prune --production

EXPOSE 5000
CMD ["node", "lib/index.js"]
