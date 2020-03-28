FROM node:12

# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN groupadd -r krypton && useradd -r -g krypton krypton

#Set args
ARG MONGODB_URI
ARG ALLOWED_ORIGINS

#Set MONGODB_URI as mandatory
RUN test -n "$MONGODB_URI"

# Set environment variable
ENV PORT=80
ENV MONGODB_URI $MONGODB_URI
ENV ALLOWED_ORIGINS $ALLOWED_ORIGINS
ENV VOLUME /krypton-vol
ENV KEYS_PATH /krypton-vol

# Create app directory
WORKDIR /usr/src/app

# Install Krypton Authentication dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build Krypton Authentication
RUN npm run build

# Set volume
RUN mkdir /krypton && chown -R krypton:krypton /krypton
VOLUME /krypton

# Bundle Krypton Authentication source
COPY . .

EXPOSE 80
CMD ["node lib/index.js"]