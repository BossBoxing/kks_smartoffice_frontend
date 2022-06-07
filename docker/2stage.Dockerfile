# escape=`
# FROM node:12-alpine as builder

FROM node:12-alpine as base

LABEL MAINTAINER="Siritas S <siritas@gmail.com>"

RUN echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf
RUN apk add --update git bash openssh python && \
  rm -rf /var/lib/apt/lists/* && \
  rm /var/cache/apk/*

ENV NPM_CONFIG_LOGLEVEL info
RUN npm install -g @angular/cli@9

FROM base as builder

WORKDIR /source

COPY package*.json ./

ENV NPM_COMFIG_AUDIT=false
ENV NPM_COMFIG_PROGRESS=false
ENV NODE_OPTIONS="--max-old-space-size=8192"

# RUN npm ci --log-level=error --verbose
RUN npm ci --log-level=error

RUN mkdir -p /ng-app && \
    mv node_modules /ng-app/node_modules

WORKDIR /ng-app

COPY . ./

RUN node timestamp.js

RUN npm run build-docker

#RUN npm run fix-ngsw

FROM nginx:stable-alpine as runtime
# FROM registry.gitlab.com/softsquare_ssru/registry/base/nginx:stable-win as runtime

COPY nginx-default.conf  /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist/spa /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

