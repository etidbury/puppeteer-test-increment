# A minimal Docker image with Node and Puppeteer
#
# Based upon:
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
#/usr/local/lib/node_modules
FROM node:10.16.0-slim@sha256:e1a87966f616295140efb069385fabfe9f73a43719b607ed3bc8d057a20e5431

# Switch to root user to install additional software
USER 0

RUN useradd apps \
    && mkdir -p /home/apps \
    && chown -v -R apps:apps /home/apps

RUN apt-get update \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh

ENV NODE_PATH /usr/lib/node_modules

RUN npm config set puppeteer_skip_chromium_download true -g

RUN npm install -g yarn
RUN npm install -g puppeteer

RUN echo $(npm root -g)


RUN chown -R apps:apps $(npm root -g)

## switch back to default user
USER apps

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn --pure-lockfile --no-cache --production --unsafe-perm
RUN mkdir -p /home/apps && cp -a /tmp/node_modules /home/apps

WORKDIR /home/apps
COPY . /home/apps



RUN yarn --no-cache --production --unsafe-perm




CMD yarn start
