FROM node:10

LABEL maintainer="Bogdan Livadariu <bogdan.livadariu@gmail.com>"

ENV NODE_ENV=development
ENV PORT=3000
ENV API_URL=http://localhost:4040/api/

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install
RUN npm install -g aurelia-cli

RUN echo '#!/bin/sh \n\
au build --env prod --api_url $API_URL && \
node ./server.js' > /start.sh && chmod +x /start.sh

EXPOSE 3000

ENTRYPOINT ["/start.sh"]
