FROM node:14-alpine3.10 as build-step
RUN apk add --update --no-cache \
      autoconf \
      libtool \
      automake \
      nasm \
      gcc \
      make \
      g++ \
      zlib-dev \
      tzdata \
      build-base \
      ffmpeg

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn run start

EXPOSE 8072
CMD [ "npm", "start" ]
