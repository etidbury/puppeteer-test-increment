## Custom Dockerfile
FROM consol/ubuntu-xfce-vnc

ENV REFRESHED_AT 2019-07-06
ENV DOCKER_CONTAINER true


# Switch to root user to install additional software
USER 0




RUN echo "LC_ALL=en_US.UTF-8" >> /etc/environment
RUN echo "LANG=en_US.UTF-8" >> /etc/environment
RUN echo "NODE_ENV=production" >> /etc/environment
RUN echo "NODE_PATH=/usr/lib/node_modules" >> /etc/environment



# Require Nodejs dependencies
#todo: remove dups
RUN apt-get update && apt-get clean && apt-get install curl htop git zip nano ncdu build-essential chrpath libssl-dev libxft-dev pkg-config glib2.0-dev libexpat1-dev gobject-introspection python-gi-dev apt-transport-https libgirepository1.0-dev libtiff5-dev libjpeg-turbo8-dev libgsf-1-dev fail2ban nginx -y


#Install Chromium for Puppeteer
RUN apt-get install -y chromium-browser
## Note: Using instead of relying on nodejs dependency puppeteer install script for version control and making sure /usr/bin/chromium-browser path is honoured.



# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install --yes nodejs
RUN node -v
RUN npm -v

RUN useradd apps
#&& mkdir -p /home/apps \
#&& chown -v -R apps:apps /home/apps




RUN npm config set puppeteer_skip_chromium_download true -g

RUN npm install -g yarn

RUN npm install -g puppeteer
RUN npm install -g express
RUN npm install -g body-parser


# Set permissions for global node modules (including globally installed dependencies)
RUN chown -R apps:apps /usr/lib/node_modules

RUN export NODE_PATH=$(npm root -g)
## switch back to default user
USER 1000



WORKDIR /home/apps
#COPY . /home/apps

#RUN chown -R apps:apps /home/apps

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
# ADD package.json /tmp/package.json
# ADD yarn.lock /tmp/yarn.lock
# RUN cd /tmp && yarn --pure-lockfile --no-cache --production --unsafe-perm
# RUN cp -a /tmp/node_modules /home/apps


# RUN yarn --no-cache --production --unsafe-perm

#RUN yarn --pure-lockfile --no-cache --production --unsafe-perm

CMD yarn start