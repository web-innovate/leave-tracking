FROM node:10-alpine

LABEL maintainer="Bogdan Livadariu <bogdan.livadariu@gmail.com>"

ENV NODE_ENV=development
ENV PORT=4040
ENV JWT_SECRET=0a6b944d-d2fb-46fc-a85e-0295c986cd9f
ENV MONGO_HOST=mongodb://localhost:27017/leave_tracker
ENV MONGO_PORT=27017

ENV SMTP_SENDER_EMAIL="Leave Tracking <leave.tracking@my-domain.com>"
ENV SMTP_HOST="smtp.ethereal.email"
ENV SMTP_PORT="587"
ENV SMTP_SECURE="false"
ENV SMTP_USER="uhzdcegtgaxt427t@ethereal.email"
ENV SMTP_PASSWORD="cR48DwNMD3ncEwykrG"

ENV APPROVED_LEAVE_CC_EMAIL="hr@leavetracker.domain"

ENV FE_DOMAIN=http://localhost:3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm install
RUN npm install -g gulp

RUN npm run build

RUN echo '#!/bin/sh \n\
node ./dist/index.js' > /start.sh && chmod +x /start.sh

EXPOSE 4040

ENTRYPOINT ["/start.sh"]
